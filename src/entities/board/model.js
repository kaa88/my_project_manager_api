import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";

import { teamsToBoards } from "../_JoinTables/teamsToBoards.js";
import { projects } from "../project/model.js";
import { taskLists } from "../taskList/model.js";

export const boards = pgTable("boards", {
  ...new BasicProjectElementModel(),

  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  listOrder: integer("listOrder").array(),
  creatorId: integer("creatorId").notNull(),
  // relations:
  projectId: integer("projectId")
    .notNull()
    .references(() => projects.id),
});

export const boardsRelations = relations(boards, ({ one, many }) => ({
  project: one(projects, {
    fields: [boards.projectId],
    references: [projects.id],
  }),
  taskLists: many(taskLists),
  teamsToBoards: many(teamsToBoards),
}));
