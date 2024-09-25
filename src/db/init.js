import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema.js";

const instance = drizzle(sql, { schema, logger: true });

// console.log(instance);

export default instance;
