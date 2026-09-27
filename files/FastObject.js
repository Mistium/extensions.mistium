// Name: FastObject
// Author: Mistium
// Description: Store and retrieve object key/value data quickly.

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  class FastObject {

    constructor() {
      this.object = {};
    }

    getInfo() {
      return {
        id: 'FastObject',
        name: 'Fast Object',
        blocks: [
          {
            opcode: 'get',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Key [KEY]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hello"
              },
            },
          },
          {
            opcode: 'set',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Key [KEY] to [VALUE]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hello"
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "world"
              },
            },
          },
          {
            opcode: 'delete',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Delete Key [KEY]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hello"
              },
            },
          },
          {
            opcode: 'getObject',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Object',
          },
          {
            "opcode": "keyExists",
            "blockType": Scratch.BlockType.BOOLEAN,
            "text": "Key [KEY] Exists?",
            "arguments": {
              "KEY": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "hello"
              }
            }
          },
          {
            opcode: 'setObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Object [OBJECT]',
            arguments: {
              OBJECT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "{}"
              },
            },
          },
          {
            opcode: 'getKeys',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Keys',
          },
          {
            opcode: 'clear',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Clear Object',
          },
        ],
      };
    }

    get({KEY}) {
      if (!Object.prototype.hasOwnProperty.call(this.object, KEY)) return "";
      const value = this.object[KEY];
      return typeof value === "object" && value !== null ? JSON.stringify(value) : value;
    }

    set({KEY, VALUE}) {
      this.object[KEY] = VALUE;
    }

    delete({KEY}) {
      delete this.object[KEY];
    }

    getObject() {
      return JSON.stringify(this.object);
    }
    
    keyExists({KEY}) {
      return Object.prototype.hasOwnProperty.call(this.object, KEY);
    }

    setObject({OBJECT}) {
      try {
        const parsed = JSON.parse(OBJECT);
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          this.object = parsed;
        }
      } catch (e) {
        console.error("Invalid JSON object");
      }
    }

    getKeys() {
      return JSON.stringify(Object.keys(this.object));
    }

    clear() {
      this.object = {};
    }
  }

  Scratch.extensions.register(new FastObject());
})(Scratch);
