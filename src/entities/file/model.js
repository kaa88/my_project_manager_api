import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import {
  BoardElemModel,
  BoardElemRelations,
} from "../../shared/entities/boardElem/model.js";

import { tasks } from "../task/model.js";

export const files = pgTable("files", {
  ...new BoardElemModel(),

  title: text("title"),
  description: text("description"),
  path: text("path").notNull().unique(),
  type: text("type").notNull(),
  size: text("size").notNull(),
  authorId: integer("authorId").notNull(),
  // relations:
  taskId: integer("taskId")
    .notNull()
    .references(() => tasks.id),
});

export const filesRelations = relations(files, ({ one }) => ({
  ...new BoardElemRelations(files, { one }),

  task: one(tasks, {
    fields: [files.taskId],
    references: [tasks.id],
  }),
}));
