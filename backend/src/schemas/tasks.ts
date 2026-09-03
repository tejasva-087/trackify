import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user.js";

const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

export const statusEnum = pgEnum("status", [
  "scheduled",
  "conflicted",
  "resolved",
]);

export const task = pgTable("task", {
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),

  id: uuid("id").primaryKey().defaultRandom(),

  title: text("title").notNull(),
  description: text("description"),

  start: timestamp("start", { withTimezone: true }),
  end: timestamp("end", { withTimezone: true }),
  allDay: boolean("allDay").default(false),

  url: text("url"),

  color: text("color"),
  contrastColor: text("contrastColor"),

  groupId: text("groupId"),

  daysOfWeek: integer("daysOfWeek").array(),
  startRecur: date("startRecur"),
  endRecur: date("endRecur"),

  startTime: text("startTime"),
  endTime: text("endTime"),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
