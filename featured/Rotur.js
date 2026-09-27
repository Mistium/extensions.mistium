// Name: Rotur.js
// Author: Mistium
// Description: Utilise rotur in your projects
//
// GENERATED FILE - DO NOT EDIT.
// Source: src/rotur/extension.js (with src/rotur/helpers.js, src/rotur/getinfo.js)
// Built: 2026-09-27T09:22:38.119Z by scripts/build-rotur-extension.mjs
// Embedded SDK: rotur-sdk@2.4.0 from npm (bundled, no runtime fetch)
//
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/rotur-sdk/dist/index.mjs
  var ApiError = class extends Error {
    constructor(status, data) {
      super(
        typeof data === "object" && data !== null && "error" in data ? String(data.error) : `API error ${status}`
      );
      __publicField(this, "status");
      __publicField(this, "data");
      this.status = status;
      this.data = data;
      this.name = "ApiError";
    }
  };
  var Http = class {
    constructor(getToken) {
      // v2 base. All namespace paths are relative to this (e.g. "/me", "/posts/x").
      __publicField(this, "baseUrl", "https://api.rotur.dev/v2");
      __publicField(this, "getToken");
      this.getToken = getToken;
    }
    buildUrl(path, params) {
      let url = `${this.baseUrl}${path}`;
      if (params) {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value === void 0 || value === null) continue;
          query.set(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value)
          );
        }
        const suffix = query.toString();
        if (suffix) url += (path.includes("?") ? "&" : "?") + suffix;
      }
      return url;
    }
    async get(path, params, auth = true) {
      const token = this.getToken();
      if (auth && !token)
        throw new ApiError(401, {
          error: "Not authenticated \u2014 call rotur.login() first"
        });
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(this.buildUrl(path, params), { headers });
      return this.handle(res);
    }
    async getText(path, params, auth = true) {
      const token = this.getToken();
      if (auth && !token)
        throw new ApiError(401, {
          error: "Not authenticated \u2014 call rotur.login() first"
        });
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(this.buildUrl(path, params), { headers });
      const text = await res.text();
      if (!res.ok) {
        let data = text;
        try {
          data = JSON.parse(text);
        } catch {
        }
        throw new ApiError(res.status, data);
      }
      return text;
    }
    async post(path, body, auth = true) {
      const token = this.getToken();
      if (auth && !token)
        throw new ApiError(401, {
          error: "Not authenticated \u2014 call rotur.login() first"
        });
      const opts = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        body: body !== void 0 ? JSON.stringify(body) : void 0
      };
      const res = await fetch(`${this.baseUrl}${path}`, opts);
      return this.handle(res);
    }
    async postText(path, text, auth = true) {
      const token = this.getToken();
      if (auth && !token)
        throw new ApiError(401, {
          error: "Not authenticated \u2014 call rotur.login() first"
        });
      const opts = {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        },
        body: text
      };
      const res = await fetch(`${this.baseUrl}${path}`, opts);
      return this.handle(res);
    }
    async postForm(path, form) {
      const token = this.getToken();
      if (!token) throw new ApiError(401, { error: "Not authenticated" });
      const opts = {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form
      };
      const res = await fetch(`${this.baseUrl}${path}`, opts);
      return this.handle(res);
    }
    async patch(path, body) {
      const token = this.getToken();
      if (!token) throw new ApiError(401, { error: "Not authenticated" });
      const opts = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      if (body !== void 0) opts.body = JSON.stringify(body);
      const res = await fetch(`${this.baseUrl}${path}`, opts);
      return this.handle(res);
    }
    async put(path, body) {
      const token = this.getToken();
      if (!token) throw new ApiError(401, { error: "Not authenticated" });
      const opts = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      if (body !== void 0) opts.body = JSON.stringify(body);
      const res = await fetch(`${this.baseUrl}${path}`, opts);
      return this.handle(res);
    }
    async del(path, body) {
      const token = this.getToken();
      if (!token) throw new ApiError(401, { error: "Not authenticated" });
      const opts = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      if (body !== void 0) opts.body = JSON.stringify(body);
      const res = await fetch(`${this.baseUrl}${path}`, opts);
      return this.handle(res);
    }
    async handle(res) {
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        if (!res.ok) throw new ApiError(res.status, text);
        return void 0;
      }
      if (!res.ok) throw new ApiError(res.status, data);
      return data;
    }
  };
  var RoturSocket = class extends EventTarget {
    constructor(url = "wss://api.rotur.dev/status/ws") {
      super();
      __publicField(this, "url");
      __publicField(this, "ws", null);
      __publicField(this, "token", null);
      __publicField(this, "reconnectTimer", null);
      __publicField(this, "heartbeat", null);
      __publicField(this, "_connected", false);
      __publicField(this, "_userId", null);
      __publicField(this, "_username", null);
      __publicField(this, "handlers", /* @__PURE__ */ new Map());
      __publicField(this, "rooms", /* @__PURE__ */ new Set());
      __publicField(this, "keyCache", {});
      __publicField(this, "keyChangeCallbacks", /* @__PURE__ */ new Set());
      this.url = url;
    }
    get connected() {
      return this._connected;
    }
    get userId() {
      return this._userId;
    }
    get username() {
      return this._username;
    }
    get joinedRooms() {
      return [...this.rooms];
    }
    getKey(key) {
      return this.keyCache[key];
    }
    getAllKeys() {
      return { ...this.keyCache };
    }
    onKeyChange(callback) {
      this.keyChangeCallbacks.add(callback);
      return () => this.keyChangeCallbacks.delete(callback);
    }
    offKeyChange(callback) {
      this.keyChangeCallbacks.delete(callback);
    }
    notifyKeyChange(key, value, oldValue) {
      for (const cb of this.keyChangeCallbacks) {
        try {
          cb(key, value, oldValue);
        } catch {
        }
      }
    }
    connect(token) {
      this.token = token;
      return new Promise((resolve, reject) => {
        this.cleanup();
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = (e) => {
          let msg;
          try {
            msg = JSON.parse(e.data);
          } catch {
            return;
          }
          const cmd = msg.cmd;
          if (cmd === "ready") {
            this._connected = true;
            this._userId = msg.user_id;
            this._username = msg.username;
            if (msg.user && typeof msg.user === "object") {
              this.keyCache = { ...msg.user };
            }
            this.startHeartbeat();
            resolve(msg);
          }
          if (cmd === "join_ok") this.rooms.add(msg.room);
          if (cmd === "leave_ok") this.rooms.delete(msg.room);
          if ((cmd === "key_update" || cmd === "key_delete") && typeof msg.key === "string") {
            const old = this.keyCache[msg.key];
            if (cmd === "key_update" && "value" in msg) {
              this.keyCache[msg.key] = msg.value;
              this.notifyKeyChange(msg.key, msg.value, old);
            } else {
              delete this.keyCache[msg.key];
              this.notifyKeyChange(msg.key, void 0, old);
            }
          }
          this.emit(cmd, msg);
        };
        this.ws.onerror = (e) => {
          if (!this._connected) reject(new Error("WebSocket connection failed"));
          this.emit("error", e);
        };
        this.ws.onclose = () => {
          this._connected = false;
          this.emit("close", {});
          this.scheduleReconnect();
        };
        this.ws.onopen = () => {
          this.send({ cmd: "auth", key: token });
        };
      });
    }
    startHeartbeat() {
      this.heartbeat = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ cmd: "ping" }));
        }
      }, 25e3);
    }
    scheduleReconnect() {
      if (!this.token) return;
      this.reconnectTimer = setTimeout(
        () => this.connect(this.token).catch(() => {
        }),
        3e3
      );
    }
    cleanup() {
      if (this.heartbeat) clearInterval(this.heartbeat);
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      this.heartbeat = null;
      this.reconnectTimer = null;
    }
    emit(cmd, msg) {
      this.handlers.get(cmd)?.forEach((h) => h(msg));
      this.dispatchEvent(new CustomEvent(cmd, { detail: msg }));
      this.dispatchEvent(new CustomEvent("*", { detail: msg }));
    }
    send(packet) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(packet));
      }
    }
    on(cmd, handler) {
      if (!this.handlers.has(cmd)) this.handlers.set(cmd, /* @__PURE__ */ new Set());
      this.handlers.get(cmd).add(handler);
      return () => this.handlers.get(cmd)?.delete(handler);
    }
    off(cmd, handler) {
      this.handlers.get(cmd)?.delete(handler);
    }
    once(cmd) {
      return new Promise((resolve) => {
        const h = (msg) => {
          this.off(cmd, h);
          resolve(msg);
        };
        this.on(cmd, h);
      });
    }
    join(rooms) {
      this.send({ cmd: "join", rooms: Array.isArray(rooms) ? rooms : [rooms] });
    }
    leave(rooms) {
      this.send({ cmd: "leave", rooms: Array.isArray(rooms) ? rooms : [rooms] });
    }
    listRooms() {
      this.send({ cmd: "rooms" });
      return this.once("rooms").then(
        (m) => m.cmd === "rooms" ? m.rooms : []
      );
    }
    roomState(room) {
      this.send({ cmd: "room_state", room });
    }
    /** Broadcast a message to everyone in the room. */
    sendGroupMessage(room, val, listener) {
      this.send({ cmd: "gmsg", room, val, listener });
    }
    /** Send a message to a single user in the room. `to` accepts username or user id. */
    sendPrivateMessage(room, to, val, listener) {
      this.send({ cmd: "pmsg", room, to, val, listener });
    }
    setStatus(status, presence) {
      this.send({ cmd: "set_status", status, presence });
    }
    addActivity(activity) {
      this.send({ cmd: "add_activity", ...activity });
    }
    removeActivity(id) {
      this.send({ cmd: "remove_activity", id });
    }
    setMusic(application, media, title) {
      this.send({
        cmd: "add_activity",
        id: application,
        title: title ?? `Listening to ${application}`,
        application: { name: application },
        media
      });
    }
    setPlaying(application, options) {
      this.send({
        cmd: "add_activity",
        id: application,
        title: options?.title ?? application,
        application: { name: application, url: options?.url },
        status: options?.status,
        image: options?.image
      });
    }
    clearActivity(id) {
      this.send({ cmd: "remove_activity", id });
    }
    disconnect() {
      this.token = null;
      this.cleanup();
      this.rooms.clear();
      this.keyCache = {};
      if (this.ws) {
        this.ws.onclose = null;
        this.ws.close();
        this.ws = null;
      }
      this._connected = false;
    }
  };
  var AUTH_URL = "https://rotur.dev/auth";
  var ORIGIN = "https://rotur.dev";
  function buildRequires(explicit) {
    const injected = typeof __ROTUR_REQUIRES__ !== "undefined" ? __ROTUR_REQUIRES__ : [];
    const set = /* @__PURE__ */ new Set([...injected, ...explicit ?? []]);
    if (set.has("full")) return ["full"];
    return [...set].sort();
  }
  var AuthError = class extends Error {
    constructor(code, message) {
      super(message);
      __publicField(this, "code");
      this.code = code;
      this.name = "AuthError";
    }
  };
  function performAuth(options) {
    if (options?.signal?.aborted) {
      throw new AuthError("aborted", "Auth was aborted");
    }
    const timeout = options?.timeout ?? 12e4;
    const authUrl = new URL(AUTH_URL);
    if (options?.system) authUrl.searchParams.set("system", options.system);
    const returnTo = options?.returnTo ?? window.location.href;
    authUrl.searchParams.set("return_to", returnTo);
    const requires = buildRequires(options?.requires);
    if (requires.length) authUrl.searchParams.set("requires", requires.join(","));
    const returnToOrigin = new URL(returnTo).origin;
    let iframe;
    const w = window.open(authUrl.toString(), "rotur-auth");
    if (!w && options?.popupOnly) {
      throw new AuthError(
        "popup_blocked",
        "Auth popup was blocked \u2014 allow popups for this site and try again"
      );
    }
    return new Promise((resolve, reject) => {
      const signal = options?.signal;
      const rejectWithError = (code, msg) => {
        cleanup();
        reject(new AuthError(code, msg));
      };
      const timer = setTimeout(() => {
        rejectWithError("timeout", `Auth timed out after ${timeout}ms`);
      }, timeout);
      const onAbort = () => rejectWithError("aborted", "Auth was aborted");
      signal?.addEventListener("abort", onAbort, { once: true });
      function handler(e) {
        if (e.origin !== ORIGIN && e.origin !== returnToOrigin) return;
        if (e.data?.type !== "rotur-auth-token") return;
        if (!e.data.token) return;
        cleanup();
        resolve({ token: e.data.token });
      }
      function closePopup() {
        if (!w || w.closed) return;
        try {
          w.postMessage({ type: "rotur-auth-close" }, ORIGIN);
        } catch {
        }
        try {
          w.close();
        } catch {
        }
        if (!w.closed) {
          let attempts = 0;
          const retry = setInterval(() => {
            attempts++;
            if (!w || w.closed || attempts >= 20) {
              clearInterval(retry);
              return;
            }
            try {
              w.postMessage({ type: "rotur-auth-close" }, ORIGIN);
            } catch {
            }
            try {
              w.close();
            } catch {
            }
          }, 100);
        }
      }
      function cleanup() {
        clearTimeout(timer);
        window.removeEventListener("message", handler);
        signal?.removeEventListener("abort", onAbort);
        iframe?.remove();
        closePopup();
      }
      window.addEventListener("message", handler);
      if (w) return;
      iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;inset:0;width:100%;height:100%;border:none;z-index:9999";
      iframe.src = authUrl.toString();
      document.body.appendChild(iframe);
    });
  }
  var Namespace = class {
    constructor(r) {
      __publicField(this, "r");
      this.r = r;
    }
    $get(path, params, auth = true) {
      return this.r._http.get(path, params, auth);
    }
    $getText(path, params, auth = true) {
      return this.r._http.getText(path, params, auth);
    }
    $post(path, body, auth = true) {
      return this.r._http.post(path, body, auth);
    }
    $postText(path, text) {
      return this.r._http.postText(path, text);
    }
    $postForm(path, form) {
      return this.r._http.postForm(path, form);
    }
    $patch(path, body) {
      return this.r._http.patch(path, body);
    }
    $put(path, body) {
      return this.r._http.put(path, body);
    }
    $del(path, body) {
      return this.r._http.del(path, body);
    }
    $putQuery(path, params) {
      return this.r._http.put(withQuery(path, params));
    }
    $postQuery(path, params, auth = true) {
      return this.r._http.post(withQuery(path, params), void 0, auth);
    }
    $delQuery(path, params) {
      return this.r._http.del(withQuery(path, params));
    }
  };
  function withQuery(path, params) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value === void 0 || value === null) continue;
      query.set(key, String(value));
    }
    const suffix = query.toString();
    return suffix ? `${path}?${suffix}` : path;
  }
  var MeNamespace = class extends Namespace {
    async get() {
      return this.$get("/me");
    }
    async update(key, value) {
      return this.$patch("/me", { key, value });
    }
    async deleteKey(key) {
      return this.$del("/me/data", { key });
    }
    /** @deprecated Use profiles.delete(username). */
    async deleteAccount(username) {
      return this.$delQuery(`/users/${encodeURIComponent(username)}`);
    }
    async refreshToken() {
      return this.$post("/me/token/refresh");
    }
    getKey(key) {
      return this.r.socket.getKey(key);
    }
    getAllKeys() {
      return this.r.socket.getAllKeys();
    }
    onKeyChange(callback) {
      return this.r.socket.onKeyChange(callback);
    }
    async transfer(to, amount, note) {
      return this.$post("/me/transfers", { to, amount, note });
    }
    async claimDaily() {
      return this.$post("/me/daily");
    }
    async claimTime() {
      return this.$get("/me/daily");
    }
    async badges() {
      return this.$get("/badges");
    }
    async badgePreferences() {
      return this.$get("/me/badges/preferences");
    }
    async updateBadgePreferences(preferences) {
      return this.$put("/me/badges/preferences", preferences);
    }
    async abilities() {
      return this.$get("/me/abilities");
    }
    async blocked() {
      return this.$get("/me/blocked");
    }
    async block(username) {
      return this.$putQuery(`/me/blocked/${encodeURIComponent(username)}`);
    }
    async unblock(username) {
      return this.$delQuery(`/me/blocked/${encodeURIComponent(username)}`);
    }
    async note(username, content) {
      return this.$put(`/me/notes/${encodeURIComponent(username)}`, {
        note: content
      });
    }
    async notes() {
      return this.$get("/me/notes");
    }
    async benefits() {
      return this.$get("/me/benefits");
    }
    async changePassword(currentPassword, newPassword) {
      return this.$post("/me/password", {
        current_password: currentPassword,
        new_password: newPassword
      });
    }
    async resendVerification() {
      return this.$postQuery("/me/verification/resend");
    }
    async deleteNote(username) {
      return this.$delQuery(`/me/notes/${encodeURIComponent(username)}`);
    }
    async checkAuth() {
      return this.$get("/auth/check");
    }
    async requests() {
      const data = await this.$get("/friends/requests");
      return { requests: data.requests ?? [] };
    }
    async outgoing() {
      const data = await this.$get(
        "/friends/requests/outgoing"
      );
      return { outgoing: data.requests_out ?? [] };
    }
    async transactions() {
      const data = await this.$get("/me");
      return data["sys.transactions"] ?? [];
    }
    async subscription() {
      const data = await this.$get("/me");
      const sub = data["sys.subscription"];
      return {
        active: sub?.active ?? false,
        tier: sub?.tier ?? "Free",
        next_billing: sub?.next_billing ?? 0
      };
    }
    async acceptTos() {
      return this.$post("/me/tos");
    }
    async billing() {
      return this.$get("/me/billing");
    }
    async checkout(lookupKey) {
      return this.$post("/me/billing/checkout", { lookup_key: lookupKey });
    }
    async billingPortal() {
      return this.$post("/me/billing/portal");
    }
  };
  var PostsNamespace = class extends Namespace {
    async create(content, options) {
      const body = { content };
      if (options?.attachment) body.attachment = options.attachment;
      if (options?.attachments) body.attachments = options.attachments.join(",");
      if (options?.profileOnly) body.profile_only = "1";
      if (options?.os) body.os = options.os;
      if (options?.poll) body.poll = options.poll;
      if (options?.scheduledFor) body.scheduled_for = options.scheduledFor;
      return this.$post("/posts", body);
    }
    async delete(id) {
      return this.$delQuery(`/posts/${encodeURIComponent(id)}`);
    }
    async get(id) {
      return this.$get(`/posts/${encodeURIComponent(id)}`, void 0, false);
    }
    async edit(id, content) {
      return this.$patch(`/posts/${encodeURIComponent(id)}`, { content });
    }
    async view(id) {
      return this.$postQuery(`/posts/${encodeURIComponent(id)}/views`);
    }
    async viewMany(ids) {
      if (ids.length === 0) return { views: {} };
      return this.$postQuery(
        `/posts/${encodeURIComponent(ids[0])}/views`,
        { ids: ids.join(",") }
      );
    }
    async vote(id, option) {
      return this.$post(`/posts/${encodeURIComponent(id)}/poll/votes`, { option });
    }
    async bookmark(id) {
      return this.$putQuery(`/posts/${encodeURIComponent(id)}/bookmark`);
    }
    async unbookmark(id) {
      return this.$delQuery(`/posts/${encodeURIComponent(id)}/bookmark`);
    }
    async bookmarks() {
      return this.$get("/me/bookmarks");
    }
    async scheduled() {
      return this.$get("/me/scheduled-posts");
    }
    async like(id) {
      return this.$putQuery(`/posts/${encodeURIComponent(id)}/like`);
    }
    async unlike(id) {
      return this.$delQuery(`/posts/${encodeURIComponent(id)}/like`);
    }
    async reply(id, content) {
      return this.$post(`/posts/${encodeURIComponent(id)}/replies`, { content });
    }
    async repost(id) {
      return this.$postQuery(`/posts/${encodeURIComponent(id)}/repost`);
    }
    async pin(id) {
      return this.$putQuery(`/posts/${encodeURIComponent(id)}/pin`);
    }
    async unpin(id) {
      return this.$delQuery(`/posts/${encodeURIComponent(id)}/pin`);
    }
    async feed(limit = 100, offset = 0) {
      return this.$get("/posts", { limit, offset }, false);
    }
    async followingFeed(limit = 100) {
      return this.$get("/feed/following", { limit });
    }
    async top(limit = 50, timePeriod = 24) {
      return this.$get("/posts/top", { limit, time_period: timePeriod }, false);
    }
    async search(query, limit = 20) {
      return this.$get("/posts/search", { q: query, limit }, false);
    }
    async limits() {
      return this.$get("/limits", void 0, false);
    }
  };
  var FriendsNamespace = class extends Namespace {
    async list() {
      return this.$get("/friends");
    }
    async request(username) {
      return this.$postQuery(`/friends/requests/${encodeURIComponent(username)}`);
    }
    async accept(username) {
      return this.$postQuery(
        `/friends/requests/${encodeURIComponent(username)}/accept`
      );
    }
    async reject(username) {
      return this.$postQuery(
        `/friends/requests/${encodeURIComponent(username)}/reject`
      );
    }
    async remove(username) {
      return this.$delQuery(`/friends/${encodeURIComponent(username)}`);
    }
    async cancel(username) {
      return this.$delQuery(
        `/friends/requests/${encodeURIComponent(username)}`
      );
    }
  };
  var FollowingNamespace = class extends Namespace {
    async follow(username) {
      return this.$putQuery(`/users/${encodeURIComponent(username)}/follow`);
    }
    async unfollow(username) {
      return this.$delQuery(`/users/${encodeURIComponent(username)}/follow`);
    }
    async followers(username) {
      return this.$get(
        `/users/${encodeURIComponent(username)}/followers`,
        void 0,
        false
      );
    }
    async following(username) {
      return this.$get(
        `/users/${encodeURIComponent(username)}/following`,
        void 0,
        false
      );
    }
  };
  var NotificationsNamespace = class extends Namespace {
    async list(afterDays = 30) {
      return this.$get("/notifications", { after: afterDays });
    }
    async markRead() {
      return this.$post("/notifications/read");
    }
    async create(target, type, options) {
      return this.$post("/notifications", {
        target,
        type,
        actor: options?.actor,
        data: options?.data,
        platform: options?.platform,
        platform_data: options?.platformData
      });
    }
  };
  var KeysNamespace = class extends Namespace {
    async create(name, options) {
      const body = { name };
      if (options?.description) body.description = options.description;
      if (options?.price !== void 0) body.price = options.price;
      if (options?.subscription) body.subscription = true;
      if (options?.frequency) body.frequency = options.frequency;
      if (options?.period) body.period = options.period;
      return this.$post("/keys", body);
    }
    async mine() {
      return this.$get("/keys/mine");
    }
    async get(id) {
      return this.$get(`/keys/${encodeURIComponent(id)}`, void 0, false);
    }
    async check(username, key) {
      return this.$get(
        `/keys/check/${encodeURIComponent(username)}`,
        { key },
        false
      );
    }
    async rename(id, name) {
      return this.$patch(`/keys/${encodeURIComponent(id)}/name`, { name });
    }
    async update(id, key, data) {
      return this.$patch(`/keys/${encodeURIComponent(id)}`, { key, data });
    }
    async revoke(id, user) {
      return this.$postQuery(`/keys/${encodeURIComponent(id)}/revoke`, { user });
    }
    async delete(id) {
      return this.$delQuery(`/keys/${encodeURIComponent(id)}`);
    }
    async addUser(id, user) {
      return this.$post(`/keys/${encodeURIComponent(id)}/members`, { user });
    }
    async removeUser(id, user) {
      return this.$del(`/keys/${encodeURIComponent(id)}/members`, { user });
    }
    async buy(id) {
      return this.$postQuery(`/keys/${encodeURIComponent(id)}/buy`);
    }
    async cancel(id) {
      return this.$postQuery(`/keys/${encodeURIComponent(id)}/cancel`);
    }
    async debugSubscriptions() {
      return this.$get("/keys/debug/subscriptions");
    }
  };
  var ItemsNamespace = class extends Namespace {
    async create(item) {
      return this.$post("/items", item);
    }
    async get(name) {
      return this.$get(`/items/${encodeURIComponent(name)}`, void 0, false);
    }
    async list(username) {
      return this.$get(
        `/users/${encodeURIComponent(username)}/items`,
        void 0,
        false
      );
    }
    async selling(limit = 50) {
      return this.$get("/items/selling", { limit }, false);
    }
    async buy(name) {
      return this.$postQuery(`/items/${encodeURIComponent(name)}/buy`);
    }
    async transfer(name, username) {
      return this.$post(`/items/${encodeURIComponent(name)}/transfer`, {
        to: username
      });
    }
    async sell(name) {
      return this.$postQuery(`/items/${encodeURIComponent(name)}/sell`);
    }
    async stopSelling(name) {
      return this.$postQuery(
        `/items/${encodeURIComponent(name)}/stop-selling`
      );
    }
    async setPrice(name, price) {
      return this.$patch(`/items/${encodeURIComponent(name)}/price`, { price });
    }
    async update(name, data) {
      return this.$patch(`/items/${encodeURIComponent(name)}`, { data });
    }
    async delete(name) {
      return this.$delQuery(`/items/${encodeURIComponent(name)}`);
    }
    async adminAdd(name, username) {
      return this.$postQuery(`/items/admin-add/${encodeURIComponent(name)}`, {
        username
      });
    }
  };
  var GiftsNamespace = class extends Namespace {
    async create(amount, options) {
      return this.$post("/gifts", {
        amount,
        note: options?.note,
        expires_in_hrs: options?.expiresInHrs
      });
    }
    async get(code) {
      return this.$get(`/gifts/${encodeURIComponent(code)}`, void 0, false);
    }
    async claim(code) {
      return this.$postQuery(`/gifts/${encodeURIComponent(code)}/claim`);
    }
    async cancel(id) {
      return this.$postQuery(`/gifts/cancel/${encodeURIComponent(id)}`);
    }
    async mine() {
      return this.$get("/gifts/mine");
    }
  };
  var TokensNamespace = class extends Namespace {
    async permissions() {
      return this.$get("/tokens/permissions", void 0, false);
    }
    async list() {
      return this.$get("/tokens");
    }
    async active() {
      return this.$get("/tokens/active");
    }
    async create(name, permissions, options) {
      return this.$post("/tokens", {
        name,
        permissions,
        expires_in_hrs: options?.expiresInHrs,
        origin: options?.origin,
        description: options?.description,
        websites: options?.websites
      });
    }
    async get(id) {
      return this.$get(`/tokens/${encodeURIComponent(id)}`);
    }
    async activity(id) {
      return this.$get(`/tokens/${encodeURIComponent(id)}/activity`);
    }
    async update(id, options) {
      return this.$patch(`/tokens/${encodeURIComponent(id)}`, options);
    }
    async rename(id, name) {
      return this.$post(`/tokens/${encodeURIComponent(id)}/rename`, { name });
    }
    async revoke(id) {
      return this.$postQuery(`/tokens/${encodeURIComponent(id)}/revoke`);
    }
    async delete(id) {
      return this.$delQuery(`/tokens/${encodeURIComponent(id)}`);
    }
  };
  var GroupsNamespace = class extends Namespace {
    async mine() {
      return this.$get("/groups/mine");
    }
    async search(query) {
      return this.$get("/groups/search", { query });
    }
    async top(limit = 10) {
      return this.$get("/groups/top", { limit }, false);
    }
    async uploadIcon(grouptag, file) {
      const form = new FormData();
      form.set("icon", file);
      return this.$postForm(`/groups/${encodeURIComponent(grouptag)}/icon`, form);
    }
    async uploadBanner(grouptag, file) {
      const form = new FormData();
      form.set("banner", file);
      return this.$postForm(`/groups/${encodeURIComponent(grouptag)}/banner`, form);
    }
    async create(tag, name, options) {
      const params = { tag, name };
      if (options?.description) params.description = options.description;
      if (options?.iconUrl) params.icon_url = options.iconUrl;
      if (options?.bannerUrl) params.banner_url = options.bannerUrl;
      if (options?.public !== void 0) params.public = String(options.public);
      if (options?.joinPolicy) params.join_policy = options.joinPolicy;
      return this.$post("/groups", params);
    }
    async get(grouptag) {
      return this.$get(`/groups/${grouptag}`);
    }
    async update(grouptag, updates) {
      return this.$patch(`/groups/${grouptag}`, updates);
    }
    async delete(grouptag) {
      return this.$delQuery(`/groups/${grouptag}`);
    }
    async join(grouptag) {
      return this.$postQuery(`/groups/${grouptag}/join`);
    }
    async requestJoin(grouptag, message) {
      return this.$postQuery(`/groups/${grouptag}/join-requests`, { message });
    }
    async leave(grouptag) {
      return this.$postQuery(`/groups/${grouptag}/leave`);
    }
    async represent(grouptag) {
      return this.$putQuery(`/groups/${grouptag}/represent`);
    }
    async disrepresent(grouptag) {
      return this.$delQuery(`/groups/${grouptag}/represent`);
    }
    async report(grouptag) {
      return this.$postQuery(`/groups/${grouptag}/report`);
    }
    async announcements(grouptag) {
      return this.$get(`/groups/${grouptag}/announcements`, void 0, false);
    }
    async createAnnouncement(grouptag, title, body, options) {
      return this.$post(`/groups/${grouptag}/announcements`, {
        title,
        body,
        ping_members: options?.pingMembers
      });
    }
    async deleteAnnouncement(grouptag, id) {
      return this.$delQuery(`/groups/${grouptag}/announcements/${id}`);
    }
    async muteAnnouncements(grouptag) {
      return this.$postQuery(`/groups/${grouptag}/announcements/mute`);
    }
    async events(grouptag) {
      return this.$get(`/groups/${grouptag}/events`);
    }
    async createEvent(grouptag, event) {
      return this.$post(`/groups/${grouptag}/events`, event);
    }
    async updateEvent(grouptag, eventId, updates) {
      return this.$patch(`/groups/${grouptag}/events/${eventId}`, updates);
    }
    async deleteEvent(grouptag, eventId) {
      return this.$delQuery(`/groups/${grouptag}/events/${eventId}`);
    }
    async tips(grouptag) {
      return this.$get(`/groups/${grouptag}/tips`);
    }
    async sendTip(grouptag, amount, note) {
      return this.$post(`/groups/${grouptag}/tips`, { amount, note });
    }
    async withdrawTip(grouptag, amount) {
      return this.$postQuery(`/groups/${grouptag}/tips/withdraw`, {
        amount: String(amount)
      });
    }
    async withdrawals(grouptag, limit = 20) {
      return this.$get(`/groups/${grouptag}/tips/withdrawals`, { limit });
    }
    async products(grouptag) {
      return this.$get(`/groups/${grouptag}/products`);
    }
    async createProduct(grouptag, product) {
      return this.$post(`/groups/${grouptag}/products`, {
        name: product.name,
        description: product.description,
        price_credits: product.priceCredits,
        role_id: product.roleId,
        subscription: product.subscription,
        frequency: product.frequency,
        period: product.period
      });
    }
    async deleteProduct(grouptag, productId) {
      return this.$delQuery(`/groups/${grouptag}/products/${productId}`);
    }
    async purchaseProduct(grouptag, productId) {
      return this.$postQuery(`/groups/${grouptag}/products/${productId}/purchase`);
    }
    async cancelProductSubscription(grouptag, productId) {
      return this.$postQuery(`/groups/${grouptag}/products/${productId}/cancel`);
    }
    async productOwnership(grouptag, productId, username) {
      return this.$get(
        `/groups/${grouptag}/products/${productId}/owners/${username}`,
        void 0,
        false
      );
    }
    async myProductSubscriptions() {
      return this.$get("/groups/products/subscriptions/mine");
    }
    async roles(grouptag) {
      return this.$get(`/groups/${grouptag}/roles`);
    }
    async members(grouptag, options) {
      return this.$get(`/groups/${grouptag}/members`, {
        page: options?.page,
        per_page: options?.perPage,
        search: options?.search
      });
    }
    async createRole(grouptag, role) {
      return this.$post(`/groups/${grouptag}/roles`, role);
    }
    async updateRole(grouptag, roleId, updates) {
      return this.$patch(`/groups/${grouptag}/roles/${roleId}`, updates);
    }
    async deleteRole(grouptag, roleId) {
      return this.$delQuery(`/groups/${grouptag}/roles/${roleId}`);
    }
    async userRoles(grouptag, userId) {
      return this.$get(`/groups/${grouptag}/members/${userId}/roles`);
    }
    async userPermissions(grouptag, userId) {
      return this.$get(`/groups/${grouptag}/members/${userId}/permissions`);
    }
    async userBenefits(grouptag, userId) {
      return this.$get(`/groups/${grouptag}/members/${userId}/benefits`);
    }
    async assignRole(grouptag, userId, roleId) {
      return this.$putQuery(
        `/groups/${grouptag}/members/${userId}/roles/${roleId}`
      );
    }
    async removeRole(grouptag, userId, roleId) {
      return this.$delQuery(
        `/groups/${grouptag}/members/${userId}/roles/${roleId}`
      );
    }
    async invites(grouptag) {
      return this.$get(`/groups/${grouptag}/invites`);
    }
    async invite(grouptag, username) {
      return this.$post(`/groups/${grouptag}/invites`, { username });
    }
    async revokeInvite(grouptag, inviteId) {
      return this.$delQuery(`/groups/${grouptag}/invites/${inviteId}`);
    }
    async myInvites() {
      return this.$get("/groups/invites/mine");
    }
    async acceptInvite(grouptag, inviteId) {
      return this.$postQuery(`/groups/${grouptag}/invites/${inviteId}/accept`);
    }
    async declineInvite(grouptag, inviteId) {
      return this.$postQuery(`/groups/${grouptag}/invites/${inviteId}/decline`);
    }
    async joinRequests(grouptag) {
      return this.$get(`/groups/${grouptag}/join-requests`);
    }
    async acceptJoinRequest(grouptag, requestId) {
      return this.$postQuery(
        `/groups/${grouptag}/join-requests/${requestId}/accept`
      );
    }
    async declineJoinRequest(grouptag, requestId) {
      return this.$postQuery(
        `/groups/${grouptag}/join-requests/${requestId}/decline`
      );
    }
    async kick(grouptag, userId) {
      return this.$delQuery(`/groups/${grouptag}/members/${userId}`);
    }
    async ban(grouptag, userId, reason) {
      return this.$putQuery(`/groups/${grouptag}/members/${userId}/ban`, {
        reason
      });
    }
    async unban(grouptag, userId) {
      return this.$delQuery(`/groups/${grouptag}/members/${userId}/ban`);
    }
    async bans(grouptag) {
      return this.$get(`/groups/${grouptag}/bans`);
    }
    async checkBan(grouptag, userId) {
      return this.$get(`/groups/${grouptag}/bans/${userId}`);
    }
    async memberInfo(grouptag, userId) {
      return this.$get(`/groups/${grouptag}/members/${userId}`);
    }
    async transferOwnership(grouptag, userId) {
      return this.$post(`/groups/${grouptag}/transfer/${userId}`);
    }
  };
  var SystemsNamespace = class extends Namespace {
    async list() {
      return this.$get("/systems", void 0, false);
    }
    async users(system) {
      return this.$get("/systems/users", { system });
    }
    async update(system, key, value) {
      return this.$patch("/systems", { system, key, value });
    }
    async reload() {
      return this.$postQuery("/systems/reload");
    }
    async badges(system) {
      return (await this.$get(`/systems/${encodeURIComponent(system)}/badges`, void 0, false)).badges;
    }
    createBadge(system, definition) {
      return this.$post(`/systems/${encodeURIComponent(system)}/badges`, definition);
    }
    updateBadge(system, badge, definition) {
      return this.$put(`/systems/${encodeURIComponent(system)}/badges/${encodeURIComponent(badge)}`, definition);
    }
    deleteBadge(system, badge) {
      return this.$del(`/systems/${encodeURIComponent(system)}/badges/${encodeURIComponent(badge)}`);
    }
    setBadgeProgress(system, badge, username, progress) {
      return this.$put(`/systems/${encodeURIComponent(system)}/badges/${encodeURIComponent(badge)}/users/${encodeURIComponent(username)}`, { progress });
    }
    revokeBadge(system, badge, username) {
      return this.$del(`/systems/${encodeURIComponent(system)}/badges/${encodeURIComponent(badge)}/users/${encodeURIComponent(username)}`);
    }
  };
  var StatsNamespace = class extends Namespace {
    async economy() {
      return this.$get("/stats/economy", void 0, false);
    }
    async users() {
      return this.$get("/stats/users", void 0, false);
    }
    async mostGained(max = 10) {
      return this.$get("/stats/most-gained", { max: String(max) }, false);
    }
    async systems() {
      return this.$get("/stats/systems", void 0, false);
    }
    async followers(max = 10) {
      return this.$get("/stats/followers", { max: String(max) }, false);
    }
    async posts(days = 7) {
      return this.$get("/stats/posts", { days: String(days) }, false);
    }
  };
  var StatusNamespace = class extends Namespace {
    async get(username) {
      return this.$get("/status/live", { name: username }, false);
    }
    async setLive(options) {
      return this.$put("/status/live", options);
    }
  };
  var ValidatorsNamespace = class extends Namespace {
    async generate(key) {
      return this.$post("/validators", { key });
    }
    async validate(validator, key) {
      return this.$get("/validators/verify", { validator, key }, false);
    }
  };
  var LinkNamespace = class extends Namespace {
    async getCode() {
      return this.$get("/link/code", void 0, false);
    }
    async status(code) {
      return this.$get("/link/status", { code }, false);
    }
    async linkedUser(code) {
      return this.$get("/link/user", { code }, false);
    }
    async linkCode(code) {
      return this.$post("/link/code", { code });
    }
    async pollUntilLinked(code, intervalMs = 1500, timeoutMs = 12e4) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const res = await this.$get("/link/user", { code }, false);
        if (res.linked && res.token) {
          this.r.setToken(res.token);
          return res.token;
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
      throw new Error("Link polling timed out");
    }
  };
  var CosmeticsNamespace = class extends Namespace {
    async shop(options) {
      const params = {};
      if (options?.type) params.type = options.type;
      if (options?.featured) params.featured = "true";
      if (options?.search) params.search = options.search;
      if (options?.sort) params.sort = options.sort;
      if (options?.limit !== void 0) params.limit = String(options.limit);
      if (options?.offset !== void 0) params.offset = String(options.offset);
      return this.$get("/cosmetics", params, false);
    }
    async get(id) {
      return this.$get(`/cosmetics/${encodeURIComponent(id)}`, void 0, false);
    }
    async mine() {
      return this.$get("/cosmetics/mine");
    }
    async purchase(id) {
      return this.$postQuery(`/cosmetics/${encodeURIComponent(id)}/purchase`);
    }
    async equip(id) {
      return this.$postQuery(`/cosmetics/${encodeURIComponent(id)}/equip`);
    }
    async unequip(type) {
      return this.$post("/cosmetics/unequip", { type });
    }
    async forUser(username) {
      return this.$get(
        `/users/${encodeURIComponent(username)}/cosmetics`,
        void 0,
        false
      );
    }
    async forUsers(usernames) {
      return this.$post(
        "/profiles/cosmetics",
        { usernames },
        false
      );
    }
    async gift(id, to, note) {
      return this.$post("/cosmetics/gifts", {
        cosmetic_id: id,
        to,
        note
      });
    }
    async gifts() {
      return this.$get("/cosmetics/gifts/mine");
    }
    getOverlayAssetUrl(id) {
      return `https://api.rotur.dev/v2/cosmetics/overlays/${encodeURIComponent(id)}.gif`;
    }
    getBackgroundAssetUrl(id) {
      return `https://api.rotur.dev/v2/cosmetics/backgrounds/${encodeURIComponent(id)}.mp4`;
    }
  };
  var PushNamespace = class extends Namespace {
    async vapidKeys() {
      return this.$get("/notify/vapid", void 0, false);
    }
    async register(endpoint, p256dh, auth, source, fingerprint) {
      return this.$post("/notify/register", {
        endpoint,
        p256dh,
        auth,
        source,
        fingerprint
      });
    }
    async check(source, fingerprint) {
      return this.$get("/notify/check", { source, fingerprint });
    }
    async endpoints() {
      return this.$get("/notify/endpoints");
    }
    async deleteDevice(deviceId) {
      return this.$del(`/notify/devices/${encodeURIComponent(deviceId)}`);
    }
    async allowedSenders() {
      return this.$get("/notify/allowed");
    }
    async allowSender(username, source) {
      return this.$post(`/notify/allowed/${username}`, { source });
    }
    async removeSender(username, source) {
      return this.$del(`/notify/allowed/${username}`, { source });
    }
    async log() {
      return this.$get("/notify/log");
    }
    async send(username, source, options) {
      return this.$post(`/notify/${username}`, {
        source,
        title: options?.title,
        body: options?.body,
        data: options?.data
      });
    }
    async sendMany(users, source, options) {
      return this.$post("/notify/", {
        source,
        title: options?.title,
        body: options?.body,
        data: options?.data,
        users
      });
    }
    async notifiableUsers(source) {
      return this.$get(`/notify/sources/${encodeURIComponent(source)}/users`);
    }
  };
  var FilesNamespace = class extends Namespace {
    async index() {
      return this.$get("/files/index");
    }
    async all() {
      return this.$get("/files/entries");
    }
    async getByUUID(uuid) {
      return this.$get("/files/by-uuid", { uuid });
    }
    async getByPath(path) {
      return this.$get(`/files/by-path/${encodeURIComponent(path)}`);
    }
    async usage() {
      return this.$get("/files/usage");
    }
    async stats(uuids) {
      return this.$post("/files/stats", { uuids });
    }
    async byUUIDs(uuids) {
      return this.$post("/files/by-uuid", { uuids });
    }
    async pathIndex() {
      return this.$get("/files/path-index");
    }
    async upload(files) {
      return this.$post("/files", files);
    }
    async deleteAll() {
      return this.$del("/files");
    }
  };
  var StandingNamespace = class extends Namespace {
    async get(username) {
      return this.$get("/standing", { username }, false);
    }
  };
  var AVATARS_BASE = "https://avatars.rotur.dev";
  var ProfilesNamespace = class extends Namespace {
    async get(username, includePosts = true) {
      const profile = await this.$get(`/users/${encodeURIComponent(username)}`, { include_posts: includePosts }, false);
      return {
        ...profile,
        subscription: subscriptionTier(profile.subscription)
      };
    }
    async exists(username) {
      return this.$get(
        `/users/${encodeURIComponent(username)}/exists`,
        void 0,
        false
      );
    }
    /** Delete the authenticated user's own account. */
    async delete(username) {
      return this.$delQuery(`/users/${encodeURIComponent(username)}`);
    }
    async supporters() {
      return this.$get("/supporters", void 0, false);
    }
    getAvatarUrl(username, cache = "") {
      return `${AVATARS_BASE}/${username}?v=${cache}`;
    }
    getOverlayUrl(username, cache = "") {
      return `${AVATARS_BASE}/.overlay/${username}?v=${cache}`;
    }
    getBannerUrl(username, cache = "") {
      return `${AVATARS_BASE}/.banners/${username}?v=${cache}`;
    }
    getBackgroundUrl(username, cache = "") {
      return `${AVATARS_BASE}/.backgrounds/${username}?v=${cache}`;
    }
    /** @deprecated Use getBackgroundUrl(). */
    getProfileVideoUrl(username, cache = "") {
      return this.getBackgroundUrl(username, cache);
    }
  };
  function subscriptionTier(subscription) {
    if (typeof subscription === "string") return subscription;
    if (typeof subscription === "object" && subscription !== null && "tier" in subscription && typeof subscription.tier === "string") {
      return subscription.tier;
    }
    return "Free";
  }
  var DevFundNamespace = class extends Namespace {
    async escrowTransfer(amount, petitionId, note) {
      return this.$post("/devfund/escrow/transfer", {
        amount,
        petition_id: petitionId,
        note
      });
    }
    async escrowRelease(amount, toUsername, petitionId, note) {
      return this.$post("/devfund/escrow/release", {
        amount,
        to_username: toUsername,
        petition_id: petitionId,
        note
      });
    }
    async escrowReleaseService(amount, toUsername, petitionId, apiKey, note) {
      const res = await fetch(
        "https://api.rotur.dev/v2/devfund/escrow/release-service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Devfund-Key": apiKey
          },
          body: JSON.stringify({
            amount,
            to_username: toUsername,
            petition_id: petitionId,
            note
          })
        }
      );
      return this.parseJson(res);
    }
    async parseJson(res) {
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      if (!res.ok) throw new ApiError(res.status, data);
      return data;
    }
  };
  var CheckNamespace = class extends Namespace {
    async banned(usernames) {
      return this.$postText("/accounts/banned-check", usernames.join(","));
    }
  };
  var StorageNamespace = class extends Namespace {
    /** Every key/value pair stored under `id`. */
    get(id) {
      return this.$get(`/storage/${encodeURIComponent(id)}`);
    }
    /** A single value stored under `id`, or undefined if unset. */
    async getKey(id, key) {
      const res = await this.get(id);
      return res.data[key];
    }
    /** Set one key under `id`. Returns the updated bag. */
    set(id, key, value) {
      return this.$put(`/storage/${encodeURIComponent(id)}`, { key, value });
    }
    /** Delete one key under `id`. Returns the updated bag. */
    delete(id, key) {
      return this.$delQuery(`/storage/${encodeURIComponent(id)}`, { key });
    }
    /** Remove every key under `id`. */
    clear(id) {
      return this.$del(`/storage/${encodeURIComponent(id)}`);
    }
    /** List every storage id the user has, plus total usage. */
    list() {
      return this.$get("/storage");
    }
    /** Total storage usage and quota. */
    usage() {
      return this.$get("/storage/usage");
    }
    /** Remove ALL of the user's storage across every id. */
    clearAll() {
      return this.$del("/storage");
    }
  };
  var SigningNamespace = class extends Namespace {
    constructor() {
      super(...arguments);
      __publicField(this, "identity", null);
      __publicField(this, "identityToken", "");
      __publicField(this, "publicKeys", /* @__PURE__ */ new Map());
    }
    async sign(content) {
      const identity = await this.loadIdentity();
      const value = typeof content === "function" ? content(identity.userId) : content;
      const signature = await crypto.subtle.sign(
        { name: "Ed25519" },
        identity.privateKey,
        signingBytes(value)
      );
      return {
        author_id: identity.userId,
        key_id: identity.keyId,
        signature: bytesToBase64url(signature)
      };
    }
    async verify(proof, content) {
      let identity = await this.loadPublicKey(proof.author_id, proof.key_id);
      if (proof.username && identity.username.toLowerCase() !== proof.username.toLowerCase()) {
        identity = await this.loadPublicKey(proof.author_id, proof.key_id, true);
      }
      if (proof.username && identity.username.toLowerCase() !== proof.username.toLowerCase()) {
        return false;
      }
      try {
        return await crypto.subtle.verify(
          { name: "Ed25519" },
          identity.key,
          base64urlToBytes(proof.signature),
          signingBytes(content)
        );
      } catch {
        return false;
      }
    }
    /** Return the signed-in user's Rotur identity key, including its private JWK. */
    async privateKey() {
      return (await this.loadIdentity()).record;
    }
    /** Fetch a Rotur public identity key by the stable user and key IDs in a proof. */
    async publicKey(reference, refresh = false) {
      return this.fetchPublicKey(reference.user_id, reference.key_id, refresh);
    }
    /** Rotate the account identity key. Existing signatures remain verifiable. */
    async rotate() {
      const record = await this.$post("/me/signing-key/rotate");
      this.identity = null;
      this.identityToken = "";
      this.publicKeys.clear();
      return record;
    }
    /**
     * Encrypt JSON-serializable content for a Rotur identity key.
     *
     * Rotur's keys are Ed25519 signing keys. This converts the public key to its
     * X25519 equivalent, creates an ephemeral X25519 key, and encrypts with
     * AES-256-GCM. Only the matching Rotur private key can open the envelope.
     */
    async encrypt(recipient, content) {
      const record = await this.fetchPublicKey(
        recipient.user_id,
        recipient.key_id
      );
      if (recipient.username && record.username.toLowerCase() !== recipient.username.toLowerCase()) {
        throw new Error("Encryption key username mismatch");
      }
      const recipientRaw = ed25519PublicToX25519(
        base64urlToBytes(record.public_key_jwk.x ?? "")
      );
      const recipientKey = await crypto.subtle.importKey(
        "raw",
        recipientRaw,
        { name: "X25519" },
        false,
        []
      );
      const ephemeral = await crypto.subtle.generateKey(
        { name: "X25519" },
        true,
        ["deriveBits"]
      );
      const shared = await crypto.subtle.deriveBits(
        { name: "X25519", public: recipientKey },
        ephemeral.privateKey,
        256
      );
      const salt = crypto.getRandomValues(new Uint8Array(32));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ephemeralPublic = await crypto.subtle.exportKey(
        "raw",
        ephemeral.publicKey
      );
      const key = await envelopeKey(
        shared,
        salt,
        recipient.user_id,
        recipient.key_id
      );
      const metadata = envelopeMetadata(
        recipient.user_id,
        recipient.key_id,
        bytesToBase64url(ephemeralPublic),
        bytesToBase64url(salt),
        bytesToBase64url(iv)
      );
      const plaintext = signingBytes(content);
      const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv, additionalData: signingBytes(metadata) },
        key,
        plaintext
      );
      return { ...metadata, ciphertext: bytesToBase64url(ciphertext) };
    }
    /** Decrypt and JSON-decode an envelope addressed to the current Rotur key. */
    async decrypt(envelope) {
      if (envelope.version !== 1 || envelope.algorithm !== "X25519-HKDF-SHA-256/AES-256-GCM") {
        throw new Error("Unsupported Rotur encrypted envelope");
      }
      const record = await this.privateKey();
      if (record.user_id !== envelope.recipient_id || record.key_id !== envelope.recipient_key_id) {
        throw new Error("Envelope is not addressed to the current Rotur key");
      }
      const seed = base64urlToBytes(record.private_key_jwk.d ?? "");
      const privateRaw = await ed25519PrivateToX25519(seed);
      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        x25519PrivatePkcs8(privateRaw),
        { name: "X25519" },
        false,
        ["deriveBits"]
      );
      const ephemeralKey = await crypto.subtle.importKey(
        "raw",
        base64urlToBytes(envelope.ephemeral_public_key),
        { name: "X25519" },
        false,
        []
      );
      const shared = await crypto.subtle.deriveBits(
        { name: "X25519", public: ephemeralKey },
        privateKey,
        256
      );
      const salt = base64urlToBytes(envelope.salt);
      const key = await envelopeKey(
        shared,
        salt,
        envelope.recipient_id,
        envelope.recipient_key_id
      );
      const metadata = envelopeMetadata(
        envelope.recipient_id,
        envelope.recipient_key_id,
        envelope.ephemeral_public_key,
        envelope.salt,
        envelope.iv
      );
      const plaintext = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: base64urlToBytes(envelope.iv),
          additionalData: signingBytes(metadata)
        },
        key,
        base64urlToBytes(envelope.ciphertext)
      );
      return JSON.parse(new TextDecoder().decode(plaintext));
    }
    preload() {
      void this.loadIdentity().catch(() => {
      });
    }
    async loadIdentity() {
      const token = this.r.token;
      if (!token) throw new Error("Sign in to Rotur first");
      if (this.identity && this.identityToken === token) return this.identity;
      this.identityToken = token;
      this.identity = this.$get("/me/signing-key").then(
        async (record) => {
          if (record.algorithm !== "Ed25519") {
            throw new Error(`Unsupported signing algorithm: ${record.algorithm}`);
          }
          const identity = {
            token,
            userId: record.user_id,
            keyId: record.key_id,
            username: record.username,
            privateKey: await crypto.subtle.importKey(
              "jwk",
              record.private_key_jwk,
              { name: "Ed25519" },
              false,
              ["sign"]
            ),
            publicKey: await crypto.subtle.importKey(
              "jwk",
              record.public_key_jwk,
              { name: "Ed25519" },
              false,
              ["verify"]
            ),
            record
          };
          this.publicKeys.set(
            publicKeyId(identity.userId, identity.keyId),
            Promise.resolve({
              username: identity.username,
              key: identity.publicKey
            })
          );
          return identity;
        }
      );
      this.identity.catch(() => {
        if (this.identityToken === token) this.identity = null;
      });
      return this.identity;
    }
    loadPublicKey(userId, keyId, refresh = false) {
      const cacheKey = publicKeyId(userId, keyId);
      if (refresh) this.publicKeys.delete(cacheKey);
      let pending = this.publicKeys.get(cacheKey);
      if (!pending) {
        pending = this.fetchPublicKey(userId, keyId, refresh).then(async (record) => {
          const matches = record.user_id === userId && record.key_id === keyId && record.algorithm === "Ed25519";
          if (!matches) throw new Error("Signing key identity mismatch");
          return {
            username: record.username,
            key: await crypto.subtle.importKey(
              "jwk",
              record.public_key_jwk,
              { name: "Ed25519" },
              false,
              ["verify"]
            )
          };
        });
        this.publicKeys.set(cacheKey, pending);
        pending.catch(() => this.publicKeys.delete(cacheKey));
      }
      return pending;
    }
    fetchPublicKey(userId, keyId, refresh = false) {
      return this.$get(
        `/users/${encodeURIComponent(userId)}/signing-keys/${encodeURIComponent(keyId)}`,
        refresh ? { refresh: Date.now() } : void 0,
        false
      ).then((record) => {
        if (record.user_id !== userId || record.key_id !== keyId || record.algorithm !== "Ed25519") {
          throw new Error("Signing key identity mismatch");
        }
        return record;
      });
    }
  };
  function canonicalSigningValue(value) {
    if (Array.isArray(value)) return value.map(canonicalSigningValue);
    if (value && typeof value === "object") {
      const result = {};
      for (const key of Object.keys(value).sort()) {
        const item = value[key];
        if (item !== void 0) result[key] = canonicalSigningValue(item);
      }
      return result;
    }
    return value;
  }
  function signingBytes(value) {
    const serialized = JSON.stringify(canonicalSigningValue(value));
    if (serialized === void 0) {
      throw new TypeError("Signed content must be JSON serializable");
    }
    return new TextEncoder().encode(serialized).buffer;
  }
  function publicKeyId(userId, keyId) {
    return `${userId}\0${keyId}`;
  }
  function base64urlToBytes(value) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer;
  }
  function bytesToBase64url(value) {
    const buffer = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
    let binary = "";
    for (const byte of buffer) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  var X25519_PRIME = (1n << 255n) - 19n;
  function ed25519PublicToX25519(publicKey) {
    const bytes = new Uint8Array(publicKey);
    if (bytes.length !== 32) throw new Error("Invalid Ed25519 public key");
    const copy = bytes.slice();
    copy[31] &= 127;
    let y = 0n;
    for (let i = 31; i >= 0; i--) y = y << 8n | BigInt(copy[i]);
    if (y >= X25519_PRIME) throw new Error("Invalid Ed25519 public key");
    const denominator = mod(1n - y);
    if (denominator === 0n) throw new Error("Invalid Ed25519 public key");
    const u = mod((1n + y) * modPow(denominator, X25519_PRIME - 2n));
    const result = new Uint8Array(32);
    let value = u;
    for (let i = 0; i < result.length; i++) {
      result[i] = Number(value & 0xffn);
      value >>= 8n;
    }
    return result.buffer;
  }
  async function ed25519PrivateToX25519(seed) {
    if (seed.byteLength !== 32) throw new Error("Invalid Ed25519 private key");
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-512", seed));
    const scalar = digest.slice(0, 32);
    scalar[0] &= 248;
    scalar[31] &= 127;
    scalar[31] |= 64;
    return scalar.buffer;
  }
  function x25519PrivatePkcs8(privateKey) {
    const prefix = new Uint8Array([
      48,
      46,
      2,
      1,
      0,
      48,
      5,
      6,
      3,
      43,
      101,
      110,
      4,
      34,
      4,
      32
    ]);
    const result = new Uint8Array(prefix.length + 32);
    result.set(prefix);
    result.set(new Uint8Array(privateKey), prefix.length);
    return result.buffer;
  }
  function mod(value) {
    const result = value % X25519_PRIME;
    return result < 0n ? result + X25519_PRIME : result;
  }
  function modPow(base, exponent) {
    let result = 1n;
    let factor = mod(base);
    let power = exponent;
    while (power > 0n) {
      if (power & 1n) result = mod(result * factor);
      factor = mod(factor * factor);
      power >>= 1n;
    }
    return result;
  }
  function envelopeMetadata(recipientId, recipientKeyId, ephemeralPublicKey, salt, iv) {
    return {
      version: 1,
      algorithm: "X25519-HKDF-SHA-256/AES-256-GCM",
      recipient_id: recipientId,
      recipient_key_id: recipientKeyId,
      ephemeral_public_key: ephemeralPublicKey,
      salt,
      iv
    };
  }
  async function envelopeKey(sharedSecret, salt, recipientId, recipientKeyId) {
    const material = await crypto.subtle.importKey(
      "raw",
      sharedSecret,
      "HKDF",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt,
        info: new TextEncoder().encode(
          `rotur-encryption-v1\0${recipientId}\0${recipientKeyId}`
        )
      },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
  var AVATARS_BASE2 = "https://avatars.rotur.dev";
  var AvatarsNamespace = class extends Namespace {
    url(username, cache = "") {
      return `${AVATARS_BASE2}/${encodeURIComponent(username)}?v=${encodeURIComponent(cache)}`;
    }
    bannerUrl(username, cache = "") {
      return `${AVATARS_BASE2}/.banners/${encodeURIComponent(username)}?v=${encodeURIComponent(cache)}`;
    }
    overlayUrl(username, cache = "") {
      return `${AVATARS_BASE2}/.overlay/${encodeURIComponent(username)}?v=${encodeURIComponent(cache)}`;
    }
    backgroundUrl(username, cache = "") {
      return `${AVATARS_BASE2}/.backgrounds/${encodeURIComponent(username)}?v=${encodeURIComponent(cache)}`;
    }
    async uploadAvatar(image) {
      return this.json("/v2/avatars/upload/pfp", "POST", { image });
    }
    async uploadBanner(image) {
      return this.json("/v2/avatars/upload/banner", "POST", { image });
    }
    async uploadBackground(video) {
      return this.multipart("/v2/avatars/upload/background", "video", video);
    }
    /** @deprecated Use uploadBackground(). */
    async uploadProfileVideo(video) {
      return this.uploadBackground(video);
    }
    async uploadOverlay(overlay) {
      return this.multipart("/v2/avatars/upload/overlay", "overlay", overlay);
    }
    async removeBanner() {
      return this.json("/v2/avatars/banner", "DELETE");
    }
    async removeBackground() {
      return this.json("/v2/avatars/background", "DELETE");
    }
    /** @deprecated Use removeBackground(). */
    async removeProfileVideo() {
      return this.removeBackground();
    }
    async removeOverlay() {
      return this.json("/v2/avatars/overlay", "DELETE");
    }
    token() {
      if (!this.r.token) throw new ApiError(401, { error: "Not authenticated" });
      return this.r.token;
    }
    async json(path, method, body = {}) {
      const response = await fetch(`${AVATARS_BASE2}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, token: this.token() })
      });
      return parseResponse(response);
    }
    async multipart(path, field, value) {
      const form = new FormData();
      form.set("token", this.token());
      form.set(field, value);
      const response = await fetch(`${AVATARS_BASE2}${path}`, {
        method: "POST",
        body: form
      });
      return parseResponse(response);
    }
  };
  async function parseResponse(response) {
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!response.ok) throw new ApiError(response.status, data);
    return data;
  }
  var EmojisNamespace = class extends Namespace {
    async mine() {
      return this.$get("/emojis");
    }
    async get(id) {
      const res = await fetch(this.url(id));
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new ApiError(res.status, text);
      }
      return res.blob();
    }
    async upload(name, image) {
      return this.$post("/emojis", { name, image });
    }
    async add(id, name) {
      return this.$post(`/emojis/${encodeURIComponent(id)}/add`, { name });
    }
    async unsave(id) {
      return this.$postQuery(`/emojis/${encodeURIComponent(id)}/unsave`);
    }
    async delete(id) {
      return this.$delQuery(`/emojis/${encodeURIComponent(id)}`);
    }
    url(id) {
      return `https://api.rotur.dev/v2/emojis/${encodeURIComponent(id)}`;
    }
  };
  var TrustNamespace = class extends Namespace {
    async score(username) {
      return this.$get(`/trust/${encodeURIComponent(username)}/score`);
    }
    async verify(options) {
      return this.$post("/verify/user", {
        username: options.username,
        user_id: options.userId,
        account_token: options.accountToken,
        min_score: options.minScore,
        required_standing: options.requiredStanding,
        max_risk: options.maxRisk,
        required_min_tier: options.requiredMinTier,
        require_paid: options.requirePaid,
        require_active: options.requireActive,
        require_token: options.requireToken
      });
    }
  };
  var AccountsNamespace = class extends Namespace {
    async register(options) {
      return this.$post("/accounts", options, false);
    }
    async requestPasswordReset(email) {
      return this.$post("/accounts/password/reset-request", { email }, false);
    }
    async resetPassword(token, newPassword) {
      return this.$post(
        "/accounts/password/reset",
        { token, new_password: newPassword },
        false
      );
    }
    async deletedCheck(ids) {
      return this.$post("/accounts/deleted-check", { ids }, false);
    }
    async verifyEmail(token) {
      return this.$get("/accounts/verify-email", { token }, false);
    }
    /** @deprecated Use deletedCheck(). */
    async checkDeleted(ids) {
      return this.deletedCheck(ids);
    }
    /** @deprecated Use requestPasswordReset(). */
    async passwordResetRequest(email) {
      return this.requestPasswordReset(email);
    }
    async bannedCheck(usernames) {
      return this.$postText("/accounts/banned-check", usernames.join(","));
    }
  };
  var SessionsNamespace = class extends Namespace {
    async start() {
      return this.$post("/sessions");
    }
    async current() {
      return this.$get("/sessions");
    }
    async end() {
      return this.$del("/sessions");
    }
  };
  var AiNamespace = class extends Namespace {
    /**
     * Single-turn completion. Returns the model's reply text.
     * Note: requires POST permission `posts:view` on the account token.
     */
    async ask(content, options) {
      return this.$getText("/ai", {
        content,
        user: options?.user,
        model: options?.model
      });
    }
    /**
     * Multi-turn chat with explicit history. Returns the full conversation
     * (history + assistant reply) when `returnHistory` is true.
     */
    async chat(history, options) {
      const raw = await this.$get("/ai", {
        history: options?.returnHistory ? "1" : void 0,
        user: options?.user,
        model: options?.model,
        history_data: JSON.stringify(history)
      });
      if (typeof raw === "string") return { text: raw };
      if (Array.isArray(raw)) {
        const entries = raw;
        const last = entries[entries.length - 1];
        return {
          text: typeof last?.content === "string" ? last.content : "",
          history: entries
        };
      }
      throw new TypeError("Unexpected /ai response shape");
    }
  };
  var ReportsNamespace = class extends Namespace {
    async submit(targetType, targetId, reason) {
      return this.$post("/reports", {
        target_type: targetType,
        target_id: targetId,
        reason
      });
    }
  };
  var ModerationNamespace = class extends Namespace {
    async listReports(status) {
      return this.$get("/mod/reports", { status });
    }
    async resolveReport(request) {
      return this.$post("/mod/reports/resolve", request);
    }
    async setStanding(request) {
      return this.$post("/mod/standing", request);
    }
    async recoverStanding(username, reason) {
      return this.$post("/mod/standing/recover", { username, reason });
    }
    async standingHistory(username) {
      return this.$post("/mod/standing/history", { username });
    }
    async moderators() {
      return this.$get("/mod/moderators");
    }
    async setModerator(username, moderator) {
      return this.$post("/mod/moderators", { username, moderator });
    }
    async account(username) {
      return this.$get(`/mod/users/${encodeURIComponent(username)}/account`);
    }
    async updateAccount(username, request) {
      return this.$patch(
        `/mod/users/${encodeURIComponent(username)}/account`,
        request
      );
    }
    async setStandingModerated(username, request) {
      return this.$put(
        `/mod/users/${encodeURIComponent(username)}/standing`,
        request
      );
    }
    async setSubscription(username, request) {
      return this.$put(
        `/mod/users/${encodeURIComponent(username)}/subscription`,
        request
      );
    }
    async setModeratorRole(username, moderator) {
      return this.$put(`/mod/users/${encodeURIComponent(username)}/moderator`, {
        moderator
      });
    }
    async ban(username, reason) {
      return this.$post(`/mod/users/${encodeURIComponent(username)}/ban`, {
        reason
      });
    }
    async deleteAccount(username) {
      return this.$del(`/mod/users/${encodeURIComponent(username)}`);
    }
    async cosmeticPerks(username) {
      return this.$get(
        `/mod/users/${encodeURIComponent(username)}/cosmetic-perks`
      );
    }
    async setCosmeticPerk(username, perk, request) {
      return this.$put(
        `/mod/users/${encodeURIComponent(username)}/cosmetic-perks/${encodeURIComponent(perk)}`,
        request
      );
    }
  };
  var AdminNamespace = class extends Namespace {
    async getUserBy(key, value) {
      return this.$get("/admin/users/lookup", { [key]: value });
    }
    async updateUser(request) {
      return this.$post("/admin/users/update", request);
    }
    async deleteUser(username) {
      return this.$post("/admin/users/delete", { username });
    }
    async banUser(username) {
      return this.$post("/admin/users/ban", { username });
    }
    async transferCredits(to, amount, options) {
      return this.$postQuery("/admin/credits/transfer", {
        to,
        amount: String(amount),
        from: options?.from,
        note: options?.note
      });
    }
    async setSubscription(username, tier, days) {
      return this.$post("/admin/subscriptions", { username, tier, days });
    }
    async setStanding(username, level, reason) {
      return this.$post("/admin/standing", { username, level, reason });
    }
    async standingHistory(username) {
      return this.$post("/admin/standing/history", { username });
    }
    async recoverStanding(username, reason) {
      return this.$post("/admin/standing/recover", { username, reason });
    }
    async setModerator(username, moderator) {
      return this.$post("/admin/moderators", { username, moderator });
    }
    async moderators() {
      return this.$get("/mod/moderators");
    }
    async tosUpdate() {
      return this.$get("/admin/tos-update");
    }
    async deleteEmoji(id) {
      return this.$del(`/admin/emojis/${id}`);
    }
    async cosmetics() {
      return this.$get("/cosmetics/admin");
    }
    async createCosmetic(cosmetic) {
      return this.$post("/cosmetics/admin", cosmetic);
    }
    async updateCosmetic(id, updates) {
      return this.$patch(`/cosmetics/admin/${encodeURIComponent(id)}`, updates);
    }
    async deleteCosmetic(id) {
      return this.$del(`/cosmetics/admin/${encodeURIComponent(id)}`);
    }
  };
  var PetsNamespace = class extends Namespace {
    async catalog() {
      return (await this.$get("/pets", void 0, false)).pets;
    }
    mine() {
      return this.$get("/pets/mine");
    }
    profile(username) {
      return this.$get(`/users/${encodeURIComponent(username)}/pets`, void 0, false);
    }
    purchase(id) {
      return this.$post(`/pets/${encodeURIComponent(id)}/purchase`);
    }
    equip(id) {
      return this.$post(`/pets/${encodeURIComponent(id)}/equip`);
    }
    unequip() {
      return this.$post("/pets/unequip");
    }
  };
  var encoder = new TextEncoder();
  function toBase64(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 32768) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
    }
    return btoa(binary);
  }
  function fromBase64(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  async function createBeamKeyPair() {
    const pair = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey"]
    );
    const raw = await crypto.subtle.exportKey("raw", pair.publicKey);
    return { privateKey: pair.privateKey, publicKey: toBase64(new Uint8Array(raw)) };
  }
  async function deriveBeamKey(privateKey, publicKey) {
    const imported = await crypto.subtle.importKey(
      "raw",
      fromBase64(publicKey),
      { name: "ECDH", namedCurve: "P-256" },
      false,
      []
    );
    return crypto.subtle.deriveKey(
      { name: "ECDH", public: imported },
      privateKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
  async function encryptBeamFrame(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data));
    const frame = new Uint8Array(iv.length + encrypted.length);
    frame.set(iv);
    frame.set(encrypted, iv.length);
    return toBase64(frame);
  }
  async function decryptBeamFrame(key, frame) {
    const bytes = fromBase64(frame);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, key, bytes.slice(12));
  }
  function encodeBeamJson(value) {
    return encoder.encode(JSON.stringify(value)).buffer;
  }
  var DEFAULT_SERVER = "https://beam.rotur.dev";
  var CHUNK_SIZE = 64 * 1024;
  var RELAY_CHUNK_SIZE = 128 * 1024;
  var DIRECT_HIGH_WATER = 4 * 1024 * 1024;
  var DIRECT_LOW_WATER = 1024 * 1024;
  var RELAY_HIGH_WATER = 8 * 1024 * 1024;
  function randomId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
  function totalBytes(files) {
    return files.reduce((total, file) => total + file.size, 0);
  }
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  var BeamClient = class {
    constructor(options = {}) {
      __publicField(this, "options");
      __publicField(this, "handlers", /* @__PURE__ */ new Map());
      __publicField(this, "sessions", /* @__PURE__ */ new Map());
      __publicField(this, "socket", null);
      __publicField(this, "reconnectTimer");
      __publicField(this, "heartbeat");
      __publicField(this, "reconnectAttempts", 0);
      __publicField(this, "closed", true);
      __publicField(this, "authenticated", false);
      __publicField(this, "queue", []);
      __publicField(this, "rtcConfiguration");
      __publicField(this, "iceConfigurationReady", null);
      __publicField(this, "opening", false);
      __publicField(this, "_status", "disconnected");
      __publicField(this, "_peers", []);
      __publicField(this, "desiredRoom", "");
      __publicField(this, "shareToJoin", null);
      __publicField(this, "pendingShare", null);
      __publicField(this, "activeShares", /* @__PURE__ */ new Map());
      this.options = options;
      this.rtcConfiguration = options.rtcConfiguration ?? {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      };
    }
    get status() {
      return this._status;
    }
    get peers() {
      return this._peers;
    }
    get ownDevices() {
      return this._peers.filter((peer) => peer.same_account);
    }
    on(type, handler) {
      let handlers = this.handlers.get(type);
      if (!handlers) {
        handlers = /* @__PURE__ */ new Set();
        this.handlers.set(type, handlers);
      }
      handlers.add(handler);
      return () => handlers?.delete(handler);
    }
    connect() {
      this.closed = false;
      void this.loadIceConfiguration();
      void this.openSocket();
    }
    /** Refreshes STUN and TURN servers advertised by Beam. */
    async loadIceConfiguration() {
      if (this.options.rtcConfiguration) return;
      if (this.iceConfigurationReady) return this.iceConfigurationReady;
      this.iceConfigurationReady = (async () => {
        try {
          const base = new URL(this.options.serverUrl ?? DEFAULT_SERVER);
          base.pathname = `${base.pathname.replace(/\/$/, "")}/api/ice`;
          const response = await fetch(base);
          if (!response.ok) return;
          const body = await response.json();
          if (body.data?.iceServers?.length) {
            this.rtcConfiguration = { iceServers: body.data.iceServers };
          }
        } catch {
        }
      })().finally(() => {
        this.iceConfigurationReady = null;
      });
      return this.iceConfigurationReady;
    }
    disconnect() {
      this.closed = true;
      this.authenticated = false;
      clearTimeout(this.reconnectTimer);
      clearInterval(this.heartbeat);
      this.socket?.close();
      this.socket = null;
      this.setPeers([]);
      if (this.pendingShare) {
        clearTimeout(this.pendingShare.timer);
        this.pendingShare.reject(new Error("Beam disconnected"));
        this.pendingShare = null;
      }
      this.activeShares.clear();
      this.setStatus("disconnected");
      for (const id of this.sessions.keys()) this.teardown(id);
    }
    reconnect() {
      if (this.closed) return;
      if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING)
        return;
      clearTimeout(this.reconnectTimer);
      this.reconnectAttempts = 0;
      void this.openSocket();
    }
    sendText(peerId, text) {
      const value = text.trim();
      if (value) this.send({ type: "text", to: peerId, text: value });
    }
    sendTextToOwnDevices(text) {
      const value = text.trim();
      if (!value) return 0;
      for (const peer of this.ownDevices) this.sendText(peer.peer_id, value);
      return this.ownDevices.length;
    }
    sendFiles(peerId, files) {
      const selected = Array.from(files);
      if (!selected.length) return null;
      const id = randomId();
      const metadata = selected.map((file) => ({
        name: file.name,
        size: file.size,
        mime: file.type || "application/octet-stream"
      }));
      const session = this.makeSession(id, "sender", peerId, metadata);
      session.files = selected;
      this.sessions.set(id, session);
      this.emitTransfer(session);
      void session.keyReady.then(() => {
        this.send({
          type: "signal",
          to: peerId,
          signal: {
            kind: "request",
            transferId: id,
            files: metadata,
            pub: session.keys?.publicKey
          }
        });
      });
      session.requestTimer = setTimeout(
        () => this.fail(session, "The receiving device did not respond"),
        this.options.requestTimeoutMs ?? 6e4
      );
      return id;
    }
    async accept(transferId, writable) {
      const session = this.sessions.get(transferId);
      if (!session || session.role !== "receiver" || session.accepted) return;
      session.accepted = true;
      if (writable) {
        session.writable = writable;
        session.writeChain = Promise.resolve();
      }
      session.transfer.status = "connecting";
      this.emitTransfer(session);
      await session.keyReady;
      await this.deriveRelayKey(session);
      this.signal(session, { kind: "accept", transferId, pub: session.keys?.publicKey });
    }
    decline(transferId) {
      const session = this.sessions.get(transferId);
      if (!session) return;
      this.signal(session, { kind: "decline", transferId });
      this.teardown(transferId);
    }
    cancel(transferId) {
      const session = this.sessions.get(transferId);
      if (!session) return;
      this.signal(session, { kind: "cancel", transferId });
      session.transfer.status = "cancelled";
      this.emitTransfer(session);
      this.teardown(transferId);
    }
    joinRoom(room) {
      const value = room.trim().toLowerCase();
      if (value) {
        this.desiredRoom = value;
        this.send({ type: "room.join", room: value });
      }
    }
    leaveRoom() {
      this.desiredRoom = "";
      this.send({ type: "room.leave" });
    }
    createShare(file) {
      if (this.pendingShare) return Promise.reject(new Error("A share link is already being created"));
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (!this.pendingShare) return;
          this.pendingShare = null;
          reject(new Error("Timed out creating the Beam link"));
        }, 1e4);
        this.pendingShare = { file, resolve, reject, timer };
        this.send({ type: "share.create" });
      });
    }
    joinShare(shareId) {
      const value = shareId.trim();
      if (!value) return;
      this.shareToJoin = value;
      this.send({ type: "share.join", share_id: value });
    }
    async token() {
      const source = this.options.token;
      return typeof source === "function" ? await source() : source ?? null;
    }
    emit(type, value) {
      for (const handler of this.handlers.get(type) ?? []) {
        try {
          handler(value);
        } catch {
        }
      }
    }
    setStatus(status) {
      if (this._status === status) return;
      this._status = status;
      this.emit("status", status);
    }
    setPeers(peers) {
      this._peers = peers;
      this.emit("peers", [...peers]);
    }
    socketUrl() {
      const base = new URL(this.options.serverUrl ?? DEFAULT_SERVER);
      base.protocol = base.protocol === "http:" ? "ws:" : "wss:";
      base.pathname = `${base.pathname.replace(/\/$/, "")}/api/ws`;
      return base.toString();
    }
    async openSocket() {
      if (this.closed || this.opening) return;
      if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING)
        return;
      this.opening = true;
      let token;
      try {
        token = await this.token();
      } catch (error) {
        this.opening = false;
        this.emit("error", error instanceof Error ? error : new Error("Could not authenticate Beam"));
        this.scheduleReconnect();
        return;
      }
      this.opening = false;
      if (this.closed) return;
      if (!token) {
        this.emit("error", new Error("Beam requires a Rotur token"));
        return;
      }
      this.setStatus("connecting");
      this.authenticated = false;
      const socket = new WebSocket(this.socketUrl());
      this.socket = socket;
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: "auth",
            token,
            user_agent: this.options.userAgent ?? globalThis.navigator?.userAgent ?? "rotur-sdk"
          })
        );
        clearInterval(this.heartbeat);
        this.heartbeat = setInterval(() => this.sendNow({ type: "ping" }), 25e3);
      };
      socket.onmessage = (event) => this.handleMessage(event.data);
      socket.onerror = () => socket.close();
      socket.onclose = () => {
        if (this.socket !== socket) return;
        clearInterval(this.heartbeat);
        this.socket = null;
        this.authenticated = false;
        this.setPeers([]);
        this.setStatus("disconnected");
        if (!this.closed) {
          this.reconnectAttempts = Math.min(this.reconnectAttempts + 1, 6);
          this.reconnectTimer = setTimeout(
            () => void this.openSocket(),
            this.reconnectAttempts * 1e3
          );
        }
      };
    }
    scheduleReconnect() {
      if (this.closed) return;
      this.reconnectAttempts = Math.min(this.reconnectAttempts + 1, 6);
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = setTimeout(
        () => void this.openSocket(),
        this.reconnectAttempts * 1e3
      );
    }
    send(message) {
      if (!this.sendNow(message)) {
        this.queue.push(message);
        this.reconnect();
      }
    }
    sendNow(message) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return false;
      if (!this.authenticated && message.type !== "ping") return false;
      this.socket.send(JSON.stringify(message));
      return true;
    }
    flush() {
      while (this.queue.length) {
        const message = this.queue[0];
        if (!this.sendNow(message)) return;
        this.queue.shift();
      }
    }
    handleMessage(raw) {
      let message;
      try {
        message = JSON.parse(String(raw));
      } catch {
        return;
      }
      if (message.type === "ready") {
        this.authenticated = true;
        this.reconnectAttempts = 0;
        this.setStatus("connected");
        this.flush();
        if (this.desiredRoom) this.send({ type: "room.join", room: this.desiredRoom });
        if (this.shareToJoin) this.send({ type: "share.join", share_id: this.shareToJoin });
      } else if (message.type === "peers") {
        this.setPeers(message.peers ?? []);
      } else if (message.type === "peer.join") {
        const peer = message.peer;
        if (peer && !this._peers.some((item) => item.peer_id === peer.peer_id)) {
          this.setPeers([...this._peers, peer]);
        }
      } else if (message.type === "peer.leave") {
        this.setPeers(this._peers.filter((peer) => peer.peer_id !== String(message.peer_id)));
      } else if (message.type === "signal") {
        void this.handleSignal(String(message.from), message.signal);
      } else if (message.type === "relay.frame") {
        this.handleRelayFrame(String(message.transferId), String(message.kind), String(message.frame));
      } else if (message.type === "text.received") {
        const peer = message.peer;
        this.emit("text", {
          fromPeerId: String(message.from),
          fromName: peer?.username ?? this.peerName(String(message.from)),
          text: String(message.text)
        });
      } else if (message.type === "room.joined") {
        this.desiredRoom = String(message.room);
        this.emit("room", this.desiredRoom);
      } else if (message.type === "room.left") {
        this.desiredRoom = "";
        this.emit("room", "");
      } else if (message.type === "share.created") {
        const id = String(message.share_id);
        const pending = this.pendingShare;
        if (pending) {
          clearTimeout(pending.timer);
          this.activeShares.set(id, pending.file);
          this.pendingShare = null;
          pending.resolve(`${(this.options.serverUrl ?? DEFAULT_SERVER).replace(/\/$/, "")}/#beam=${id}`);
        }
      } else if (message.type === "share.joined") {
        const id = String(message.share_id);
        const peer = message.peer;
        const file = this.activeShares.get(id);
        if (file) this.sendFiles(String(message.from), [file]);
        this.emit("share", { status: "joined", ...peer ? { peer } : {} });
      } else if (message.type === "share.ready") {
        this.shareToJoin = null;
        const peer = message.peer;
        this.emit("share", { status: "ready", ...peer ? { peer } : {} });
      } else if (message.type === "share.error") {
        this.shareToJoin = null;
        const text = String(message.message ?? "The Beam link is unavailable");
        this.emit("share", { status: "error", message: text });
      } else if (message.type === "error") {
        this.emit("error", new Error(String(message.message ?? "Beam connection error")));
      }
    }
    makeSession(id, role, peerId, files) {
      const session = {
        id,
        role,
        peerId,
        transfer: {
          id,
          direction: role === "sender" ? "send" : "receive",
          peerId,
          peerName: this.peerName(peerId),
          files,
          status: "requested",
          transferredBytes: 0,
          totalBytes: totalBytes(files),
          currentFile: 0
        },
        pendingIce: [],
        remoteSet: false,
        accepted: false,
        relay: false,
        keyReady: Promise.resolve()
      };
      session.keyReady = createBeamKeyPair().then((keys) => {
        session.keys = keys;
      });
      return session;
    }
    peerName(peerId) {
      return this._peers.find((peer) => peer.peer_id === peerId)?.username ?? "Unknown device";
    }
    signal(session, signal) {
      this.send({ type: "signal", to: session.peerId, signal });
    }
    emitTransfer(session) {
      this.emit("transfer", { ...session.transfer, files: [...session.transfer.files] });
    }
    emitProgress(session) {
      const now = Date.now();
      if (now - (session.lastProgressAt ?? 0) < 100) return;
      session.lastProgressAt = now;
      this.emitTransfer(session);
    }
    async handleSignal(fromPeerId, signal) {
      const kind = String(signal.kind);
      const id = String(signal.transferId);
      if (kind === "request") {
        const files = Array.isArray(signal.files) ? signal.files : [];
        const session2 = this.makeSession(id, "receiver", fromPeerId, files);
        session2.peerPublicKey = signal.pub ? String(signal.pub) : void 0;
        this.sessions.set(id, session2);
        const request = {
          id,
          fromPeerId,
          fromName: session2.transfer.peerName,
          files,
          totalBytes: session2.transfer.totalBytes
        };
        this.emit("incoming", request);
        const autoAccept = this.options.autoAccept;
        const shouldAccept = autoAccept === true || typeof autoAccept === "function" && await autoAccept(request);
        if (shouldAccept) await this.accept(id);
        return;
      }
      const session = this.sessions.get(id);
      if (!session) return;
      if (kind === "accept") {
        clearTimeout(session.requestTimer);
        session.peerPublicKey = signal.pub ? String(signal.pub) : void 0;
        await session.keyReady;
        await this.deriveRelayKey(session);
        await this.startSender(session);
      } else if (kind === "offer") {
        await this.handleOffer(session, signal.sdp);
      } else if (kind === "answer") {
        await this.handleAnswer(session, signal.sdp);
      } else if (kind === "ice") {
        this.handleIce(session, signal.candidate);
      } else if (kind === "relay-start") {
        this.beginRelay(session);
      } else if (kind === "decline") {
        session.transfer.status = "declined";
        this.emitTransfer(session);
        this.teardown(id);
      } else if (kind === "cancel") {
        session.transfer.status = "cancelled";
        this.emitTransfer(session);
        this.teardown(id);
      } else if (kind === "complete-ack" && session.role === "sender") {
        clearTimeout(session.completeTimer);
        session.transfer.status = "done";
        session.transfer.transferredBytes = session.transfer.totalBytes;
        this.emitTransfer(session);
        this.teardown(id, 1e3);
      }
    }
    async deriveRelayKey(session) {
      if (!session.relayKey && session.keys && session.peerPublicKey) {
        session.relayKey = await deriveBeamKey(session.keys.privateKey, session.peerPublicKey);
      }
    }
    rtcConfig() {
      return this.rtcConfiguration;
    }
    createPeerConnection(session) {
      const connection = new RTCPeerConnection(this.rtcConfig());
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          this.signal(session, {
            kind: "ice",
            transferId: session.id,
            candidate: event.candidate.toJSON()
          });
        }
      };
      connection.onconnectionstatechange = () => {
        if (connection.connectionState === "connected") clearTimeout(session.connectTimer);
        if (connection.connectionState === "failed") {
          if (session.transfer.status === "connecting") this.fallbackToRelay(session);
          else if (session.transfer.status === "transferring" && session.transfer.transferredBytes < session.transfer.totalBytes) {
            this.fail(session, "The device connection was interrupted");
          }
        }
      };
      return connection;
    }
    armConnectTimeout(session) {
      clearTimeout(session.connectTimer);
      session.connectTimer = setTimeout(
        () => this.fallbackToRelay(session),
        this.options.connectTimeoutMs ?? 12e3
      );
    }
    async startSender(session) {
      await this.loadIceConfiguration();
      session.transfer.status = "connecting";
      this.emitTransfer(session);
      this.armConnectTimeout(session);
      const connection = this.createPeerConnection(session);
      const channel = connection.createDataChannel("beam");
      channel.binaryType = "arraybuffer";
      channel.bufferedAmountLowThreshold = DIRECT_LOW_WATER;
      channel.onopen = () => void this.streamDirect(session);
      channel.onerror = () => this.fail(session, "The device connection was interrupted");
      channel.onclose = () => {
        if (!session.relay && !this.isTerminal(session) && session.transfer.status === "transferring" && session.transfer.transferredBytes < session.transfer.totalBytes) {
          this.fail(session, "The device connection closed before the file arrived");
        }
      };
      session.pc = connection;
      session.channel = channel;
      try {
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        this.signal(session, { kind: "offer", transferId: session.id, sdp: offer });
      } catch {
        this.fallbackToRelay(session);
      }
    }
    async handleOffer(session, description) {
      await this.loadIceConfiguration();
      this.armConnectTimeout(session);
      const connection = this.createPeerConnection(session);
      session.pc = connection;
      connection.ondatachannel = (event) => {
        session.channel = event.channel;
        event.channel.binaryType = "arraybuffer";
        event.channel.onmessage = (message) => this.handleDirectFrame(session, message.data);
        event.channel.onerror = () => this.fail(session, "The transfer was interrupted");
        event.channel.onclose = () => {
          if (!session.relay && !this.isTerminal(session) && session.transfer.status === "transferring" && session.transfer.transferredBytes < session.transfer.totalBytes) {
            this.fail(session, "The sender disconnected before the file arrived");
          }
        };
      };
      try {
        await connection.setRemoteDescription(description);
        session.remoteSet = true;
        this.flushIce(session);
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        this.signal(session, { kind: "answer", transferId: session.id, sdp: answer });
      } catch {
        this.fail(session, "Could not connect to the sending device");
      }
    }
    async handleAnswer(session, description) {
      if (!session.pc) return;
      try {
        await session.pc.setRemoteDescription(description);
        session.remoteSet = true;
        this.flushIce(session);
      } catch {
        this.fallbackToRelay(session);
      }
    }
    handleIce(session, candidate) {
      if (!session.pc || !session.remoteSet) session.pendingIce.push(candidate);
      else void session.pc.addIceCandidate(candidate).catch(() => void 0);
    }
    flushIce(session) {
      for (const candidate of session.pendingIce) {
        void session.pc?.addIceCandidate(candidate).catch(() => void 0);
      }
      session.pendingIce = [];
    }
    fallbackToRelay(session) {
      if (session.relay || this.isTerminal(session)) return;
      if (!session.relayKey) {
        this.fail(session, "Could not establish a secure connection");
        return;
      }
      this.beginRelay(session);
      if (session.role === "sender") {
        this.signal(session, { kind: "relay-start", transferId: session.id });
        void this.streamRelay(session);
      }
    }
    beginRelay(session) {
      session.relay = true;
      clearTimeout(session.connectTimer);
      session.channel?.close();
      session.pc?.close();
      session.channel = void 0;
      session.pc = void 0;
    }
    handleDirectFrame(session, data) {
      if (typeof data === "string") this.handleControl(session, JSON.parse(data));
      else this.receiveChunk(session, data);
    }
    handleRelayFrame(transferId, kind, frame) {
      const session = this.sessions.get(transferId);
      if (!session?.relayKey) return;
      session.relayReceiveChain = (session.relayReceiveChain ?? Promise.resolve()).then(async () => {
        const data = await decryptBeamFrame(session.relayKey, frame);
        if (kind === "json") {
          this.handleControl(session, JSON.parse(new TextDecoder().decode(data)));
        } else {
          this.receiveChunk(session, data);
        }
      }).catch(() => this.fail(session, "The transfer data was corrupted"));
    }
    receiveChunk(session, data) {
      if (!session.receive) return;
      session.receive.receivedBytes += data.byteLength;
      if (session.writable) {
        session.writeChain = (session.writeChain ?? Promise.resolve()).then(() => session.writable.write(data)).catch((error) => this.fail(session, `Could not save the file: ${String(error)}`));
      } else {
        session.receive.chunks.push(data);
      }
      session.transfer.transferredBytes += data.byteLength;
      this.emitProgress(session);
    }
    handleControl(session, message) {
      var _a;
      const kind = String(message.t);
      if (kind === "file-start") {
        session.transfer.status = "transferring";
        (_a = session.transfer).startedAt ?? (_a.startedAt = Date.now());
        session.transfer.currentFile = Number(message.index) || 0;
        session.receive = {
          chunks: [],
          receivedBytes: 0,
          meta: {
            name: String(message.name),
            size: Number(message.size),
            mime: String(message.mime || "application/octet-stream")
          }
        };
        this.emitTransfer(session);
      } else if (kind === "file-end" && session.receive) {
        const received = session.receive;
        if (received.receivedBytes !== received.meta.size) {
          this.fail(session, `Received an incomplete copy of ${received.meta.name}`);
          return;
        }
        if (session.writable) {
          const writable = session.writable;
          session.writable = void 0;
          session.writeChain = (session.writeChain ?? Promise.resolve()).then(() => writable.close());
        } else {
          const file = new File(received.chunks, received.meta.name, { type: received.meta.mime });
          this.emit("file", {
            transferId: session.id,
            fromPeerId: session.peerId,
            fromName: session.transfer.peerName,
            file,
            index: session.transfer.currentFile,
            total: session.transfer.files.length
          });
        }
        session.receive = void 0;
      } else if (kind === "complete") {
        const finish = () => {
          if (this.isTerminal(session)) return;
          session.transfer.status = "done";
          session.transfer.transferredBytes = session.transfer.totalBytes;
          this.emitTransfer(session);
          this.signal(session, { kind: "complete-ack", transferId: session.id });
          this.teardown(session.id, 1e3);
        };
        if (session.writeChain) {
          void session.writeChain.then(finish).catch((error) => this.fail(session, String(error)));
        } else {
          finish();
        }
      }
    }
    async streamDirect(session) {
      const channel = session.channel;
      if (!channel) return;
      await this.streamFiles(session, async (kind, data) => {
        if (kind === "json") channel.send(new TextDecoder().decode(data));
        else {
          if (channel.bufferedAmount > DIRECT_HIGH_WATER) await this.waitForDrain(channel);
          channel.send(data);
        }
      });
    }
    async streamRelay(session) {
      if (!session.relayKey) return;
      await this.streamFiles(
        session,
        async (kind, data) => {
          if (!this.authenticated || this.socket?.readyState !== WebSocket.OPEN) {
            throw new Error("The Beam relay disconnected");
          }
          while ((this.socket?.bufferedAmount ?? 0) > RELAY_HIGH_WATER) await delay(50);
          const frame = await encryptBeamFrame(session.relayKey, data);
          if (!this.sendNow({ type: "relay", to: session.peerId, transferId: session.id, kind, frame })) {
            throw new Error("The Beam relay disconnected");
          }
        },
        RELAY_CHUNK_SIZE
      );
    }
    async streamFiles(session, write, chunkSize = CHUNK_SIZE) {
      var _a;
      if (!session.files) return;
      session.transfer.status = "transferring";
      (_a = session.transfer).startedAt ?? (_a.startedAt = Date.now());
      this.emitTransfer(session);
      try {
        for (let index = 0; index < session.files.length; index++) {
          const file = session.files[index];
          session.transfer.currentFile = index;
          await write(
            "json",
            encodeBeamJson({
              t: "file-start",
              index,
              name: file.name,
              size: file.size,
              mime: file.type || "application/octet-stream"
            })
          );
          for (let offset = 0; offset < file.size; offset += chunkSize) {
            if (this.isTerminal(session)) return;
            const data = await file.slice(offset, offset + chunkSize).arrayBuffer();
            await write("bin", data);
            session.transfer.transferredBytes += data.byteLength;
            this.emitProgress(session);
          }
          await write("json", encodeBeamJson({ t: "file-end", index }));
        }
        await write("json", encodeBeamJson({ t: "complete" }));
        session.transfer.transferredBytes = session.transfer.totalBytes;
        this.emitTransfer(session);
        session.completeTimer = setTimeout(
          () => this.fail(session, "The receiving device did not confirm the transfer"),
          3e4
        );
      } catch (error) {
        this.fail(session, error instanceof Error ? error.message : "The transfer failed");
      }
    }
    waitForDrain(channel) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => fail(new Error("The receiving device stopped responding")),
          15e3
        );
        const close = () => fail(new Error("The device connection closed"));
        const done = () => {
          clearTimeout(timeout);
          channel.removeEventListener("bufferedamountlow", done);
          channel.removeEventListener("close", close);
          resolve();
        };
        const fail = (error) => {
          clearTimeout(timeout);
          channel.removeEventListener("bufferedamountlow", done);
          channel.removeEventListener("close", close);
          reject(error);
        };
        channel.addEventListener("bufferedamountlow", done);
        channel.addEventListener("close", close, { once: true });
      });
    }
    isTerminal(session) {
      return ["done", "cancelled", "declined", "error"].includes(session.transfer.status);
    }
    fail(session, message) {
      if (this.isTerminal(session)) return;
      session.transfer.status = "error";
      session.transfer.error = message;
      this.emitTransfer(session);
      this.emit("error", new Error(message));
      this.teardown(session.id);
    }
    teardown(id, delayMs = 0) {
      if (delayMs) {
        setTimeout(() => this.teardown(id), delayMs);
        return;
      }
      const session = this.sessions.get(id);
      if (!session) return;
      clearTimeout(session.requestTimer);
      clearTimeout(session.connectTimer);
      clearTimeout(session.completeTimer);
      session.channel?.close();
      session.pc?.close();
      this.sessions.delete(id);
    }
  };
  var Rotur = class {
    constructor(options) {
      __publicField(this, "_http");
      __publicField(this, "socket");
      __publicField(this, "_token", null);
      __publicField(this, "_socketReady", null);
      __publicField(this, "me", new MeNamespace(this));
      __publicField(this, "posts", new PostsNamespace(this));
      __publicField(this, "friends", new FriendsNamespace(this));
      __publicField(this, "following", new FollowingNamespace(this));
      __publicField(this, "notifications", new NotificationsNamespace(this));
      __publicField(this, "keys", new KeysNamespace(this));
      __publicField(this, "items", new ItemsNamespace(this));
      __publicField(this, "gifts", new GiftsNamespace(this));
      __publicField(this, "tokens", new TokensNamespace(this));
      __publicField(this, "groups", new GroupsNamespace(this));
      __publicField(this, "systems", new SystemsNamespace(this));
      __publicField(this, "stats", new StatsNamespace(this));
      __publicField(this, "status", new StatusNamespace(this));
      __publicField(this, "validators", new ValidatorsNamespace(this));
      __publicField(this, "link", new LinkNamespace(this));
      __publicField(this, "cosmetics", new CosmeticsNamespace(this));
      __publicField(this, "push", new PushNamespace(this));
      __publicField(this, "files", new FilesNamespace(this));
      __publicField(this, "standing", new StandingNamespace(this));
      __publicField(this, "profiles", new ProfilesNamespace(this));
      __publicField(this, "devfund", new DevFundNamespace(this));
      __publicField(this, "check", new CheckNamespace(this));
      __publicField(this, "storage", new StorageNamespace(this));
      __publicField(this, "signing", new SigningNamespace(this));
      __publicField(this, "avatars", new AvatarsNamespace(this));
      __publicField(this, "emojis", new EmojisNamespace(this));
      __publicField(this, "trust", new TrustNamespace(this));
      __publicField(this, "accounts", new AccountsNamespace(this));
      __publicField(this, "sessions", new SessionsNamespace(this));
      __publicField(this, "ai", new AiNamespace(this));
      __publicField(this, "reports", new ReportsNamespace(this));
      __publicField(this, "moderation", new ModerationNamespace(this));
      __publicField(this, "admin", new AdminNamespace(this));
      __publicField(this, "pets", new PetsNamespace(this));
      /** Lazy Beam connection. Call `rotur.beam.connect()` when the app is ready to receive. */
      __publicField(this, "beam");
      this._token = options?.token ?? null;
      this._http = new Http(() => this._token);
      this.socket = new RoturSocket(options?.wsUrl);
      this.beam = new BeamClient({
        token: async () => {
          if (!this._token) return null;
          const result = await this.validators.generate("rotur-beam");
          return result.validator;
        }
      });
      if (this._token) this._openSocket(this._token);
    }
    get token() {
      return this._token;
    }
    get loggedIn() {
      return this._token !== null;
    }
    setToken(token) {
      this._token = token;
      if (!this.socket.connected) this._openSocket(token);
    }
    async login(options) {
      const { token } = await performAuth(options);
      this._token = token;
      this._openSocket(token);
      return this;
    }
    async connectSocket() {
      if (!this._token) throw new ApiError(401, { error: "Login first" });
      this._socketReady ?? (this._socketReady = this.socket.connect(this._token));
      return this._socketReady;
    }
    logout() {
      this._token = null;
      this._socketReady = null;
      this.socket.disconnect();
      this.beam.disconnect();
    }
    _openSocket(token) {
      const pending = this.socket.connect(token);
      this._socketReady = pending;
      void pending.catch(() => {
        if (this._socketReady === pending) this._socketReady = null;
      });
    }
  };

  // src/rotur/helpers.js
  var blocks = {
    reporter: function(opcode, text, args = {}, options = {}) {
      return {
        opcode,
        blockType: Scratch.BlockType.REPORTER,
        text,
        arguments: args,
        ...options
      };
    },
    command: function(opcode, text, args = {}, options = {}) {
      return {
        opcode,
        blockType: Scratch.BlockType.COMMAND,
        text,
        arguments: args,
        ...options
      };
    },
    boolean: function(opcode, text, args = {}, options = {}) {
      return {
        opcode,
        blockType: Scratch.BlockType.BOOLEAN,
        text,
        arguments: args,
        ...options
      };
    },
    event: function(opcode, text, options = {}) {
      return {
        opcode,
        blockType: Scratch.BlockType.EVENT,
        text,
        isEdgeActivated: false,
        ...options
      };
    },
    button: function(text, func, options = {}) {
      return {
        blockType: Scratch.BlockType.BUTTON,
        text,
        func,
        ...options
      };
    },
    label: function(text) {
      return {
        blockType: Scratch.BlockType.LABEL,
        text
      };
    },
    separator: function() {
      return "---";
    }
  };

  // src/rotur/getinfo.js
  function buildGetInfo(ext) {
    return {
      id: "roturEXT",
      name: `RoturV${ext.version}`,
      color1: "#403041",
      blocks: [
        blocks.button("New Update Available", "openUpdate", {
          hideFromPalette: !ext.outdated
        }),
        blocks.command("connectToServer", "connect to server with designation: [DESIGNATION], system: [SYSTEM] and version: [VERSION]", {
          DESIGNATION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "rtr"
          },
          SYSTEM: {
            menu: "systems",
            defaultValue: "rotur"
          },
          VERSION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "v" + ext.version
          }
        }),
        blocks.boolean("serverOnline", "account server online"),
        blocks.command("disconnect", "disconnect from server"),
        blocks.boolean("connected", "connected to server"),
        blocks.separator(),
        blocks.event("whenConnected", "when connected to server"),
        blocks.event("whenDisconnected", "when disconnected from server"),
        blocks.separator(),
        blocks.label("Authentication"),
        blocks.command("login_prompt", "open login prompt with style [STYLE_URL]", {
          STYLE_URL: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "https://origin.mistium.com/Resources/auth.css"
          }
        }),
        blocks.reporter("login", "login with username: [USERNAME] and password: [PASSWORD]", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "test"
          },
          PASSWORD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "password"
          }
        }, { hideFromPalette: true }),
        blocks.reporter("loginMd5", "login with username: [USERNAME] and password: [PASSWORD] (md5)", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "test"
          },
          PASSWORD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "password"
          }
        }, { hideFromPalette: true }),
        blocks.reporter("loginToken", "login with token: [TOKEN]", {
          TOKEN: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "token"
          }
        }),
        blocks.reporter("register", "register with username: [USERNAME] and password: [PASSWORD]", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "test"
          },
          PASSWORD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "password"
          }
        }, { hideFromPalette: true }),
        blocks.command("logout", "logout"),
        blocks.boolean("loggedIn", "authenticated"),
        blocks.boolean("firstLogin", "is this the first login of today?", {}, {
          hideFromPalette: true
        }),
        blocks.event("whenAuthenticated", "when authenticated"),
        blocks.separator(),
        blocks.label("Account Information"),
        blocks.button("Account Docs", "openAccountDocs"),
        blocks.reporter("getToken", "user token"),
        blocks.reporter("getkey", "get [KEY]", {
          KEY: {
            menu: "keys"
          }
        }),
        blocks.reporter("setkey", "set [KEY] to [VALUE]", {
          KEY: {
            menu: "keys"
          },
          VALUE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "value"
          }
        }),
        blocks.boolean("keyExists", "key [KEY] exists", {
          KEY: {
            menu: "keys"
          }
        }),
        blocks.reporter("getkeys", "get all keys"),
        blocks.reporter("getvalues", "get all values"),
        blocks.reporter("getAccount", "get account object"),
        blocks.event("whenAccountUpdate", "when account updated"),
        blocks.separator(),
        blocks.label("Data Storage"),
        blocks.button("Data Storage Docs", "openStorageDocs"),
        blocks.command("setStorageID", "set storage id to [ID]", {
          ID: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "id"
          }
        }),
        blocks.boolean("storageIdExists", "storage id has been set"),
        blocks.reporter("getStorageID", "storage id"),
        blocks.reporter("getStorageKey", "get key from storage [KEY]", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key"
          }
        }),
        blocks.command("setStorageKey", "set key [KEY] to [VALUE] in storage", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key"
          },
          VALUE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "value"
          }
        }),
        blocks.boolean("existsStorageKey", "key [KEY] exists in storage", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key"
          }
        }),
        blocks.command("deleteStorageKey", "delete key [KEY] from storage", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key"
          }
        }),
        blocks.reporter("getStorageKeys", "get all keys from storage"),
        blocks.reporter("getStorageValues", "get all values from storage"),
        blocks.command("clearStorage", "clear storage"),
        blocks.label("Storage Information"),
        blocks.reporter("storageUsage", "storage usage (characters)"),
        blocks.reporter("storageLimit", "storage limit (characters)"),
        blocks.reporter("storageRemaining", "storage remaining (characters)"),
        blocks.reporter("accountStorageUsage", "account storage usage (characters)"),
        blocks.reporter("accountStorageLimit", "account storage limit (characters)"),
        blocks.reporter("accountStorageRemaining", "account storage remaining (characters)"),
        blocks.separator(),
        blocks.label("Messaging"),
        blocks.command("sendMessage", "send message [PAYLOAD] to user [USER] on port: [TARGET] from port: [SOURCE]", {
          PAYLOAD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "Hello"
          },
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "targetUser"
          },
          TARGET: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "port"
          },
          SOURCE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "port"
          }
        }),
        blocks.event("whenMessageReceived", "when message received"),
        blocks.reporter("getPacketsFromTarget", "get packets from port [TARGET]", {
          TARGET: {
            menu: "targets"
          }
        }),
        blocks.reporter("getFirstPacketOnTarget", "first packet on port [TARGET]", {
          TARGET: {
            menu: "targets"
          }
        }),
        blocks.reporter("dataOfFirstPacketOnTarget", "[DATA] of first packet on port [TARGET]", {
          DATA: {
            menu: "packetData"
          },
          TARGET: {
            menu: "targets"
          }
        }),
        blocks.reporter("numberOfPacketsOnTarget", "number of packets on port [TARGET]", {
          TARGET: {
            menu: "targets"
          }
        }),
        blocks.reporter("getAllTargets", "all open targets"),
        blocks.reporter("getAllPackets", "all packets"),
        blocks.reporter("deleteFirstPacketOnTarget", "pop first of port [TARGET]", {
          TARGET: {
            menu: "targets"
          }
        }),
        blocks.command("deletePacketsOnTarget", "delete all packets on port [TARGET]", {
          TARGET: {
            menu: "targets"
          }
        }),
        blocks.command("deleteAllPackets", "delete all packets"),
        blocks.separator(),
        blocks.label("Raw Packet Queue"),
        blocks.reporter("RAWgetAllPackets", "get all raw packets"),
        blocks.reporter("RAWgetFirstPacket", "first raw packet"),
        blocks.command("RAWdeleteFirstPacket", "pop first raw packet"),
        blocks.command("RAWdeleteAllPackets", "delete all raw packets"),
        blocks.separator(),
        blocks.label("Client Information"),
        blocks.reporter("clientIP", "client IP"),
        blocks.reporter("clientUsername", "client username"),
        blocks.reporter("getClient", "my client object"),
        blocks.separator(),
        blocks.label("Users"),
        blocks.reporter("clientUsers", "connected users"),
        blocks.boolean("usernameConnected", "username [USER] connected on any designation", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          }
        }),
        blocks.boolean("userConnected", "user [USER] connected on designation: [DESIGNATION]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          },
          DESIGNATION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "rtr"
          }
        }),
        blocks.reporter("getUserDesignation", "get all users on designation: [DESIGNATION]", {
          DESIGNATION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "rtr"
          }
        }),
        blocks.reporter("findID", "find all connections of username: [USER]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          }
        }),
        blocks.event("onJoin", "when a user connects"),
        blocks.event("onLeave", "when a user disconnects"),
        blocks.reporter("onJoinUser", "last user to join"),
        blocks.reporter("onLeaveUser", "last user to leave"),
        blocks.separator(),
        blocks.label("Synced Variables"),
        blocks.command("setSyncedVariable", "sync variable with [USER] of [KEY] to [VALUE]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key"
          },
          VALUE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "value"
          }
        }),
        blocks.reporter("getSyncedVariable", "get synced variable with [USER] of [KEY]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key"
          }
        }),
        blocks.command("deleteSyncedVariable", "delete synced variable with [USER] of [KEY]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key"
          }
        }),
        blocks.reporter("getSyncedVariables", "get synced variables with [USER]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          }
        }),
        blocks.separator(),
        blocks.label("rMail"),
        blocks.button("Mail Docs", "openMailDocs"),
        blocks.event("whenMailReceived", "when mail received"),
        blocks.reporter("sendMail", "send mail with subject: [SUBJECT] and message: [MESSAGE] to: [TO]", {
          SUBJECT: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "Subject"
          },
          MESSAGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "Message"
          },
          TO: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          }
        }),
        blocks.reporter("getAllMail", "get mail list"),
        blocks.reporter("getMail", "get body of mail at index [ID]", {
          ID: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "1"
          }
        }),
        blocks.command("deleteMail", "delete mail at index [ID]", {
          ID: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "1"
          }
        }),
        blocks.command("deleteAllMail", "delete all mail"),
        blocks.separator(),
        blocks.label("Friends"),
        blocks.button("Friends Docs", "openFriendsDocs"),
        blocks.reporter("getFriendList", "get friend list"),
        blocks.reporter("removeFriend", "remove friend [FRIEND]", {
          FRIEND: {
            menu: "friends"
          }
        }),
        blocks.reporter("acceptFriendRequest", "accept friend request from [FRIEND]", {
          FRIEND: {
            menu: "requests"
          }
        }),
        blocks.reporter("declineFriendRequest", "decline friend request from [FRIEND]", {
          FRIEND: {
            menu: "requests"
          }
        }),
        blocks.reporter("sendFriendRequest", "send friend request to [FRIEND]", {
          FRIEND: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "friend"
          }
        }),
        blocks.event("whenFriendRequestReceived", "when friend request received"),
        blocks.event("whenFriendRequestAccepted", "when friend request accepted"),
        blocks.reporter("getFriendRequests", "get friend requests"),
        blocks.reporter("getFriendStatus", "get friend status of [FRIEND]", {
          FRIEND: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "friend"
          }
        }),
        blocks.reporter("getFriendCount", "get friend count"),
        blocks.separator(),
        blocks.label("Currency"),
        blocks.button("Currency Docs", "openCurrencyDocs"),
        blocks.reporter("getBalance", "get balance"),
        blocks.reporter("tranferCurrency", "transfer [AMOUNT] to [USER]", {
          AMOUNT: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "0"
          },
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user"
          }
        }),
        blocks.event("whenBalanceChanged", "when balance changed"),
        blocks.reporter("getTransactions", "get transactions"),
        blocks.reporter("getTransactionCount", "transaction count"),
        blocks.separator(),
        blocks.label("My Keys"),
        blocks.button("Mange My Keys", "openKeyManager"),
        blocks.reporter("getMyOwnedItems", "my keys"),
        blocks.reporter("itemData", "get key data for id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item"
          }
        }),
        blocks.reporter("purchaseItem", "purchase key with id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item"
          }
        }),
        blocks.reporter("itemInfo", "get key info for id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item"
          }
        }),
        blocks.boolean("ownsItem", "do I own key of id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item"
          }
        }),
        blocks.reporter("getPublicItems", "get public items, page: [PAGE]", {
          PAGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "1"
          }
        }, { hideFromPalette: true }),
        blocks.reporter("getPublicItemPages", "get public item pages", {}, {
          disableMonitor: true,
          hideFromPalette: true
        }),
        blocks.reporter("updateItem", "keys - update [KEY] to [DATA] for id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "ID"
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            menu: "itemKeys"
          },
          DATA: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "data"
          }
        }, { hideFromPalette: true }),
        blocks.reporter("deleteItem", "keys - delete (ID) [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item"
          }
        }, { hideFromPalette: true }),
        blocks.reporter("hideItem", "items - disable purchases on (ID) [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item"
          }
        }, { hideFromPalette: true }),
        blocks.reporter("showItem", "items - enable purchases on (ID) [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item"
          }
        }, { hideFromPalette: true }),
        blocks.separator(),
        blocks.label("Badges"),
        blocks.button("Badge Docs", "openBadgesDocs"),
        blocks.boolean("gotBadgesSuccessfully", "badges loaded successfully"),
        blocks.reporter("userBadges", "all user badges"),
        blocks.reporter("userBadgeCount", "total badge count"),
        blocks.boolean("hasBadge", "does user have badge: [BADGE]", {
          BADGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "badge"
          }
        }),
        blocks.reporter("badgeInfo", "badge info [BADGE]", {
          BADGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "badge"
          }
        }),
        blocks.reporter("allBadges", "all badges", {}, { hideFromPalette: true }),
        blocks.command("redownloadBadges", "redownload badges", {}, { hideFromPalette: true }),
        blocks.separator(),
        blocks.label("Voice Calling"),
        blocks.button("Example Project", "openRoturVoiceExample"),
        blocks.button("Get roturVoice", "openRoturVoice"),
        blocks.reporter("callUser", "call user [USERNAME]", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "friend"
          }
        }),
        blocks.event("whenCallReceived", "when call received"),
        blocks.event("whenCallAccepted", "when my call is accepted"),
        blocks.reporter("callData", "call data"),
        blocks.command("acceptCall", "accept call"),
        blocks.separator(),
        blocks.label("DANGER ZONE"),
        blocks.button("Show Danger Zone", "openDangerZone", {
          hideFromPalette: ext.showDangerous
        }),
        blocks.button("Hide Danger Zone", "closeDangerZone", {
          hideFromPalette: !ext.showDangerous
        }),
        blocks.reporter("deleteAccount", "delete account", {}, {
          hideFromPalette: !ext.showDangerous,
          disableMonitor: true
        })
      ],
      menus: {
        systems: {
          acceptReporters: true,
          items: "systemsList"
        },
        packetData: {
          acceptReporters: true,
          items: ["origin", "client", "source port", "payload", "timestamp"]
        },
        targets: {
          acceptReporters: true,
          items: "openPorts"
        },
        keys: {
          acceptReporters: true,
          items: "accountKeys"
        },
        friends: {
          acceptReporters: true,
          items: "myFriends"
        },
        requests: {
          acceptReporters: true,
          items: "myRequests"
        },
        itemKeys: {
          acceptReporters: true,
          items: [
            "name",
            "description",
            "price",
            "data",
            "tradable",
            "hidden"
          ]
        },
        callInfo: {
          acceptReporters: true,
          items: [
            "caller",
            "status",
            "duration",
            "timestamp"
          ]
        }
      }
    };
  }

  // src/rotur/extension.js
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Rotur must run unsandboxed.");
  }
  var EXT_VERSION = 9;
  var LEGACY_AUTH_RETIRED = "Username/password login was retired. Use the login prompt or login with token.";
  var SYNC_ROOM = "rotur-ext-sync";
  var SOCKET_TIMEOUT_MS = 15e3;
  function apiMessage(error, fallback) {
    if (error && typeof error === "object" && "data" in error) {
      const data = error.data;
      if (data && typeof data === "object" && "error" in data) return String(data.error);
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback;
  }
  var RoturExtension = class {
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
      fetch("https://api.rotur.dev/systems").then((resp) => resp.json()).then((data) => {
        this.systems = Object.keys(data || {});
      }).catch(() => {
        this.systems = [];
      });
      const cleanUpLogin = () => {
        if (typeof window === "undefined") return;
        if (window._roturOverlay && Scratch.renderer) {
          try {
            Scratch.renderer.removeOverlay(window._roturOverlay);
          } catch (_) {
          }
        }
        if (window._roturAuthHandler) window.removeEventListener("message", window._roturAuthHandler);
        delete window._roturOverlay;
        delete window._roturAuthHandler;
      };
      try {
        Scratch.vm.on("PROJECT_RUN_START", cleanUpLogin);
        Scratch.vm.on("PROJECT_RUN_STOP", cleanUpLogin);
      } catch (_) {
      }
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
      } catch (_) {
      }
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
      } catch (_) {
      }
    }
    _connectSocket() {
      this._ensureClient();
      if (!this.sdk.loggedIn) return Promise.reject(new Error("Login first"));
      if (this._online()) return Promise.resolve();
      if (!this.socketTask) {
        let timer;
        const timeout = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("Connection timed out")), SOCKET_TIMEOUT_MS);
        });
        const ready = this.sdk.connectSocket().then((conn) => this._online() ? conn : this.sdk.socket.once("ready"));
        this.socketTask = Promise.race([ready, timeout]).finally(() => {
          clearTimeout(timer);
          this.socketTask = null;
        });
      }
      return this.socketTask;
    }
    _applyAccount(me) {
      this.account = { ...me || {} };
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
      } catch (_) {
      }
    }
    async _refreshFriends(fireHats = true) {
      if (!this.sdk || !this.sdk.loggedIn) return;
      try {
        const [listRes, reqRes, outRes] = await Promise.all([
          this.sdk.friends.list().catch(() => ({ friends: this.friends.list })),
          this.sdk.me.requests().catch(() => ({ requests: this.friends.requests })),
          this.sdk.me.outgoing().catch(() => ({ outgoing: [] }))
        ]);
        const list = listRes.friends || [];
        const incoming = reqRes.requests || [];
        const outgoing = outRes.outgoing || outRes.requests || [];
        if (fireHats) {
          if (incoming.length > this.friends.requests.length) this._hat("whenFriendRequestReceived");
          if (list.length > this.friends.list.length) this._hat("whenFriendRequestAccepted");
        }
        this.friends = { list, requests: incoming, outgoing };
      } catch (_) {
      }
    }
    async _refreshBalance(fireHat = true) {
      if (!this.sdk || !this.sdk.loggedIn) return;
      try {
        const me = await this.sdk.me.get();
        const next = typeof me.currency === "number" ? me.currency : this.balance;
        if (fireHat && next !== this.balance) this._hat("whenBalanceChanged");
        this.balance = next;
        this._applyAccount(me);
      } catch (_) {
      }
    }
    _startPolling() {
      if (this._pollTimer) return;
      this._pollTimer = setInterval(() => {
        if (!this._authed()) return;
        this._refreshFriends(true);
        this._refreshBalance(true);
      }, 15e3);
    }
    _routeSocketMessage(msg) {
      var _a, _b;
      const room = msg.room || this.designation;
      const val = msg.val && typeof msg.val === "object" ? msg.val : { payload: msg.val };
      const origin = msg.origin && msg.origin.username || val.from || "Unknown";
      if (val.kind === "sync_set") {
        (_a = this.syncedVariables)[origin] || (_a[origin] = {});
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
          timestamp: msg.timestamp || Date.now()
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
        payload: val.payload !== void 0 ? val.payload : "",
        timestamp: msg.timestamp || Date.now()
      };
      (_b = this.packets)[room] || (_b[room] = []);
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
        } catch (_) {
        }
        this._joinRooms();
      }
      if (this.sdk.loggedIn) {
        this._connectSocket().then(() => this._refreshAll()).catch((error) => console.error("Rotur connect failed:", error));
      }
    }
    serverOnline() {
      return fetch("https://api.rotur.dev/systems").then((resp) => resp.ok).catch(() => false);
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
      } catch (_) {
      }
      this.is_connected = false;
      this.authenticated = false;
      this.account = null;
      this.roomMembers = {};
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
      if (this.sdk.token && this.sdk.token !== token) this.disconnect();
      try {
        this.sdk.setToken(token);
        await this._connectSocket();
        await this._refreshAll();
        this._hat("whenAuthenticated");
        return "Logged In";
      } catch (error) {
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
      return this.sdk && this.sdk.token || "";
    }
    // Account key blocks (backed by the SDK account object)
    getkey(args) {
      if (!this._online()) return "Not Connected";
      if (!this._authed()) return "Not Logged In";
      const value = this.account[args.KEY];
      if (value === void 0) return "";
      return typeof value === "object" ? JSON.stringify(value) : value;
    }
    async setkey(args) {
      if (String(args.VALUE).length > 1e3) return "Key Too Long, Limit is 1000 Characters";
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
        if (value === void 0) return "";
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
        return value !== void 0;
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
      } catch (_) {
      }
      try {
        if (args.USER) {
          this.sdk.socket.sendPrivateMessage(room, args.USER, {
            kind: "message",
            payload: args.PAYLOAD,
            source: args.SOURCE,
            client: this.clientInfo
          });
        } else {
          this.sdk.socket.sendGroupMessage(room, {
            kind: "message",
            payload: args.PAYLOAD,
            source: args.SOURCE,
            client: this.clientInfo
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
          return JSON.stringify(first?.client) || '{"system":"Unknown", "version":"Unknown"}';
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
        ...this.clientInfo
      });
    }
    _roomUsernames(room) {
      const members = this.roomMembers[room || this.designation] || [];
      return members.map((m) => typeof m === "string" ? m : m.username).filter(Boolean);
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
      var _a, _b;
      if (!this._online()) return "Not Connected";
      if (!this._authed()) return "Not Logged In";
      try {
        this.sdk.socket.sendPrivateMessage(this.designation, args.USER, {
          kind: "sync_set",
          key: args.KEY,
          value: args.VALUE,
          from: this.username
        });
      } catch (error) {
        return apiMessage(error, "Failed to sync variable");
      }
      (_a = this.syncedVariables)[_b = args.USER] || (_a[_b] = {});
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
          from: this.username
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
          from: this.username
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
        this.mailbox.map((m) => ({ id: m.id, subject: m.subject, from: m.from }))
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
      } catch (_) {
      }
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
        (badge) => badge === args.BADGE || badge?.id === args.BADGE || badge?.name === args.BADGE
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
          call: this.callJson
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
          call: this.callJson
        });
        return "Call Accepted";
      } catch (error) {
        return apiMessage(error, "Failed to accept call");
      }
    }
  };
  Scratch.extensions.register(new RoturExtension());
})();
