import { ApiError, Message } from "../../error/error.js";
import { db } from "../../db/db.js";
import {
  getQueryPaginationProps,
  getQueryWhereProps,
} from "../../db/generic.js";

import model from "./model.js";
import {
  Task,
  PaginationParams,
  SearchParams,
  GetDTO,
  CreateDTO,
  UpdateDTO,
  DeleteDTO,
  GetDTOWithPagination,
} from "./dto.js";
import { getDbQueryChunks } from "./db.js";
import { count } from "drizzle-orm";

// export const controller = getDefaultController(model);

// get - одна таска по id // get(id) или get({id: ''})
// несколько тасок - либо пустой запрос (все), либо search query // get() или get({search: 'ищет во всех полях', createDate: 'ищет в одном'})

export const controller = {
  async get(req, res, next) {
    try {
      const params = req.query;
      const paginationParams = new PaginationParams(params);
      const searchParams = new SearchParams(params);

      const dbQuery = {
        ...getQueryPaginationProps({
          query: paginationParams,
          model,
        }),
        ...getQueryWhereProps({
          query: searchParams,
          model,
          customChunks: getDbQueryChunks({ query: searchParams, model }),
        }),
      };

      try {
        let totalItems;
        if (dbQuery.limit)
          totalItems = await db.count({ model, query: dbQuery });

        // console.log("dbQuery.limit", dbQuery.limit);
        // console.log("totalItems", totalItems);

        const response = await db.findMany({ model, query: dbQuery });
        // const itemDTOs = response.map((item) => new GetDTO(item));

        return res.json(
          response
          // totalItems
          //   ? new GetDTOWithPagination(dbQuery, itemDTOs, totalItems)
          //   : itemDTOs
        );
      } catch (e) {
        return next(e.isApiError ? e : ApiError.badRequest(e.message));
      }
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  },

  async create(req, res, next) {
    const params = req.body;
    const values = new Task(params);
    try {
      const response = await db.create({ model, values });
      return res.json(response.map((item) => new CreateDTO(item)));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.badRequest(e.message));
    }
  },

  async update(req, res, next) {
    const { id } = req.query;
    if (!id) return next(ApiError.badRequest(Message.required("id")));

    const params = req.body;
    const values = new Task(params);
    try {
      const response = await db.update({ model, values, id });
      if (!response.length)
        return next(ApiError.notFound(Message.notFound({ id })));
      return res.json(response.map((item) => new UpdateDTO(item, values)));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.badRequest(e.message));
    }
  },

  async delete(req, res, next) {
    const { id } = req.query;
    if (!id) return next(ApiError.badRequest(Message.required("id")));
    try {
      const response = await db.delete({ model, id });
      if (!response.length)
        return next(ApiError.notFound(Message.notFound({ id })));
      return res.json(response.map((item) => new DeleteDTO(item)));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.badRequest(e.message));
    }
  },
};
