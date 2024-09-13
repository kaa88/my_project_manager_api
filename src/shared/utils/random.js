export const getRandomNumber = (min = 0, max = 99) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomId = (length = 10) => {
  const symbols =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += symbols[getRandomNumber(0, symbols.length - 1)];
  }
  return result;
};
