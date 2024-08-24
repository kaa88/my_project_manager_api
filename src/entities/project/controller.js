import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { db } from "../../db/db.js";
import { BasicController } from "../../shared/controllers/basicController.js";
import { controller as boardController } from "../board/controller.js";
import { controller as labelController } from "../label/controller.js";
import { projects } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";
import { getIdsFromQuery } from "../../shared/controllers/utils.js";
import { isArray } from "../../shared/utils.js";

/* Role rights
create - any
update - admin, project owner
get - members
*/

export const controller = new BasicController({
  model: projects,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

controller.create = new CreateHandler(projects, Entity, CreateDTO);

controller.update = new UpdateHandler(projects, controller.update);
controller.delete = new UpdateHandler(projects, controller.delete); // same handler

controller.findOne = new FindOneHandler(projects, controller.findOne);
controller.findMany = new FindOneHandler(projects, controller.findMany); // same handler

function CreateHandler(model, Entity, CreateDTO) {
  const AUTO_CREATE_BOARD = false;
  const AUTO_CREATE_LABEL = false;

  return async (req, res, next) => {
    try {
      req.body.ownerId =
        req.user?.userId || req.body.ownerId || req.query.userId;
      req.body.memberIds = req.body.ownerId;

      const values = new Entity(req.body);

      const response = await db.create({ model, values });
      if (!response) throw ApiError.internal("Database error");

      req.body.projectId = response.id;
      if (req.user) req.user.projectId = response.id;

      if (AUTO_CREATE_BOARD) {
        req.body.title = "Board";
        req.body.description = "Your first board";
        boardController.create(req, res, next);
      }
      if (AUTO_CREATE_LABEL) {
        req.body.title = "Label";
        labelController.create(req, res, next);
      }

      return res.json(new CreateDTO(response));
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function UpdateHandler(model, protoHandler) {
  return async (req, res, next) => {
    try {
      // Access check
      const accessError = ApiError.forbidden(Message.forbidden());

      const userId =
        req.user?.userId !== undefined ? req.user.userId : req.query.ownerId;
      if (!userId) throw accessError;

      const { id } = getIdsFromQuery(["id"], req.params);
      const project = await db.findOne({ model, query: { id } });
      if (!project) throw ApiError.notFound(Message.notFound(query));

      if (
        userId !== project.ownerId &&
        (!isArray(project.adminIds) || !project.adminIds.includes(userId))
      )
        throw accessError;
      // /Access check

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req, res, next) => {
    try {
      // Access check
      req.query.memberIds =
        req.user?.userId !== undefined ? req.user.userId : req.query.memberIds;
      // /Access check

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}
