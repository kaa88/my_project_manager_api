import jwt from "jsonwebtoken";
import { isObjectEmpty } from "../../shared/utils.js";

const ACCESS_TOKEN_EXPIRE_PERIOD = "15m";
const REFRESH_TOKEN_EXPIRE_PERIOD = "15d";

const TokenService = {
  generateToken(data = {}) {
    if (isObjectEmpty(data))
      return new Error('Failed to generate token, "data" is empty.');
    const accessToken = jwt.sign(data, process.env.JWT_ACCESS_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRE_PERIOD,
    });
    const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: REFRESH_TOKEN_EXPIRE_PERIOD,
    });
    return { accessToken, refreshToken };
  },
  validateAccessToken(token) {
    return validateToken(token, process.env.JWT_ACCESS_SECRET_KEY);
  },
  validateRefreshToken(token) {
    return validateToken(token, process.env.JWT_REFRESH_SECRET_KEY);
  },
};
export default TokenService;

function validateToken(token, key) {
  try {
    if (!token || !key) throw new Error("Missing token or key");
    const tokenUserData = jwt.verify(token, key);
    return tokenUserData;
  } catch (err) {
    return err;
  }
}
