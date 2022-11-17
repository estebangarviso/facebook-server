import WebSocket from "ws";
import { WEBSOCKET_SERVER_URL, WEBSOCKET_SERVER_KEY } from "../config";

/**
 * Send websocket message to clients
 */
function sendWebSocketMessage(
  data: {
    type: string;
    payload: any;
  },
  clients?: string[]
) {
  try {
    const ws = new WebSocket(`${WEBSOCKET_SERVER_URL}?clientId=SERVER`);
    ws.addEventListener("open", () => {
      try {
        const dataObject = {
          key: WEBSOCKET_SERVER_KEY,
          data,
          clients: clients ?? "ALL",
        };
        ws.send(JSON.stringify(dataObject));
        ws.close();
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export default sendWebSocketMessage;
