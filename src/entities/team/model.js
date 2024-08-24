import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import {
  ProjectElemModel,
  ProjectElemRelations,
} from "../../shared/models/projectElemModel.js";

import { teamsToBoards } from "../_JoinTables/teamsToBoards.js";

export const teams = pgTable("teams", {
  ...new ProjectElemModel(),

  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  leaderId: integer("leaderId").notNull(),
  memberIds: integer("memberIds").array().notNull(),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  ...new ProjectElemRelations(teams, { one }),

  teamsToBoards: many(teamsToBoards), // ?
}));
