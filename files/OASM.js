// Name: Tokeniser
// By: @mistium on discord
// Description: Tokenise stuff like osl

(function (Scratch) {
  "use strict";

  class OASM {

    getInfo() {
      return {
        id: 'OASM',
        name: 'OASM',
        blocks: [
          {
            opcode: 'compile',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Compile [CODE]',
            arguments: {
                CODE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[\"setv msg hello\",\"prnt msg\"]"
                },
            },
          },
        ],
      };
    }


    compile({CODE}) {
      const all_oasm_commands = ["totv","setv","chav","jump","equl","gthn","lthn","prnt","ngth","nlth","svto","mulv","divv","subv","pend","penu","penc","pens","pene","setx","sety","setp","labl","getd","sinv","cosv","tanv","modv","sqrt","copy","letr","leng"]
      const all_oasm_jumps = ["jump","equl","gthn","lthn","ngth","nlth"]
      CODE = JSON.parse(CODE)
      this.vars = []
      this.commands = []
      this.item = ""
      for (this.i in CODE) {
        this.item = CODE[this.i]
        this.cur = this.item.split(" ")
        this.cur = this.cur.concat(Array(4 - this.cur.length).fill("0"))
        if (this.cur[0] === "labl") {
          this.mapcur = []
          CODE = CODE.map((x) => {
            this.mapcur = x.split(" ")
            if (all_oasm_jumps.indexOf(this.mapcur[0]) !== -1) {
              if (this.mapcur[3] === this.cur[1]) {
                this.mapcur[3] = this.i.toString()
              } else if (this.mapcur[1] === this.cur[1]) {
                this.mapcur[1] = this.i.toString()
              }
              return this.mapcur.join(" ")
            }
            return x
          })
        } else if (this.cur[0] === "setv") {
          if (!Number.isInteger(Number(this.cur[1])) && this.vars.indexOf(this.cur[1]) === -1) {
            this.vars.push(this.cur[1])
            this.len = this.vars.length
            this.mapcur = []
            CODE = CODE.map((x) => {
              this.mapcur = x.split(" ")
              if (this.mapcur[1] === this.cur[1]) {
                this.mapcur[1] = this.len
              } else if (this.mapcur[2] === this.cur[1]) {
                  this.mapcur[2] = this.len.toString()
              } else if (this.mapcur[3] === this.cur[1]) {
                  this.mapcur[3] = this.len.toString()
              }
              return this.mapcur.join(" ")
            })
            this.cur[1] = this.len.toString()
          }
        }
        this.cur[0] = (all_oasm_commands.indexOf(this.cur[0]) + 1).toString()
        this.commands = this.commands.concat(this.cur)
      }
      if (this.vars.length > 0) {
        this.item = ["1","0","",""]
        this.item[1] = this.vars.length.toString()
        this.commands = this.item.concat(this.commands)
      }
      return JSON.stringify(this.commands);
    }
  }

  Scratch.extensions.register(new OASM());
})(Scratch);
