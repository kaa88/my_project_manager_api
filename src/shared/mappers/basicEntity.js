import { toNumber } from "../utils.js";

export class BasicEntity {
  constructor() {}
}

export class ProjectElemEntity extends BasicEntity {
  constructor(data = {}) {
    super(data);
    if (data.id !== undefined) this.id = toNumber(data.id);
    if (data.projectId !== undefined) this.projectId = toNumber(data.projectId);
  }
}

export class BoardElemEntity extends ProjectElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.boardId !== undefined) this.boardId = toNumber(data.boardId);
  }
}
