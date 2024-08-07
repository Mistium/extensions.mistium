// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
      throw new Error("EvalPlus must be unsandboxed");
  }


  class EvalPlus {
      constructor() {
          this.enabled = true; // Eval is enabled by default
      }

      getInfo() {
          return {
              id: 'MistiumEval',
              name: 'EvalPlus',
              color1: '#1c2827',
              blocks: [
                  // Unrestricted Eval Blocks
                  {
                      opcode: 'cmdBlock',
                      blockType: Scratch.BlockType.COMMAND,
                      text: 'evaluate [CODE]',
                      arguments: {
                          CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'alert(\'Hello :D\')' }
                      },
                      disabled: !this.enabled // Disable if eval is disabled
                  },
                  {
                      opcode: 'boolBlock',
                      blockType: Scratch.BlockType.BOOLEAN,
                      text: 'evaluate [CODE]',
                      arguments: {
                          CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                      },
                      disabled: !this.enabled
                  },
                  {
                      opcode: 'reporterBlock',
                      blockType: Scratch.BlockType.REPORTER,
                      text: 'evaluate [CODE]',
                      arguments: {
                          CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                      },
                      disabled: !this.enabled
                  },
                  {
                    opcode: 'capturedReporter',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'evaluate [CODE] and get console',
                    arguments: {
                        CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                    },
                  },
                  // Restricted Eval Blocks
                  {
                      opcode: 'restrictedCmdBlock',
                      blockType: Scratch.BlockType.COMMAND,
                      text: 'restricted evaluate [CODE]',
                      arguments: {
                          CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'alert(\'Hello :D\')' }
                      },
                      disabled: !this.enabled // Disable if eval is disabled
                  },
                  {
                      opcode: 'restrictedBoolBlock',
                      blockType: Scratch.BlockType.BOOLEAN,
                      text: 'restricted evaluate [CODE]',
                      arguments: {
                          CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                      },
                      disabled: !this.enabled
                  },
                  {
                      opcode: 'restrictedReporterBlock',
                      blockType: Scratch.BlockType.REPORTER,
                      text: 'restricted evaluate [CODE]',
                      arguments: {
                          CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                      },
                      disabled: !this.enabled
                  },
                  // Toggles
                  {
                      opcode: 'enableEval',
                      blockType: Scratch.BlockType.COMMAND,
                      text: 'enable eval',
                      func: 'enableEval'
                  },
                  {
                      opcode: 'disableEval',
                      blockType: Scratch.BlockType.COMMAND,
                      text: 'disable eval',
                      func: 'disableEval'
                  },
                  
              ]
          };
        }

      cmdBlock({ CODE }) {
          try {
              if (!this.enabled) return;
              eval(CODE);
          } catch (error) {
              console.error("Error:", error);
          }
      }

      boolBlock({ CODE }) {
          try {
              if (!this.enabled) return false;
              return eval(CODE);
          } catch (error) {
              console.error("Error:", error);
              return false;
          }
      }

      reporterBlock({ CODE }) {
          try {
              if (!this.enabled) return null;
              return eval(CODE);
          } catch (error) {
              console.error("Error:", error);
              return null;
          }
      }

      capturedReporter({ CODE }) {
        try {
            if (!this.enabled) return null;
            this.consoleOutput = [];
            const originalConsoleLog = console.log;
            const self = this;

            console.log = function (...args) {
                self.consoleOutput.push(args.join(' '));
            };
            eval(CODE)
            console.log = originalConsoleLog
            return this.consoleOutput.join('\n');
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
      }

      restrictedCmdBlock({ CODE }) {
          try {
              if (!this.enabled) return;
              // Add more restrictions if needed
              if (!/^[a-zA-Z0-9\s()\[\]{};.,\-+=*\/%]*$/.test(CODE)) {
                  throw new Error("Invalid characters detected.");
              }
              eval(CODE);
          } catch (error) {
              console.error("Error:", error);
          }
      }

      restrictedBoolBlock({ CODE }) {
          try {
              if (!this.enabled) return false;
              if (!/^[a-zA-Z0-9\s()\[\]{};.,\-+=*\/%]*$/.test(CODE)) {
                  throw new Error("Invalid characters detected.");
              }
              return eval(CODE);
          } catch (error) {
              console.error("Error:", error);
              return false;
          }
      }

      restrictedReporterBlock({ CODE }) {
          try {
              if (!this.enabled) return null;
              if (!/^[a-zA-Z0-9\s()\[\]{};.,\-+=*\/%]*$/.test(CODE)) {
                  throw new Error("Invalid characters detected.");
              }
              return eval(CODE);
          } catch (error) {
              console.error("Error:", error);
              return null;
          }
      }

      enableEval() {
          this.enabled = true;
      }

      disableEval() {
          this.enabled = false;
      }
  }

  Scratch.extensions.register(new EvalPlus());
})(Scratch);
