import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { BasicModel } from "../../shared/entities/basic/model.js";

export const users = pgTable("users", {
  // basic columns
  ...new BasicModel(),
  // specific columns
  email: text("email").notNull().unique(), // при удалении добавлять '#12 ' чтобы оставался unique (12 - это id с пробелом)
  password: text("password").notNull(),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isCookieAccepted: boolean("is_cookie_accepted").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  lastVisitAt: timestamp("last_visit_at").notNull().defaultNow(),
  refreshTokens: text("refresh_tokens").array().notNull(),
  // relative columns
  // userInfoId: integer("user_info_id").references(() => users.id),
});

export const usersInfo = pgTable("usersInfo", {
  ...new BasicModel(),

  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  status: text("status").notNull().default(""),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

// relations
// export const usersRelations = relations(users, ({ one }) => ({
//   userInfo: one(users, {
//     fields: [users.userInfoId],
//     references: [usersInfo.id],
//   }),
// }));

export const usersInfoRelations = relations(usersInfo, ({ one }) => ({
  user: one(usersInfo, {
    fields: [usersInfo.userId],
    references: [users.id],
  }),
}));
