"use client";

import { useEffect } from "react";

export type ToastVariant = "error" | "success" | "info";

interface ToastProps {
  message: string;
  title?: string;
  variant?: ToastVariant;
  onClose: () => void;
  /** Auto-dismiss after ms. Set to 0 to disable. Default: 4000 */
  duration?: number;
}

const variants = {
  error: {
    border: "border-red-200",
    shadow: "shadow-red-100",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    titleColor: "text-slate-950",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    ),
  },
  success: {
    border: "border-emerald-200",
    shadow: "shadow-emerald-100",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    titleColor: "text-slate-950",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    ),
  },
  info: {
    border: "border-sky-200",
    shadow: "shadow-sky-100",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    titleColor: "text-slate-950",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z" />
    ),
  },
};

export default function Toast({
  message,
  title,
  variant = "error",
  onClose,
  duration = 4000,
}: ToastProps) {
  const v = variants[variant];

  // Auto-dismiss
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const defaultTitle = variant === "error" ? "Something went wrong" : variant === "success" ? "Success" : "Info";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-[fadeSlideDown_0.3s_ease-out]
        flex items-start gap-3 rounded-2xl border ${v.border} bg-white px-5 py-3.5
        shadow-lg ${v.shadow} max-w-sm w-[calc(100vw-2rem)]`}
    >
      {/* Icon */}
      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${v.iconBg}`}>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 ${v.iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          {v.icon}
        </svg>
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${v.titleColor}`}>{title ?? defaultTitle}</p>
        <p className="mt-0.5 text-xs text-slate-500 break-words">{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="mt-0.5 shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600"
      >
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
