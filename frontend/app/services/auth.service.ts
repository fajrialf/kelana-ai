import { AuthResponse } from "../models/auth.response";
import { LoginPayload } from "../models/login.payload";
import { RegisterPayload } from "../models/register.payload";
import { User } from "../models/user";
import { apiFetch } from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function authRegister(payload: RegisterPayload): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function authLogin(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

export interface MeResponse {
  name: string;
  email: string;
  trips_generated: number;
}

async function getMe(): Promise<MeResponse> {
  const response = await apiFetch(`${BASE_URL}/api/v1/auth/me`, {
    method: "GET",
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

export { authLogin, authRegister, getMe };
