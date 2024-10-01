import { BoardElemEntity } from "../../shared/entities/boardElem/entity.js";
import {
  BoardElemGetDTO,
  BoardElemCreateDTO,
  BoardElemUpdateDTO,
  BoardElemDeleteDTO,
} from "../../shared/entities/boardElem/dto.js";
import { GetDTO as TaskDTO } from "../task/map.js";
import { toNumber, toNumberOrNull } from "../../shared/utils/utils.js";

export class Entity extends BoardElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.content !== undefined) this.content = data.content;
    if (data.rating !== undefined) this.rating = toNumber(data.rating);
    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);
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
    this.creatorId = entity.creatorId;
    this.taskId = entity.taskId;
    this.parentCommentId = entity.parentCommentId;
    // relations:
    if (entity.task) this.task = new TaskDTO(entity.task, true);
    if (entity.parentComment)
      this.parentComment = new GetDTO(entity.parentComment, true);
  }
}
export class CreateDTO extends BoardElemCreateDTO {
  constructor(entity) {
    super(entity, GetDTO);
  }
}

export class UpdateDTO extends BoardElemUpdateDTO {
  constructor(entity, updatedValues = {}) {
    super(entity, updatedValues, GetDTO);
  }
}

export const DeleteDTO = BoardElemDeleteDTO;
