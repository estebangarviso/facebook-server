import Environment, {
  NODE_ENV,
  PORT,
  FRONTEND_ORIGIN,
  PUBLIC_DIR,
} from "~/config";
import dbConnection from "~/database/mongo/connection";
import applyWebsocketServer from "~/websocket/connector";
import express, { Express } from "express";
import { Server as HTTPServer } from "http";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import applyRoutes from "./router";
import isUnderMaintenance from "~/middlewares/isUnderMaintenance";

class Server {
  private app: Express;
  private dbConnection: ReturnType<typeof dbConnection>;
  private server?: HTTPServer;

  constructor() {
    this.app = express();
    this.dbConnection = dbConnection();
    this.config();
  }

  private config() {
    // Settings
    this.app.set("trust proxy", true);

    // Middlewares
    this.app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: FRONTEND_ORIGIN,
        credentials: true,
      })
    );
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(fileUpload());
    this.app.use(express.json());
    this.app.use("/", express.static(PUBLIC_DIR));
    this.app.use(isUnderMaintenance);

    // Routes
    applyRoutes(this.app);
  }

  public async start() {
    try {
      await Environment.verify;
      await this.dbConnection.connect();
      this.server = this.app.listen(PORT, () => {
        console.success(
          `Server is running on port ${PORT} in ${this.app.get("env")} mode`
        );
      });
      applyWebsocketServer(this.server);
    } catch (error) {
      console.error(error);
    }
  }

  public async stop() {
    try {
      console.warn("Server is shutting down...");
      await this.dbConnection.disconnect();
      this.server?.close();
    } catch (error) {
      console.error(error);
    }
  }
}

const server = new Server();

export default server;
