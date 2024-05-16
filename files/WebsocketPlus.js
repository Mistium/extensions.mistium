// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
(function(Scratch) {
    class WebSocketServer {
        constructor(runtime) {
            this.runtime = runtime;
            this.wsServers = {};
            this.messageQueue = {};
            this.connectedServers = {};
            this.newMessages = {};
        }

        getInfo() {
            return {
                id: 'webSocketPlus',
                name: 'WebSocketPlus',
                color1: '#FF5722',
                blocks: [
                    {
                        opcode: 'connect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'connect to server [URL] on port [PORT]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'localhost' },
                            PORT: { type: Scratch.ArgumentType.STRING, defaultValue: '8080' }
                        }
                    },
                    {
                        opcode: 'connectSecure',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'connect to secure server [URL] on port [PORT]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo.websocket.org' },
                            PORT: { type: Scratch.ArgumentType.STRING, defaultValue: '443' }
                        }
                    },
                    {
                        opcode: 'send',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send [MESSAGE] to server [SERVER]',
                        arguments: {
                            MESSAGE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello, Server!' },
                            SERVER: { type: Scratch.ArgumentType.STRING, defaultValue: 'server1' }
                        }
                    },
                    {
                        opcode: 'getNextMessage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get next message from server [SERVER]',
                        arguments: {
                            SERVER: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo.websocket.org:443' }
                        }
                    },
                    {
                        opcode: 'discardNextMessage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'discard next message from server [SERVER]',
                        arguments: {
                            SERVER: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo.websocket.org:443' }
                        }
                    },
                    {
                        opcode: 'isConnected',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'server [SERVER] connected?',
                        arguments: {
                            SERVER: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo.websocket.org:443' }
                        }
                    },
                    {
                        opcode: 'getConnectedServers',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get connected servers'
                    },
                    {
                        opcode: 'hasNewMessages',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'new messages from server [SERVER]?',
                        arguments: {
                            SERVER: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo.websocket.org:443' }
                        }
                    },
                    {
                        opcode: 'getAllMessages',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get all messages from server [SERVER]',
                        arguments: {
                            SERVER: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo.websocket.org:443' }
                        }
                    },
                    {
                        opcode: 'disconnectFromServer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'disconnect from server [SERVER]',
                        arguments: {
                            SERVER: { type: Scratch.ArgumentType.STRING, defaultValue: 'server1' }
                        }
                    }
                ]
            };
        }

        connect({ URL, PORT }) {
            const serverId = `${URL}:${PORT}`;
            if (!this.wsServers[serverId]) {
                const ws = new WebSocket(`ws://${URL}:${PORT}`);
                this.setupWebSocketHandlers(serverId, ws);
            }
        }

        connectSecure({ URL, PORT }) {
            const serverId = `${URL}:${PORT}`;
            if (!this.wsServers[serverId]) {
                const ws = new WebSocket(`wss://${URL}:${PORT}`);
                this.setupWebSocketHandlers(serverId, ws);
            }
        }

        setupWebSocketHandlers(serverId, ws) {
            ws.onopen = () => {
                console.log(`Connected to ${serverId}`);
                this.wsServers[serverId] = ws;
                this.connectedServers[serverId] = true;
            };
            ws.onmessage = (event) => {
                if (!this.messageQueue[serverId]) {
                    this.messageQueue[serverId] = [];
                }
                this.messageQueue[serverId].push(event.data);
                this.newMessages[serverId] = true;
            };
            ws.onerror = (error) => {
                console.error(`WebSocket error on ${serverId}:`, error);
            };
            ws.onclose = () => {
                console.log(`Connection closed to ${serverId}`);
                delete this.wsServers[serverId];
                delete this.connectedServers[serverId];
            };
        }

        send({ MESSAGE, SERVER }) {
            const ws = this.wsServers[SERVER];
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(MESSAGE);
            }
        }

        getNextMessage({ SERVER }) {
            const queue = this.messageQueue[SERVER];
            if (queue && queue.length > 0) {
                return queue[0];
            }
            return '';
        }

        discardNextMessage({ SERVER }) {
            const queue = this.messageQueue[SERVER];
            if (queue && queue.length > 0) {
                queue.shift();
            }
        }

        isConnected({ SERVER }) {
            return this.connectedServers[SERVER] || false;
        }

        getConnectedServers() {
            return Object.keys(this.connectedServers);
        }

        hasNewMessages({ SERVER }) {
            return this.newMessages[SERVER] || false;
        }
      
        getAllMessages({ SERVER }) {
            const queue = this.messageQueue[SERVER] || [];
            return queue;
        }

        disconnectFromServer({ SERVER }) {
            const ws = this.wsServers[SERVER];
            if (ws) {
                ws.close();
                delete this.wsServers[SERVER];
                delete this.messageQueue[SERVER];
                delete this.connectedServers[SERVER];
                delete this.newMessages[SERVER];
            }
        }
    }

    Scratch.extensions.register(new WebSocketServer());
})(Scratch);
