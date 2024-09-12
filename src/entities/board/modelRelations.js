import { relations } from "drizzle-orm";
import { ProjectElemRelations } from "../../shared/entities/projectElem/model.js";

import { boards } from "./model.js";
import { teamsToBoards } from "../_JoinTables/teamsToBoards.js";
import { comments } from "../comment/model.js";
import { files } from "../file/model.js";
import { tasks } from "../task/model.js";
// import { taskLists } from "../taskList/model.js";

// NOTE: modelRelations помещен в отдельный файл, чтобы избежать циклических ссылок с projects

export const boardsRelations = relations(boards, ({ one, many }) => ({
  ...new ProjectElemRelations(boards, { one }),

  teamsToBoards: many(teamsToBoards), // ?

  comments: many(comments),
  files: many(files),
  tasks: many(tasks),
  // taskLists: many(taskLists),
}));
