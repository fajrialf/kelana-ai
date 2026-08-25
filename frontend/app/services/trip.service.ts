import { Trip } from "../models/trip";
import { TripPayload } from "../models/trip.payload";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
async function createTrip(trip: TripPayload) {
    return fetch(`${BASE_URL}/api/v1/trip`, {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
        destination: trip.destination,
        budget: +trip.budget,
        days: +trip.days,
        travel_style: trip.travelStyle,
        }),
    }).then();
}

export {createTrip}