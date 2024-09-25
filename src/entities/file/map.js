import { BoardElemEntity } from "../../shared/entities/boardElem/entity.js";
import {
  BoardElemDeleteDTO,
  BoardElemGetDTO,
  BoardElemUpdateDTO,
} from "../../shared/entities/boardElem/dto.js";
import { GetDTO as TaskDTO } from "../task/map.js";
import { toNumberOrNull } from "../../shared/utils/utils.js";

export class Entity extends BoardElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined)
      this.description = data.description || "";
    if (data.path !== undefined) this.path = data.path;
    if (data.type !== undefined) this.type = data.type;
    if (data.size !== undefined) this.size = data.size;
    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);
    if (data.taskId !== undefined) this.taskId = toNumberOrNull(data.taskId);
  }
}

export class GetDTO extends BoardElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.path = entity.path;
    this.type = entity.type;
    this.size = entity.size;
    this.creatorId = entity.creatorId;
    this.taskId = entity.taskId;
    // relations:
    if (entity.task) this.task = new TaskDTO(entity.task, true);
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
