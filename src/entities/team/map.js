import {
  ProjectElemDeleteDTO,
  ProjectElemGetDTO,
  ProjectElemUpdateDTO,
} from "../../shared/entities/projectElem/dto.js";
import { ProjectElemEntity } from "../../shared/entities/projectElem/entity.js";
import {
  toNumberArrayOrNull,
  toNumberOrNull,
} from "../../shared/utils/utils.js";

export class Entity extends ProjectElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.image !== undefined) this.image = data.image;
    if (data.leaderId !== undefined)
      this.leaderId = toNumberOrNull(data.leaderId);
    if (data.memberIds !== undefined)
      this.memberIds = toNumberArrayOrNull(data.memberIds);
    if (data.boards !== undefined)
      this.boards = toNumberArrayOrNull(data.boards);
  }
}

export class GetDTO extends ProjectElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.image = entity.image;
    this.leaderId = entity.leaderId;
    this.memberIds = entity.memberIds;
    // relations:
    if (entity.board) this.board = entity.board; // ?
    if (entity.boards) this.boards = entity.boards;
  }
}
export class CreateDTO extends GetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class UpdateDTO extends ProjectElemUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export const DeleteDTO = ProjectElemDeleteDTO;
