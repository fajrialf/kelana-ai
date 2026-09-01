"use client";

import { useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Decodes the JWT stored in localStorage under "session".
 * Clears the token if it is malformed or expired.
 * Returns null until mounted (avoids SSR/hydration mismatch).
 */
export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("session");
    if (!token) return;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Malformed token");

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        throw new Error("Token expired");
      }

      setUser({
        id: payload.sub ?? "",
        name: payload.name ?? "",
        email: payload.email ?? "",
      });
    } catch {
      localStorage.removeItem("session");
      setUser(null);
    }
  }, []);

  return user;
}
