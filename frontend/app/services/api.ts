/**
 * Wrapper around fetch that:
 * - Injects the Authorization header from localStorage when a token exists.
 * - Injects the X-Frontend-Key header required by the backend middleware.
 * - On a 401 response, clears the session and redirects to /auth/login.
 */
export class UnauthorizedError extends Error {
  constructor() {
    super("Session expired. Please log in again.");
    this.name = "UnauthorizedError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("session");
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("session");
}

export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const frontendKey = process.env.NEXT_PUBLIC_FRONTEND_API_KEY ?? "";

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(frontendKey ? { "x-frontend-key": frontendKey } : {}),
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    clearSession();
    window.location.replace("/auth/login");
    throw new UnauthorizedError();
  }

  return response;
}
