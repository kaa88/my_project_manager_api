import { ApiError } from "../services/error/error.js";

export const getModelName = (model, instance) => {
  const error = ApiError.internal("Could not find model name");

  if (!model || !instance?.query) throw error;

  const symbolKeys = Object.getOwnPropertySymbols(model);
  for (let sym of symbolKeys) {
    let name = model[sym];
    if (typeof name === "string" && instance.query[name]) return name;
  }

  throw error;
};
