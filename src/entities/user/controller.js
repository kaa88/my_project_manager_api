import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { ApiError, Message } from "../../services/error/index.js";
import { db } from "../../db/db.js";
import { BasicController } from "../../shared/entities/basic/controller.js";
import { users as model } from "./model.js";
import { CreateDTO, DeleteDTO, Entity, GetDTO, UpdateDTO } from "./map.js";
import { TokenService } from "../../services/auth/TokenService.js";
import { getIdsFromQuery } from "../../shared/utils/idsFromQuery.js";
import { checkReadAccess, checkWriteAccess } from "./utils.js";

export const controller = new BasicController({
  model,
  entity: Entity,
  dto: {
    get: GetDTO,
    create: CreateDTO,
    update: UpdateDTO,
    delete: DeleteDTO,
  },
});

controller.handlers = {
  create: new CreateHandler(controller.handlers.create),
  update: new UpdateHandler(controller.handlers.update),
  delete: new DeleteHandler(controller.handlers.delete),
  findOne: new FindOneHandler(controller.handlers.findOne),
  findMany: controller.handlers.findMany,

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

/* Role rights
create - any
update - same user
get - same user
get many - any
*/

function CreateHandler(protoHandler) {
  return async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(`Validation failed: ${errors}`);

    const { email, password } = req.body;

    const existUser = await db.findOne({
      model,
      query: { email, deletedAt: null },
    });
    if (existUser)
      throw ApiError.badRequest(`User with email '${email}' already exists`);

    req.body.password = await bcrypt.hash(password, 5);
    req.body.lastVisitAt = new Date();
    req.body.isEmailVerified = false;
    req.body.firstName = req.body.firstName || email.split("@")[0];

    const protoDTO = await protoHandler(req);

    const { accessToken, refreshToken } = TokenService.generateTokens({
      user_id: protoDTO.id,
      email,
    });

    res.cookie(
      ...TokenService.getAccessCookie(accessToken),
      ...TokenService.getRefreshCookie(refreshToken)
    );

    // send email

    return protoDTO;
    // email: text("email").notNull().unique(),
    // password: text("password").notNull(),
    // accessToken: text("accessToken"),
    // refreshToken: text("refreshToken"),
    // lastVisitAt: timestamp("lastVisitAt").notNull().defaultNow(),
    // isEmailVerified: boolean("isEmailVerified").default(false),
    // isCookieAccepted: boolean("isCookieAccepted").default(false),
    // firstName: text("firstName"),
    // lastName: text("lastName"),
    // image: text("image"),
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

function ChangePasswordHandler(protoHandler) {
  return async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(`Validation failed: ${errors}`);

    const { id } = getIdsFromQuery(["id"], req.params);
    if (id !== req.user.id) throw ApiError.forbidden(Message.forbidden());

    const currentUser = await db.findOne({
      model,
      query: { id, deletedAt: null },
    });
    if (!currentUser) throw ApiError.notFound(Message.notFound({ id }));

    const { oldPassword, newPassword } = req.body;
    const comparePassword = bcrypt.compareSync(
      currentUser.password,
      oldPassword
    );
    if (!comparePassword) throw ApiError.badRequest("Incorrect old password");

    req.body = { password: await bcrypt.hash(newPassword, 5) };

    return await protoHandler(req);
  };
}

function RestorePasswordHandler() {
  return async (req) => {
    const { email } = req.body;
    if (!email) throw ApiError.badRequest("Email is required");

    const user = await db.findOne({ model, query: { email, deletedAt: null } });
    if (user) console.log(`sending email to ${email}`);

    // send email

    return { message: "Instructions have been sent to an email" };
  };
}

function RestorePasswordConfirmHandler(protoHandler) {
  return async (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw ApiError.badRequest(`Validation failed: ${errors}`);

    const { email, code, newPassword } = req.body; // ?

    // const currentUser = await db.findOne({
    //   model,
    //   query: { id, deletedAt: null },
    // });
    // if (!currentUser) throw ApiError.notFound(Message.notFound({ id }));

    req.body = { password: await bcrypt.hash(newPassword, 5) };

    // ???

    return await protoHandler(req);
  };
}

function LoginHandler() {
  return async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw ApiError.badRequest("Email and password are required");

    const INCORRECT_CREDENTIALS_ERROR = ApiError.badRequest(
      "Incorrect email or password"
    );

    const candidate = await db.findOne({
      model,
      query: { email, deletedAt: null },
    });
    if (!candidate) throw INCORRECT_CREDENTIALS_ERROR;

    const comparePassword = bcrypt.compareSync(candidate.password, password);
    if (!comparePassword) throw INCORRECT_CREDENTIALS_ERROR;

    const { accessToken, refreshToken } = TokenService.generateTokens({
      user_id: candidate.id,
      email,
    });

    res.cookie(
      ...TokenService.getAccessCookie(accessToken),
      ...TokenService.getRefreshCookie(refreshToken)
    );

    const response = await db.update({
      model,
      query: { email },
      values: { lastVisitAt: new Date() },
    });
    return new GetDTO(response);
  };
}

function LogoutHandler() {
  return async (req) => {
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
      model,
      query: { id, email, deletedAt: null },
    });
    if (!user) throw ApiError.notFound("User not found");

    const { accessToken, refreshToken } = TokenService.generateTokens({
      user_id: id,
      email,
    });

    res.cookie(
      ...TokenService.getAccessCookie(accessToken),
      ...TokenService.getRefreshCookie(refreshToken)
    );

    db.update({
      model,
      query: { id },
      values: { lastVisitAt: new Date() },
    });

    return { message: "Token has been refreshed" };
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
