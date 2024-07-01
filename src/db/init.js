import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema.js";

export default drizzle(sql, { schema, logger: true });
