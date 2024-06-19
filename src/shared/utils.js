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

export const toNumber = (x) => {
  const num = Number(x);
  return isNaN(num) ? 0 : num;
};
