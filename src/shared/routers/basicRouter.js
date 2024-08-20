import express from "express";
import { ApiError } from "../../services/error/apiError.js";
import { Message } from "../../services/error/message.js";
import { isArray, isObjectEmpty } from "../utils.js";

import nullValueMiddleware from "../../services/nullValueMiddleware.js";
import queryParserMiddleware from "../../services/queryParserMiddleware.js";
import authMiddleware from "../../services/auth/middleware.js";
import userRoleMiddleware from "../../services/userRoles/middleware.js";

const middlewares = [
  authMiddleware,
  userRoleMiddleware,
  nullValueMiddleware,
  queryParserMiddleware,
];

export function BasicRouter({ controller, omit = [] }) {
  if (isObjectEmpty(controller))
    throw ApiError.internal("No controller provided");
  if (!isArray(omit))
    throw ApiError.internal(Message.incorrect("omit", "Array"));

  const router = express.Router();

  if (!omit.includes("create") && controller.create)
    router.post("/", ...middlewares, controller.create);

  if (!omit.includes("update") && controller.update)
    router.patch("/:id", ...middlewares, controller.update);

  if (!omit.includes("delete") && controller.delete)
    router.delete("/:id", ...middlewares, controller.delete);

  if (!omit.includes("findOne") && controller.findOne)
    router.get("/:id", ...middlewares, controller.findOne);

  if (!omit.includes("findMany") && controller.findMany)
    router.get("/", ...middlewares, controller.findMany);

  // if (!omit.includes("search") && controller.search)
  //   router.get("/search", ...middlewares, controller.search);

  return router;
}
