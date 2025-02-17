import { WebSocket as NodeWebSocket } from 'ws';
import { logger } from '../util/logger'

let WebSocket: typeof NodeWebSocket | typeof window.WebSocket;

if (typeof window === 'undefined') {
    // 在 Node.js 环境中使用 'ws' 模块
    WebSocket = NodeWebSocket;
} else {
    // 在浏览器环境中使用全局的 WebSocket
    WebSocket = window.WebSocket;
}

let heartbeatInterval: NodeJS.Timeout;



export class WebSocketClient {
    private socket;
    private heartbeatInterval: NodeJS.Timeout | null = null;

    constructor(url: string = "ws://localhost:8765") {
        this.socket = new WebSocket(url);
        this.initialize();
    }

    private initialize() {
        this.socket.onopen = (event: Event) => {
            logger.info('WebSocket is open now.');
            this.startHeartbeat();
        };

        this.socket.onmessage = (event: MessageEvent) => {
            logger.debug('Message from server: ', event.data);
            if (event.data === 'pong') {
                logger.info('Received pong from server');
            }
            
        };

        this.socket.onclose = (event: CloseEvent) => {
            logger.info('WebSocket is closed now.');
            this.stopHeartbeat();
        };

        this.socket.onerror = (error: Event) => {
            logger.error('WebSocket error: ', error);
        };
    }

    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            logger.info('Sending ping to server');
            this.socket.send('ping');
        }, 30000); // 每 30 秒发送一次 ping
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    public sendMessage(message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(message);
                resolve();
            } else {
                reject(new Error('WebSocket is not open. Cannot send message.'));
            }
        });
    }

    public send(data: object): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket.readyState === WebSocket.OPEN) {
                const jsonString = JSON.stringify(data);
                this.socket.send(jsonString);
                resolve();
            } else {
                reject(new Error('WebSocket is not open. Cannot send message.'));
            }
        });
    }

    public close(): void {
        this.socket.close();
    }
}

