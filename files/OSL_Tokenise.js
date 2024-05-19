(function (Scratch) {
  "use strict";

  class OSLTokenise {

    constructor() {
      this.regex = /"[^"\\]*(?:\\.[^"\\]*)*"|{[^}]+}|\[[^\]]+\]|\b\d[\d.]*\b|\S+/g;
    }
    
    getInfo() {
      return {
        id: 'OSLTokenise',
        name: 'OSL Tokenise',
        blocks: [
          {
            opcode: 'tokenise',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Tokenise OSL [CODE]',
            arguments: {
                CODE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "log \"hello\""
                },
            },
          },
          {
            opcode: 'splitmethods',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Tokenise Methods [CODE]',
            arguments: {
                CODE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "\"hello\".index(\"l\").bool"
                },
            },
          },
        ],
      };
    }

    splitmethods({CODE}) {
      return JSON.stringify(CODE.match(this.regex) || []);
    }

    tokenise({CODE}) {
      let tokens = [];
      let inQuotes = false;
      let currentToken = '';

      for (let i = 0; i < CODE.length; i++) {
        const char = CODE[i];
        if (char === '"') {
          inQuotes = !inQuotes;
          currentToken += char;
        } else if (inQuotes && char === '\\') {
          currentToken += char + CODE[++i];
        } else if (!inQuotes && char === ' ') {
          if (currentToken.trim() !== '') {
            tokens.push(currentToken);
            currentToken = '';
          }
        } else {
          currentToken += char;
        }
      }

      if (currentToken.trim() !== '') {
        tokens.push(currentToken);
      }

      return JSON.stringify(tokens);
    }
  }

  Scratch.extensions.register(new OSLTokenise());
})(Scratch);
