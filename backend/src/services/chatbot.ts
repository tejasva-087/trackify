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

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
      start: evt.start!,
      end: evt.end!,
      allDay: evt.allDay ?? false,
      color,
      link: evt.link ?? null,
      daysOfWeek: evt.daysOfWeek?.length ? evt.daysOfWeek : null,
      startRecur: evt.startRecur ?? null,
      endRecur: evt.endRecur ?? null,
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

  clauses.forEach((clause) => {
    const parsedResults = chrono.parse(clause, new Date(), {
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
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: !parsed.start.isCertain("hour"),
        color: CALENDAR_COLORS[colorIndex],
        link: null,
        daysOfWeek: null,
        startRecur: null,
        endRecur: null,
        startTime: parsed.start.isCertain("hour")
          ? startDate.toTimeString().slice(0, 5)
          : null,
        endTime:
          parsed.end && parsed.end.isCertain("hour")
            ? endDate.toTimeString().slice(0, 5)
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
      start: "ISO 8601 string (e.g. 2026-10-12T09:00:00)",
      end: "ISO 8601 string (e.g. 2026-10-12T10:00:00)",
      allDay: false,
      color: "Hex color chosen strictly from the allowed palette",
      link: "optional URL or null",
      daysOfWeek: "optional array of 0-6 (0 = Sunday) for recurring events",
      startRecur: "optional ISO date for recurrence start",
      endRecur: "optional ISO date for recurrence end",
      startTime: "optional HH:mm for recurring events",
      endTime: "optional HH:mm for recurring events",
    },
  ],
};

export async function extractEventsGroq(model: string, text: string) {
  const now = new Date();
  const response = await groq.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an AI calendar event parser. Extract events from user text into valid JSON matching this schema structure:
${JSON.stringify(promptSchema, null, 2)}

Allowed color palette: ${JSON.stringify(CALENDAR_COLORS)}
Current date/time: ${now.toISOString()}. Resolve relative dates ("tomorrow", "next Friday") from it.
Output ONLY valid JSON.`,
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
    contents: `Current date/time: ${new Date().toISOString()}.\n\n${text}`,
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
                  description: "ISO 8601 start date/time string",
                },
                end: {
                  type: Type.STRING,
                  description: "ISO 8601 end date/time string",
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
