import jwt from "jsonwebtoken";
import { ApiError, Message } from "../error/index.js";
import { isEmptyObject } from "../../shared/utils/utils.js";
import { parsePeriod } from "./utils.js";

const ACCESS_TOKEN_EXPIRE_PERIOD = "5m";
const REFRESH_TOKEN_EXPIRE_PERIOD = "14d";

const GENERATION_ERROR = ApiError.internal(
  'Failed to generate token due to "data" is empty.'
);

export const TokenService = {
  generateTokens(userId, email) {
    if (typeof userId !== "number" && !userId)
      throw ApiError.internal(Message.incorrect("userId", "Number notNull"));
    if (typeof email !== "string" && !email)
      throw ApiError.internal(Message.incorrect("email", "String notNull"));

    const data = {
      user_id: userId,
      email: email,
    };

    return {
      accessToken: this.generateAccessToken(data),
      refreshToken: this.generateRefreshToken(data),
    };
  },
  generateAccessToken(data = {}) {
    if (isEmptyObject(data)) throw GENERATION_ERROR;
    const token = jwt.sign(data, process.env.ACCESS_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRE_PERIOD,
    });
    return `Bearer ${token}`;
  },
  generateRefreshToken(data = {}) {
    if (isEmptyObject(data)) throw GENERATION_ERROR;
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
      getCookieSettings(parsePeriod(ACCESS_TOKEN_EXPIRE_PERIOD)),
    ];
  },
  getRefreshCookie(token = "null") {
    return [
      "refresh_token",
      token,
      getCookieSettings(parsePeriod(REFRESH_TOKEN_EXPIRE_PERIOD)),
    ];
  },
};

function validateToken(token, key) {
  const cleanToken = token.split(" ")[1]; // trim Bearer
  if (!cleanToken || !key)
    throw ApiError.badRequest(
      "Validation failed: missing token or secret key."
    );

  const verifiedToken = {};
  try {
    const { iat, exp, ...tokenData } = jwt.verify(cleanToken, key, {
      ignoreExpiration: true,
    });
    verifiedToken.data = tokenData;
    verifiedToken.isValid = true;
    verifiedToken.isExpired = (exp || 0) * 1000 < Date.now();
  } catch (e) {
    verifiedToken.isValid = false;
    verifiedToken.isExpired = true;
  }
  return verifiedToken;
}

const getCookieSettings = (maxAge = 0) => {
  return {
    maxAge,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
};
