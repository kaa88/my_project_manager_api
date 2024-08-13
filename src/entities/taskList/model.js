import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";
import { projects } from "../project/model.js";

export const taskLists = pgTable("task_lists", {
  ...new BasicProjectElementModel(),

  title: text("title"),
  description: text("description"),
  color: text("color"),
  creatorId: integer("creatorId"),
  // rel
  projectId: integer("projectId"),
});

export const taskListsRelations = relations(taskLists, ({ one, many }) => ({
  project: one(projects, {
    fields: [taskLists.projectId],
    references: [projects.id],
  }),
}));
