import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import {
  ProjectElemModel,
  ProjectElemRelations,
} from "../../shared/entities/projectElem/model.js";

export const labels = pgTable("labels", {
  ...new ProjectElemModel(),

  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  color: text("color").notNull().default(""),
  creatorId: integer("creator_id").notNull(),
});

export const labelsRelations = relations(labels, ({ one }) => ({
  ...new ProjectElemRelations(labels, { one }),
}));
