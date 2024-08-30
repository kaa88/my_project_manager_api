import { ApiError, Message } from "../../services/error/index.js";
import { isArray, isObject } from "./utils.js";

export const getIdsFromQuery = (ids, query) => {
  if (!isArray(ids)) throw ApiError.internal(Message.incorrect("ids", "array"));
  if (!isObject(query))
    throw ApiError.internal(Message.incorrect("query", "object"));

  const result = {};
  const errors = [];

  ids.forEach((key) => {
    if (typeof key !== "string")
      throw ApiError.internal(Message.incorrect("query id key", "string"));

    result[key] = Number(query[key]);
    if (!result[key]) errors.push(key);
  });

  if (errors.length) throw ApiError.badRequest(Message.required(errors));
  return result;
};

export const checkIdsInQuery = (ids, query) => !!getIdsFromQuery(ids, query);
