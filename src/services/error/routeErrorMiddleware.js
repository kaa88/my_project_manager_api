import { ApiError } from "./apiError.js";

export default function (req, res, next) {
  next(ApiError.badRequest(`Cannot ${req.method} ${req.originalUrl}`));
}
