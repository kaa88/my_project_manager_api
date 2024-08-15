import { or, and, asc, desc } from "drizzle-orm";
import { isArray, isObject } from "../shared/utils.js";
import { ApiError } from "../services/error/apiError.js";
import { Message } from "../services/error/message.js";
import { getRulesFromQuery } from "./queryRules.js";

const propCheck = {
  model: (value) => isObject(value),
  values: (value) => isObject(value),
  query: (value) => isObject(value),
  customChunks: (value) => isArray(value),
};

export const checkDbQueryProps = (props) => {
  const required = [];
  const incorrect = [];
  for (let key in props) {
    if (props[key] === undefined) required.push(key);
    else if (propCheck[key] && !propCheck[key](props[key])) incorrect.push(key);
  }
  if (required.length) throw ApiError.internal(Message.required(required));
  if (incorrect.length)
    throw ApiError.internal(`Incorrect type of props: ${incorrect}`);
};

const DEFAULT_ORDER_BY = "id";

export const getDbPaginationProps = ({ model, query }) => {
  checkDbQueryProps({ model, query });

  const result = {};

  if (query.limit) result.limit = query.limit;
  if (query.offset) result.offset = query.offset;

  const order = /desc/i.test(query.order) ? desc : asc;
  const orderBy = query.orderBy || DEFAULT_ORDER_BY;
  result.orderBy = [order(model[orderBy])];

  return result;
};

export const getDbWhereProps = ({ model, query, omitDeleted }) => {
  // checkDbQueryProps({ model, query });

  let chunks = getRulesFromQuery({
    model,
    query: omitDeleted ? { ...query, deletedAt: null } : query,
  });
  chunks = chunks.filter((c) => c);

  // const operator = query.search !== undefined ? or : and;
  const operator = and;

  return chunks.length ? { where: operator(...chunks) } : {};
};
