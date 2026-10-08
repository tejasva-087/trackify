import type { CalendarEvent } from "../features/application/context/CalenderContext";

const API_URL = import.meta.env.VITE_API_URL;

export type MessageResponse = {
  events: CalendarEvent[];
  message: string;
};

// Surfaces the backend's error message (validation, rate limit, AI failure)
async function getErrorMessage(res: Response) {
  const body = await res.json().catch(() => null);
  return (
    body?.message ?? `Failed to communicate: ${res.status} ${res.statusText}`
  );
}

export async function chatCalendar(message: string): Promise<MessageResponse> {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const res = await fetch(`${API_URL}/chat`, {
    credentials: "include",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, timeZone }),
  });

  if (!res.ok) throw new Error(await getErrorMessage(res));

  return res.json();
}

export async function resetChatbot(): Promise<void> {
  const res = await fetch(`${API_URL}/chatbot`, {
    credentials: "include",
    method: "DELETE",
  });

  if (!res.ok) throw new Error(await getErrorMessage(res));
}
