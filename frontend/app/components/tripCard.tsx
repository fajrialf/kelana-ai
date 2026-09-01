import { Trip } from "../models/trip";
import { deleteTrip } from "../services/trip.service";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface TripCardProps {
  trip: Trip;
  onDeleted?: (id: number) => void;
}

// ── Flag ──────────────────────────────────────────────────────────────────────

function destinationToCountryCode(destination: string): string | null {
  const dest = destination.toLowerCase();

  const map: [string, string][] = [
    // Indonesia
    ["bali", "id"], ["jakarta", "id"], ["yogyakarta", "id"], ["lombok", "id"],
    ["surabaya", "id"], ["bandung", "id"], ["manado", "id"], ["medan", "id"],
    ["komodo", "id"], ["raja ampat", "id"], ["labuan bajo", "id"], ["flores", "id"],
    ["indonesia", "id"],
    // Southeast Asia
    ["bangkok", "th"], ["phuket", "th"], ["chiang mai", "th"], ["thailand", "th"],
    ["singapore", "sg"],
    ["kuala lumpur", "my"], ["langkawi", "my"], ["malaysia", "my"],
    ["hanoi", "vn"], ["ho chi minh", "vn"], ["hoi an", "vn"], ["halong", "vn"], ["vietnam", "vn"],
    ["phnom penh", "kh"], ["siem reap", "kh"], ["cambodia", "kh"],
    ["bagan", "mm"], ["yangon", "mm"], ["myanmar", "mm"],
    ["manila", "ph"], ["palawan", "ph"], ["cebu", "ph"], ["boracay", "ph"], ["philippines", "ph"],
    ["luang prabang", "la"], ["vientiane", "la"], ["laos", "la"],
    // East Asia
    ["tokyo", "jp"], ["osaka", "jp"], ["kyoto", "jp"], ["japan", "jp"],
    ["seoul", "kr"], ["busan", "kr"], ["korea", "kr"],
    ["beijing", "cn"], ["shanghai", "cn"], ["guilin", "cn"], ["chengdu", "cn"], ["china", "cn"],
    ["taipei", "tw"], ["taiwan", "tw"],
    ["hong kong", "hk"],
    ["macau", "mo"],
    // South Asia
    ["delhi", "in"], ["mumbai", "in"], ["jaipur", "in"], ["goa", "in"], ["agra", "in"], ["india", "in"],
    ["kathmandu", "np"], ["pokhara", "np"], ["nepal", "np"],
    ["maldives", "mv"],
    ["colombo", "lk"], ["sri lanka", "lk"],
    // Europe
    ["paris", "fr"], ["nice", "fr"], ["lyon", "fr"], ["france", "fr"],
    ["rome", "it"], ["venice", "it"], ["florence", "it"], ["milan", "it"], ["italy", "it"],
    ["barcelona", "es"], ["madrid", "es"], ["seville", "es"], ["spain", "es"],
    ["london", "gb"], ["edinburgh", "gb"], ["england", "gb"],
    ["amsterdam", "nl"], ["netherlands", "nl"],
    ["berlin", "de"], ["munich", "de"], ["germany", "de"],
    ["prague", "cz"],
    ["vienna", "at"], ["austria", "at"],
    ["zurich", "ch"], ["switzerland", "ch"],
    ["lisbon", "pt"], ["portugal", "pt"],
    ["athens", "gr"], ["santorini", "gr"], ["greece", "gr"],
    ["istanbul", "tr"], ["turkey", "tr"],
    ["budapest", "hu"],
    ["stockholm", "se"], ["sweden", "se"],
    ["oslo", "no"], ["norway", "no"],
    ["copenhagen", "dk"], ["denmark", "dk"],
    // Americas
    ["new york", "us"], ["los angeles", "us"], ["las vegas", "us"],
    ["miami", "us"], ["chicago", "us"], ["san francisco", "us"], ["usa", "us"],["america", "us"],
    ["toronto", "ca"], ["vancouver", "ca"], ["canada", "ca"],
    ["cancun", "mx"], ["mexico city", "mx"], ["mexico", "mx"],
    ["rio de janeiro", "br"], ["sao paulo", "br"], ["brazil", "br"],
    ["buenos aires", "ar"], ["argentina", "ar"],
    ["machu picchu", "pe"], ["lima", "pe"], ["peru", "pe"],
    // Middle East
    ["dubai", "ae"], ["abu dhabi", "ae"],
    ["cairo", "eg"], ["egypt", "eg"],
    // Africa
    ["marrakech", "ma"], ["morocco", "ma"],
    ["cape town", "za"], ["johannesburg", "za"], ["south africa", "za"],
    // Oceania
    ["sydney", "au"], ["melbourne", "au"], ["great barrier reef", "au"], ["australia", "au"],
    ["auckland", "nz"], ["queenstown", "nz"], ["new zealand", "nz"],
    ["fiji", "fj"],
  ];

  for (const [keyword, code] of map) {
    if (dest.includes(keyword)) return code;
  }
  return null;
}

