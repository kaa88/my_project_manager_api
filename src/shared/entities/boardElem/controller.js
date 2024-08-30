import { isObject } from "../../utils/utils.js";
import { BasicController } from "../basic/controller.js";
import { BoardElemHandlers } from "./handlers.js";

export class BoardElemController extends BasicController {
  constructor(options) {
    super();
    if (isObject(options)) {
      this.handlers = new BoardElemHandlers(options);
      this.createControllsFromHandlers();
    }
  }
}
