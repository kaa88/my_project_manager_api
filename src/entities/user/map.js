import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/mappers/basicDTO.js";
import { BasicEntity } from "../../shared/mappers/basicEntity.js";

export class Entity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.email !== undefined) this.email = data.email;
    if (data.password !== undefined) this.password = data.password;
    if (data.role !== undefined) this.role = data.role;
    if (data.isEmailVerified !== undefined)
      this.isEmailVerified = data.isEmailVerified;
    if (data.isCookieAccepted !== undefined)
      this.isCookieAccepted = data.isCookieAccepted;
    if (data.firstName !== undefined) this.firstName = data.firstName;
    if (data.lastName !== undefined) this.lastName = data.lastName;
    if (data.image !== undefined) this.image = data.image;
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    if (!isShortResult) {
      this.email = entity.email;
      this.role = entity.role;
      this.isEmailVerified = entity.isEmailVerified;
      this.isCookieAccepted = entity.isCookieAccepted;
    }
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.image = entity.image;
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
