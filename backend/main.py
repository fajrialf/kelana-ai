from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
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
)
from services.auth_service import register as auth_register, auth_login, get_me
import os
from services.kb_services import retrieve_and_generate
from models.questionPayload import QuestionPayload

load_dotenv()
init_db()

app = FastAPI()

origins = os.getenv("ALLOWED_ORIGINS").split(",")
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