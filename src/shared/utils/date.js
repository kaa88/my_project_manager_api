export const isDate = (x) =>
  (typeof x === "string" || typeof x === "number") &&
  !isNaN(new Date(x).getTime());

export const prependZero = (str) => (str.length < 2 ? `0${str}` : str);

export const getShortDateString = (value) => {
  if (!isDate(value))
    throw new Error(
      `'${value}' is not a date. Expected at least 'YYYY-MM-DD' format or timestamp.`
    );

  const date = new Date(value);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${y}-${prependZero(m.toString())}-${prependZero(d.toString())}`;
};
