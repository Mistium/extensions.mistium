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
        }

        getInfo() {
            return {
                id: 'webSocketPlus',
                name: 'WebSocketPlus',
                color1: '#FF5722',
                blocks: [
                    {
                        opcode: 'connectSecure',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'connect to secure server [URL] on port [PORT]',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'echo.websocket.org' },
                            PORT: { type: Scratch.ArgumentType.STRING, defaultValue: '443' }
                        }
                    },
                    {
                        opcode: 'send',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send [MESSAGE] to connection [ID]',
                        arguments: {
                            MESSAGE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello, Server!' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                        }
                    },
                    {
                        opcode: 'getNextMessage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get next message from connection [ID]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                        }
                    },
                    {
                        opcode: 'discardNextMessage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'discard next message from connection [ID]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                        }
                    },
                    {
                        opcode: 'isConnected',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'connection [ID] connected?',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                        }
                    },
                    {
                        opcode: 'getConnectedConnections',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get connected connections'
                    },
                    {
                        opcode: 'hasNewMessages',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'new messages from connection [ID]?',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                        }
                    },
                    {
                        opcode: 'getAllMessages',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get all messages from connection [ID]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                        }
                    },
                    {
                        opcode: 'disconnectFromConnection',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'disconnect from connection [ID]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
                        }
                    }
                ]
            };
        }

        generateRandomId() {
            return Math.random().toString(36).substr(2, 9);
        }

        connectSecure({ URL, PORT }) {
            const serverId = this.generateRandomId();
            if (!this.wsServers[serverId]) {
                const ws = new WebSocket(`wss://${URL}:${PORT}`);
                this.setupWebSocketHandlers(serverId, ws);
                return serverId;
            }
            return '';
        }

        setupWebSocketHandlers(serverId, ws) {
            ws.onopen = () => {
                this.wsServers[serverId] = ws;
                this.connectedServers[serverId] = true;
            };
            ws.onmessage = (event) => {
                if (!this.messageQueue[serverId]) {
                    this.messageQueue[serverId] = [];
                }
                this.messageQueue[serverId].push(event.data);
            };
            ws.onerror = (error) => {
                console.error(`WebSocket error on ${serverId}:`, error);
            };
            ws.onclose = () => {
                delete this.wsServers[serverId];
                delete this.connectedServers[serverId];
            };
        }

        send({ MESSAGE, ID }) {
            const ws = this.wsServers[ID];
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(MESSAGE);
            }
        }

        getNextMessage({ ID }) {
            const queue = this.messageQueue[ID];
            if (queue && queue.length > 0) {
                return queue[0];
            }
            return '';
        }

        discardNextMessage({ ID }) {
            const queue = this.messageQueue[ID];
            if (queue && queue.length > 0) {
                queue.shift();
            }
        }

        isConnected({ ID }) {
            return this.connectedServers[ID] || false;
        }

        getConnectedConnections() {
            return JSON.stringify(Object.keys(this.connectedServers));
        }

        hasNewMessages({ ID }) {
            const queue = this.messageQueue[ID];
            return queue && queue.length > 0;
        }

        getAllMessages({ ID }) {
            const queue = JSON.stringify(this.messageQueue[ID] || []);
            return queue;
        }

        disconnectFromConnection({ ID }) {
            const ws = this.wsServers[ID];
            if (ws) {
                ws.close();
                delete this.wsServers[ID];
                delete this.messageQueue[ID];
                delete this.connectedServers[ID];
            }
        }
    }

    Scratch.extensions.register(new WebSocketServer());
})(Scratch);
