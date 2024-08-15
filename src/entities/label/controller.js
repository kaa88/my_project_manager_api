import { ProjectElemBasicController } from "../../shared/controllers/peBasicController.js";
import { labels } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new ProjectElemBasicController({
  model: labels,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});
