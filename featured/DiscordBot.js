(function (Scratch) {

  class DiscordBot {
    getInfo() {
      return {
        id: 'mistiumDiscordBot',
        name: 'DiscordBot',
        description: 'A Discord bot for Scratch',
        color1: "#7289DA",
        blocks: [
          {
            opcode: 'setToken',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set token to [TOKEN]',
            arguments: {
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'token'
              }
            }
          },
          {
            opcode: 'connectToDiscord',
            blockType: Scratch.BlockType.COMMAND,
            text: 'connect to discord',
          },
          {
            opcode: 'disconnectFromDiscord',
            blockType: Scratch.BlockType.COMMAND,
            text: 'disconnect from discord',
          },
          {
            opcode: 'connected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'connected to discord',
          },
          "---",
          {
            opcode: 'sendMessage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send message [MESSAGE] to channel [CHANNEL]',
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message'
              },
              CHANNEL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'channel'
              }
            }
          },
          {
            opcode: 'deleteMessage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete message [MESSAGE_ID] in channel [CHANNEL_ID]',
            arguments: {
              MESSAGE_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message_id'
              },
              CHANNEL_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 'channel_id'
              }
            }
          },
          {
            opcode: 'sendReply',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send reply [REPLY] to message [MESSAGE_ID] in channel [CHANNEL_ID]',
            arguments: {
              REPLY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'reply'
              },
              MESSAGE_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message_id'
              },
              CHANNEL_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 'channel_id'
              }
            }
          },
          {
            opcode: 'addReaction',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add reaction [EMOJI] to message [MESSAGE_ID] in channel [CHANNEL_ID]',
            arguments: {
              EMOJI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'emoji'
              },
              MESSAGE_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message_id'
              },
              CHANNEL_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 'channel_id'
              }
            }
          },
          {
            opcode: 'removeReaction',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove reaction [EMOJI] from message [MESSAGE_ID] in channel [CHANNEL_ID]',
            arguments: {
              EMOJI: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'emoji'
              },
              MESSAGE_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message_id'
              },
              CHANNEL_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 'channel_id'
              }
            }
          },
          "---",
          {
            opcode: 'newMessage',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'new messages?',
          },
          {
            opcode: 'popMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get next message',
          },
          {
            opcode: 'totalMessages',
            blockType: Scratch.BlockType.REPORTER,
            text: 'total messages',
          },
          "---",
          {
            opcode: 'registerSlashCommand',
            blockType: Scratch.BlockType.COMMAND,
            text: 'register slash command [NAME] with description [DESCRIPTION]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'command'
              },
              DESCRIPTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'description'
              }
            }
          },
          {
            opcode: 'newInteraction',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'new interactions?',
          },
          {
            opcode: 'popInteraction',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get next interaction',
          },
          {
            opcode: 'totalInteractions',
            blockType: Scratch.BlockType.REPORTER,
            text: 'total interactions',
          },
          {
            opcode: 'replyToInteraction',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reply to interaction [INTERACTION] with [CONTENT]',
            arguments: {
              INTERACTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{interaction object}'
              },
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'content'
              }
            }
          },
          "---",
          {
            opcode: 'setStatus',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set status to [STATUS]',
            arguments: {
              STATUS: {
                menu: 'STATUS',
              }
            }
          },
          {
            opcode: 'setActivity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set activity to [TYPE] [ACTIVITY]',
            arguments: {
              TYPE: {
                menu: 'ACTIVITY_TYPE',
              },
              ACTIVITY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'activity'
              }
            }
          }
        ],
        menus: {
          ACTIVITY_TYPE: {
            acceptReporters: true,
            items: [
              { "text": "playing", "value": 0 },
              { "text": "streaming", "value": 1 },
              { "text": "listening", "value": 2 },
              { "text": "watching", "value": 3 }
            ]
          },
          STATUS: ['online', 'idle', 'dnd', 'invisible']
        }
      }
    }

    setToken({ TOKEN }) {
      this.token = Scratch.Cast.toString(TOKEN);
    }

    connectToDiscord() {
      const gatewayUrl = 'wss://gateway.discord.gg/?v=10&encoding=json';

      if (!this.token) {
        console.error('Token is not set. Cannot connect to Discord.');
        return;
      }

      this.client = new WebSocket(gatewayUrl);
      this.client.onopen = () => {
        this.client.send(JSON.stringify({
          op: 2,
          d: {
            token: this.token,
            intents: 4194303,
            properties: {
              "$os": "windows",
              "$browser": "chrome",
              "$device": Scratch.deviceType || "scratch"
            }
          }
        }));
      };

      this.client.onmessage = (message) => {
        let data;
        try {
          data = JSON.parse(message.data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          return;
        }

        if (data.t === 'READY') {
          console.log('Ready!');
          this.client_data = data.d
        }

        if (data.op === 10) {
          this.client.send(JSON.stringify({
            "op": 1,
            "d": null
          }));
        }

        if (data.t === 'MESSAGE_CREATE') {
          this.messages = this.messages || [];
          this.messages.push(JSON.stringify(data.d));
        }

        if (data.t === 'INTERACTION_CREATE') {
          this.interactions = this.interactions || [];
          this.interactions.push(JSON.stringify(data.d));
        }
      };

      this.client.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }

    disconnectFromDiscord() {
      if (!this.client || this.client.readyState === WebSocket.CLOSED) return;
      this.client.close();
    }

    connected() {
      return this.client.readyState === WebSocket.OPEN;
    }

    sendMessage({ MESSAGE, CHANNEL }) {
      CHANNEL = Scratch.Cast.toString(CHANNEL);
      MESSAGE = Scratch.Cast.toString(MESSAGE);
      fetch(`https://apps.mistium.com/send-discord-message?token=${this.token}&content=${encodeURIComponent(MESSAGE)}&channelid=${CHANNEL}`)
        .catch(error => console.error('Failed to send message:', error));
    }

    deleteMessage({ MESSAGE_ID, CHANNEL_ID }) {
      MESSAGE_ID = Scratch.Cast.toString(MESSAGE_ID);
      CHANNEL_ID = Scratch.Cast.toString(CHANNEL_ID);
      fetch(`https://apps.mistium.com/discord-delete-message?token=${this.token}&messageid=${MESSAGE_ID}&channelid=${CHANNEL_ID}`)
        .catch(error => console.error('Failed to delete message:', error));
    }

    sendReply({ REPLY, MESSAGE_ID, CHANNEL_ID }) {
      REPLY = Scratch.Cast.toString(REPLY);
      MESSAGE_ID = Scratch.Cast.toString(MESSAGE_ID);
      CHANNEL_ID = Scratch.Cast.toString(CHANNEL_ID);
      fetch(`https://apps.mistium.com/discord-send-reply?token=${this.token}&content=${encodeURIComponent(REPLY)}&messageid=${MESSAGE_ID}&channelid=${CHANNEL_ID}`)
        .catch(error => console.error('Failed to send reply:', error));
    }

    addReaction({ EMOJI, MESSAGE_ID, CHANNEL_ID }) {
      EMOJI = Scratch.Cast.toString(EMOJI);
      MESSAGE_ID = Scratch.Cast.toString(MESSAGE_ID);
      CHANNEL_ID = Scratch.Cast.toString(CHANNEL_ID)
      fetch(`https://apps.mistium.com/send-discord-reaction?token=${this.token}&emoji=${encodeURIComponent(EMOJI)}&messageid=${MESSAGE_ID}&channelid=${CHANNEL_ID}`)
        .catch(error => console.error('Failed to add reaction:', error));
    }

    removeReaction({ EMOJI, MESSAGE_ID, CHANNEL_ID }) {
      EMOJI = Scratch.Cast.toString(EMOJI);
      MESSAGE_ID = Scratch.Cast.toString(MESSAGE_ID);
      CHANNEL_ID = Scratch.Cast.toString(CHANNEL_ID)
      fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages/${MESSAGE_ID}/reactions/${encodeURIComponent(EMOJI)}/@me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bot ${this.token}`
        }
      })
    }

    newMessage() {
      if (!this.messages) return false;
      return this.messages && this.messages.length > 0;
    }

    popMessage() {
      if (!this.messages) return "";
      return this.messages.shift() ?? "";
    }

    totalMessages() {
      return this.messages ? this.messages.length : 0;
    }

    registerSlashCommand({ NAME, DESCRIPTION }) {
      NAME = Scratch.Cast.toString(NAME);
      DESCRIPTION = Scratch.Cast.toString(DESCRIPTION);

      fetch(`https://proxy.milosantos.com/turbowarpbot/registerslash.php?id=${this.client_data.application.id}&name=${encodeURIComponent(NAME)}&description=${encodeURIComponent(DESCRIPTION)}&token=${this.token}`)
        .then(response => response.json())
        .then(data => {
          if (data.id) {
            console.log(`Slash command "${NAME}" registered successfully.`);
          } else {
            console.error('Failed to register slash command:', data);
          }
        })
        .catch(error => console.error('Failed to register slash command:', error));
    }

    newInteraction() {
      if (!this.interactions) return false;
      return this.interactions && this.interactions.length > 0;
    }

    popInteraction() {
      if (!this.interactions) return "";
      return this.interactions.shift() ?? "";
    }

    totalInteractions() {
      return this.interactions ? this.interactions.length : 0;
    }

    replyToInteraction({ INTERACTION, CONTENT }) {
      try {
        CONTENT = Scratch.Cast.toString(CONTENT);
        INTERACTION = JSON.parse(Scratch.Cast.toString(INTERACTION));

        fetch(`https://apps.mistium.com/discord-reply-interaction?token=${this.token}&interaction_id=${INTERACTION.id}&interaction_token=${INTERACTION.token}&content=${encodeURIComponent(CONTENT)}`)
          .then(response => response.json())
          .then(data => {
            if (data.id) {
              console.log(`Replied to interaction ${ID} successfully.`);
            } else {
              console.error('Failed to reply to interaction:', data);
            }
          })
          .catch(error => console.error('Failed to reply to interaction:', error));
      } catch (error) {
        console.error('Failed to reply to interaction:', error);
      }
    }

    setStatus({ STATUS }) {
      STATUS = Scratch.Cast.toString(STATUS);
      if (!this.client || this.client.readyState !== WebSocket.OPEN) {
        console.error('Client is not connected.');
        return;
      }

      this.status = STATUS;
      this.client.send(JSON.stringify({
        "op": 3,
        "d": {
          "since": null,
          "activities": this.activity ? [{
            "name": this.activity[1],
            "type": +this.activity[0]
          }] : [],
          "status": this.status,
          "afk": false
        }
      }));
    }

    setActivity({ TYPE, ACTIVITY }) {
      TYPE = Scratch.Cast.toString(TYPE);
      ACTIVITY = Scratch.Cast.toString(ACTIVITY);
      if (!this.client || this.client.readyState !== WebSocket.OPEN) {
        console.error('Client is not connected.');
        return;
      }

      this.activity = [TYPE, ACTIVITY];

      this.client.send(JSON.stringify({
        "op": 3,
        "d": {
          "since": null,
          "activities": [{
            "name": this.activity[1],
            "type": +this.activity[0]
          }],
          "status": this.status || "online",
          "afk": false
        }
      }));
    }

  }

  Scratch.extensions.register(new DiscordBot());
}(Scratch));
