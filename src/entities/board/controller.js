import { ApiError, Message } from "../../services/error/index.js";
import { db } from "../../db/db.js";
import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
// import { controller as taskListController } from "../taskList/controller.js";
import { boards } from "./model.js";
import { Board, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";

export const controller = new ProjectElemController({
  model: boards,
  entity: Board,
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
  const AUTO_CREATE_LIST = true;

  return async (req) => {
    if (AUTO_CREATE_LIST) {
      req.body.taskLists = [
        {
          id: 1,
          title: "Open",
        },
        {
          id: 2,
          title: "In Progress",
        },
        {
          id: 3,
          title: "Closed",
        },
      ];
    }

    return await protoHandler(req);
  };
}
