import { BasicController } from "../../shared/controllers/basicController.js";
import { teams } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new BasicController({
  model: teams,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});
