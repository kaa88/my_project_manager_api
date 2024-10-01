import { ApiError, Message } from "../../services/error/index.js";
import { BasicEntity } from "../../shared/entities/basic/entity.js";
import {
  BasicGetDTO,
  BasicCreateDTO,
  BasicUpdateDTO,
  BasicDeleteDTO,
} from "../../shared/entities/basic/dto.js";
import { GetDTO as ProfileDTO } from "../profile/map.js";
import { isArray, toBoolean } from "../../shared/utils/utils.js";

export class Entity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.email !== undefined) this.email = data.email;
    if (data.password !== undefined) this.password = data.password;
    if (data.isEmailVerified !== undefined)
      this.isEmailVerified = toBoolean(data.isEmailVerified);
    if (data.isCookieAccepted !== undefined)
      this.isCookieAccepted = toBoolean(data.isCookieAccepted);
    if (data.isAdmin !== undefined) this.isAdmin = toBoolean(data.isAdmin);
    if (data.lastVisitAt !== undefined) this.lastVisitAt = data.lastVisitAt;

    if (data.refreshTokens !== undefined) {
      if (!isArray(data.refreshTokens))
        throw ApiError.badRequest(Message.incorrect("refreshTokens", "Array"));
      this.refreshTokens = data.refreshTokens;
    }

    if (data.passwordRestoreCode !== undefined)
      this.passwordRestoreCode = data.passwordRestoreCode || "";
    if (data.verificationCode !== undefined)
      this.verificationCode = data.verificationCode || "";
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.email = entity.email;
    if (!isShortResult) {
      this.isEmailVerified = entity.isEmailVerified;
      this.isCookieAccepted = entity.isCookieAccepted;
      this.isAdmin = entity.isAdmin;
    }
    // relations:
    if (entity.profile) this.profile = new ProfileDTO(entity.profile, true);
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
