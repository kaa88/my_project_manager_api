import { BoardElemController } from "../../shared/controllers/boardElemController.js";
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
