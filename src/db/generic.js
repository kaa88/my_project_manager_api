import { or, and, eq, asc, desc } from "drizzle-orm";
import { isArray, isObject } from "../shared/utils.js";
import { ApiError, Message } from "../error/error.js";

export const checkDbQueryProps = (props) => {
  const required = [];
  const incorrect = [];
  for (let key in props) {
    if (props[key] === undefined) {
      required.push(key);
    } else if (
      ["model", "values", "query"].includes(key) &&
      !isObject(props[key])
    ) {
      incorrect.push(key);
    }
  }
  if (required.length) throw ApiError.internal(Message.required(required));
  if (incorrect.length)
    throw ApiError.internal(`${incorrect} must be an Object`);
};

const DEFAULT_ORDER_BY = "createdAt";

export const getQueryPaginationProps = ({ model, query }) => {
  checkDbQueryProps({ model, query });

  const result = {};

  if (query.limit) result.limit = query.limit;
  if (query.offset) result.offset = query.offset;

  const order = /desc/i.test(query.order) ? desc : asc;
  const orderBy = query.orderBy || DEFAULT_ORDER_BY;
  result.orderBy = [order(model[orderBy])];

  return result;
};

// TODO: search in dates
export const getQueryWhereProps = ({ model, query, customChunks = [] }) => {
  checkDbQueryProps({ model, query });

  if (!isArray(customChunks))
    throw ApiError.internal("Custom chunks must be an Array");

  let chunks = [
    !!query.id && eq(model.id, query.id),
    // createdAt ?
    // updatedAt ?
  ].concat(customChunks);

  chunks = chunks.filter((c) => c);

  const operator = query.search !== undefined ? or : and;

  return chunks.length ? { where: operator(...chunks) } : {};
};

export const getModelName = (model, instance) => {
  const error = ApiError.internal("Could not find model name");
  if (!model || !instance?.query) throw error;

  const symbolKeys = Object.getOwnPropertySymbols(model);
  for (let sym of symbolKeys) {
    let name = model[sym];
    if (typeof name === "string" && instance.query[name]) return name;
  }
  throw error;
};
