import { db } from "../../db/db.js";
import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import {
  BasicCreateDTO,
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../mappers/basicDTO.js";
import { BasicEntity } from "../mappers/basicEntity.js";
import { BasicModel } from "../models/basicModel.js";
import { PaginationDTO, PaginationParams } from "../mappers/pagination.js";
import { BasicSearchParams } from "../mappers/search.js";

export class BasicController {
  constructor(params = {}) {
    if (params.model) {
      this.create = new CreateHandler(
        params.model || new BasicModel(),
        params.dto.create || BasicCreateDTO,
        params.entity || BasicEntity
      );
      this.update = new UpdateHandler(
        params.model || new BasicModel(),
        params.dto.update || BasicUpdateDTO,
        params.entity || BasicEntity
      );
      this.delete = new DeleteHandler(
        params.model || new BasicModel(),
        params.dto.delete || BasicDeleteDTO
      );
      this.findOne = new FindOneHandler(
        params.model || new BasicModel(),
        params.dto.get || BasicGetDTO
      );
      this.findMany = new FindManyHandler(
        params.model || new BasicModel(),
        params.dto.get || BasicGetDTO,
        params.entity || BasicEntity
      );
      // this.search = new SearchHandler(
      //   params.model || new BasicModel(),
      //   params.dto.get || BasicGetDTO
      // );
    }
  }
}

function CreateHandler(model, CreateDTO, Entity) {
  return async (req, res, next) => {
    try {
      const values = new Entity(req.body);

      const response = await db.create({ model, values });
      if (!response) return next(ApiError.internal("Database error"));
      return res.json(new CreateDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, UpdateDTO, Entity) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!id) return next(ApiError.badRequest(Message.required("id")));

      const values = new Entity(req.body);
      values.updatedAt = new Date();

      const response = await db.update({ model, values, id });
      if (!response) return next(ApiError.notFound(Message.notFound({ id })));
      return res.json(new UpdateDTO(response, values));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function DeleteHandler(model, DeleteDTO) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!id) return next(ApiError.badRequest(Message.required("id")));

      const response = await db.delete({ model, id });
      if (!response) return next(ApiError.notFound(Message.notFound({ id })));
      return res.json(new DeleteDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindOneHandler(model, GetDTO) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!id) return next(ApiError.badRequest(Message.required("id")));

      const response = await db.findOne({ model, query: { id } });
      if (!response) return next(ApiError.notFound(Message.notFound({ id })));
      return res.json(new GetDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindManyHandler(model, GetDTO, Entity) {
  return async (req, res, next) => {
    try {
      const params = req.query;
      const query = {
        ...new PaginationParams(params),
        ...new BasicSearchParams(params),
        ...new Entity(params),
      };

      const response = await db.findMany({ model, query });
      const itemDTOs = response.items.map((item) => new GetDTO(item));

      return res.json(new PaginationDTO(query, itemDTOs, response.total));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}
