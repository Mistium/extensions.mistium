(function(Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("'Key History' needs to be run unsandboxed.");
  }

  class KeyHistoryExtension {
    constructor() {
      this.keyHistory = [];
      this.max_key_history = 100;
      this.keybinds = ["Ctrl", "Shift", "Alt"];
      this.keysDown = [];
      this.keysHit = [];
      this.keyHitTimes = [];
      this.pause = false;

      document.addEventListener("keydown", (e) => this.onKeyDown(e));
      document.addEventListener("keyup", (e) => this.onKeyUp(e));
      document.addEventListener("paste", (e) => this.onPaste(e));

      console.log("Key History Extension Loaded");
    }

    getInfo() {
      return {
        id: "MistKeyHistoryExtension",
        name: "Key History",
        color1: "#36644E",
        blocks: [
          { opcode: "getRecentKeys", blockType: Scratch.BlockType.REPORTER, text: "get recent keys" },
          { opcode: "getKeysDown", blockType: Scratch.BlockType.REPORTER, text: "keys down" },
          { opcode: "getFirstKey", blockType: Scratch.BlockType.REPORTER, text: "get first key" },
          { opcode: "lastKeyPressed", blockType: Scratch.BlockType.REPORTER, text: "get last key" },
          "---",
          { opcode: "iskeyPressed", blockType: Scratch.BlockType.BOOLEAN, text: "key [KEY] pressed?", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "a" } } },
          { opcode: "iskeyhit", blockType: Scratch.BlockType.BOOLEAN, text: "key [KEY] hit?", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "a" } } },
          "---",
          { opcode: "deleteFirstKey", blockType: Scratch.BlockType.COMMAND, text: "delete the first key from history" },
          { opcode: "deleteAllKeys", blockType: Scratch.BlockType.COMMAND, text: "delete all keys from history" },
          { opcode: "AddKey", blockType: Scratch.BlockType.COMMAND, text: "add [KEY] to key history", arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "a" } } },
          "---",
          { opcode: "setMaxQueueSize", blockType: Scratch.BlockType.COMMAND, text: "limit key history to [LENGTH] keys", arguments: { LENGTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 } } },
          { opcode: "ignoreKeybinds", blockType: Scratch.BlockType.COMMAND, text: "ignore keys [KEYS]", arguments: { KEYS: { type: Scratch.ArgumentType.STRING, defaultValue: '["Ctrl", "Shift", "Alt"]' } } },
          "---",
          { opcode: "enableKeyHistory", blockType: Scratch.BlockType.COMMAND, text: "enable key history" },
          { opcode: "disableKeyHistory", blockType: Scratch.BlockType.COMMAND, text: "disable key history" },
          "---",
          { opcode: "recentKeysAsRawJs", blockType: Scratch.BlockType.REPORTER, text: "recent keys as raw object" }
        ]
      };
    }

    getRecentKeys() {
      return JSON.stringify(this.keyHistory);
    }

    getFirstKey() {
      let firstKey = this.keyHistory[0];
      return typeof firstKey === "object" ? JSON.stringify(firstKey ?? "") : Scratch.Cast.toString(firstKey ?? "");
    }

    deleteFirstKey() {
      if (this.keyHistory.length > 0) {
        this.keyHistory.shift();
      }
    }

    deleteAllKeys() {
      this.keyHistory = [];
    }

    setMaxQueueSize({ LENGTH }) {
      this.max_key_history = Scratch.Cast.toNumber(LENGTH);
    }

    AddKey({ KEY }) {
      this.addKeyToHistory(KEY);
    }

    onKeyDown(event) {
      const key = Scratch.Cast.toString(event.key ?? "");
      const lowerKey = key.toLowerCase();

      if (!this.keysHit.includes(lowerKey)) {
        this.keysHit.push(lowerKey);
        this.keyHitTimes.push(Date.now());
      }

      if (!this.keysDown.includes(lowerKey)) {
        this.keysDown.push(lowerKey);
      }

      if (!event.metaKey && !event.ctrlKey && !this.isKeybind(key) && !this.pause) {
        this.addKeyToHistory(key);
      }
    }

    onKeyUp(event) {
      const key = Scratch.Cast.toString(event.key ?? "").toLowerCase();
      const downIndex = this.keysDown.indexOf(key);

      if (downIndex !== -1) {
        this.keysDown.splice(downIndex, 1);
      }

      const hitIndex = this.keysHit.indexOf(key);
      if (hitIndex !== -1) {
        this.keysHit.splice(hitIndex, 1);
        this.keyHitTimes.splice(hitIndex, 1);
      }
    }

    onPaste(event) {
      const pastedData = event.clipboardData.getData("text/plain");
      const pasteObject = { type: "paste", data: Scratch.Cast.toString(pastedData) };
      this.addKeyToHistory(pasteObject);
    }

    ignoreKeybinds({ KEYS }) {
      try {
        this.keybinds = JSON.parse(KEYS);
      } catch (error) {
        // Handle parsing error
      }
    }

    isKeybind(key) {
      return this.keybinds.includes(Scratch.Cast.toString(key));
    }

    addKeyToHistory(key) {
      if (this.keyHistory.length >= this.max_key_history) {
        this.keyHistory.shift();
      }

      if (typeof key !== "object") {
        key = key.length > 1 ? { type: "special", data: key } : { type: "key", data: Scratch.Cast.toString(key) };
      }

      this.keyHistory.push(key);
    }

    enableKeyHistory() {
      this.pause = false;
    }

    disableKeyHistory() {
      this.pause = true;
    }

    lastKeyPressed() {
      let lastKey = this.keyHistory[this.keyHistory.length - 1] ?? "";
      return typeof lastKey === "object" ? JSON.stringify(lastKey) : Scratch.Cast.toString(lastKey);
    }

    iskeyPressed({ KEY }) {
      return this.keysDown.includes(Scratch.Cast.toString(KEY));
    }

    iskeyhit({ KEY }) {
      const key = Scratch.Cast.toString(KEY);
      const hitIndex = this.keysHit.indexOf(key);

      if (hitIndex !== -1) {
        let recentlyHit = false;
        recentlyHit = Date.now() - this.keyHitTimes[hitIndex] < 100;
        this.keyHitTimes[hitIndex] = 0;
        return recentlyHit;
      }

      return false;
    }

    getKeysDown() {
      return JSON.stringify(this.keysDown);
    }

    recentKeysAsRawJs() {
      return this.keyHistory;
    }
  }

  Scratch.extensions.register(new KeyHistoryExtension());
})(Scratch);
