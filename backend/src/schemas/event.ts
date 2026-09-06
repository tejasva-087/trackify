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
import { relations } from "drizzle-orm";

export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);
export const statusEnum = pgEnum("status", [
  "scheduled",
  "conflicted",
  "resolved",
]);

export const event = pgTable("event", {
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  id: uuid("id").primaryKey().defaultRandom(),

  title: text("title").notNull(),
  description: text("description"),

  start: timestamp("start", { withTimezone: true, mode: "string" }),
  end: timestamp("end", { withTimezone: true, mode: "string" }),
  allDay: boolean("allDay").default(false),

  url: text("url"),

  color: text("color"),
  contrastColor: text("contrastColor"),

  daysOfWeek: integer("daysOfWeek").array(),
  startRecur: date("startRecur"),
  endRecur: date("endRecur"),

  startTime: text("startTime"),
  endTime: text("endTime"),

  editable: boolean(),

  priority: priorityEnum("priority"),
  status: statusEnum("status"),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const eventRelations = relations(event, ({ one }) => ({
  user: one(user, {
    fields: [event.userId],
    references: [user.id],
  }),
}));
