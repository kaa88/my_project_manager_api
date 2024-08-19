import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { db } from "../../db/db.js";
import { projects as projectModel } from "../../entities/project/model.js";
import { ProjectElemEntity } from "../mappers/basicEntity.js";
import { isObject } from "../utils.js";
import { BasicController } from "./basicController.js";

export class ProjectElemController extends BasicController {
  constructor({ model, entity = ProjectElemEntity, dto = {} }) {
    super({ model, entity, dto });

    this.create = new CreateHandler(model, this.create);
    this.update = new UpdateHandler(model, this.update);
    this.delete = new FindOneHandler(model, this.delete); // same handler as findOne
    this.findOne = new FindOneHandler(model, this.findOne);
    this.findMany = new FindManyHandler(model, this.findMany);
  }
}

function CreateHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      const { projectId } = getIdsFromQuery(req.body);

      const project = await db.findOne({
        model: projectModel,
        query: { id: projectId },
      });
      if (!project || project.deletedAt)
        throw ApiError.badRequest(
          `Project with id=${projectId} does not exist`
        );

      req.body.id = await db.generateId({ model, query: { projectId } });

      return await parentHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, parentHandler) {
  const handle = new FindOneHandler(model, parentHandler);
  return async (req, res, next) => {
    delete req.body.projectId;
    handle(req, res, next);
  };
}

function FindOneHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      req.customQuery = getIdsFromQuery({ ...req.params, ...req.query });

      return await parentHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindManyHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      getIdsFromQuery({ ...req.params, ...req.query }, true);

      return await parentHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

const getIdsFromQuery = (query, omitId) => {
  if (!isObject(query))
    throw ApiError.internal(Message.incorrect("query", "object"));

  const id = omitId ? undefined : Number(query.id);
  const projectId = Number(query.projectId);

  if ((!omitId && !id) || !projectId)
    throw ApiError.badRequest(
      Message.required([!omitId && !id && "id", !projectId && "projectId"])
    );

  return { id, projectId };
};
