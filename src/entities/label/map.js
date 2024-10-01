import { ProjectElemEntity } from "../../shared/entities/projectElem/entity.js";
import {
  ProjectElemGetDTO,
  ProjectElemCreateDTO,
  ProjectElemUpdateDTO,
  ProjectElemDeleteDTO,
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
