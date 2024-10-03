import { BoardElemController } from "../../shared/entities/boardElem/controller.js";
import { tasks } from "./model.js";
import { Task, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new BoardElemController({
  model: tasks,
  entity: Task,
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
    req.body.assigneeIds = req.body.assigneeIds || [];
    req.body.labelIds = req.body.labelIds || [];

    return await protoHandler(req);
  };
}
