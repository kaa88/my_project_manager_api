import {
  BoardElemDeleteDTO,
  BoardElemGetDTO,
  BoardElemUpdateDTO,
} from "../../shared/entities/boardElem/dto.js";
import { BoardElemEntity } from "../../shared/entities/boardElem/entity.js";
import { toNumberOrNull } from "../../shared/utils/utils.js";

export class Entity extends BoardElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.color !== undefined) this.color = data.color;
    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);
    if (data.boardId !== undefined) this.boardId = toNumberOrNull(data.boardId);
  }
}

export class GetDTO extends BoardElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.color = entity.color;
    this.creatorId = entity.creatorId;
    this.boardId = entity.boardId;
    // relations:
    if (entity.tasks) this.tasks = entity.tasks;
  }
}
export class CreateDTO extends GetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class UpdateDTO extends BoardElemUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export const DeleteDTO = BoardElemDeleteDTO;
