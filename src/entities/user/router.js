import express from "express";
import { body } from "express-validator";
import { controller } from "./controller.js";

import authMiddleware from "../../services/auth/middleware.js";
import nullValueMiddleware from "../../services/nullValueMiddleware.js";
import queryParserMiddleware from "../../services/queryParserMiddleware.js";

const middlewares = [
  authMiddleware,
  // userRoleMiddleware,
  nullValueMiddleware,
  queryParserMiddleware,
];

const passwordValidationSettings = {
  // temp
  minLength: 4,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
  // minLength: 8,
  // minLowercase: 1,
  // minUppercase: 1,
  // minNumbers: 1,
  // minSymbols: 1,
};

const router = express.Router();

router.post(
  "/create",
  body("email").isEmail(),
  body("password").isStrongPassword(passwordValidationSettings),
  nullValueMiddleware,
  controller.create
);
router.patch("/update/:id", ...middlewares, controller.update);
router.delete("/delete/:id", ...middlewares, controller.delete);

router.get("/:id", ...middlewares, controller.findOne);
router.get("/", ...middlewares, controller.findMany);

router.post(
  "/change_password/:id",
  body("newPassword").isStrongPassword(passwordValidationSettings),
  ...middlewares,
  controller.changePassword
);
router.post("/restore_password", controller.restorePassword);
router.post(
  "/restore_password_confirm",
  body("newPassword").isStrongPassword(passwordValidationSettings),
  controller.restorePasswordConfirm
);

router.post("/verify", controller.verifyEmail);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/refresh", controller.refresh);

router.post("/upload_image", controller.addPhoto);

export default router;
