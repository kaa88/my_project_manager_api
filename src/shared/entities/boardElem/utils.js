import { ApiError } from "../../../services/error/index.js";
import { db } from "../../../db/db.js";
import { boards } from "../../../entities/board/model.js";

export const getCurrentBoard = async (boardId, projectId) => {
  const board = await db.findOne({
    model: boards,
    query: { id: boardId, projectId, deletedAt: null },
    related: { teamsToBoards: { boardId: true } }, // ???
  });
  if (!board)
    throw ApiError.badRequest(
      `Board with id=${boardId} and projectId=${projectId} does not exist`
    );
  return board;
};

export const checkWriteAccess = (req) => {
  // есть борды, доступные тиме, а есть доступные всем (мб добавить поле 'private' в модель)
  // if (
  //   req.user.id !== req.project.ownerId &&
  //   (!isArray(req.project.adminIds) ||
  //     !req.project.adminIds.includes(req.user.id))
  // )
  // throw ApiError.forbidden(Message.forbidden());
};

export const checkReadAccess = (req, errorCallback) => {
  // if (
  //   !isArray(req.project.memberIds) ||
  //   !req.project.memberIds.includes(req.user.id)
  // ) {
  // if (errorCallback) errorCallback(req);
  // else throw ApiError.forbidden(Message.forbidden());
  // }
};
