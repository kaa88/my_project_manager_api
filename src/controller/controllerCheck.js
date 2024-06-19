import { isCorrectUserRole } from "./accessRights.js";

export const controllerCheck = (req, res, next, requiredRole) => {
  if (!req.tokenData)
    return { error: next(ApiError.internal("Failed to check auth token")) };

  if (!isCorrectUserRole(requiredRole, req.tokenData.role))
    return {
      error: next(
        ApiError.forbidden(
          `Only users with role "${requiredRole}" or above can do this. Current role is "${req.tokenData.role}"`
        )
      ),
    };

  return { ok: true };
};
