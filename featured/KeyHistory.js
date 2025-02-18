// Name: KeyHistory
// Author: Mistium
// Description: Manage previous keys simply

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  // Ensure the extension runs unsandboxed
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("'Key History' needs to be run unsandboxed.");
  }

  // Register the extension
  Scratch.extensions.register(new class {
    constructor() {
      this.keyHistory = [];  // History of pressed keys
      this.maxKeyHistory = 100;  // Max number of keys in history
      this.keybinds = ["Ctrl", "Shift", "Alt"];  // Special keybinds
      this.keysDown = [];  // List of currently pressed keys
      this.keysPressed = [];  // List of keys that have been pressed
      this.keyPressTimes = [];  // Times when keys were pressed
      this.isPaused = false;  // Pause flag for key history collection

      // Event listeners for key events and paste events
      document.addEventListener("keydown", (event) => this.onKeyDown(event));
      document.addEventListener("keyup", (event) => this.onKeyUp(event));
      document.addEventListener("paste", (event) => this.onPaste(event));

      console.log("Key History Extension Loaded");
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
        }, "---", {
          opcode: "recentKeysAsRawObject",
          blockType: Scratch.BlockType.REPORTER,
          text: "recent keys as raw object"
        }]
      };
    }

    // Returns the recent key history as a stringified JSON
    getRecentKeys() {
      return JSON.stringify(this.keyHistory);
    }

    // Gets the first key in the history
    getFirstKey() {
      let firstKey = this.keyHistory[0];
      return typeof firstKey === "object" ? JSON.stringify(firstKey || "") : Scratch.Cast.toString(firstKey || "");
    }

    // Deletes the first key in the history
    deleteFirstKey() {
      if (this.keyHistory.length > 0) {
        this.keyHistory.shift();
      }
    }

    // Clears the entire key history
    deleteAllKeys() {
      this.keyHistory = [];
    }

    // Sets the maximum size for the key history
    setMaxHistorySize({ LENGTH }) {
      this.maxKeyHistory = Scratch.Cast.toNumber(LENGTH);
    }

    // Adds a specific key to the key history
    addKey({ KEY }) {
      this.addKeyToHistory(KEY);
    }

    // Handles keydown event, updates key states
    onKeyDown(event) {
      const key = Scratch.Cast.toString(event.key || "").toLowerCase();
      const isCtrlOrMeta = event.ctrlKey || event.metaKey;
      const isModifierKey = ["control", "meta", "shift", "alt"].includes(key);

      if (!this.keysPressed.includes(key)) {
        this.keysPressed.push(key);
        this.keyPressTimes.push(Date.now());
      }

      if (!this.keysDown.includes(key)) {
        this.keysDown.push(key);
      }

      if (isCtrlOrMeta && !isModifierKey) {
        event.preventDefault();
        this.addKeyToHistory({
          type: "command",
          data: key
        });
      } else if (!this.isPaused) {
        // Add key to history unless it's in pause state
        this.addKeyToHistory(key);
      }
    }


    // Handles keyup event, updates key states
    onKeyUp(event) {
      const key = Scratch.Cast.toString(event.key || "").toLowerCase();
      const indexDown = this.keysDown.indexOf(key);
      if (indexDown !== -1) {
        this.keysDown.splice(indexDown, 1);
      }
      const indexPressed = this.keysPressed.indexOf(key);
      if (indexPressed !== -1) {
        this.keysPressed.splice(indexPressed, 1);
        this.keyPressTimes.splice(indexPressed, 1);
      }
    }

    // Handles paste event, adds the pasted text as a key event
    onPaste(event) {
      const pastedText = event.clipboardData.getData("text/plain");
      let pasteEvent = {
        type: "paste",
        data: Scratch.Cast.toString(pastedText)
      };
      this.addKeyToHistory(pasteEvent);
    }

    // Allows setting which keybinds to ignore (like Ctrl, Shift, etc.)
    ignoreKeybinds({ KEYS }) {
      try {
        this.keybinds = JSON.parse(KEYS);
      } catch (error) { }
    }

    // Checks if a key is one of the keybinds (Ctrl, Shift, etc.)
    isKeybind(key) {
      return this.keybinds.includes(Scratch.Cast.toString(key));
    }

    // Adds a key or event to the key history
    addKeyToHistory(key) {
      if (this.keyHistory.length >= this.maxKeyHistory) {
        this.keyHistory.shift();
      }

      if (typeof key !== "object") {
        key = key.length > 1 ? {
          type: "special",
          data: key
        } : {
          type: "key",
          data: Scratch.Cast.toString(key)
        };
      }

      this.keyHistory.push(key);
    }

    // Enables key history collection
    enableKeyHistory() {
      this.isPaused = false;
    }

    // Disables key history collection
    disableKeyHistory() {
      this.isPaused = true;
    }

    // Gets the last key that was pressed
    lastKeyPressed() {
      let lastKey = this.keyHistory[this.keyHistory.length - 1] || "";
      return typeof lastKey === "object" ? JSON.stringify(lastKey) : Scratch.Cast.toString(lastKey);
    }

    // Checks if a specific key is currently pressed
    isKeyPressed({ KEY }) {
      return this.keysDown.includes(Scratch.Cast.toString(KEY));
    }

    // Checks if a specific key was hit (pressed and released quickly)
    isKeyHit({ KEY }) {
      const key = Scratch.Cast.toString(KEY);
      const hitIndex = this.keysPressed.indexOf(key);
      if (hitIndex !== -1) {
        const isHit = Date.now() - this.keyPressTimes[hitIndex] < 100;
        this.keyPressTimes[hitIndex] = 0;
        return isHit;
      }
      return false;
    }

    // Gets a list of all currently pressed keys
    getKeysDown() {
      return JSON.stringify(this.keysDown);
    }

    // Returns the raw key history as an object
    recentKeysAsRawObject() {
      return this.keyHistory;
    }
  });
})(Scratch);
