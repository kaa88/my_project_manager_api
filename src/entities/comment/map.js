import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/mappers/basicDTO.js";
import { ProjectElemBasicEntity } from "../../shared/mappers/basicEntity.js";
import { toNumber } from "../../shared/utils.js";

export class Entity extends ProjectElemBasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.content !== undefined) this.content = data.content;
    if (data.rating !== undefined) this.rating = toNumber(data.rating);
    if (data.authorId !== undefined) this.authorId = toNumber(data.authorId);
    if (data.taskId !== undefined) this.taskId = toNumber(data.taskId);
    if (data.parentCommentId !== undefined)
      this.parentCommentId = toNumber(data.parentCommentId);
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
    this.content = entity.content;
    this.rating = entity.rating;
    this.authorId = entity.authorId;
    this.parentCommentId = entity.parentCommentId;
    // relations:
    if (entity.taskId) this.taskId = entity.taskId;
    if (entity.parentCommentId) this.parentCommentId = entity.parentCommentId;
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
