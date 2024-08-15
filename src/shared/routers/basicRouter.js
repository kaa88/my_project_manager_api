import express from "express";
import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { isArray, isObjectEmpty } from "../utils.js";

export function BasicRouter({ controller, omit = [] }) {
  if (isObjectEmpty(controller))
    throw ApiError.internal("No controller provided");
  if (!isArray(omit))
    throw ApiError.internal(Message.incorrect("omit", "Array"));

  const router = express.Router();

  if (!omit.includes("create") && controller.create)
    router.post("/", controller.create);

  if (!omit.includes("update") && controller.update)
    router.patch("/:id", controller.update);

  if (!omit.includes("delete") && controller.delete)
    router.delete("/:id", controller.delete);

  if (!omit.includes("findOne") && controller.findOne)
    router.get("/:id", controller.findOne);

  if (!omit.includes("findMany") && controller.findMany)
    router.get("/", controller.findMany);

  // if (!omit.includes("search") && controller.search)
  //   router.get("/search", controller.search);

  return router;
}
