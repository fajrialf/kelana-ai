"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authLogin } from "@/app/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authLogin(form);
      localStorage.setItem("session", data.access_token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      {/* Error toast */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-[fadeSlideDown_0.3s_ease-out] flex items-center gap-3 rounded-2xl border border-red-200 bg-white px-5 py-3.5 shadow-lg shadow-red-100"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">Sign in failed</p>
            <p className="text-xs text-slate-500">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            aria-label="Dismiss"
            className="ml-2 rounded-lg p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
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
              <h1 className="text-4xl font-bold text-sky-100 sm:text-5xl">
                KelanaAI
              </h1>
              <p className="max-w-sm text-sm leading-6 text-sky-100">
                Welcome back! Sign in to continue planning your next adventure.
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

        {/* Login card */}
        <div className="mx-auto w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-sky-100 bg-white/90 p-8 shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur"
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Sign in to your account</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your credentials to access your journeys.
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-xs text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="font-semibold text-sky-700 hover:text-sky-600 transition-colors">
                Create one
              </a>
            </p>
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
