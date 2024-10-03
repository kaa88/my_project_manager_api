import { ApiError } from "../../../services/error/index.js";
import {
  isArray,
  isObject,
  toNumberArrayOrNull,
} from "../../../shared/utils/utils.js";

export const MODEL_NAME = {
  team: "team",
  board: "board",
};

export const getOppositeModelName = (currentModelName) =>
  currentModelName === MODEL_NAME.team ? MODEL_NAME.board : MODEL_NAME.team;

const propCheck = {
  currentModelName: (value) => Object.values(MODEL_NAME).includes(value),
  responseIds: (value) => isObject(value) && value.projectId && value.id,
  requestIds: (value) =>
    isArray(value) || typeof value === "string" || typeof value === "number",
};

export const checkHandlerProps = (
  currentModelName,
  responseIds,
  requestIds
) => {
  if (!propCheck.currentModelName(currentModelName))
    throw ApiError.internal(
      "Missing or incorrect 'teamsToBoards' 'currentModelName' prop"
    );
  if (!propCheck.responseIds(responseIds))
    throw ApiError.internal(
      "Missing or incorrect 'teamsToBoards' 'responseIds' prop"
    );
  if (!propCheck.requestIds(requestIds))
    throw ApiError.internal(
      "Missing or incorrect 'teamsToBoards' 'requestIds' prop"
    );
};

export const filterIds = (rawIds) => {
  let ids = toNumberArrayOrNull(rawIds) || [];
  if (ids.length) ids = [...new Set(ids)].filter((id) => id);
  return ids;
};

export const getModelProps = (
  currentModelName,
  responseIds,
  oppositeValue
) => ({
  teamId: currentModelName === MODEL_NAME.team ? responseIds.id : oppositeValue,
  boardId:
    currentModelName === MODEL_NAME.board ? responseIds.id : oppositeValue,
});
