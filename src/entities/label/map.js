import { ProjectElemEntity } from "../../shared/entities/projectElem/entity.js";
import {
  ProjectElemGetDTO,
  ProjectElemDeleteDTO,
  ProjectElemUpdateDTO,
} from "../../shared/entities/projectElem/dto.js";
import { toNumberOrNull } from "../../shared/utils/utils.js";

export class Entity extends ProjectElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined)
      this.description = data.description || "";
    if (data.color !== undefined) this.color = data.color || "";
    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);
  }
}

export class GetDTO extends ProjectElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.color = entity.color;
    this.creatorId = entity.creatorId;
  }
}

export class CreateDTO extends GetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class UpdateDTO extends ProjectElemUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export const DeleteDTO = ProjectElemDeleteDTO;
