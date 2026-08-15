from fastapi import FastAPI
from pydantic import BaseModel
from services.trip_service import calculate_daily_budget,get_trip_category, get_transportation_recommendation,get_trip_categories, get_recommended_places,get_recommended_transportations

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

app = FastAPI()

@app.get("/")
def home():
    return {"message":"First FastAPI APP"}

@app.get("/health")
def health_check():
    return {"status":"Ok"}

@app.post("/api/v1/trip")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    transportation = get_transportation_recommendation(category)
    return {
        "destination": request.destination,
        "budget": request.budget,
        "daily_budget": daily_budget,
        "category": category,
        "recommendation_transportation": transportation
    }

@app.get("/api/v1/trip-categories")
def trip_categories():
    return get_trip_categories()


@app.get("/api/v1/recommendations")
def get_recommendations():
    return get_recommended_places()

@app.get("/api/v1/transportations")
def get_transportations():
    return get_recommended_transportations()