// Name: Key History
// ID: KeyHistoryExtension
// By: Mistium <https://scratch.mit.edu/users/M1stium>
// Verson: 5
// Description: Store a list of previously pressed keys and clipboard events.
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`'Key History' needs to be run unsandboxed.`);
  }

  class KeyHistoryExtension {
    constructor() {
      this.keyHistory = [];
      this.max_key_history = 100; // Adjust the maximum number of keys to keep in history
      this.keybinds = ["Ctrl", "Shift", "Alt"];
      this.keysDown = [];
      this.keysHit = [];
      this.keyHitTimes = [];
      this.pause = false;
      document.addEventListener("keydown", (event) => this.onKeyDown(event));
      document.addEventListener("keyup", (event) => this.onKeyUp(event));
      document.addEventListener("paste", (event) => this.onPaste(event));
    }

    getInfo() {
      return {
        id: "MistKeyHistoryExtension",
        name: "Key History",
        color1: "#36644E",
        blocks: [
          {
            opcode: "getRecentKeys",
            blockType: Scratch.BlockType.REPORTER,
            text: "get recent keys",
          },
          {
            opcode: "getFirstKey",
            blockType: Scratch.BlockType.REPORTER,
            text: "get first key",
          },
          {
            opcode: "deleteFirstKey",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete the first key from history",
          },
          {
            opcode: "deleteAllKeys",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete all keys from history",
          },
          {
            opcode: "AddKey",
            blockType: Scratch.BlockType.COMMAND,
            text: "add [KEY] to key history",
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a",
              },
            },
          },
          "---",
          {
            opcode: "setMaxQueueSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "limit key history to [LENGTH] keys",
            arguments: {
              LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
          },
          {
            opcode: "ignoreKeybinds",
            blockType: Scratch.BlockType.COMMAND,
            text: "ignore keys [KEYS]",
            arguments: {
              KEYS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[\"Ctrl\", \"Shift\", \"Alt\"]",
              },
            },
          },
          "---",
          {
            opcode: "enableKeyHistory",
            blockType: Scratch.BlockType.COMMAND,
            text: "enable key history",
          },
          {
            opcode: "disableKeyHistory",
            blockType: Scratch.BlockType.COMMAND,
            text: "disable key history",
          },
          "---",
          {
            opcode: "onKeyPressed",
            blockType: Scratch.BlockType.EVENT,
            text: "when key is pressed",
            isEdgeActivated: false,
          },
          {
            opcode: "onKeyReleased",
            blockType: Scratch.BlockType.EVENT,
            text: "when key is released",
            isEdgeActivated: false,
          },
          {
            opcode: "onTextPasted",
            blockType: Scratch.BlockType.EVENT,
            text: "when text is pasted",
            isEdgeActivated: false,
          },
          {
            opcode: "lastKeyPressed",
            blockType: Scratch.BlockType.REPORTER,
            text: "last key pressed",
          },
          {
            opcode: "getKeysDown",
            blockType: Scratch.BlockType.REPORTER,
            text: "keys down",
          },
          {
            opcode: "iskeyPressed",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "key [KEY] pressed?",
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a",
              },
            },
          },
          {
            opcode: "iskeyhit",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "key [KEY] hit?",
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a",
              },
            },
          }
        ],
      };
    }

    getRecentKeys() {
      return JSON.stringify(this.keyHistory);
    }

    getFirstKey() {
      return Scratch.Cast.toString(this.keyHistory[0]);
    }

    deleteFirstKey() {
      if (this.keyHistory.length > 0) {
        this.keyHistory.shift();
      }
    }

    deleteAllKeys() {
      this.keyHistory = [];
    }

    AddKey({ KEY }) {
      this.addKeyToHistory(Scratch.Cast.toString(KEY));
    }

    setMaxQueueSize({ LENGTH }) {
      this.max_key_history = Scratch.Cast.toNumber(LENGTH);
    }

    onKeyDown(event) {
      Scratch.vm.runtime.startHats('KeyHistoryExtension_onKeyPressed');

      const key = Scratch.Cast.toString(event.key ?? "");
      const lowerkey = key.toLowerCase();
      if (!this.keysHit.includes(lowerkey)) {
        this.keysHit.push(lowerkey);
        this.keyHitTimes.push(Date.now());
      }
    
      // Only add the key if it's not already in keysDown
      if (!this.keysDown.includes(lowerkey)) {
        this.keysDown.push(lowerkey);
      }
    
      if (event.metaKey || event.ctrlKey || this.isKeybind(key) || this.pause) {
        return;
      }
    
      this.addKeyToHistory(key);
    }

    onKeyUp(event) {
      Scratch.vm.runtime.startHats('KeyHistoryExtension_onKeyReleased');
    
      // Convert the key to a string to ensure consistency
      const key = Scratch.Cast.toString(event.key ?? "").toLowerCase();
      const lowerkey = key.toLowerCase();
      const index = this.keysDown.indexOf(lowerkey);
    
      // Check if the key is actually in the array before trying to remove it
      if (index !== -1) {
        this.keysDown.splice(index, 1);
      }

      let hitIndex = this.keysHit.indexOf(lowerkey);

      if (hitIndex !== -1) {
        this.keysHit.splice(hitIndex, 1);
        this.keyHitTimes.splice(hitIndex, 1);
      }
    }
    

    onPaste(event) {
      Scratch.vm.runtime.startHats('KeyHistoryExtension_onTextPasted');
      const pastedText = event.clipboardData.getData("text/plain");
      this.addKeyToHistory(Scratch.Cast.toString(pastedText));
    }

    ignoreKeybinds({ KEYS }) {
      try {
        this.keybinds = JSON.parse(KEYS);
      } catch (e) {}
    }

    isKeybind(key) {
      return this.keybinds.includes(Scratch.Cast.toString(key));
    }

    addKeyToHistory(key) {
      // Check if the maximum history size is reached
      if (this.keyHistory.length >= this.max_key_history) {
        this.keyHistory.shift(); // Remove the first element instead of pop
      }

      // Add the key to the end of the array
      this.keyHistory.push(Scratch.Cast.toString(key));
    }

    enableKeyHistory() {
      this.pause = false;
    }

    disableKeyHistory() {
      this.pause = true;
    }

    lastKeyPressed() {
      return Scratch.Cast.toString(this.keyHistory[this.keyHistory.length - 1] ?? "");
    }

    iskeyPressed({ KEY }) {
      return this.keysDown.includes(Scratch.Cast.toString(KEY));
    }

    iskeyhit({ KEY }) {
      KEY = Scratch.Cast.toString(KEY)
      let hit = this.keysHit.indexOf(KEY);
      if (hit !== -1) {
        let out = false
        out = ((Date.now() - this.keyHitTimes[hit]) < 100)
        this.keyHitTimes[hit] = 0;
        return out;
      } else {
        return false;
      }
    }

    getKeysDown() {
      return JSON.stringify(this.keysDown);
    }
  }

  // Register the extension with Scratch
  Scratch.extensions.register(new KeyHistoryExtension());
})(Scratch);
