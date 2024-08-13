import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";
import { projects } from "../project/model.js";

export const boards = pgTable("boards", {
  ...new BasicProjectElementModel(),

  title: text("title"),
  description: text("description"),
  image: text("image"),
  listOrder: integer("listOrder").array(),
  creatorId: integer("creatorId"),
  // rel
  projectId: integer("projectId"),
  // lists ?
});

export const boardsRelations = relations(boards, ({ one }) => ({
  project: one(projects, {
    fields: [boards.projectId],
    references: [projects.id],
  }),
}));
