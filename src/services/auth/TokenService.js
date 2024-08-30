import jwt from "jsonwebtoken";
import { isObjectEmpty } from "../../shared/utils/utils.js";
import { ApiError } from "../error/apiError.js";

const ACCESS_TOKEN_EXPIRE_PERIOD = "10m";
const REFRESH_TOKEN_EXPIRE_PERIOD = "14d";

const TokenService = {
  generateToken(data = {}) {
    if (isObjectEmpty(data))
      throw ApiError.internal('Failed to generate token, "data" is empty.');
    const accessToken = jwt.sign(data, process.env.ACCESS_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRE_PERIOD,
    });
    const refreshToken = jwt.sign(data, process.env.REFRESH_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRE_PERIOD,
    });
    return { accessToken, refreshToken };
  },
  validateAccessToken(token) {
    return validateToken(token, process.env.ACCESS_SECRET_KEY);
  },
  validateRefreshToken(token) {
    return validateToken(token, process.env.REFRESH_SECRET_KEY);
  },
};
export default TokenService;

function validateToken(token, key) {
  // ??????????????????????????????
  try {
    if (!token || !key)
      throw ApiError.internal("Validation failed. Missing token or key.");
    const tokenUserData = jwt.verify(token, key);
    return tokenUserData;
  } catch (e) {
    return e.isApiError ? e : ApiError.internal(e.message);
  }
}
