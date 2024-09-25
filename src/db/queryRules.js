import { arrayContains, between, eq, ilike, isNull, or } from "drizzle-orm";
import { checkDbQueryProps } from "./propsCheck.js";
import { getDateRange } from "./utils.js";
import { isArray } from "../shared/utils/utils.js";

const EXCLUDED_PROPS = ["limit", "offset", "order", "orderBy"];

// This func generates chunks with rules for DB query.
export const getRulesFromQuery = ({ model, query }, propsChecked) => {
  if (!propsChecked) checkDbQueryProps({ model, query });

  return Object.entries(query).map(([key, value]) => {
    const column = model[key];
    if (!column) return;
    const columnType = column.dataType;

    if (value === undefined || EXCLUDED_PROPS.includes(key)) return;

    if (value === null) return isNull(column);

    if (columnType === "string") return ilike(column, `%${value}%`);

    if (columnType === "number")
      return isArray(value)
        ? or(...value.map((v) => eq(column, v)))
        : eq(column, value);

    if (columnType === "boolean") return eq(column, value);

    if (columnType === "date") {
      const [from, to] = getDateRange(value);
      return between(column, new Date(from), new Date(to));
    }

    if (columnType === "json") return null; // ?

    if (columnType === "array") {
      return arrayContains(column, value);
    }
  });
};

// export const getSearchRulesFromQuery = ({ model, query }, propsChecked) => {
//   if (!propsChecked) checkDbQueryProps({ model, query });

//   return Object.entries(query).map(([key, value]) => {
//     if (value === undefined || EXCLUDED_PROPS.includes(key)) return;

//     const columnType = model[key].dataType;
//     if (columnType === "string") return ilike(model[key], `%${value}%`);
//     // ...?
//   });
// };

////////////////////////////////////////////////////
// test column data columnTypes
// import * as DRZL from "drizzle-orm/pg-core";
// const _testtable = DRZL.pgTable("test_table", {
//   integer: DRZL.integer("integer"),
//   smallint: DRZL.smallint("smallint"),
//   bigint: DRZL.bigint("bigint", { mode: "number" }),
//   serial: DRZL.serial("serial"),
//   smallserial: DRZL.smallserial("smallserial"),
//   bigserial: DRZL.bigserial("bigserial", { mode: "number" }),
//   boolean: DRZL.boolean("boolean"),
//   text: DRZL.text("text"),
//   varchar: DRZL.varchar("varchar"),
//   char: DRZL.char("char"),
//   numeric: DRZL.numeric("numeric"),
//   decimal: DRZL.decimal("decimal"),
//   real: DRZL.real("real"),
//   doublePrecision: DRZL.doublePrecision("doublePrecision"),
//   json: DRZL.json("json"),
//   jsonb: DRZL.jsonb("jsonb"),
//   time: DRZL.time("time"),
//   timestamp: DRZL.timestamp("timestamp"),
//   date: DRZL.date("date"),
//   interval: DRZL.interval("interval"),
//   point: DRZL.point("point"),
//   line: DRZL.line("line"),
//   enum: DRZL.pgEnum("fruits", ["apple", "orange"])("enum"),
// });
// Object.entries(_testtable).forEach(([key, value]) => {
//   console.log(key, ":", value.dataType);
// });
