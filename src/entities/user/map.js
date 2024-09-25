import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/entities/basic/dto.js";
import { BasicEntity } from "../../shared/entities/basic/entity.js";
import { toBoolean } from "../../shared/utils/utils.js";

export class User extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.email !== undefined) this.email = data.email;
    if (data.password !== undefined) this.password = data.password;
    if (data.isEmailVerified !== undefined)
      this.isEmailVerified = toBoolean(data.isEmailVerified);
    if (data.isCookieAccepted !== undefined)
      this.isCookieAccepted = toBoolean(data.isCookieAccepted);
    if (data.isAdmin !== undefined) this.isAdmin = toBoolean(data.isAdmin);
  }
}

export class UserInfo extends BasicEntity {
  // не знаю как эти классы разделить в запросах (сделать userController и userInfoController?)
  constructor(data = {}) {
    super(data);
    if (data.firstName !== undefined) this.firstName = data.firstName;
    if (data.lastName !== undefined) this.lastName = data.lastName;
    if (data.avatar !== undefined) this.avatar = data.avatar;
    if (data.status !== undefined) this.status = data.status;
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.email = entity.email || entity.user?.email;
    if (!isShortResult) {
      this.isEmailVerified = entity.isEmailVerified;
      this.isCookieAccepted = entity.isCookieAccepted;
      this.isAdmin = entity.isAdmin;
      this.userInfoId = entity.userInfoId; // temp
    }
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.avatar = entity.avatar;
    this.status = entity.status;
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
