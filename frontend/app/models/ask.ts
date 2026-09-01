export interface AskPayload {
  question: string;
}

export interface AskResponse {
  question: string;
  answer: string;
  documents: string[];
}
