import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { db } from "../../db/db.js";
import {
  BasicCreateDTO,
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../mappers/basicDTO.js";
import { BasicEntity } from "../mappers/basicEntity.js";
import { PaginationDTO, PaginationParams } from "../mappers/pagination.js";
import { BasicSearchParams } from "../mappers/search.js";
import { isObject } from "../utils.js";

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
      const query = req.customQuery || getIdsFromQuery(req.params);
      delete req.body.id;
      const values = new Entity(req.body);

      if (!Object.keys(values).length)
        throw ApiError.badRequest(
          "Update failed due to missing or invalid fields"
        );

      values.updatedAt = new Date();

      const response = await db.update({ model, query, values });
      if (!response) throw ApiError.notFound(Message.notFound(query));
      return res.json(new UpdateDTO(response, values));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function DeleteHandler(model, Entity, DeleteDTO) {
  return async (req, res, next) => {
    try {
      const query = req.customQuery || getIdsFromQuery(req.params);

      const response = await db.update({
        model,
        query: { ...query, deletedAt: null },
        values: { deletedAt: new Date() },
      });
      if (!response) throw ApiError.notFound(Message.notFound(query));
      return res.json(new DeleteDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindOneHandler(model, Entity, GetDTO) {
  return async (req, res, next) => {
    try {
      const query = req.customQuery || getIdsFromQuery(req.params);

      // temp
      const related = {
        // boards: { columns: { id: true } },
        // teams: { columns: { id: true } },
        // comments: true,
        // files: true,
        // labels: true,
        // tasks: true,
        // taskLists: true,
        // teams: true,
      };

      const response = await db.findOne({ model, query, related });
      if (!response) throw ApiError.notFound(Message.notFound(query));
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
        deletedAt: null,
      };

      let response = await db.findMany({ model, query });
      const itemDTOs = response.items.map((item) => new GetDTO(item, true));

      return res.json(new PaginationDTO(query, itemDTOs, response.total));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

const getIdsFromQuery = (query) => {
  if (!isObject(query))
    throw ApiError.internal(Message.incorrect("query", "object"));

  const id = Number(query.id);
  if (!id) throw ApiError.badRequest(Message.required("id"));
  return { id };
};
