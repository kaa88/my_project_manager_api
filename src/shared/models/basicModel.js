import { serial, timestamp } from "drizzle-orm/pg-core";

// export const basicModel = {
//   id: serial("id").primaryKey(),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
//   updatedAt: timestamp("updatedAt").notNull().defaultNow(),
// };

export class BasicModel {
  constructor() {
    this.id = serial("id").primaryKey();
    this.createdAt = timestamp("createdAt").notNull().defaultNow();
    this.updatedAt = timestamp("updatedAt").notNull().defaultNow();
  }
}
