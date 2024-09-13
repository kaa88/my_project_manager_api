import { ApiError, Message } from "../error/index.js";
import { toNumber } from "../../shared/utils/utils.js";

export const parsePeriod = (str) => {
  if (typeof str !== "string")
    throw ApiError.internal(Message.incorrect("str", "string"));

  const split = str.replace(/([a-z])/i, ",$1").split(",");
  const num = toNumber(split[0]) || 1;
  const p = (split[1] || "").toLowerCase();

  switch (p) {
    case "d":
      return 1000 * 60 * 60 * 24 * num;
    case "h":
      return 1000 * 60 * 60 * num;
    case "m":
      return 1000 * 60 * num;
    case "s":
      return 1000 * num;
    default:
      return num;
  }
};
