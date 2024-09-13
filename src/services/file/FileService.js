import fs from "fs";
import { getRandomId } from "../../shared/utils/random.js";

let PATH = process.env.UPLOADS_PATH || "";
if (PATH.match(/\\/)) PATH += "\\";
else PATH += "/";

const FileService = {
  uploadUserPhoto(file) {
    if (!file || !file.name) return "";
    let fileNameParts = file.name.split(".");
    let ext = fileNameParts[fileNameParts.length - 1];
    let newFileName = `userphoto_${getRandomId(20)}.${ext}`;

    try {
      file.mv(PATH + newFileName);
    } catch (err) {
      return new Error();
    }
    return newFileName;
  },
  deleteUserPhoto(fileName) {
    if (!fileName) return;
    try {
      fs.rm(PATH + fileName, { force: true }, () => {});
    } catch (err) {
      return new Error();
    }
  },
};
export default FileService;
