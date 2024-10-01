import { ApiError, Message } from "../../services/error/index.js";
import { db } from "../../db/db.js";
import { getIdsFromQuery } from "../../shared/utils/idsFromQuery.js";
import { users as model } from "./model.js";

export const checkReadAccess = (req) => {
  const { id } = getIdsFromQuery(["id"], req.query);
  if (id !== req.user.id) throw ApiError.forbidden(Message.forbidden());
};

export const checkWriteAccess = checkReadAccess;

export const checkUserExists = async (email, throwError = true) => {
  if (typeof email !== "string" || !email)
    throw ApiError.internal(Message.required("email"));

  const user = await db.findOne({
    model,
    query: { email, deletedAt: null, columns: { id: true } },
    equal: true,
  });
  if (user) {
    if (throwError)
      throw ApiError.badRequest(`User with email '${email}' already exists`);
    else return user;
  }
  return false;
};

export const getUser = async (idOrEmail, columns) => {
  let id, email;
  if (isNaN(idOrEmail)) email = idOrEmail;
  else id = Number(idOrEmail);
  if (!id && !email)
    throw ApiError.internal(
      Message.incorrect("idOrEmail", ["number", "string"])
    );

  const query = {
    deletedAt: null,
    columns: columns || ["id", "email", "refreshTokens"],
  };
  if (id) query.id = id;
  if (email) query.email = email;

  const user = await db.findOne({ model, query, equal: true });
  if (!user) throw ApiError.notFound(Message.notFound({ id, email }));

  return user;
};
