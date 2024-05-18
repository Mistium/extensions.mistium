// Name: OASM SYS
// By: @mistium on discord
// Description: Run the full oasm interpreter except very fast.
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

// OASM v9

(function(Scratch) {
  "use strict";

  function makeidOTAS(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  function createLiteralOTAS(vars, spl, id, prep) {
    let index = vars.indexOf(spl[id]) === -1;
    if (index) {
      let newid = makeidOTAS(7);
      prep.unshift("setv " + newid + " " + spl[id])
      return newid;
    } else {
      return spl[id];
    }
  }

  class OASM {
    constructor() {
      const vm = Scratch.vm,
      runtime = vm.runtime;
      if (!Scratch.vm.extensionManager.isExtensionLoaded("pen")) {
        runtime.extensionManager.loadExtensionIdSync("pen");
      }
      this.prep = [];
      this.errors = []
    }
    
    getInfo() {
      return {
        id: 'OASM',
        name: 'OASM',
        color1: '#101010',
        blocks: [{
            func: 'docs',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Learn OASM(v9)',
          },
          {
            opcode: 'compile',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Compile OASM [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["setv msg hello","prnt msg"]'
              },
            },
          },
          {
            opcode: 'transpileOTAS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Transpile OTAS To OASM [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["msg = hello","print msg"]'
              },
            },
          },
          {
            opcode: 'runblock',
            func: 'run',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Run  At [X],[Y] Code: [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
            },
          },
          {
            opcode: 'run',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Run  At [X],[Y] Code: [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
            },
          },
          {
            opcode: 'lastvars',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Variable data',
          },
          {
            opcode: 'lastoutput',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Console Data',
          },
          {
            opcode: 'allcmds',
            blockType: Scratch.BlockType.REPORTER,
            text: 'All Commands',
          },
        ],
      };
    }

    docs() {
      window.open("https://github.com/Mistium/Origin-OS/wiki/OASM-%E2%80%90-Origin-Assembly", '_blank').focus();
    }

    run({
      CODE,
      X,
      Y
    }) {
      CODE = JSON.parse(CODE)
      const target = vm.editingTarget
      target.setXY(X, Y);
      this.vars = []
      this.pc = 1
      this.output = []
      const comp = CODE.length / 4 + 1
      while (this.pc < comp) {
        const temp = (this.pc * 4) - 1
        const cmd = CODE[temp - 3]
        this.in1 = CODE[temp - 2] - 1
        this.in2 = CODE[temp - 1]
        this.in3 = CODE[temp]
        switch (cmd) {
          case "1":
            this.vars[this.in1] = ""
            break;
          case "2":
            if (isNaN(this.in2)) {
              this.vars[this.in1] = this.in2
            } else {
              this.vars[this.in1] = parseInt(this.in2)
            }
            break;
          case "3":
            this.vars[this.in1] += this.vars[this.in2 - 1]
            break;
          case "4":
            this.pc = +this.in1
            break;
          case "5":
            if (this.vars[this.in1] === this.vars[this.in2 - 1]) {
              this.pc = +this.in3
            }
            break;
          case "6":
            if (this.vars[this.in1] > this.vars[this.in2 - 1]) {
              this.pc = +this.in3
            }
            break;
          case "7":
            if (this.vars[this.in1] < this.vars[this.in2 - 1]) {
              this.pc = +this.in3
            }
            break;
          case "8":
            this.output.push(this.vars[this.in1])
            break;
          case "9":
            if (this.vars[this.in1] <= this.vars[this.in2 - 1]) {
              this.pc = +this.in3
            }
            break;
          case "10":
            if (this.vars[this.in1] >= this.vars[this.in2 - 1]) {
              this.pc = +this.in3
            }
            break;
          case "11":
            this.vars[this.in1] = +this.vars[this.in2 - 1]
            break;
          case "12":
            this.vars[this.in1] *= this.vars[this.in2 - 1]
            break;
          case "13":
            this.vars[this.in1] /= this.vars[this.in2 - 1]
            break;
          case "14":
            this.vars[this.in1] -= this.vars[this.in2 - 1]
            break;
          case "15":
            runtime.ext_pen._penDown(target);
            break;
          case "16":
            runtime.ext_pen._penUp(target);
            break;
          case "17":
            runtime.ext_pen._setPenColorToColor(this.vars[this.in1], target);
            break;
          case "18":
            runtime.ext_pen._setPenSizeTo(this.vars[this.in1], target);
            break;
          case "19":
            runtime.ext_pen.clear();
            break;
          case "20":
            target.setXY(X + this.vars[this.in1], target.y);
            break;
          case "21":
            target.setXY(target.x, Y + this.vars[this.in1]);
            break;
          case "22":
            target.setXY(X + this.vars[this.in1], Y + this.vars[this.in2 - 1]);
            break;
          case "23":
            break;
          case "24":
            this.vars[this.in2 - 1] = 0
            this.in1 = CODE[temp - 2]
            if (this.in1 === "mousepos") {
              this.vars[this.in2 - 1] = runtime.ioDevices.mouse.getScratchX() - X
              this.vars[this.in3 - 1] = runtime.ioDevices.mouse.getScratchY() - Y
            } else if (this.in1 === "timestamp") {
              this.vars[this.in2 - 1] = Date.now()
            } else if (this.in1 === "mouseclick") {
              this.vars[this.in2 - 1] = ((+runtime.ioDevices.mouse.getIsDown() || 0) - 0)
            } else if (this.in1 === "timer") {
              this.vars[this.in2 - 1] = runtime.ioDevices.clock.projectTimer()
            } else if (this.in2 === "line") {
              this.vars[this.in2 - 1] = this.pc
            } else if (this.in1.startsWith("key")) {
              this.vars[this.in2 - 1] = (+runtime.ioDevices.keyboard.getKeyIsDown(this.in1))
            }
            break;
          case "25":
            this.vars[this.in1] = Math.sin(this.vars[this.in1]);
            break;
          case "26":
            this.vars[this.in1] = Math.cos(this.vars[this.in1]);
            break;
          case "27":
            this.vars[this.in1] = Math.tan(this.vars[this.in1]);
            break;
          case "28":
            this.vars[this.in1] %= this.vars[this.in2 - 1];
            break;
          case "29":
            this.vars[this.in1] = Math.sqrt(this.vars[this.in1]);
            break;
          case "30":
            this.vars[this.in1] = this.vars[this.vars[this.in2 - 1] - 1];
            break;
          case "31":
            this.vars[this.in3 - 1] = this.vars[this.in1][this.vars[this.in2 - 1] - 1];
            break;
          case "32":
            this.vars[this.in2 - 1] = this.vars[this.in1].length;
            break;
          case "33":
            this.vars[this.in3 - 1] = this.vars[this.in1] + this.vars[this.in2 - 1]
            break;
          default:
            console.log("Unknown Command: " + cmd);
        }
        this.pc += 1;
      }
      return this.output.length > 0 ? JSON.stringify(this.output) : '[]';
    }


    lastvars() {
      return JSON.stringify(this.vars)
    }

    lastoutput() {
      return JSON.stringify(this.output)
    }

    allcmds() {
      return JSON.stringify(["totv", "setv", "chav", "jump", "equl", "gthn", "lthn", "prnt", "ngth", "nlth", "svto", "mulv", "divv", "subv", "pend", "penu", "penc", "pens", "pene", "setx", "sety", "setp", "labl", "getd", "sinv", "cosv", "tanv", "modv", "sqrt", "copy", "letr", "leng"])
    }

    compile({
      CODE
    }) {
      const all_oasm_commands = ["totv", "setv", "chav", "jump", "equl", "gthn", "lthn", "prnt", "ngth", "nlth", "svto", "mulv", "divv", "subv", "pend", "penu", "penc", "pens", "pene", "setx", "sety", "setp", "labl", "getd", "sinv", "cosv", "tanv", "modv", "sqrt", "copy", "letr", "leng"]
      const all_oasm_jumps = ["jump", "equl", "gthn", "lthn", "ngth", "nlth"]
      CODE = JSON.parse(CODE)
      this.vars = []
      this.commands = []
      this.item = ""
      for (let i = 0; i < CODE.length; i++) {
        this.cur = CODE[i].split(" ")
        this.cur = this.cur.concat(Array(4 - this.cur.length).fill("0"))
        if (this.cur[0] === "labl") {
          this.mapcur = []
          CODE = CODE.map((line) => {
            this.mapline = line.split(" ")
            if (all_oasm_jumps.indexOf(this.mapline[0]) !== -1) {
              if (this.mapline[3] === this.cur[1]) {
                this.mapline[3] = (i+1).toString()
              } else if (this.mapline[1] === this.cur[1]) {
                this.mapline[1] = (i+1).toString()
              }
              return this.mapline.join(" ")
            }
            return line
          })
        } else if (this.cur[0] === "setv") {
          if (!Number.isInteger(Number(this.cur[1])) && this.vars.indexOf(this.cur[1]) === -1) {
            this.vars.push(this.cur[1])
            this.len = this.vars.length
            this.mapcur = []
            CODE = CODE.map((line) => {
              this.mapcur = line.split(" ")
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
        this.item = ["1", this.vars.length.toString(), "", ""] // totv
        this.commands = this.item.concat(this.commands)
      }
      return JSON.stringify(this.commands);
    }

    transpileOTAS({
      CODE
    }) {
      this.CODE = JSON.parse(CODE)
      let prep = [];
      let OUT = [];
      let vars = [];
      let errors = []
      for (let i = 0; i < this.CODE.length; i++) {
        this.spl = this.CODE[i].split(' ');
        switch (this.spl[0]) {
          case 'print':
            this.spl[1] = createLiteralOTAS(vars, this.spl, 1, prep);
            this.spl[0] = 'prnt';
            break;
          case 'pen.clearall':
            this.spl[0] = 'pene';
            break;
          case 'pen.down':
            this.spl[0] = 'pend';
            break;
          case 'pen.colour':
            this.spl[1] = createLiteralOTAS(vars, this.spl, 1, prep);
            this.spl[0] = 'penc';
            break;
          case 'pen.size':
            this.spl[1] = createLiteralOTAS(vars, this.spl, 1, prep);
            this.spl[0] = 'pens';
            break;
          case 'pen.up':
            this.spl[0] = 'penu';
            break;
          case 'pen.goto':
            this.spl[1] = createLiteralOTAS(vars, this.spl, 1, prep);
            this.spl[2] = createLiteralOTAS(vars, this.spl, 2, prep);
            this.spl[0] = 'setp';
            break;
          case 'pen.setx':
            this.spl[1] = createLiteralOTAS(vars, this.spl, 1, prep);
            this.spl[0] = 'setx';
            break;
          case 'pen.sety':
            this.spl[1] = createLiteralOTAS(vars, this.spl, 1, prep);
            this.spl[0] = 'sety';
            break;
          case 'math.sin':
            this.spl[0] = 'sinv';
            break;
          case 'math.cos':
            this.spl[0] = 'cosv';
            break;
          case 'math.tan':
            this.spl[0] = 'tanv';
            break;
          case 'math.root':
            this.spl[0] = 'sqrt';
            break;
          case 'jump':
            this.spl[0] = 'jump';
            break;
          case 'mouse.pos':
            this.spl[0] = 'getd';
            this.spl[3] = this.spl[2]
            this.spl[2] = this.spl[1]
            this.spl[1] = "mousepos"
            break;
          case 'now.timestamp':
            this.spl[0] = 'getd';
            this.spl[2] = this.spl[1]
            this.spl[1] = "timestamp"
            break;
          case 'now.timer':
            this.spl[0] = 'getd';
            this.spl[2] = this.spl[1]
            this.spl[1] = "timer"
            break;
          case 'data.line':
            this.spl[0] = 'getd';
            this.spl[2] = this.spl[1]
            this.spl[1] = "line"
            break;
          case 'mouse.click':
            this.spl[0] = 'getd';
            this.spl[2] = this.spl[1]
            this.spl[1] = "mouseclick"
            break;
          case 'input.keypress':
            this.spl[0] = 'getd';
            this.spl[2] = this.spl[1]
            this.spl[1] = "key" + this.spl[1]
            break;
          case '-':
            this.spl[0] = ''
            break;
          case '':
            this.spl[0] = ''
            break;
          case 'if':
            switch (this.spl[2]) {
              case '=':
                this.spl[0] = 'equl';
                break;
              case '>':
                this.spl[0] = 'gthn';
                break;
              case '<':
                this.spl[0] = 'lthn';
                break;
              case '!>':
                this.spl[0] = 'ngth';
                break;
              case '!<':
                this.spl[0] = 'nlth';
                break;
              default:
                errors.push("Unknown Comparison On Line: " + (i+1))
                break;
            }
            this.temp = [];
            this.temp.push(this.spl[0]);
            this.temp.push(this.spl[1]);
            this.temp.push(this.spl[3]);
            this.temp.push(this.spl[4]);
            this.spl = this.temp;
            break;
          default:
            switch (this.spl[1]) {
              case '=':
                this.spl[1] = this.spl[0];
                if (vars.indexOf(this.spl[1]) === -1) {
                  this.spl[0] = 'setv';
                  vars.push(this.spl[1]);
                } else {
                  this.spl[2] = createLiteralOTAS(vars, this.spl, 2, prep);
                  this.spl[0] = 'svto';
                }
                break;
              case '+=':
                this.spl[2] = createLiteralOTAS(vars, this.spl, 2, prep);
                this.spl[1] = this.spl[0];
                this.spl[0] = 'chav';
                break;
              case '-=':
                this.spl[2] = createLiteralOTAS(vars, this.spl, 2, prep);
                this.spl[1] = this.spl[0];
                this.spl[0] = 'subv';
                break;
              case '/=':
                this.spl[2] = createLiteralOTAS(vars, this.spl, 2, prep);
                this.spl[1] = this.spl[0];
                this.spl[0] = 'divv';
                break;
              case '*=':
                this.spl[2] = createLiteralOTAS(vars, this.spl, 2, prep);
                this.spl[1] = this.spl[0];
                this.spl[0] = 'mulv';
                break;
              case '%=':
                this.spl[2] = createLiteralOTAS(vars, this.spl, 2, prep);
                this.spl[1] = this.spl[0];
                this.spl[0] = 'modv';
                break;
              default:
                if (this.spl[0][0] === ':') {
                  this.spl[1] = this.spl[0];
                  this.spl[0] = 'labl';
                } else {
                  errors.push("Unknown Command On Line: " + (i+1))
                }
                break;
            }
            break;
        }
        if (this.spl[0] !== '') {
          OUT.push(this.spl.join(' '));
        }
      }
      OUT = prep.concat(OUT)
      if (errors.length > 0) {
        return "Errors:\n " + errors.join("\n")
      } else {
        return JSON.stringify(OUT);
      }
    }
  }

  Scratch.extensions.register(new OASM());
})(Scratch);
