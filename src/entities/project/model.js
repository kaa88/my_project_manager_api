import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/entities/basic/model.js";

export const projects = pgTable("projects", {
  ...new BasicModel(),

  title: text("title").notNull(),
  // systemName: text("systemName"), // ? для вывода в строке браузера, как в gitlab
  description: text("description"),
  ownerId: integer("ownerId").notNull(),
  adminIds: integer("adminIds").array(),
  memberIds: integer("memberIds").array().notNull(),
});
