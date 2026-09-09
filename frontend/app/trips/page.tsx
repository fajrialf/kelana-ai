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
import AppHero from "../components/AppHero";
import LoadingScreen from "../components/LoadingScreen";
import Toast from "../components/Toast";

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
      {error && (
        <Toast
          message={error}
          title="Failed to load trips"
          variant="error"
          onClose={() => setError(null)}
        />
      )}
      {/* Search & sort */}
      <TripsFilter />

      {/* Trip list */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading trips…</p>
      ) : error ? (
        <p className="text-sm text-slate-400">Could not load trips. Please try again.</p>
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
  if (!ready) return <LoadingScreen />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <AppHero
          label="AI-powered journey planner"
          subtitle="Describe your trip and get a full personalized itinerary — daily plans, budget breakdown, food, and transport — in seconds."
        />

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
