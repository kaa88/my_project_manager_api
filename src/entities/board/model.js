import { pgTable, text, integer, json } from "drizzle-orm/pg-core";
import { ProjectElemModel } from "../../shared/entities/projectElem/model.js";

export const boards = pgTable("boards", {
  ...new ProjectElemModel(),

  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  taskLists: json("taskLists"),
  creatorId: integer("creatorId").notNull(),
});
