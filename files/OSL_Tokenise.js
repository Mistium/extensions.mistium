// Name: Camera
// By: @mistium on discord
// Description: Use the camera :P

(function (Scratch) {
  "use strict";

  class OSLTokenise {

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
        ],
      };
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
