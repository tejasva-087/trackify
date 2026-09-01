import {
  boolean,
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
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId").references(() => user.id),
  title: text("title").notNull(),
  start: timestamp("start", { withTimezone: true }),
  end: timestamp("end", { withTimezone: true }),
  priority: priorityEnum("priority"),
  flexible: boolean("flexible"),
  recurrence: text("recurrence"),
  status: statusEnum("status").default("scheduled"),
  createdAt: timestamp("created_at"),
});
