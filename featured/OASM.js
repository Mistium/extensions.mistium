// Name: OASM SYS
// By: @mistium on discord
// Description: Run the full oasm interpreter except very fast.

(function (Scratch) {
  "use strict";

  const vm = Scratch.vm,
  runtime = vm.runtime;
  
  if (!Scratch.vm.extensionManager.isExtensionLoaded("pen")) {
    runtime.extensionManager.loadExtensionIdSync("pen");
  }
  
  class OASM {
    getInfo() {
      return {
        id: 'OASM',
        name: 'OASM',
        blocks: [
          {
            func: 'docs',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Learn OASM',
          },
          {
            opcode: 'compile',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Compile [CODE]',
            arguments: {
                CODE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: '["setv msg hello","prnt msg"]'
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
        ],
      };
    }

    docs() {
      window.open("https://github.com/Mistium/Origin-OS/wiki/OASM-%E2%80%90-Origin-Assembly", '_blank').focus();
    }

    run({CODE,X,Y}) {
      CODE = JSON.parse(CODE)
      const target = vm.editingTarget
      target.setXY(X,Y);
      this.vars = []
      this.pc = 1
      this.output = []
      this.comp = CODE.length / 4 + 1
      while (this.pc < this.comp) {
        this.temp = this.pc * 4 - 1
        this.cmd = CODE[this.temp - 3]
        this.in1 = CODE[this.temp - 2]-1
        this.in2 = CODE[this.temp - 1]
        this.in3 = CODE[this.temp]
        switch (this.cmd) {
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
              this.vars[this.in1] += this.vars[this.in2-1]
            break;
            case "4":
              this.pc = +this.in1+1
            break;
            case "5":
              if (this.vars[this.in1] === this.vars[this.in2-1]) {
                this.pc = +this.in3
              }
            break;
            case "6":
              if (this.vars[this.in1] > this.vars[this.in2-1]) {
                this.pc = +this.in3
              }
            break;
            case "7":
              if (this.vars[this.in1] < this.vars[this.in2-1]) {
                this.pc = +this.in3
              }
            break;
            case "8":
              this.output.push(this.vars[this.in1])
            break;
            case "9":
              if (this.vars[this.in1] <= this.vars[this.in2-1]) {
                this.pc = +this.in3
              }
            break;
            case "10":
              if (this.vars[this.in1] >= this.vars[this.in2-1]) {
                this.pc = +this.in3
              }
            break;
            case "11":
              this.vars[this.in1] = +this.vars[this.in2-1]
            break;
            case "12":
              this.vars[this.in1] *= this.vars[this.in2-1]
            break;
            case "13":
              this.vars[this.in1] /= this.vars[this.in2-1]
            break;
            case "14":
              this.vars[this.in1] -= this.vars[this.in2-1]
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
              target.setXY(X + this.vars[this.in1],target.y);
            break;
            case "21":
              target.setXY(target.x,Y + this.vars[this.in1]);
            break;
            case "22":
              target.setXY(X + this.vars[this.in1],Y + this.vars[this.in2-1]);
            break;
            case "23":
            break;
            case "24":
              this.vars[this.in2-1] = 0
              this.in1 = CODE[this.temp - 2]
              if (this.in1 === "mousepos") {
                this.vars[this.in2-1] = runtime.ioDevices.mouse.getScratchX() - X
                this.vars[this.in3-1] = runtime.ioDevices.mouse.getScratchY() - Y
              } else if (this.in1 === "timestamp") {
                this.vars[this.in2-1] = Date.now()
              } else if (this.in1 === "mouseclick") {
                this.vars[this.in2-1] = ((+runtime.ioDevices.mouse.getIsDown() || 0) - 0)
              } else if (this.in1 === "timer") {
                this.vars[this.in2-1] = runtime.ioDevices.clock.projectTimer()
              } else if (this.in2 === "line") {
                this.vars[this.in2-1] = this.pc
              } else if (this.in1 === ("key" + runtime.ioDevices.keyboard.getLastKeyPressed())) {
                this.vars[this.in2-1] = ((+runtime.ioDevices.keyboard.getKeyIsDown(runtime.ioDevices.keyboard.getLastKeyPressed())))
              }
            break;
            case "25":
              this.vars[this.in1] = Math.sin(this.vars[this.in1])
            break;
            case "26":
              this.vars[this.in1] = Math.cos(this.vars[this.in1])
            break;
            case "27":
              this.vars[this.in1] = Math.tan(this.vars[this.in1])
            break;
            case "28":
              this.vars[this.in1] %= this.vars[this.in2-1]
            break;
            case "29":
              this.vars[this.in1] = Math.sqrt(this.vars[this.in1])
            break;
            case "30":
              this.vars[this.in1] = this.vars[this.vars[this.in2-1]-1]
            break;
            case "31":
              this.vars[this.in3-1] = this.vars[this.in1][this.vars[this.in2-1]-1]
            break;
            case "32":
              this.vars[this.in2-1] = this.vars[this.in1].length
            break;
            case "33":
              this.vars[this.in3-1] = this.vars[this.in1] + this.vars[this.in2-1]
            break;
            default:
              console.log("Unknown Command: " + this.cmd)
          }
          this.pc ++
        }
        return JSON.stringify(this.output)
      }

    
    lastvars() {
      return JSON.stringify(this.vars)
    }

    lastoutput() {
      return JSON.stringify(this.output)
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
