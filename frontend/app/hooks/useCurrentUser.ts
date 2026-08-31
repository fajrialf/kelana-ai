"use client";

import { useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Decodes the JWT stored in localStorage under "session".
 * Returns null until mounted (avoids SSR/hydration mismatch).
 */
export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("session");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: payload.sub ?? "",
        name: payload.name ?? "",
        email: payload.email ?? "",
      });
    } catch {
      setUser(null);
    }
  }, []);

  return user;
}
