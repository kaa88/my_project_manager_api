import { or, and, asc, desc } from "drizzle-orm";
import { isObject } from "../shared/utils/utils.js";
import { getRulesFromQuery } from "./queryRules.js";
import { checkDbQueryProps } from "./propsCheck.js";

const DEFAULT_ORDER_BY = "id";

export const getDbPaginationProps = ({ model, query }, propsChecked) => {
  if (!propsChecked) checkDbQueryProps({ model, query });

  const result = {};

  if (query.limit !== undefined) result.limit = query.limit;
  if (query.offset !== undefined) result.offset = query.offset;

  const order = /desc/i.test(query.order) ? desc : asc;
  const orderBy = query.orderBy || DEFAULT_ORDER_BY;
  if (model[orderBy]) result.orderBy = [order(model[orderBy])];

  return result;
};

export const getDbWhereProps = ({ model, query }, propsChecked) => {
  if (!propsChecked) checkDbQueryProps({ model, query });

  let chunks = getRulesFromQuery({ model, query }, true);
  chunks = chunks.filter((c) => c);

  // const operator = query.search !== undefined ? or : and;
  const operator = and;

  return chunks.length ? { where: operator(...chunks) } : {};
};

export const getDbFieldSelectProps = ({ model, query }, propsChecked) => {
  if (!propsChecked) checkDbQueryProps({ model, query });

  const result = {};
  if (isObject(query.columns)) result.columns = query.columns;
  if (isObject(query.with)) result.with = query.with;
  return result;
};
