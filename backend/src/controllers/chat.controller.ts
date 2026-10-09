import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import db from "../lib/db.js";
import AppError from "../utils/appError.js";
import { event } from "../schemas/event.js";
import { chat } from "../schemas/chat.js";
import {
  extractEventGemini,
  extractEventsGroq,
  extractEvents as extractEventsNLP,
} from "../services/chatbot.js";
import { CalendarEvent } from "../types/calendar.js";

type ExtractorResult = {
  message: string;
  events: CalendarEvent[];
};
type ExtractorFunction = (
  message: string,
) => Promise<ExtractorResult> | ExtractorResult;

async function processAndStoreSchedule(
  userId: string,
  message: string,
  extractor: ExtractorFunction,
) {
  const response = await extractor(message);

  if (!response || !response.events || !response.message) {
    throw new AppError("Failed to process event schedule", 500);
  }

  const eventsToInsert = response.events.map((evt: CalendarEvent) => ({
    ...evt,
    userId,
  }));

  if (eventsToInsert.length > 0) {
    await db.insert(event).values(eventsToInsert);
  }

  await db.insert(chat).values({
    userId,
    message,
    response: response.message,
  });

  return {
    message: response.message,
  };
}

export const useGemini = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const { message } = req.body;
    if (!message) return next(new AppError("Message content is required", 400));

    const responseMessage = await processAndStoreSchedule(
      userId,
      message,
      extractEventGemini,
    );

    res.status(201).json({
      status: "success",
      data: {
        response: responseMessage,
      },
    });
  },
);

export const useGroqOpenAI = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const { message } = req.body;
    if (!message) return next(new AppError("Message content is required", 400));

    const responseMessage = await processAndStoreSchedule(
      userId,
      message,
      (msg) => extractEventsGroq("openai/gpt-oss-20b", msg),
    );

    res.status(201).json({
      status: "success",
      data: {
        response: responseMessage,
      },
    });
  },
);

export const useGroqQwen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const { message } = req.body;
    if (!message) return next(new AppError("Message content is required", 400));

    const responseMessage = await processAndStoreSchedule(
      userId,
      message,
      (msg) => extractEventsGroq("qwen/qwen3.8-27b", msg),
    );

    res.status(201).json({
      status: "success",
      data: {
        response: responseMessage,
      },
    });
  },
);

export const useNLP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("User not authenticated", 401));

    const { message } = req.body;
    if (!message) return next(new AppError("Message content is required", 400));

    const responseMessage = await processAndStoreSchedule(
      userId,
      message,
      extractEventsNLP,
    );

    res.status(201).json({
      status: "success",
      data: {
        response: responseMessage,
      },
    });
  },
);
