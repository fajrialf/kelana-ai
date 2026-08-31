import math
from fastapi import HTTPException
from databases import Sessionlocal
from models.trip import Trip
from models.tripPayload import TripRequest
from services.bedrock_service import get_ai_recommendation


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_trip_category(budget: float) -> str:
    if budget < 1000:
        return "backpacker"
    elif budget <= 3000:
        return "standard"
    else:
        return "luxury"


def calculate_daily_budget(budget: float, days: int) -> float:
    return budget / days


def get_recommended_places() -> list[str]:
    return [
        "Tokyo Tower",
        "Shibuya",
        "Mount Fuji",
    ]


def get_transportation_recommendation(category: str) -> str:
    category = category.lower()
    if category == "backpacker":
        return "Bus"
    elif category == "standard":
        return "Train"
    else:
        return "Flight"


def get_travel_season(month: str) -> str:
    month = month.lower()
    if month in ["december", "12"]:
        return "Peak Season"
    elif month in ["june", "6"]:
        return "Holiday Season"
    else:
        return "Regular Season"


def get_trip_categories() -> list[str]:
    return ["backpacker", "standard", "luxury"]


def get_recommended_transportations() -> list[str]:
    return ["Bus", "Train", "Flight"]


# ---------------------------------------------------------------------------
# CRUD
# ---------------------------------------------------------------------------

def create_trip(request: TripRequest, user_id: int) -> Trip:
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    ai_recommendation = get_ai_recommendation(
        request.destination, request.days, request.budget, request.travel_style
    )

    trip = Trip(
        user_id=user_id,
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        category=category,
        daily_budget=daily_budget,
        ai_recommendation=ai_recommendation,
        travel_style=request.travel_style
    )

    db = Sessionlocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()
    return trip


def list_trips(user_id: int, q: str = "", page: int = 1, sort: str = "asc") -> dict:
    db = Sessionlocal()

    col_sort = Trip.created_at.asc() if sort == "asc" else Trip.created_at.desc()

    base_query = db.query(Trip).filter(
        Trip.user_id == user_id,
        (Trip.destination.ilike(f"%{q}%")) | (Trip.travel_style.ilike(f"%{q}%")),
    )

    trips = (
        base_query
        .order_by(col_sort, Trip.budget.desc())
        .offset((page - 1) * 10)
        .limit(10)
        .all()
    )
    counts = base_query.count()
    db.close()

    return {
        "data": trips,
        "total": counts,
        "page": page,
        "total_pages": math.ceil(counts / 10),
    }


def get_trip(trip_id: int, user_id: int) -> Trip:
    db = Sessionlocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()

    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    if trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return trip


def update_trip(trip_id: int, request: TripRequest, user_id: int) -> Trip:
    db = Sessionlocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    if trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    if (trip.destination != request.destination or trip.travel_style != request.travel_style
        or trip.budget != request.budget or trip.days != request.days):
        trip.destination = request.destination
        trip.days = request.days
        trip.budget = request.budget
        trip.travel_style = request.travel_style
        trip.daily_budget = calculate_daily_budget(request.budget, request.days)
        trip.category = get_trip_category(request.budget)
        trip.ai_recommendation=get_ai_recommendation(trip.destination, trip.days, trip.budget, trip.travel_style)

        db.commit()
        db.refresh(trip)
        db.close()
    return trip


def delete_trip(trip_id: int, user_id: int) -> None:
    db = Sessionlocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    if trip.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(trip)
    db.commit()
    db.close()
