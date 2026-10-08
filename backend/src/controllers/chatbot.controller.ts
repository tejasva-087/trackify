import { NextFunction, Request, Response } from "express";
import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import db from "../lib/db.js";
import { event } from "../schemas/event.js";
import { clearHistory, processChatMessage } from "../services/chatbot.js";
import type { CalendarEvent } from "../types/calendar.js";

const MAX_MESSAGE_LENGTH = 2000;

type NewEvent = typeof event.$inferInsert;
type SavedEvent = typeof event.$inferSelect;

function isValidTimeZone(tz: unknown): tz is string {
  if (typeof tz !== "string" || !tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// Inserts new events and updates ones the bot changed (same id), only for this user.
async function saveEvents(
  userId: string,
  events: CalendarEvent[],
): Promise<SavedEvent[]> {
  if (events.length === 0) return [];

  // Which of the returned ids already exist, and who owns them?
  const existing = await db
    .select({ id: event.id, userId: event.userId })
    .from(event)
    .where(
      inArray(
        event.id,
        events.map((e) => e.id),
      ),
    );
  const owners = new Map(existing.map((row) => [row.id, row.userId]));

  const toInsert: NewEvent[] = [];
  const toUpdate: CalendarEvent[] = [];

  for (const e of events) {
    if (!owners.has(e.id)) {
      toInsert.push({ ...e, userId } as NewEvent);
    } else if (owners.get(e.id) === userId) {
      toUpdate.push(e);
    } else {
      // id belongs to another user: never touch it, store as a new event
      toInsert.push({ ...e, id: randomUUID(), userId } as NewEvent);
    }
  }

  const saved: SavedEvent[] = [];

  if (toInsert.length > 0) {
    saved.push(...(await db.insert(event).values(toInsert).returning()));
  }

  const updated = await Promise.all(
    toUpdate.map(async ({ id, ...data }) => {
      const [row] = await db
        .update(event)
        .set(data as Partial<NewEvent>)
        .where(and(eq(event.id, id), eq(event.userId, userId)))
        .returning();
      return row;
    }),
  );
  saved.push(...updated.filter((row): row is SavedEvent => !!row));

  return saved;
}

export const chatCalendar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("You are not logged in.", 401));

    const { message, timeZone } = req.body ?? {};

    if (typeof message !== "string" || !message.trim())
      return next(new AppError("Please provide a message.", 400));

    if (message.length > MAX_MESSAGE_LENGTH)
      return next(
        new AppError(
          `Message must be under ${MAX_MESSAGE_LENGTH} characters.`,
          400,
        ),
      );

    if (timeZone !== undefined && !isValidTimeZone(timeZone))
      return next(new AppError("Invalid time zone.", 400));

    const result = await processChatMessage(
      String(userId),
      message.trim(),
      timeZone ?? "UTC",
    );

    const savedEvents = await saveEvents(userId, result.events);

    res.status(200).json({ events: savedEvents, message: result.message });
  },
);

export const resetChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("You are not logged in.", 401));

    clearHistory(String(userId));
    res.status(204).send();
  },
);
