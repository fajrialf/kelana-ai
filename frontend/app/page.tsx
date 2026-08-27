"use client";

import { useState } from "react";
import { createTrip } from "./services/trip.service";
import { Trip } from "./models/trip";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    destination: "",
    budget: 0,
    days: 0,
    travel_style: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setTrip(null);
    setLoading(true);

    try {
      const data: Trip = await createTrip(form)
      router.push("/trips")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="relative overflow-hidden rounded-2xl border border-sky-100 px-8 py-10 shadow-[0_24px_80px_rgba(14,116,144,0.22)]
          sm:px-12 sm:py-14">
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
              <h1 className="text-4xl font-bold text-sky-100 sm:text-5xl">
                KelanaAI
              </h1>
              <p className="max-w-sm text-sm leading-6 text-sky-100">
                Describe your trip and get a full personalized itinerary —
                daily plans, budget breakdown, food, and transport — in seconds.
              </p>
            </div>
        
            {/* Right: stat chips */}
            <div className="flex flex-wrap gap-3  sm:flex-col sm:items-end sm:gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium
        text-sky-100 backdrop-blur">
                <span>✈️</span>
                <span>1,000+ itineraries generated</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium
        text-sky-100 backdrop-blur">
                <span>🌍</span>
                <span>50+ destinations covered</span>
              </div>
            </div>
          </div>
        </header>
        <nav className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2 text-sm shadow-sm">
          <a href="/" className="font-semibold text-sky-700">Home</a>
          <span className="text-slate-300">·</span>
          <a href="/trips" className="text-slate-500 hover:text-sky-700 transition-colors">History</a>
        </nav>
        <div className="grid w-full gap-6 ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur lg:sticky lg:top-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Plan your journey
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Set the basics and let AI shape the route.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="destination"
                className="text-sm font-medium text-slate-700"
              >
                Destination
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                placeholder="e.g. Bali, Indonesia"
                value={form.destination}
                onChange={handleChange}
                required
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="budget"
                  className="text-sm font-medium text-slate-700"
                >
                  Budget (USD)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min={0}
                  placeholder="e.g. 1500"
                  value={form.budget}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="days"
                  className="text-sm font-medium text-slate-700"
                >
                  Days
                </label>
                <input
                  id="days"
                  name="days"
                  type="number"
                  min={1}
                  placeholder="e.g. 7"
                  value={form.days}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="travel_style"
                className="text-sm font-medium text-slate-700"
              >
                Travel Style
              </label>
              <select
                id="travel_style"
                name="travel_style"
                value={form.travel_style}
                onChange={handleChange}
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                  <option value="">choose your style</option>
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="family">Family</option>
                  <option value="backpacker">Backpacker</option>
                </select>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating itinerary..." : "Create Journey"}
            </button>
          </form>
        </div>
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
