import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/models/basicModel.js";

export const projects = pgTable("projects", {
  ...new BasicModel(),

  title: text("title").notNull(),
  // systemName: text("systemName"), // ? для вывода в строке браузера, как в gitlab
  description: text("description"),
  ownerId: integer("ownerId").notNull(),
  memberIds: integer("memberIds").array(),
});
