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

function CreateHandler(model, protoHandler) {
  return async (req, res, next) => {
    try {
      const { projectId } = getIdsFromQuery(["projectId"], req.body);

      const project = await db.findOne({
        model: projectModel,
        query: { id: projectId },
      });
      if (!project || project.deletedAt)
        throw ApiError.badRequest(
          `Project with id=${projectId} does not exist`
        );

      req.body.id = await db.generateId({ model, query: { projectId } });

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, protoHandler) {
  const handle = new FindOneHandler(model, protoHandler);
  return async (req, res, next) => {
    delete req.body.projectId;
    handle(req, res, next);
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req, res, next) => {
    try {
      req.queryIds = req.queryIds || {};
      req.queryIds.projectId = getIdsFromQuery(["id", "projectId"], {
        ...req.query,
        ...req.params,
      }).projectId;

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindManyHandler(model, protoHandler) {
  return async (req, res, next) => {
    try {
      checkIdsInQuery(["projectId"], req.query);

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}
