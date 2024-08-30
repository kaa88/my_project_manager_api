import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { BasicModel } from "../../shared/entities/basic/model.js";

export const users = pgTable("users", {
  ...new BasicModel(),

  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // array? | enum? ... delete
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  lastVisitAt: timestamp("lastVisitAt").notNull().defaultNow(),
  isEmailVerified: boolean("isEmailVerified").default(false),
  isCookieAccepted: boolean("isCookieAccepted").default(false),
  firstName: text("firstName"),
  lastName: text("lastName"),
  image: text("image"),
  // currentProject: integer("currentProject"),
  // currentBoard: integer("currentBoard"),
});
