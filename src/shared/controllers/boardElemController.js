import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { db } from "../../db/db.js";
import { boards as boardModel } from "../../entities/board/model.js";
import { BoardElemEntity } from "../mappers/basicEntity.js";
import { isObject } from "../utils.js";
import { ProjectElemController } from "./projectElemController.js";

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

function CreateHandler(model, parentHandler) {
  return async (req, res, next) => {
    try {
      const { projectId, boardId } = getIdsFromQuery(req.body);

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

      return await parentHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, parentHandler) {
  const handle = new FindOneHandler(model, parentHandler);
  return async (req, res, next) => {
    delete req.body.boardId;
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
  const boardId = Number(query.boardId);

  if ((!omitId && !id) || !projectId || !boardId)
    throw ApiError.badRequest(
      Message.required([
        !omitId && !id && "id",
        !projectId && "projectId",
        !boardId && "boardId",
      ])
    );

  return { id, projectId, boardId };
};
