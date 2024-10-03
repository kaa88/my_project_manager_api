import { ProjectElemEntity } from "../../shared/entities/projectElem/entity.js";
import {
  ProjectElemGetDTO,
  ProjectElemCreateDTO,
  ProjectElemUpdateDTO,
  ProjectElemDeleteDTO,
} from "../../shared/entities/projectElem/dto.js";
import { GetDTO as TeamsToBoardsDTO } from "../_relationTables/teamsToBoards/map.js";
import {
  isArray,
  toNumberArrayOrNull,
  toNumberOrNull,
} from "../../shared/utils/utils.js";

export class Entity extends ProjectElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined)
      this.description = data.description || "";
    if (data.image !== undefined) this.image = data.image || "";
    if (data.leaderId !== undefined)
      this.leaderId = toNumberOrNull(data.leaderId);
    if (data.memberIds !== undefined)
      this.memberIds = toNumberArrayOrNull(data.memberIds) || [];

    // controller handled props: boardsIds
  }
}

export class GetDTO extends ProjectElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.image = entity.image;
    this.leaderId = entity.leaderId;
    this.memberIds = entity.memberIds;
    // relations:
    if (entity.teamsToBoards)
      this.teamsToBoards = isArray(entity.teamsToBoards)
        ? entity.teamsToBoards.map((item) => new TeamsToBoardsDTO(item, true))
        : [];

    // controller handled props: boardsIds
  }
}
export class CreateDTO extends ProjectElemCreateDTO {
  constructor(entity) {
    super(entity, GetDTO);
  }
}

export class UpdateDTO extends ProjectElemUpdateDTO {
  constructor(entity, updatedValues = {}) {
    super(entity, updatedValues, GetDTO);
  }
}

export const DeleteDTO = ProjectElemDeleteDTO;
