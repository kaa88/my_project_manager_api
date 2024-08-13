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

export const getSerialId = (itemsArray) => {
  if (!isArray(itemsArray)) return 1;
  return (
    itemsArray.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1
  );
};

export const shortenText = (string = "", length = 50) => {
  const suffix = "...";

  if (typeof string !== "string" || typeof length !== "number") return suffix;

  const trimmed = string.trim();
  if (trimmed.length > length) return trimmed.substring(0, length) + suffix;
  else return trimmed;
};

const prependZero = (str) => (str.length < 2 ? `0${str}` : str);

export const getShortDateString = (value) => {
  if (!isDate(value))
    throw new Error(
      `'${value}' is not a date. Expected 'YYYY-MM-DD' format or timestamp.`
    );

  const date = new Date(value);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${y}-${prependZero(m.toString())}-${prependZero(d.toString())}`;
};
