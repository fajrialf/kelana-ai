"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown, { Components } from "react-markdown";
import { Trip } from "@/app/models/trip";
import { TripPayload } from "@/app/models/trip.payload";
import { getTrip, updateTrip, deleteTrip, shareTrip } from "@/app/services/trip.service";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import AppNav from "@/app/components/AppNav";
import AppHero from "@/app/components/AppHero";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import Toast from "@/app/components/Toast";
import LoadingScreen from "@/app/components/LoadingScreen";

function parseMarkdownSections(text: string): { title: string; body: string }[] {
  const lines = text.split("\n");
  const sections: { title: string; body: string }[] = [];
  let current: { title: string; body: string } | null = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h2 || h1) {
      if (current) sections.push(current);
      current = { title: (h2 ?? h1)![1].trim(), body: "" };
    } else {
      if (current) {
        current.body += line + "\n";
      } else if (line.trim()) {
        current = { title: "", body: line + "\n" };
      }
    }
  }

  if (current && (current.title || current.body.trim())) sections.push(current);
  return sections;
}

const mdComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-950">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold text-slate-950">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-3 text-base font-semibold text-sky-950">{children}</h3>,
  p: ({ children }) => <p className="text-sm leading-7 text-slate-700">{children}</p>,
  ul: ({ children }) => (
    <ul className="ml-4 list-disc space-y-2 text-sm leading-7 text-slate-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="ml-4 list-decimal space-y-2 text-sm leading-7 text-slate-700">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-sky-50 px-1.5 py-0.5 font-mono text-xs text-sky-800">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-sky-300 pl-4 text-sm italic text-slate-600">
      {children}
    </blockquote>
  ),
};

export default function TripDetail() {
  const ready = useAuthGuard();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<TripPayload>({
    destination: "",
    budget: 0,
    days: 0,
    travel_style: "",
  });
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState(false);

  // Share state
  const [sharing, setSharing] = useState(false);
  const [shareToast, setShareToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleShare() {
    setSharing(true);
    try {
      const { share_token } = await shareTrip(Number(id));
      const shareUrl = `${window.location.origin}/shared/${share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareToast({ message: "Share link copied to clipboard!", variant: "success" });
    } catch {
      setShareToast({ message: "Failed to generate share link.", variant: "error" });
    } finally {
      setSharing(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    getTrip(Number(id))
      .then((data) => {
        setTrip(data);
        setEditForm({
          destination: data.destination,
          budget: data.budget,
          days: data.days,
          travel_style: data.travel_style ?? "",
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load trip."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateTrip(Number(id), editForm);
      setTrip(updated);
      setEditOpen(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTrip(Number(id));
      router.replace("/trips");
    } catch {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  }

  const aiSections = trip?.ai_recommendation
    ? parseMarkdownSections(trip.ai_recommendation)
    : [];

  if (!ready) return <LoadingScreen />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      {shareToast && (
        <Toast
          message={shareToast.message}
          title={shareToast.variant === "success" ? "Link copied!" : "Share failed"}
          variant={shareToast.variant}
          onClose={() => setShareToast(null)}
        />
      )}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <AppHero
          label="AI-powered journey planner"
          subtitle="Describe your trip and get a full personalized itinerary — daily plans, budget breakdown, food, and transport — in seconds."
        />

        <AppNav active="trips" />

        <a
          href="/trips"
          className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 transition-colors"
        >
          ← Back to History
        </a>

        {/* Content */}
        {loading ? (
          <p className="text-sm text-slate-400">Loading trip…</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : trip && (
          <div className="flex flex-col gap-6">
            {/* Title + action buttons */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="mt-2 text-3xl font-bold text-slate-950">{trip.destination}</h2>
              <div className="flex shrink-0 items-center gap-2 pt-2">
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:opacity-60"
                >
                  {sharing ? (
                    <svg aria-hidden="true" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  )}
                  {sharing ? "Generating…" : "Share"}
                </button>
                <button
                  onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm transition hover:bg-sky-50"
                >
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-60"
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
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4">
                <span className="text-xs font-semibold uppercase text-sky-700">Destination</span>
                <p className="mt-1 font-semibold capitalize text-slate-950">{trip.destination}</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Duration</span>
                <p className="mt-1 font-semibold text-slate-950">{trip.days} days</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Budget</span>
                <p className="mt-1 font-semibold text-slate-950">${trip.budget.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4">
                <span className="text-xs font-semibold uppercase text-slate-500">Daily</span>
                <p className="mt-1 font-semibold text-slate-950">${trip.daily_budget.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <span className="text-xs font-semibold uppercase text-emerald-700">Category</span>
                <p className="mt-1 font-semibold capitalize text-slate-950">{trip.category}</p>
              </div>
            </div>

            {/* AI sections */}
            {aiSections.length > 0 && (
              <div className="grid gap-4">
                {aiSections.map((section, i) => (
                  <article key={i} className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
                    {section.title && (
                      <h3 className="mb-3 text-lg font-semibold text-sky-950">{section.title}</h3>
                    )}
                    <div className="flex flex-col gap-3">
                      <ReactMarkdown components={mdComponents}>{section.body}</ReactMarkdown>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {aiSections.length === 0 && trip.ai_recommendation && (
              <article className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3">
                  <ReactMarkdown components={mdComponents}>{trip.ai_recommendation}</ReactMarkdown>
                </div>
              </article>
            )}
          </div>
        )}
      </div>

      {/* ── Edit modal ────────────────────────────────────────────────────────── */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false); }}
        >
          <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950">Edit Trip</h3>
              <button
                onClick={() => setEditOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-destination" className="text-sm font-medium text-slate-700">
                  Destination
                </label>
                <input
                  id="edit-destination"
                  type="text"
                  value={editForm.destination}
                  onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                  required
                  className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-budget" className="text-sm font-medium text-slate-700">
                    Budget (USD)
                  </label>
                  <input
                    id="edit-budget"
                    type="number"
                    min={0}
                    value={editForm.budget}
                    onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                    required
                    className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="edit-days" className="text-sm font-medium text-slate-700">
                    Days
                  </label>
                  <input
                    id="edit-days"
                    type="number"
                    min={1}
                    value={editForm.days}
                    onChange={(e) => setEditForm({ ...editForm, days: Number(e.target.value) })}
                    required
                    className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-travel-style" className="text-sm font-medium text-slate-700">
                  Travel Style
                </label>
                <select
                  id="edit-travel-style"
                  value={editForm.travel_style}
                  onChange={(e) => setEditForm({ ...editForm, travel_style: e.target.value })}
                  className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="">Choose style</option>
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="family">Family</option>
                  <option value="backpacker">Backpacker</option>
                </select>
              </div>

              {saveError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {saveError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ─────────────────────────────────────────────── */}
      {deleteModalOpen && trip && (
        <DeleteConfirmModal
          destination={trip.destination}
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}

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
