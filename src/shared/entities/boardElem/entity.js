import { toNumber } from "../../utils/utils.js";
import { ProjectElemEntity } from "../projectElem/entity.js";

export class BoardElemEntity extends ProjectElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.boardId !== undefined) this.boardId = toNumber(data.boardId);
  }
}
