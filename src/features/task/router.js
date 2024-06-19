import express from "express";
import { controller } from "./controller.js";
import { getDefaultRouter } from "../../router/defaultRouter.js";

export const router = getDefaultRouter(controller);

// export const router = express.Router();

// router.get("/", controller.get);
// router.post("/", controller.create);
// router.put("/", controller.update);
// router.delete("/", controller.delete);
