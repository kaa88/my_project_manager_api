import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { BasicProjectElementModel } from "../../shared/models/basicModel.js";

import { teamsToBoards } from "../_JoinTables/teamsToBoards.js";
import { projects } from "../project/model.js";

export const teams = pgTable("teams", {
  ...new BasicProjectElementModel(),

  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  leaderId: integer("leaderId").notNull(),
  members: integer("members").array(),
  // relations:
  projectId: integer("projectId")
    .notNull()
    .references(() => projects.id),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  project: one(projects, {
    fields: [teams.projectId],
    references: [projects.id],
  }),
  teamsToBoards: many(teamsToBoards),
}));
