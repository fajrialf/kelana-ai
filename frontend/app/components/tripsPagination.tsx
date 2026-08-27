"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface TripsPaginationProps {
  page: number;
  totalPages: number;
}

export default function TripsPagination({ page, totalPages }: TripsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    startTransition(() => {
      router.push(`/trips?${params.toString()}`);
    });
  };

  // Build page number list with ellipsis: always show first, last, current ±1
  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const pages: (number | "…")[] = [];
  const delta = 1;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push("…");
  pages.push(...range(left, right));
  if (right < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  const btnBase =
    "flex h-9 min-w-[36px] items-center justify-center rounded-xl border px-2 text-sm font-medium transition select-none";
  const btnActive =
    "border-sky-500 bg-sky-600 text-white shadow-sm shadow-sky-200";
  const btnDefault =
    "border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700";
  const btnDisabled =
    "border-sky-100 bg-white text-slate-300 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 transition-opacity ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${btnBase} gap-1 ${page <= 1 ? btnDisabled : btnDefault}`}
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="sr-only sm:not-sr-only">Prev</span>
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`${btnBase} ${p === page ? btnActive : btnDefault}`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${btnBase} gap-1 ${page >= totalPages ? btnDisabled : btnDefault}`}
      >
        <span className="sr-only sm:not-sr-only">Next</span>
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
