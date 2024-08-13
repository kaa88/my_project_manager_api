import { pgTable, text } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";

export const files = pgTable("files", {
  ...new BasicProjectElementModel(),
  path: text("path").notNull().unique(),
  description: text("description"),
});
