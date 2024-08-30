import { integer, serial } from "drizzle-orm/pg-core";
import { projects } from "../../../entities/project/model.js";
import { BasicModel } from "../basic/model.js";

export class ProjectElemModel extends BasicModel {
  constructor() {
    super();
    this.id = integer("id").notNull().unique();
    this.globalId = serial("globalId").primaryKey();
    this.projectId = integer("projectId")
      .notNull()
      .references(() => projects.id);
  }
}

export class ProjectElemRelations {
  constructor(model, relHandlers) {
    this.project = relHandlers.one(projects, {
      fields: [model.projectId],
      references: [projects.id],
    });
  }
}
