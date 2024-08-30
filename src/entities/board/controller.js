import { ApiError, Message } from "../../services/error/index.js";
import { db } from "../../db/db.js";
import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { controller as taskListController } from "../taskList/controller.js";
import { boards } from "./model.js";
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

const handlers = {
  create: new CreateHandler(boards, controller.handlers.create),

  update: new UpdateHandler(boards, controller.handlers.update),
  delete: new UpdateHandler(boards, controller.handlers.delete), // same handler

  findOne: new FindOneHandler(boards, controller.handlers.findOne),
  findMany: new FindOneHandler(boards, controller.handlers.findMany), // same handler
};

Object.assign(
  controller,
  handlers,
  controller.createControllsFromHandlers(handlers)
);

function CreateHandler(model, protoHandler) {
  const AUTO_CREATE_LIST = false;

  return async (req) => {
    const userId =
      req.user.userId !== undefined ? req.user.userId : req.query.userId;
    req.body.creatorId = userId;

    const protoDTO = await protoHandler(req);

    req.body.projectId = protoDTO.projectId;
    req.body.boardId = protoDTO.id;
    if (req.user) req.user.boardId = protoDTO.id;

    if (AUTO_CREATE_LIST && taskListController?.handlers?.create) {
      req.body.title = "Open";
      await taskListController.handlers.create(req);
      req.body.title = "In Progress";
      await taskListController.handlers.create(req);
      req.body.title = "Closed";
      await taskListController.handlers.create(req);
    }

    return protoDTO;
  };
}

function UpdateHandler(model, protoHandler) {
  return async (req) => {
    // перенести в basic
    // Access check
    const accessError = ApiError.forbidden(Message.forbidden());

    const userId =
      req.user.userId !== undefined ? req.user.userId : req.query.ownerId;
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

    return await protoHandler(req);
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req) => {
    // try {
    // Access check
    // req.query.memberIds =
    //   req.user.userId !== undefined ? req.user.userId : req.query.memberIds;
    // /Access check

    return await protoHandler(req);
    // } catch (e) {
    //   return next(e.isApiError ? e : ApiError.internal(e.message));
    // }
  };
}
