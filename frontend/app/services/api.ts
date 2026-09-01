/**
 * Wrapper around fetch that:
 * - Injects the Authorization header from localStorage when a token exists.
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

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    clearSession();
    window.location.replace("/auth/login");
    throw new UnauthorizedError();
  }

  return response;
}
