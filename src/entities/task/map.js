import { ApiError } from "../../services/error/apiError.js";
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
        throw ApiError.badRequest("'subtasks' must be an Array");
      this.subtasks = data.subtasks.map((item) => new Subtask(item));
    }

    if (data.creatorId !== undefined) this.creatorId = toNumber(data.creatorId);

    if (data.assigneeId !== undefined) {
      this.assigneeId = isArray(data.assigneeId)
        ? data.assigneeId
        : [data.assigneeId];
      this.assigneeId.forEach((item) => {
        if (typeof item !== "number")
          throw ApiError.badRequest(
            "'assigneeId' must be a number or number[]"
          );
      });
    }

    if (data.taskGroupId !== undefined) {
      this.taskGroupId = data.taskGroupId; // ? rel
    }

    if (data.taskListId !== undefined)
      this.taskListId = toNumber(data.taskListId);

    // comment
    // attachment
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
  constructor(entity) {
    super(entity);
    this.title = entity.title;
    this.description = entity.description;
    this.expire = entity.expire;
    this.priority = entity.priority;
    this.subtasks = entity.subtasks;
    this.creatorId = entity.creatorId;
    this.assigneeId = entity.assigneeId;
    this.projectId = entity.projectId;
    this.taskGroupId = entity.taskGroupId;
    this.taskListId = entity.taskListId;
    // this.commentsId = entity.comments;
    // this.attachmentsId = entity.attachments;
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
