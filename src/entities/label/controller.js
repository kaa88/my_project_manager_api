import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { labels } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new ProjectElemController({
  model: labels,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

// остальное не надо

// controller.handlers = {
//   ...controller.handlers,
//   create: new CreateHandler(labels, controller.handlers.create),

//   // update: new UpdateHandler(labels, controller.handlers.update),
//   // delete: new UpdateHandler(labels, controller.handlers.delete), // same handler

//   // findOne: new FindOneHandler(labels, controller.handlers.findOne),
//   // findMany: new FindManyHandler(labels, controller.handlers.findMany),
// };
// controller.createControllsFromHandlers();

// function CreateHandler(model, protoHandler) {
//   return async (req) => {
//     req.body.creatorId = req.user.id || req.query.userId || req.body.creatorId;
//     return await protoHandler(req);
//   };
// }
