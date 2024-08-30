import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import {
  ProjectElemModel,
  ProjectElemRelations,
} from "../../shared/entities/projectElem/model.js";

export const labels = pgTable("labels", {
  ...new ProjectElemModel(),

  title: text("title").notNull(),
  description: text("description"),
  color: text("color"),
  creatorId: integer("creatorId").notNull(),
});

export const labelsRelations = relations(labels, ({ one }) => ({
  ...new ProjectElemRelations(labels, { one }),
}));
