import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { teams } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

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
controller.createControllsFromHandlers();

function CreateHandler(protoHandler) {
  return async (req) => {
    req.body.leaderId = req.body.leaderId || req.user.id;
    req.body.memberIds = req.body.memberIds || req.user.id;

    return await protoHandler(req);
  };
}
