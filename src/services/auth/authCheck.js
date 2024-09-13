import express from "express";
import authMiddleware from "./middleware.js";

const authCheckRouter = express.Router();

authCheckRouter.get("/", authMiddleware, (req, res) => res.json({ ok: true }));

export default authCheckRouter;

// check auth before sending a file
