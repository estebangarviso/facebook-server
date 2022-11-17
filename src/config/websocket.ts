import http from "http";
import https from "https";
// Max Socket Connections
http.globalAgent.maxSockets =
  Number(process.env.MAX_SOCKETS) > 0
    ? Number(process.env.MAX_SOCKETS)
    : Infinity;
https.globalAgent.maxSockets =
  Number(process.env.MAX_SOCKETS) > 0
    ? Number(process.env.MAX_SOCKETS)
    : Infinity;
