import { relations } from "drizzle-orm";
import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";
import { projects } from "../project/model.js";
import { tasks } from "../task/model.js";

export const taskGroups = pgTable("task_groups", {
  ...new BasicProjectElementModel(),

  title: text("title"),
  description: text("description"),
  color: text("color"),
  creatorId: integer("creatorId"),
  // rel
  projectId: integer("projectId"),
});

export const taskGroupsRelations = relations(taskGroups, ({ one, many }) => ({
  project: one(projects, {
    fields: [taskGroups.projectId],
    references: [projects.id],
  }),
  tasksToGroups: many(tasksToGroups),
}));

// relations join table
export const tasksToGroups = pgTable(
  "tasks_to_groups",
  {
    taskId: integer("taskId")
      .notNull()
      .references(() => tasks.id),
    taskGroupId: integer("taskGroupId")
      .notNull()
      .references(() => taskGroups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.taskId, t.taskGroupId] }),
  })
);

export const tasksToGroupsRelations = relations(tasksToGroups, ({ one }) => ({
  taskGroup: one(taskGroups, {
    fields: [tasksToGroups.taskGroupId],
    references: [taskGroups.id],
  }),
  task: one(tasks, {
    fields: [tasksToGroups.taskId],
    references: [tasks.id],
  }),
}));
