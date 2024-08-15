import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";

import { projects } from "../project/model.js";
import { tasks } from "../task/model.js";

export const files = pgTable("files", {
  ...new BasicProjectElementModel(),

  title: text("title"),
  description: text("description"),
  path: text("path").notNull().unique(),
  type: text("type").notNull(),
  size: text("size").notNull(),
  authorId: integer("authorId").notNull(),
  // relations:
  projectId: integer("projectId")
    .notNull()
    .references(() => projects.id),
  taskId: integer("taskId")
    .notNull()
    .references(() => tasks.id),
});

export const filesRelations = relations(files, ({ one }) => ({
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
  task: one(tasks, {
    fields: [files.taskId],
    references: [tasks.id],
  }),
}));
