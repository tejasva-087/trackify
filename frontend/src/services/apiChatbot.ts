const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

export type ParserType = "openai" | "gemini" | "qwen" | "nlp";

export interface SendMessageParams {
  message: string;
  parser: ParserType;
}

// Carries the HTTP status so the UI can pick a friendly message
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getChats() {
  try {
    const res = await fetch(`${API_URL}/chat`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch chats: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(
      "Error fetching chats:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}

export async function sendMessage({ message, parser }: SendMessageParams) {
  try {
    const res = await fetch(`${API_URL}/chat/${parser}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      // The rate limiter returns plain text, so JSON parsing may fail
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(errorData.message || "", res.status);
    }

    const json = await res.json();
    return json.data.response; // Unwraps { status: "success", data: { response: ... } }
  } catch (error) {
    console.error(
      "Error sending message:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}
