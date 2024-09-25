import { ApiError } from "../services/error/index.js";
import { isDate } from "../shared/utils/date.js";

export const getModelName = (model, instance) => {
  const error = ApiError.internal("Cannot find model name");

  if (!model || !instance?.query) throw error;

  const symbolKeys = Object.getOwnPropertySymbols(model);
  for (let sym of symbolKeys) {
    let name = model[sym];
    if (typeof name === "string" && instance.query[name]) return name;
  }

  throw error;
};

export const getDateRange = (dateString) => {
  const [date, time] = dateString.split("T");
  if (!isDate(date)) return [0, 0];

  let from, to;
  if (time) {
    const [hms, ms, tz] = time
      .replace(/\s/, "+")
      .replace(/([\d:]*)(\.\d{1,3})?([\+\-Z]\S*)?/, "$1,$2,$3")
      .split(",");

    const tFrom = fixTime(hms);
    const tTo = fixTime(incrementString(hms));
    from = date + "T" + tFrom + ms + tz;
    to = date + "T" + tTo + ms + tz;
  } else {
    from = date;
    to = incrementString(date);
  }

  return [from, to];
};

const incrementString = (str) => {
  const trimmed = str.replace(/\D*$/, "");
  const incremented = Number(trimmed[trimmed.length - 1]) + 1;
  return trimmed.slice(0, -1) + incremented;
};

const fixTime = (timeStr) =>
  timeStr.replace(/^(\d)$/, "0$1:00").replace(/^(\d\d):?\d?$/, "$1:00");
