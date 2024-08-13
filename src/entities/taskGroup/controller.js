import { ProjectElemBasicController } from "../../shared/controllers/peBasicController.js";
import { taskGroups } from "./model.js";
// import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new ProjectElemBasicController({
  model: taskGroups,
  // entity: Entity,
  // dto: {
  //   get: GetDTO,
  //   create: CreateDTO,
  //   update: UpdateDTO,
  //   delete: DeleteDTO,
  // },
});
