import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/mappers/basicDTO.js";
import { toNumber, toNumberArray } from "../../shared/utils.js";

export class Entity {
  constructor(data = {}) {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.ownerId !== undefined) this.ownerId = toNumber(data.ownerId);

    if (data.members !== undefined) {
      this.members = toNumberArray(data.members);
      if (!this.members)
        throw ApiError.badRequest(Message.incorrectIds("members"));
    }
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
    this.title = entity.title;
    this.description = entity.description;
    this.ownerId = entity.ownerId;
    this.members = entity.members;
    // relations:
    if (entity.boards) this.boards = entity.boards;
    if (entity.comments) this.comments = entity.comments;
    if (entity.files) this.files = entity.files;
    if (entity.labels) this.labels = entity.labels;
    if (entity.tasks) this.tasks = entity.tasks;
    if (entity.taskLists) this.taskLists = entity.taskLists;
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
