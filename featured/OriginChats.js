// Name: OriginChats
// Author: Mistium
// Description: Make bots and clients for OriginChats servers, no JSON needed
// Version: v2

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("OriginChats must run unsandboxed.");
  }

  const { BlockType, ArgumentType, Cast } = Scratch;
  const runtime = Scratch.vm.runtime;
  const ID = "mistiumoriginchats";
  const REQUEST_TIMEOUT = 15000;
  const str = (value) => Cast.toString(value);
  // lists are exposed like Scratch lists: 1-based, "last" allowed, out of range gives ""
  const item = (list, index) => {
    const i = Cast.toListIndex(index, list.length, false);
    return i === Cast.LIST_INVALID ? undefined : list[i - 1];
  };
  const fetchJSON = async (url, options) => {
    const response = await (Scratch.fetch || fetch)(url, options);
    return response.json();
  };

  // Rotur's login page, same flow as rotur-sdk's performAuth: a popup, or a full-page iframe if
  // popups are blocked. It asks only for "validators:generate", so the token it hands back can
  // make OriginChats logins but can't act as the whole account. Nobody types credentials into blocks.
  const ROTUR_ORIGIN = "https://rotur.dev";
  const roturLogin = () =>
    new Promise((resolve, reject) => {
      const url = new URL(ROTUR_ORIGIN + "/auth");
      url.searchParams.set("return_to", window.location.href);
      url.searchParams.set("requires", "validators:generate");
      const popup = window.open(url.href, "rotur-auth");
      let iframe = null;
      const timer = setTimeout(() => finish(new Error("Rotur login timed out")), 120000);
      const onMessage = (event) => {
        if (event.origin !== ROTUR_ORIGIN && event.origin !== window.location.origin) return;
        if (event.data?.type !== "rotur-auth-token" || !event.data.token) return;
        finish(null, str(event.data.token));
      };
      function finish(error, token) {
        clearTimeout(timer);
        window.removeEventListener("message", onMessage);
        iframe?.remove();
        try {
          popup?.postMessage({ type: "rotur-auth-close" }, ROTUR_ORIGIN);
          popup?.close();
        } catch {}
        if (error) reject(error);
        else resolve(token);
      }
      window.addEventListener("message", onMessage);
      if (popup) return;
      iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;inset:0;width:100%;height:100%;border:none;z-index:9999";
      iframe.src = url.href;
      document.body.appendChild(iframe);
    });

  // "wss://host/", "https://host", "host" -> "wss://host/"
  const socketURL = (text) => {
    text = str(text).trim();
    if (!/^[a-z]+:\/\//i.test(text)) text = "wss://" + text;
    const url = new URL(text);
    if (url.protocol === "https:") url.protocol = "wss:";
    if (url.protocol === "http:") url.protocol = "ws:";
    return url;
  };

  // Every event hat stores what triggered it on the threads it starts, so reporters inside
  // that script read their own event even when several arrive in the same frame.
  const CONTEXT = Symbol("originchats");

  const MESSAGE_FIELDS = ["content", "author", "id", "channel", "thread id", "reply to id", "reply to author", "time"];
  const USER_FIELDS = ["username", "nickname", "status", "status text", "roles", "color"];
  const CHANNEL_FIELDS = ["name", "display name", "type", "description"];
  const SLASH_TYPES = { string: "str", str: "str", text: "str", int: "int", integer: "int", number: "float", float: "float", bool: "bool", boolean: "bool", user: "user" };

  const messageField = (message, field) => {
    if (!message) return "";
    switch (str(field)) {
      case "content": return message.content ?? "";
      case "author": return message.user ?? "";
      case "id": return message.id ?? "";
      case "channel": return message.channel ?? "";
      case "thread id": return message.thread_id ?? "";
      case "reply to id": return message.reply_to?.id ?? "";
      case "reply to author": return message.reply_to?.user ?? "";
      case "time": return message.timestamp ?? "";
    }
    return "";
  };
  const userField = (user, field) => {
    if (!user) return "";
    switch (str(field)) {
      case "username": return user.username ?? "";
      case "nickname": return user.nickname || user.username || "";
      case "status": return user.status?.status ?? "";
      case "status text": return user.status?.text ?? "";
      case "roles": return (user.roles || []).join(", ");
      case "color": return user.color ?? "";
    }
    return "";
  };
  const channelField = (channel, field) => {
    if (!channel) return "";
    switch (str(field)) {
      case "name": return channel.name ?? "";
      case "display name": return channel.display_name || channel.name || "";
      case "type": return channel.type ?? "";
      case "description": return channel.description ?? "";
    }
    return "";
  };

  class OriginChats {
    constructor() {
      this.socket = null;
      this.url = null;
      this.handshake = null;
      this.me = null;
      this.users = new Map(); // username -> user
      this.online = new Set(); // usernames
      this.channels = [];
      this.loaded = []; // messages from the last "load messages"
      this.lastMessage = null;
      this.errorText = "";
      this.lastPacket = null;
      this.pending = new Map(); // listener -> { resolve, reject, timer }
      this.nextListener = 1;
      this.slashCommands = [];
      // how to log in again after a dropped connection; cleared by disconnect, kicks and bans
      this.auth = null;
      // the scoped token from rotur.dev/auth, kept for this page only so logins don't prompt again
      this.roturToken = null;
      this.autoReconnect = true;
      this.reconnectTimer = null;
      this.reconnecting = false;
      this.reconnectAttempts = 0;
    }

    getInfo() {
      const menu = (items) => ({ acceptReporters: true, items });
      const text = (defaultValue) => ({ type: ArgumentType.STRING, defaultValue });
      const number = (defaultValue) => ({ type: ArgumentType.NUMBER, defaultValue });
      const CHANNEL = text("general");
      return {
        id: ID,
        name: "OriginChats",
        color1: "#6f5bd8",
        blocks: [
          { blockType: BlockType.LABEL, text: "Connection" },
          { opcode: "connect", blockType: BlockType.COMMAND, text: "connect to [URL]", arguments: { URL: text("wss://osl.originchats.com") } },
          { opcode: "loginWithRotur", blockType: BlockType.COMMAND, text: "log in with rotur" },
          { opcode: "login", blockType: BlockType.COMMAND, text: "log in with server account [USERNAME] password [PASSWORD]", arguments: { USERNAME: text("mybot"), PASSWORD: text("password") } },
          { opcode: "registerBot", blockType: BlockType.COMMAND, text: "create server bot account [USERNAME] password [PASSWORD]", arguments: { USERNAME: text("mybot"), PASSWORD: text("password") } },
          { opcode: "disconnect", blockType: BlockType.COMMAND, text: "disconnect" },
          { opcode: "isConnected", blockType: BlockType.BOOLEAN, text: "connected?" },
          { opcode: "isLoggedIn", blockType: BlockType.BOOLEAN, text: "logged in?" },
          { opcode: "whenLoggedIn", blockType: BlockType.EVENT, text: "when logged in", isEdgeActivated: false },
          { opcode: "whenDisconnected", blockType: BlockType.EVENT, text: "when disconnected", isEdgeActivated: false },
          { opcode: "setAutoReconnect", blockType: BlockType.COMMAND, text: "turn auto reconnect [STATE]", arguments: { STATE: { type: ArgumentType.STRING, menu: "onOff" } } },
          { opcode: "isReconnecting", blockType: BlockType.BOOLEAN, text: "reconnecting?" },
          { opcode: "myUsername", blockType: BlockType.REPORTER, text: "my username" },
          { opcode: "serverName", blockType: BlockType.REPORTER, text: "server name" },
          { opcode: "lastError", blockType: BlockType.REPORTER, text: "last error" },

          { blockType: BlockType.LABEL, text: "Messages" },
          { opcode: "whenMessage", blockType: BlockType.EVENT, text: "when message received", isEdgeActivated: false },
          { opcode: "message", blockType: BlockType.REPORTER, text: "message [FIELD]", arguments: { FIELD: { type: ArgumentType.STRING, menu: "messageField" } } },
          { opcode: "mentionsMe", blockType: BlockType.BOOLEAN, text: "message mentions me?" },
          { opcode: "send", blockType: BlockType.COMMAND, text: "send [TEXT] to channel [CHANNEL]", arguments: { TEXT: text("Hello!"), CHANNEL } },
          { opcode: "reply", blockType: BlockType.COMMAND, text: "reply [TEXT] to message", arguments: { TEXT: text("Hi!") } },
          { opcode: "react", blockType: BlockType.COMMAND, text: "react [EMOJI] to message", arguments: { EMOJI: text("👍") } },
          { opcode: "sendTyping", blockType: BlockType.COMMAND, text: "show typing in channel [CHANNEL]", arguments: { CHANNEL } },
          { opcode: "sendAndGetID", blockType: BlockType.REPORTER, text: "send [TEXT] to channel [CHANNEL] and get its id", arguments: { TEXT: text("Hello!"), CHANNEL } },
          { opcode: "editMessage", blockType: BlockType.COMMAND, text: "edit message [ID] in channel [CHANNEL] to [TEXT]", arguments: { ID: text("id"), CHANNEL, TEXT: text("edited") } },
          { opcode: "deleteMessage", blockType: BlockType.COMMAND, text: "delete message [ID] in channel [CHANNEL]", arguments: { ID: text("id"), CHANNEL } },
          { opcode: "whenEdited", blockType: BlockType.EVENT, text: "when message edited", isEdgeActivated: false },
          { opcode: "whenDeleted", blockType: BlockType.EVENT, text: "when message deleted", isEdgeActivated: false },

          { blockType: BlockType.LABEL, text: "History" },
          { opcode: "loadMessages", blockType: BlockType.COMMAND, text: "load last [AMOUNT] messages from channel [CHANNEL]", arguments: { AMOUNT: number(20), CHANNEL } },
          { opcode: "loadedCount", blockType: BlockType.REPORTER, text: "number of loaded messages" },
          { opcode: "loadedMessage", blockType: BlockType.REPORTER, text: "[FIELD] of loaded message [INDEX]", arguments: { FIELD: { type: ArgumentType.STRING, menu: "messageField" }, INDEX: number(1) } },

          { blockType: BlockType.LABEL, text: "Users" },
          { opcode: "userCount", blockType: BlockType.REPORTER, text: "number of [WHICH] users", arguments: { WHICH: { type: ArgumentType.STRING, menu: "whichUsers" } } },
          { opcode: "userAt", blockType: BlockType.REPORTER, text: "[WHICH] user [INDEX]", arguments: { WHICH: { type: ArgumentType.STRING, menu: "whichUsers" }, INDEX: number(1) } },
          { opcode: "userInfo", blockType: BlockType.REPORTER, text: "[FIELD] of user [USER]", arguments: { FIELD: { type: ArgumentType.STRING, menu: "userField" }, USER: text("username") } },
          { opcode: "isOnline", blockType: BlockType.BOOLEAN, text: "is [USER] online?", arguments: { USER: text("username") } },
          { opcode: "hasRole", blockType: BlockType.BOOLEAN, text: "does [USER] have role [ROLE]?", arguments: { USER: text("username"), ROLE: text("admin") } },
          { opcode: "whenUserOnline", blockType: BlockType.EVENT, text: "when a user comes online", isEdgeActivated: false },
          { opcode: "whenUserOffline", blockType: BlockType.EVENT, text: "when a user goes offline", isEdgeActivated: false },
          { opcode: "whenUserJoined", blockType: BlockType.EVENT, text: "when a user joins the server", isEdgeActivated: false },
          { opcode: "eventUser", blockType: BlockType.REPORTER, text: "user from event" },
          { opcode: "setStatus", blockType: BlockType.COMMAND, text: "set my status to [STATUS] with text [TEXT]", arguments: { STATUS: { type: ArgumentType.STRING, menu: "status" }, TEXT: text("") } },

          { blockType: BlockType.LABEL, text: "Channels" },
          { opcode: "channelCount", blockType: BlockType.REPORTER, text: "number of channels" },
          { opcode: "channelAt", blockType: BlockType.REPORTER, text: "[FIELD] of channel [INDEX]", arguments: { FIELD: { type: ArgumentType.STRING, menu: "channelField" }, INDEX: number(1) } },
          { opcode: "channelExists", blockType: BlockType.BOOLEAN, text: "channel [CHANNEL] exists?", arguments: { CHANNEL } },

          { blockType: BlockType.LABEL, text: "Slash commands" },
          { opcode: "addSlashCommand", blockType: BlockType.COMMAND, text: "add slash command [NAME] described as [DESCRIPTION] with options [OPTIONS]", arguments: { NAME: text("roll"), DESCRIPTION: text("Roll a dice"), OPTIONS: text("sides:int") } },
          { opcode: "clearSlashCommands", blockType: BlockType.COMMAND, text: "remove all my slash commands" },
          { opcode: "whenSlash", blockType: BlockType.EVENT, text: "when slash command used", isEdgeActivated: false },
          { opcode: "slashName", blockType: BlockType.REPORTER, text: "command name" },
          { opcode: "slashArg", blockType: BlockType.REPORTER, text: "command option [NAME]", arguments: { NAME: text("sides") } },
          { opcode: "slashUser", blockType: BlockType.REPORTER, text: "command user" },
          { opcode: "slashChannel", blockType: BlockType.REPORTER, text: "command channel" },
          { opcode: "slashRespond", blockType: BlockType.COMMAND, text: "respond to command with [TEXT]", arguments: { TEXT: text("You rolled a 4") } },

          { blockType: BlockType.LABEL, text: "Advanced" },
          { opcode: "sendRaw", blockType: BlockType.COMMAND, text: "send raw packet [PACKET]", arguments: { PACKET: text('{"cmd":"ping"}') } },
          { opcode: "whenPacket", blockType: BlockType.EVENT, text: "when any packet received", isEdgeActivated: false },
          { opcode: "packetJSON", blockType: BlockType.REPORTER, text: "packet as JSON" },
          { opcode: "packetCommand", blockType: BlockType.REPORTER, text: "packet command" },
        ],
        menus: {
          messageField: menu(MESSAGE_FIELDS),
          userField: menu(USER_FIELDS),
          channelField: menu(CHANNEL_FIELDS),
          whichUsers: menu(["online", "all"]),
          status: menu(["online", "idle", "dnd", "invisible"]),
          onOff: menu(["on", "off"]),
        },
      };
    }

    // ---- socket ----

    _send(packet) {
      if (this.socket?.readyState !== WebSocket.OPEN) throw new Error("Not connected");
      this.socket.send(JSON.stringify(packet));
    }

    // Sends a packet and resolves with the first reply carrying its listener.
    // Unknown commands get no reply at all, hence the timeout.
    _request(packet) {
      return new Promise((resolve, reject) => {
        const listener = `sb-${this.nextListener++}`;
        const timer = setTimeout(() => {
          this.pending.delete(listener);
          reject(new Error(`${packet.cmd} timed out`));
        }, REQUEST_TIMEOUT);
        this.pending.set(listener, { resolve, reject, timer });
        try {
          this._send({ ...packet, listener });
        } catch (error) {
          clearTimeout(timer);
          this.pending.delete(listener);
          reject(error);
        }
      });
    }

    // Blocks never throw into scripts: failures land in "last error".
    async _try(action) {
      try {
        const result = await action();
        return result ?? "";
      } catch (error) {
        this.errorText = error.message || str(error);
        return "";
      }
    }

    _startHats(opcode, context) {
      const threads = runtime.startHats(`${ID}_${opcode}`) || [];
      for (const thread of threads) thread[CONTEXT] = context;
    }
    _context(util) {
      return util.thread[CONTEXT] || {};
    }

    connect({ URL: address }) {
      this.disconnect();
      let url;
      try {
        url = socketURL(address);
      } catch {
        this.errorText = "Invalid server address";
        return;
      }
      this.errorText = "";
      return this._open(url);
    }

    _open(url) {
      this.url = url;
      return new Promise((resolve) => {
        const socket = new WebSocket(url.href);
        this.socket = socket;
        socket.onmessage = (event) => {
          let packet;
          try {
            packet = JSON.parse(event.data);
          } catch {
            return;
          }
          this._onPacket(packet);
          // "connect" finishes once the handshake has arrived, so logging in can follow directly
          if (packet.cmd === "handshake") resolve();
        };
        socket.onclose = () => {
          if (this.socket !== socket) return;
          this.socket = null;
          this._reset();
          this._startHats("whenDisconnected", {});
          this._scheduleReconnect();
          resolve();
        };
        socket.onerror = () => {
          this.errorText = "Could not connect to the server";
        };
      });
    }

    disconnect() {
      this.auth = null;
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
      const socket = this.socket;
      this.socket = null;
      this._reset();
      if (socket) {
        socket.onclose = null;
        socket.close();
        this._startHats("whenDisconnected", {});
      }
    }

    // Retries with backoff (1s, 2s, 4s ... 30s) and logs in again the same way as before.
    _scheduleReconnect() {
      if (!this.auth || !this.autoReconnect || this.reconnectTimer || this.reconnecting) return;
      const delay = Math.min(30000, 1000 * 2 ** this.reconnectAttempts);
      this.reconnectTimer = setTimeout(async () => {
        this.reconnectTimer = null;
        this.reconnecting = true;
        this.reconnectAttempts++;
        await this._open(this.url);
        if (this.handshake && this.auth) {
          try {
            await this._login(this.auth);
          } catch (error) {
            this.errorText = error.message;
            // a rejected login won't start working by retrying
            if (error.authError) this.auth = null;
          }
        }
        this.reconnecting = false;
        if (!this.me) {
          // a half-open socket would never close by itself, so drop it before retrying
          if (this.socket) {
            const socket = this.socket;
            this.socket = null;
            socket.onclose = null;
            socket.close();
            this._reset();
          }
          this._scheduleReconnect();
        }
      }, delay);
    }

    _reset() {
      this.handshake = null;
      this.me = null;
      this.users.clear();
      this.online.clear();
      this.channels = [];
      for (const { reject, timer } of this.pending.values()) {
        clearTimeout(timer);
        reject(new Error("Disconnected"));
      }
      this.pending.clear();
    }

    _onPacket(packet) {
      this.lastPacket = packet;
      this._startHats("whenPacket", { packet });

      const waiting = packet.listener !== undefined && this.pending.get(packet.listener);
      if (waiting) {
        this.pending.delete(packet.listener);
        clearTimeout(waiting.timer);
        if (packet.cmd === "error" || packet.cmd === "auth_error" || packet.cmd === "rate_limit") {
          const error = new Error(str(packet.val ?? packet.reason ?? packet.cmd));
          error.authError = packet.cmd === "auth_error";
          waiting.reject(error);
        } else {
          waiting.resolve(packet);
        }
      }

      switch (packet.cmd) {
        case "handshake":
          this.handshake = packet.val || {};
          break;
        case "ready":
          this.me = packet.user || null;
          if (this.me) this.users.set(this.me.username, this.me);
          this._loadServerState();
          break;
        case "auth_error":
        case "error":
          this.errorText = str(packet.val ?? packet.reason ?? "error");
          break;
        case "users_list":
          this.users = new Map((packet.users || []).map((user) => [user.username, user]));
          break;
        case "users_online":
          this.online = new Set((packet.users || []).map((user) => user.username ?? user));
          break;
        case "channels_get":
          this.channels = (packet.val || []).filter((channel) => channel.type !== "separator");
          break;
        case "channel_get": {
          const channel = packet.val;
          if (!channel?.name) break;
          const index = this.channels.findIndex((c) => c.name === channel.name);
          if (index === -1) this.channels.push(channel);
          else this.channels[index] = channel;
          break;
        }
        case "user_join":
          if (packet.user?.username) {
            this.users.set(packet.user.username, packet.user);
            this._startHats("whenUserJoined", { user: packet.user.username });
          }
          break;
        case "user_connect": {
          const username = packet.user?.username ?? packet.user;
          if (!username) break;
          if (packet.user?.username) this.users.set(username, { ...this.users.get(username), ...packet.user });
          this.online.add(username);
          this._startHats("whenUserOnline", { user: username });
          break;
        }
        case "user_disconnect": {
          const username = packet.user?.username ?? packet.user;
          if (!username) break;
          this.online.delete(username);
          this._startHats("whenUserOffline", { user: username });
          break;
        }
        case "user_leave":
          this.users.delete(packet.username);
          this.online.delete(packet.username);
          // we left or were banned: reconnecting would just be refused
          if (packet.username === this.me?.username) this.auth = null;
          break;
        case "user_kick":
          if ((packet.user?.username ?? packet.user) === this.me?.username) this.auth = null;
          break;
        case "user_update": {
          const username = packet.user?.username ?? packet.user;
          const user = this.users.get(username);
          if (user && packet.nickname !== undefined) user.nickname = packet.nickname;
          break;
        }
        case "user_roles_get": {
          const user = this.users.get(packet.user);
          if (user) {
            user.roles = packet.roles || [];
            user.color = packet.color ?? user.color;
          }
          break;
        }
        case "status_get": {
          const user = this.users.get(packet.username);
          if (user && packet.status) user.status = packet.status;
          break;
        }
        case "message_new": {
          const message = { channel: packet.channel, thread_id: packet.thread_id, ...packet.message };
          this.lastMessage = message;
          // bots almost never want to react to their own messages
          if (message.user !== this.me?.username) this._startHats("whenMessage", { message });
          break;
        }
        case "message_edit": {
          const message = { channel: packet.channel, thread_id: packet.thread_id, ...packet.message };
          if (message.user !== this.me?.username) this._startHats("whenEdited", { message });
          break;
        }
        case "message_delete":
          this._startHats("whenDeleted", { message: { id: packet.id, channel: packet.channel, thread_id: packet.thread_id } });
          break;
        case "slash_call":
          this._startHats("whenSlash", { slash: packet });
          break;
      }
    }

    // Users and channels load once, then stay current from server events.
    _loadServerState() {
      for (const cmd of ["users_list", "users_online", "channels_get"]) {
        this._request({ cmd }).catch(() => {});
      }
      if (this.slashCommands.length) this._registerSlash();
      this._startHats("whenLoggedIn", {});
    }

    // ---- login ----

    async _authenticate(packet) {
      if (!this.handshake) throw new Error("Connect to a server first");
      if (this.me) throw new Error("Already logged in");
      const reply = await this._request({ client: "scratch", device: "computer", ...packet });
      if (reply.cmd !== "auth_success") throw new Error(str(reply.val ?? "Login failed"));
      // "ready" follows auth_success; wait for it so "my username" works on the next block
      for (let i = 0; i < 100 && !this.me; i++) await new Promise((r) => setTimeout(r, 20));
    }

    // auth: { type: "rotur", token } | { type: "login" | "register", username, password }
    async _login(auth) {
      const mode = this.handshake?.auth_mode;
      if (auth.type === "rotur" && mode === "cracked-only") throw new Error("This server only allows server accounts");
      if (auth.type !== "rotur" && mode === "rotur") throw new Error("This server only allows rotur accounts");
      if (auth.type === "register" && !(this.handshake?.capabilities || []).includes("register")) {
        throw new Error("This server doesn't allow creating accounts");
      }
      if (auth.type === "rotur") {
        const key = str(this.handshake?.validator_key);
        // The key names the server it was made for. Refuse to sign in if that isn't the server
        // we connected to, or a server could make us log in to a different one.
        const match = /^originChats-(.+)-[^-]+$/.exec(key);
        let keyHost = null;
        try {
          keyHost = match && new URL(match[1]).host;
        } catch {}
        if (!keyHost || keyHost !== this.url?.host) throw new Error("Server identity mismatch, not logging in");
        const data = await fetchJSON(
          `https://api.rotur.dev/generate_validator?auth=${encodeURIComponent(auth.token)}&key=${encodeURIComponent(key)}`
        );
        if (!data?.validator) {
          // the token was revoked or expired: the next "log in with rotur" asks again
          if (this.roturToken === auth.token) this.roturToken = null;
          const error = new Error(str(data?.error ?? "Rotur rejected the login"));
          error.authError = true;
          throw error;
        }
        await this._authenticate({ cmd: "auth", validator: data.validator });
      } else {
        const { username, password } = auth;
        await this._authenticate(
          auth.type === "register" ? { cmd: "register", username, password, bot: true } : { cmd: "login", username, password }
        );
      }
      // after registering once, later reconnects log in to that account
      this.auth = auth.type === "register" ? { ...auth, type: "login" } : auth;
      this.reconnectAttempts = 0;
    }

    loginWithRotur() {
      return this._try(async () => {
        if (!this.handshake) throw new Error("Connect to a server first");
        if (!this.roturToken) this.roturToken = await roturLogin();
        await this._login({ type: "rotur", token: this.roturToken });
      });
    }

    login({ USERNAME, PASSWORD }) {
      return this._try(() => this._login({ type: "login", username: str(USERNAME), password: str(PASSWORD) }));
    }

    registerBot({ USERNAME, PASSWORD }) {
      return this._try(() => this._login({ type: "register", username: str(USERNAME), password: str(PASSWORD) }));
    }

    setAutoReconnect({ STATE }) {
      this.autoReconnect = str(STATE) !== "off";
      if (!this.autoReconnect) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      } else if (!this.socket) {
        this._scheduleReconnect();
      }
    }

    isReconnecting() {
      return !!this.reconnectTimer || this.reconnecting;
    }

    isConnected() {
      return this.socket?.readyState === WebSocket.OPEN;
    }

    isLoggedIn() {
      return !!this.me;
    }

    whenLoggedIn() {
      return true;
    }

    whenDisconnected() {
      return true;
    }

    myUsername() {
      return this.me?.username ?? "";
    }

    serverName() {
      return this.handshake?.server?.name ?? "";
    }

    lastError() {
      return this.errorText;
    }

    // ---- messages ----

    whenMessage() {
      return true;
    }

    whenEdited() {
      return true;
    }

    whenDeleted() {
      return true;
    }

    // inside a message hat: that message; anywhere else: the newest message seen
    _message(util) {
      return this._context(util).message || this.lastMessage;
    }

    message({ FIELD }, util) {
      return messageField(this._message(util), FIELD);
    }

    mentionsMe(args, util) {
      const message = this._message(util);
      const me = this.me;
      if (!message || !me) return false;
      const pings = message.pings || {};
      return (
        (pings.users || []).includes(me.username) ||
        (pings.replies || []).includes(me.username) ||
        (pings.roles || []).some((role) => (me.roles || []).includes(role))
      );
    }

    // "general" or a forum thread id both work as a channel
    _target(channel, message) {
      if (message?.thread_id) return { thread_id: message.thread_id };
      return { channel: str(channel) };
    }

    send({ TEXT, CHANNEL }) {
      return this._try(() => this._request({ cmd: "message_new", channel: str(CHANNEL), content: str(TEXT) }).then(() => {}));
    }

    sendAndGetID({ TEXT, CHANNEL }) {
      return this._try(async () => {
        const reply = await this._request({ cmd: "message_new", channel: str(CHANNEL), content: str(TEXT) });
        return reply.message?.id ?? "";
      });
    }

    reply({ TEXT }, util) {
      const message = this._message(util);
      if (!message) return;
      return this._try(() =>
        this._request({ cmd: "message_new", ...this._target(message.channel, message), content: str(TEXT), reply_to: message.id }).then(() => {})
      );
    }

    react({ EMOJI }, util) {
      const message = this._message(util);
      if (!message) return;
      return this._try(() =>
        this._request({ cmd: "reaction_add", ...this._target(message.channel, message), id: message.id, emoji: str(EMOJI) }).then(() => {})
      );
    }

    sendTyping({ CHANNEL }) {
      return this._try(() => this._send({ cmd: "typing", channel: str(CHANNEL) }));
    }

    editMessage({ ID, CHANNEL, TEXT }) {
      return this._try(() =>
        this._request({ cmd: "message_edit", channel: str(CHANNEL), id: str(ID), content: str(TEXT) }).then(() => {})
      );
    }

    deleteMessage({ ID, CHANNEL }) {
      return this._try(() => this._request({ cmd: "message_delete", channel: str(CHANNEL), id: str(ID) }).then(() => {}));
    }

    // ---- history ----

    loadMessages({ AMOUNT, CHANNEL }) {
      return this._try(async () => {
        const limit = Math.min(200, Math.max(1, Math.floor(Cast.toNumber(AMOUNT))));
        const reply = await this._request({ cmd: "messages_get", channel: str(CHANNEL), limit });
        // oldest first from the server; message 1 is the newest, like "last N messages" reads
        this.loaded = (reply.val || []).map((message) => ({ channel: reply.channel, ...message })).reverse();
      });
    }

    loadedCount() {
      return this.loaded.length;
    }

    loadedMessage({ FIELD, INDEX }) {
      return messageField(item(this.loaded, INDEX), FIELD);
    }

    // ---- users ----

    _userList(which) {
      return str(which) === "online" ? [...this.online] : [...this.users.keys()];
    }

    userCount({ WHICH }) {
      return this._userList(WHICH).length;
    }

    userAt({ WHICH, INDEX }) {
      return item(this._userList(WHICH), INDEX) ?? "";
    }

    userInfo({ FIELD, USER }) {
      return userField(this.users.get(str(USER)), FIELD);
    }

    isOnline({ USER }) {
      return this.online.has(str(USER));
    }

    hasRole({ USER, ROLE }) {
      const user = this.users.get(str(USER));
      const role = str(ROLE).toLowerCase();
      return !!user && (user.roles || []).some((r) => str(r).toLowerCase() === role);
    }

    whenUserOnline() {
      return true;
    }

    whenUserOffline() {
      return true;
    }

    whenUserJoined() {
      return true;
    }

    eventUser(args, util) {
      return this._context(util).user ?? "";
    }

    setStatus({ STATUS, TEXT }) {
      return this._try(() => this._send({ cmd: "status_set", status: str(STATUS), text: str(TEXT) }));
    }

    // ---- channels ----

    channelCount() {
      return this.channels.length;
    }

    channelAt({ FIELD, INDEX }) {
      return channelField(item(this.channels, INDEX), FIELD);
    }

    channelExists({ CHANNEL }) {
      return this.channels.some((channel) => channel.name === str(CHANNEL));
    }

    // ---- slash commands ----

    // "sides:int, who:user" -> OriginChats options; types: text, int, number, bool, user
    addSlashCommand({ NAME, DESCRIPTION, OPTIONS }) {
      const name = str(NAME).trim().toLowerCase();
      if (!name) return;
      const options = str(OPTIONS)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
          const [optionName, type = "text"] = part.split(":").map((s) => s.trim());
          const optional = optionName.endsWith("?");
          return {
            name: optional ? optionName.slice(0, -1) : optionName,
            description: optional ? optionName.slice(0, -1) : optionName,
            type: SLASH_TYPES[type.toLowerCase()] || "str",
            required: !optional,
          };
        });
      this.slashCommands = this.slashCommands.filter((command) => command.name !== name);
      this.slashCommands.push({ name, description: str(DESCRIPTION), options });
      if (this.me) return this._try(() => this._registerSlash());
    }

    clearSlashCommands() {
      this.slashCommands = [];
      if (this.me) return this._try(() => this._registerSlash());
    }

    // the server replaces this connection's whole set on every register
    _registerSlash() {
      this._send({ cmd: "slash_register", commands: this.slashCommands });
    }

    whenSlash() {
      return true;
    }

    _slash(util) {
      return this._context(util).slash;
    }

    slashName(args, util) {
      return this._slash(util)?.val?.command ?? "";
    }

    slashArg({ NAME }, util) {
      const args = this._slash(util)?.val?.args;
      const value = args ? args[str(NAME)] : undefined;
      return value === undefined || value === null ? "" : typeof value === "object" ? JSON.stringify(value) : value;
    }

    slashUser(args, util) {
      const slash = this._slash(util);
      return slash?.invokerUsername ?? slash?.val?.commander ?? "";
    }

    slashChannel(args, util) {
      return this._slash(util)?.channel ?? "";
    }

    slashRespond({ TEXT }, util) {
      const slash = this._slash(util);
      if (!slash) return;
      return this._try(() => this._send({ cmd: "slash_response", id: slash.id, response: str(TEXT) }));
    }

    // ---- advanced ----

    sendRaw({ PACKET }) {
      return this._try(() => {
        const packet = JSON.parse(str(PACKET));
        if (!packet || typeof packet !== "object" || Array.isArray(packet)) throw new Error("A packet must be a JSON object");
        this._send(packet);
      });
    }

    whenPacket() {
      return true;
    }

    _packet(util) {
      return this._context(util).packet || this.lastPacket;
    }

    packetJSON(args, util) {
      const packet = this._packet(util);
      return packet ? JSON.stringify(packet) : "";
    }

    packetCommand(args, util) {
      return this._packet(util)?.cmd ?? "";
    }
  }

  Scratch.extensions.register(new OriginChats());
})(Scratch);
