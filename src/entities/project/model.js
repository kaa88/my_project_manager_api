import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/models/basicModel.js";
import { boards } from "../board/model.js";

export const projects = pgTable("projects", {
  ...new BasicModel(),

  name: text("name"),
  systemName: text("systemName"),
  description: text("description"),
  ownerId: integer("ownerId"),
  members: integer("members").array(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  boards: many(boards),
  comments: many(boards),
  files: many(boards),
  tasks: many(boards),
  taskGroups: many(boards),
  taskLists: many(boards),
}));
