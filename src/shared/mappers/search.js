export class BasicSearchParams {
  constructor(data) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
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
