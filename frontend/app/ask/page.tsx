"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import AppNav from "../components/AppNav";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { askQuestion } from "../services/ask.service";
import { AskResponse } from "../models/ask";

export default function AskPage() {
  useAuthGuard();

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!question.trim()) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = await askQuestion({ question: question.trim() });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-sky-100 px-8 py-10 shadow-[0_24px_80px_rgba(14,116,144,0.22)] sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img src="/assets/bg-cloud-shadow.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="relative flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">
              AI travel assistant
            </p>
            <h1 className="text-4xl font-bold text-sky-100 sm:text-5xl">Ask KelanaAI</h1>
            <p className="max-w-sm text-sm leading-6 text-sky-100">
              Ask any travel question — destinations, tips, budgets, packing lists — and get an instant AI-powered answer.
            </p>
          </div>
        </header>

        <AppNav active="ask" />

        {/* Question form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur"
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Your question</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ask anything about travel destinations, planning, or recommendations.
            </p>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are the best places to visit in Bali on a $1000 budget?"
            rows={4}
            required
            className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 resize-none"
          />

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-500 hover:to-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        {/* Answer */}
        {result && (
          <section className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur">
            <div className="flex flex-col gap-1 border-b border-sky-100 pb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">Your question</p>
              <p className="text-sm font-medium text-slate-800">{result.question}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">Answer</p>
              <div className="prose prose-sm prose-slate max-w-none text-slate-800
                prose-headings:text-slate-900 prose-headings:font-semibold
                prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900
                prose-code:rounded prose-code:bg-sky-50 prose-code:px-1 prose-code:py-0.5 prose-code:text-sky-700
                prose-ul:pl-4 prose-ol:pl-4">
                <ReactMarkdown>{result.answer}</ReactMarkdown>
              </div>
            </div>

            {result.documents.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-sky-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">
                  Sources
                </p>
                <ul className="flex flex-col gap-1.5">
                  {result.documents.map((doc, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2 text-xs text-slate-700"
                    >
                      <span className="shrink-0 text-sky-400">📄</span>
                      <span className="truncate">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur animate-pulse">
            <div className="h-3 w-24 rounded bg-sky-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-16 rounded bg-sky-100" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-5/6 rounded bg-slate-100" />
              <div className="h-3 w-4/5 rounded bg-slate-100" />
            </div>
          </div>
        )}

      </div>

      <footer className="mx-auto mt-12 w-full max-w-7xl border-t border-sky-100 px-4 py-6 sm:px-6 lg:px-8">
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
