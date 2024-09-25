import { BasicEntity } from "../../shared/entities/basic/entity.js";
import {
  toNumberArrayOrNull,
  toNumberOrNull,
} from "../../shared/utils/utils.js";

export class Entity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined)
      this.description = data.description || "";
    if (data.ownerId !== undefined) this.ownerId = toNumberOrNull(data.ownerId);
    if (data.adminIds !== undefined)
      this.adminIds = toNumberArrayOrNull(data.adminIds) || [];
    if (data.memberIds !== undefined)
      this.memberIds = toNumberArrayOrNull(data.memberIds) || [];
  }
}
