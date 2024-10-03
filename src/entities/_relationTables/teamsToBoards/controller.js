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
