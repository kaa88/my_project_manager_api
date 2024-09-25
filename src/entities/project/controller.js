import { ApiError, Message } from "../../services/error/index.js";
import { BasicController } from "../../shared/entities/basic/controller.js";
import { controller as boardController } from "../board/controller.js";
import { controller as labelController } from "../label/controller.js";
import { projects } from "./model.js";
import { Entity } from "./entity.js";
import { CreateDTO, UpdateDTO, DeleteDTO } from "./dto.js";
import { GetDTOWithRelations } from "./dtoWithRelations.js";
import { getCurrentProject } from "../../shared/entities/projectElem/utils.js";
import { getIdsFromQuery } from "../../shared/utils/idsFromQuery.js";
import {
  checkReadAccess,
  checkWriteAccess,
} from "../../shared/entities/projectElem/utils.js";
import { toNumberArrayOrNull } from "../../shared/utils/utils.js";

export const controller = new BasicController({
  model: projects,
  entity: Entity,
  dto: {
    get: GetDTOWithRelations,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

controller.handlers = {
  create: new CreateHandler(controller.handlers.create),

  update: new UpdateHandler(controller.handlers.update),
  delete: new UpdateHandler(controller.handlers.delete), // same handler

  findOne: new FindOneHandler(controller.handlers.findOne),
  findMany: new FindManyHandler(controller.handlers.findMany),
};
controller.createControllsFromHandlers();

/* Access
create - any user
update - project owner/admin
get - project member
*/

function CreateHandler(protoHandler) {
  const AUTO_CREATE_BOARD = false;
  const AUTO_CREATE_LABEL = false;
  // create team ?

  return async (req) => {
    req.body.ownerId = req.user.id || req.query.userId || req.body.ownerId;

    if (req.body.memberIds !== undefined)
      req.body.memberIds = toNumberArrayOrNull(req.body.memberIds);
    req.body.memberIds = [
      ...new Set([req.body.ownerId, ...(req.body.memberIds || [])]),
    ];

    if (req.body.adminIds !== undefined) {
      req.body.adminIds = toNumberArrayOrNull(req.body.adminIds);
      req.body.memberIds = [
        ...new Set([...req.body.memberIds, ...(req.body.adminIds || [])]),
      ];
    }

    const protoDTO = await protoHandler(req);

    req.body.projectId = protoDTO.id;

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

function UpdateHandler(protoHandler) {
  return async (req) => {
    const { id } = getIdsFromQuery(["id"], req.query);
    req.project = await getCurrentProject(id);
    checkWriteAccess(req);

    const newOwner =
      req.body.ownerId === undefined
        ? []
        : toNumberArrayOrNull(req.body.ownerId) || [];

    const newAdmins =
      req.body.adminIds === undefined
        ? []
        : toNumberArrayOrNull(req.body.adminIds) || [];

    let newMembers =
      req.body.memberIds === undefined
        ? []
        : toNumberArrayOrNull(req.body.memberIds) || [];

    if (!newMembers.length && (!!newOwner.length || !!newAdmins.length))
      newMembers = req.project.memberIds || [];

    const arrayOfNew = [...newOwner, ...newAdmins, ...newMembers];
    if (arrayOfNew.length) req.body.memberIds = [...new Set(arrayOfNew)];

    return await protoHandler(req);
  };
}

function FindOneHandler(protoHandler) {
  return async (req) => {
    const protoDTO = await protoHandler(req);
    req.project = protoDTO;
    checkReadAccess(req);

    return protoDTO;
  };
}

function FindManyHandler(protoHandler) {
  return async (req) => {
    req.query.memberIds = req.user.id;
    return await protoHandler(req);
  };
}

// function SetCurrentProject(protoHandler) {} // или это в юзера?
