import { ApiError } from "../error/error.js";

function userRoleMiddleware(req, res, next) {
  next();
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
}

export default userRoleMiddleware;
