"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export default function TripsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "desc";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 whenever filter or sort changes
      params.delete("page");
      startTransition(() => {
        router.push(`/trips?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const toggleSort = () => {
    updateParams("sort", sort === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search bar */}
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
            />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search destination…"
          defaultValue={q}
          onChange={(e) => updateParams("q", e.target.value)}
          className="w-full rounded-xl border border-sky-100 bg-white py-2 pl-9 pr-4 text-sm text-slate-700
            placeholder:text-slate-400 shadow-sm outline-none transition
            focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          aria-label="Search trips by destination"
        />
        {isPending && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              aria-hidden="true"
              className="h-4 w-4 animate-spin text-sky-500"
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
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Sort button */}
      <button
        type="button"
        onClick={toggleSort}
        className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2 text-sm
          font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700
          focus:outline-none focus:ring-2 focus:ring-sky-100 active:scale-95"
        aria-label={`Sort by date ${sort === "asc" ? "descending" : "ascending"}`}
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 text-sky-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          {sort === "asc" ? (
            // Arrow up (oldest first)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h13M3 8h9m-9 4h6m4 0 4-4m0 0 4 4m-4-4v12"
            />
          ) : (
            // Arrow down (newest first)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0-4-4m4 4 4-4"
            />
          )}
        </svg>
        <span>{sort === "asc" ? "Newest first" : "Oldest first" }</span>
      </button>
    </div>
  );
}
