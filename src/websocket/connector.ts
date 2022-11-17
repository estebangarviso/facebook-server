import WebSocketServer from "ws";
import { Server } from "http";
import { WEBSOCKET_SERVER_KEY } from "~/config";

/**
 * Creating a new websocket server and handling websocket events
 * @param server http server
 */
const applyWebsocketServer = (server: Server) => {
  const wss = new WebSocketServer.Server({
    server,
  });
  console.success("Websocket server is running");
  // Creating connection using websocket
  wss.on("connection", (socket, req) => {
    const clientId =
      req.url && req.url.includes("clientId") && req.url.split("clientId=")[1];
    if (!clientId) {
      socket.close();
      throw new Error("Client id is not defined");
    }
    socket.clientId = clientId;

    console.log(`Client ${clientId} connected`);
    // sending message
    socket.on("message", (data) => {
      //client.send(data)
      const stringData = data.toString();
      console.debug(`Client ${clientId} sent: ${stringData}`);
      try {
        const json = JSON.parse(stringData);
        if (json.key === WEBSOCKET_SERVER_KEY) {
          wss.clients.forEach((client) => {
            if (json.clients === "ALL") {
              client.send(data);
            } else if (
              json.clients &&
              json.clients.length > 0 &&
              json.clients.includes(client.clientId)
            ) {
              client.send(data);
            }
          });
        }
      } catch (error) {
        console.error(error as string);
      }
    });

    // handling what to do when clients disconnects from server
    socket.on("close", () => {
      console.info(`Client ${clientId} disconnected`);
    });
    // handling client connection error
    socket.onerror = function (event) {
      console.error(event);
    };
  });

  return wss;
};

export default applyWebsocketServer;
