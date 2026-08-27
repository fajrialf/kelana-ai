import { Trip } from "@/app/models/trip"
import { getTrip } from "@/app/services/trip.service";
import ReactMarkdown,{ Components } from "react-markdown";

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
export default async function getTripId({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let trip: Trip = await getTrip(Number(id));
    
    const mdComponents: Components = {
      h1: ({ children }) => (
        <h1 className="text-2xl font-bold text-slate-950">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl font-semibold text-slate-950">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-3 text-base font-semibold text-sky-950">{children}</h3>
      ),
      p: ({ children }) => (
        <p className="text-sm leading-7 text-slate-700">{children}</p>
      ),
      ul: ({ children }) => (
        <ul className="ml-4 list-disc space-y-2 text-sm leading-7 text-slate-700">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="ml-4 list-decimal space-y-2 text-sm leading-7 text-slate-700">
          {children}
        </ol>
      ),
      li: ({ children }) => <li>{children}</li>,
      strong: ({ children }) => (
        <strong className="font-semibold text-slate-950">{children}</strong>
      ),
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
      
    const aiSections = trip?.ai_recommendation
    ? parseMarkdownSections(trip.ai_recommendation)
    : [];
      return(
            <main className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <header className="relative overflow-hidden rounded-2xl border border-sky-100 px-8 py-10 shadow-[0_24px_80px_rgba(14,116,144,0.22)]
                  sm:px-12 sm:py-14">
                  {/* Background decoration */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  <img src="/assets/bg-cloud-shadow.jpg" alt="" className="absolute inset-0 h-full w-full" />
                  </div>
                
                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: brand + headline */}
                    <div className="flex flex-col gap-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">
                        AI-powered journey planner
                      </p>
                      <h1 className="text-4xl font-bold text-sky-100 sm:text-5xl">
                        KelanaAI
                      </h1>
                      <p className="max-w-sm text-sm leading-6 text-sky-100">
                        Describe your trip and get a full personalized itinerary —
                        daily plans, budget breakdown, food, and transport — in seconds.
                      </p>
                    </div>
                
                    {/* Right: stat chips */}
                    <div className="flex flex-wrap gap-3  sm:flex-col sm:items-end sm:gap-2">
                      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium
                text-sky-100 backdrop-blur">
                        <span>✈️</span>
                        <span>1,000+ itineraries generated</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium
                text-sky-100 backdrop-blur">
                        <span>🌍</span>
                        <span>50+ destinations covered</span>
                      </div>
                    </div>
                  </div>
                </header>
                <nav className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2 text-sm shadow-sm">
                  <a href="/" className="text-slate-500 hover:text-sky-700 transition-colors">Home</a>
                  <span className="text-slate-300">·</span>
                  <a href="/trips" className="text-slate-500 hover:text-sky-700 transition-colors">History</a>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-sky-700">Detail</span>
                </nav>
                <a
                  href="/trips"
                  className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-800 transition-colors"
                >
                  ← Back to History
                </a>
                {/* Trip list */}

                {trip && (
                              <div className="flex flex-col gap-6">
                                <div>
                                  <h2 className="mt-2 text-3xl font-bold text-slate-950">
                                    {trip.destination}
                                  </h2>
                                </div>
                
                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                  <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4">
                                    <span className="text-xs font-semibold uppercase text-sky-700">
                                      Destination
                                    </span>
                                    <p className="mt-1 font-semibold capitalize text-slate-950">
                                      {trip.destination}
                                    </p>
                                  </div>
                                  <div className="rounded-xl border border-sky-100 bg-white p-4">
                                    <span className="text-xs font-semibold uppercase text-slate-500">
                                      Duration
                                    </span>
                                    <p className="mt-1 font-semibold text-slate-950">
                                      {trip.days} days
                                    </p>
                                  </div>
                                  <div className="rounded-xl border border-sky-100 bg-white p-4">
                                    <span className="text-xs font-semibold uppercase text-slate-500">
                                      Budget
                                    </span>
                                    <p className="mt-1 font-semibold text-slate-950">
                                      ${trip.budget.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="rounded-xl border border-sky-100 bg-white p-4">
                                    <span className="text-xs font-semibold uppercase text-slate-500">
                                      Daily
                                    </span>
                                    <p className="mt-1 font-semibold text-slate-950">
                                      ${trip.daily_budget.toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                    <span className="text-xs font-semibold uppercase text-emerald-700">
                                      Category
                                    </span>
                                    <p className="mt-1 font-semibold capitalize text-slate-950">
                                      {trip.category}
                                    </p>
                                  </div>
                                </div>
                
                                {aiSections.length > 0 && (
                                  <div className="grid gap-4">
                                    {aiSections.map((section, i) => (
                                      <article
                                        key={i}
                                        className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm"
                                      >
                                        {section.title && (
                                          <h3 className="mb-3 text-lg font-semibold text-sky-950">
                                            {section.title}
                                          </h3>
                                        )}
                                        <div className="flex flex-col gap-3">
                                          <ReactMarkdown components={mdComponents}>
                                            {section.body}
                                          </ReactMarkdown>
                                        </div>
                                      </article>
                                    ))}
                                  </div>
                                )}
                
                                {aiSections.length === 0 && trip.ai_recommendation && (
                                  <article className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
                                    <div className="flex flex-col gap-3">
                                      <ReactMarkdown components={mdComponents}>
                                        {trip.ai_recommendation}
                                      </ReactMarkdown>
                                    </div>
                                  </article>
                                )}
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                        />
                      </svg>
                      Plan smarter, travel better
                    </span>
                    <span className="text-slate-300">·</span>
                    <span>© {new Date().getFullYear()} KelanaAI</span>
                  </div>
                </div>
              </footer>
            </main>
            )
}