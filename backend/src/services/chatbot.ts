import { randomUUID } from "node:crypto";
import { GoogleGenAI, Type } from "@google/genai";
import Groq from "groq-sdk";
import * as chrono from "chrono-node";
import nlp from "compromise";
import { CalendarEvent } from "../types/calendar.js";

const CALENDAR_COLORS = [
  "#0842a0",
  "#c2577a",
  "#d17b93",
  "#e0917e",
  "#d9603f",
  "#d98a3f",
  "#d9a13f",
  "#d9c05a",
  "#c9cf6a",
  "#b9cf6a",
  "#8fc46a",
  "#6bbf7a",
  "#5fb894",
  "#4fae94",
  "#5b9bd5",
  "#6b8fd5",
  "#7b87d5",
  "#8f87d5",
  "#b09fe0",
  "#a880d0",
  "#a855c9",
  "#9d7a6a",
  "#8f8f8f",
  "#b3ab8f",
];

export const GEMINI_MODEL = process.env.GEMINI_MODEL!;

// ---------------- IST helpers ---------------- // IST
const IST_TIMEZONE = "Asia/Kolkata";
const IST_OFFSET_MINUTES = 330; // UTC+05:30, India has no DST
const IST_OFFSET_SUFFIX = "+05:30";

// Date -> "2026-10-12T09:00:00+05:30" (independent of server timezone)
function toISTISOString(date: Date): string {
  const shifted = new Date(date.getTime() + IST_OFFSET_MINUTES * 60_000);
  return shifted.toISOString().slice(0, 19) + IST_OFFSET_SUFFIX;
}

// Date -> "HH:mm" in IST
function toISTTime(date: Date): string {
  return toISTISOString(date).slice(11, 16);
}

// Prompt-friendly "now" string, e.g. "2026-10-11T14:30:00+05:30 (Sunday)"
function nowISTForPrompt(): string {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: IST_TIMEZONE,
  });
  return `${toISTISOString(now)} (${weekday}, India Standard Time)`;
}

// Make sure model-produced timestamps carry the IST offset.
// - date-only values ("2026-10-12") are left alone (all-day events)
// - values with "Z" or another offset are converted to IST
// - naive values ("2026-10-12T09:00:00") are assumed to be IST
function ensureIST(value?: string | null): string | undefined {
  if (!value) return undefined; // handles undefined, null and ""
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  if (/(Z|[+-]\d{2}:?\d{2})$/i.test(v)) {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : toISTISOString(d);
  }
  return v.slice(0, 19) + IST_OFFSET_SUFFIX;
}

type RawModelResult = { message?: string; events?: Partial<CalendarEvent>[] };

// Shared cleanup for LLM output: fresh UUIDs, valid colors, safe defaults
function normalizeResult(raw: RawModelResult): {
  message: string;
  events: CalendarEvent[];
} {
  const events = (raw.events ?? []).map((evt, i) => {
    const color =
      evt.color && CALENDAR_COLORS.includes(evt.color)
        ? evt.color
        : CALENDAR_COLORS[i % CALENDAR_COLORS.length];

    return {
      id: randomUUID(), // never trust model-generated ids
      title: evt.title?.trim() || "Scheduled Task",
      description: evt.description ?? null,
      start: ensureIST(evt.start)!, // IST
      end: ensureIST(evt.end)!, // IST
      allDay: evt.allDay ?? false,
      color,
      link: evt.link ?? null,
      daysOfWeek: evt.daysOfWeek?.length ? evt.daysOfWeek : null,
      startRecur: ensureIST(evt.startRecur) ?? null, // IST
      endRecur: ensureIST(evt.endRecur) ?? null, // IST
      startTime: evt.startTime ?? null,
      endTime: evt.endTime ?? null,
    } as CalendarEvent;
  });

  return {
    message: raw.message || `Extracted ${events.length} event(s).`,
    events,
  };
}

function safeParseJson(text: string): RawModelResult {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The AI model returned invalid JSON. Please try again.");
  }
}

