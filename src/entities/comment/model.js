import { pgTable, text, smallint, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { defaultModel } from "../../db/defaultModel.js";

export const comments = pgTable("comments", {
  ...defaultModel,
  content: text("content").notNull(),
  rating: smallint("rating").default(0),

  // nestedComments, // ?
  parentCommentId: integer("parentCommentId").notNull(), // ?
  authorId: integer("authorId").notNull(),
});

// export const usersRelations = relations(users, ({ one }) => ({
//   invitee: one(users, {
//     fields: [users.invitedBy],
//     references: [users.id],
//   }),
// }));
