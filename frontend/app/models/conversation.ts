export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface SendMessageResponse {
  conversation_id: number;
  user_message: Message;
  assistant_message: Message;
}
