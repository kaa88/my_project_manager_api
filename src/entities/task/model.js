import { relations } from "drizzle-orm";
import { pgTable, text, integer, smallint, json } from "drizzle-orm/pg-core";
import {
  BoardElemModel,
  BoardElemRelations,
} from "../../shared/entities/boardElem/model.js";

import { taskLists } from "../taskList/model.js";
import { comments } from "../comment/model.js";
import { files } from "../file/model.js";

export const tasks = pgTable("tasks", {
  ...new BoardElemModel(),

  title: text("title").notNull(),
  description: text("description"),
  expire: text("expire"), // 'YYYY-MM-DD'
  priority: smallint("priority").notNull().default(0), // 0, 1, 2
  subtasks: json("subtasks"), // array
  creatorId: integer("creatorId").notNull(), // one
  assigneeIds: integer("assigneeIds").array(),
  labelIds: integer("labelIds").array(),
  // relations:
  taskListId: integer("taskListId")
    .notNull()
    .references(() => taskLists.id),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  ...new BoardElemRelations(tasks, { one }),

  taskList: one(taskLists, {
    fields: [tasks.taskListId],
    references: [taskLists.id],
  }),
  comments: many(comments),
  files: many(files),
}));

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
