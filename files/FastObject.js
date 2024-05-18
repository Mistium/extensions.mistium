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
        ],
      };
    }

    get({KEY}) {
      return this.object[KEY] !== undefined ? this.object[KEY] : "";
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
      return this.object.hasOwnProperty(KEY);
    }

    setObject({OBJECT}) {
      try {
        this.object = JSON.parse(OBJECT);
      } catch (e) {
        console.error("Invalid JSON object");
      }
    }
  }

  Scratch.extensions.register(new FastObject());
})(Scratch);
