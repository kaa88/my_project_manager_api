import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/mappers/basicDTO.js";
import { ProjectElemBasicEntity } from "../../shared/mappers/basicEntity.js";
import {
  getShortDateString,
  isArray,
  isObject,
  toNumber,
  toNumberArrayOrNull,
  toNumberOrNull,
} from "../../shared/utils.js";

export class Task extends ProjectElemBasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;

    if (data.description !== undefined) this.description = data.description;

    if (data.expire !== undefined)
      this.expire = data.expire ? getShortDateString(data.expire) : null;

    if (data.priority !== undefined) this.priority = toNumber(data.priority);

    if (data.subtasks !== undefined) {
      if (!isArray(data.subtasks))
        throw ApiError.badRequest(Message.incorrect("subtasks", "Array"));
      this.subtasks = data.subtasks.map((item) => new Subtask(item));
    }

    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);

    if (data.assigneeIds !== undefined)
      this.assigneeIds = toNumberArrayOrNull(data.assigneeIds);

    if (data.labelIds !== undefined)
      this.labelIds = toNumberArrayOrNull(data.labelIds);

    if (data.taskListId !== undefined)
      this.taskListId = toNumberOrNull(data.taskListId);
  }
}

export class Subtask {
  constructor(data) {
    if (isObject(data)) {
      if (data.id !== undefined) this.id = data.id;
      if (data.title !== undefined) this.title = data.title;
      this.complete = data.complete || false;
    }
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.expire = entity.expire;
    this.priority = entity.priority;
    this.subtasks = entity.subtasks;
    this.creatorId = entity.creatorId;
    this.assigneeIds = entity.assigneeIds;
    this.labelIds = entity.labelIds;
    this.taskListId = entity.taskListId;
    // relations:
    if (entity.comments) this.comments = entity.comments;
    if (entity.attachments) this.attachments = entity.attachments;
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
