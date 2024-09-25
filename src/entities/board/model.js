import { pgTable, text, integer, json } from "drizzle-orm/pg-core";
import { ProjectElemModel } from "../../shared/entities/projectElem/model.js";

export const boards = pgTable("boards", {
  ...new ProjectElemModel(),

  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  taskLists: json("task_lists").notNull().default(JSON.stringify([])),
  creatorId: integer("creator_id").notNull(),
});
