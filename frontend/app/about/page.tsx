"use client";

import { useIsLoggedIn } from "../hooks/useIsLoggedIn";
import PublicNav from "../components/PublicNav";

export default function AboutPage() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-950">

      <PublicNav active="about" />

      <main>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
          {/* Background blur decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-sky-100/60 blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              🌏 About KelanaAI
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Travel planning,{" "}
              <span className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                reimagined
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
              KelanaAI combines large language models with curated destination knowledge to generate
              complete, actionable itineraries in seconds — so you can focus on the adventure, not
              the spreadsheet.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {isLoggedIn ? (
                <a
                  href="/dashboard"
                  className="rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99]"
                >
                  Start planning →
                </a>
              ) : (
                <>
                  <a
                    href="/auth/register"
                    className="rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99]"
                  >
                    Get started free
                  </a>
                  <a
                    href="/auth/login"
                    className="rounded-2xl border border-sky-200 bg-white px-8 py-3.5 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
                  >
                    Sign in
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Mission ──────────────────────────────────────────────────────── */}
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-sky-100 bg-white/90 p-8 shadow-sm backdrop-blur">
              <h2 className="text-xl font-semibold text-slate-950">Our Mission</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Travel planning shouldn't be overwhelming. KelanaAI combines the power of large language models with
                curated destination knowledge to generate complete, actionable itineraries in seconds — covering daily
                schedules, budget breakdowns, local food recommendations, and transport options. We handle the logistics
                so you can focus on the experience.
              </p>
            </div>
          </div>
        </section>

        {/* ── Features grid ────────────────────────────────────────────────── */}
        <section className="px-4 py-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-950">What KelanaAI offers</h2>
              <p className="mt-3 text-base text-slate-500">Everything you need to plan a great trip.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "✈️",
                  title: "Instant Itineraries",
                  desc: "Get a full day-by-day travel plan in seconds, tailored to your destination, budget, and travel style.",
                },
                {
                  icon: "💰",
                  title: "Budget Breakdown",
                  desc: "Every plan includes a detailed cost estimate so you always know what to expect before you leave.",
                },
                {
                  icon: "🍜",
                  title: "Local Insights",
                  desc: "Discover authentic food spots, hidden gems, and cultural tips curated for each destination.",
                },
                {
                  icon: "🗺️",
                  title: "50+ Destinations",
                  desc: "From Southeast Asia to Europe, our knowledge base keeps growing with new destinations regularly.",
                },
                {
                  icon: "💬",
                  title: "AI Chat Assistant",
                  desc: "Have a conversation with KelanaAI to refine plans, ask follow-up questions, or explore new ideas.",
                },
                {
                  icon: "📋",
                  title: "Trip History",
                  desc: "All your generated itineraries are saved so you can revisit, compare, or share them anytime.",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="text-3xl">{icon}</span>
                  <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
                  <p className="text-xs leading-6 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech stack ───────────────────────────────────────────────────── */}
        <section className="bg-sky-50/60 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-semibold text-slate-950">Built With</h2>
            <p className="mt-1 text-sm text-slate-500">
              A modern, lightweight stack chosen for speed and reliability.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Frontend", value: "Next.js + Tailwind CSS" },
                { label: "Backend", value: "FastAPI (Python)" },
                { label: "AI Model", value: "Amazon Bedrock" },
                { label: "Database", value: "PostgreSQL" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-blue-700 px-8 py-14 text-center shadow-2xl shadow-sky-200">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to plan your next trip?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-sky-100">
              Create your first personalized itinerary in seconds. Free to start, no credit card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {isLoggedIn ? (
                <a
                  href="/dashboard"
                  className="rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-sky-700 shadow-md transition hover:bg-sky-50 active:scale-[0.99]"
                >
                  Go to app →
                </a>
              ) : (
                <>
                  <a
                    href="/auth/register"
                    className="rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-sky-700 shadow-md transition hover:bg-sky-50 active:scale-[0.99]"
                  >
                    Get started free
                  </a>
                  <a
                    href="/auth/login"
                    className="rounded-2xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign in
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-sky-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
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
    </div>
  );
}
