import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { BasicModel } from "../../shared/entities/basic/model.js";
import { users } from "../user/model.js";

export const profiles = pgTable("profiles", {
  ...new BasicModel(),

  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  status: text("status").notNull().default(""),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));
