import { db } from "../../db/db.js";
// import { getDbPaginationProps, getDbWhereProps } from "../../db/dbProps.js";
import { ApiError, Message } from "../../services/error/error.js";
import {
  BasicCreateDTO,
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../mappers/basicDTO.js";
import { PaginationDTO, PaginationParams } from "../mappers/pagination.js";
// import { SearchParams } from "../mappers/search.js";
import { BasicEntity } from "../mappers/basicEntity.js";
import { BasicModel } from "../models/basicModel.js";

// get - одна таска по id // get(id) или get({id: ''})
// несколько тасок - либо пустой запрос (все), либо search query // get() или get({search: 'ищет во всех полях', createDate: 'ищет в одном'})

export class BasicController {
  constructor(params = {}) {
    if (params.model) {
      this.create = getCreateHandler(
        params.model || new BasicModel(),
        params.dto.create || BasicCreateDTO,
        params.entity || BasicEntity
      );
      this.update = getUpdateHandler(
        params.model || new BasicModel(),
        params.dto.update || BasicUpdateDTO,
        params.entity || BasicEntity
      );
      this.delete = getDeleteHandler(
        params.model || new BasicModel(),
        params.dto.delete || BasicDeleteDTO
      );
      this.findMany = getFindManyHandler(
        params.model || new BasicModel(),
        params.dto.get || BasicGetDTO,
        params.entity || BasicEntity,
        params.customChunks
      );
      this.findOne = getFindOneHandler(
        params.model || new BasicModel(),
        params.dto.get || BasicGetDTO
      );
      // this.search = getSearchHandler(
      //   params.model || new BasicModel(),
      //   params.dto.get || BasicGetDTO
      // );
    }
  }
}

const getCreateHandler =
  (model, CreateDTO, Entity) => async (req, res, next) => {
    const params = req.body;
    const values = new Entity(params);
    try {
      const response = await db.create({ model, values });
      return res.json(response.map((item) => new CreateDTO(item)));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };

const getUpdateHandler =
  (model, UpdateDTO, Entity) => async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(ApiError.badRequest(Message.required("id")));

    const params = req.body;
    const values = new Entity(params);
    values.updatedAt = new Date();
    try {
      const response = await db.update({ model, values, id });
      if (!response.length)
        return next(ApiError.notFound(Message.notFound({ id })));
      return res.json(response.map((item) => new UpdateDTO(item, values)));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };

const getDeleteHandler = (model, DeleteDTO) => async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(ApiError.badRequest(Message.required("id")));
  try {
    const response = await db.delete({ model, id });
    if (!response.length)
      return next(ApiError.notFound(Message.notFound({ id })));
    return res.json(response.map((item) => new DeleteDTO(item)));
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
};

const getFindManyHandler =
  (model, GetDTO, Entity, customChunks) => async (req, res, next) => {
    try {
      const params = req.query;
      // const paginationParams = new PaginationParams(params);
      // const searchParams = new SearchParams(params);

      const query = {
        ...new PaginationParams(params),
        ...new Entity(params),
      };

      // console.log(new Entity(params));
      // const dbQuery = {
      //   ...getDbPaginationProps({
      //     query: paginationParams,
      //     model,
      //   }),
      //   ...getDbWhereProps({
      //     query: searchParams,
      //     model,
      //     customChunks,
      //     // customChunks: getDbQueryChunks({ query: searchParams, model }),
      //   }),
      // };

      let totalItems;
      // if (dbQuery.limit)
      totalItems = await db.count({ model, query });

      // console.log(totalItems);

      // console.log("dbQuery.limit", dbQuery.limit);
      // console.log("totalItems", totalItems);

      const response = await db.findMany({ model, query, customChunks });
      const itemDTOs = response.map((item) => new GetDTO(item));

      return res.json(
        // response
        totalItems ? new PaginationDTO(query, itemDTOs, totalItems) : itemDTOs
      );
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };

const getFindOneHandler = (model, GetDTO) => async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) return next(ApiError.badRequest(Message.required("id")));
  try {
    const response = await db.findOne({
      model,
      query: queryParser.getWhereProps({ model, query: { id } }),
    });
    if (!response) return next(ApiError.notFound(Message.notFound({ id })));
    return res.json(new GetDTO(response));
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
};
