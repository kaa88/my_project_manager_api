import { serial, timestamp } from "drizzle-orm/pg-core";

export class BasicModel {
  constructor() {
    this.id = serial("id").primaryKey();
    this.createdAt = timestamp("createdAt").notNull().defaultNow();
    this.updatedAt = timestamp("updatedAt").notNull().defaultNow();
    this.deletedAt = timestamp("deletedAt");
  }
}
