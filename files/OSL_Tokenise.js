// Name: Tokeniser
// By: @mistium on discord
// Description: Tokenise stuff like osl
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  class OSLTokenise {

    constructor() {
      this.regex = /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g;
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
      return JSON.stringify(this.split);
    }
  }

  Scratch.extensions.register(new OSLTokenise());
})(Scratch);
