// Made by @mistium on discord,
// this extension is for originOS :P
// Thanks for using my extension :D

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  function sendMessage(serverID, MESSAGE) {
    const ws = serverID;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(MESSAGE);
    }
  }

  class WebSocketServer {
    constructor(runtime) {
      this.runtime = runtime;
      this.wsServers = {};
      this.messageQueue = {};
      this.connectedServers = {};
      this.lastFrom = ""
      this.lastDisconnected = ""
    }

    getInfo() {
      return {
        id: 'webSocketPlus',
        name: 'WebSocketPlus',
        color1: '#FF5722',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Main Connection System"
          },
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
          },
          {
            opcode: 'disconnectall',
            blockType: Scratch.BlockType.COMMAND,
            text: 'disconnect all connections'
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Random Utils"
          },
          {
            opcode: 'generateRandomId',
            blockType: Scratch.BlockType.REPORTER,
            text: 'generate random id'
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Cloudlink Functions"
          },
          {
            opcode: 'sendHandshake',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Send Handshake on connection: [ID]',
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
            text: 'Set Username To [USERNAME] on connection: [ID]',
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
            text: 'Link Rooms [ROOMS] on connection: [ID]',
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
            text: 'Send Message [MESSAGE] to [TO] on connection: [ID]',
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
            text: 'When I receive message',
            isEdgeActivated: false,
          },
          {
            opcode: 'recievedFrom',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Recieved Last Message From',
          },
          {
            opcode: 'whenDisconnected',
            blockType: Scratch.BlockType.EVENT,
            text: 'When Any Websocket Disconnects',
            isEdgeActivated: false,
          },
          {
            opcode: 'lastDisconnected',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Most Recent Disconnect',
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
        Scratch.vm.runtime.startHats('webSocketPlus_recievedMessage');
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
    
    recievedMessage() {return "";}

    whenDisconnected() {return "";}
    
    lastDisconnected() {
        return this.lastDisconnect;
    }
    recievedFrom() {
        return this.lastFrom;
    }
    
    send({ MESSAGE, ID }) {
      sendMessage(this.wsServers[ID], MESSAGE);
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
      sendMessage(this.wsServers[ID], JSON.stringify(msg));
    }

    setusername({ USERNAME, ID }) {
      let msg = {
        "cmd": "setid",
        "val": USERNAME,
        "listener": "username_cfg"
      };
      sendMessage(this.wsServers[ID], JSON.stringify(msg));
    }

    linkrooms({ ROOMS, ID }) {
      let msg = {
        "cmd": "link",
        "val": ROOMS,
        "listener": "link"
      };
      sendMessage(this.wsServers[ID], JSON.stringify(msg));
    }

    sendMessageCloudlink({ ID, MESSAGE, TO }) {
      let msg = {
        "cmd": "pmsg",
        "val": MESSAGE,
        "id": TO
      };
      sendMessage(this.wsServers[ID], JSON.stringify(msg));
    }
  }

  Scratch.extensions.register(new WebSocketServer());
})(Scratch);
