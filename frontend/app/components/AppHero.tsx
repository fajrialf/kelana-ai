interface AppHeroProps {
  label?: string;
  title?: string;
  subtitle?: string;
}

export default function AppHero({ label, title = "KelanaAI", subtitle }: AppHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-sky-100 shadow-[0_24px_80px_rgba(14,116,144,0.22)]">
      <img
        src="/assets/bg-cloud-shadow.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative flex min-h-[160px] items-center px-8 py-10 sm:min-h-[180px] sm:px-12 sm:py-14">
        <div className="flex max-w-lg flex-col gap-3">
          {label && (
            <p
              className="text-xs font-semibold uppercase tracking-widest text-sky-100"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            >
              {label}
            </p>
          )}
          <h1
            className="text-4xl font-bold text-sky-200 sm:text-5xl"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="max-w-sm text-sm leading-6 text-sky-300"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.55)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
