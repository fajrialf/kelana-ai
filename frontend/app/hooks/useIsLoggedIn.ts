"use client";

import { useEffect, useState } from "react";

/**
 * Returns true if a valid, non-expired JWT session exists in localStorage.
 * Does NOT redirect — use useAuthGuard for protected pages.
 * Returns null while mounting (avoids SSR/hydration mismatch on the nav).
 */
export function useIsLoggedIn(): boolean | null {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("session");

    if (!token) {
      setLoggedIn(false);
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

      setLoggedIn(true);
    } catch {
      localStorage.removeItem("session");
      setLoggedIn(false);
    }
  }, []);

  return loggedIn;
}
