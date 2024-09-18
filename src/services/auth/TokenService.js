import jwt from "jsonwebtoken";
import { ApiError } from "../error/index.js";
import { isObjectEmpty } from "../../shared/utils/utils.js";
import { parsePeriod } from "./utils.js";

const ACCESS_TOKEN_EXPIRE_PERIOD = "10m";
const REFRESH_TOKEN_EXPIRE_PERIOD = "14d";

const GENERATION_ERROR = ApiError.internal(
  'Failed to generate token, "data" is empty.'
);

export const TokenService = {
  generateTokens(data = {}) {
    return {
      accessToken: this.generateAccessToken(data),
      refreshToken: this.generateRefreshToken(data),
    };
  },
  generateAccessToken(data = {}) {
    if (isObjectEmpty(data)) throw GENERATION_ERROR;
    const token = jwt.sign(data, process.env.ACCESS_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRE_PERIOD,
    });
    return `Bearer ${token}`;
  },
  generateRefreshToken(data = {}) {
    if (isObjectEmpty(data)) throw GENERATION_ERROR;
    const token = jwt.sign(data, process.env.REFRESH_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRE_PERIOD,
    });
    return `Bearer ${token}`;
  },
  validateAccessToken(token) {
    return validateToken(token, process.env.ACCESS_SECRET_KEY);
  },
  validateRefreshToken(token) {
    return validateToken(token, process.env.REFRESH_SECRET_KEY);
  },

  getAccessCookie(token = "null") {
    return [
      "access_token",
      token,
      {
        maxAge: parsePeriod(ACCESS_TOKEN_EXPIRE_PERIOD),
        httpOnly: true,
        secure: true,
      },
    ];
  },
  getRefreshCookie(token = "null") {
    return [
      "refresh_token",
      token,
      {
        maxAge: parsePeriod(REFRESH_TOKEN_EXPIRE_PERIOD),
        httpOnly: true,
        secure: true,
      },
    ];
  },
};

function validateToken(token, key) {
  try {
    const cleanToken = token.split(" ")[1]; // trim Bearer
    if (!cleanToken || !key)
      throw ApiError.badRequest(
        "Validation failed: missing token or secret key."
      );

    const tokenData = jwt.verify(cleanToken, key);
    return tokenData;
  } catch (e) {
    return e.isApiError ? e : ApiError.unauthorized("Invalid token");
  }
}
