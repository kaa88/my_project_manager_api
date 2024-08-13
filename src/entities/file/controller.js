import { ProjectElemBasicController } from "../../shared/controllers/peBasicController.js";
import { files } from "./model.js";
// import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new ProjectElemBasicController({
  model: files,
  // entity: Entity,
  // dto: {
  //   get: GetDTO,
  //   create: CreateDTO,
  //   update: UpdateDTO,
  //   delete: DeleteDTO,
  // },
});
