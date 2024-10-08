import { ApiError, Message } from "../../services/error/index.js";
import { isArray, isObject } from "./utils.js";

export const getIdsFromQuery = (idNames, query) => {
  if (!isArray(idNames))
    throw ApiError.internal(Message.incorrect("idNames", "Array"));
  if (!isObject(query))
    throw ApiError.internal(Message.incorrect("query", "Object"));

  const result = {};
  const errors = [];

  idNames.forEach((key) => {
    if (typeof key !== "string")
      throw ApiError.internal(Message.incorrect("query id key", "String"));

    result[key] = Number(query[key]);
    if (!result[key]) errors.push(key);
  });

  if (errors.length) throw ApiError.badRequest(Message.required(errors));
  return result;
};

export const checkIdsInQuery = (idNames, query) =>
  !!getIdsFromQuery(idNames, query);
