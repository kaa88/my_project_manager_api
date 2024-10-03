import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { teams } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";
import {
  handleRelationsOnCreate,
  handleRelationsOnDelete,
  handleRelationsOnGet,
  handleRelationsOnUpdate,
} from "../_relationTables/teamsToBoards/handlers.js";
import { MODEL_NAME } from "../_relationTables/teamsToBoards/utils.js";

export const controller = new ProjectElemController({
  model: teams,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

controller.handlers.create = new CreateHandler(controller.handlers.create);
controller.handlers.update = new UpdateHandler(controller.handlers.update);
controller.handlers.delete = new DeleteHandler(controller.handlers.delete);
controller.handlers.findOne = new FindOneHandler(controller.handlers.findOne);
// findMany is default
controller.createControllsFromHandlers();

/* Access
write - project owner/admin
read - project member
*/

function CreateHandler(protoHandler) {
  return async (req) => {
    req.body.leaderId = req.body.leaderId || req.user.id;
    req.body.memberIds = req.body.memberIds || req.user.id;

    const protoDTO = await protoHandler(req);

    if (req.body.boardIds !== undefined) {
      const boardIds = await handleRelationsOnCreate(
        MODEL_NAME.team,
        protoDTO,
        req.body.boardIds
      );
      Object.assign(protoDTO, boardIds);
    } else protoDTO.boardIds = [];

    return protoDTO;
  };
}

function UpdateHandler(protoHandler) {
  return async (req) => {
    const protoDTO = await protoHandler(req);

    if (req.body.boardIds !== undefined) {
      const boardIds = await handleRelationsOnUpdate(
        MODEL_NAME.team,
        protoDTO,
        req.body.boardIds
      );
      Object.assign(protoDTO, boardIds);
    }

    return protoDTO;
  };
}

function DeleteHandler(protoHandler) {
  return async (req) => {
    const protoDTO = await protoHandler(req);

    const boardIds = await handleRelationsOnDelete(MODEL_NAME.team, protoDTO);
    Object.assign(protoDTO, boardIds);

    return protoDTO;
  };
}

function FindOneHandler(protoHandler) {
  return async (req) => {
    const protoDTO = await protoHandler(req);

    const boardIds = await handleRelationsOnGet(MODEL_NAME.team, protoDTO);
    Object.assign(protoDTO, boardIds);

    return protoDTO;
  };
}
