import { toNumber } from "../../utils/utils.js";
import { BasicEntity } from "../basic/entity.js";

export class ProjectElemEntity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.id !== undefined) this.id = toNumber(data.id);
    if (data.projectId !== undefined) this.projectId = toNumber(data.projectId);
  }
}
