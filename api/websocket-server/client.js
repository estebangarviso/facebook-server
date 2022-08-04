"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const config_1 = require("../config");
const utils_1 = require("../utils");
function sendWebSocketMessage({ data, clients }) {
    try {
        const ws = new ws_1.default(`${config_1.WEBSOCKET_SERVER_URL}?clientId=SERVER`);
        ws.addEventListener('open', () => {
            try {
                console.log('We are connected');
                const dataObject = {
                    key: config_1.WEBSOCKET_SERVER_KEY,
                    data,
                    clients: clients ?? 'ALL'
                };
                ws.send(JSON.stringify(dataObject));
                ws.close();
            }
            catch (error) {
                utils_1.Logger.error(error);
            }
        });
    }
    catch (error) {
        utils_1.Logger.error(error);
    }
}
exports.default = sendWebSocketMessage;
