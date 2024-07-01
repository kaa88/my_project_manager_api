import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  // driver: "pg",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
    // connectionString:
    //   !console.log("------I GOT ENV!!!-----------") && process.env.POSTGRES_URL,
  },
  schema: "./src/db/schema.js",
  out: "./drizzle",
});
