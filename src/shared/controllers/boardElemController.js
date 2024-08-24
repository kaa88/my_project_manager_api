import { ApiError } from "../../services/error/apiError.js";
import { db } from "../../db/db.js";
import { boards as boardModel } from "../../entities/board/model.js";
import { BoardElemEntity } from "../mappers/basicEntity.js";
import { ProjectElemController } from "./projectElemController.js";
import { checkIdsInQuery, getIdsFromQuery } from "./utils.js";

export class BoardElemController extends ProjectElemController {
  constructor({ model, entity = BoardElemEntity, dto = {} }) {
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
      const { projectId, boardId } = getIdsFromQuery(
        ["projectId", "boardId"],
        req.body
      );

      const board = await db.findOne({
        model: boardModel,
        query: { id: boardId, projectId },
      });

      if (!board || board.deletedAt)
        throw ApiError.badRequest(
          `Board with id=${boardId} and projectId=${projectId} does not exist`
        );

      req.body.id = await db.generateId({
        model,
        query: { projectId, boardId },
      });

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, protoHandler) {
  const handle = new FindOneHandler(model, protoHandler);
  return async (req, res, next) => {
    delete req.body.boardId;
    handle(req, res, next);
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req, res, next) => {
    try {
      req.queryIds = req.queryIds || {};
      req.queryIds.boardId = getIdsFromQuery(["id", "projectId", "boardId"], {
        ...req.query,
        ...req.params,
      }).boardId;

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindManyHandler(model, protoHandler) {
  return async (req, res, next) => {
    try {
      checkIdsInQuery(["projectId", "boardId"], req.query);

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}
