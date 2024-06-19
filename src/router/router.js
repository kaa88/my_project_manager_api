import express from "express";

// import { router as userRouter } from "../features/user/router.js";
import { router as taskRouter } from "../features/task/router.js";

const mainRouter = express.Router();

// mainRouter.use("/user", userRouter);
mainRouter.use("/task", taskRouter);

export default mainRouter;
