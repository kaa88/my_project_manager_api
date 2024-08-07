import { between, eq, ilike } from "drizzle-orm";
import { isDate } from "../shared/utils.js";
import { checkDbQueryProps } from "./queryProps.js";

const excludeProps = ["limit", "offset", "order", "orderBy"];

export const getRulesFromQuery = ({ model, query }) => {
  checkDbQueryProps({ model, query });

  return Object.entries(query).map(([key, value]) => {
    if (value === undefined || excludeProps.includes(key)) return;

    const type = model[key].dataType;
    if (type === "string") return ilike(model[key], `%${value}%`);
    if (type === "number") return eq(model[key], value);
    if (type === "boolean") return eq(model[key], value);
    if (type === "date") {
      if (isDate(value)) {
        const [from, to] = getDateRange(value);
        return between(model[key], new Date(from), new Date(to));
      }
    }
    if (type === "json") return;
    if (type === "array") return;
  });
};

// export const getSearchRulesFromQuery = ({ model, query }) => {
//   checkDbQueryProps({ model, query });

//   return Object.entries(query).map(([key, value]) => {
//     if (value === undefined || excludeProps.includes(key)) return;

//     const type = model[key].dataType;
//     if (type === "string") return ilike(model[key], `%${value}%`);
//     // ...?
//   });
// };

const getDateRange = (dateString) => {
  const shortDateTime = dateString.split(".")[0]; // trim ms
  const from = isDate(shortDateTime) ? shortDateTime : "0";

  let offset = 1;
  if (isNaN(from[from.length - offset])) offset++;

  const lastDigit = Number(from[from.length - offset]) + 1;
  const to = from.slice(0, -1) + lastDigit;

  return [from, to];
};

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
