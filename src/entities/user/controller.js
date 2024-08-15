import { BasicController } from "../../shared/controllers/basicController.js";
import { users } from "./model.js";
import { CreateDTO, DeleteDTO, Entity, GetDTO, UpdateDTO } from "./map.js";

export const controller = new BasicController({
  model: users,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

// переписать контроллеры
