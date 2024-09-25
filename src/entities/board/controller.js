import { ApiError, Message } from "../../services/error/index.js";
import { ProjectElemController } from "../../shared/entities/projectElem/controller.js";
import { boards } from "./model.js";
import { Board, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";
import { db } from "../../db/db.js";
import {
  handleRelationsOnCreate,
  handleRelationsOnDelete,
  handleRelationsOnGet,
  handleRelationsOnUpdate,
} from "../_relationTables/teamsToBoards/handlers.js";
import {
  getModelProps,
  MODEL_NAME,
} from "../_relationTables/teamsToBoards/utils.js";
import { teamsToBoards } from "../_relationTables/teamsToBoards/model.js";
import {
  PaginationDTO,
  PaginationParams,
} from "../../shared/mappers/pagination.js";
import { teams as teamsModel } from "../team/model.js";

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
// controller.handlers.create = new CreateHandler(controller.handlers.create);
// controller.handlers.update = new UpdateHandler(controller.handlers.update);
// controller.handlers.delete = new DeleteHandler(controller.handlers.delete);
// controller.handlers.findOne = new FindOneHandler(controller.handlers.findOne);
controller.createControllsFromHandlers();

/* Access
create - project owner/admin
update - project owner/admin
get - public boards - project members, private boards - members of accessable teams
*/

function CreateHandler(protoHandler) {
  const AUTO_CREATE_LIST = false;

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
      const relationsResponse = await handleRelationsOnCreate(
        MODEL_NAME.board,
        protoDTO,
        req.body.teamIds
      );
      Object.assign(protoDTO, relationsResponse);
    } else protoDTO.teamIds = null;

    return protoDTO;
  };
}

function UpdateHandler(protoHandler) {
  return async (req) => {
    delete req.body.creatorId; //
    const protoDTO = await protoHandler(req);

    if (req.body.teamIds !== undefined) {
      const relationsResponse = await handleRelationsOnUpdate(
        MODEL_NAME.board,
        protoDTO,
        req.body.teamIds
      );
      Object.assign(protoDTO, relationsResponse);
    }

    return protoDTO;
  };
}

function DeleteHandler(protoHandler) {
  return async (req) => {
    const protoDTO = await protoHandler(req);

    const relationsResponse = await handleRelationsOnDelete(
      MODEL_NAME.board,
      protoDTO
    );
    Object.assign(protoDTO, relationsResponse);

    return protoDTO;
  };
}

function FindOneHandler(protoHandler) {
  return async (req) => {
    // const protoDTO = await protoHandler(req);
    // const relations = await db.findMany({
    //   model: teamsToBoards,
    //   query: getModelProps(MODEL_NAME.board, protoDTO),
    //   count: false,
    // });
    // if (relations.items.length) {
    //   const relTeam = await db.findOne({
    //     model: teamsModel,
    //     query: {
    //       projectId: protoDTO.projectId,
    //       teamId: relations.items[0].teamId,
    //       deletedAt: null,
    //     },
    //   });
    //   const teamMembers = [relTeam?.leaderId, ...(relTeam?.memberIds || [])];
    //   if (!teamMembers.includes(req.user.id))
    //     throw ApiError.forbidden(Message.forbidden());
    // }
    // const ids = relations.items.map((rel) => rel.teamId);
    // protoDTO.teamIds = ids.length ? ids : null;
    // return protoDTO;
  };
}

function FindManyHandler(protoHandler) {
  return async (req) => {
    // req.query.related = {
    //   teamsToBoards: { with: { team: { where: { projectId: 1 } } } },
    // };
    // const protoDTO = await protoHandler(req);
    // if (protoDTO.items.length) {
    //   const projectId = protoDTO.items[0].projectId;
    //   const boardIds = protoDTO.items.map((board) => board.id);
    //   // console.log(protoDTO.items);
    //   console.log("projectId", projectId);
    //   console.log("boardIds", boardIds);
    //   protoDTO.items.forEach((board) => {
    //     console.log("id", board.id);
    //     console.log(board.teamsToBoards);
    //   });
    //   const relations = await db.findMany({
    //     model: teamsToBoards,
    //     query: { projectId, boardId: boardIds },
    //     count: false,
    //   });
    //   // console.log(relations.items);
    //   if (relations.items.length) {
    //     const relTeams = await db.findMany({
    //       model: teamsModel,
    //       query: {
    //         projectId,
    //         teamId: relations.items.map((rel) => rel.teamId),
    //         deletedAt: null,
    //       },
    //       count: false,
    //     });
    //     // console.log("relTeams");
    //     // console.log(relTeams.items);
    //     const approvedTeamIds = relTeams.items.reduce((result, team) => {
    //       const teamMembers = [team.leaderId, ...(team.memberIds || [])];
    //       return teamMembers.includes(req.user.id)
    //         ? [...result, team.id]
    //         : result;
    //     }, []);
    //     // console.log("approvedTeamIds", approvedTeamIds);
    //     const approvedBoardIds = relations.items.reduce(
    //       (result, rel) =>
    //         approvedTeamIds.includes(rel.teamId)
    //           ? [...result, rel.boardId]
    //           : result,
    //       []
    //     );
    //     const filteredBoardDTOs = protoDTO.items.filter((board) =>
    //       approvedBoardIds.includes(board.id)
    //     );
    //     const newDTO = new PaginationDTO(
    //       new PaginationParams(protoDTO),
    //       filteredBoardDTOs,
    //       protoDTO.totalItems
    //     );
    //     return newDTO;
    //     // проверить
    //   }
    // }
    // // ПРОБЛЕМА: может быть несколько страниц в protoDTO, поэтому надо без прото делать запрос
    // return protoDTO;
  };
}
