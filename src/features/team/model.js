import { pgTable, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { defaultModel } from "../../db/defaultModel.js";

export const users = pgTable("users", {
  ...defaultModel,
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // enum
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  isCookieAccepted: boolean("isCookieAccepted"),
  isEmailVerified: boolean("isEmailVerified"),
  photo: text("photo"),
  // related:
  teamId: integer("teamId"),
});

// export const usersRelations = relations(users, ({ one }) => ({
//   invitee: one(users, {
//     fields: [users.invitedBy],
//     references: [users.id],
//   }),
// }));
