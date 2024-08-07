import { or, and, eq, asc, desc } from "drizzle-orm";
import { isArray, isObject } from "../shared/utils.js";

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

// export const queryParser = {
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

// TODO: search in dates
export const getDbWhereProps = ({ model, query, customChunks = [] }) => {
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
// };
