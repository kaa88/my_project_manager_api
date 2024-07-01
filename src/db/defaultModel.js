import { serial, timestamp } from "drizzle-orm/pg-core";

export const defaultModel = {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
};
