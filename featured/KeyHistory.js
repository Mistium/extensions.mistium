// Name: KeyHistory
// Author: Mistium
// Description: Manage previous keys simply
// Version: v9.6

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("KeyHistory must run unsandboxed.");
  }

  class KeyHistory {
    constructor() {
      this.keyObj = {};
      this.keyHistory = [];
      this.maxHistorySize = 100;
      this.enabled = true;
      this.keysDown = [];
      this.lastDown = [];
      this.currentDown = [];

      this.specialKeys = [
        'Backspace', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'CapsLock',
        'Escape', 'Space', 'PageUp', 'PageDown', 'End', 'Home',
        'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
        'Insert', 'Delete', 'Meta', 'ContextMenu',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
      ];

      Scratch.vm.runtime.on("BEFORE_EXECUTE", () => {
        this.lastDown = this.currentDown;
        this.currentDown = this.keysDown;
      });

      document.addEventListener("keydown", (e) => {
        const keyData = e.key;
        const keyType = this.specialKeys.includes(e.code) || this.specialKeys.includes(e.key) ? "special" : "key";

        this.keyObj[e.code] = { type: keyType, data: keyData };
        this.keysDown = Object.values(this.keyObj);
        if (this.enabled) this.addKeyWithType(keyType, keyData);
      });

      document.addEventListener("keyup", (e) => {
        delete this.keyObj[e.code];
        this.keysDown = Object.values(this.keyObj);
      });

      // keyup never fires for keys released while the page is unfocused
      window.addEventListener("blur", () => {
        this.keyObj = {};
        this.keysDown = [];
      });

      // Add paste event listener
      document.addEventListener("paste", (e) => {
        if (!e.clipboardData) return;
        const pastedText = e.clipboardData.getData('text');
        if (this.enabled) this.addKeyWithType("paste", pastedText);
      });
    }

    getInfo() {
      return {
        id: "MistKeyHistoryExtension",
        name: "Key History",
        color1: "#36644E",
        blocks: [{
          opcode: "getRecentKeys",
          blockType: Scratch.BlockType.REPORTER,
          text: "get recent keys"
        }, {
          opcode: "getKeysDown",
          blockType: Scratch.BlockType.REPORTER,
          text: "keys down"
        }, {
          opcode: "getFirstKey",
          blockType: Scratch.BlockType.REPORTER,
          text: "get first key"
        }, {
          opcode: "lastKeyPressed",
          blockType: Scratch.BlockType.REPORTER,
          text: "get last key"
        }, {
          opcode: "historyLength",
          blockType: Scratch.BlockType.REPORTER,
          text: "length of key history"
        }, "---", {
          opcode: "isKeyPressed",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "key [KEY] pressed?",
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "a"
            }
          }
        }, {
          opcode: "isKeyHit",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "key [KEY] hit?",
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "a"
            }
          }
        }, "---", {
          opcode: "deleteFirstKey",
          blockType: Scratch.BlockType.COMMAND,
          text: "delete the first key from history"
        }, {
          opcode: "deleteLastKey",
          blockType: Scratch.BlockType.COMMAND,
          text: "delete the last key from history"
        }, {
          opcode: "deleteAllKeys",
          blockType: Scratch.BlockType.COMMAND,
          text: "delete all keys from history"
        }, {
          opcode: "addKey",
          blockType: Scratch.BlockType.COMMAND,
          text: "add [KEY] to key history",
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "a"
            }
          }
        }, "---", {
          opcode: "setMaxHistorySize",
          blockType: Scratch.BlockType.COMMAND,
          text: "limit key history to [LENGTH] keys",
          arguments: {
            LENGTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100
            }
          }
        }, {
          opcode: "ignoreKeybinds",
          blockType: Scratch.BlockType.COMMAND,
          text: "ignore keys [KEYS]",
          arguments: {
            KEYS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["Ctrl", "Shift", "Alt"]'
            }
          }
        }, "---", {
          opcode: "enableKeyHistory",
          blockType: Scratch.BlockType.COMMAND,
          text: "enable key history"
        }, {
          opcode: "disableKeyHistory",
          blockType: Scratch.BlockType.COMMAND,
          text: "disable key history"
        }, {
          opcode: "recentKeysAsRawObject",
          blockType: Scratch.BlockType.REPORTER,
          text: "recent keys as raw object",
          hidden: true
        }]
      };
    }

    getRecentKeys() {
      return JSON.stringify(this.keyHistory);
    }

    getKeysDown() {
      return JSON.stringify(this.keysDown);
    }

    getFirstKey() {
      const firstKey = this.keyHistory[0];
      return firstKey ? JSON.stringify(firstKey) : "";
    }

    lastKeyPressed() {
      const lastKey = this.keyHistory[this.keyHistory.length - 1];
      return lastKey ? JSON.stringify(lastKey) : "";
    }

    isKeyPressed({ KEY }) {
      KEY = Scratch.Cast.toString(KEY);
      return this.keysDown.some(key => key.data === KEY);
    }

    isKeyHit({ KEY }) {
      KEY = Scratch.Cast.toString(KEY);
      const isCurrentlyDown = this.currentDown.some(key => key.data === KEY);
      const wasDownBefore = this.lastDown.some(key => key.data === KEY);
      return isCurrentlyDown && !wasDownBefore;
    }

    deleteFirstKey() {
      this.keyHistory.shift();
    }

    deleteLastKey() {
      this.keyHistory.pop();
    }

    historyLength() {
      return this.keyHistory.length;
    }

    deleteAllKeys() {
      this.keyHistory = [];
    }

    // New method to add keys with a specific type
    addKeyWithType(type, data) {
      this.keyHistory.push({ type: type, data: data });
      this.trimHistory();
    }

    trimHistory() {
      const excess = this.keyHistory.length - this.maxHistorySize;
      if (excess > 0) this.keyHistory.splice(0, excess);
    }

    addKey({ KEY }) {
      KEY = Scratch.Cast.toString(KEY);
      this.addKeyWithType("key", KEY);
    }

    setMaxHistorySize({ LENGTH }) {
      LENGTH = Math.max(0, Math.floor(Scratch.Cast.toNumber(LENGTH)));
      this.maxHistorySize = LENGTH;
      this.trimHistory();
    }

    enableKeyHistory() {
      this.enabled = true;
    }

    disableKeyHistory() {
      this.enabled = false;
    }

    recentKeysAsRawObject() {
      return this.keyHistory.slice();
    }

    ignoreKeybinds(args) {
      try {
        const keys = JSON.parse(Scratch.Cast.toString(args.KEYS));
        if (Array.isArray(keys)) this.specialKeys = keys.map(String);
      } catch (e) {
        // invalid JSON: keep the current list
      }
    }
  }

  Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumKeyHistory = new KeyHistory());
})(Scratch);
