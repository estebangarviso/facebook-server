"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const utils_1 = require("../utils");
const config_1 = require("../config");
// Creating a new websocket server
const InitializedWebSocketServer = (server) => {
    const wss = new ws_1.default.Server({
        server
    });
    utils_1.Logger.success('Websocket server is running');
    // Creating connection using websocket
    wss.on('connection', (socket, req) => {
        let clientId = req.url && req.url.includes('clientId') && req.url.split('clientId=')[1];
        if (!clientId) {
            socket.close();
            throw new Error('Client id is not defined');
        }
        socket.clientId = clientId;
        utils_1.Logger.log(`Client ${clientId} connected`);
        // sending message
        socket.on('message', (data) => {
            //client.send(data)
            const stringData = data.toString();
            console.log('Received message from client: ' + stringData);
            try {
                const json = JSON.parse(stringData);
                if (json.key == config_1.WEBSOCKET_SERVER_KEY) {
                    wss.clients.forEach((client) => {
                        utils_1.Logger.log('client id: ' + client.clientId);
                        if (json.clients == 'ALL') {
                            utils_1.Logger.log(`Data to client ${client.clientId}`);
                            client.send(data);
                        }
                        else if (json.clients && json.clients.length > 0 && json.clients.includes(client.clientId)) {
                            client.send(data);
                        }
                    });
                }
            }
            catch (error) {
                utils_1.Logger.error(error);
            }
        });
        // handling what to do when clients disconnects from server
        socket.on('close', () => {
            utils_1.Logger.log(`Client ${clientId} disconnected`);
        });
        // handling client connection error
        socket.onerror = function (event) {
            utils_1.Logger.error(event);
        };
    });
    return wss;
};
exports.default = InitializedWebSocketServer;
