"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TripCard from "../components/tripCard";
import TripsFilter from "../components/tripsFilter";
import TripsPagination from "../components/tripsPagination";
import { getTrips, TripsPage } from "../services/trip.service";
import { Trip } from "../models/trip";
import { useAuthGuard } from "../hooks/useAuthGuard";
import AppNav from "../components/AppNav";

function TripsList() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? undefined;
  const sort = (searchParams.get("sort") as "asc" | "desc") ?? "desc";
  const pageParam = searchParams.get("page");
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getTrips({ q, sort, page })
      .then((data) => {
        if (data && !Array.isArray(data) && "data" in data) {
          const paged = data as TripsPage;
          setTrips(paged.data);
          setTotalPages(paged.total_pages ?? 1);
        } else {
          setTrips(Array.isArray(data) ? data : [data as unknown as Trip]);
          setTotalPages(1);
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load trips.");
      })
      .finally(() => setLoading(false));
  }, [q, sort, page]);

  return (
    <>
      {/* Search & sort */}
      <TripsFilter />

      {/* Trip list */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading trips…</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : trips.length === 0 ? (
        <p className="text-sm text-slate-400">
          {q ? `No trips found for "${q}".` : "No trips yet. Start planning one!"}
        </p>
      ) : (
        <>
          <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onDeleted={(id) => setTrips((prev) => prev.filter((t) => t.id !== id))} />
            ))}
          </div>
          <TripsPagination page={page} totalPages={totalPages} />
        </>
      )}
    </>
  );
}

export default function List() {
  const ready = useAuthGuard();
  if (!ready) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="relative overflow-hidden rounded-2xl border border-sky-100 px-8 py-10 shadow-[0_24px_80px_rgba(14,116,144,0.22)] sm:px-12 sm:py-14">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img src="/assets/bg-cloud-shadow.jpg" alt="" className="absolute inset-0 h-full w-full" />
          </div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: brand + headline */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">
                AI-powered journey planner
              </p>
              <h1 className="text-4xl font-bold text-sky-100 sm:text-5xl">KelanaAI</h1>
              <p className="max-w-sm text-sm leading-6 text-sky-100">
                Describe your trip and get a full personalized itinerary — daily plans, budget
                breakdown, food, and transport — in seconds.
              </p>
            </div>

            {/* Right: stat chips */}
            <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end sm:gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-sky-100 backdrop-blur">
                <span>✈️</span>
                <span>1,000+ itineraries generated</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-sky-100 backdrop-blur">
                <span>🌍</span>
                <span>50+ destinations covered</span>
              </div>
            </div>
          </div>
        </header>

        <AppNav active="trips" />

        {/* Suspense boundary required by useSearchParams */}
        <Suspense fallback={<p className="text-sm text-slate-400">Loading…</p>}>
          <TripsList />
        </Suspense>
      </div>

      <footer className="mx-auto mt-12 w-full max-w-7xl border-t border-sky-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-sky-700">KelanaAI</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-400">AI-powered travel planner</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5 text-sky-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                />
              </svg>
              Plan smarter, travel better
            </span>
            <span className="text-slate-300">·</span>
            <span>© {new Date().getFullYear()} KelanaAI</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
