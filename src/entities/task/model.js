import {
  pgTable,
  text,
  timestamp,
  integer,
  smallint,
  json,
} from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/models/basicModel.js";

const model = {
  title: text("title"),
  description: text("description"),
  expire: timestamp("expire"),
  priority: smallint("priority").default(0), // 0, 1, 2
  subtasks: json("subtasks"), // array
};

export default pgTable("tasks", { ...new BasicModel(), ...model });

// const table = pgTable("tasks", {
//   ...basicModel,
//   title: text("title"),
//   description: text("description"),
//   expire: timestamp("expire"),
//   priority: smallint("priority").default(0), // 0, 1, 2
//   subtasks: json("subtasks"), // array

// related:
// labelId: integer("labelId"),
// groupId: integer("groupId"),
// creatorId: integer("creatorId"),
// assigneeId: integer("assigneeId"),
// commentsId: integer("commentsId"),
// attachmentsId: integer("attachmentsId"),
// });
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

// export const tasksRel = relations(table, ({ one, many }) => ({
//   label: one(labels, {
//     fields: [table.labelId],
//     references: [labels.id],
//   }),
//   group: many(groups),
//   creator: one(users, {
//     fields: [table.creatorId],
//     references: [users.id],
//   }),
//   assignee: many(users),
//   comments: many(comments), // ? таблица комментов по одному или пачкой?
//   // get comments(taskId)

//   attachments: many(files),
// }));

// export default table;
