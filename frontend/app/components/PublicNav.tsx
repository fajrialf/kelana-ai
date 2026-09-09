"use client";

import { useIsLoggedIn } from "../hooks/useIsLoggedIn";

interface PublicNavProps {
  active?: "home" | "about";
}

export default function PublicNav({ active }: PublicNavProps) {
  const isLoggedIn = useIsLoggedIn();

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="text-lg font-bold text-sky-700">
          KelanaAI
        </a>

        {/* Links + actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-4 sm:flex">
            <a
              href="/about"
              className={
                active === "about"
                  ? "text-sm font-semibold text-sky-700"
                  : "text-sm text-slate-500 transition hover:text-sky-700"
              }
            >
              About
            </a>
          </nav>

          <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden="true" />

          {/* Auth actions — rendered after mount to avoid hydration mismatch */}
          {isLoggedIn === null ? (
            <div className="h-8 w-28 animate-pulse rounded-xl bg-slate-100" />
          ) : isLoggedIn ? (
            <a
              href="/dashboard"
              className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600"
            >
              Go to app →
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/auth/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-sky-700"
              >
                Sign in
              </a>
              <a
                href="/auth/register"
                className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600"
              >
                Get started free
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
