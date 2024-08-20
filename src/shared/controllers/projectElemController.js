import { ApiError } from "../../services/error/apiError.js";
import { db } from "../../db/db.js";
import { projects as projectModel } from "../../entities/project/model.js";
import { ProjectElemEntity } from "../mappers/basicEntity.js";
import { BasicController } from "./basicController.js";
import { checkIdsInQuery, getIdsFromQuery } from "./utils.js";

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
      const { projectId } = getIdsFromQuery(["projectId"], req.api.query);

      const project = await db.findOne({
        model: projectModel,
        query: { id: projectId },
      });
      if (!project || project.deletedAt)
        throw ApiError.badRequest(
          `Project with id=${projectId} does not exist`
        );

      req.api.values.id = await db.generateId({ model, query: { projectId } });

      return await parentHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, parentHandler) {
  const handle = new FindOneHandler(model, parentHandler);
  return async (req, res, next) => {
    delete req.api.values.projectId;
    handle(req, res, next);
  };
}

function FindOneHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      req.api.shortQuery.projectId = getIdsFromQuery(
        ["id", "projectId"],
        req.api.query
      ).projectId;

      return await parentHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindManyHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      checkIdsInQuery(["projectId"], req.api.query);

      return await parentHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}
