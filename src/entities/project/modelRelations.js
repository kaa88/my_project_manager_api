import { relations } from "drizzle-orm";

import { projects } from "./model.js";
import { boards } from "../board/model.js";
import { labels } from "../label/model.js";
import { teams } from "../team/model.js";

// NOTE: modelRelations помещен в отдельный файл, чтобы избежать циклических ссылок с boards

export const projectsRelations = relations(projects, ({ many }) => ({
  boards: many(boards),
  labels: many(labels),
  teams: many(teams),
}));
