import { relations, sql } from "drizzle-orm";
import { pgTable, text, integer, smallint, json } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";
import { tasksToGroups } from "../taskGroup/model.js";
import { projects } from "../project/model.js";

export const tasks = pgTable("tasks", {
  ...new BasicProjectElementModel(),

  title: text("title"),
  description: text("description"),
  expire: text("expire"), // 'YYYY-MM-DD'
  priority: smallint("priority").notNull().default(0), // 0, 1, 2
  subtasks: json("subtasks"), // array
  creatorId: integer("creatorId"), // one
  assigneeId: integer("assigneeId").array(),
  taskListId: integer("taskListId").notNull().default(1), // one, required

  // relations:
  projectId: integer("projectId"),
  // taskGroupId - не надо объявлять
  // commentsId: integer("commentsId"), // ?
  // attachmentsId: integer("attachmentsId"), // ?
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  tasksToGroups: many(tasksToGroups),
}));

// export default tasks;

// id: string;
// title: string;
// descr?: string;
// createDate: string;
// expireDate?: string;
// // closeDate?: string;
// priority?: TaskPriority;
// label?: string; // статус по колонкам доски (только 1 возможная) (в настройках)
// group?: string[]; // группа (в настройках)
// creator?: string; // id
// assignee?: string[]; // id
// subtasks?: string; // id of block
// comments?: string; // id of block
// attachments?: string[]; // ids
