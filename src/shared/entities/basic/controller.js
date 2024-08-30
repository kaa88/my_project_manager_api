import { ApiError, Message } from "../../../services/error/index.js";
import { isObject } from "../../utils/utils.js";

import { BasicHandlers } from "./handlers.js";

export class BasicController {
  constructor(options) {
    if (isObject(options)) {
      this.handlers = new BasicHandlers(options);
      this.createControllsFromHandlers();
    }
  }

  createControllsFromHandlers(handlers = this.handlers) {
    if (!isObject(handlers))
      throw ApiError.internal(Message.incorrect("handlers", "object"));

    this.handlers = handlers; // if handlers prop is provided

    Object.keys(handlers).forEach((handler) => {
      this[handler] = async (req, res, next) => {
        try {
          return res.json(await handlers[handler](req));
        } catch (e) {
          return next(e.isApiError ? e : ApiError.internal(e.message));
        }
      };
    });
  }
}
