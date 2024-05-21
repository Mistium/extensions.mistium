(function(Scratch) {
  "use strict";

  class OSLTokenise {

    constructor() {
      this.regex = /"[^"\\]*(?:\\.[^"\\]*)*"|{[^}]+}|\[[^\]]+\]|\b\d[\d.]*\b|\S+/g;
    }

    getInfo() {
      return {
        id: 'OSLTokenise',
        name: 'OSL Tokenise',
        blocks: [{
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
          {
            opcode: 'getMethodInputs',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Method Inputs [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi("wow","test")'
              },
            },
          },
        ],
      };
    }

    splitmethods({
      CODE
    }) {
      return JSON.stringify(CODE.match(this.regex) || []);
    }

    getMethodInputs({
      CODE
    }) {
      const methodName = CODE.split('(')[0].trim();
      const argsString = CODE.match(/\(([^)]+)\)/)[1];
      const args = [];
      let currentArg = '';
      let inQuotes = false;

      for (let i = 0; i < argsString.length; i++) {
        const char = argsString.charAt(i);
        if (char === ',' && !inQuotes) {
          args.push(currentArg.trim());
          currentArg = '';
        } else {
          currentArg += char;
          if (char === '"') inQuotes = !inQuotes;
        }
      }
      if (currentArg.trim() !== '') {
        args.push(currentArg.trim());
      }

      let mapargs = args.map(arg => {
        arg = arg.trim();
        if (arg.startsWith('"') && arg.endsWith('"')) {
          return arg;
        } else if (!isNaN(arg)) {
          return Number(arg);
        } else if (arg.startsWith('[') && arg.endsWith(']')) {
          return JSON.parse(arg);
        } else {
          return arg;
        }
      });
      if (typeof mapargs == "object") {
        return JSON.stringify(mapargs)
      } else {
        return mapargs
      }
    }

    tokenise({
      CODE
    }) {
      let tokens = [];
      let inQuotes = false;
      let currentToken = '';

      for (let i = 0; i < CODE.length; i++) {
        const char = CODE[i];
        if (char === '"') {
          inQuotes = !inQuotes;
          currentToken += char;
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
