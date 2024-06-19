import "@/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.js",
  dialect: "postgresql",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
  out: "./drizzle",
});
