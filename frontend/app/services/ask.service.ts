import { AskPayload, AskResponse } from "../models/ask";
import { apiFetch } from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function askQuestion(payload: AskPayload): Promise<AskResponse> {
  const response = await apiFetch(`${BASE_URL}/api/v1/ask`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

export { askQuestion };
