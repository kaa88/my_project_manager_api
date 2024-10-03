import express from "express";
import { body } from "express-validator";
import { controller } from "./controller.js";

import authMiddleware from "../../services/auth/middleware.js";
import nullValueMiddleware from "../../services/query/nullValueMiddleware.js";

const middlewares = [authMiddleware, nullValueMiddleware];

const passwordValidationSettings = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const router = express.Router();

// CRUD
router.post(
  "/create",
  body("email").isEmail(),
  body("password").isStrongPassword(passwordValidationSettings),
  nullValueMiddleware,
  controller.create
);
// router.patch("/update", ...middlewares, controller.update);
router.delete("/delete", ...middlewares, controller.delete);

router.get("/one", ...middlewares, controller.findOne);
router.get("/list", ...middlewares, controller.findMany);

// Email
router.post(
  "/change_email",
  body("email").isEmail(),
  ...middlewares,
  controller.changeEmail
);
router.post("/verify_email", nullValueMiddleware, controller.verifyEmail);

// Password
router.post(
  "/change_password",
  body("newPassword").isStrongPassword(passwordValidationSettings),
  ...middlewares,
  controller.changePassword
);
router.post(
  "/restore_password",
  nullValueMiddleware,
  controller.restorePassword
);
router.post(
  "/restore_password_confirm",
  body("newPassword").isStrongPassword(passwordValidationSettings),
  nullValueMiddleware,
  controller.restorePasswordConfirm
);

// Auth
router.post("/login", nullValueMiddleware, controller.login);
router.post("/logout", ...middlewares, controller.logout);
router.post("/refresh", controller.refresh);

// Other
router.post("/accept_cookies", ...middlewares, controller.acceptCookies);
// update admin

export default router;