// ── Category ──────────────────────────────────────────────────────────────────

function categoryStyle(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("luxury"))
    return "bg-purple-50 text-purple-700 ring-purple-200";
  if (c.includes("standard"))
    return "bg-slate-100 text-slate-700 ring-slate-200";
  return "bg-lime-50 text-lime-700 ring-lime-200";

}

// ── Travel style ──────────────────────────────────────────────────────────────

const TRAVEL_STYLES: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
  solo: {
    label: "Solo",
    classes: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: (
      <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  duo: {
    label: "Duo",
    classes: "bg-pink-50 text-pink-700 ring-pink-200",
    icon: (
      <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="8" r="3.5" />
        <circle cx="16" cy="8" r="3.5" />
        <path strokeLinecap="round" d="M2 20c0-3.5 3-6 7-6m4 0c3.8 0 7 2.5 7 6" />
      </svg>
    ),
  },
  family: {
    label: "Family",
    classes: "bg-yellow-50 text-yellow-700 ring-yellow-200",
    icon: (
      <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="7" r="3" />
        <circle cx="16" cy="7" r="3" />
        <circle cx="12" cy="17" r="2.5" />
        <path strokeLinecap="round" d="M2 19c0-3 2.5-5 6-5m8 0c3.5 0 6 2 6 5" />
      </svg>
    ),
  },
  backpacker: {
    label: "Backpacker",
    classes: "bg-lime-50 text-lime-700 ring-lime-200",
    icon: (
      <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="7" y="4" width="10" height="15" rx="2" />
        <path strokeLinecap="round" d="M9 4V2.5A.5.5 0 0 1 9.5 2h5a.5.5 0 0 1 .5.5V4" />
        <path strokeLinecap="round" d="M7 9h10M7 13h10" />
        <path strokeLinecap="round" d="M10 19v2M14 19v2" />
      </svg>
    ),
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

import React, { useState } from "react";

export default function TripCard({ trip, onDeleted }: TripCardProps) {
  const countryCode = destinationToCountryCode(trip.destination);
  const catStyle = categoryStyle(trip.category);
  const styleMeta = trip.travel_style ? TRAVEL_STYLES[trip.travel_style] : null;
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      onDeleted?.(trip.id);
    } catch {
      alert("Failed to delete trip. Please try again.");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <>
    <a
      href={`/trips/${trip.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm
        transition-all duration-200 hover:border-sky-300 hover:shadow-md"
    >
      {/* Destination + badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
            {trip.destination}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {/* Category badge */}
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${catStyle}`}
            >
              {trip.category}
            </span>
            {/* Travel style badge */}
            {styleMeta && (
              <span
                className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styleMeta.classes}`}
              >
                {styleMeta.icon}
                {styleMeta.label}
              </span>
            )}
          </div>
        </div>

        {/* Country flag */}
        {countryCode ? (
          <span
            className={`fi fi-${countryCode} mt-0.5 shrink-0 rounded text-4xl shadow-sm ring-1 ring-slate-200`}
            role="img"
            aria-label={`Flag of ${trip.destination}`}
          />
        ) : (
          <svg
            aria-hidden="true"
            className="mt-0.5 h-7 w-9 shrink-0 text-slate-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 5.5V19m0-13.5C5 4 7 3 9 4s4 2 6 2 4-1 6-2v10c-2 1-4 2-6 2s-4-1-6-2-4-.5-6 .5" />
          </svg>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-0.5 rounded-xl bg-slate-50 p-3">
          <span className="text-xs text-slate-400">Duration</span>
          <span className="text-sm font-semibold text-slate-800">{trip.days} days</span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-xl bg-slate-50 p-3">
          <span className="text-xs text-slate-400">Budget</span>
          <span className="text-sm font-semibold text-slate-800">
            ${trip.budget.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-xl bg-slate-50 p-3">
          <span className="text-xs text-slate-400">Daily</span>
          <span className="text-sm font-semibold text-slate-800">
            ${trip.daily_budget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* AI recommendation preview */}
      {trip.ai_recommendation && (
        <p className="line-clamp-2 text-xs leading-5 text-slate-500">
          {trip.ai_recommendation}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">
          {new Date(trip.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete trip"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            {deleting ? (
              <svg aria-hidden="true" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
              </svg>
            )}
          </button>
          <span className="text-xs font-medium text-sky-600 group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </a>

    {showDeleteModal && (
      <DeleteConfirmModal
        destination={trip.destination}
        deleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    )}
  </>
  );
}
