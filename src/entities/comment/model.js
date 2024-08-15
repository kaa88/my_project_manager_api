import { relations } from "drizzle-orm";
import { pgTable, text, smallint, integer } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";

import { projects } from "../project/model.js";
import { tasks } from "../task/model.js";

export const comments = pgTable("comments", {
  ...new BasicProjectElementModel(),

  content: text("content").notNull(),
  rating: smallint("rating").notNull().default(0),
  authorId: integer("authorId").notNull(),
  // relations:
  projectId: integer("projectId")
    .notNull()
    .references(() => projects.id),
  taskId: integer("taskId")
    .notNull()
    .references(() => tasks.id),
  parentCommentId: integer("parentCommentId"),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  project: one(projects, {
    fields: [comments.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
}));
