import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user.js";
import { relations } from "drizzle-orm";

export const chat = pgTable("event", {
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  id: uuid("id").primaryKey().defaultRandom(),

  message: text("message").notNull(),
  response: text("response").notNull(),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const eventRelations = relations(chat, ({ one }) => ({
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
}));
