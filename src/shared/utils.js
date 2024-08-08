export const isArray = (x) => Array.isArray(x);

export const isObject = (x) => typeof x === "object" && !Array.isArray(x);

export const isObjectEmpty = (obj) => {
  if (isObject(obj)) {
    for (let prop in obj) {
      if (Object.hasOwn(obj, prop)) return false;
    }
  }
  return true;
};

export const isDate = (x) =>
  (typeof x === "string" || typeof x === "number") &&
  !isNaN(new Date(x).getTime());

export const toNumber = (x) => {
  const num = Number(x);
  return isNaN(num) ? 0 : num;
};

export const shortenText = (string = "", length = 50) => {
  const suffix = "...";

  if (typeof string !== "string" || typeof length !== "number") return suffix;

  const trimmed = string.trim();
  if (trimmed.length > length) return trimmed.substring(0, length) + suffix;
  else return trimmed;
};
