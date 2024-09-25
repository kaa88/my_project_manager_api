import { integer } from "drizzle-orm/pg-core";
import { BasicModel } from "../basic/model.js";
import { projects } from "../../../entities/project/model.js";

export class ProjectElemModel extends BasicModel {
  constructor() {
    super();
    this.relativeId = integer("relative_id").notNull().default(0);
    this.projectId = integer("project_id")
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
