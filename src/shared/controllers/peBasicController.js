import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { db } from "../../db/db.js";
import { projects as projectModel } from "../../db/schema.js";
import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../mappers/basicDTO.js";
import { ProjectElemBasicEntity } from "../mappers/basicEntity.js";
import { isObject } from "../utils.js";
import { BasicController } from "./basicController.js";

export class ProjectElemBasicController extends BasicController {
  constructor({ model, entity = ProjectElemBasicEntity, dto = {} }) {
    super({ model, entity, dto });

    this.create = new CreateHandler(model, this.create);

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
    this.findMany = new FindManyHandler(model, this.findMany);
  }
}

// TODO: add member check
function CreateHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      const projectId = Number(req.body.projectId);
      if (!projectId) throw ApiError.badRequest(Message.required("projectId"));

      const project = await db.findOne({
        model: projectModel,
        query: { id: projectId },
      });
      if (!project)
        throw ApiError.badRequest(
          `Project with id=${projectId} does not exist`
        );

      req.body.id = await db.generateId({ model, projectId });
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }

    return await parentHandler(req, res, next);
  };
}

function UpdateHandler(model, Entity, UpdateDTO) {
  return async (req, res, next) => {
    try {
      const query = getIdsFromQuery({ ...req.params, ...req.query });
      delete req.body.id;
      delete req.body.projectId;
      const values = new Entity(req.body);
      values.updatedAt = new Date();

      const response = await db.update({ model, values, query });
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
      const query = getIdsFromQuery({ ...req.params, ...req.query });
      const values = { deletedAt: new Date() };

      const response = await db.update({ model, values, query });
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
      const query = getIdsFromQuery({ ...req.params, ...req.query });

      const response = await db.findOne({ model, query });
      if (!response) throw ApiError.notFound(Message.notFound(query));
      return res.json(new GetDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindManyHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      const projectId = Number(req.query.projectId);
      if (!projectId) throw ApiError.badRequest(Message.required("projectId"));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }

    return await parentHandler(req, res, next);
  };
}

const getIdsFromQuery = (query) => {
  if (!isObject(query))
    throw ApiError.internal(Message.incorrect("query", "object"));

  const id = Number(query.id);
  const projectId = Number(query.projectId);

  if (!id || !projectId)
    throw ApiError.badRequest(
      Message.required([!id && "id", !projectId && "projectId"])
    );

  return { id, projectId };
};
