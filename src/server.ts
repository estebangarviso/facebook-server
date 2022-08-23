import { PORT, FRONTEND_ORIGIN, PUBLIC_DIR } from "./config";
import { Logger } from "./utils";
import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import PostRoute from "./routes/post.routes";
import UserRoute from "./routes/user.routes";
import isUnderMaintenance from "./middlewares/isUnderMaintenance";
import beforeAuthenticate from "./middlewares/beforeAuthenticate";

// Build HTTP server
export function buildHttpServer() {
  const app = express();
  // Middlewares
  if (app.get("env") === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }
  app.use(cookieParser());
  // app.use(cors({ credentials: true, origin: FRONTEND_ORIGIN }));
  const whitelist = [FRONTEND_ORIGIN];
  const corsOptions = {
    origin: function (origin: any, callback: any) {
      console.log({ origin });
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload());
  app.use(express.json());
  app.use("/", express.static(PUBLIC_DIR));
  app.set("trust proxy", true);
  app.use(isUnderMaintenance);
  app.use(beforeAuthenticate);
  // Routes
  app.use(PostRoute);
  app.use(UserRoute);
  app.get("*", (req, res) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  // Express server
  return app.listen(PORT, () => {
    Logger.success(
      `Express server is running on port ${PORT} in ${app.get("env")} mode`
    );
  });
}
