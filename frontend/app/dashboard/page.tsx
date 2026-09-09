"use client";

import { useState } from "react";
import { createTrip } from "../services/trip.service";
import { Trip } from "../models/trip";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../hooks/useAuthGuard";
import AppNav from "../components/AppNav";
import AppHero from "../components/AppHero";
import LoadingScreen from "../components/LoadingScreen";
import Toast from "../components/Toast";

export default function Dashboard() {
  const ready = useAuthGuard();
  const router = useRouter();
  const [form, setForm] = useState({
    destination: "",
    budget: 0,
    days: 0,
    travel_style: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <LoadingScreen />;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createTrip(form);
      router.push("/trips");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      {error && (
        <Toast
          message={error}
          title="Failed to create journey"
          variant="error"
          onClose={() => setError(null)}
        />
      )}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <AppHero
          label="AI-powered journey planner"
          subtitle="Describe your trip and get a full personalized itinerary — daily plans, budget breakdown, food, and transport — in seconds."
        />

        <AppNav active="dashboard" />

        <div className="grid w-full gap-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur lg:sticky lg:top-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Plan your journey</h2>
              <p className="mt-1 text-sm text-slate-500">
                Set the basics and let AI shape the route.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="destination" className="text-sm font-medium text-slate-700">
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
                <label htmlFor="budget" className="text-sm font-medium text-slate-700">
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
                <label htmlFor="days" className="text-sm font-medium text-slate-700">
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
              <label htmlFor="travel_style" className="text-sm font-medium text-slate-700">
                Travel Style
              </label>
              <select
                id="travel_style"
                name="travel_style"
                value={form.travel_style}
                onChange={handleChange}
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">Choose your style</option>
                <option value="solo">Solo</option>
                <option value="duo">Duo</option>
                <option value="family">Family</option>
                <option value="backpacker">Backpacker</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating itinerary…" : "Create Journey"}
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
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
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
