import { db } from "../../../db/db.js";
import { BasicHandlers } from "../basic/handlers.js";
import { ProjectElemEntity } from "./entity.js";
import {
  checkReadAccess,
  checkWriteAccess,
  getCurrentProject,
} from "./utils.js";
import { checkIdsInQuery, getIdsFromQuery } from "../../utils/idsFromQuery.js";

export class ProjectElemHandlers extends BasicHandlers {
  constructor({ model, entity = ProjectElemEntity, dto = {} }) {
    super({ model, entity, dto });

    this.create = new CreateHandler(model, this.create);
    this.update = new UpdateHandler(model, this.update);
    this.delete = new DeleteHandler(model, this.delete);
    this.findOne = new FindOneHandler(model, this.findOne);
    this.findMany = new FindManyHandler(model, this.findMany);
  }
}

/* Access
write - project owner/admin
read - project member
*/

function CreateHandler(model, protoHandler) {
  return async (req) => {
    checkIdsInQuery(["projectId"], req.body);
    req.project = await getCurrentProject(req.body.projectId);
    checkWriteAccess(req);

    req.body.creatorId = req.user.id || req.query.userId || req.body.creatorId;

    req.body.relativeId = await db.generateId({
      model,
      query: { projectId: req.body.projectId },
      idName: "relativeId",
    });
    // TODO: relativeId duplicate check

    return await protoHandler(req);
  };
}

function UpdateHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.project = await getCurrentProject(req.queryIds.projectId);
    checkWriteAccess(req);

    delete req.body.relativetId;
    delete req.body.projectId;
    delete req.body.creatorId;

    return await protoHandler(req);
  };
}

function DeleteHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.project = await getCurrentProject(req.queryIds.projectId);
    checkWriteAccess(req);

    return await protoHandler(req);
  };
}

function FindOneHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.project = await getCurrentProject(req.queryIds.projectId);
    checkReadAccess(req);

    return await protoHandler(req);
  };
}

function FindManyHandler(model, protoHandler) {
  return async (req) => {
    checkIdsInQuery(["projectId"], req.query);
    req.project = await getCurrentProject(req.query.projectId);
    checkReadAccess(req, (req) => (req.query.id = 0)); // will return not error but zero result

    return await protoHandler(req);
  };
}

//

const setQueryIds = (req) => {
  req.queryIds = req.queryIds || {};
  if (!req.queryIds.id || !req.queryIds.projectId) {
    const ids = getIdsFromQuery(["id", "projectId"], req.query);
    req.queryIds.id = req.queryIds.id || ids.id;
    req.queryIds.projectId = req.queryIds.projectId || ids.projectId;
  }
};
