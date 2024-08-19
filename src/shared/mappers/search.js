import { toNumber, toNumberArray } from "../utils.js";

export class BasicSearchParams {
  constructor(data = {}) {
    if (data.id !== undefined) this.id = toNumberArray(data.id);
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}

// не используются в findAll - исправить
export class ProjectElemSearchParams extends BasicSearchParams {
  constructor(data = {}) {
    super(data);
    this.projectId = toNumber(data.projectId);
  }
}

export class BoardElemSearchParams extends ProjectElemSearchParams {
  constructor(data = {}) {
    super(data);
    this.boardId = toNumber(data.boardId);
  }
}

export class SearchParams {
  constructor(params = {}) {
    if (params.search !== undefined) this.search = params.search;
    // else {
    //   this.id = params.id;
    //   this.createdAt = params.createdAt;
    //   this.updatedAt = params.updatedAt;

    //   this.title = params.title;
    //   this.description = params.descr;
    //   this.expire = params.expire;
    //   this.priority = params.priority;
    //   this.subtasks = params.subtasks;
    // }
  }
}
