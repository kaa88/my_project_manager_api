import { ApiError, Message } from "../services/error/index.js";
import { isArray, isObject } from "../shared/utils/utils.js";

const propsCheck = {
  model: (value) => isObject(value),
  values: (value) => typeof value === "object",
  query: (value) => isObject(value),
  customChunks: (value) => isArray(value),
};

export const checkDbQueryProps = (props) => {
  const required = [];
  const incorrect = [];
  for (let key in props) {
    if (props[key] === undefined) required.push(key);
    else if (propsCheck[key] && !propsCheck[key](props[key]))
      incorrect.push(key);
  }
  if (required.length) throw ApiError.internal(Message.required(required));
  if (incorrect.length)
    throw ApiError.internal(`Incorrect type of props: ${incorrect}`);
};
