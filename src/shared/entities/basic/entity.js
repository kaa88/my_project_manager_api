import { toNumber } from "../../utils/utils.js";

export class BasicEntity {
  constructor(data = {}) {
    if (data.id !== undefined) this.id = toNumber(data.id);
    if (data.createdAt !== undefined) this.createdAt = data.createdAt;
    if (data.updatedAt !== undefined) this.updatedAt = data.updatedAt;
    if (data.deletedAt !== undefined) this.deletedAt = data.deletedAt;
  }
}
