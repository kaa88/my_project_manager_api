import { relations } from "drizzle-orm";
import { pgTable, text, smallint, integer } from "drizzle-orm/pg-core";
import {
  BoardElemModel,
  BoardElemRelations,
} from "../../shared/entities/boardElem/model.js";

import { tasks } from "../task/model.js";

export const comments = pgTable("comments", {
  ...new BoardElemModel(),

  content: text("content").notNull(),
  rating: smallint("rating").notNull().default(0),
  creatorId: integer("creator_id").notNull(),
  // relations:
  taskId: integer("task_id").notNull(),
  parentCommentId: integer("parent_comment_id"), // possibly null
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
