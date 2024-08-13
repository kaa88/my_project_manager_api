import express from "express";

import boardRouter from "../entities/board/router.js";
import commentRouter from "../entities/comment/router.js";
import fileRouter from "../entities/file/router.js";
import projectRouter from "../entities/project/router.js";
import taskRouter from "../entities/task/router.js";
import taskGroupRouter from "../entities/taskGroup/router.js";
import taskListRouter from "../entities/taskList/router.js";
import teamRouter from "../entities/team/router.js";
import userRouter from "../entities/user/router.js";

const mainRouter = express.Router();

mainRouter.use("/board", boardRouter);
mainRouter.use("/comment", commentRouter);
mainRouter.use("/file", fileRouter);
mainRouter.use("/project", projectRouter);
mainRouter.use("/task", taskRouter);
mainRouter.use("/taskgroup", taskGroupRouter);
mainRouter.use("/tasklist", taskListRouter);
mainRouter.use("/team", teamRouter);
mainRouter.use("/user", userRouter);

export default mainRouter;
