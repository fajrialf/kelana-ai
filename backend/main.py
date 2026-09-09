from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from dotenv import load_dotenv
from dependencies import get_current_user
from databases import init_db
from models.tripPayload import TripRequest
from models.userPayload import RegisterPayload, LoginPayload
from services.trip_service import (
    create_trip,
    list_trips,
    get_trip,
    update_trip,
    delete_trip,
    get_trip_categories,
    get_recommended_places,
    get_recommended_transportations,
    share_trip,
    get_shared_trip,
)
from services.auth_service import register as auth_register, auth_login, get_me
import os
from services.kb_services import retrieve_and_generate
from models.questionPayload import QuestionPayload
from models.conversationPayload import ConversationRequest
from services.conversation_service import create_conversation, list_conversations, update_conversation, delete_conversation
from models.messagePayload import MessageRequest
from services.message_service import send_message, get_messages

load_dotenv()
init_db()

# ---------------------------------------------------------------------------
# Environment flags
# ---------------------------------------------------------------------------

ENV = os.getenv("ENV").lower()
IS_PRODUCTION = ENV == "production"

# Secret header value the frontend must send on every request.
# Set FRONTEND_API_KEY in .env to a strong random string.
FRONTEND_API_KEY = os.getenv("FRONTEND_API_KEY", "")
FRONTEND_HEADER_NAME = "x-frontend-key"

# ---------------------------------------------------------------------------
# App — docs disabled in production
# ---------------------------------------------------------------------------

app = FastAPI(
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

# ---------------------------------------------------------------------------
# Middleware: enforce frontend key header on all /api routes
# ---------------------------------------------------------------------------

class FrontendKeyMiddleware(BaseHTTPMiddleware):
    """
    Rejects requests to /api/* that do not carry the correct
    X-Frontend-Key header. Skipped in development or when
    FRONTEND_API_KEY is not configured.
    """

    # Paths that bypass the key check (public endpoints, health probes)
    EXEMPT_PREFIXES = ["/api/v1/shared/"]

    async def dispatch(self, request: Request, call_next):
        # Only enforce on /api routes
        if not request.url.path.startswith("/api"):
            return await call_next(request)

        # Skip enforcement for public/shared routes
        for prefix in self.EXEMPT_PREFIXES:
            if request.url.path.startswith(prefix):
                return await call_next(request)

        # Skip enforcement when no key is configured (dev convenience)
        if not FRONTEND_API_KEY:
            return await call_next(request)

        provided_key = request.headers.get(FRONTEND_HEADER_NAME, "")
        if provided_key != FRONTEND_API_KEY:
            return JSONResponse(
                status_code=403,
                content={"detail": "Direct API access is not allowed."},
            )

        return await call_next(request)


app.add_middleware(FrontendKeyMiddleware)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True,
)


# ---------------------------------------------------------------------------
# Misc
# ---------------------------------------------------------------------------

@app.get("/")
def home():
    return {"message": "First FastAPI APP"}


@app.get("/health")
def health_check():
    return {"status": "Ok"}


@app.get("/api/v1/trip-categories")
def trip_categories():
    return get_trip_categories()


@app.get("/api/v1/recommendations")
def recommendations():
    return get_recommended_places()


@app.get("/api/v1/transportations")
def transportations():
    return get_recommended_transportations()


# ---------------------------------------------------------------------------
# Trips
# ---------------------------------------------------------------------------

@app.post("/api/v1/trip")
def create_trip_route(request: TripRequest, current_user: dict = Depends(get_current_user)):
    return create_trip(request, user_id=int(current_user["sub"]))


@app.get("/api/v1/trips")
def get_trips_route(q: str = "", page: int = 1, sort: str = "asc", current_user: dict = Depends(get_current_user)):
    return list_trips(user_id=int(current_user["sub"]), q=q, page=page, sort=sort)


@app.get("/api/v1/trips/{trip_id}")
def get_trip_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    return get_trip(trip_id, user_id=int(current_user["sub"]))


@app.put("/api/v1/trips/{trip_id}")
def update_trip_route(trip_id: int, request: TripRequest, current_user: dict = Depends(get_current_user)):
    return update_trip(trip_id, request, user_id=int(current_user["sub"]))


@app.delete("/api/v1/trips/{trip_id}", status_code=204)
def delete_trip_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    delete_trip(trip_id, user_id=int(current_user["sub"]))


@app.post("/api/v1/trips/{trip_id}/share")
def share_trip_route(trip_id: int, current_user: dict = Depends(get_current_user)):
    """Generate (or return existing) share token for a trip."""
    return share_trip(trip_id, user_id=int(current_user["sub"]))


@app.get("/api/v1/shared/{token}")
def get_shared_trip_route(token: str):
    """Public endpoint — returns trip by share token, no auth required."""
    return get_shared_trip(token)


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@app.post("/api/v1/auth/register")
def register(request: RegisterPayload):
    return auth_register(request)


@app.post("/api/v1/auth/login")
def login(request: LoginPayload):
    return auth_login(request)


@app.get("/api/v1/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return get_me(user_id=int(current_user["sub"]))

@app.post("/api/v1/ask")
def ask_endpoint(request: QuestionPayload,current_user: dict = Depends(get_current_user)):
    answer = retrieve_and_generate(request.question)
    return{
        "question": request.question,**answer
    }


# ---------------------------------------------------------------------------
# Conversations
# ---------------------------------------------------------------------------

@app.post("/api/v1/conversations", status_code=201)
def create_conversation_route(request: ConversationRequest, current_user: dict = Depends(get_current_user)):
    return create_conversation(request, user_id=int(current_user["sub"]))


@app.get("/api/v1/conversations")
def list_conversations_route(current_user: dict = Depends(get_current_user)):
    return list_conversations(user_id=int(current_user["sub"]))


@app.patch("/api/v1/conversations/{conversation_id}")
def update_conversation_route(conversation_id: int, request: ConversationRequest, current_user: dict = Depends(get_current_user)):
    return update_conversation(conversation_id, request.title, user_id=int(current_user["sub"]))


@app.delete("/api/v1/conversations/{conversation_id}", status_code=204)
def delete_conversation_route(conversation_id: int, current_user: dict = Depends(get_current_user)):
    delete_conversation(conversation_id, user_id=int(current_user["sub"]))


# ---------------------------------------------------------------------------
# Messages
# ---------------------------------------------------------------------------

@app.post("/api/v1/conversations/{conversation_id}/messages", status_code=201)
def send_message_route(conversation_id: int, request: MessageRequest, current_user: dict = Depends(get_current_user)):
    return send_message(conversation_id, request, user_id=int(current_user["sub"]))


@app.get("/api/v1/conversations/{conversation_id}/messages")
def get_messages_route(conversation_id: int, current_user: dict = Depends(get_current_user)):
    return get_messages(conversation_id, user_id=int(current_user["sub"]))