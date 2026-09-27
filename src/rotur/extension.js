// Name: Rotur.js (source)
// Author: Mistium
// Description: Utilise rotur in your projects
//
// This file is the SOURCE for the generated featured/Rotur.js extension.
// It is bundled with an embedded copy of rotur-sdk (from npm) by
// scripts/build-rotur-extension.mjs. Never edit featured/Rotur.js by hand.
//
// Transport: every action goes through rotur-sdk (HTTP namespaces + the
// SDK status socket). The legacy wss://rotur.mistium.com websocket protocol
// (handshake / setid / pmsg commands) is gone. Block names and menus are
// unchanged so existing projects keep working.

import { Rotur } from "rotur-sdk";
import { blocks } from "./helpers.js";
import { buildGetInfo } from "./getinfo.js";

if (!Scratch.extensions.unsandboxed) {
  throw new Error("Rotur must run unsandboxed.");
}

const EXT_VERSION = 9;
const STATUS_WS = "wss://api.rotur.dev/status/ws";
const LEGACY_AUTH_RETIRED =
  "Username/password login was retired. Use the login prompt or login with token.";
const MAILBOX_ROOM_PREFIX = "rotur-ext";
const SYNC_ROOM = "rotur-ext-sync";
const SOCKET_TIMEOUT_MS = 15000;

function apiMessage(error, fallback) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "error" in data) return String(data.error);
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

class RoturExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.sdk = null;
    this.socketTask = null;
    this.wired = false;

    this.version = EXT_VERSION;
    this.outdated = false;
    this.showDangerous = false;

    this.designation = "rtr";
    this.system = "rotur";
    this.appVersion = "v" + EXT_VERSION;
    this.clientInfo = { system: "rotur", version: "v" + EXT_VERSION };

    this.is_connected = false;
    this.authenticated = false;
    this.account = null;
    this.username = "";
    this.userId = "";

    this.packets = {};
    this.rawPackets = [];
    this.roomMembers = {};
    this.lastJoined = "";
    this.lastLeft = "";

    this.storageId = "";
    this.syncedVariables = {};
    this.mailbox = [];
    this.mailSeq = 0;
    this.friends = { list: [], requests: [] };
    this.balance = 0;
    this.transactions = [];
    this.badges = [];
    this.callJson = {};

    this.systems = [];
    this._pollTimer = null;

    fetch("https://api.rotur.dev/systems")
      .then((resp) => resp.json())
      .then((data) => {
        this.systems = Object.keys(data || {});
      })
      .catch(() => {
        this.systems = [];
      });

    const cleanUpLogin = () => {
      if (typeof window === "undefined") return;
      if (window._roturOverlay && Scratch.renderer) {
        try {
          Scratch.renderer.removeOverlay(window._roturOverlay);
        } catch (_) {}
      }
      if (window._roturAuthHandler) window.removeEventListener("message", window._roturAuthHandler);
      delete window._roturOverlay;
      delete window._roturAuthHandler;
    };

    try {
      Scratch.vm.on("PROJECT_RUN_START", cleanUpLogin);
      Scratch.vm.on("PROJECT_RUN_STOP", cleanUpLogin);
    } catch (_) {}
  }

  getInfo() {
    return buildGetInfo(this);
  }

  // Buttons + menus (menus feed the block dropdowns)
  openUpdate() {
    window.open("https://extensions.mistium.com/featured/Rotur.js");
  }

  openItemsDocs() {
    window.open("https://github.com/RoturTW/main/wiki/Items");
  }

  openAccountDocs() {
    window.open("https://github.com/RoturTW/main/wiki/Account-Keys");
  }

  openMailDocs() {
    window.open("https://github.com/RoturTW/main/wiki/Rmail");
  }

  openFriendsDocs() {
    window.open("https://github.com/RoturTW/main/wiki/Friends");
  }

  openStorageDocs() {
    window.open("https://github.com/RoturTW/main/wiki/Data-Storage");
  }

  openCurrencyDocs() {
    window.open("https://github.com/RoturTW/main/wiki/Currency");
  }

  openBadgesDocs() {
    window.open("https://github.com/RoturTW/main/wiki/Badges");
  }

  openRoturVoice() {
    window.open("https://extensions.mistium.com/featured/roturVoice.js");
  }

  openRoturVoiceExample() {
    window.open("https://turbowarp.org/editor?project=rotur-voice-example");
  }

  openKeyManager() {
    window.open("https://rotur.dev/keys");
  }

  openDangerZone() {
    this.showDangerous = true;
  }

  closeDangerZone() {
    this.showDangerous = false;
  }

  systemsList() {
    if (this.systems.length === 0) return ["rotur"];
    return this.systems;
  }

  openPorts() {
    const ports = Object.keys(this.packets);
    if (ports.length === 0) return ["No Open Ports"];
    return ports;
  }

  accountKeys() {
    const keys = Object.keys(this.account || {});
    if (!keys || keys.length === 0) return ["No User Keys"];
    return keys;
  }

  myFriends() {
    if (!this.authenticated) return ["Not Authenticated"];
    if (this.friends.list.length === 0) return ["No Friends"];
    return this.friends.list;
  }

  myRequests() {
    if (!this.authenticated) return ["Not Authenticated"];
    if (this.friends.requests.length === 0) return ["No Requests"];
    return this.friends.requests;
  }

  // Internal plumbing on top of the embedded SDK
  _hat(name) {
    try {
      Scratch.vm.runtime.startHats("roturEXT_" + name);
    } catch (_) {}
  }

  _ensureClient() {
    if (!this.sdk) {
      this.sdk = new Rotur();
      this._wireSocket();
    }
    return this.sdk;
  }

  _online() {
    return !!(this.sdk && this.sdk.socket && this.sdk.socket.connected);
  }

  _authed() {
    return this._online() && !!(this.sdk && this.sdk.loggedIn && this.account);
  }

  _wireSocket() {
    if (this.wired) return;
    this.wired = true;
    const socket = this.sdk.socket;

    socket.on("ready", (msg) => {
      this.is_connected = true;
      this.userId = msg.user_id || "";
      this.username = msg.username || "";
      if (msg.user && typeof msg.user === "object") this._applyAccount(msg.user);
      this._joinRooms();
      this._hat("whenConnected");
      this._refreshAll();
    });

    socket.on("room_state", (msg) => {
      if (msg.room) this.roomMembers[msg.room] = msg.members || [];
    });

    socket.on("member_join", (msg) => {
      const room = msg.room || this.designation;
      const list = this.roomMembers[room] || [];
      if (msg.username && !list.some((m) => (m.username || m) === msg.username)) {
        list.push({ username: msg.username, user_id: msg.user_id });
      }
      this.roomMembers[room] = list;
      this.lastJoined = msg.username || "";
      this._hat("onJoin");
    });

    socket.on("member_leave", (msg) => {
      const room = msg.room || this.designation;
      const list = this.roomMembers[room] || [];
      const leaver = list.find((m) => (m.user_id || m.username) === msg.user_id) || {};
      this.lastLeft = leaver.username || String(msg.user_id || "");
      this.roomMembers[room] = list.filter((m) => (m.user_id || m.username) !== msg.user_id);
      this._hat("onLeave");
    });

    const onMessage = (msg) => this._routeSocketMessage(msg);
    socket.on("gmsg", onMessage);
    socket.on("pmsg", onMessage);

    socket.on("key_update", (msg) => {
      if (!this.account) this.account = {};
      this.account[msg.key] = msg.value;
      this._hat("whenAccountUpdate");
    });

    socket.on("key_delete", (msg) => {
      if (this.account) delete this.account[msg.key];
      this._hat("whenAccountUpdate");
    });

    socket.on("profile_update", (msg) => {
      if (!this.account) this.account = {};
      this.account[msg.key] = msg.value;
      this._hat("whenAccountUpdate");
    });

    socket.on("close", () => {
      this.is_connected = false;
      if (this.authenticated) {
        this.authenticated = false;
        this.account = null;
      }
      this._hat("whenDisconnected");
    });
  }

  _joinRooms() {
    try {
      const rooms = [this.designation, SYNC_ROOM].filter(Boolean);
      const seen = [...new Set(rooms)];
      if (seen.length > 0) this.sdk.socket.join(seen);
    } catch (_) {}
  }

  _connectSocket() {
    this._ensureClient();
    if (!this.sdk.loggedIn) return Promise.reject(new Error("Login first"));
    if (this._online()) return Promise.resolve();
    if (!this.socketTask) {
      // The SDK promise never settles if the server closes before "ready" (bad
      // token), and stays resolved while it auto-reconnects. Wait for a real
      // "ready" with a timeout so a login block can't hang its thread forever.
      let timer;
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Connection timed out")), SOCKET_TIMEOUT_MS);
      });
      const ready = this.sdk
        .connectSocket()
        .then((conn) => (this._online() ? conn : this.sdk.socket.once("ready")));
      this.socketTask = Promise.race([ready, timeout]).finally(() => {
        clearTimeout(timer);
        this.socketTask = null;
      });
    }
    return this.socketTask;
  }

  _applyAccount(me) {
    this.account = { ...(me || {}) };
    this.authenticated = true;
    if (me) {
      if (me.username) this.username = me.username;
      if (me.id) this.userId = me.id;
      if (typeof me.currency === "number") this.balance = me.currency;
      if (Array.isArray(me.badges)) this.badges = me.badges;
    }
  }

  async _refreshAll() {
    await this._refreshAccount(false);
    await this._refreshFriends(false);
    this._startPolling();
  }

  async _refreshAccount(fireHat = true) {
    if (!this.sdk || !this.sdk.loggedIn) return;
    try {
      const me = await this.sdk.me.get();
      this._applyAccount(me);
      if (fireHat) this._hat("whenAccountUpdate");
    } catch (_) {}
  }

  async _refreshFriends(fireHats = true) {
    if (!this.sdk || !this.sdk.loggedIn) return;
    try {
      const [listRes, reqRes, outRes] = await Promise.all([
        this.sdk.friends.list().catch(() => ({ friends: this.friends.list })),
        this.sdk.me.requests().catch(() => ({ requests: this.friends.requests })),
        this.sdk.me.outgoing().catch(() => ({ outgoing: [] })),
      ]);
      const list = listRes.friends || [];
      const incoming = reqRes.requests || [];
      const outgoing = outRes.outgoing || outRes.requests || [];
      if (fireHats) {
        if (incoming.length > this.friends.requests.length) this._hat("whenFriendRequestReceived");
        if (list.length > this.friends.list.length) this._hat("whenFriendRequestAccepted");
      }
      this.friends = { list, requests: incoming, outgoing };
    } catch (_) {}
  }

  async _refreshBalance(fireHat = true) {
    if (!this.sdk || !this.sdk.loggedIn) return;
    try {
      const me = await this.sdk.me.get();
      const next = typeof me.currency === "number" ? me.currency : this.balance;
      if (fireHat && next !== this.balance) this._hat("whenBalanceChanged");
      this.balance = next;
      this._applyAccount(me);
    } catch (_) {}
  }

  _startPolling() {
    if (this._pollTimer) return;
    this._pollTimer = setInterval(() => {
      if (!this._authed()) return;
      this._refreshFriends(true);
      this._refreshBalance(true);
    }, 15000);
  }

  _routeSocketMessage(msg) {
    const room = msg.room || this.designation;
    const val = msg.val && typeof msg.val === "object" ? msg.val : { payload: msg.val };
    const origin = (msg.origin && msg.origin.username) || val.from || "Unknown";

    if (val.kind === "sync_set") {
      this.syncedVariables[origin] ||= {};
      this.syncedVariables[origin][val.key] = val.value;
      return;
    }
    if (val.kind === "sync_delete") {
      if (this.syncedVariables[origin]) delete this.syncedVariables[origin][val.key];
      return;
    }
    if (val.kind === "mail") {
      this.mailSeq += 1;
      this.mailbox.push({
        id: String(this.mailSeq),
        subject: val.subject || "",
        message: val.message || "",
        from: origin,
        timestamp: msg.timestamp || Date.now(),
      });
      this._hat("whenMailReceived");
      return;
    }
    if (val.kind === "call_request") {
      this.callJson = { from: origin, ...val.call };
      this._hat("whenCallReceived");
      return;
    }
    if (val.kind === "call_confirm") {
      this.callJson = { ...val.call, confirmed: true };
      this._hat("whenCallAccepted");
      return;
    }

    const packet = {
      origin,
      client: val.client || { system: "Unknown", version: "Unknown" },
      source: val.source || "Unknown",
      payload: val.payload !== undefined ? val.payload : "",
      timestamp: msg.timestamp || Date.now(),
    };
    this.packets[room] ||= [];
    this.packets[room].push(packet);
    this.rawPackets.push({ room, ...packet });
    this._hat("whenMessageReceived");
  }

  // Connection blocks
  connectToServer(args) {
    const previous = this.designation;
    this.designation = args.DESIGNATION || "rtr";
    this.system = args.SYSTEM || "rotur";
    this.appVersion = args.VERSION || "v" + EXT_VERSION;
    this.clientInfo = { system: this.system, version: this.appVersion };
    this._ensureClient();
    if (this._online()) {
      try {
        if (previous && previous !== this.designation && previous !== SYNC_ROOM) {
          this.sdk.socket.leave([previous]);
          delete this.roomMembers[previous];
        }
      } catch (_) {}
      this._joinRooms();
    }
    if (this.sdk.loggedIn) {
      this._connectSocket()
        .then(() => this._refreshAll())
        .catch((error) => console.error("Rotur connect failed:", error));
    }
  }

  serverOnline() {
    return fetch("https://api.rotur.dev/systems")
      .then((resp) => resp.ok)
      .catch(() => false);
  }

  disconnect() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
    this.socketTask = null;
    const wasOnline = this._online();
    try {
      if (this.sdk) this.sdk.logout();
    } catch (_) {}
    this.is_connected = false;
    this.authenticated = false;
    this.account = null;
    this.roomMembers = {};
    // sdk.logout() detaches the socket's onclose, so the close handler never runs.
    if (wasOnline) this._hat("whenDisconnected");
  }

  connected() {
    return this._online();
  }

  loggedIn() {
    return this._authed();
  }

  firstLogin() {
    return false;
  }

  // Auth blocks (login prompt + token go through the embedded SDK)
  async login_prompt() {
    this._ensureClient();
    if (!this._online() && !this.sdk.loggedIn) {
      try {
        await this.sdk.login({ system: this.system || "rotur" });
      } catch (error) {
        console.error("Rotur login failed:", error);
        return "Login failed";
      }
    }
    try {
      await this._connectSocket();
      await this._refreshAll();
      this._hat("whenAuthenticated");
      return "Logged in";
    } catch (error) {
      console.error("Rotur login failed:", error);
      return "Login failed";
    }
  }

  login() {
    return LEGACY_AUTH_RETIRED;
  }

  loginMd5() {
    return LEGACY_AUTH_RETIRED;
  }

  async loginToken(args) {
    this._ensureClient();
    const token = Scratch.Cast.toString(args.TOKEN);
    if (!token) return "No token provided";
    // setToken() keeps an open socket, so switching accounts needs a fresh one.
    if (this.sdk.token && this.sdk.token !== token) this.disconnect();
    try {
      this.sdk.setToken(token);
      await this._connectSocket();
      await this._refreshAll();
      this._hat("whenAuthenticated");
      return "Logged In";
    } catch (error) {
      // Drop the rejected token so the SDK stops auto-reconnecting with it.
      this.disconnect();
      return apiMessage(error, "Login failed");
    }
  }

  register() {
    return "Register on rotur.dev, then use the login prompt or login with token.";
  }

  async deleteAccount() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    if (!confirm(`Are You Sure You Want To Delete ${this.username}? Everything will be lost!`)) {
      return "Cancelled";
    }
    try {
      await this.sdk.profiles.delete(this.username);
      this.disconnect();
      return "Account Deleted Successfully";
    } catch (error) {
      return "Failed to delete account: " + apiMessage(error, "unknown error");
    }
  }

  logout() {
    this.disconnect();
  }

  getToken() {
    return (this.sdk && this.sdk.token) || "";
  }

  // Account key blocks (backed by the SDK account object)
  getkey(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    const value = this.account[args.KEY];
    if (value === undefined) return "";
    return typeof value === "object" ? JSON.stringify(value) : value;
  }

  async setkey(args) {
    if (String(args.VALUE).length > 1000) return "Key Too Long, Limit is 1000 Characters";
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      const res = await this.sdk.me.update(args.KEY, args.VALUE);
      this.account[args.KEY] = res && "value" in res ? res.value : args.VALUE;
      this._hat("whenAccountUpdate");
      return "Key Set";
    } catch (error) {
      return apiMessage(error, "Failed to set key");
    }
  }

  keyExists(args) {
    if (!this._online()) return false;
    if (!this._authed()) return false;
    return args.KEY in this.account;
  }

  getkeys() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(Object.keys(this.account));
  }

  getvalues() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(Object.values(this.account));
  }

  getAccount() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(this.account);
  }
  // Data storage blocks (backed by the SDK storage namespace)
  setStorageID(args) {
    this.storageId = args.ID || "";
  }

  storageIdExists() {
    return this.storageId !== "";
  }

  getStorageID() {
    return this.storageId;
  }

  _storageReady() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    if (!this.storageId) return "Storage ID not set";
    return null;
  }

  async getStorageKey(args) {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      const value = await this.sdk.storage.getKey(this.storageId, args.KEY);
      if (value === undefined) return "";
      return typeof value === "object" ? JSON.stringify(value) : value;
    } catch (error) {
      return apiMessage(error, "Failed to get storage key");
    }
  }

  async setStorageKey(args) {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      await this.sdk.storage.set(this.storageId, args.KEY, args.VALUE);
      return "Key Set";
    } catch (error) {
      return apiMessage(error, "Failed to set storage key");
    }
  }

  async existsStorageKey(args) {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      const value = await this.sdk.storage.getKey(this.storageId, args.KEY);
      return value !== undefined;
    } catch (_) {
      return false;
    }
  }

  async deleteStorageKey(args) {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      await this.sdk.storage.delete(this.storageId, args.KEY);
      return "Key Deleted";
    } catch (error) {
      return apiMessage(error, "Failed to delete storage key");
    }
  }

  async getStorageKeys() {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      const data = await this.sdk.storage.get(this.storageId);
      return JSON.stringify(Object.keys(data.data || {}));
    } catch (error) {
      return apiMessage(error, "Failed to get storage keys");
    }
  }

  async getStorageValues() {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      const data = await this.sdk.storage.get(this.storageId);
      return JSON.stringify(Object.values(data.data || {}));
    } catch (error) {
      return apiMessage(error, "Failed to get storage values");
    }
  }

  async clearStorage() {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      await this.sdk.storage.clear(this.storageId);
      return "Storage Cleared";
    } catch (error) {
      return apiMessage(error, "Failed to clear storage");
    }
  }

  async _storageBagSize() {
    const data = await this.sdk.storage.get(this.storageId);
    return JSON.stringify(data.data || {}).length;
  }

  async _storageQuota() {
    try {
      const list = await this.sdk.storage.list();
      return { usage: list.usage || 0, max: list.max || 0 };
    } catch (_) {
      return { usage: 0, max: 0 };
    }
  }

  async storageUsage() {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      return await this._storageBagSize();
    } catch (error) {
      return apiMessage(error, "Failed to get storage usage");
    }
  }

  async storageLimit() {
    const problem = this._storageReady();
    if (problem) return problem;
    return (await this._storageQuota()).max;
  }

  async storageRemaining() {
    const problem = this._storageReady();
    if (problem) return problem;
    try {
      const quota = await this._storageQuota();
      if (!quota.max) return 0;
      const used = await this._storageBagSize();
      return Math.max(0, quota.max - used);
    } catch (error) {
      return apiMessage(error, "Failed to get storage remaining");
    }
  }

  async accountStorageUsage() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return (await this._storageQuota()).usage;
  }

  async accountStorageLimit() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return (await this._storageQuota()).max;
  }

  async accountStorageRemaining() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    const quota = await this._storageQuota();
    return Math.max(0, (quota.max || 0) - (quota.usage || 0));
  }

  // Messaging blocks (rooms on the SDK socket replace the old ports)
  sendMessage(args) {
    if (!this._online()) {
      console.error("Unable to send message: Not Connected");
      return "";
    }
    const room = args.TARGET || this.designation;
    try {
      if (!this.sdk.socket.joinedRooms.includes(room)) this.sdk.socket.join([room]);
    } catch (_) {}
    try {
      if (args.USER) {
        this.sdk.socket.sendPrivateMessage(room, args.USER, {
          kind: "message",
          payload: args.PAYLOAD,
          source: args.SOURCE,
          client: this.clientInfo,
        });
      } else {
        this.sdk.socket.sendGroupMessage(room, {
          kind: "message",
          payload: args.PAYLOAD,
          source: args.SOURCE,
          client: this.clientInfo,
        });
      }
    } catch (error) {
      console.error("Unable to send message:", error);
    }
    return "";
  }

  whenMessageReceived() {
    return true;
  }

  getPacketsFromTarget(args) {
    return JSON.stringify(this.packets[args.TARGET] || []);
  }

  numberOfPacketsOnTarget(args) {
    return this.packets[args.TARGET] ? this.packets[args.TARGET].length : 0;
  }

  getFirstPacketOnTarget(args) {
    return JSON.stringify(this.packets[args.TARGET]?.[0] || {});
  }

  dataOfFirstPacketOnTarget(args) {
    const first = this.packets[args.TARGET]?.[0];
    switch (args.DATA) {
      case "origin":
        return first?.origin || "Unknown";
      case "client":
        return (
          JSON.stringify(first?.client) ||
          '{"system":"Unknown", "version":"Unknown"}'
        );
      case "source port":
        return first?.source || "Unknown";
      case "payload": {
        const payload = first?.payload ?? "";
        return typeof payload === "object" ? JSON.stringify(payload) : payload;
      }
      case "timestamp":
        return first?.timestamp || "0";
      default:
        return "";
    }
  }

  getAllTargets() {
    return JSON.stringify(Object.keys(this.packets));
  }

  getAllPackets() {
    return JSON.stringify(this.packets);
  }

  deleteFirstPacketOnTarget(args) {
    if (this.packets[args.TARGET]) {
      const packet = this.packets[args.TARGET]?.[0];
      this.packets[args.TARGET].shift();
      return JSON.stringify(packet);
    }
    return "{}";
  }

  deletePacketsOnTarget(args) {
    delete this.packets[args.TARGET];
  }

  deleteAllPackets() {
    this.packets = {};
  }

  RAWgetAllPackets() {
    return JSON.stringify(this.rawPackets);
  }

  RAWgetFirstPacket() {
    return JSON.stringify(this.rawPackets?.[0] || {});
  }

  RAWdeleteFirstPacket() {
    const packet = this.rawPackets?.[0];
    this.rawPackets.shift();
    return JSON.stringify(packet || {});
  }

  RAWdeleteAllPackets() {
    this.rawPackets = [];
  }

  // Client + presence blocks (backed by the SDK socket session)
  clientIP() {
    if (!this._online()) return "Not Connected";
    return "Unavailable in the SDK build";
  }

  clientUsername() {
    if (!this._online()) return "Not Connected";
    return this.username;
  }

  getClient() {
    if (!this._online()) return "Not Connected";
    return JSON.stringify({
      username: this.username,
      user_id: this.userId,
      ...this.clientInfo,
    });
  }

  _roomUsernames(room) {
    const members = this.roomMembers[room || this.designation] || [];
    return members.map((m) => (typeof m === "string" ? m : m.username)).filter(Boolean);
  }

  clientUsers() {
    if (!this._online()) return "Not Connected";
    return JSON.stringify(this._roomUsernames());
  }

  getUserDesignation(args) {
    if (!this._online()) return "Not Connected";
    if ((args.DESIGNATION || "") !== this.designation) return JSON.stringify([]);
    return JSON.stringify(this._roomUsernames());
  }

  usernameConnected(args) {
    if (!this._online()) return false;
    if (!this._authed()) return false;
    return this._roomUsernames().includes(args.USER);
  }

  userConnected(args) {
    if (!this._online()) return "Not Connected";
    if ((args.DESIGNATION || "") !== this.designation) return false;
    return this._roomUsernames().includes(args.USER);
  }

  findID(args) {
    if (!this._online()) return "Not Connected";
    const members = this.roomMembers[this.designation] || [];
    const matches = members.filter((m) => (typeof m === "string" ? m : m.username) === args.USER);
    return JSON.stringify(matches);
  }

  onJoinUser() {
    return this.lastJoined || "";
  }

  onLeaveUser() {
    return this.lastLeft || "";
  }

  // Synced variables (peer state exchanged as SDK socket messages)
  setSyncedVariable(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      this.sdk.socket.sendPrivateMessage(this.designation, args.USER, {
        kind: "sync_set",
        key: args.KEY,
        value: args.VALUE,
        from: this.username,
      });
    } catch (error) {
      return apiMessage(error, "Failed to sync variable");
    }
    this.syncedVariables[args.USER] ||= {};
    this.syncedVariables[args.USER][args.KEY] = args.VALUE;
  }

  getSyncedVariable(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(this.syncedVariables[args.USER]?.[args.KEY] ?? "");
  }

  deleteSyncedVariable(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      this.sdk.socket.sendPrivateMessage(this.designation, args.USER, {
        kind: "sync_delete",
        key: args.KEY,
        from: this.username,
      });
    } catch (error) {
      return apiMessage(error, "Failed to delete synced variable");
    }
    if (this.syncedVariables[args.USER]) delete this.syncedVariables[args.USER][args.KEY];
  }

  getSyncedVariables(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(this.syncedVariables[args.USER] || {});
  }

  // Mail blocks (delivered as SDK socket messages while both users share
  // the room, then kept in a local mailbox)
  sendMail(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      this.sdk.socket.sendPrivateMessage(this.designation, args.TO, {
        kind: "mail",
        subject: args.SUBJECT,
        message: args.MESSAGE,
        from: this.username,
      });
      return "Mail sent";
    } catch (error) {
      return apiMessage(error, "Failed to send mail");
    }
  }

  getAllMail() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(
      this.mailbox.map((m) => ({ id: m.id, subject: m.subject, from: m.from })),
    );
  }

  getMail(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    const found = this.mailbox.find((m) => String(m.id) === String(args.ID));
    if (!found) return "Mail not found";
    return JSON.stringify(found);
  }

  deleteMail(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    this.mailbox = this.mailbox.filter((m) => String(m.id) !== String(args.ID));
  }

  deleteAllMail() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    this.mailbox = [];
  }
  // Friends blocks (backed by the SDK friends + account request lists)
  getFriendList() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(this.friends.list);
  }

  async sendFriendRequest(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    if (this.friends.list.includes(args.FRIEND)) return "Already Friends";
    if (args.FRIEND === this.username) return "You Need Other Friends :/";
    try {
      await this.sdk.friends.request(args.FRIEND);
      await this._refreshFriends(false);
      return "Sent Successfully";
    } catch (error) {
      return apiMessage(error, "Failed to send friend request");
    }
  }

  async removeFriend(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      await this.sdk.friends.remove(args.FRIEND);
      this.friends.list = this.friends.list.filter((user) => user !== args.FRIEND);
      return "Friend Removed";
    } catch (error) {
      return apiMessage(error, "Failed to remove friend");
    }
  }

  async acceptFriendRequest(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      await this.sdk.friends.accept(args.FRIEND);
      this.friends.requests = this.friends.requests.filter((user) => user !== args.FRIEND);
      await this._refreshFriends(false);
      return "Request Accepted";
    } catch (error) {
      return apiMessage(error, "Failed to accept friend request");
    }
  }

  async declineFriendRequest(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      await this.sdk.friends.reject(args.FRIEND);
      this.friends.requests = this.friends.requests.filter((user) => user !== args.FRIEND);
      await this._refreshFriends(false);
      return "Request Declined";
    } catch (error) {
      return apiMessage(error, "Failed to decline friend request");
    }
  }

  getFriendStatus(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    if (this.friends.list.includes(args.FRIEND)) return "Friend";
    if (this.friends.requests.includes(args.FRIEND)) return "Requested";
    return "Not Friend";
  }

  getFriendRequests() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(this.friends.requests) ?? "";
  }

  getFriendCount() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return this.friends.list.length ?? "";
  }

  // Currency blocks (backed by the SDK account + transfer endpoints)
  getBalance() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return this.balance ?? "";
  }

  async tranferCurrency(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    const amount = Number(args.AMOUNT);
    if (!Number.isFinite(amount) || amount <= 0) return "Invalid amount";
    try {
      await this.sdk.me.transfer(args.USER, amount);
      await this._refreshBalance(false);
      return "Success";
    } catch (error) {
      return apiMessage(error, "Transfer failed");
    }
  }

  async getTransactions() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      const list = await this.sdk.me.transactions();
      this.transactions = list;
      return JSON.stringify(list);
    } catch (error) {
      return apiMessage(error, "Failed to get transactions");
    }
  }

  async getTransactionCount() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      this.transactions = await this.sdk.me.transactions();
    } catch (_) {}
    return this.transactions.length;
  }

  // Keys blocks (backed by the SDK keys + items namespaces)
  async getMyOwnedItems() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      return JSON.stringify(await this.sdk.keys.mine());
    } catch (error) {
      return apiMessage(error, "Failed to get owned keys");
    }
  }

  async ownsItem(args) {
    if (!this._online()) return false;
    if (!this._authed()) return false;
    try {
      const res = await this.sdk.keys.check(this.username, args.ITEM);
      return res.owns === true || res.owned === true;
    } catch (_) {
      return false;
    }
  }

  async itemData(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      const key = await this.sdk.keys.get(args.ITEM);
      return JSON.stringify(key.data ?? key);
    } catch (error) {
      return apiMessage(error, "Failed to get key data");
    }
  }

  async purchaseItem(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      const res = await this.sdk.keys.buy(args.ITEM);
      await this._refreshBalance(false);
      return JSON.stringify(res);
    } catch (error) {
      return apiMessage(error, "Purchase failed");
    }
  }

  async itemInfo(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      return JSON.stringify(await this.sdk.keys.get(args.ITEM));
    } catch (error) {
      return apiMessage(error, "Failed to get key info");
    }
  }

  async getPublicItems() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      return JSON.stringify(await this.sdk.items.selling(50));
    } catch (error) {
      return apiMessage(error, "Failed to get public items");
    }
  }

  getPublicItemPages() {
    return "1";
  }

  async getMyCreatedItems() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      return JSON.stringify(await this.sdk.items.list(this.username));
    } catch (error) {
      return apiMessage(error, "Failed to get created items");
    }
  }

  async createItem() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      const name = "rotur-ext-" + Date.now().toString(36);
      return JSON.stringify(await this.sdk.items.create({ name }));
    } catch (error) {
      return apiMessage(error, "Failed to create item");
    }
  }

  async updateItem(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      return JSON.stringify(await this.sdk.keys.update(args.ITEM, args.KEY, args.DATA));
    } catch (error) {
      return apiMessage(error, "Failed to update key");
    }
  }

  async deleteItem(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      return JSON.stringify(await this.sdk.keys.delete(args.ITEM));
    } catch (error) {
      return apiMessage(error, "Failed to delete key");
    }
  }

  hideItem(args) {
    return this.deleteItem(args);
  }

  showItem() {
    return "Manage key listings on rotur.dev";
  }

  // Badges blocks (backed by the SDK account badges)
  gotBadgesSuccessfully() {
    return this._authed();
  }

  async redownloadBadges() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    try {
      const me = await this.sdk.me.get();
      this.badges = Array.isArray(me.badges) ? me.badges : [];
      this._applyAccount(me);
      return "Badges Redownloaded";
    } catch (error) {
      return apiMessage(error, "Failed to redownload badges");
    }
  }

  userBadges() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(this.badges);
  }

  userBadgeCount() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return this.badges.length;
  }

  hasBadge(args) {
    if (!this._online()) return false;
    if (!this._authed()) return false;
    return this.badges.some(
      (badge) => badge === args.BADGE || badge?.id === args.BADGE || badge?.name === args.BADGE,
    );
  }

  allBadges() {
    return "{}";
  }

  badgeInfo() {
    return "{}";
  }

  // Call blocks (signalling exchanged as SDK socket messages)
  callUser(args) {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    if (args.USERNAME === this.username) return "You Can't Call Yourself";
    const callId = "call-" + Date.now().toString(36);
    this.callJson = { id: callId, to: args.USERNAME, from: this.username, status: "ringing" };
    try {
      this.sdk.socket.sendPrivateMessage(this.designation, args.USERNAME, {
        kind: "call_request",
        from: this.username,
        call: this.callJson,
      });
      return JSON.stringify(this.callJson);
    } catch (error) {
      return apiMessage(error, "Call failed");
    }
  }

  callData() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    return JSON.stringify(this.callJson);
  }

  acceptCall() {
    if (!this._online()) return "Not Connected";
    if (!this._authed()) return "Not Logged In";
    if (!this.callJson.from) return "No incoming call";
    this.callJson = { ...this.callJson, status: "accepted" };
    try {
      this.sdk.socket.sendPrivateMessage(this.designation, this.callJson.from, {
        kind: "call_confirm",
        from: this.username,
        call: this.callJson,
      });
      return "Call Accepted";
    } catch (error) {
      return apiMessage(error, "Failed to accept call");
    }
  }
}

Scratch.extensions.register(new RoturExtension());
