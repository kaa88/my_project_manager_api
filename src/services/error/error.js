import { isArray, isObject, shortenText } from "../../shared/utils.js";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.isApiError = true;
  }
  static badRequest(message) {
    return new ApiError(400, message);
  }
  static unauthorized(message) {
    return new ApiError(401, message);
  }
  static forbidden(message) {
    return new ApiError(403, message);
  }
  static notFound(message) {
    return new ApiError(404, message);
  }
  static internal(message) {
    return new ApiError(500, message);
  }
}

export class Message {
  static required(fields = []) {
    return `Missing required fields: ${
      isArray(fields) ? fields.filter((item) => item).join(", ") : fields
    }`;
  }

  static notFound(enties) {
    if (!isObject(enties)) return "Not found";

    return `Could not find enties that match: ${Object.entries(enties)
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
}

// console.log(Message.notFound());
// console.log(
//   Message.notFound({
//     k1: "[nodemon] restarting due to changes[nodemon] restarting due to changes[nodemon] restarting due to changes[nodemon] restarting due to changes",
//     k2: 20,
//     k3: true,
//     k4: null,
//     k5: undefined,
//     k6: {
//       k1: "str",
//       k2: 20,
//       k3: true,
//       k4: null,
//       k5: undefined,
//       k6: undefined,
//       k7: "str",
//       k8: 20,
//       k9: true,
//       k10: null,
//       k11: undefined,
//       k12: undefined,
//     },
//   })
// );
