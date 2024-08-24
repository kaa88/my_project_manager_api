import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  BoardElemModel,
  BoardElemRelations,
} from "../../shared/models/boardElemModel.js";

import { tasks } from "../task/model.js";

export const taskLists = pgTable("taskLists", {
  ...new BoardElemModel(),

  title: text("title").notNull(),
  description: text("description"),
  color: text("color"),
  creatorId: integer("creatorId").notNull(),
});

export const taskListsRelations = relations(taskLists, ({ one, many }) => ({
  ...new BoardElemRelations(taskLists, { one }),

  tasks: many(tasks),
}));
