import { BasicController } from "../../shared/entities/basic/controller.js";
import { BoardElemController } from "../../shared/entities/boardElem/controller.js";
import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { taskLists } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";
import {
  checkReadAccess,
  checkWriteAccess,
  getCurrentProject,
} from "../../shared/entities/projectElem/utils.js";

// это boardElem, но менять их могут project admin
// export const controller = new BoardElemController({
export const controller = new BasicController({
  model: taskLists,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

controller.handlers = {
  create: new CreateHandler(taskLists, controller.handlers.create),
  update: new UpdateHandler(taskLists, controller.handlers.update),
  delete: new DeleteHandler(taskLists, controller.handlers.delete),
  findOne: new FindOneHandler(taskLists, controller.handlers.findOne),
  findAll: new FindManyHandler(taskLists, controller.handlers.findAll),
};
controller.createControllsFromHandlers();

function CreateHandler(model, protoHandler) {
  return async (req) => {
    checkIdsInQuery(["boardId", "projectId"], req.body);
    req.project = await getCurrentProject(req.body.projectId);
    checkWriteAccess(req);

    req.body.id = await db.generateId({
      model,
      query: { projectId: req.body.projectId, boardId: req.body.boardId },
    });
    req.body.creatorId = req.user.id || req.query.userId || req.body.creatorId;

    return await protoHandler(req);
  };
}

function UpdateHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.project = await getCurrentProject(req.queryIds.projectId);
    checkWriteAccess(req);

    delete req.body.projectId;
    delete req.body.boardId;
    return await protoHandler(req);
  };
}

function DeleteHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.project = await getCurrentProject(req.queryIds.projectId);
    checkWriteAccess(req);

    return await protoHandler(req);
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.project = await getCurrentProject(req.queryIds.projectId);
    checkReadAccess(req);

    return await protoHandler(req);
  };
}

function FindManyHandler(model, protoHandler) {
  return async (req) => {
    checkIdsInQuery(["boardId", "projectId"], req.query);
    req.project = await getCurrentProject(req.query.projectId);
    checkReadAccess(req, (req) => (req.query.id = 0)); // will return not error but zero result

    return await protoHandler(req);
  };
}

//

const setQueryIds = (req) => {
  req.queryIds = req.queryIds || {};
  if (!req.queryIds.boardId)
    req.queryIds = getIdsFromQuery(["id", "projectId", "boardId"], {
      ...req.query,
      ...req.params,
    });
};
