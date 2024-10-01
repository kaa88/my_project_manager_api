import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { ApiError, Message } from "../../services/error/index.js";
import { db } from "../../db/db.js";
import { TokenService } from "../../services/auth/TokenService.js";
import { BasicController } from "../../shared/entities/basic/controller.js";
import { controller as profileController } from "../profile/controller.js";
import { users as model } from "./model.js";
import { Entity, CreateDTO, DeleteDTO, GetDTO, UpdateDTO } from "./map.js";
import {
  checkReadAccess,
  checkUserExists,
  checkWriteAccess,
  getUser,
} from "./utils.js";
import { getRandomId } from "../../shared/utils/random.js";
import { toBoolean } from "../../shared/utils/utils.js";

export const controller = new BasicController({
  model,
  entity: Entity,
  dto: {
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
    get: GetDTO,
  },
});

controller.handlers = {
  create: new CreateHandler(controller.handlers.create), // token добавить новый без проверки
  // update: new UpdateHandler(controller.handlers.update),
  delete: new DeleteHandler(controller.handlers.delete), // token удалить все без проверки
  findOne: new FindOneHandler(controller.handlers.findOne),
  findMany: new FindManyHandler(controller.handlers.findMany),

  changeEmail: new ChangeEmailHandler(controller.handlers.update), // token удалить все старые, добавить 1 новый
  verifyEmail: new VerifyEmailHandler(),

  changePassword: new ChangePasswordHandler(controller.handlers.update), // token удалить все старые, добавить 1 новый
  restorePassword: new RestorePasswordHandler(),
  restorePasswordConfirm: new RestorePasswordConfirmHandler(), // token удалить все без проверки

  login: new LoginHandler(), // token проверить все старые на валидность (удалить мусор), добавить 1 новый
  logout: new LogoutHandler(), // token если 1 - не удалять, если закрыть сессию, то удалить все
  refresh: new RefreshHandler(), // token см. описание в хендлере

  acceptCookies: new AcceptCookiesHandler(controller.handlers.update),
};
controller.createControllsFromHandlers();

/* Access
create - any
update - same user
get - same user
get many - any user
*/

const HASH_SALT = 5;
const ADD_ACCESS_TOKEN_TO_RESPONSE = false;

function CreateHandler(protoHandler) {
  return async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(Message.validation(errors));

    const { email, password } = req.body;

    await checkUserExists(email);

    // Create user
    req.body.password = await bcrypt.hash(password, HASH_SALT);
    req.body.isEmailVerified = false;
    // isCookieAccepted
    delete req.body.isAdmin;
    delete req.body.lastVisitAt;
    delete req.body.refreshTokens;
    delete req.body.passwordRestoreCode;
    req.body.verificationCode = getRandomId(40);

    const protoDTO = await protoHandler(req);

    // Create profile
    try {
      req.body.id = protoDTO.id;
      await profileController.handlers.create(req);
    } catch (e) {
      const message = `Error creating 'profile #${req.body.id}': ${e.message}`;
      console.log(message);
      protoDTO.message = message;
    }

    // Auth
    const { accessToken, refreshToken } = TokenService.generateTokens(
      protoDTO.id,
      email
    );

    const response = { data: protoDTO, refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;

    // Update user with additional data
    try {
      await db.update({
        model,
        query: { id: protoDTO.id },
        values: { refreshTokens: [refreshToken] },
      });
    } catch (e) {
      const message = `Error updating 'user #${protoDTO.id}' with token: ${e.message}`;
      console.log(message);
      protoDTO.message = `${protoDTO.message || ""} ${message}`.trim();
    }

    // Send verification email
    console.log("verificationCode", req.body.verificationCode);

    res.cookie(...TokenService.getAccessCookie(accessToken));
    return response;
  };
}

function DeleteHandler() {
  return async (req) => {
    checkWriteAccess(req);

    // Change email to keep it unique because entity is not deleted physically
    const id = req.query.id;
    const user = await getUser(id);
    const newFormatEmail = `#${id} ${user.email}`;

    const response = await db.update({
      model,
      query: { id },
      values: {
        deletedAt: new Date(),
        email: newFormatEmail,
        refreshTokens: [],
      },
    });
    const userDTO = new DeleteDTO(response);

    // Delete profile
    try {
      await profileController.handlers.delete(req);
    } catch (e) {
      const message = `Error deleting 'profile #${id}': ${e.message}`;
      console.log(message);
      userDTO.message = message;
    }

    return userDTO;
  };
}

