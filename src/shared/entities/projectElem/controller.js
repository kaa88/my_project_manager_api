import { isObject } from "../../utils/utils.js";
import { BasicController } from "../basic/controller.js";
import { ProjectElemHandlers } from "./handlers.js";

export class ProjectElemController extends BasicController {
  constructor(options) {
    super();
    if (isObject(options)) {
      this.handlers = new ProjectElemHandlers(options);
      this.createControllsFromHandlers();
    }
  }
}
