import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import {
  BoardElemModel,
  BoardElemRelations,
} from "../../shared/entities/boardElem/model.js";

import { tasks } from "../task/model.js";

export const files = pgTable("files", {
  ...new BoardElemModel(),

  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  path: text("path").notNull(),
  type: text("type").notNull(),
  size: text("size").notNull(),
  creatorId: integer("creator_id").notNull(),
  // relations:
  taskId: integer("task_id").notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
  ...new BoardElemRelations(files, { one }),

  task: one(tasks, {
    fields: [files.taskId],
    references: [tasks.id],
  }),
}));
