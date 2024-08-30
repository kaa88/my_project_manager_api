import { ApiError } from "../error/index.js";
import TokenService from "./TokenService.js";

function authMiddleware(req, res, next) {
  req.user = {};
  try {
    if (process.env.USE_AUTHORIZATION === "true") {
      const authHeader = req.headers.authorization;
      if (!authHeader)
        throw ApiError.unauthorized("Authorization token was not provided");

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken)
        throw ApiError.unauthorized("Authorization token was not provided");

      const tokenData = TokenService.validateAccessToken(accessToken);
      if (tokenData instanceof Error)
        throw ApiError.unauthorized("Invalid access token"); //?

      req.user = {
        id: Number(tokenData.user_id),
        // projectId: tokenData.project_id,
        // boardId: tokenData.board_id,
      };
    } else {
      req.user = {
        id: Number(req.query.userId), // || 2, //
        // projectId: req.body.projectId || req.query.projectId,
        // boardId: req.body.boardId || req.query.boardId,
      };
    }

    if (!req.user.id) throw ApiError.unauthorized("User ID was not provided");

    next();
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
}

export default authMiddleware;
