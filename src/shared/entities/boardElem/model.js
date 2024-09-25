import { integer } from "drizzle-orm/pg-core";
import {
  ProjectElemModel,
  ProjectElemRelations,
} from "../projectElem/model.js";
import { boards } from "../../../entities/board/model.js";

export class BoardElemModel extends ProjectElemModel {
  constructor() {
    super();
    this.boardId = integer("board_id")
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
