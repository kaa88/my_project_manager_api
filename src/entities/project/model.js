import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/entities/basic/model.js";

export const projects = pgTable("projects", {
  ...new BasicModel(),

  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  ownerId: integer("owner_id").notNull(),
  adminIds: integer("admin_ids").array().notNull(),
  memberIds: integer("member_ids").array().notNull(),
});
