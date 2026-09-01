import { Trip } from "../models/trip";
import { TripPayload } from "../models/trip.payload";
import { apiFetch } from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function createTrip(trip: TripPayload): Promise<Trip> {
  const response = await apiFetch(`${BASE_URL}/api/v1/trip`, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(trip),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

export interface GetTripsParams {
  q?: string;
  sort?: "asc" | "desc";
  page?: number;
}

export interface TripsPage {
  data: Trip[];
  total: number;
  page: number;
  total_pages: number;
}

async function getTrips(params?: GetTripsParams): Promise<TripsPage | Trip[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.page) query.set("page", String(params.page));

  const url = `${BASE_URL}/api/v1/trips${query.toString() ? `?${query.toString()}` : ""}`;
  const response = await apiFetch(url, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function getTrip(id: number): Promise<Trip> {
  const response = await apiFetch(`${BASE_URL}/api/v1/trips/${id}`, {
    headers: { "content-type": "application/json" },
    method: "GET",
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function updateTrip(id: number, trip: TripPayload): Promise<Trip> {
  const response = await apiFetch(`${BASE_URL}/api/v1/trips/${id}`, {
    headers: { "content-type": "application/json" },
    method: "PUT",
    body: JSON.stringify(trip),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function deleteTrip(id: number): Promise<void> {
  const response = await apiFetch(`${BASE_URL}/api/v1/trips/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
}

export { createTrip, getTrip, getTrips, updateTrip, deleteTrip };
