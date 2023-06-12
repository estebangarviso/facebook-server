import { Server as WSServer } from 'ws';
import { env } from './../env';
import { Server as HttpServer, IncomingMessage } from 'http';
import { nanoid } from 'nanoid';
import { Logger } from './logger.service';
import { WebSocketWithClientId } from './models';
import { UnauthorizedException } from './../exceptions';

interface StateManager {
	type: string;
	payload: any;
}

interface JsonRawData {
	key: string;
	data: JSON;
	clients: string[] | 'ALL';
}

type TableLogParams = {
	id: string;
	ip?: string;
	target?: string[];
	message?: string;
};

export class Socket {
	/**
	 * Initialize socket service
	 */
	public static init(server: HttpServer) {
		this._url =
			env.URL.protocol === 'https:'
				? `wss://${env.URL.host}`
				: `ws://${env.URL.host}`;
		this._server = server;
		this._query = new URLSearchParams({
			clientId: this._key
		});
		this._socket = new WebSocketWithClientId(
			`${this._url}?${this._query.toString()}`
		);
		this.start();

		setInterval(() => {
			this._key = nanoid();
		}, 1000 * 60 * 60 * 24);
	}

	/**
	 * Emit websocket message to clients from server side
	 * @param data object to send
	 * @param clients clients to send message to
	 */
	public static emit(data: StateManager, clients?: string[]) {
		this._socket.addEventListener('open', () => {
			const dataObject = {
				key: this._key,
				data,
				clients: clients ?? 'ALL'
			};
			this._socket.send(JSON.stringify(dataObject), {
				binary: false,
				mask: true,
				compress: true,
				fin: true
			});
			this._socket.close();
		});
	}

	/**
	 * Close websocket connection
	 */
	public static close() {
		this._socket.close();
	}

	/**
	 * Creating a new websocket server and handling websocket events
	 */
	private static start() {
		const webSocketServer = new WSServer<WebSocketWithClientId>({
			server: this._server
		});
		// Creating connection using websocket
		webSocketServer.on('connection', (socket, req) => {
			const clientId = this.getClientId(req, socket);
			// sending message
			socket.on('message', (data) => {
				const stringifiedData = data.toString();
				this.tableLog(
					{
						id: clientId,
						ip: req.socket.remoteAddress,
						message: stringifiedData
					},
					'Client is trying to send'
				);
				try {
					const parsedData: JsonRawData = JSON.parse(stringifiedData);
					if (parsedData.key === this._key) {
						for (const client of webSocketServer.clients) {
							if (parsedData.clients === 'ALL') {
								client.send(data);
							} else if (
								parsedData.clients &&
								parsedData.clients.length > 0 &&
								parsedData.clients.includes(client.clientId)
							) {
								client.send(data);
							} else {
								this.tableLog(
									{
										id: clientId,
										ip: req.socket.remoteAddress,
										target: parsedData.clients,
										message: stringifiedData
									},
									'Client is trying to send to clients but it is not connected'
								);
							}
						}
					} else {
						throw new UnauthorizedException(
							'User key is not valid'
						);
					}
				} catch (error) {
					Logger.error(error);
				}
			});

			// handling what to do when clients disconnects from server
			socket.on('close', () => {
				Logger.warn(`Client ID ${clientId} disconnected`);
			});
			// handling client connection error
			socket.onerror = function (event) {
				Logger.error(`Client ID ${clientId} error:`, event);
			};
		});

		return webSocketServer;
	}

	private static getClientId(
		req: IncomingMessage,
		socket: WebSocketWithClientId
	): string {
		const url = req.url ? new URL(req.url, req.headers.origin) : undefined;
		const clientId = url?.searchParams.get('clientId');
		if (!clientId) {
			socket.close();
			throw new UnauthorizedException('Client id is not defined');
		}
		socket.clientId = clientId;

		if (clientId !== this._key) {
			this.tableLog(
				{
					id: clientId,
					ip: req.socket.remoteAddress
				},
				'Client connected'
			);
		}

		return clientId;
	}

	private static tableLog(
		{ id, ip, target, message }: TableLogParams,
		title: string
	) {
		const firstRow = ['ID', 'IP'];
		const secondRow = [id, ip];
		if (target) {
			firstRow.push('Target');
			secondRow.push(target.join(', '));
		}
		if (message) {
			firstRow.push('Message');
			secondRow.push(message);
		}
		Logger.table([firstRow, secondRow], {
			header: {
				content: title
			}
		});
	}

	private static _url: string;

	private static _query: URLSearchParams;

	private static _key: string = nanoid();

	private static _server: HttpServer;

	private static _socket: WebSocketWithClientId;
}
