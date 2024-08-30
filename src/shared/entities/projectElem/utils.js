import { ApiError, Message } from "../../../services/error/index.js";
import { db } from "../../../db/db.js";
import { projects } from "../../../entities/project/model.js";

export const getCurrentProject = async (projectId) => {
  const project = await db.findOne({
    model: projects,
    query: { id: projectId, deletedAt: null },
  });
  if (!project)
    throw ApiError.badRequest(`Project with id=${projectId} does not exist`);
  return project;
};

export const checkWriteAccess = (req) => {
  if (
    req.user.id !== req.project.ownerId &&
    (!isArray(req.project.adminIds) ||
      !req.project.adminIds.includes(req.user.id))
  )
    throw ApiError.forbidden(Message.forbidden());
};

export const checkReadAccess = (req, errorCallback) => {
  if (
    !isArray(req.project.memberIds) ||
    !req.project.memberIds.includes(req.user.id)
  ) {
    if (errorCallback) errorCallback(req);
    else throw ApiError.forbidden(Message.forbidden());
  }
};
