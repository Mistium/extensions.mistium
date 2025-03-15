// Name: DiscordBot
// Author: Mistium
// Description: Make discord bots in turbowarp

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function(Scratch) {
  const API = 'https://discord.com/api/v10';
  const WS = 'wss://gateway.discord.gg/?v=10&encoding=json';
  let bot_data = null;
  
  const util = {
    s: val => Scratch.Cast.toString(val),
    log: console.log,
    err: console.error,
    limit: (arr, max) => { while (arr.length > max) arr.shift(); }
  };

  class DiscordBot {
    constructor() {
      this.token = null;
      this.client = null;
      this.messages = [];
      this.interactions = [];
      this.status = "online";
      this.activity = null;
      
      this.conn = {
        isConnecting: false,
        attempts: 0,
        maxAttempts: 10,
        reconnectTimer: null,
        heartbeatTimer: null,
        seq: null,
        sessionId: null,
        rateLimited: false,
        rateLimitReset: 0
      };
    }

    getInfo() {
      return {
        id: 'mistiumDiscordBot',
        name: 'DiscordBot',
        description: 'A Discord bot for Scratch',
        color1: "#7289DA",
        blocks: [
          // ========================
          //      Connection
          // ========================
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
          {
            opcode: 'botinfo',
            blockType: Scratch.BlockType.REPORTER,
            text: 'bot information',
          },
          
          '---',
          
          // ========================
          //       Messages
          // ========================
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
            opcode: 'getMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get message [MESSAGE_ID] from channel [CHANNEL_ID]',
            arguments: {
              MESSAGE_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message_id'
              },
              CHANNEL_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'channel_id'
              }
            }
          },
          {
            opcode: 'getChannelMessages',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get last [AMOUNT] messages from channel [CHANNEL_ID]',
            arguments: {
              AMOUNT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              CHANNEL_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'channel_id'
              }
            }
          },
          {
            opcode: 'sendDirectMessage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'DM user [USER_ID] message [MESSAGE]',
            arguments: {
              USER_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'user_id'
              },
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message'
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
                type: Scratch.ArgumentType.STRING,
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
                type: Scratch.ArgumentType.STRING,
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
                type: Scratch.ArgumentType.STRING,
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
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'channel_id'
              }
            }
          },
          
          '---',
          
          // ========================
          //     Message Queue
          // ========================
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
          
          '---',
          
          // ========================
          //       Commands
          // ========================
          {
            opcode: 'registerSlashCommand',
            blockType: Scratch.BlockType.COMMAND,
            text: 'register slash command [NAME] with description [DESCRIPTION] options [OPTIONS]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'command'
              },
              DESCRIPTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'description'
              },
              OPTIONS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[]'
              }
            }
          },
          {
            opcode: 'deleteSlashCommand',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete slash command [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'command'
              }
            }
          },
          {
            opcode: 'getAllCommands',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all commands',
          },
          
          '---',
          
          // ========================
          //    Command Options
          // ========================
          {
            opcode: 'createCommandOptions',
            blockType: Scratch.BlockType.REPORTER,
            text: 'create options list',
          },
          {
            opcode: 'addCommandOption',
            blockType: Scratch.BlockType.REPORTER,
            text: 'add [TYPE] option name [NAME] description [DESCRIPTION] required [REQUIRED] to [OPTIONS]',
            arguments: {
              TYPE: {
                menu: 'OPTION_TYPE'
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'option-name'
              },
              DESCRIPTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'option description'
              },
              REQUIRED: {
                type: Scratch.ArgumentType.BOOLEAN,
                defaultValue: false
              },
              OPTIONS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[]'
              }
            }
          },
          
          '---',
          
          // ========================
          //     Interactions
          // ========================
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
          
          '---',
          
          // ========================
          //       Status
          // ========================
          {
            opcode: 'setStatus',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set status to [STATUS]',
            arguments: {
              STATUS: {
                menu: 'STATUS'
              }
            }
          },
          {
            opcode: 'setActivity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set activity to [TYPE] [ACTIVITY]',
            arguments: {
              TYPE: {
                menu: 'ACTIVITY_TYPE'
              },
              ACTIVITY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'activity'
              }
            }
          },
        ],
        menus: {
          ACTIVITY_TYPE: {
            acceptReporters: true,
            items: [
              { text: "playing", value: 0 },
              { text: "streaming", value: 1 },
              { text: "listening", value: 2 },
              { text: "watching", value: 3 }
            ]
          },
          STATUS: [
            'online',
            'idle',
            'dnd',
            'invisible'
          ],
          OPTION_TYPE: {
            acceptReporters: false,
            items: [
              { text: "string", value: "string" },
              { text: "integer", value: "integer" },
              { text: "boolean", value: "boolean" },
              { text: "user", value: "user" },
              { text: "channel", value: "channel" }
            ]
          }
        }
      };
    }

    // ==============================================
    //            Connection Management
    // ==============================================
    
    setToken({ TOKEN }) {
      this.token = util.s(TOKEN);
    }

    connectToDiscord() {
      if (this.conn.isConnecting) return util.log('Already connecting...');
      if (!this.token) return util.err('Token not set');
      
      this.conn.isConnecting = true;
      this.conn.attempts++;
      this._connect();
    }

    disconnectFromDiscord() {
      if (!this.client || this.client.readyState !== WebSocket.OPEN) return;
      
      clearInterval(this.conn.heartbeatTimer);
      clearTimeout(this.conn.reconnectTimer);
      this.conn.heartbeatTimer = null;
      this.conn.reconnectTimer = null;
      this.conn.isConnecting = false;
      
      this.client.close(1000, "User disconnect");
    }

    connected() {
      return this.client && this.client.readyState === WebSocket.OPEN;
    }

    botinfo() {
      return bot_data ? JSON.stringify(bot_data) : "{}";
    }

    _connect(resume = false) {
      this.client = new WebSocket(WS);
      
      this.client.onopen = () => {
        if (resume && this.conn.sessionId && this.conn.seq) {
          this.client.send(JSON.stringify({
            op: 6,
            d: {
              token: this.token,
              session_id: this.conn.sessionId,
              seq: this.conn.seq
            }
          }));
        } else {
          this.client.send(JSON.stringify({
            op: 2,
            d: {
              token: this.token,
              intents: 4194303,
              properties: {
                $os: "windows",
                $browser: "chrome",
                $device: "scratch"
              },
              presence: {
                status: this.status,
                activities: this.activity ? [{
                  name: this.activity[1],
                  type: +this.activity[0]
                }] : [],
                afk: false
              }
            }
          }));
        }
      };
      
      this.client.onmessage = msg => {
        try {
          const data = JSON.parse(msg.data);
          if (data.s) this.conn.seq = data.s;
          
          switch (data.op) {
            case 0:
              this._handleEvent(data);
              break;
            case 7:
              this._reconnect(true);
              break;
            case 9:
              setTimeout(() => this._reconnect(!data.d), 
                Math.floor(Math.random() * 4000) + 1000);
              break;
            case 10:
              clearInterval(this.conn.heartbeatTimer);
              this.conn.heartbeatTimer = setInterval(() => {
                if (this.client?.readyState === WebSocket.OPEN) {
                  this.client.send(JSON.stringify({op: 1, d: this.conn.seq}));
                }
              }, data.d.heartbeat_interval);
              this.client.send(JSON.stringify({op: 1, d: this.conn.seq}));
              break;
          }
        } catch (err) {
          util.err('WS msg error:', err);
        }
      };
      
      this.client.onclose = evt => {
        clearInterval(this.conn.heartbeatTimer);
        clearTimeout(this.conn.reconnectTimer);
        
        if ([1000, 4004, 4010, 4011, 4012, 4013, 4014].includes(evt.code)) {
          this.conn.isConnecting = false;
          return;
        }
        
        if (this.conn.attempts >= this.conn.maxAttempts) {
          this.conn.isConnecting = false;
          return util.err('Max reconnect attempts reached');
        }
        
        const delay = Math.min(Math.pow(2, this.conn.attempts) * 1000, 30000);
        this.conn.reconnectTimer = setTimeout(() => this._reconnect(true), delay);
      };
      
      this.client.onerror = err => util.err('WS error:', err);
    }

    _reconnect(tryResume) {
      if (this.client) {
        this.client.onclose = null;
        if (this.client.readyState !== WebSocket.CLOSED) {
          this.client.close();
        }
      }
      this._connect(tryResume);
    }

    _handleEvent(data) {
      switch (data.t) {
        case 'READY':
          this.conn.sessionId = data.d.session_id;
          bot_data = data.d;
          this.conn.isConnecting = false;
          this.conn.attempts = 0;
          break;
        case 'RESUMED':
          this.conn.isConnecting = false;
          this.conn.attempts = 0;
          break;
        case 'MESSAGE_CREATE':
          this.messages.push(JSON.stringify(data.d));
          util.limit(this.messages, 100);
          break;
        case 'INTERACTION_CREATE':
          this.interactions.push(JSON.stringify(data.d));
          util.limit(this.interactions, 100);
          break;
      }
    }

    // ==============================================
    //                API Requests
    // ==============================================
    
    async _apiRequest(endpoint, options = {}) {
      if (!this.token) return Promise.reject('No token');
      
      if (this.conn.rateLimited) {
        const now = Date.now();
        if (now < this.conn.rateLimitReset) {
          await new Promise(r => setTimeout(r, this.conn.rateLimitReset - now + 100));
          this.conn.rateLimited = false;
        }
      }

      const fetchOpts = {
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bot ${this.token}`,
          'Content-Type': 'application/json'
        }
      };
      
      if (options.body) fetchOpts.body = JSON.stringify(options.body);
      
      try {
        const response = await fetch(`${API}${endpoint}`, fetchOpts);
        
        if (response.status === 429) {
          const data = await response.json();
          this.conn.rateLimited = true;
          this.conn.rateLimitReset = Date.now() + (data.retry_after * 1000);
          return this._apiRequest(endpoint, options);
        }
        
        if (response.ok) {
          if (options.method === 'DELETE' || response.headers.get('content-length') === '0') {
            return { success: true };
          }
          return await response.json().catch(() => ({ success: true }));
        }
        
        const error = await response.json().catch(() => ({ 
          status: response.status, 
          message: response.statusText 
        }));
        return Promise.reject(error);
      } catch (err) {
        util.err('API req failed:', err);
        return Promise.reject(err);
      }
    }

    // ==============================================
    //              Message Methods
    // ==============================================
    
    sendMessage({ MESSAGE, CHANNEL }) {
      return this._apiRequest(`/channels/${util.s(CHANNEL)}/messages`, {
        method: 'POST',
        body: { content: util.s(MESSAGE) }
      }).catch(err => util.err('Send msg error:', err));
    }

    getMessage({ MESSAGE_ID, CHANNEL_ID }) {
      return new Promise(resolve => {
        this._apiRequest(`/channels/${util.s(CHANNEL_ID)}/messages/${util.s(MESSAGE_ID)}`)
          .then(data => resolve(JSON.stringify(data)))
          .catch(err => {
            util.err('Get msg error:', err);
            resolve('{"error": "Failed to get message"}');
          });
      });
    }

    getChannelMessages({ AMOUNT, CHANNEL_ID }) {
      let amount = Math.min(Math.max(parseInt(AMOUNT) || 1, 1), 100);
      
      return new Promise(resolve => {
        this._apiRequest(`/channels/${util.s(CHANNEL_ID)}/messages?limit=${amount}`)
          .then(data => resolve(JSON.stringify(Array.isArray(data) ? data : [])))
          .catch(() => resolve('[]'));
      });
    }

    sendDirectMessage({ USER_ID, MESSAGE }) {
      return this._apiRequest('/users/@me/channels', {
        method: 'POST',
        body: { recipient_id: util.s(USER_ID) }
      })
      .then(data => {
        if (!data.id) return Promise.reject('Failed to create DM');
        return this._apiRequest(`/channels/${data.id}/messages`, {
          method: 'POST',
          body: { content: util.s(MESSAGE) }
        });
      })
      .catch(err => util.err('DM error:', err));
    }

    deleteMessage({ MESSAGE_ID, CHANNEL_ID }) {
      return this._apiRequest(
        `/channels/${util.s(CHANNEL_ID)}/messages/${util.s(MESSAGE_ID)}`, 
        { method: 'DELETE' }
      ).catch(err => util.err('Delete error:', err));
    }

    sendReply({ REPLY, MESSAGE_ID, CHANNEL_ID }) {
      return this._apiRequest(`/channels/${util.s(CHANNEL_ID)}/messages`, {
        method: 'POST',
        body: {
          content: util.s(REPLY),
          message_reference: {
            message_id: util.s(MESSAGE_ID),
            channel_id: util.s(CHANNEL_ID)
          }
        }
      }).catch(err => util.err('Reply error:', err));
    }

    addReaction({ EMOJI, MESSAGE_ID, CHANNEL_ID }) {
      return this._apiRequest(
        `/channels/${util.s(CHANNEL_ID)}/messages/${util.s(MESSAGE_ID)}/reactions/${encodeURIComponent(util.s(EMOJI))}/@me`,
        { method: 'PUT' }
      ).catch(err => util.err('Reaction error:', err));
    }

    removeReaction({ EMOJI, MESSAGE_ID, CHANNEL_ID }) {
      return this._apiRequest(
        `/channels/${util.s(CHANNEL_ID)}/messages/${util.s(MESSAGE_ID)}/reactions/${encodeURIComponent(util.s(EMOJI))}/@me`,
        { method: 'DELETE' }
      ).catch(err => util.err('Remove reaction error:', err));
    }

    // ==============================================
    //               Message Queue
    // ==============================================
    
    newMessage() { 
      return this.messages.length > 0; 
    }
    
    popMessage() { 
      return this.messages.shift() || ""; 
    }
    
    totalMessages() { 
      return this.messages.length; 
    }

    // ==============================================
    //                 Commands
    // ==============================================
    
    registerSlashCommand({ NAME, DESCRIPTION, OPTIONS }) {
      if (!bot_data?.application?.id) return util.err('Not connected');
      
      let options = [];
      try {
        if (OPTIONS && OPTIONS !== '[]') options = JSON.parse(util.s(OPTIONS));
      } catch (err) {
        util.err('Bad options:', err);
        options = [];
      }
      
      return this._apiRequest(`/applications/${bot_data.application.id}/commands`, {
        method: 'POST',
        body: {
          name: util.s(NAME),
          description: util.s(DESCRIPTION),
          options: options,
          contexts: [0, 1, 2],
          integration_types: [0, 1]
        }
      })
      .then(data => {
        if (!data.id) util.err('Command reg failed:', data);
      })
      .catch(err => util.err('Command reg error:', err));
    }

    deleteSlashCommand({ NAME }) {
      if (!bot_data?.application?.id) return util.err('Not connected');
      NAME = util.s(NAME);
      
      return this._apiRequest(`/applications/${bot_data.application.id}/commands`)
        .then(data => {
          if (!Array.isArray(data)) return Promise.reject('Failed to get cmds');
          
          const cmd = data.find(c => c.name === NAME);
          if (!cmd) return util.err(`Command "${NAME}" not found`);
          
          return this._apiRequest(`/applications/${bot_data.application.id}/commands/${cmd.id}`, {
            method: 'DELETE'
          });
        })
        .catch(err => util.err('Delete cmd error:', err));
    }

    getAllCommands() {
      if (!bot_data?.application?.id) return '[]';
      
      return new Promise(resolve => {
        this._apiRequest(`/applications/${bot_data.application.id}/commands`)
          .then(data => {
            if (Array.isArray(data)) {
              resolve(JSON.stringify(data.map(cmd => `/${cmd.name}`)));
            } else resolve('[]');
          })
          .catch(() => resolve('[]'));
      });
    }

    // ==============================================
    //              Command Options
    // ==============================================
    
    createCommandOptions() { 
      return '[]'; 
    }

    addCommandOption({ TYPE, NAME, DESCRIPTION, REQUIRED, OPTIONS }) {
      // Map menu selection to Discord API type values
      const typeMap = {
        'string': 3,
        'integer': 4,
        'boolean': 5,
        'user': 6,
        'channel': 7
      };
      
      return this._addOptionToList({
        type: typeMap[TYPE] || 3, // Default to string if invalid type
        name: util.s(NAME),
        description: util.s(DESCRIPTION),
        required: Boolean(REQUIRED)
      }, OPTIONS);
    }

    _addOptionToList(option, optionsList) {
      try {
        let options = [];
        if (optionsList && optionsList !== '[]') {
          options = JSON.parse(util.s(optionsList));
        }
        if (!Array.isArray(options)) options = [];
        
        option.name = option.name.toLowerCase().replace(/\s+/g, '-');
        options.push(option);
        return JSON.stringify(options);
      } catch (err) {
        util.err('Option add error:', err);
        return '[]';
      }
    }

    // ==============================================
    //              Interactions
    // ==============================================
    
    newInteraction() { 
      return this.interactions.length > 0; 
    }
    
    popInteraction() { 
      return this.interactions.shift() || ""; 
    }
    
    totalInteractions() { 
      return this.interactions.length; 
    }

    replyToInteraction({ INTERACTION, CONTENT }) {
      try {
        const interaction = JSON.parse(util.s(INTERACTION));
        return this._apiRequest(`/interactions/${interaction.id}/${interaction.token}/callback`, {
          method: 'POST',
          body: {
            type: 4,
            data: { content: util.s(CONTENT) }
          }
        }).catch(err => util.err('Interaction reply error:', err));
      } catch (err) {
        util.err('Interaction parse error:', err);
      }
    }

    // ==============================================
    //                Status
    // ==============================================
    
    setStatus({ STATUS }) {
      this.status = util.s(STATUS);
      this._updatePresence();
    }

    setActivity({ TYPE, ACTIVITY }) {
      this.activity = [util.s(TYPE), util.s(ACTIVITY)];
      this._updatePresence();
    }

    _updatePresence() {
      if (!this.client || this.client.readyState !== WebSocket.OPEN) return;
      
      this.client.send(JSON.stringify({
        op: 3,
        d: {
          since: null,
          activities: this.activity ? [{
            name: this.activity[1],
            type: +this.activity[0]
          }] : [],
          status: this.status || "online",
          afk: false
        }
      }));
    }
  }

  Scratch.extensions.register(new DiscordBot());
})(Scratch);
