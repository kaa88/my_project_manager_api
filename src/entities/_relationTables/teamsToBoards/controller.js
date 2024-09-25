// import { ApiError, Message } from "../../services/error/index.js";
import { BasicController } from "../../../shared/entities/basic/controller.js";
import { teamsToBoards as model } from "./model.js";
import { Entity, GetDTO } from "./map.js";

export const controller = new BasicController({
  model,
  entity: Entity,
  dto: {
    get: GetDTO,
  },
});

// controller.handlers = {
//   create: new CreateHandler(controller.handlers.create),

//   update: new UpdateHandler(controller.handlers.update),
//   delete: new UpdateHandler(controller.handlers.delete), // same handler

//   findOne: new FindOneHandler(controller.handlers.findOne),
//   findMany: new FindManyHandler(controller.handlers.findMany),
// };
// controller.createControllsFromHandlers();

/* Access
create - any user
update - project owner/admin
get - project member
*/
