import { BasicRouter } from "../../shared/entities/basic/router.js";
import { controller } from "./controller.js";

import authMiddleware from "../../services/auth/middleware.js";
import nullValueMiddleware from "../../services/nullValueMiddleware.js";

const middlewares = [authMiddleware, nullValueMiddleware];

const router = new BasicRouter({ controller, omit: ["create", "delete"] }); // create/delete via 'user' controller

router.post("/upload_image", ...middlewares, controller.addPhoto);

export default router;
