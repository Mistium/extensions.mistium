// Made by @mistium on discord,
// this extension is for originOS :P
// Thanks for using my extension :D
// version 3.2

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  async function sendMessage(serverID, MESSAGE) {
    const ws = serverID;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(MESSAGE);
    }
  }

  const Cast = Scratch.Cast;

  class WebSocketServer {
    constructor() {
      this.runtime = Scratch.vm.runtime;
      this.wsServers = {};
      this.messageQueue = {};
      this.connectedServers = {};
      this.lastFrom = "";
      this.lastDisconnect = "";
    }

    getInfo() {
      return {
        id: 'webSocketPlus',
        name: 'WebSocketPlus',
        color1: '#FF5722',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: "main connection system"
          },
          {
            opcode: 'connectSecure',
            blockType: Scratch.BlockType.REPORTER,
            text: 'connect to secure server [URL] on port [PORT]',
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'wss://echo.websocket.org' },
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
          },
          {
            opcode: 'disconnectall',
            blockType: Scratch.BlockType.COMMAND,
            text: 'disconnect all connections'
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "random utils"
          },
          {
            opcode: 'generateRandomId',
            blockType: Scratch.BlockType.REPORTER,
            text: 'generate random id'
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "cloudlink functions"
          },
          {
            opcode: 'sendHandshake',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send handshake on connection: [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          {
            opcode: 'setusername',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set username to [USERNAME] on connection: [ID]',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Username',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          {
            opcode: 'linkrooms',
            blockType: Scratch.BlockType.COMMAND,
            text: 'link rooms [ROOMS] on connection: [ID]',
            arguments: {
              ROOMS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["room1"]',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          {
            opcode: 'sendMessageCloudlink',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send message [MESSAGE] to [TO] on connection: [ID]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello!',
              },
              TO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Username',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
              }
            }
          },
          {
            opcode: 'recievedMessage',
            blockType: Scratch.BlockType.EVENT,
            text: 'when i receive message',
            isEdgeActivated: false,
          },
          {
            opcode: 'receivedFrom',
            blockType: Scratch.BlockType.REPORTER,
            text: 'received last message from',
          },
          {
            opcode: 'whenDisconnected',
            blockType: Scratch.BlockType.EVENT,
            text: 'when any websocket disconnects',
            isEdgeActivated: false,
          },
          {
            opcode: 'lastDisconnected',
            blockType: Scratch.BlockType.REPORTER,
            text: 'most recent disconnect',
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
        URL = Cast.toString(URL);
        PORT = Cast.toString(PORT);
        let prepend = URL.startsWith("wss://") || URL.startsWith("ws://") ? "" : "wss://";
        const ws = new WebSocket(prepend+`${URL}:${PORT}`);
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
        this.runtime.startHats('webSocketPlus_recievedMessage');
        this.lastFrom = serverId
      };
      ws.onerror = (error) => {
        console.error(`WebSocket error on ${serverId}:`, error);
      };
      ws.onclose = () => {
        this.lastDisconnect = serverId
        delete this.wsServers[serverId];
        delete this.connectedServers[serverId];
      };
    }

    recievedMessage() { return ""; }

    whenDisconnected() { return ""; }

    lastDisconnected() {
      return this.lastDisconnect;
    }
    
    receivedFrom() {
      return this.lastFrom;
    }

    send({ MESSAGE, ID }) {
      sendMessage(this.wsServers[Cast.toString(ID)], Cast.toString(MESSAGE));
    }

    getNextMessage({ ID }) {
      const queue = this.messageQueue[Cast.toString(ID)];
      if (queue && queue.length > 0) {
        return queue[0];
      }
      return '';
    }

    discardNextMessage({ ID }) {
      const queue = this.messageQueue[Cast.toString(ID)];
      if (queue && queue.length > 0) {
        queue.shift();
      }
    }

    isConnected({ ID }) {
      return this.connectedServers[Cast.toString(ID)] || false;
    }

    getConnectedConnections() {
      return JSON.stringify(Object.keys(this.connectedServers));
    }

    hasNewMessages({ ID }) {
      const queue = this.messageQueue[Cast.toString(ID)];
      return queue && queue.length > 0;
    }

    getAllMessages({ ID }) {
      const queue = JSON.stringify(this.messageQueue[Cast.toString(ID)] || []);
      return queue;
    }

    disconnectFromConnection({ ID }) {
      const ws = this.wsServers[Cast.toString(ID)];
      if (ws) {
        ws.close();
        delete this.wsServers[Cast.toString(ID)];
        delete this.messageQueue[Cast.toString(ID)];
        delete this.connectedServers[Cast.toString(ID)];
      }
    }

    disconnectall() {
      for (const id in this.wsServers) {
        this.disconnectFromConnection({ ID: id });
      }
    }

    sendHandshake({ ID }) {
      let msg = {
        "cmd": "handshake",
        "val": {
          "language": "Scratch",
          "version": {
            "editorType": "Scratch",
            "versionNumber": "0.1.3"
          }
        },
        "listener": "handshake_cfg"
      };
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }

    setusername({ USERNAME, ID }) {
      let msg = {
        "cmd": "setid",
        "val": Cast.toString(USERNAME),
        "listener": "username_cfg"
      };
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }

    linkrooms({ ROOMS, ID }) {
      let msg = {
        "cmd": "link",
        "val": Cast.toString(ROOMS),
        "listener": "link"
      };
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }

    sendMessageCloudlink({ ID, MESSAGE, TO }) {
      let msg = {
        "cmd": "pmsg",
        "val": Cast.toString(MESSAGE),
        "id": Cast.toString(TO)
      };
      sendMessage(this.wsServers[Cast.toString(ID)], JSON.stringify(msg));
    }
  }

  Scratch.extensions.register(new WebSocketServer());
})(Scratch);
