import { toNumber } from "../utils.js";

const DEFAULT_LIMIT = 50;

export class PaginationParams {
  constructor(params = {}) {
    const limit = toNumber(params.max);
    this.limit = limit <= 0 ? DEFAULT_LIMIT : limit;
    const offset = toNumber(params.page);
    this.offset = (offset <= 0 ? 0 : offset) * this.limit;
    if (params.order) this.order = /desc/i.test(params.order) ? "desc" : "asc";
    if (params.orderBy) this.orderBy = params.orderBy;
  }
}

export class PaginationDTO {
  constructor(query, itemDTOs, totalItems) {
    this.max = query.limit;
    this.page = Math.floor((query.offset || 0) / this.max);
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / this.max);
    this.items = itemDTOs;
  }
}
