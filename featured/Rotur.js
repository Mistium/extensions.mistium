class RoturExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.ws = null;
    this.client = {};
    this.packets = {};
    this.my_client = {
      "system": "rotur.js",
      "version": "v2"
    };
    this.username = "test";
    this.designation = "rtr";
  }

  getInfo() {
    return {
      id: 'roturEXT',
      name: 'RoturV1',
      color1: '#403041',
      blocks: [
        {
          opcode: 'connectToServer',
          blockType: Scratch.BlockType.COMMAND,
          text: 'connect to server as [DESIGNATION] - [USERNAME]',
          arguments: {
            DESIGNATION: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'rtr'
            },
            USERNAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'test'
            }
          }
        },
        {
          opcode: 'disconnect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'disconnect from server'
        },
        {
          opcode: 'connected',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'connected to server'
        },
        "---",
        {
          opcode: 'sendMessage',
          blockType: Scratch.BlockType.COMMAND,
          text: 'send message [PAYLOAD] to user [USER] on target: [TARGET] from source: [SOURCE]',
          arguments: {
            PAYLOAD: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Hello'
            },
            USER: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'targetUser'
            },
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'target'
            },
            SOURCE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'source'
            }
          }
        },
        {
          opcode: 'getPacketsFromTarget',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get packets from [TARGET]',
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'target'
            }
          }
        },
        {
          opcode: 'numberOfPacketsOnTarget',
          blockType: Scratch.BlockType.REPORTER,
          text: 'number of packets on target [TARGET]',
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'target'
            }
          }
        },
        {
          opcode: 'getAllTargets',
          blockType: Scratch.BlockType.REPORTER,
          text: 'All Open Targets'
        },
        {
          opcode: 'getAllPackets',
          blockType: Scratch.BlockType.REPORTER,
          text: 'All Packets'
        },
        {
          opcode: 'deleteFirstPacketOnTarget',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Pop first of target [TARGET]',
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'target'
            }
          }
        },
        {
          opcode: 'deletePacketsOnTarget',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Delete All Packets On Target [TARGET]',
          arguments: {
            TARGET: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'target'
            }
          }
        },
        {
          opcode: 'deleteAllPackets',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Delete All Packets'
        },
        "---",
        {
          opcode: 'clientIP',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Client IP'
        },
        {
          opcode: 'clientUsername',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Client Username'
        },
        {
          opcode: 'clientUsers',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Client Users'
        }
      ]
    };
  }

  connectToServer() {
    this.ws = new WebSocket("wss://rotur.mistium.com");
    this.ws.onopen = () => {
      console.log("Connected!");
      this.sendHandshake();

      this.ws.onmessage = (event) => {
        let packet = JSON.parse(event.data);
        if (packet.cmd == "client_ip") {
          this.client.ip = packet.val;
        } else if (packet.cmd == "client_obj") {
          this.client.username = packet.val.username;
        } else if (packet.cmd == "ulist") {
          if (packet.mode == "add") {
            this.client.users.push(packet.val);
          } else if (packet.mode == "remove") {
            this.client.users = this.client.users.filter(user => user != packet.val);
          } else if (packet.mode == "set") {
            this.client.users = packet.val;
          }
        }
        if (packet.cmd == "pmsg") {
          packet.origin = packet.origin.username;
          delete packet.rooms
          delete packet.cmd
          packet.client = packet.val.client
          packet.source = packet.val.source
          packet.payload = packet.val.payload
          packet.timestamp = packet.val.timestamp
          if (!this.packets[packet.target]) {
            this.packets[packet.val.target] = []
          }
          this.packets[packet.val.target].push(packet);
          delete packet.val
        }
        if (packet.listener == "handshake_cfg") {
          let username = this.designation + "-" + this.username;
          let msg = {
            "cmd": "setid",
            "val": username,
            "listener": "set_username_cfg"
          };

          this.ws.send(JSON.stringify(msg));
        }
        if (packet.listener == "set_username_cfg") {
          this.client.username = this.designation + "-" + this.username;
          let room = "roturTW";
          let msg = {
            "cmd": "link",
            "val": room,
            "listener": "link_cfg"
          };

          this.ws.send(JSON.stringify(msg));
        }
        if (packet.listener == "link_cfg") {
          this.client.room = packet.val;
        }
      };
    };
  }

  sendHandshake() {
    let msg = {
      "cmd": "handshake",
      "val": {
        "language": "Scratch",
        "version": {
          "editorType": "Scratch",
          "versionNumber": "3"
        }
      },
      "listener": "handshake_cfg"
    };

    this.ws.send(JSON.stringify(msg));
  }

  connected() {
    return this.ws.readyState == WebSocket.OPEN;
  }

  numberOfPacketsOnTarget(args) {
    let target = args.TARGET || "";
    return this.packets[target].length || 0;
  }

  getAllTargets() {
    return JSON.stringify(Object.keys(this.packets));
  }

  getAllPackets() {
    return JSON.stringify(this.packets);
  }

  deleteFirstPacketOnTarget(args) {
    let target = args.TARGET || "";
    if (!this.packets[target]) {
      return "[]";
    }
    let firstPacket = this.packets[target][0];
    this.packets[target].shift();
    return firstPacket;
  }

  deletePacketsOnTarget(args) {
    let user = args.TARGET || "";
    this.packets[user] = [];
  }

  deleteAllPackets() {
    this.packets = {};
  }

  sendMessage(args) {
    let payload = args.PAYLOAD || "";
    let target = args.TARGET || "";
    let source = args.SOURCE || "";
    let msg = {
      "cmd": "pmsg",
      "val": {
        "client": this.my_client,
        "target": target,
        "payload": payload,
        "source": source,
        "timestamp": Date.now()
      },
      "id": args.USER || ""
    };
    this.ws.send(JSON.stringify(msg));
  }

  getPacketsFromTarget(args) {
    let target = args.TARGET|| "";
    return JSON.stringify(this.packets[target] || []);
  }

  clientIP() {
    return this.client.ip || "";
  }

  clientUsername() {
    return this.client.username || "";
  }

  clientUsers() {
    if (!this.client.users) {
      return [];
    }
    return JSON.stringify(this.client.users.map(user => { return user.username }));
  }

  disconnect() {
    this.ws.close();
  }
}

Scratch.extensions.register(new RoturExtension());
