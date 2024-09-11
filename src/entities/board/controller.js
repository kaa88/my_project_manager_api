import { ApiError, Message } from "../../services/error/index.js";
import { db } from "../../db/db.js";
import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { controller as taskListController } from "../taskList/controller.js";
import { boards } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

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

controller.handlers.create = new CreateHandler(controller.handlers.create);
controller.createControllsFromHandlers();

/* Role rights
create - admin, project owner
update - admin, project owner
get - admin, private boards - members of accessable teams, public boards - project members
*/

function CreateHandler(protoHandler) {
  const AUTO_CREATE_LIST = false;

  return async (req) => {
    const protoDTO = await protoHandler(req);

    req.body.projectId = protoDTO.projectId;
    req.body.boardId = protoDTO.id;

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
