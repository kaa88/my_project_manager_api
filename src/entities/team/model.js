import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/models/basicModel.js";

export const teams = pgTable("teams", {
  ...new BasicModel(),

  title: text("title"),
  description: text("description"),
  image: text("image"),
  leaderId: integer("leaderId"),
  members: integer("members").array(),
});
