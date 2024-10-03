import { relations } from "drizzle-orm";
import { pgTable, text, integer, smallint, json } from "drizzle-orm/pg-core";
import {
  BoardElemModel,
  BoardElemRelations,
} from "../../shared/entities/boardElem/model.js";

import { comments } from "../comment/model.js";
import { files } from "../file/model.js";

export const tasks = pgTable("tasks", {
  ...new BoardElemModel(),

  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  expire: text("expire").notNull().default(""), // 'YYYY-MM-DD'
  priority: smallint("priority").notNull().default(0), // 0, 1, 2
  subtasks: json("subtasks").notNull().default(JSON.stringify([])), // array
  creatorId: integer("creator_id").notNull(),
  assigneeIds: integer("assignee_ids").array().notNull(),
  taskListId: integer("task_list_id").notNull(),
  labelIds: integer("label_ids").array().notNull(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  ...new BoardElemRelations(tasks, { one }),

  comments: many(comments),
  files: many(files),
}));
