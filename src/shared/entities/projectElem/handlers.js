import { ApiError, Message } from "../../../services/error/index.js";
import { db } from "../../../db/db.js";
import { BasicHandlers } from "../basic/handlers.js";
import { ProjectElemEntity } from "./entity.js";
import {
  checkReadAccess,
  checkWriteAccess,
  getCurrentProject,
} from "./utils.js";
import { checkIdsInQuery, getIdsFromQuery } from "../../utils/idsFromQuery.js";
import { isArray } from "../../utils/utils.js";

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

    req.body.relativeId = await db.generateId({
      model,
      query: { projectId: req.body.projectId },
      idName: "relativeId",
    });
    req.body.creatorId = req.user.id || req.query.userId || req.body.creatorId;

    const protoDTO = await protoHandler(req);

    // ?
    const elemsCount = await db.count({
      model,
      query: { projectId: req.body.projectId, relativeId: req.body.relativeId },
    });
    console.log("--- elements with same 'relativeId:", elemsCount);
    //

    return protoDTO;
  };
}

function UpdateHandler(model, protoHandler) {
  return async (req) => {
    setQueryIds(req);
    req.project = await getCurrentProject(req.queryIds.projectId);
    checkWriteAccess(req);

    delete req.body.projectId;
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

// const setQueryIds = (req) => {
//   req.queryIds = req.queryIds || {};
//   if (!req.queryIds.projectId)
//     req.queryIds = getIdsFromQuery(["id", "projectId"], req.query);
// };

// const setQueryIds = (req) => {
//   const desiredIds = [];
//   if (req.id) desiredIds.push("id");
//   if (!req.id || req.relativeId || req.projectId)
//     desiredIds.push("relativeId", "projectId");

//   if (!req.queryIds) req.queryIds = getIdsFromQuery(desiredIds, req.query);
// };
const setQueryIds = (req) => {
  const desiredIds = ["projectId"];
  if (req.query.id) desiredIds.push("id");
  if (!req.query.id || req.relativeId) desiredIds.push("relativeId");

  if (!req.queryIds) req.queryIds = getIdsFromQuery(desiredIds, req.query);
};
