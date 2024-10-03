import { db } from "../../../db/db.js";
import { teamsToBoards as model } from "./model.js";
import {
  checkHandlerProps,
  filterIds,
  getModelProps,
  getOppositeModelName,
} from "./utils.js";

export const handleRelationsOnCreate = async (
  currentModelName,
  responseIds,
  requestIds
) => {
  checkHandlerProps(currentModelName, responseIds, requestIds);
  const oppositeModelName = getOppositeModelName(currentModelName);

  const newIds = filterIds(requestIds);

  let result = {};
  try {
    await db.create({
      model,
      values: newIds.map((id) =>
        getModelProps(currentModelName, responseIds, id)
      ),
    });
    result[oppositeModelName + "Ids"] = newIds.length ? newIds : [];
  } catch (e) {
    result = await handleRelationError(e, currentModelName, responseIds);
  }
  return result;
};

export const handleRelationsOnUpdate = async (
  currentModelName,
  responseIds,
  requestIds
) => {
  checkHandlerProps(currentModelName, responseIds, requestIds);
  const oppositeModelName = getOppositeModelName(currentModelName);

  const newIds = filterIds(requestIds);
  const existingIds =
    (await getExistingIds(currentModelName, responseIds)) || [];

  const itemsToAdd = newIds.filter((id) => !existingIds.includes(id));
  const itemsToDelete = existingIds.filter((id) => !newIds.includes(id));

  let result = {};
  try {
    if (itemsToDelete.length) {
      await db.delete({
        model,
        query: getModelProps(currentModelName, responseIds, itemsToDelete),
      });
    }
    if (itemsToAdd.length) {
      await db.create({
        model,
        values: itemsToAdd.map((id) =>
          getModelProps(currentModelName, responseIds, id)
        ),
      });
    }
    result[oppositeModelName + "Ids"] = newIds.length ? newIds : [];
  } catch (e) {
    result = await handleRelationError(e, currentModelName, responseIds);
  }
  return result;
};

export const handleRelationsOnDelete = async (
  currentModelName,
  responseIds
) => {
  checkHandlerProps(currentModelName, responseIds, []);

  let result = {};
  try {
    await db.delete({
      model,
      query: getModelProps(currentModelName, responseIds, undefined),
    });
  } catch (e) {
    result = await handleRelationError(e, currentModelName, responseIds);
  }
  return result;
};

export const handleRelationsOnGet = async (currentModelName, responseIds) => {
  checkHandlerProps(currentModelName, responseIds, []);
  const oppositeModelName = getOppositeModelName(currentModelName);
  return {
    [oppositeModelName + "Ids"]: await getExistingIds(
      currentModelName,
      responseIds
    ),
  };
};

const getExistingIds = async (currentModelName, responseIds) => {
  const oppositeModelName = getOppositeModelName(currentModelName);
  const relations = await db.findMany({
    model,
    query: getModelProps(currentModelName, responseIds, undefined),
    count: false,
  });

  const ids = relations.items.map((rel) => rel[oppositeModelName + "Id"]);
  return ids.length ? ids : [];
};

const handleRelationError = async (error, currentModelName, responseIds) => {
  const oppositeModelName = getOppositeModelName(currentModelName);
  const message = `Error on updating '${oppositeModelName}Ids'. ${error.message}`;
  console.log(message);
  const result = {};
  if (responseIds) {
    result[oppositeModelName + "Ids"] = await getExistingIds(
      currentModelName,
      responseIds
    );
    result.message = message;
  }
  return result;
};
