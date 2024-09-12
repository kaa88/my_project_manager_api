import { integer } from "drizzle-orm/pg-core";
import { boards } from "../../../entities/board/model.js";
import {
  ProjectElemModel,
  ProjectElemRelations,
} from "../projectElem/model.js";

export class BoardElemModel extends ProjectElemModel {
  constructor() {
    super();
    // this.projectId = integer("projectId").notNull();
    this.boardId = integer("boardId")
      .notNull()
      .references(() => boards.id);
  }
}
export class BoardElemRelations extends ProjectElemRelations {
  constructor(model, relHandlers) {
    super(model, relHandlers);
    this.board = relHandlers.one(boards, {
      fields: [model.boardId],
      references: [boards.id],
    });
  }
}