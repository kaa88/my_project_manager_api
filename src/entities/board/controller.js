import { ApiError, Message } from "../../services/error/index.js";
import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { boards } from "./model.js";
import { Board, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";
import { isBoardVisible } from "../../shared/entities/boardElem/utils.js";
import {
  handleRelationsOnCreate,
  handleRelationsOnDelete,
  handleRelationsOnUpdate,
} from "../_relationTables/teamsToBoards/handlers.js";
import { MODEL_NAME } from "../_relationTables/teamsToBoards/utils.js";

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

controller.handlers = {
  create: new CreateHandler(controller.handlers.create),
  update: new UpdateHandler(controller.handlers.update),
  delete: new DeleteHandler(controller.handlers.delete),
  findOne: new FindOneHandler(controller.handlers.findOne),
  findMany: new FindManyHandler(controller.handlers.findMany),
};
controller.createControllsFromHandlers();

/* Access
create - project owner/admin
update - project owner/admin
get - public boards - project members, private boards - members of accessable teams
*/

function CreateHandler(protoHandler) {
  const AUTO_CREATE_LIST = true;

  return async (req) => {
    if (AUTO_CREATE_LIST && !req.body.taskLists) {
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

    const protoDTO = await protoHandler(req);

    if (req.body.teamIds !== undefined) {
      const teamIds = await handleRelationsOnCreate(
        MODEL_NAME.board,
        protoDTO,
        req.body.teamIds
      );
      Object.assign(protoDTO, teamIds);
    } else protoDTO.teamIds = [];

    return protoDTO;
  };
}

function UpdateHandler(protoHandler) {
  return async (req) => {
    delete req.body.creatorId;

    const protoDTO = await protoHandler(req);

    if (req.body.teamIds !== undefined) {
      const teamIds = await handleRelationsOnUpdate(
        MODEL_NAME.board,
        protoDTO,
        req.body.teamIds
      );
      Object.assign(protoDTO, teamIds);
    }

    return protoDTO;
  };
}

function DeleteHandler(protoHandler) {
  return async (req) => {
    const protoDTO = await protoHandler(req);

    const teamIds = await handleRelationsOnDelete(MODEL_NAME.board, protoDTO);
    Object.assign(protoDTO, teamIds);

    return protoDTO;
  };
}

function FindOneHandler(protoHandler) {
  return async (req) => {
    req.query.with = {
      teamsToBoards: {
        with: {
          team: { columns: { leaderId: true, memberIds: true } },
        },
      },
    };
    const protoDTO = await protoHandler(req);

    if (!isBoardVisible(protoDTO, req.user.id))
      throw ApiError.forbidden(Message.forbidden());

    const ids = protoDTO.teamsToBoards.map((t) => t.teamId);
    protoDTO.teamIds = ids.length ? ids : [];
    delete protoDTO.teamsToBoards;

    return protoDTO;
  };
}

function FindManyHandler(protoHandler) {
  return async (req) => {
    req.query.with = {
      teamsToBoards: {
        with: {
          team: { columns: { leaderId: true, memberIds: true } },
        },
      },
    };
    let protoDTO = await protoHandler(req);

    const visibleBoards = protoDTO.items.reduce(
      (result, board) =>
        isBoardVisible(board, req.user.id) ? [...result, board.id] : result,
      []
    );

    if (visibleBoards.length === protoDTO.items.length) {
      protoDTO.items.forEach((board) => delete board.teamsToBoards);
    } else {
      // need to run protoHandler again with visibleBoards as id to get correct pagination
      req.query.id = visibleBoards;
      delete req.query.with;
      protoDTO = await protoHandler(req);
    }

    return protoDTO;
  };
}
