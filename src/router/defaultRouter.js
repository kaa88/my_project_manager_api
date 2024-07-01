import express from "express";
import authMiddleware from "../services/auth/authMiddleware.js";
import { isObject } from "../shared/utils.js";
import { defaultControllerKeys } from "../controller/defaultController.js";

export const getDefaultRouter = (controller) => {
  if (!isObject(controller)) return console.error("No controller provided");

  for (let key of defaultControllerKeys) {
    if (controller[key] === undefined)
      return console.error("Wrong controller provided");
  }

  const router = express.Router();

  router.get("/", controller.get);
  router.post("/", controller.create);
  router.patch("/", controller.update);
  router.delete("/", controller.delete);
  // router.post("/", authMiddleware, controller.create);
  // router.put("/", authMiddleware, controller.update);
  // router.delete("/", authMiddleware, controller.delete);

  return router;
};
