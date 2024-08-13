import { toNumber } from "../utils.js";

export class BasicSearchParams {
  constructor(data = {}) {
    if (data.id !== undefined) {
      const ids = data.id.split(",").map((item) => toNumber(item));
      this.id = ids.length > 1 ? ids : ids[0];
    }
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class ProjectElemBasicSearchParams extends BasicSearchParams {
  constructor(data = {}) {
    super(data);
    this.projectId = toNumber(data.projectId);
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
