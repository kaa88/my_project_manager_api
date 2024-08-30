import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { ProjectElemModel } from "../../shared/entities/projectElem/model.js";

export const boards = pgTable("boards", {
  ...new ProjectElemModel(),

  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  listOrder: integer("listOrder").array(),
  creatorId: integer("creatorId").notNull(),
});
