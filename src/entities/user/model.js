import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { BasicModel } from "../../shared/entities/basic/model.js";
import { profiles } from "../profile/model.js";

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
  refreshTokens: text("refresh_tokens").array(), // possibly null
  passwordRestoreCode: text("password_restore_code").notNull().default(""),
  verificationCode: text("verification_code").notNull().default(""),
});

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles),
}));
