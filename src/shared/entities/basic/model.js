import { serial, timestamp } from "drizzle-orm/pg-core";

export class CoreModel {
  constructor() {
    this.id = serial("_id").primaryKey();
  }
}

export class BasicModel extends CoreModel {
  constructor() {
    super();
    this.createdAt = timestamp("created_at").notNull().defaultNow();
    this.updatedAt = timestamp("updated_at").notNull().defaultNow();
    this.deletedAt = timestamp("deleted_at");
  }
}
