import { ApiError } from "../services/apiChatbot";

export function getFriendlyErrorMessage(error: unknown): string {
  const fallback = "Something went wrong. Please try again.";

  // No connection or server down: fetch throws a TypeError
  if (error instanceof TypeError) {
    return "Can't reach the server. Please check your connection and try again.";
  }

  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Your session has expired. Please sign in again.";
    }
    if (error.status === 429) {
      return "You're sending messages too quickly. Please wait a moment and try again.";
    }
    if (error.status === 400) {
      return error.message || "Please type a message first.";
    }
    if (error.status >= 500 && !error.message) {
      return "The server ran into a problem. Please try again shortly.";
    }

    // Use the backend message only if it's a clean sentence, never raw JSON
    const msg = error.message;
    if (msg && !/[{}]/.test(msg) && msg.length < 200) return msg;
  }

  return fallback;
}
