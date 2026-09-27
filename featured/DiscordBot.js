// Name: DiscordBot
// Author: Mistium
// Description: Make discord bots in turbowarp

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function(Scratch) {
  const API = 'https://apps.mistium.com/discord';
  const WS = 'wss://gateway.discord.gg/?v=10&encoding=json';
  let bot_data = null;
  
  const util = {
    s: val => Scratch.Cast.toString(val),
    log: console.log,
    err: console.error,
    limit: (arr, max) => { while (arr.length > max) arr.shift(); }
  };

  // keep a guild's arrays (channels, roles, members...) in step with gateway events
  function upsert(guild, key, item, match = x => x.id === item.id, merge = false) {
    if (!item) return;
    const list = guild[key] || (guild[key] = []);
    const index = list.findIndex(match);
    if (index === -1) list.push(item);
    else list[index] = merge ? { ...list[index], ...item } : item;
  }
  function remove(guild, key, id) {
    if (guild[key]) guild[key] = guild[key].filter(x => x.id !== id);
  }

  class DiscordBot {
    constructor() {
      this.token = null;
      this.client = null;
      this.messages = [];
      this.interactions = [];
      this.status = "online";
      this.activity = null;
      
      // Caches are filled and kept current from gateway events so blocks rarely need REST.
      this.messageCache = new Map();
      this.maxCachePerChannel = 100;
      this.completeChannels = new Set(); // channels whose whole history is in messageCache
      this.guildCache = new Map();
      this.pendingGuilds = null; // guild IDs from READY still waiting for GUILD_CREATE
      this.guildWaiters = [];
      this.dmChannels = new Map(); // user ID -> DM channel ID
      this.commands = null; // application commands, loaded once
      
      this.conn = {
        isConnecting: false,
        attempts: 0,
        maxAttempts: 10,
        reconnectTimer: null,
        heartbeatTimer: null,
        seq: null,
        sessionId: null,
        resumeUrl: null,
        heartbeatAcked: true,
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
            text: 'set token to [TOKEN] (THIS ALLOWS FULL ACCESS TO YOUR BOT, DO NOT SHARE EVER)',
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
          {
            opcode: 'getGuilds',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get all guilds',
          },
          {
            opcode: 'getGuildInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get guild info [GUILD_ID]',
            arguments: {
              GUILD_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'guild_id'
              }
            }
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
            opcode: 'editMessage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'edit message [MESSAGE_ID] in channel [CHANNEL_ID] to [MESSAGE]',
            arguments: {
              MESSAGE_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message_id'
              },
              CHANNEL_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'channel_id'
              },
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'message'
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
          //       Cache
          // ========================
          {
            opcode: 'clearCache',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear message cache for channel [CHANNEL_ID]',
            arguments: {
              CHANNEL_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'channel_id'
              }
            }
          },
          {
            opcode: 'clearAllCache',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear all message cache',
          },
          {
            opcode: 'getCacheSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'cached messages in channel [CHANNEL_ID]',
            arguments: {
              CHANNEL_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'channel_id'
              }
            }
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
              { text: "number", value: "number" },
              { text: "boolean", value: "boolean" },
              { text: "user", value: "user" },
              { text: "channel", value: "channel" },
              { text: "role", value: "role" }
            ]
          }
        }
      };
    }

    // ==============================================
    //            Connection Management
    // ==============================================
    
    setToken({ TOKEN }) {
      const token = util.s(TOKEN);
      if (token !== this.token) {
        this.dmChannels.clear();
        this.commands = null;
      }
      this.token = token;
    }

    connectToDiscord() {
      if (this.conn.isConnecting) return util.log('Already connecting...');
      if (this.connected()) return util.log('Already connected');
      if (!this.token) return util.err('Token not set');
      
      this.conn.isConnecting = true;
      this.conn.attempts = 0;
      this._connect();
    }

    disconnectFromDiscord() {
      clearInterval(this.conn.heartbeatTimer);
      clearTimeout(this.conn.reconnectTimer);
      this.conn.heartbeatTimer = null;
      this.conn.reconnectTimer = null;
      this.conn.isConnecting = false;
      
      // also stops a pending reconnect or a socket that is still connecting
      if (!this.client) return;
      this.client.onclose = null;
      this.client.onmessage = null;
      if (this.client.readyState !== WebSocket.CLOSED) {
        this.client.close(1000, "User disconnect");
      }
      this.client = null;
    }

    connected() {
      return (this.client && this.client.readyState === WebSocket.OPEN) || false;
    }

    botinfo() {
      return bot_data ? JSON.stringify(bot_data) : "{}";
    }

    // Resolves once every guild from READY has arrived over the gateway (or after 10s).
    _guildsLoaded() {
      if (this.pendingGuilds && this.pendingGuilds.size === 0) return Promise.resolve();
      return new Promise(resolve => {
        const timer = setTimeout(done, 10000);
        function done() {
          clearTimeout(timer);
          resolve();
        }
        this.guildWaiters.push(done);
      });
    }

    _usingGateway() {
      return !!this.client && this.client.readyState !== WebSocket.CLOSED;
    }

    async getGuilds() {
      if (this._usingGateway()) {
        await this._guildsLoaded();
        return JSON.stringify(Array.from(this.guildCache.values()));
      }
      // offline: REST gives partial guild objects, so they aren't cached
      try {
        const data = await this._apiRequest('/users/@me/guilds');
        return JSON.stringify(Array.isArray(data) ? data : []);
      } catch (err) {
        util.err('Get guilds error:', err);
        return '[]';
      }
    }

    async getGuildInfo({ GUILD_ID }) {
      const guildId = util.s(GUILD_ID);
      if (!this.guildCache.has(guildId) && this._usingGateway()) await this._guildsLoaded();
      if (this.guildCache.has(guildId)) return JSON.stringify(this.guildCache.get(guildId));
      // connected bots get every guild they're in over the gateway, so REST can't help
      if (this._usingGateway()) return '{"error": "Bot is not in that guild"}';
      try {
        return JSON.stringify(await this._apiRequest(`/guilds/${guildId}`));
      } catch (err) {
        util.err('Get guild info error:', err);
        return '{"error": "Failed to get guild info"}';
      }
    }

    _connect(resume = false) {
      this.client = new WebSocket(resume && this.conn.resumeUrl ? `${this.conn.resumeUrl}/?v=10&encoding=json` : WS);
      this.conn.heartbeatAcked = true;
      
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
            case 1:
              this.client.send(JSON.stringify({op: 1, d: this.conn.seq}));
              break;
            case 7:
              this._reconnect(true);
              break;
            case 9:
              // d is true when the session can still be resumed
              if (!data.d) this._resetSession();
              clearTimeout(this.conn.reconnectTimer);
              this.conn.reconnectTimer = setTimeout(() => this._reconnect(!!data.d),
                Math.floor(Math.random() * 4000) + 1000);
              break;
            case 10:
              clearInterval(this.conn.heartbeatTimer);
              this.conn.heartbeatTimer = setInterval(() => {
                if (this.client?.readyState !== WebSocket.OPEN) return;
                // no ACK since the last beat means a zombie connection
                if (!this.conn.heartbeatAcked) return this._reconnect(true);
                this.conn.heartbeatAcked = false;
                this.client.send(JSON.stringify({op: 1, d: this.conn.seq}));
              }, data.d.heartbeat_interval);
              this.client.send(JSON.stringify({op: 1, d: this.conn.seq}));
              break;
            case 11:
              this.conn.heartbeatAcked = true;
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
        
        // invalid seq / session timed out: must identify again
        if (evt.code === 4007 || evt.code === 4009) this._resetSession();
        
        if (this.conn.attempts >= this.conn.maxAttempts) {
          this.conn.isConnecting = false;
          return util.err('Max reconnect attempts reached');
        }
        
        this.conn.attempts++;
        const delay = Math.min(Math.pow(2, this.conn.attempts) * 1000, 30000);
        this.conn.reconnectTimer = setTimeout(() => this._reconnect(true), delay);
      };
      
      this.client.onerror = err => util.err('WS error:', err);
    }

    _reconnect(tryResume) {
      clearInterval(this.conn.heartbeatTimer);
      clearTimeout(this.conn.reconnectTimer);
      if (this.client) {
        this.client.onclose = null;
        this.client.onmessage = null;
        if (this.client.readyState !== WebSocket.CLOSED) {
          // non-1000 code keeps the session resumable
          this.client.close(4000);
        }
      }
      this._connect(tryResume);
    }

    _resetSession() {
      this.conn.sessionId = null;
      this.conn.seq = null;
      this.conn.resumeUrl = null;
    }

    _handleEvent(data) {
      const d = data.d;
      const guild = d && d.guild_id ? this.guildCache.get(d.guild_id) : null;
      switch (data.t) {
        case 'READY':
          this.conn.sessionId = d.session_id;
          this.conn.resumeUrl = d.resume_gateway_url || null;
          bot_data = d;
          this.conn.isConnecting = false;
          this.conn.attempts = 0;
          // a new session may have missed events, so start the caches again
          this.messageCache.clear();
          this.completeChannels.clear();
          this.guildCache.clear();
          this.pendingGuilds = new Set((d.guilds || []).map(g => g.id));
          this._checkGuildsLoaded();
          break;
        case 'RESUMED':
          // Discord replays missed events on resume, so the caches stay valid
          this.conn.isConnecting = false;
          this.conn.attempts = 0;
          break;
        case 'GUILD_CREATE':
          this._cacheGuild(d);
          this.pendingGuilds?.delete(d.id);
          this._checkGuildsLoaded();
          break;
        case 'GUILD_UPDATE':
          // GUILD_UPDATE has no channels/members/threads, so merge rather than replace
          this.guildCache.set(d.id, { ...this.guildCache.get(d.id), ...d });
          break;
        case 'GUILD_DELETE':
          if (d.unavailable && this.guildCache.has(d.id)) this.guildCache.get(d.id).unavailable = true;
          else this.guildCache.delete(d.id);
          this.pendingGuilds?.delete(d.id);
          this._checkGuildsLoaded();
          break;
        case 'CHANNEL_CREATE':
        case 'CHANNEL_UPDATE':
          if (guild) upsert(guild, 'channels', d);
          break;
        case 'CHANNEL_DELETE':
          if (guild) remove(guild, 'channels', d.id);
          this.messageCache.delete(d.id);
          this.completeChannels.delete(d.id);
          break;
        case 'THREAD_CREATE':
        case 'THREAD_UPDATE':
          if (guild) upsert(guild, 'threads', d);
          break;
        case 'THREAD_DELETE':
          if (guild) remove(guild, 'threads', d.id);
          this.messageCache.delete(d.id);
          this.completeChannels.delete(d.id);
          break;
        case 'GUILD_ROLE_CREATE':
        case 'GUILD_ROLE_UPDATE':
          if (guild) upsert(guild, 'roles', d.role);
          break;
        case 'GUILD_ROLE_DELETE':
          if (guild) remove(guild, 'roles', d.role_id);
          break;
        case 'GUILD_EMOJIS_UPDATE':
          if (guild) guild.emojis = d.emojis;
          break;
        case 'GUILD_STICKERS_UPDATE':
          if (guild) guild.stickers = d.stickers;
          break;
        case 'GUILD_MEMBER_ADD':
          if (guild) {
            upsert(guild, 'members', d, m => m.user?.id === d.user?.id);
            if (typeof guild.member_count === 'number') guild.member_count++;
          }
          break;
        case 'GUILD_MEMBER_UPDATE':
          if (guild) upsert(guild, 'members', d, m => m.user?.id === d.user?.id, true);
          break;
        case 'GUILD_MEMBER_REMOVE':
          if (guild) {
            guild.members = (guild.members || []).filter(m => m.user?.id !== d.user?.id);
            if (typeof guild.member_count === 'number') guild.member_count--;
          }
          break;
        case 'MESSAGE_CREATE':
          this.messages.push(JSON.stringify(d));
          util.limit(this.messages, 100);
          this._cacheMessage(d);
          break;
        case 'MESSAGE_UPDATE':
          this._updateCachedMessage(d);
          break;
        case 'MESSAGE_DELETE':
          this._deleteCachedMessage(d.channel_id, d.id);
          break;
        case 'MESSAGE_DELETE_BULK':
          for (const id of d.ids || []) this._deleteCachedMessage(d.channel_id, id);
          break;
        case 'INTERACTION_CREATE':
          this.interactions.push(JSON.stringify(d));
          util.limit(this.interactions, 100);
          break;
      }
    }

    _checkGuildsLoaded() {
      if (!this.pendingGuilds || this.pendingGuilds.size > 0) return;
      const waiters = this.guildWaiters;
      this.guildWaiters = [];
      waiters.forEach(resolve => resolve());
    }

    _cacheMessage(message) {
      if (!message.channel_id || !message.id) return;
      
      if (!this.messageCache.has(message.channel_id)) {
        this.messageCache.set(message.channel_id, []);
      }
      
      const cache = this.messageCache.get(message.channel_id);
      
      const existingIndex = cache.findIndex(m => m.id === message.id);
      if (existingIndex !== -1) {
        cache[existingIndex] = message;
      } else {
        cache.unshift(message);
        // API batches arrive newest-first, so keep the cache sorted by snowflake (newest first)
        cache.sort((a, b) => b.id.length - a.id.length || (b.id > a.id ? 1 : b.id < a.id ? -1 : 0));
      }
      
      while (cache.length > this.maxCachePerChannel) {
        cache.pop();
      }
    }

    _updateCachedMessage(messageUpdate) {
      if (!messageUpdate.channel_id || !messageUpdate.id) return;
      
      const cache = this.messageCache.get(messageUpdate.channel_id);
      if (!cache) return;
      
      const index = cache.findIndex(m => m.id === messageUpdate.id);
      if (index !== -1) {
        cache[index] = { ...cache[index], ...messageUpdate };
      }
    }

    _deleteCachedMessage(channelId, messageId) {
      const cache = this.messageCache.get(channelId);
      if (!cache) return;
      
      const index = cache.findIndex(m => m.id === messageId);
      if (index !== -1) {
        cache.splice(index, 1);
      }
    }

    _cacheGuild(guild) {
      if (!guild.id) return;
      this.guildCache.set(guild.id, guild);
    }

    clearCache({ CHANNEL_ID }) {
      const channelId = util.s(CHANNEL_ID);
      this.messageCache.delete(channelId);
      this.completeChannels.delete(channelId);
    }

    // guilds are kept: the gateway only sends them again on a new session
    clearAllCache() {
      this.messageCache.clear();
      this.completeChannels.clear();
    }

    getCacheSize({ CHANNEL_ID }) {
      const channelId = util.s(CHANNEL_ID);
      const cache = this.messageCache.get(channelId);
      return cache ? cache.length : 0;
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
      const messageId = util.s(MESSAGE_ID);
      const channelId = util.s(CHANNEL_ID);
      
      const cache = this.messageCache.get(channelId);
      if (cache) {
        const cachedMsg = cache.find(m => m.id === messageId);
        if (cachedMsg) {
          return Promise.resolve(JSON.stringify(cachedMsg));
        }
      }
      
      return new Promise(resolve => {
        this._apiRequest(`/channels/${channelId}/messages/${messageId}`)
          .then(data => {
            resolve(JSON.stringify(data));
          })
          .catch(err => {
            util.err('Get msg error:', err);
            resolve('{"error": "Failed to get message"}');
          });
      });
    }

    // The cache holds the newest messages with no gaps: live MESSAGE_CREATEs since this
    // session started, plus any history fetched once. REST is only needed for older messages.
    async getChannelMessages({ AMOUNT, CHANNEL_ID }) {
      const amount = Math.min(Math.max(parseInt(AMOUNT) || 1, 1), 100);
      const channelId = util.s(CHANNEL_ID);
      const cache = this.messageCache.get(channelId) || [];
      if (cache.length >= amount || this.completeChannels.has(channelId)) {
        return JSON.stringify(cache.slice(0, amount));
      }
      try {
        const data = await this._apiRequest(`/channels/${channelId}/messages?limit=${amount}`);
        if (!Array.isArray(data)) return '[]';
        data.forEach(msg => this._cacheMessage(msg));
        // fewer than asked for means that's the whole channel
        if (data.length < amount) this.completeChannels.add(channelId);
        return JSON.stringify(data);
      } catch (err) {
        return '[]';
      }
    }

    async sendDirectMessage({ USER_ID, MESSAGE }) {
      const userId = util.s(USER_ID);
      try {
        // the DM channel for a user never changes, so only open it once
        if (!this.dmChannels.has(userId)) {
          const data = await this._apiRequest('/users/@me/channels', {
            method: 'POST',
            body: { recipient_id: userId }
          });
          if (!data.id) throw new Error('Failed to create DM');
          this.dmChannels.set(userId, data.id);
        }
        await this._apiRequest(`/channels/${this.dmChannels.get(userId)}/messages`, {
          method: 'POST',
          body: { content: util.s(MESSAGE) }
        });
      } catch (err) {
        util.err('DM error:', err);
      }
    }

    deleteMessage({ MESSAGE_ID, CHANNEL_ID }) {
      const channelId = util.s(CHANNEL_ID);
      const messageId = util.s(MESSAGE_ID);
      
      return this._apiRequest(
        `/channels/${channelId}/messages/${messageId}`, 
        { method: 'DELETE' }
      )
      .then(result => {
        this._deleteCachedMessage(channelId, messageId);
        return result;
      })
      .catch(err => util.err('Delete error:', err));
    }

    editMessage({ MESSAGE_ID, CHANNEL_ID, MESSAGE }) {
      const channelId = util.s(CHANNEL_ID);
      
      return this._apiRequest(`/channels/${channelId}/messages/${util.s(MESSAGE_ID)}`, {
        method: 'PATCH',
        body: { content: util.s(MESSAGE) }
      })
      .then(data => this._updateCachedMessage(data))
      .catch(err => util.err('Edit error:', err));
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
    
    // Commands only change through these blocks, so fetch them once and keep the list in step.
    async _loadCommands() {
      if (!this.commands) {
        const data = await this._apiRequest(`/applications/${bot_data.application.id}/commands`);
        if (!Array.isArray(data)) throw new Error('Failed to get commands');
        this.commands = data;
      }
      return this.commands;
    }

    async registerSlashCommand({ NAME, DESCRIPTION, OPTIONS }) {
      if (!bot_data?.application?.id) return util.err('Not connected');
      
      let options = [];
      try {
        if (OPTIONS && OPTIONS !== '[]') options = JSON.parse(util.s(OPTIONS));
      } catch (err) {
        util.err('Bad options:', err);
        options = [];
      }
      
      try {
        // POST with an existing name overwrites that command
        const data = await this._apiRequest(`/applications/${bot_data.application.id}/commands`, {
          method: 'POST',
          body: {
            name: util.s(NAME),
            description: util.s(DESCRIPTION),
            options: options,
            contexts: [0, 1, 2],
            integration_types: [0, 1]
          }
        });
        if (!data.id) return util.err('Command reg failed:', data);
        if (this.commands) {
          this.commands = this.commands.filter(cmd => cmd.name !== data.name);
          this.commands.push(data);
        }
      } catch (err) {
        util.err('Command reg error:', err);
      }
    }

    async deleteSlashCommand({ NAME }) {
      if (!bot_data?.application?.id) return util.err('Not connected');
      NAME = util.s(NAME);
      
      try {
        const cmd = (await this._loadCommands()).find(c => c.name === NAME);
        if (!cmd) return util.err(`Command "${NAME}" not found`);
        await this._apiRequest(`/applications/${bot_data.application.id}/commands/${cmd.id}`, {
          method: 'DELETE'
        });
        this.commands = this.commands.filter(c => c.id !== cmd.id);
      } catch (err) {
        util.err('Delete cmd error:', err);
      }
    }

    async getAllCommands() {
      if (!bot_data?.application?.id) return '[]';
      try {
        return JSON.stringify((await this._loadCommands()).map(cmd => `/${cmd.name}`));
      } catch (err) {
        return '[]';
      }
    }

    // ==============================================
    //              Command Options
    // ==============================================
    
    createCommandOptions() { 
      return '[]'; 
    }

    addCommandOption({ TYPE, NAME, DESCRIPTION, REQUIRED, OPTIONS }) {
      const typeMap = {
        'string': 3,
        'integer': 4,
        'boolean': 5,
        'user': 6,
        'channel': 7,
        'role': 8,
        'number': 10
      };
      
      return this._addOptionToList({
        type: typeMap[TYPE] || 3,
        name: util.s(NAME),
        description: util.s(DESCRIPTION),
        required: Scratch.Cast.toBoolean(REQUIRED)
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