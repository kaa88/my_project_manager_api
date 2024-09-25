import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { ApiError, Message } from "../../services/error/index.js";
import { db } from "../../db/db.js";
import { BasicController } from "../../shared/entities/basic/controller.js";
import { users } from "./model.js";
import { usersInfo } from "./model.js";
import {
  CreateDTO,
  DeleteDTO,
  GetDTO,
  UpdateDTO,
  User,
  UserInfo,
} from "./map.js";
import { TokenService } from "../../services/auth/TokenService.js";
import { getIdsFromQuery } from "../../shared/utils/idsFromQuery.js";
import { checkReadAccess, checkWriteAccess } from "./utils.js";

export const controller = new BasicController({
  model: users,
  entity: User,
  dto: {
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
    get: GetDTO,
  },
});

controller.handlers = {
  create: new CreateHandler(controller.handlers.create),
  update: new UpdateHandler(controller.handlers.update),
  delete: new DeleteHandler(controller.handlers.delete),
  findOne: new FindOneHandler(controller.handlers.findOne),
  findMany: new FindManyHandler(controller.handlers.findMany),

  changePassword: new ChangePasswordHandler(controller.handlers.update),
  restorePassword: new RestorePasswordHandler(),
  restorePasswordConfirm: new RestorePasswordConfirmHandler(
    controller.handlers.update
  ),

  login: new LoginHandler(),
  logout: new LogoutHandler(),
  refresh: new RefreshHandler(),

  verifyEmail: new VerifyEmailHandler(),

  addPhoto: new AddPhotoHandler(),
};
controller.createControllsFromHandlers();

/* Access
create - any
update - same user
get - same user
get many - any user
*/

const HASH_SALT = 5;
const ADD_ACCESS_TOKEN_TO_RESPONSE = true;

function CreateHandler(protoHandler) {
  return async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(Message.validation(errors));

    const { email, password } = req.body;

    // Check if user exists
    const existUser = await db.findOne({
      model: users,
      query: { email, deletedAt: null },
    });
    if (existUser)
      throw ApiError.badRequest(`User with email '${email}' already exists`);
    //

    delete req.body.id;
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.deletedAt;

    req.body.password = await bcrypt.hash(password, HASH_SALT);
    req.body.lastVisitAt = new Date();
    req.body.isEmailVerified = false;

    const protoDTO = await protoHandler(req);

    console.log("userId", protoDTO.id);

    // Create userInfo
    req.body.firstName = req.body.firstName || email.split("@")[0];
    const userInfoResponse = await db.create({
      model: usersInfo,
      values: { ...new UserInfo(req.body), userId: protoDTO.id },
    });
    // надо делать апдейт user для добавления userInfoId ???
    //
    // const userUpdateResponse = await db.update({
    //   model: users,
    //   query: { id: protoDTO.id },
    //   values: { userInfoId: userInfoResponse.id },
    // });
    // сделать 2 сущности user и userinfo с отдельными контроллерами и роутами
    // убрать у юзера userInfoId, т.к. это будет отдельный роут
    const userResponse = await db.findOne({
      model: users,
      query: { id: protoDTO.id, with: { userInfo: true } },
    });
    console.log(userResponse);
    //

    const { accessToken, refreshToken } = TokenService.generateTokens({
      user_id: protoDTO.id,
      email,
    });

    res.cookie(...TokenService.getAccessCookie(accessToken));

    // send email

    const response = { data: protoDTO, refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;

    return response;
  };
}

function UpdateHandler(protoHandler) {
  return async (req) => {
    checkWriteAccess(req);

    delete req.body.email;
    delete req.body.password;
    delete req.body.accessToken;
    delete req.body.refreshToken;

    return await protoHandler(req);
  };
}

function DeleteHandler(protoHandler) {
  return async (req) => {
    checkWriteAccess(req);
    return await protoHandler(req);
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
    // полностью переписать без proto, т.к. другой entity и dto
    checkReadAccess(req);
    return await protoHandler(req);
  };
}

