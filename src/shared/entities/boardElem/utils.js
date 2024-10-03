import { ApiError, Message } from "../../../services/error/index.js";
import { db } from "../../../db/db.js";
import { boards } from "../../../entities/board/model.js";
import { isObject } from "../../utils/utils.js";

export const getCurrentBoard = async (boardId, projectId) => {
  const board = await db.findOne({
    model: boards,
    query: {
      id: boardId,
      projectId,
      deletedAt: null,
      with: {
        teamsToBoards: {
          with: {
            team: { columns: { leaderId: true, memberIds: true } },
          },
        },
        project: {
          columns: { ownerId: true, adminIds: true, memberIds: true },
        },
      },
    },
  });
  if (!board)
    throw ApiError.badRequest(
      `Board with id=${boardId} and projectId=${projectId} does not exist`
    );
  return board;
};

export const isBoardVisible = (board, userId) => {
  if (!isObject(board) || !userId) return false;
  const teams = (board.teamsToBoards || []).map((item) => item.team);
  if (teams.length) {
    let teamMembers = [];
    teams.forEach(
      (team) =>
        (teamMembers = teamMembers.concat(team.memberIds, team.leaderId))
    );
    return teamMembers.includes(userId);
  } else return true;
};

export const checkReadAccess = (req, errorCallback) => {
  // есть борды, доступные тиме, а есть доступные всем
  const isVisibleForTeam = isBoardVisible(req.board, req.user.id);

  const projectMembers = req.board?.project
    ? [].concat(
        req.board.project.memberIds,
        req.board.project.adminIds,
        req.board.project.ownerId
      )
    : [];

  const isVisibleForProject = projectMembers.includes(req.user.id);

  if (!isVisibleForTeam || !isVisibleForProject) {
    if (errorCallback) errorCallback(req);
    else throw ApiError.forbidden(Message.forbidden());
  }
};

export const checkWriteAccess = checkReadAccess;
