import { ApiError, Message } from "../../../services/error/index.js";
import { db } from "../../../db/db.js";
import { boards } from "../../../entities/board/model.js";

export const getCurrentBoard = async (boardId, projectId) => {
  console.log("---check 'with' prop in 'getCurrentBoard'---");
  const board = await db.findOne({
    model: boards,
    query: {
      id: boardId,
      projectId,
      deletedAt: null,
      with: {
        teamsToBoards: { boardId: true },
        project: { memberIds: true },
      }, // ???
    },
  });
  if (!board)
    throw ApiError.badRequest(
      `Board with id=${boardId} and projectId=${projectId} does not exist`
    );
  return board;
};

export const checkReadAccess = async (req, errorCallback) => {
  // есть борды, доступные тиме, а есть доступные всем

  const handleError = () => {
    if (errorCallback) errorCallback(req);
    else throw ApiError.forbidden(Message.forbidden());
  };

  const isPrivateBoard = isArray(req.board?.teamsToBoards); // ?

  const isTeamMember =
    isPrivateBoard && req.board.teamsToBoards.includes(req.user.id); // ?

  if (isPrivateBoard && !isTeamMember) handleError();

  if (!isPrivateBoard) {
    const isProjectMember =
      isArray(req.board?.project?.memberIds) &&
      req.board.project.memberIds.includes(req.user.id);

    if (!isProjectMember) handleError();
  }
};

export const checkWriteAccess = checkReadAccess;
