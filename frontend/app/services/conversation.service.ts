import { Conversation, Message, SendMessageResponse } from "../models/conversation";
import { apiFetch } from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function createConversation(title: string): Promise<Conversation> {
  const response = await apiFetch(`${BASE_URL}/api/v1/conversations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function listConversations(): Promise<Conversation[]> {
  const response = await apiFetch(`${BASE_URL}/api/v1/conversations`, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function getMessages(conversationId: number): Promise<Message[]> {
  const response = await apiFetch(
    `${BASE_URL}/api/v1/conversations/${conversationId}/messages`,
    { method: "GET", cache: "no-store" }
  );
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function sendMessage(
  conversationId: number,
  content: string
): Promise<SendMessageResponse> {
  const response = await apiFetch(
    `${BASE_URL}/api/v1/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    }
  );
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function updateConversation(conversationId: number, title: string): Promise<Conversation> {
  const response = await apiFetch(`${BASE_URL}/api/v1/conversations/${conversationId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  return response.json();
}

async function deleteConversation(conversationId: number): Promise<void> {
  const response = await apiFetch(`${BASE_URL}/api/v1/conversations/${conversationId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
}

export { createConversation, listConversations, getMessages, sendMessage, updateConversation, deleteConversation };
