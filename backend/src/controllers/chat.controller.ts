import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import db from "../lib/db.js";
import AppError from "../utils/appError.js";
import { event } from "../schemas/event.js";
import { chat } from "../schemas/chat.js";
import { eq, asc } from "drizzle-orm";
import {
  extractEventGemini,
  extractEventsGroq,
  extractEvents as extractEventsNLP,
  GROQ_OPENAI_MODEL,
  GROQ_QWEN_MODEL,
} from "../services/chatbot.js";
import { CalendarEvent } from "../types/calendar.js";

type ExtractorResult = {
  message: string;
  events?: CalendarEvent[];
};
type ExtractorFunction = (
  message: string,
) => Promise<ExtractorResult> | ExtractorResult;

export const getChats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const userChats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, userId))
      .orderBy(asc(chat.createdAt));

    res.status(200).json({ status: "success", data: userChats });
  },
);

// Converts raw provider/DB errors into messages safe to show to users.
// The full technical error is still logged on the server.
function toFriendlyError(error: unknown): AppError {
  const raw = error instanceof Error ? error.message : String(error);
  const status = Number((error as { status?: number })?.status) || 0;

  if (
    status === 404 ||
    /model.*(not found|does not exist)|model_not_found/i.test(raw)
  ) {
    return new AppError(
      "This AI model isn't available right now. Please pick a different model and try again.",
      502,
    );
  }
  if (status === 429 || /rate limit|quota|too many requests/i.test(raw)) {
    return new AppError(
      "The AI service is busy right now. Please wait a moment and try again.",
      429,
    );
  }
  if (
    status === 401 ||
    status === 403 ||
    /api key|unauthori[sz]ed|permission/i.test(raw)
  ) {
    return new AppError(
      "This AI model isn't set up correctly. Please try a different model.",
      502,
    );
  }
  if (/invalid json|empty response/i.test(raw)) {
    return new AppError(
      "I couldn't understand the AI's reply. Please rephrase your message and try again.",
      502,
    );
  }
  if (
    status >= 500 ||
    /fetch failed|timeout|timed out|ECONN|ENOTFOUND/i.test(raw)
  ) {
    return new AppError(
      "The AI service is having trouble right now. Please try again in a moment.",
      503,
    );
  }
  return new AppError(
    "Something went wrong while processing your message. Please try again.",
    500,
  );
}

async function processAndStoreSchedule(
  userId: string,
  message: string,
  extractor: ExtractorFunction,
) {
  try {
    const result = await extractor(message);

    const responseMessage =
      result?.message || "Processed your message successfully.";
    const events = result?.events ?? [];

    const chatInsert = db
      .insert(chat)
      .values({ userId, message, response: responseMessage })
      .returning();

    // neon-http has no db.transaction(); db.batch() runs atomically instead.
    // Queries are NOT awaited here; batch() executes them.
    if (events.length > 0) {
      const eventsToInsert = events.map((evt) => ({ ...evt, userId }));
      const [, chatRows] = await db.batch([
        db.insert(event).values(eventsToInsert),
        chatInsert,
      ]);
      return chatRows[0];
    }

    const [newChat] = await chatInsert;
    return newChat;
  } catch (error) {
    console.error("ERROR in processAndStoreSchedule:", error);
    throw toFriendlyError(error);
  }
}

// One factory instead of four copy-pasted handlers
const createChatHandler = (extractor: ExtractorFunction) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const { message } = req.body;
    if (typeof message !== "string" || !message.trim()) {
      return next(new AppError("Message content is required", 400));
    }

    const newChat = await processAndStoreSchedule(
      userId,
      message.trim(),
      extractor,
    );

    // Shape kept as { data: { response: <chat row> } } to match the frontend
    res.status(201).json({
      status: "success",
      data: { response: newChat },
    });
  });

export const useGemini = createChatHandler(extractEventGemini);
export const useGroqOpenAI = createChatHandler((msg) =>
  extractEventsGroq(GROQ_OPENAI_MODEL, msg),
);
export const useGroqQwen = createChatHandler((msg) =>
  extractEventsGroq(GROQ_QWEN_MODEL, msg),
);
export const useNLP = createChatHandler(extractEventsNLP);
