import os

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException

from databases import Sessionlocal
from models.conversation import Conversation, Message
from models.messagePayload import MessageRequest


def _get_bedrock_client():
    region = os.getenv("AWS_REGION")
    if not region:
        raise RuntimeError("AWS_REGION is not configured in .env")

    bearer_token = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
    if bearer_token:
        os.environ["AWS_BEARER_TOKEN_BEDROCK"] = bearer_token

    return boto3.client(
        service_name="bedrock-runtime",
        region_name=region,
    )


def _call_bedrock(messages: list[dict]) -> str:
    model_id = os.getenv("MODEL_ID")
    if not model_id:
        raise RuntimeError("MODEL_ID is not configured in .env")

    client = _get_bedrock_client()

    try:
        response = client.converse(
            modelId=model_id,
            messages=messages,
        )
    except (BotoCoreError, ClientError) as exc:
        raise RuntimeError(f"Bedrock converse failed: {exc}") from exc

    return response["output"]["message"]["content"][0]["text"]


def send_message(conversation_id: int, request: MessageRequest, user_id: int) -> dict:
    db = Sessionlocal()

    # Verify conversation exists and belongs to the user
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == user_id,
    ).first()

    if conversation is None:
        db.close()
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Load prior messages to build history context
    prior_messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    # Build Bedrock messages list: history + new user message
    bedrock_messages = [
        {
            "role": msg.role,
            "content": [{"text": msg.content}],
        }
        for msg in prior_messages
    ]
    bedrock_messages.append({
        "role": "user",
        "content": [{"text": request.content}],
    })

    # Call Bedrock with full conversation history
    assistant_reply = _call_bedrock(bedrock_messages)

    # Persist user message
    user_message = Message(
        conversation_id=conversation_id,
        role="user",
        content=request.content,
    )
    db.add(user_message)

    # Persist assistant message
    assistant_message = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=assistant_reply,
    )
    db.add(assistant_message)

    db.commit()
    db.refresh(user_message)
    db.refresh(assistant_message)
    db.close()

    return {
        "conversation_id": conversation_id,
        "user_message": {
            "id": user_message.id,
            "role": user_message.role,
            "content": user_message.content,
            "created_at": user_message.created_at,
        },
        "assistant_message": {
            "id": assistant_message.id,
            "role": assistant_message.role,
            "content": assistant_message.content,
            "created_at": assistant_message.created_at,
        },
    }


def get_messages(conversation_id: int, user_id: int) -> list[dict]:
    db = Sessionlocal()

    # Verify conversation belongs to the user
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == user_id,
    ).first()

    if conversation is None:
        db.close()
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    db.close()
    return messages
