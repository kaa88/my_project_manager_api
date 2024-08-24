import {
  ProjectElemDeleteDTO,
  ProjectElemGetDTO,
  ProjectElemUpdateDTO,
} from "./projectElemDTO.js";

export class BoardElemGetDTO extends ProjectElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.boardId = entity.boardId;
    if (entity.board) this.board = entity.board;
  }
}

export class BoardElemCreateDTO extends BoardElemGetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class BoardElemUpdateDTO extends ProjectElemUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, BoardElemGetDTO);
  }
}

export const BoardElemDeleteDTO = ProjectElemDeleteDTO;
