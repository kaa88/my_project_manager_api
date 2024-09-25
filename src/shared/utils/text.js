export const shortenText = (string = "", length = 50) => {
  const suffix = "...";

  if (typeof string !== "string" || typeof length !== "number") return "";

  const trimmed = string.trim();
  if (trimmed.length > length) return trimmed.substring(0, length) + suffix;
  else return trimmed;
};
