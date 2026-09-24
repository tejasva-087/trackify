import { NextFunction, Request, Response } from "express";
import { event } from "../schemas/event.js";
import catchAsync from "../utils/catchAsync.js";
import db from "../lib/db.js";
import AppError from "../utils/appError.js";
import { and, eq } from "drizzle-orm";

export type NewEvent = typeof event.$inferInsert;
export type Event = typeof event.$inferSelect;
export type UpdateEvent = Partial<Omit<NewEvent, "id" | "createdAt">>;

export const createEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const [newEvent] = await db
      .insert(event)
      .values({ ...req.body, userId })
      .returning();

    if (!newEvent)
      return next(new AppError("There was an error creating the event.", 400));

    res.status(201).json(newEvent);
  },
);

export const getEvents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    console.log(userId);

    const events = await db
      .select()
      .from(event)
      .where(eq(event.userId, userId));

    if (!events)
      return next(new AppError("There was an getting the event.", 400));

    res.status(200).json(events);
  },
);

export const getEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const [foundEvent] = await db
      .select()
      .from(event)
      .where(and(eq(event.id, id), eq(event.userId, userId)))
      .limit(1);

    if (!foundEvent)
      return next(new AppError("No event found with that ID.", 404));

    res.status(200).json(foundEvent);
  },
);

export const updateEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const data: UpdateEvent = req.body;

    const [updatedEvent] = await db
      .update(event)
      .set(data)
      .where(and(eq(event.id, id), eq(event.userId, userId)))
      .returning();

    if (!updatedEvent)
      return next(new AppError("No event found with that ID.", 404));

    res.status(200).json(updatedEvent);
  },
);

export const deleteEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const [deletedEvent] = await db
      .delete(event)
      .where(and(eq(event.id, id), eq(event.userId, userId)))
      .returning();

    if (!deletedEvent)
      return next(new AppError("No event found with that ID.", 404));

    res.status(204).send();
  },
);
