import express from "express";
import { isObjectEmpty } from "../utils.js";

export function BasicRouter(controller) {
  if (isObjectEmpty(controller)) throw new Error("No controller provided");

  const router = express.Router();

  if (controller.create) router.post("/", controller.create);
  if (controller.update) router.patch("/:id", controller.update);
  if (controller.delete) router.delete("/:id", controller.delete);
  if (controller.findOne) router.get("/:id", controller.findOne);
  if (controller.findMany) router.get("/", controller.findMany);
  // if (controller.search) router.get("/search", controller.search);

  return router;
}
