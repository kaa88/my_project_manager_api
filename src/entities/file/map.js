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
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.path !== undefined) this.path = data.path;
    if (data.authorId !== undefined) this.authorId = toNumber(data.authorId);
    if (data.taskId !== undefined) this.taskId = toNumber(data.taskId);
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
    this.title = entity.title;
    this.description = entity.description;
    this.path = entity.path;
    this.authorId = entity.authorId;
    // relations:
    if (entity.taskId) this.taskId = entity.taskId;
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
