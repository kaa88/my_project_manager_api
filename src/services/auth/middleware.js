import { ApiError } from "../error/apiError.js";
import TokenService from "./TokenService.js";

function authMiddleware(req, res, next) {
  // если MW вЫключен - будет undefined
  // если включен - userId из кук или null

  // check env
  // parse cookies
  req.user = {
    userId: 2,
    projectId: 2,
    boardId: 2,
    // role: USER_ROLE.user,
  };

  // try {
  //   let authHeader = req.headers.authorization;
  //   if (!authHeader) throw "er";

  //   let accessToken = authHeader.split(" ")[1];
  //   if (!accessToken) throw "er";

  //   let tokenData = TokenService.validateAccessToken(accessToken);
  //   if (tokenData instanceof Error) throw "er";

  //   req.tokenData = tokenData;
  //   next();
  // } catch (er) {
  //   return next(ApiError.unauthorized());
  // }
  next();
}

export default authMiddleware;
