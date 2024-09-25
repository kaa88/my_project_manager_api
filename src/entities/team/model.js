import { relations } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";
import {
  ProjectElemModel,
  ProjectElemRelations,
} from "../../shared/entities/projectElem/model.js";

import { teamsToBoards } from "../_relationTables/teamsToBoards/model.js";

export const teams = pgTable("teams", {
  ...new ProjectElemModel(),

  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  leaderId: integer("leader_id").notNull(),
  memberIds: integer("member_ids").array().notNull(),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  ...new ProjectElemRelations(teams, { one }),

  teamsToBoards: many(teamsToBoards),
}));