function FindOneHandler(protoHandler) {
  return async (req) => {
    checkReadAccess(req);
    return await protoHandler(req);
  };
}

function FindManyHandler(protoHandler) {
  return async (req) => {
    [
      // fields prohibited for search
      "createdAt",
      "updatedAt",
      "deletedAt",
      "lastVisitAt",
      "password",
      "isEmailVerified",
      "isCookieAccepted",
      "isAdmin",
      "refreshTokens",
      "passwordRestoreCode",
      "verificationCode",
    ].forEach((f) => delete req.query[f]);

    return await protoHandler(req);
  };
}

function ChangeEmailHandler(protoHandler) {
  return async (req, res) => {
    checkWriteAccess(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(Message.validation(errors));

    const { id } = req.query;
    const { email } = req.body;

    await checkUserExists(email);

    const { accessToken, refreshToken } = TokenService.generateTokens(
      id,
      email
    );

    const verificationCode = getRandomId(40);

    req.body = {
      email,
      refreshTokens: [refreshToken],
      isEmailVerified: false,
      verificationCode,
    };
    const protoDTO = await protoHandler(req);

    const response = { data: protoDTO, refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;

    // send email
    console.log("verificationCode", verificationCode);

    res.cookie(...TokenService.getAccessCookie(accessToken));
    return response;
  };
}

function VerifyEmailHandler() {
  return async (req) => {
    const { code } = req.body;
    if (typeof code !== "string" || !code)
      throw ApiError.badRequest(Message.incorrect("code", "string"));

    const response = await db.update({
      model,
      query: { verificationCode: code },
      equal: true,
      values: { verificationCode: "", isEmailVerified: true },
    });
    if (!response) throw ApiError.badRequest("Incorrect code");

    return { message: "Email successfully verified" };
  };
}

function ChangePasswordHandler(protoHandler) {
  return async (req, res) => {
    checkWriteAccess(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(Message.validation(errors));

    const id = req.query.id;
    const user = await getUser(id, ["email", "password"]);

    const { oldPassword, newPassword } = req.body;
    const comparePassword = bcrypt.compareSync(
      oldPassword || "",
      user.password
    );
    if (!comparePassword) throw ApiError.badRequest("Incorrect old password");

    const { accessToken, refreshToken } = TokenService.generateTokens(
      id,
      user.email
    );

    req.body = {
      password: await bcrypt.hash(newPassword, HASH_SALT),
      refreshTokens: [refreshToken],
    };

    const protoDTO = await protoHandler(req);
    protoDTO.message = "Password has been successfully updated";

    const response = { data: protoDTO, refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;

    res.cookie(...TokenService.getAccessCookie(accessToken));
    return response;
  };
}

function RestorePasswordHandler() {
  return async (req) => {
    const { email } = req.body;
    if (!email) throw ApiError.badRequest("Email required");

    const passwordRestoreCode = getRandomId(50);

    const response = await db.update({
      model,
      query: { email, deletedAt: null },
      equal: true,
      values: { passwordRestoreCode },
    });

    if (response) {
      // send email
      console.log(
        `Sending reset instructions to ${email} with link ${passwordRestoreCode}`
      );
    }

    return { message: "Instructions have been sent to an email" }; // send anyway
  };
}

function RestorePasswordConfirmHandler() {
  return async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(Message.validation(errors));

    const { code, newPassword } = req.body;
    if (typeof code !== "string" || !code)
      throw ApiError.badRequest(Message.incorrect("code", "string"));

    const response = await db.update({
      model,
      query: { passwordRestoreCode: code, deletedAt: null },
      equal: true,
      values: {
        password: await bcrypt.hash(newPassword, HASH_SALT),
        passwordRestoreCode: "",
        refreshTokens: [],
      },
    });
    if (!response) throw ApiError.badRequest("Incorrect code");

    return { message: "New password has been successfully set" };
  };
}

function LoginHandler() {
  const REQUIRED_CREDENTIALS_ERROR = ApiError.badRequest(
    "Email and password required"
  );
  const INCORRECT_CREDENTIALS_ERROR = ApiError.badRequest(
    "Incorrect email or password"
  );

  return async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw REQUIRED_CREDENTIALS_ERROR;

    // Check credentials
    const user = await db.findOne({
      model,
      query: {
        email,
        deletedAt: null,
        columns: ["id", "password", "refreshTokens"],
      },
      equal: true,
    });
    if (!user) throw INCORRECT_CREDENTIALS_ERROR;

    const comparePassword = bcrypt.compareSync(password || "", user.password);
    if (!comparePassword) throw INCORRECT_CREDENTIALS_ERROR;

    // Delete expired refresh tokens from DB
    const nonExpiredRefreshTokens = (user.refreshTokens || []).filter(
      (token) => {
        try {
          const validatedToken = TokenService.validateRefreshToken(token);
          return validatedToken.isValid && !validatedToken.isExpired;
        } catch (e) {
          return false;
        }
      }
    );

    // Handle response
    const { accessToken, refreshToken } = TokenService.generateTokens(
      user.id,
      email
    );
    nonExpiredRefreshTokens.push(refreshToken);

    const updateResponse = await db.update({
      model,
      query: { id: user.id },
      values: {
        lastVisitAt: new Date(),
        refreshTokens: nonExpiredRefreshTokens,
      },
    });

    const response = { data: new GetDTO(updateResponse), refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;

    res.cookie(...TokenService.getAccessCookie(accessToken));
    return response;
  };
}

function LogoutHandler() {
  return async (req, res) => {
    checkWriteAccess(req);

    const isCloseSession = toBoolean(
      req.query.closeSession || req.body.closeSession
    );
    if (isCloseSession) {
      await db.update({
        model,
        query: { id: req.user.id },
        values: { refreshTokens: [] },
      });
    }

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    return { message: "Successfully logged out" };
  };
}

function RefreshHandler() {
  // 1. Токен недействительный - вернуть ошибку
  // 2. Токен действительный, но в БД отсутствует - удалить все токены в БД и вернуть ошибку
  // 3. Токен действительный, но просроченный - удалить этот токен из БД и вернуть ошибку
  // 4. Токен действительный, непросроченный, в БД присутствует - заменить старый токен в БД на новый

  const REQUIRED_TOKEN_ERROR = ApiError.unauthorized(
    "Authorization token was not provided"
  );
  const INVALID_TOKEN_ERROR = ApiError.unauthorized("Invalid token");
  const USER_NOT_FOUND_ERROR = ApiError.unauthorized("User not found");

  return async (req, res) => {
    const token = req.body.refreshToken;
    if (!token) throw REQUIRED_TOKEN_ERROR;

    const { isValid, isExpired, data } =
      TokenService.validateRefreshToken(token);
    const id = Number(data?.user_id);
    const email = data?.email;

    if (!isValid || !id || !email) throw INVALID_TOKEN_ERROR;

    const user = await db.findOne({
      model,
      query: { id, email, deletedAt: null, columns: "refreshTokens" },
      equal: true,
    });
    if (!user) throw USER_NOT_FOUND_ERROR;

    const existingTokens = user.refreshTokens || [];
    let newTokens = existingTokens.filter((t) => t !== token);

    const { accessToken, refreshToken } = TokenService.generateTokens(
      id,
      email
    );
    let isError = false;

    if (isExpired) isError = true; // уже отфильтровано
    else {
      if (!existingTokens.includes(token)) {
        newTokens = [];
        isError = true;
      } else {
        newTokens.push(refreshToken);
      }
    }

    await db.update({
      model,
      query: { id },
      values: { refreshTokens: newTokens || [], lastVisitAt: new Date() },
    });

    if (isError) throw INVALID_TOKEN_ERROR;

    const response = { message: "Token has been refreshed", refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;

    res.cookie(...TokenService.getAccessCookie(accessToken));
    return response;
  };
}

function AcceptCookiesHandler(protoHandler) {
  return async (req) => {
    checkWriteAccess(req);
    req.body = { isCookieAccepted: true };
    return await protoHandler(req);
  };
}
