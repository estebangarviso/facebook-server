import WebSocket from 'ws';

export class WebSocketWithClientId extends WebSocket {
    _clientId: string;

    /**
     * It use to interact with websocket server from client side
     */
    get clientId() {
        return this._clientId;
    }

    set clientId(clientId: string) {
        this._clientId = clientId;
    }
}
