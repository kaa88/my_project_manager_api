import { pgTable, text } from "drizzle-orm/pg-core";
import { defaultModel } from "../../db/defaultModel.js";

export const files = pgTable("files", {
  ...defaultModel,
  path: text("path").notNull().unique(),
  description: text("description"),
});
