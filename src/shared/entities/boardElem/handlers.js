import { ApiError, Message } from "../../../services/error/index.js";
import { db } from "../../../db/db.js";
import { BasicHandlers } from "../basic/handlers.js";
import { BoardElemEntity } from "./entity.js";
import { checkIdsInQuery, getIdsFromQuery } from "../../utils/idsFromQuery.js";
import { checkReadAccess, checkWriteAccess, getCurrentBoard } from "./utils.js";

export class BoardElemHandlers extends BasicHandlers {
  constructor({ model, entity = BoardElemEntity, dto = {} }) {
    super({ model, entity, dto });

    this.create = new CreateHandler(model, this.create);
    this.update = new UpdateHandler(model, this.update);
    this.delete = new DeleteHandler(model, this.delete);
    this.findOne = new FindOneHandler(model, this.findOne);
    this.findMany = new FindManyHandler(model, this.findMany);
  }
}

/* Role rights
create - team members
update - team members
get - team members
*/

function CreateHandler(model, protoHandler) {
  return async (req) => {
    checkIdsInQuery(["boardId", "projectId"], req.body);
    req.board = await getCurrentBoard(req.body.boardId, req.body.projectId);
    checkWriteAccess(req);

    req.body.id = await db.generateId({
      model,
      query: { projectId: req.body.projectId, boardId: req.body.boardId },
    });
    req.body.creatorId = req.user.id || req.query.userId || req.body.creatorId;

    return await protoHandler(req);
  };
}

function UpdateHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.board = await getCurrentBoard(
      req.queryIds.boardId,
      req.queryIds.projectId
    );
    checkWriteAccess(req);

    delete req.body.projectId;
    delete req.body.boardId;
    return await protoHandler(req);
  };
}

function DeleteHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.board = await getCurrentBoard(
      req.queryIds.boardId,
      req.queryIds.projectId
    );
    checkWriteAccess(req);

    return await protoHandler(req);
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.board = await getCurrentBoard(
      req.queryIds.boardId,
      req.queryIds.projectId
    );
    checkReadAccess(req);

    return await protoHandler(req);
  };
}

function FindManyHandler(model, protoHandler) {
  return async (req) => {
    checkIdsInQuery(["boardId", "projectId"], req.query);
    req.board = await getCurrentBoard(req.query.boardId, req.query.projectId);
    checkReadAccess(req, (req) => (req.query.id = 0)); // will return not error but zero result

    return await protoHandler(req);
  };
}

//

const setQueryIds = (req) => {
  req.queryIds = req.queryIds || {};
  if (!req.queryIds.boardId)
    req.queryIds = getIdsFromQuery(["id", "projectId", "boardId"], {
      ...req.query,
      ...req.params,
    });
};

///////////////////////

// function CreateHandler(model, protoHandler) {
//   return async (req) => {
//     const { projectId, boardId } = getIdsFromQuery(
//       ["projectId", "boardId"],
//       req.body
//     );

//     const board = await db.findOne({
//       model: boardModel,
//       query: { id: boardId, projectId },
//     });

//     if (!board || board.deletedAt)
//       throw ApiError.badRequest(
//         `Board with id=${boardId} and projectId=${projectId} does not exist`
//       );

//     req.body.id = await db.generateId({
//       model,
//       query: { projectId, boardId },
//     });

//     return await protoHandler(req);
//   };
// }

// function UpdateHandler(model, protoHandler) {
//   const handle = new FindOneHandler(model, protoHandler);
//   return async (req) => {
//     delete req.body.boardId;
//     handle(req);
//   };
// }

// function FindOneHandler(model, protoHandler) {
//   return async (req) => {
//     return await protoHandler(req);
//   };
// }

// function FindManyHandler(model, protoHandler) {
//   return async (req) => {
//     checkIdsInQuery(["projectId", "boardId"], req.query);
//     return await protoHandler(req);
//   };
// }

// const setQueryIds = (req) => {
//   req.queryIds = req.queryIds || {};
//   req.queryIds.boardId = getIdsFromQuery(["id", "projectId", "boardId"], {
//     ...req.query,
//     ...req.params,
//   }).boardId;
//   return req.queryIds;
// };
