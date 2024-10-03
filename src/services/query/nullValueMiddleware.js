import { ApiError } from "../error/index.js";
import { isNullishData, isObject } from "../../shared/utils/utils.js";

function nullValueMiddleware(req, res, next) {
  try {
    req.query = fixNullishProps(req.query);
    req.body = fixNullishProps(req.body);

    next();
  } catch (e) {
    return next(e.isApiError ? e : ApiError.internal(e.message));
  }
}

export default nullValueMiddleware;

const fixNullishProps = (props) => {
  const fixed = {};
  if (isObject(props)) {
    for (let key in props) {
      fixed[key] = isNullishData(props[key]) ? null : props[key];
    }
  }
  return fixed;
};
