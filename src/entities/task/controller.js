import { ProjectElemBasicController } from "../../shared/controllers/peBasicController.js";
import { tasks } from "./model.js";
import { Task, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new ProjectElemBasicController({
  model: tasks,
  entity: Task,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});
