import { or, and, asc, desc } from "drizzle-orm";
import {
  isArray,
  isEmptyObject,
  isObject,
  toStringArray,
} from "../shared/utils/utils.js";
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

export const getDbWhereProps = ({ model, query, equal }, propsChecked) => {
  if (!propsChecked) checkDbQueryProps({ model, query });

  let chunks = getRulesFromQuery({ model, query, equal }, true);
  chunks = chunks.filter((c) => c);

  // const operator = query.search !== undefined ? or : and;
  const operator = and;

  return chunks.length ? { where: operator(...chunks) } : {};
};

export const getDbFieldSelectProps = ({ model, query }, propsChecked) => {
  if (!propsChecked) checkDbQueryProps({ model, query });
  // здесь по-хорошему должна быть проверка с рекурсией есть ли поля в модели

  const parse = (x) => {
    if (isObject(x) && !isEmptyObject(x)) return x;

    const names = toStringArray(x);
    if (names.length) {
      const parseResult = {};
      names.forEach((n) => (parseResult[n] = true));
      return parseResult;
    }
  };

  return {
    columns: parse(query.columns),
    with: parse(query.with),
  };
};
