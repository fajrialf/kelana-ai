/**
 * LoadingScreen
 * Full-page loading state that matches the KelanaAI sky/blue theme.
 * Shown while useAuthGuard() verifies the JWT before rendering protected pages.
 */
export default function LoadingScreen() {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 flex flex-col items-center justify-center gap-8 px-4"
      aria-label="Loading"
      aria-busy="true"
    >
      {/* Plane icon with spin animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring */}
        <span className="absolute h-24 w-24 rounded-full bg-sky-200/60 blur-xl" aria-hidden="true" />

        {/* Circle track */}
        <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-sky-100 bg-white shadow-[0_8px_32px_rgba(14,116,144,0.18)]">
          <svg
            aria-hidden="true"
            className="h-9 w-9 text-sky-500"
            style={{ animation: "spinPlane 1.6s ease-in-out infinite" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </span>
      </div>

      {/* Brand + message */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
          AI-powered journey planner
        </p>
        <h1 className="text-2xl font-bold text-slate-800">KelanaAI</h1>
        <p className="text-sm text-slate-400">Preparing your journey…</p>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-2" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-sky-400"
            style={{
              animation: `loadingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </main>
  );
}
