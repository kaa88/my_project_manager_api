import { BasicController } from "../../shared/entities/basic/controller.js";
import { profiles } from "./model.js";
import { Entity, GetDTO, CreateDTO, UpdateDTO, DeleteDTO } from "./map.js";
import { db } from "../../db/db.js";
import { toStringArray } from "../../shared/utils/utils.js";
import { checkReadAccess, checkWriteAccess } from "../user/utils.js";
import { users } from "../user/model.js";

export const controller = new BasicController({
  model: profiles,
  entity: Entity,
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

  addPhoto: new AddPhotoHandler(controller.handlers.update),
};
controller.createControllsFromHandlers();

/* Access
create - none
update - same user
delete - none
get - same user
getAll - any user
*/

function CreateHandler(protoHandler) {
  return async (req) => {
    req.body.userId = req.body.id;
    req.body.firstName = req.body.firstName || req.body.email?.split("@")[0];
    return await protoHandler(req);
  };
}

function UpdateHandler(protoHandler) {
  return async (req) => {
    checkWriteAccess(req);

    if (req.body.firstName !== undefined && !req.body.firstName) {
      const userResponse = await db.findOne({
        model: users,
        query: { id: req.query.id, columns: { email: true } },
      });
      req.body.firstName = userResponse?.email?.split("@")[0] || "";
    }

    return await protoHandler(req);
  };
}

function DeleteHandler(protoHandler) {
  return async (req) => {
    checkWriteAccess(req);
    return await protoHandler(req);
  };
}

function FindOneHandler(protoHandler) {
  return async (req) => {
    checkReadAccess(req);
    addEmailToQuery(req);
    return await protoHandler(req);
  };
}

function FindManyHandler(protoHandler) {
  return async (req) => {
    delete req.query.userId; // conflict with auth userId
    addEmailToQuery(req);
    return await protoHandler(req);
  };
}

const addEmailToQuery = (req) => {
  if (
    !req.query.columns ||
    (req.query.columns && toStringArray(req.query.columns).includes("email"))
  ) {
    req.query.with = req.query.with || {
      user: { columns: { email: true } },
    };
  }
};

function AddPhotoHandler(protoHandler) {
  return async (req) => {
    // checkWriteAccess(req)
    // return await protoHandler(req);
  };
}
