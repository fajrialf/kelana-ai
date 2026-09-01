"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Checks for a valid, non-expired "session" JWT in localStorage.
 * - No token → redirect to /auth/login.
 * - Token present but expired or malformed → clear it, then redirect.
 * - Token valid → set ready = true so protected content can render.
 */
export function useAuthGuard(): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Malformed token");

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        throw new Error("Token expired");
      }

      setReady(true);
    } catch {
      localStorage.removeItem("session");
      router.replace("/auth/login");
    }
  }, [router]);

  return ready;
}
