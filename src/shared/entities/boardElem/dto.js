import {
  ProjectElemGetDTO,
  ProjectElemDeleteDTO,
  ProjectElemUpdateDTO,
} from "../projectElem/dto.js";
import { GetDTO as BoardDTO } from "../../../entities/board/map.js";

export class BoardElemGetDTO extends ProjectElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.boardId = entity.boardId;
    if (entity.board) this.board = new BoardDTO(entity.board, true);
  }
}

export class BoardElemCreateDTO extends BoardElemGetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class BoardElemUpdateDTO extends ProjectElemUpdateDTO {
  constructor(entity, updatedEntityValues = {}, GetDTO = BoardElemGetDTO) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export class BoardElemDeleteDTO extends ProjectElemDeleteDTO {
  constructor(entity) {
    super(entity);
    this.boardId = entity.boardId;
  }
}
