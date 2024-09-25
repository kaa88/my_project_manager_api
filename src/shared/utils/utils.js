export const isArray = (x) => Array.isArray(x);

export const isObject = (x) =>
  x !== null && typeof x === "object" && !Array.isArray(x);

export const isEmptyObject = (obj) => {
  if (!isObject(obj)) throw new Error("Value is not an Object");
  for (let prop in obj) {
    if (Object.hasOwn(obj, prop)) return false;
  }
  return true;
};

export const isNullish = (x) => ["", null].includes(x) || /^null$/i.test(x);

export const isTotallyNullish = (x) =>
  ["", null, 0, false, undefined].includes(x) ||
  /^(null|0|false|undefined)$/i.test(x);

export const isNullishData = (x) =>
  isNullish(x) ||
  (isArray(x) && !x.length) ||
  (isObject(x) && isEmptyObject(x));

export const toNumber = (x) => {
  const num = Number(x);
  return isNaN(num) ? 0 : num;
};

export const toNumberArray = (x) => {
  const arr = isArray(x) ? x : [x];
  let result = [];
  arr.forEach((item) => {
    result = result.concat(typeof item === "string" ? item.split(",") : [item]);
  });
  return result.map((item) => toNumber(item));
};

export const toNumberOrNull = (x) => (isNullish(x) ? null : toNumber(x));

export const toNumberArrayOrNull = (x) =>
  isNullish(x) ? null : toNumberArray(x);

export const toBoolean = (x) => (isTotallyNullish(x) ? false : Boolean(x));

export const getSerialId = (idArray) => {
  if (!isArray(idArray)) return 1;
  return (
    idArray.reduce((max, id) => {
      const num = toNumber(id);
      return num > max ? num : max;
    }, 0) + 1
  );
};
