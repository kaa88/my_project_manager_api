import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema.js";

const instance = drizzle(sql, {
  schema,
  logger: process.env.DB_LOGGER === "true",
});

// console.log(instance);

export default instance;
