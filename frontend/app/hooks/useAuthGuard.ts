"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirects to /auth/login if no "session" token is found in localStorage.
 * Returns `ready` — render nothing until it's true to avoid flash of protected content.
 */
export function useAuthGuard(): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session) {
      router.replace("/auth/login");
    } else {
      setReady(true);
    }
  }, [router]);

  return ready;
}
