import { relations } from "drizzle-orm";
import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";

import { teams } from "../team/model.js";
import { boards } from "../board/model.js";

export const teamsToBoards = pgTable(
  "teams_to_boards",
  {
    teamId: integer("teamId")
      .notNull()
      .references(() => teams.id),
    boardId: integer("boardId")
      .notNull()
      .references(() => boards.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.teamId, t.boardId] }),
  })
);

export const teamsToBoardsRelations = relations(teamsToBoards, ({ one }) => ({
  team: one(teams, {
    fields: [teamsToBoards.teamId],
    references: [teams.id],
  }),
  board: one(boards, {
    fields: [teamsToBoards.boardId],
    references: [boards.id],
  }),
}));