function ChangePasswordHandler(protoHandler) {
  return async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(Message.validation(errors));

    const { id } = getIdsFromQuery(["id"], req.query);
    if (id !== req.user.id) throw ApiError.forbidden(Message.forbidden());

    const currentUser = await db.findOne({
      model: users,
      query: { id, deletedAt: null },
    });
    if (!currentUser) throw ApiError.notFound(Message.notFound({ id }));

    const { oldPassword, newPassword } = req.body;
    const comparePassword = bcrypt.compareSync(
      oldPassword || "",
      currentUser.password
    );
    if (!comparePassword) throw ApiError.badRequest("Incorrect old password");

    req.body = { password: await bcrypt.hash(newPassword, HASH_SALT) };

    return await protoHandler(req);
  };
}

function RestorePasswordHandler() {
  return async (req) => {
    const { email } = req.body;
    if (!email) throw ApiError.badRequest("Email required");

    const user = await db.findOne({
      model: users,
      query: { email, deletedAt: null },
    });
    if (user) console.log(`sending email to ${email}`);

    // send email

    return { message: "Instructions have been sent to an email" };
  };
}

function RestorePasswordConfirmHandler(protoHandler) {
  return async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(Message.validation(errors));

    const { email, code, newPassword } = req.body; // ?

    // const currentUser = await db.findOne({
    //   model:users,
    //   query: { id, deletedAt: null },
    // });
    // if (!currentUser) throw ApiError.notFound(Message.notFound({ id }));

    req.body = { password: await bcrypt.hash(newPassword, HASH_SALT) };

    // ???

    return await protoHandler(req);
  };
}

function LoginHandler() {
  return async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw ApiError.badRequest("Email and password required");

    const INCORRECT_CREDENTIALS_ERROR = ApiError.badRequest(
      "Incorrect email or password"
    );

    const candidate = await db.findOne({
      model: users,
      query: { email, deletedAt: null },
    });
    if (!candidate) throw INCORRECT_CREDENTIALS_ERROR;

    const comparePassword = bcrypt.compareSync(
      password || "",
      candidate.password
    );
    if (!comparePassword) throw INCORRECT_CREDENTIALS_ERROR;

    const { accessToken, refreshToken } = TokenService.generateTokens({
      user_id: candidate.id,
      email,
    });

    res.cookie(...TokenService.getAccessCookie(accessToken));

    const dbResponse = await db.update({
      model: users,
      query: { email },
      values: { lastVisitAt: new Date() },
    });

    const response = { data: new GetDTO(dbResponse), refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;
    return response;
  };
}

function LogoutHandler() {
  return async (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return { message: "Successfully logged out" };
  };
}

function RefreshHandler() {
  return async (req, res) => {
    const token = req.cookies.refresh_token;
    if (!token)
      throw ApiError.unauthorized("Authorization token was not provided");

    const tokenData = TokenService.validateRefreshToken(token);
    if (!tokenData?.user_id) throw ApiError.unauthorized("Invalid token");

    const { id, email } = tokenData;
    const user = await db.findOne({
      model: users,
      query: { id, email, deletedAt: null },
    });
    if (!user) throw ApiError.notFound("User not found");

    const { accessToken, refreshToken } = TokenService.generateTokens({
      user_id: id,
      email,
    });

    res.cookie(...TokenService.getAccessCookie(accessToken));

    db.update({
      model: users,
      query: { id },
      values: { lastVisitAt: new Date() },
    });

    const response = { message: "Token has been refreshed", refreshToken };
    if (ADD_ACCESS_TOKEN_TO_RESPONSE) response.accessToken = accessToken;
    return response;
  };
}

function VerifyEmailHandler(protoHandler) {
  return async (req) => {
    // return await protoHandler(req);
  };
}

function AddPhotoHandler(protoHandler) {
  return async (req) => {
    // return await protoHandler(req);
  };
}
