import { pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { defaultModel } from "../../db/defaultModel.js";

export const groups = pgTable("groups", {
  ...defaultModel,
  title: text("title"),
  color: text("color"),
});

// export const usersRelations = relations(users, ({ one }) => ({
//   invitee: one(users, {
//     fields: [users.invitedBy],
//     references: [users.id],
//   }),
// }));
