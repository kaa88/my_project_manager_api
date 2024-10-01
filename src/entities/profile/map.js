import { BasicEntity } from "../../shared/entities/basic/entity.js";
import {
  BasicGetDTO,
  BasicCreateDTO,
  BasicUpdateDTO,
  BasicDeleteDTO,
} from "../../shared/entities/basic/dto.js";
import { toNumber } from "../../shared/utils/utils.js";

export class Entity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.firstName !== undefined) this.firstName = data.firstName || "";
    if (data.lastName !== undefined) this.lastName = data.lastName || "";
    if (data.avatar !== undefined) this.avatar = data.avatar || "";
    if (data.status !== undefined) this.status = data.status || "";

    if (data.userId !== undefined) this.userId = toNumber(data.userId);
    // добавить email для поиска по email ???
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.avatar = entity.avatar;
    this.status = entity.status;
    // relations:
    this.email = entity.user?.email;
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
