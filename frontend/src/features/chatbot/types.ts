// types/chat.ts
export type ParserType = "openai" | "gemini" | "qwen" | "nlp";

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  createdAt: string | Date;
}

export interface SendMessagePayload {
  message: string;
  parser: ParserType;
}
