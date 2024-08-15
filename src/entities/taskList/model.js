import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";

import { projects } from "../project/model.js";
import { boards } from "../board/model.js";
import { tasks } from "../task/model.js";

export const taskLists = pgTable("task_lists", {
  ...new BasicProjectElementModel(),

  title: text("title"),
  description: text("description"),
  color: text("color"),
  creatorId: integer("creatorId").notNull(),
  // relations:
  projectId: integer("projectId")
    .notNull()
    .references(() => projects.id),
  boardId: integer("boardId")
    .notNull()
    .references(() => boards.id),
});

export const taskListsRelations = relations(taskLists, ({ one, many }) => ({
  project: one(projects, {
    fields: [taskLists.projectId],
    references: [projects.id],
  }),
  board: one(boards, {
    fields: [taskLists.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));
