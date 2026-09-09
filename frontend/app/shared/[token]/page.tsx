"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown, { Components } from "react-markdown";
import { Trip } from "@/app/models/trip";
import { getSharedTrip } from "@/app/services/trip.service";
import AppHero from "@/app/components/AppHero";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
  h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-950">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold text-slate-950">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-3 text-base font-semibold text-sky-950">{children}</h3>,
  p: ({ children }) => <p className="text-sm leading-7 text-slate-700">{children}</p>,
  ul: ({ children }) => (
    <ul className="ml-4 list-disc space-y-2 text-sm leading-7 text-slate-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-4 list-decimal space-y-2 text-sm leading-7 text-slate-700">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SharedTripPage() {
  const { token } = useParams<{ token: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);

    getSharedTrip(token)
      .then(setTrip)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load trip."))
      .finally(() => setLoading(false));
  }, [token]);

  const aiSections = trip?.ai_recommendation
    ? parseMarkdownSections(trip.ai_recommendation)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

        <AppHero
          label="AI-powered journey planner"
          subtitle="A trip itinerary shared with you — day-by-day plans, budget breakdown, food, and transport — all powered by AI."
        />

        {/* ── CTA to sign up ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/80 px-5 py-4">
          <p className="text-sm text-slate-600">
            Want your own AI-generated itinerary?{" "}
            <a href="/" className="font-semibold text-sky-600 hover:text-sky-800 transition-colors">
              Try KelanaAI for free →
            </a>
          </p>
          <span className="hidden text-xs text-slate-400 sm:block">No account required to view</span>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <svg
              aria-label="Loading"
              className="h-8 w-8 animate-spin text-sky-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <svg
              aria-hidden="true"
              className="h-12 w-12 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <p className="text-base font-semibold text-slate-700">{error}</p>
            <p className="text-sm text-slate-400">
              The link may be invalid or the trip may no longer be shared.
            </p>
          </div>
        )}

        {!loading && !error && trip && (
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">
                Shared itinerary
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">{trip.destination}</h2>
            </div>

            {/* Stats grid */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4">
                <span className="text-xs font-semibold uppercase text-sky-700">Destination</span>
                <p className="mt-1 font-semibold capitalize text-slate-950">{trip.destination}</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Duration</span>
                <p className="mt-1 font-semibold text-slate-950">{trip.days} days</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Budget</span>
                <p className="mt-1 font-semibold text-slate-950">${trip.budget.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Daily</span>
                <p className="mt-1 font-semibold text-slate-950">
                  ${trip.daily_budget.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <span className="text-xs font-semibold uppercase text-emerald-700">Category</span>
                <p className="mt-1 font-semibold capitalize text-slate-950">{trip.category}</p>
              </div>
            </div>

            {/* Travel style badge */}
            {trip.travel_style && (
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold capitalize text-sky-700">
                  {trip.travel_style}
                </span>
              </div>
            )}

            {/* AI itinerary sections */}
            {aiSections.length > 0 && (
              <div className="grid gap-4">
                {aiSections.map((section, i) => (
                  <article
                    key={i}
                    className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm"
                  >
                    {section.title && (
                      <h3 className="mb-3 text-lg font-semibold text-sky-950">{section.title}</h3>
                    )}
                    <div className="flex flex-col gap-3">
                      <ReactMarkdown components={mdComponents}>{section.body}</ReactMarkdown>
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
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
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
