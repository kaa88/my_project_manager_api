import {
  BasicGetDTO,
  BasicCreateDTO,
  BasicUpdateDTO,
  BasicDeleteDTO,
} from "../../shared/entities/basic/dto.js";

export class GetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.ownerId = entity.ownerId;
    this.adminIds = entity.adminIds;
    this.memberIds = entity.memberIds;
    // relations в другом файле из-за циклических ссылок
  }
}

export class CreateDTO extends BasicCreateDTO {
  constructor(entity) {
    super(entity, GetDTO);
  }
}

export class UpdateDTO extends BasicUpdateDTO {
  constructor(entity, updatedValues = {}) {
    super(entity, updatedValues, GetDTO);
  }
}

export const DeleteDTO = BasicDeleteDTO;
