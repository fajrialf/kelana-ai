"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { getMe, MeResponse } from "../services/auth.service";
import AppNav from "../components/AppNav";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const ready = useAuthGuard();
  const jwtUser = useCurrentUser(); // instant from localStorage
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem("session");
    router.replace("/auth/login");
  }

  // Use API data when loaded, fall back to JWT data instantly
  const name = me?.name ?? jwtUser?.name ?? "—";
  const email = me?.email ?? jwtUser?.email ?? "—";

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-sky-100 px-8 py-10 shadow-[0_24px_80px_rgba(14,116,144,0.22)] sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img src="/assets/bg-cloud-shadow.jpg" alt="" className="absolute inset-0 h-full w-full" />
          </div>
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">
                AI-powered journey planner
              </p>
              <h1 className="text-4xl font-bold text-sky-100 sm:text-5xl">KelanaAI</h1>
              <p className="max-w-sm text-sm leading-6 text-sky-100">
                Your account details and session info.
              </p>
            </div>
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

        <AppNav active="profile" />

        {/* Profile card */}
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col gap-6 rounded-2xl border border-sky-100 bg-white/90 p-8 shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur">

            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-sky-200">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{name}</h2>
                <p className="text-sm text-slate-500">{email}</p>
              </div>
            </div>

            <hr className="border-sky-100" />

            {/* Info rows */}
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Name
                  </span>
                  <span className="text-sm font-medium text-slate-950">{name}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Email
                  </span>
                  <span className="text-sm font-medium text-slate-950">{email}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Trips Generated
                  </span>
                  {loading ? (
                    <span className="h-5 w-8 animate-pulse rounded bg-slate-100" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-sky-700">
                        {me?.trips_generated ?? 0}
                      </span>
                      <span className="text-sm text-slate-500">itineraries created</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <hr className="border-sky-100" />

            {/* Sign out */}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.99]"
            >
              Sign out
            </button>
          </div>
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
