import Config, { PORT, FRONTEND_ORIGIN, PUBLIC_DIR } from "./config";
// Verify configuration values
Config.verify();

import { Logger } from "./utils";
import InitializedWebSocketServer from "./websocket-server/server";
import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import PostRoute from "./routes/post.routes";
import UserRoute from "./routes/user.routes";
import isUnderMaintenance from "./middlewares/isUnderMaintenance";
import MongoConnect from "./db";

// Build HTTP server
export function buildHttpServer() {
  const app = express();
  // Middleware
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: FRONTEND_ORIGIN }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload());
  app.use(express.json());
  app.use("/", express.static(PUBLIC_DIR));
  app.set("trust proxy", true);
  app.use(isUnderMaintenance);

  // Routes
  app.use(PostRoute);
  app.use(UserRoute);
  app.get("*", (req, res) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  // Express server
  const server = app.listen(PORT, () => {
    Logger.success(
      `Express server is running on port ${PORT} in ${app.get("env")} mode`
    );
  });

  // Initialize websocket server
  function listen() {
    InitializedWebSocketServer(server);
  }

  // Connect to MongoDB
  MongoConnect(listen);
}
