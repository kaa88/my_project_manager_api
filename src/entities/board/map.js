import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/mappers/basicDTO.js";
import { ProjectElemBasicEntity } from "../../shared/mappers/basicEntity.js";
import { toNumber, toNumberArray } from "../../shared/utils.js";

export class Entity extends ProjectElemBasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.image !== undefined) this.image = data.image;

    if (data.creatorId !== undefined) this.creatorId = toNumber(data.creatorId);

    if (data.listOrder !== undefined) {
      this.listOrder = toNumberArray(data.listOrder);
      if (!this.listOrder)
        throw ApiError.badRequest(Message.incorrectIds("listOrder"));
    }

    if (data.teams !== undefined) {
      this.teams = toNumberArray(data.teams);
      if (!this.teams) throw ApiError.badRequest(Message.incorrectIds("teams"));
    }
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
    this.title = entity.title;
    this.description = entity.description;
    this.image = entity.image;
    this.creatorId = entity.creatorId;
    this.listOrder = entity.listOrder;
    // relations:
    if (entity.taskLists) this.taskLists = entity.taskLists;
    if (entity.team) this.team = entity.team; // ?
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
