import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/models/basicModel.js";

import { boards } from "../board/model.js";
import { comments } from "../comment/model.js";
import { files } from "../file/model.js";
import { labels } from "../label/model.js";
import { tasks } from "../task/model.js";
import { taskLists } from "../taskList/model.js";
import { teams } from "../team/model.js";

export const projects = pgTable("projects", {
  ...new BasicModel(),

  title: text("title").notNull(),
  // systemName: text("systemName"), // ? для вывода в строке браузера, как в gitlab
  description: text("description"),
  ownerId: integer("ownerId").notNull(),
  memberIds: integer("memberIds").array(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  boards: many(boards),
  comments: many(comments),
  files: many(files),
  labels: many(labels),
  tasks: many(tasks),
  taskLists: many(taskLists),
  teams: many(teams),
}));
