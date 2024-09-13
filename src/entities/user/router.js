import express from "express";
import { body } from "express-validator";
import { controller } from "./controller.js";

// const middlewares = [
//   authMiddleware,
//   userRoleMiddleware,
//   nullValueMiddleware,
//   queryParserMiddleware,
// ];

const passwordValidationSettings = {
  minLength: 4, // temp
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
  controller.create
);
router.patch("/update/:id", controller.update);
router.delete("/delete/:id", controller.delete);

router.get("/:id", controller.findOne);
router.get("/", controller.findMany);

router.post(
  "/change_password/:id",
  body("newPassword").isStrongPassword(passwordValidationSettings),
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
router.get("/refresh", controller.refresh);

router.post("/upload_image", controller.addPhoto);

export default router;
