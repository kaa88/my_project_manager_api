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
import { PaginationDTO, PaginationParams } from "../mappers/pagination.js";
import { BasicSearchParams } from "../mappers/search.js";

export class BasicController {
  constructor({ model, entity = BasicEntity, dto = {} }) {
    if (!model) throw ApiError.internal("No model provided");

    this.create = new CreateHandler(
      model,
      entity,
      dto.create || BasicCreateDTO
    );
    this.update = new UpdateHandler(
      model,
      entity,
      dto.update || BasicUpdateDTO
    );
    this.delete = new DeleteHandler(
      model,
      entity,
      dto.delete || BasicDeleteDTO
    );
    this.findOne = new FindOneHandler(model, entity, dto.get || BasicGetDTO);
    this.findMany = new FindManyHandler(model, entity, dto.get || BasicGetDTO);
    // this.search = new SearchHandler();
  }
}

function CreateHandler(model, Entity, CreateDTO) {
  return async (req, res, next) => {
    try {
      const values = new Entity(req.body);

      const response = await db.create({ model, values });
      if (!response) throw ApiError.internal("Database error");
      return res.json(new CreateDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, Entity, UpdateDTO) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!id) throw ApiError.badRequest(Message.required("id"));

      const values = new Entity(req.body);
      values.updatedAt = new Date();

      const response = await db.update({ model, values, query: { id } });
      if (!response) throw ApiError.notFound(Message.notFound({ id }));
      return res.json(new UpdateDTO(response, values));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function DeleteHandler(model, Entity, DeleteDTO) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!id) throw ApiError.badRequest(Message.required("id"));

      const response = await db.delete({ model, query: { id } });
      if (!response) throw ApiError.notFound(Message.notFound({ id }));
      return res.json(new DeleteDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindOneHandler(model, Entity, GetDTO) {
  return async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!id) throw ApiError.badRequest(Message.required("id"));

      const response = await db.findOne({ model, query: { id } });
      if (!response) throw ApiError.notFound(Message.notFound({ id }));
      return res.json(new GetDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindManyHandler(model, Entity, GetDTO) {
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
