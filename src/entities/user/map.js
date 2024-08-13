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

export class Entity {
  constructor(data = {}) {
    if (data.email !== undefined) this.email = data.email;
    if (data.password !== undefined) this.password = data.password;
    if (data.role !== undefined) this.role = data.role;
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
    this.email = entity.email;
    this.password = entity.password;
    this.role = entity.role;
    // this.priority = entity.priority;
    // this.subtasks = entity.subtasks;
    // this.creatorId = entity.creatorId;
    // this.assigneeId = entity.assigneeId;
    // this.projectId = entity.projectId;
    // this.taskGroupId = entity.taskGroupId;
    // this.taskListId = entity.taskListId;
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
