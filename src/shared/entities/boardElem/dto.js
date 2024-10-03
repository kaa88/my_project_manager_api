import {
  ProjectElemGetDTO,
  ProjectElemCreateDTO,
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

export class BoardElemCreateDTO extends ProjectElemCreateDTO {
  constructor(entity, GetDTO = BoardElemGetDTO) {
    super(entity, GetDTO);
  }
}

export class BoardElemUpdateDTO extends ProjectElemUpdateDTO {
  constructor(entity, updatedValues = {}, GetDTO = BoardElemGetDTO) {
    super(entity, updatedValues, GetDTO, BoardElemGetDTO);
  }
}

export class BoardElemDeleteDTO extends ProjectElemDeleteDTO {
  constructor(entity) {
    super(entity);
    this.boardId = entity.boardId;
  }
}
