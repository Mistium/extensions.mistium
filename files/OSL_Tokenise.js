(function (Scratch) {
  "use strict";
  
  const vm = Scratch.vm;
  
  class OSLTokenise {

    constructor() {
      this.regex = /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g;
      this.listVariable = '';
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
        {
          opcode: 'setlist',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Set List to OSL Tokenise [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'log "hello"'
            },
          },
        },
        {
          opcode: 'selectlist',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Select List [Name]',
          arguments: {
            Name: { 
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'List Name'
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

    tokenise({ CODE }) {
      try {
        this.letter = 0;
        this.temp = "";
        this.brackets = 0;
        this.out = "";
        this.split = [];
        this.len = (""+CODE).length;
        while (this.letter < this.len) {
          this.temp = CODE[this.letter];
          if (this.temp === "\"") {
            this.brackets = 1 - this.brackets;
            this.out += "\"";
          } else {
            this.out += this.temp;
          }
          this.letter++;
          if (1 > this.brackets && CODE[this.letter] === " ") {
            this.split.push(this.out);
            this.out = "";
            this.letter++;
          }
        }
        this.split.push(this.out);
        return JSON.stringify(this.split);
      } catch(e) {
        // skip
      }
    }


    setlist({ CODE }, util) {
      try {
        this.letter = 0;
        this.temp = "";
        this.brackets = 0;
        this.out = "";
        this.split = [];
        this.len = CODE.length;
        while (this.letter < this.len) {
          this.temp = CODE[this.letter];
          if (this.temp === "\"") {
            this.brackets = 1 - this.brackets;
            this.out += "\"";
          } else {
            this.out += this.temp;
          }
          this.letter++;
          if (1 > this.brackets && CODE[this.letter] === " ") {
            this.split.push(this.out);
            this.out = "";
            this.letter++;
          }
        }
        this.split.push(this.out);
        this.listVariable.value = this.split;
      } catch (e) {
        // skip
      }
    }

    selectlist({ Name }, util) {
      this.listVariable = util.target.lookupVariableByNameAndType(Name, "list");
    }
  }

  Scratch.extensions.register(new OSLTokenise());
})(Scratch);
