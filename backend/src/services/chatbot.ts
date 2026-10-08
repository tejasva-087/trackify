import { GoogleGenAI, Type, type Chat, type Content } from "@google/genai";
import { randomUUID } from "node:crypto";
import AppError from "../utils/appError.js";
import type { CalendarEvent, MessageResponse } from "../types/calendar.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash-lite";

const HISTORY_TTL_SECONDS = 60 * 60 * 24 * 7; // keep a conversation for 7 days
const MAX_HISTORY_MESSAGES = 40; // cap tokens/cost per request

// ---------------------------------------------------------------------------
// Structured output schema (forces Gemini to return valid JSON in our shape)
// ---------------------------------------------------------------------------
const nullableString = { type: Type.STRING, nullable: true };

const eventSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    description: nullableString,
    start: { type: Type.STRING },
    end: { type: Type.STRING },
    allDay: { type: Type.BOOLEAN },
    link: nullableString,
    color: nullableString,
    daysOfWeek: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      nullable: true,
    },
    startRecur: nullableString,
    endRecur: nullableString,
    startTime: nullableString,
    endTime: nullableString,
  },
  required: ["id", "title", "start", "end", "allDay"],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    events: { type: Type.ARRAY, items: eventSchema },
    message: { type: Type.STRING },
  },
  required: ["events", "message"],
};

const SYSTEM_INSTRUCTION = `
You are a calendar assistant. The user describes plans in natural language and you turn them into calendar events.

Output rules:
- Respond ONLY with JSON matching the provided schema: { events: CalendarEvent[], message: string }.
- "events" contains only the events created or changed in THIS turn. If nothing changed, return [].
- "message" is a short, friendly summary of what you did, including any assumptions you made. If the user is just chatting or asking a question, answer in "message" and return [].

Event rules:
- Resolve relative dates ("tomorrow", "next Friday") using the current date/time and timezone given at the start of each user message.
- "start" and "end" are ISO 8601 strings with the timezone offset, e.g. "2026-10-09T09:00:00+05:30".
- For all-day events, set allDay=true and use date-only strings ("2026-10-09"); "end" is the day after the last day (exclusive).
- If no duration is given, assume 1 hour. Events described in sequence ("then ...") must not overlap; if a duration is missing for something like work, assume a sensible one (e.g. 8 hours for a work day) and mention that in "message".
- Recurring events (e.g. "every Mon and Wed at 6 PM"): set daysOfWeek (0=Sunday ... 6=Saturday), startTime/endTime as "HH:mm", and startRecur/endRecur as "YYYY-MM-DD" when known. start/end should still be the first occurrence.
- Use null for any optional field you do not have. Generate a unique id (a UUID) for each new event.
- Never invent links. Optionally pick a hex "color" if the user asks for one.
- Events you returned earlier are in the conversation history. For follow-ups such as "move the gym to 7 PM", return the updated event reusing the SAME id.
`.trim();

// ---------------------------------------------------------------------------
// History storage (in-memory, per user). Lost on server restart.
// ---------------------------------------------------------------------------
const histories = new Map<string, { history: Content[]; updatedAt: number }>();

function loadHistory(userId: string): Content[] {
  const entry = histories.get(userId);
  if (!entry) return [];
  if (Date.now() - entry.updatedAt > HISTORY_TTL_SECONDS * 1000) {
    histories.delete(userId);
    return [];
  }
  return entry.history;
}

function saveHistory(userId: string, history: Content[]) {
  const trimmed = history.slice(-MAX_HISTORY_MESSAGES);
  // Gemini requires the conversation to start with a user turn.
  while (trimmed.length > 0 && trimmed[0]?.role !== "user") trimmed.shift();

  histories.set(userId, { history: trimmed, updatedAt: Date.now() });
}

export function clearHistory(userId: string) {
  histories.delete(userId);
}

// Periodically drop expired conversations so memory doesn't grow forever.
setInterval(
  () => {
    const cutoff = Date.now() - HISTORY_TTL_SECONDS * 1000;
    for (const [userId, entry] of histories) {
      if (entry.updatedAt < cutoff) histories.delete(userId);
    }
  },
  60 * 60 * 1000,
).unref();

// ---------------------------------------------------------------------------
// Gemini call with retry + fallback model
// - 503/429/500/504: retry once, then move to the next model
// - 404 (model retired/unavailable): skip straight to the next model
// ---------------------------------------------------------------------------
const RETRYABLE_STATUS = new Set([429, 500, 503, 504]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendWithRetry(history: Content[], prompt: string) {
  const models = [...new Set([MODEL, FALLBACK_MODEL])];
  let lastErr: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const chat = ai.chats.create({
          model,
          history,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.2,
          },
        });
        const response = await chat.sendMessage({ message: prompt });
        return { chat, text: response.text };
      } catch (err) {
        lastErr = err;
        const status = (err as { status?: number }).status;

        if (status === 404) {
          console.error(`Model ${model} is not available, skipping`);
          break; // go to the next model
        }

        if (!status || !RETRYABLE_STATUS.has(status)) throw err; // not temporary

        console.error(
          `Gemini ${model} attempt ${attempt + 1} failed (${status})`,
        );
        if (attempt === 0) await sleep(1000);
      }
    }
  }
  throw lastErr;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------
export async function processChatMessage(
  userId: string,
  userMessage: string,
  timeZone: string,
): Promise<MessageResponse> {
  const history = loadHistory(userId);

  // The date changes every turn, so it goes in the message, not the system prompt.
  const localNow = new Intl.DateTimeFormat("en-US", {
    timeZone,
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date());

  const prompt = `Current date/time: ${localNow} (timezone: ${timeZone})\nUser: ${userMessage}`;

  let chat: Chat;
  let text: string | undefined;
  try {
    ({ chat, text } = await sendWithRetry(history, prompt));
  } catch (err) {
    console.error("Gemini error:", err);
    const status = (err as { status?: number }).status;
    const msg =
      status === 503 || status === 429
        ? "The AI is busy right now. Please try again in a minute."
        : "The AI service is unavailable right now. Please try again.";
    throw new AppError(msg, 502, { cause: err });
  }

  let parsed: MessageResponse;
  try {
    parsed = JSON.parse(text ?? "") as MessageResponse;
  } catch (err) {
    throw new AppError(
      "Couldn't understand the AI response. Please try rephrasing.",
      502,
      { cause: err },
    );
  }

  // Only persist the turn once we know it produced a valid response.
  saveHistory(userId, chat.getHistory());

  const events: CalendarEvent[] = (parsed.events ?? []).map((e) => ({
    ...e,
    id: e.id || randomUUID(),
  }));

  return { events, message: parsed.message ?? "" };
}
