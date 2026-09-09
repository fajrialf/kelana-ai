import Link from "next/link";
import AppHero from "./components/AppHero";

export const metadata = {
  title: "404 — Page Not Found | KelanaAI",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8 flex flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 flex-1">

        {/* Header */}
        <AppHero label="AI-powered journey planner" />

        {/* 404 card */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-sky-100 bg-white/90 p-10 text-center shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur">

            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute h-20 w-20 rounded-full bg-sky-100/80 blur-xl" aria-hidden="true" />
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-100 bg-white shadow-md">
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </span>
            </div>

            {/* Code + message */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">Error 404</p>
              <h2 className="text-2xl font-bold text-slate-950">Page not found</h2>
              <p className="text-sm leading-6 text-slate-500">
                Looks like this route got lost somewhere over the clouds.
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/"
                className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99] text-center"
              >
                ✈️ Back to Home
              </Link>
              <Link
                href="/trips"
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-50 active:scale-[0.99] text-center"
              >
                View my trips
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-8 w-full max-w-7xl border-t border-sky-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-sky-700">KelanaAI</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-400">AI-powered travel planner</span>
          </div>
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} KelanaAI</span>
        </div>
      </footer>
    </main>
  );
}
