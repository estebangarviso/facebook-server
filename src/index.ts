import MongoConnect from "./db";
import { buildHttpServer } from "./server";
import InitializedWebSocketServer from "./websocket-server/server";
import config from "./config";

(async () => {
  // Verify environment variables
  await config.verify;
  // Connect to MongoDB
  await MongoConnect();
  // Start HTTP server
  const server = buildHttpServer();
  // HOC websocket server
  InitializedWebSocketServer(server);
})();
