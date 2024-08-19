import { isObject } from "../shared/utils.js";
import { ApiError } from "./error/apiError.js";

function queryParserMiddleware(req, res, next) {
  // Object.entries(req).forEach(([key, value]) => {
  //   console.log(key, typeof value === "object" ? "object" : value);
  // });

  try {
    req.$pagination = {};
    req.$search = {};
    req.$values = {};

    next();
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
}

export default queryParserMiddleware;
