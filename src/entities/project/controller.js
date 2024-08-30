import { ApiError, Message } from "../../services/error/index.js";
import { BasicController } from "../../shared/entities/basic/controller.js";
import { controller as boardController } from "../board/controller.js";
import { controller as labelController } from "../label/controller.js";
import { projects } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";
import { getCurrentProject } from "../../shared/entities/projectElem/utils.js";
import { getIdsFromQuery } from "../../shared/utils/idsFromQuery.js";
import {
  checkReadAccess,
  checkWriteAccess,
} from "../../shared/entities/projectElem/utils.js";

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

controller.handlers = {
  create: new CreateHandler(projects, controller.handlers.create),

  update: new UpdateHandler(projects, controller.handlers.update),
  delete: new UpdateHandler(projects, controller.handlers.delete), // same handler

  findOne: new FindOneHandler(projects, controller.handlers.findOne),
  findMany: new FindManyHandler(projects, controller.handlers.findMany),
};
controller.createControllsFromHandlers();

/* Role rights
create - any
update - admin, project owner
get - members
*/

function CreateHandler(model, protoHandler) {
  const AUTO_CREATE_BOARD = false;
  const AUTO_CREATE_LABEL = false;

  return async (req) => {
    req.body.ownerId = req.user.id || req.query.userId || req.body.ownerId;
    req.body.memberIds = req.body.ownerId;

    const protoDTO = await protoHandler(req);

    req.body.projectId = protoDTO.id;
    // add cookie update

    if (AUTO_CREATE_BOARD && boardController?.handlers?.create) {
      req.body.title = "Board";
      req.body.description = "Your first board";
      await boardController.handlers.create(req);
    }
    if (AUTO_CREATE_LABEL && labelController?.handlers?.create) {
      req.body.title = "Label";
      await labelController.handlers.create(req);
    }

    return protoDTO;
  };
}

function UpdateHandler(model, protoHandler) {
  return async (req) => {
    const { id } = getIdsFromQuery(["id"], req.params);
    req.project = await getCurrentProject(id);
    checkWriteAccess(req);

    return await protoHandler(req);
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req) => {
    const protoDTO = await protoHandler(req);
    req.project = protoDTO;
    checkReadAccess(req);

    return protoDTO;
  };
}

function FindManyHandler(model, protoHandler) {
  return async (req) => {
    req.query.memberIds = req.user.id;
    return await protoHandler(req);
  };
}

function SetCurrentProject(model, protoHandler) {} // или это в юзера?
