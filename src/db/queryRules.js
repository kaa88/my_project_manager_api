import { between, eq, ilike, or } from "drizzle-orm";
import { checkDbQueryProps } from "./queryProps.js";
import { getDateRange } from "./utils.js";
import { isArray } from "../shared/utils.js";

const excludeProps = ["limit", "offset", "order", "orderBy"];

export const getRulesFromQuery = ({ model, query }) => {
  checkDbQueryProps({ model, query });

  return Object.entries(query).map(([key, value]) => {
    if (value === undefined || excludeProps.includes(key)) return;

    const type = model[key].dataType;

    if (type === "string") {
      if (value === null) return eq(model[key], value);
      return ilike(model[key], `%${value}%`);
    }

    if (type === "number")
      return isArray(value)
        ? or(...value.map((v) => eq(model[key], v)))
        : eq(model[key], value);

    if (type === "boolean") return eq(model[key], value);

    if (type === "date") {
      if (value === null) return eq(model[key], value);
      const [from, to] = getDateRange(value);
      return between(model[key], new Date(from), new Date(to));
    }

    if (type === "json") return;
    if (type === "array") return;
  });
};
// export const getRulesFromQuery = ({ model, query }) => {
//   checkDbQueryProps({ model, query });

//   return Object.entries(query).map(([key, value]) => {
//     if (value === undefined || excludeProps.includes(key)) return;

//     const type = model[key].dataType;
//     if (type === "string") return ilike(model[key], `%${value}%`);
//     if (type === "number") return eq(model[key], value);
//     if (type === "boolean") return eq(model[key], value);
//     if (type === "date") {
//       const [from, to] = getDateRange(value);
//       return between(model[key], new Date(from), new Date(to));
//     }
//     if (type === "json") return;
//     if (type === "array") return;
//   });
// };

// export const getSearchRulesFromQuery = ({ model, query }) => {
//   checkDbQueryProps({ model, query });

//   return Object.entries(query).map(([key, value]) => {
//     if (value === undefined || excludeProps.includes(key)) return;

//     const type = model[key].dataType;
//     if (type === "string") return ilike(model[key], `%${value}%`);
//     // ...?
//   });
// };

////////////////////////////////////////////////////
// test column data types
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
