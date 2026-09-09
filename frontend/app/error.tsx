"use client";

import { useEffect } from "react";
import Link from "next/link";
import AppHero from "./components/AppHero";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8 flex flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 flex-1">

        {/* Header */}
        <AppHero label="AI-powered journey planner" />

        {/* Error card */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-sky-100 bg-white/90 p-10 text-center shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur">

            {/* Icon */}
            <div className="relative flex items-center justify-center">
              <span className="absolute h-20 w-20 rounded-full bg-red-100/60 blur-xl" aria-hidden="true" />
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-100 bg-white shadow-md">
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </span>
            </div>

            {/* Code + message */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Error 500</p>
              <h2 className="text-2xl font-bold text-slate-950">Something went wrong</h2>
              <p className="text-sm leading-6 text-slate-500">
                Our servers hit some turbulence. The issue has been noted —
                try again or head back home while we sort it out.
              </p>
            </div>

            {/* Digest for debugging */}
            {error.digest && (
              <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-400">
                Error ID: {error.digest}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={reset}
                className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99]"
              >
                Try again
              </button>
              <Link
                href="/"
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-50 active:scale-[0.99] text-center"
              >
                ✈️ Back to Home
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
