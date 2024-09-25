import { ApiError, Message } from "../../services/error/index.js";
import { BoardElemEntity } from "../../shared/entities/boardElem/entity.js";
import {
  BoardElemDeleteDTO,
  BoardElemGetDTO,
  BoardElemUpdateDTO,
} from "../../shared/entities/boardElem/dto.js";
import { GetDTO as CommentDTO } from "../comment/map.js";
import { GetDTO as FileDTO } from "../file/map.js";
import {
  isArray,
  isObject,
  toBoolean,
  toNumber,
  toNumberArrayOrNull,
  toNumberOrNull,
} from "../../shared/utils/utils.js";
import { getShortDateString } from "../../shared/utils/date.js";

export class Task extends BoardElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;

    if (data.description !== undefined)
      this.description = data.description || "";

    if (data.expire !== undefined)
      this.expire = data.expire ? getShortDateString(data.expire) : "";

    if (data.priority !== undefined) this.priority = toNumber(data.priority);

    if (data.subtasks !== undefined) {
      if (!isArray(data.subtasks))
        throw ApiError.badRequest(Message.incorrect("subtasks", "Array"));
      this.subtasks = data.subtasks.map((item) => new Subtask(item));
    }

    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);

    if (data.assigneeIds !== undefined)
      this.assigneeIds = toNumberArrayOrNull(data.assigneeIds) || [];

    if (data.taskListId !== undefined)
      this.taskListId = toNumberOrNull(data.taskListId);

    if (data.labelIds !== undefined)
      this.labelIds = toNumberArrayOrNull(data.labelIds) || [];
  }
}

export class Subtask {
  constructor(data) {
    if (isObject(data)) {
      this.id = toNumberOrNull(data.id);
      if (data.title !== undefined) this.title = String(data.title);
      if (data.complete !== undefined) this.complete = toBoolean(data.complete);
    }
  }
}

export class GetDTO extends BoardElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.expire = entity.expire;
    this.priority = entity.priority;
    this.subtasks = entity.subtasks;
    this.creatorId = entity.creatorId;
    this.assigneeIds = entity.assigneeIds;
    this.taskListId = entity.taskListId;
    this.labelIds = entity.labelIds;
    // relations:
    if (entity.comments)
      this.comments = isArray(entity.comments)
        ? entity.comments.map((item) => new CommentDTO(item, true))
        : [];
    if (entity.files)
      this.files = isArray(entity.files)
        ? entity.files.map((item) => new FileDTO(item, true))
        : [];
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
