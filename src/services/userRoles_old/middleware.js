import { ApiError } from "../error/index.js";

function userRoleMiddleware(req, res, next) {
  const PID = 2;
  // console.log(req.method, "... injecting projectId =", PID);
  // req.query.projectId = req.query.projectId = req.body.projectId = PID;

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
