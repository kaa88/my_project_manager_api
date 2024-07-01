import { toNumber } from "../../shared/utils.js";

export class Task {
  constructor(data) {
    this.title = data ? data.title : "";
    this.description = data ? data.descr : "";
    this.expire = data ? data.expireDate : "";
    this.priority = data ? data.priority : 0;
    this.subtasks = data ? data.subtasks : "";
    // this.label = data ? data.label : "";
    // this.group = data ? data.group : [];
    // this.creator = data ? data.creator : "";
    // this.assignee = data ? data.assignee : [];
    // this.comments = data ? data.comments : "";
    // this.attachments = data ? data.attachments : [];

    // for (let key in this) {
    //   if (this[key] === undefined) delete this[key];
    // }
  }
}

export class SearchParams {
  constructor(params = {}) {
    if (params.search !== undefined) this.search = params.search;
    else {
      this.id = params.id;
      this.createdAt = params.createdAt;
      this.updatedAt = params.updatedAt;

      this.title = params.title;
      this.description = params.descr;
      this.expire = params.expire;
      this.priority = params.priority;
      this.subtasks = params.subtasks;
      // this.labelId = params.label;
      // this.groupId = params.group;
      // this.creatorId = params.creator;
      // this.assigneeId = params.assignee;
      // this.commentsId = params.comments;
      // this.attachmentsId = params.attachments;
    }
  }
}

export class PaginationParams {
  constructor(params = {}) {
    const limit = toNumber(params.max);
    this.limit = limit < 0 ? 0 : limit;
    const offset = toNumber(params.page);
    this.offset = (offset < 0 ? 0 : offset) * this.limit;
    if (params.order) this.order = /desc/i.test(params.order) ? "desc" : "asc";
    if (params.orderBy) this.orderBy = params.orderBy;
  }
}

export class GetDTOWithPagination {
  constructor(query, itemDTOs, totalItems) {
    this.max = query.limit || 0;
    this.page = Math.floor(query.offset / this.max);
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / this.max);
    this.items = itemDTOs;
  }
}

export class GetDTO {
  constructor(entity) {
    if (entity.id) this.id = entity.id;
    if (entity.createdAt) this.createdAt = entity.createdAt;
    if (entity.updatedAt) this.updatedAt = entity.updatedAt;

    if (entity.title) this.title = entity.title;
    if (entity.description) this.descr = entity.description;
    if (entity.expire) this.expire = entity.expire;
    if (entity.priority) this.priority = entity.priority;
    if (entity.subtasks) this.subtasks = entity.subtasks;
    // this.labelId = entity.label;
    // this.groupId = entity.group;
    // this.creatorId = entity.creator;
    // this.assigneeId = entity.assignee;
    // this.commentsId = entity.comments;
    // this.attachmentsId = entity.attachments;
  }
}
export class CreateDTO extends GetDTO {
  constructor(entity) {
    super(entity);
  }
}
export class UpdateDTO {
  constructor(entity, updatedFields = {}) {
    this.id = entity.id;
    for (let key in updatedFields) {
      if (updatedFields[key] !== undefined) this[key] = updatedFields[key];
    }
  }
}
export class DeleteDTO {
  constructor(entity) {
    this.message = `Deleted entry with id: ${entity.id}`;
  }
}
