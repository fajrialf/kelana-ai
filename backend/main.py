from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from services.trip_service import calculate_daily_budget,get_trip_category, get_transportation_recommendation,get_trip_categories, get_recommended_places,get_recommended_transportations
from databases import init_db, Sessionlocal
from models.trip import Trip
from services.bedrock_service import get_ai_recommendation
from fastapi.middleware.cors import CORSMiddleware

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

init_db()
app = FastAPI()
origins = ["http://localhost:3000","http://127.0.0.1:3000", "http://localhost:3000/"]
app.add_middleware(CORSMiddleware,allow_origins=origins, allow_headers=["*"], allow_methods=["*"], allow_credentials=True)

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
    ai_recommendation = get_ai_recommendation(request.destination, request.days, request.budget, request.travel_style)
    trip = Trip(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        category=category,
        daily_budget=daily_budget,
        ai_recommendation=ai_recommendation
    )

    db = Sessionlocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()
    return trip

@app.get("/api/v1/trip-categories")
def trip_categories():
    return get_trip_categories()


@app.get("/api/v1/recommendations")
def get_recommendations():
    return get_recommended_places()

@app.get("/api/v1/transportations")
def get_transportations():
    return get_recommended_transportations()

@app.get("/api/v1/trips")
def get_trips():
    db = Sessionlocal()
    trips = db.query(Trip).all()
    db.close()
    return trips

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id :int):
    db = Sessionlocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    return trip

@app.delete("/api/v1/trips/{trip_id}", status_code=204)
def delete_trip(trip_id  :int):
    db = Sessionlocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    db.delete(trip)
    db.commit()
    db.close()

@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripRequest):
    db = Sessionlocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    
    trip.destination = request.destination
    trip.days = request.days
    trip.budget = request.budget
    trip.daily_budget = daily_budget
    trip.category = category

    db.commit()
    db.refresh(trip)
    db.close()
    return trip