import { toNumber } from "../../shared/utils.js";

export class Entity {
  constructor(dto) {
    this.title = dto ? dto.title : "";
    this.description = dto ? dto.descr : "";
    this.expire = dto ? dto.expireDate : "";
    this.priority = dto ? dto.priority : 0;
    this.label = dto ? dto.label : "";
    this.group = dto ? dto.group : [];
    this.creator = dto ? dto.creator : "";
    this.assignee = dto ? dto.assignee : [];
    this.subtasks = dto ? dto.subtasks : "";
    this.comments = dto ? dto.comments : "";
    this.attachments = dto ? dto.attachments : [];

    // for (let key in this) {
    //   if (this[key] === undefined) delete this[key];
    // }
  }
}

export class GetResponse {
  constructor(entity) {
    this.id = r.id;
  }
}
export class CreateResponse {
  constructor(entity) {
    this.id = r.id;
  }
}
export class UpdateResponse {
  constructor(entity) {
    this.id = r.id;
  }
}
export class DeleteResponse {
  constructor(entity) {
    this.id = r.id;
  }
}

export class PaginationParams {
  constructor(params = {}) {
    if (params.max) this.pageSize = toNumber(params.max);
    if (params.page) this.pageCount = toNumber(params.page);
    if (params.order) this.order = params.order.match(/desc/i) ? "DESC" : "ASC";
  }
}
export class SearchParams {
  constructor(params = {}) {
    if (params.search) this.search = params.search;
  }
}

const paramsGet = {
  max: 0,
  page: 0,
  order: "asc",
  search: "",
  id: "string",
  title: "string",
  descr: "string",
  createDate: "string",
  expireDate: "string",
  priority: 0,
  label: "string",
  group: [],
  creator: "string",
  assignee: [],
  subtasks: "string",
  comments: "string",
  attachments: [],
};
const paramsCreate = {
  title: "string",
  descr: "string",
  createDate: "string",
  expireDate: "string",
  priority: 0,
  label: "string",
  group: [],
  creator: "string",
  assignee: [],
  subtasks: "string",
  comments: "string",
  attachments: [],
};
const paramsUpdate = {
  id: "string",
  title: "string",
  descr: "string",
  createDate: "string",
  expireDate: "string",
  priority: 0,
  label: "string",
  group: [],
  creator: "string",
  assignee: [],
  subtasks: "string",
  comments: "string",
  attachments: [],
};
const paramsDelete = {
  id: "string",
};
