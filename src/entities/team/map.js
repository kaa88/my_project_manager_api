import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/mappers/basicDTO.js";
import { ProjectElemBasicEntity } from "../../shared/mappers/basicEntity.js";
import { toNumber, toNumberArray } from "../../shared/utils.js";

export class Entity extends ProjectElemBasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.image !== undefined) this.image = data.image;

    if (data.leaderId !== undefined) this.leaderId = toNumber(data.leaderId);

    if (data.members !== undefined) {
      this.members = toNumberArray(data.members);
      if (!this.members)
        throw ApiError.badRequest(Message.incorrectIds("members"));
    }

    if (data.boards !== undefined) {
      this.boards = toNumberArray(data.boards);
      if (!this.boards)
        throw ApiError.badRequest(Message.incorrectIds("boards"));
    }
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
    this.title = entity.title;
    this.description = entity.description;
    this.image = entity.image;
    this.leaderId = entity.leaderId;
    this.members = entity.members;
    // relations:
    if (entity.board) this.board = entity.board; // ?
    if (entity.boards) this.boards = entity.boards;
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
