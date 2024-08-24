import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  ProjectElemDeleteDTO,
  ProjectElemGetDTO,
  ProjectElemUpdateDTO,
} from "../../shared/mappers/projectElemDTO.js";
import { ProjectElemEntity } from "../../shared/mappers/basicEntity.js";
import { toNumberArrayOrNull, toNumberOrNull } from "../../shared/utils.js";

export class Entity extends ProjectElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.image !== undefined) this.image = data.image;

    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);

    if (data.listOrder !== undefined)
      this.listOrder = toNumberArrayOrNull(data.listOrder);

    // rename to teamIds ?
    if (data.teams !== undefined) this.teams = toNumberArrayOrNull(data.teams);
  }
}

export class GetDTO extends ProjectElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.image = entity.image;
    this.creatorId = entity.creatorId;
    this.listOrder = entity.listOrder;
    // relations:
    if (entity.comments) this.comments = entity.comments;
    if (entity.files) this.files = entity.files;
    if (entity.tasks) this.tasks = entity.tasks;
    if (entity.taskLists) this.taskLists = entity.taskLists;

    if (entity.team) this.team = entity.team; // ?
    if (entity.teams) this.teams = entity.teams; // ?
    if (entity.teamsToBoards) this.teamsToBoards = entity.teamsToBoards; // ?
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
