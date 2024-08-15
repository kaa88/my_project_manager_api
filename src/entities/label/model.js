import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";

import { projects } from "../project/model.js";

export const labels = pgTable("labels", {
  ...new BasicProjectElementModel(),

  title: text("title").notNull(),
  description: text("description"),
  color: text("color"),
  creatorId: integer("creatorId").notNull(),
  // relations:
  projectId: integer("projectId")
    .notNull()
    .references(() => projects.id),
});

export const labelsRelations = relations(labels, ({ one }) => ({
  project: one(projects, {
    fields: [labels.projectId],
    references: [projects.id],
  }),
}));
