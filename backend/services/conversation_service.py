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
