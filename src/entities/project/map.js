import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/entities/basic/dto.js";
import { BasicEntity } from "../../shared/entities/basic/entity.js";
import {
  toNumberArrayOrNull,
  toNumberOrNull,
} from "../../shared/utils/utils.js";

export class Entity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.ownerId !== undefined) this.ownerId = toNumberOrNull(data.ownerId);
    if (data.memberIds !== undefined)
      this.memberIds = toNumberArrayOrNull(data.memberIds);
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.ownerId = entity.ownerId;
    this.memberIds = entity.memberIds;
    // relations:
    if (entity.boards) this.boards = entity.boards;
    if (entity.labels) this.labels = entity.labels;
    if (entity.teams) this.teams = entity.teams;
  }
}
export class CreateDTO extends GetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class UpdateDTO extends BasicUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export const DeleteDTO = BasicDeleteDTO;
