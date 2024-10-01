import { ApiError } from "../error/index.js";
import { TokenService } from "./TokenService.js";

function authMiddleware(req, res, next) {
  req.user = {};
  try {
    if (process.env.USE_AUTHORIZATION === "true") {
      const accessToken = req.cookies.access_token;
      if (!accessToken)
        throw ApiError.unauthorized("Authorization token was not provided");

      const token = TokenService.validateAccessToken(accessToken);
      if (!token.isValid || token.isExpired)
        throw ApiError.unauthorized("Invalid access token");

      req.user.id = Number(token.data?.user_id);
      req.user.email = token.data?.email;
    } else {
      req.user.id = Number(req.query.userId);
    }

    if (!req.user.id) throw ApiError.unauthorized("User ID was not provided");

    next();
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
}

export default authMiddleware;
