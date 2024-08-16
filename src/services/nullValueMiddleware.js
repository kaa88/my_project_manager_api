import { isObject } from "../shared/utils.js";
import { ApiError } from "./error/apiError.js";

function nullValueMiddleware(req, res, next) {
  try {
    // req.params = fixNullableProps(req.params);
    req.query = fixNullableProps(req.query);
    req.body = fixNullableProps(req.body);

    next();
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
}

export default nullValueMiddleware;

const NULLISH = ["", "null", null];

const fixNullableProps = (props) => {
  const fixed = {};
  if (isObject(props)) {
    for (let key in props) {
      fixed[key] = NULLISH.includes(props[key]) ? null : props[key];
    }
  }
  return fixed;
};
