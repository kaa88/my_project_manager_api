import { relations } from "drizzle-orm";
import { pgTable, text, smallint, integer } from "drizzle-orm/pg-core";
import {
  BoardElemModel,
  BoardElemRelations,
} from "../../shared/models/boardElemModel.js";

import { tasks } from "../task/model.js";

export const comments = pgTable("comments", {
  ...new BoardElemModel(),

  content: text("content").notNull(),
  rating: smallint("rating").notNull().default(0),
  authorId: integer("authorId").notNull(),
  // relations:
  taskId: integer("taskId")
    .notNull()
    .references(() => tasks.id),
  parentCommentId: integer("parentCommentId"),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  ...new BoardElemRelations(comments, { one }),

  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
}));
