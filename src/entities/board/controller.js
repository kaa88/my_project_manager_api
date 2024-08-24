import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { db } from "../../db/db.js";
import { ProjectElemController } from "../../shared/controllers/projectElemController.js";
import { projects } from "../project/model.js";
import { boards } from "./model.js";
import { controller as taskListController } from "../taskList/controller.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

/* Role rights
create - admin, project owner
update - admin, project owner
get - admin, private boards - members of accessable teams, public boards - project members
*/

export const controller = new ProjectElemController({
  model: boards,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

controller.create = new CreateHandler(boards, Entity, CreateDTO);

controller.update = new UpdateHandler(boards, controller.update);
controller.delete = new UpdateHandler(boards, controller.delete); // same handler

controller.findOne = new FindOneHandler(boards, controller.findOne);
controller.findMany = new FindOneHandler(boards, controller.findMany); // same handler

function CreateHandler(model, Entity, CreateDTO) {
  const AUTO_CREATE_LIST = false;

  return async (req, res, next) => {
    try {
      // Access check
      const accessError = ApiError.forbidden(Message.forbidden());

      const userId =
        req.user?.userId !== undefined ? req.user.userId : req.query.userId;
      if (!userId) throw accessError;

      if (req.user?.projectId !== undefined)
        req.body.projectId = req.user.projectId;
      // перенести в basic board

      const project = await db.findOne({
        model: projects,
        query: { id: req.body.projectId },
      });
      if (!project || project.deletedAt)
        throw ApiError.badRequest(
          `Project with id=${req.body.projectId} does not exist`
        );

      if (
        userId !== project.ownerId &&
        (!isArray(project.adminIds) || !project.adminIds.includes(userId))
      )
        throw accessError;
      // /Access check

      req.body.creatorId = userId;
      req.body.id = await db.generateId({
        model,
        query: { projectId: req.body.projectId },
      });

      const values = new Entity(req.body);

      const response = await db.create({ model, values });
      if (!response) throw ApiError.internal("Database error");

      req.body.boardId = response.id;
      if (req.user) req.user.boardId = response.id;

      // сделать res.beforeSendCallback, чтобы не переписывать всю функцию
      res.beforeSendCallback = async (req, res, next) => {
        if (AUTO_CREATE_LIST) {
          req.body.title = "Open";
          await taskListController.create(req, res, next);
          // дальше не сработает, т.к. пойдет ответ на фронт =(
          // надо экспортировать отдельно хендлер
          req.body.title = "In Progress";
          await taskListController.create(req, res, next);
          req.body.title = "Closed";
          await taskListController.create(req, res, next);
        }
      };

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
      // req.query.memberIds =
      //   req.user?.userId !== undefined ? req.user.userId : req.query.memberIds;
      // /Access check

      return await protoHandler(req, res, next);
    } catch (e) {
      return next(e.isApiError ? e : ApiError.internal(e.message));
    }
  };
}
