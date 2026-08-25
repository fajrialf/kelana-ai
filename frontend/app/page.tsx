"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { createTrip } from "./services/trip.service";
import { Trip } from "./models/trip";

function parseMarkdownSections(text: string): { title: string; body: string }[] {
  const lines = text.split("\n");
  const sections: { title: string; body: string }[] = [];
  let current: { title: string; body: string } | null = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h2 || h1) {
      if (current) sections.push(current);
      current = { title: (h2 ?? h1)![1].trim(), body: "" };
    } else {
      if (current) {
        current.body += line + "\n";
      } else if (line.trim()) {
        current = { title: "", body: line + "\n" };
      }
    }
  }

  if (current && (current.title || current.body.trim())) sections.push(current);
  return sections;
}

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-slate-950">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-slate-950">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 text-base font-semibold text-sky-950">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-7 text-slate-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="ml-4 list-disc space-y-2 text-sm leading-7 text-slate-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-4 list-decimal space-y-2 text-sm leading-7 text-slate-700">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-950">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-sky-50 px-1.5 py-0.5 font-mono text-xs text-sky-800">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-sky-300 pl-4 text-sm italic text-slate-600">
      {children}
    </blockquote>
  ),
};

export default function Home() {
  const [form, setForm] = useState({
    destination: "",
    budget: 0,
    days: 0,
    travelStyle: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTrip(null);
    setLoading(true);

    try {
      const response = await createTrip(form)

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data: Trip = await response.json();
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const aiSections = trip?.ai_recommendation
    ? parseMarkdownSections(trip.ai_recommendation)
    : [];

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

        <div className="grid w-full gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
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
                htmlFor="travelStyle"
                className="text-sm font-medium text-slate-700"
              >
                Travel Style
              </label>
              <select
                id="travelStyle"
                name="travelStyle"
                value={form.travelStyle}
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

          <section className="min-h-[620px] rounded-2xl border border-sky-100 bg-white/80 p-5 shadow-[0_24px_80px_rgba(14,116,144,0.12)] backdrop-blur sm:p-6">
            {!trip && !loading && (
              <div className="flex h-full min-h-[520px] flex-col items-center justify-center rounded-xl border border-dashed border-sky-200 bg-gradient-to-b from-sky-50/80 to-white p-8 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-xl shadow-sky-200">
                  <svg
                    aria-hidden="true"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
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
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Your itinerary will appear here
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                  Results stay beside the form on desktop, making it easy to
                  adjust your trip and compare the new plan.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex h-full min-h-[520px] flex-col items-center justify-center gap-4 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Creating your journey
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Building daily plans, food ideas, budgets, and transport
                    suggestions.
                  </p>
                </div>
              </div>
            )}

            {trip && (
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase text-sky-700">
                    Generated plan
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">
                    {trip.destination}
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4">
                    <span className="text-xs font-semibold uppercase text-sky-700">
                      Destination
                    </span>
                    <p className="mt-1 font-semibold capitalize text-slate-950">
                      {trip.destination}
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-100 bg-white p-4">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      Duration
                    </span>
                    <p className="mt-1 font-semibold text-slate-950">
                      {trip.days} days
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-100 bg-white p-4">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      Budget
                    </span>
                    <p className="mt-1 font-semibold text-slate-950">
                      ${trip.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-100 bg-white p-4">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      Daily
                    </span>
                    <p className="mt-1 font-semibold text-slate-950">
                      ${trip.daily_budget.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <span className="text-xs font-semibold uppercase text-emerald-700">
                      Category
                    </span>
                    <p className="mt-1 font-semibold capitalize text-slate-950">
                      {trip.category}
                    </p>
                  </div>
                </div>

                {aiSections.length > 0 && (
                  <div className="grid gap-4">
                    {aiSections.map((section, i) => (
                      <article
                        key={i}
                        className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm"
                      >
                        {section.title && (
                          <h3 className="mb-3 text-lg font-semibold text-sky-950">
                            {section.title}
                          </h3>
                        )}
                        <div className="flex flex-col gap-3">
                          <ReactMarkdown components={mdComponents}>
                            {section.body}
                          </ReactMarkdown>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {aiSections.length === 0 && trip.ai_recommendation && (
                  <article className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3">
                      <ReactMarkdown components={mdComponents}>
                        {trip.ai_recommendation}
                      </ReactMarkdown>
                    </div>
                  </article>
                )}
              </div>
            )}
          </section>
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
