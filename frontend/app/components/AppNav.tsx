"use client";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRouter } from "next/navigation";

interface AppNavProps {
  active?: "home" | "trips" | "profile";
}

export default function AppNav({ active }: AppNavProps) {
  const user = useCurrentUser();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("session");
    router.replace("/auth/login");
  }

  return (
    <nav className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2 text-sm shadow-sm">
      {/* Left: breadcrumb links */}
      <a
        href="/"
        className={
          active === "home"
            ? "font-semibold text-sky-700"
            : "text-slate-500 hover:text-sky-700 transition-colors"
        }
      >
        Home
      </a>
      <span className="text-slate-300">·</span>
      <a
        href="/trips"
        className={
          active === "trips"
            ? "font-semibold text-sky-700"
            : "text-slate-500 hover:text-sky-700 transition-colors"
        }
      >
        History
      </a>

      {/* Right: welcome + profile + logout */}
      <div className="ml-auto flex items-center gap-3">
        {user?.name && (
          <span className="text-xs text-slate-500">
            👋 Welcome, <span className="font-semibold text-slate-700">{user.name}</span>
          </span>
        )}
        <a
          href="/profile"
          className={
            active === "profile"
              ? "rounded-lg bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
              : "rounded-lg px-3 py-1 text-xs font-medium text-slate-500 hover:bg-sky-50 hover:text-sky-700 transition-colors"
          }
        >
          Profile
        </a>
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