// ---------------- NLP ----------------
export function extractEvents(input: string): {
  message: string;
  events: CalendarEvent[];
} {
  const doc = nlp(input);
  const clauses = doc.clauses().out("array") as string[];
  const events: CalendarEvent[] = [];

  // IST: tell chrono "now" is in IST so "tomorrow", "5pm" etc. resolve correctly
  const reference = { instant: new Date(), timezone: IST_OFFSET_MINUTES };

  clauses.forEach((clause) => {
    const parsedResults = chrono.parse(clause, reference, {
      forwardDate: true,
    });

    parsedResults.forEach((parsed) => {
      const startDate = parsed.start.date();
      const endDate = parsed.end
        ? parsed.end.date()
        : new Date(startDate.getTime() + 60 * 60 * 1000);

      let title = clause.replace(parsed.text, "").trim();
      title = title
        .replace(/^(and|oh|also|i need to|don't forget|probably|my)\s+/i, "")
        .trim();
      if (!title) title = "Scheduled Task";

      const colorIndex = title.length % CALENDAR_COLORS.length;

      events.push({
        id: randomUUID(),
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description: `Extracted from text: "${clause.trim()}"`,
        start: toISTISOString(startDate), // IST
        end: toISTISOString(endDate), // IST
        allDay: !parsed.start.isCertain("hour"),
        color: CALENDAR_COLORS[colorIndex],
        link: null,
        daysOfWeek: null,
        startRecur: null,
        endRecur: null,
        startTime: parsed.start.isCertain("hour")
          ? toISTTime(startDate) // IST
          : null,
        endTime:
          parsed.end && parsed.end.isCertain("hour")
            ? toISTTime(endDate) // IST
            : null,
      });
    });
  });

  return {
    message: `Successfully extracted ${events.length} event(s) from input.`,
    events,
  };
}

// ---------------- GROQ ----------------
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export const GROQ_OPENAI_MODEL =
  process.env.GROQ_OPENAI_MODEL || "openai/gpt-oss-20b";
export const GROQ_QWEN_MODEL = process.env.GROQ_QWEN_MODEL || "qwen/qwen3-32b";

const promptSchema = {
  message: "Friendly summary message of scheduled items",
  events: [
    {
      title: "Event Title",
      description: "Details or notes",
      start:
        "ISO 8601 string with +05:30 offset (e.g. 2026-10-12T09:00:00+05:30)", // IST
      end: "ISO 8601 string with +05:30 offset (e.g. 2026-10-12T10:00:00+05:30)", // IST
      allDay: false,
      color: "Hex color chosen strictly from the allowed palette",
      link: "optional URL or null",
      daysOfWeek: "optional array of 0-6 (0 = Sunday) for recurring events",
      startRecur: "optional ISO date for recurrence start",
      endRecur: "optional ISO date for recurrence end",
      startTime: "optional HH:mm (IST) for recurring events",
      endTime: "optional HH:mm (IST) for recurring events",
    },
  ],
};

export async function extractEventsGroq(model: string, text: string) {
  const response = await groq.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an AI calendar event parser. Extract events from user text into valid JSON matching this schema structure:
${JSON.stringify(promptSchema, null, 2)}

Allowed color palette: ${JSON.stringify(CALENDAR_COLORS)}
Current date/time: ${nowISTForPrompt()}. Resolve relative dates ("tomorrow", "next Friday") from it.
The user is in India. All times are in Indian Standard Time (IST, UTC+05:30) unless stated otherwise. Always output start/end with the +05:30 offset.
Output ONLY valid JSON.`, // IST
      },
      { role: "user", content: text },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq model");

  return normalizeResult(safeParseJson(content));
}

// ---------------- GEMINI ----------------
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function extractEventGemini(text: string) {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    // IST
    contents: `Current date/time: ${nowISTForPrompt()}.
The user is in India. Interpret all times as Indian Standard Time (IST, UTC+05:30) unless stated otherwise, and output start/end as ISO 8601 with the +05:30 offset.

${text}`,
    config: {
      temperature: 0.2, // lower = more reliable structured output
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: {
            type: Type.STRING,
            description:
              "A summary or introductory message about the schedule.",
          },
          events: {
            type: Type.ARRAY,
            description: "An array of FullCalendar.js event objects.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                start: {
                  type: Type.STRING,
                  description:
                    "ISO 8601 start date/time in IST with +05:30 offset", // IST
                },
                end: {
                  type: Type.STRING,
                  description:
                    "ISO 8601 end date/time in IST with +05:30 offset", // IST
                },
                allDay: { type: Type.BOOLEAN },
                link: { type: Type.STRING },
                color: {
                  type: Type.STRING,
                  enum: CALENDAR_COLORS,
                  description:
                    "Hex color from the palette based on event context",
                },
                daysOfWeek: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER },
                  description:
                    "Days of week for recurring events (0 = Sunday, 1 = Monday, etc.)",
                },
                startRecur: { type: Type.STRING },
                endRecur: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
              },
              required: ["title", "start", "end", "allDay"],
            },
          },
        },
        required: ["message", "events"],
      },
    },
  });

  if (!response.text) throw new Error("Empty response from Gemini model");

  return normalizeResult(safeParseJson(response.text));
}
