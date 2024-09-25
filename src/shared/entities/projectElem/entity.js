import { BasicEntity } from "../basic/entity.js";
import { toNumber } from "../../utils/utils.js";

export class ProjectElemEntity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.relativeId !== undefined)
      this.relativeId = toNumber(data.relativeId);
    if (data.projectId !== undefined) this.projectId = toNumber(data.projectId);
  }
}
