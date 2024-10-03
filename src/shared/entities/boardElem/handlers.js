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

/* Access
create - team / project members
update - team / project members
get - team / project members
*/

function CreateHandler(model, protoHandler) {
  return async (req) => {
    checkIdsInQuery(["boardId", "projectId"], req.body);
    req.board = await getCurrentBoard(req.body.boardId, req.body.projectId);
    checkWriteAccess(req);

    req.body.creatorId = req.user.id || req.query.userId || req.body.creatorId;

    req.body.relativeId = await db.generateId({
      model,
      query: { projectId: req.body.projectId, boardId: req.body.boardId },
      idName: "relativeId",
    });
    // TODO: relativeId duplicate check

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

    delete req.body.relativetId;
    delete req.body.projectId;
    delete req.body.boardId;
    delete req.body.creatorId;

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
  if (!req.queryIds.id || !req.queryIds.projectId || !req.queryIds.boardId) {
    const ids = getIdsFromQuery(["id", "projectId", "boardId"], req.query);
    req.queryIds.id = req.queryIds.id || ids.id;
    req.queryIds.projectId = req.queryIds.projectId || ids.projectId;
    req.queryIds.boardId = req.queryIds.boardId || ids.boardId;
  }
};
