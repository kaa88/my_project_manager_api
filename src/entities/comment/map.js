import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  BoardElemDeleteDTO,
  BoardElemGetDTO,
  BoardElemUpdateDTO,
} from "../../shared/mappers/boardElemDTO.js";
import { BoardElemEntity } from "../../shared/mappers/basicEntity.js";
import { toNumber, toNumberOrNull } from "../../shared/utils.js";

export class Entity extends BoardElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.content !== undefined) this.content = data.content;
    if (data.rating !== undefined) this.rating = toNumber(data.rating);
    if (data.authorId !== undefined)
      this.authorId = toNumberOrNull(data.authorId);
    if (data.taskId !== undefined) this.taskId = toNumberOrNull(data.taskId);
    if (data.parentCommentId !== undefined)
      this.parentCommentId = toNumberOrNull(data.parentCommentId);
  }
}

export class GetDTO extends BoardElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
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

export class UpdateDTO extends BoardElemUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export const DeleteDTO = BoardElemDeleteDTO;
