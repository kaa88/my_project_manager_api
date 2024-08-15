import { isArray, isObject, shortenText } from "../../shared/utils.js";

export class Message {
  static required(fields) {
    return `Missing required properties: ${
      isArray(fields) ? fields.filter((item) => item).join(", ") : fields
    }`;
  }

  static notFound(enties) {
    if (!isObject(enties)) return "Not found";

    return `Could not find entries that match: ${Object.entries(enties)
      .map(
        ([key, value]) =>
          `${key}=${shortenText(
            value === undefined
              ? "undefined"
              : JSON.stringify(value).replace(/"/g, ""),
            30
          )}`
      )
      .join(", ")}`;
  }

  static incorrect(key, type) {
    return `Incorrect data type of '${key}'. Expected ${
      isArray(type) ? type.filter((item) => item).join(" or ") : type
    }`;
  }

  static incorrectIds(key) {
    return Message.incorrect(key, ["number", "number[]"]);
  }
}
