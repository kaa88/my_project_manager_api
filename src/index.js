import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import db from "./db/db.js";
import router from "./router/router.js";
import errorMiddleware from "./error/errorMiddleware.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.SERVER_PORT || 5000;
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
app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
    // await db.connect().then(console.log("Database connection is OK"));
  } catch (err) {
    console.log(err);
    // await db.disconnect();
  }
};
start();

// db.set("somekey", "somevalue");
