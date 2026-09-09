"use client";

import { useIsLoggedIn } from "./hooks/useIsLoggedIn";
import PublicNav from "./components/PublicNav";

// ---------------------------------------------------------------------------
// Feature card data
// ---------------------------------------------------------------------------

const features = [
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    title: "AI Itineraries in Seconds",
    description:
      "Describe your destination, budget, and travel style. Our AI generates a full day-by-day plan with food picks, transport, and activities — instantly.",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
    title: "Smart Budget Breakdown",
    description:
      "Set your total budget and get a per-day breakdown automatically. Know exactly how much you can spend each day without doing the math yourself.",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    ),
    title: "Share Your Trip",
    description:
      "Generated a great itinerary? Share it with a link — no login required for the recipient. Perfect for sending plans to travel companions.",
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title: "Ask AI Anything",
    description:
      "Not ready to commit to a full plan? Ask our RAG-powered travel assistant any destination question — visa requirements, best seasons, hidden gems.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-950">

      <PublicNav active="home" />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-sky-100/60 blur-3xl" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              ✨ Powered by Amazon Bedrock
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Plan your perfect trip{" "}
              <span className="bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                in seconds
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
              Tell KelanaAI where you want to go, your budget, and how you like to travel. Get a
              full day-by-day itinerary, budget breakdown, food picks, and transport — instantly.
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
                    Start planning free
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

            {/* Social proof */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-base">✈️</span> 1,000+ itineraries generated
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-base">🌍</span> 50+ destinations covered
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-base">⚡</span> Results in under 10 seconds
              </span>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-slate-950">Everything you need to travel smarter</h2>
              <p className="mt-3 text-base text-slate-500">
                From first idea to shared itinerary — KelanaAI handles the planning so you can focus on the journey.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{f.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section className="bg-sky-50/60 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-slate-950">How it works</h2>
              <p className="mt-3 text-base text-slate-500">Three steps from idea to itinerary.</p>
            </div>

            <ol className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Enter your details",
                  body: "Destination, budget, number of days, and travel style. That's all we need.",
                },
                {
                  step: "02",
                  title: "AI generates your plan",
                  body: "Amazon Bedrock builds a day-by-day itinerary with food, transport, and budget split — in seconds.",
                },
                {
                  step: "03",
                  title: "Share or refine",
                  body: "Share a link with your travel companions, or edit the details and regenerate with one click.",
                },
              ].map((item) => (
                <li key={item.step} className="flex flex-col gap-3">
                  <span className="text-4xl font-black text-sky-100">{item.step}</span>
                  <h3 className="font-semibold text-slate-950">{item.title}</h3>
                  <p className="text-sm leading-6 text-slate-500">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-blue-700 px-8 py-14 text-center shadow-2xl shadow-sky-200">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to plan your next adventure?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-sky-100">
              Join thousands of travellers who plan smarter with AI. Free to start, no credit card required.
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
