from fastapi import HTTPException
from databases import Sessionlocal
from models.conversation import Conversation
from models.conversationPayload import ConversationRequest


def create_conversation(request: ConversationRequest, user_id: int) -> Conversation:
    conversation = Conversation(
        user_id=user_id,
        title=request.title,
    )

    db = Sessionlocal()
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    db.close()
    return conversation


def list_conversations(user_id: int) -> list[Conversation]:
    db = Sessionlocal()
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )
    db.close()
    return conversations


def update_conversation(conversation_id: int, title: str, user_id: int) -> Conversation:
    db = Sessionlocal()
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
        .first()
    )
    if not conversation:
        db.close()
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversation.title = title
    db.commit()
    db.refresh(conversation)
    db.close()
    return conversation


def delete_conversation(conversation_id: int, user_id: int) -> None:
    db = Sessionlocal()
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
        .first()
    )
    if not conversation:
        db.close()
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conversation)
    db.commit()
    db.close()
