// Name: Input Manager
// By: @mistium on discord
// Description: Store a list of previously pressed keys. Made primarily for use in originOS (https://github.com/Mistium/Origin-OS).

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  const MAX_KEY_HISTORY = 100; // Adjust the maximum number of keys to keep in history

  // Define keybinds
  const keybinds = ["Ctrl", "Shift", "Alt"];

  class InputManager {
    constructor() {
      this.inputs = {};
      this.currentInput = "";
      this.currentInputChar = 0;
      this.multiline = true;
    }

    getInfo() {
      return {
        id: 'InputManager',
        name: 'Input Manager',
        blocks: [
          {
            opcode: 'allInputs',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get all inputs'
          },
          {
            opcode: 'getInputData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get data of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1"
              }
            }
          },
          {
            opcode: 'CurrentInputID',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Current Input ID'
          },
         {
            opcode: 'TotalLines',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Total Lines in Input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1"
              }
            }
          },
          {
            opcode: 'GetLinesOf',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Lines Of [ID] As Json',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1"
              }
            }
          },
          {
            opcode: 'deselectInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Deselect inputs',
          },
          {
            opcode: 'deleteAllInputs',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Delete All Inputs',
          },
          {
            opcode: 'deleteInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Delete Input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: 'switchToInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Switch To Input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
            },
          },
          {
            opcode: 'getCurrentCursorPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get current cursor position',
          },
          {
            opcode: 'getCurrentCursorLine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get current cursor line',
          },
          {
            opcode: 'setInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Input [ID] To [VAL]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "input1",
              },
              VAL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
         {
            opcode: 'enableMultiline',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Enable Multiline In Current Input'
          },
          {
            opcode: 'disableMultiline',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Disable Multiline In Current Input'
          },
          {
            opcode: 'setCursorPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Cursor Position To [Char]',
            arguments: {
              Char: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
          }
        ],
      };
    }

    deleteAllInputs() {
      this.inputs = {};
      this.deselectInput();
    }

    enableMultiline() {
      this.multiline = true;
    }
    
    disableMultiline() {
      this.multiline = false;
    }
    
    setInput({ID,VAL}) {
      this.inputs[ID] = Scratch.Cast.toString(VAL);
      if (ID === this.currentInput) {
        this.currentInputChar = Math.min(this.currentInputChar, this.inputs[ID].length);
      }
    }

    GetLinesOf({ID}) {
      if (this.inputs[ID]) {
        const inputLines = this.inputs[ID].split('\n');
        return JSON.stringify(inputLines);
      } else {
        return "[]";
      }
    }
    
    TotalLines({ID}) {
      if (this.inputs[ID]) {
        const inputLines = this.inputs[ID].split('\n');
        return inputLines.length;
      } else {
        return 0;
      }
    }
    
    deselectInput() {
      this.currentInput = "";
      this.currentInputChar = 0;
    }
    
    setCursorPosition({ Char }) {
      const length = (this.inputs[this.currentInput] ?? "").length;
      this.currentInputChar = Math.max(0, Math.min(Math.floor(Scratch.Cast.toNumber(Char)), length));
    }

    CurrentInputID() {
      return this.currentInput;
    }

    allInputs() {
      return JSON.stringify(this.inputs);
    }
    
    switchToInput({ ID }) {
      if (!this.inputs[ID]) {
        this.inputs[ID] = '';
      }
      this.currentInput = ID;
      this.currentInputChar = 0;
    }
    
    deleteInput({ ID }) {
      delete this.inputs[ID];
      if (this.currentInput === ID) {
        this.deselectInput();
      }
    }

    getInputData({ ID }) {
      if (this.inputs[ID]) {
        return JSON.stringify(this.inputs[ID]);
      } else {
        return ""; // Return empty string if input ID doesn't exist
      }
    }
    
    onKeyDown(event) {
      if (this.currentInput == "" || typeof this.inputs[this.currentInput] !== "string") {
        return;
      }
      const textEditingKeys = ['Backspace', 'Delete', 'Enter', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
      // Check if Command (Cmd) or Control (Ctrl) keys are pressed
      if (event.metaKey || event.ctrlKey) {
        return; // Skip adding keys when Cmd or Ctrl are pressed
      }

      // Check if the pressed key is part of a keybind
      if (this.isKeybind(event.key)) {
        return; // Skip adding keybind keys to history
      }

      // Handle text editing keys
      if (textEditingKeys.includes(event.key)) {
        // Perform actions based on the pressed text editing key
        switch (event.key) {
          case 'Backspace':
            // Remove character before the cursor in the current input
            if (this.currentInput && this.currentInputChar > 0) {
              const input = this.inputs[this.currentInput];
              this.inputs[this.currentInput] = input.slice(0, this.currentInputChar - 1) + input.slice(this.currentInputChar);
              this.currentInputChar--;
            }
            break;
          case 'Delete':
            // Remove character after the cursor in the current input
            if (this.currentInput && this.currentInputChar < this.inputs[this.currentInput].length) {
              const input = this.inputs[this.currentInput];
              this.inputs[this.currentInput] = input.slice(0, this.currentInputChar) + input.slice(this.currentInputChar + 1);
            }
            break;
          case 'Enter':
            if (this.currentInput && this.multiline) {
              this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + '\n' + this.inputs[this.currentInput].slice(this.currentInputChar);
              // Move cursor to the beginning of the next line
              this.currentInputChar++;
            }
            break;
          case 'Tab':
            if (this.currentInput) {
              this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + '\t' + this.inputs[this.currentInput].slice(this.currentInputChar);
              this.currentInputChar++;
            }
            break;
          case 'Escape':
            this.deselectInput();
            break;
          case 'ArrowLeft':
            if (this.currentInputChar > 0) {
              this.currentInputChar--;
            }
            break;
          case 'ArrowRight':
            if (this.currentInputChar < this.inputs[this.currentInput].length) {
              this.currentInputChar++;
            }
            break;
          case 'ArrowUp':
          case 'ArrowDown': {
            // Move cursor to the same column on the previous/next line, clamped to that line's length
            const text = this.inputs[this.currentInput];
            const lineStart = text.lastIndexOf('\n', this.currentInputChar - 1) + 1;
            const column = this.currentInputChar - lineStart;
            if (event.key === 'ArrowUp') {
              if (lineStart === 0) break;
              const prevStart = text.lastIndexOf('\n', lineStart - 2) + 1;
              this.currentInputChar = prevStart + Math.min(column, lineStart - 1 - prevStart);
            } else {
              const lineEnd = text.indexOf('\n', this.currentInputChar);
              if (lineEnd === -1) break;
              let nextEnd = text.indexOf('\n', lineEnd + 1);
              if (nextEnd === -1) nextEnd = text.length;
              this.currentInputChar = lineEnd + 1 + Math.min(column, nextEnd - lineEnd - 1);
            }
            break;
          }
          default:
            break;
        }
      } else {
        // Handle normal alphanumeric key presses
        if (event.key.length === 1) {
          // Append the pressed key to the current input at the cursor position
          this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + event.key + this.inputs[this.currentInput].slice(this.currentInputChar);
          this.currentInputChar++;
        }
      }
    }
    
    getCurrentCursorPosition() {
      return this.currentInputChar;
    }

    getCurrentCursorLine() {
      const text = this.inputs[this.currentInput] ?? "";
      return text.slice(0, this.currentInputChar).split('\n').length;
    }
    
    onPaste(event) {
      let pastedText = event.clipboardData ? event.clipboardData.getData('text/plain') : '';
      pastedText = pastedText.replace(/\r\n?/g, '\n');
      if (!this.multiline) pastedText = pastedText.replace(/\n/g, ' ');
      if (pastedText !== '') {
        if (this.currentInput && typeof this.inputs[this.currentInput] === "string") {
          // Append pasted text to the current input at the cursor position
          this.inputs[this.currentInput] = this.inputs[this.currentInput].slice(0, this.currentInputChar) + pastedText + this.inputs[this.currentInput].slice(this.currentInputChar);
          this.currentInputChar += pastedText.length;
        }
      }
    }

    isKeybind(key) {
      return keybinds.includes(key);
    }
  }
  // Create an instance of the InputManager class
  const extension = new InputManager();

  // Register the extension with Scratch
  Scratch.extensions.register(extension);

  // Listen for keydown events and call the onKeyDown method
  document.addEventListener('keydown', (event) => extension.onKeyDown(event));

  // Listen for paste events and call the onPaste method
  document.addEventListener('paste', (event) => extension.onPaste(event));
})(Scratch);
