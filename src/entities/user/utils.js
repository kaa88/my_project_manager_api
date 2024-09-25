import { ApiError, Message } from "../../services/error/index.js";
import { getIdsFromQuery } from "../../shared/utils/idsFromQuery.js";

export const checkReadAccess = (req) => {
  const { id } = getIdsFromQuery(["id"], req.query);
  if (id !== req.user.id) throw ApiError.forbidden(Message.forbidden());
};

export const checkWriteAccess = checkReadAccess;
