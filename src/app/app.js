import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import router from "./router.js";

import routeErrorMiddleware from "../services/error/routeErrorMiddleware.js";
import errorMiddleware from "../services/error/errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN_BASENAME = process.env.DOMAIN_BASENAME || "";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(fileUpload());
app.use(
  DOMAIN_BASENAME + "/static",
  express.static(path.resolve(__dirname, process.env.STATIC_PATH || ""))
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(DOMAIN_BASENAME + "/api", router);

app.use(routeErrorMiddleware);
app.use(errorMiddleware);

export default app;
