// Name: Html Inputs
// Author: Mistium
// Description: Manage html inut elements on the stage

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {

  const Cast = Scratch.Cast;
  const runtime = Scratch.vm.runtime;
  class htmlInputs {

    getText(elem) {
      if (elem.tagName === "TEXTAREA" || (elem.tagName === "INPUT" && elem.type === "text")) {
        return elem.value.substring(elem.selectionStart, elem.selectionEnd);
      }
      return null;
    }

    constructor() {
      this.inputs = {};
      this.addFontLink();
    }

    addFontLink() {
      const link1 = document.createElement('link');
      link1.rel = 'preconnect';
      link1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.rel = 'preconnect';
      link2.href = 'https://fonts.gstatic.com';
      link2.crossOrigin = 'anonymous';
      document.head.appendChild(link2);

      const link3 = document.createElement('link');
      link3.rel = 'stylesheet';
      link3.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap';
      document.head.appendChild(link3);
    }

    getInfo() {
      return {
        id: "htmlInputs",
        name: "HTML Inputs",
        color1: "#f06529",
        blocks: [
          {
            opcode: 'createInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create input with id [ID] at x: [X] y: [Y]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: 'createMultilineInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create multiline input with id [ID] at x: [X] y: [Y]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Manage Inputs",
          },
          {
            opcode: 'getInputValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get value of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'setInputValue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set value of input [ID] to [VALUE]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, World!',
              },
            },
          },
          {
            opcode: 'getInputLines',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get array of lines of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'setListToInputLines',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set list [LIST] to input lines [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              LIST: {
                type: Scratch.ArgumentType.STRING,
                menu: 'list',
              },
            },
          },
          "---",
          {
            opcode: 'inputChanged',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'input [ID] changed?',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'resetInputChanged',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset input [ID] changed',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          "---",
          {
            opcode: 'inputFocused',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'input [ID] focused?',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'inputExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'input with id [ID] exists',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          "---",
          {
            opcode: 'moveInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'move input [ID] to x: [X] y: [Y]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: 'resizeInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'resize input [ID] to width: [WIDTH] height: [HEIGHT]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20,
              },
            },
          },
          "---",
          {
            opcode: 'setInputStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set style [STYLE] of input [ID] to [VALUE]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              STYLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'color',
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'red',
              },
            },
          },
          {
            opcode: 'setInputStyleStart',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set style [STYLE] of inputs with id starting with [ID] to [VALUE]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input',
              },
              STYLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'color',
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'red',
              },
            },
          },
          "---",
          {
            opcode: 'setInputSetting',
            blockType: Scratch.BlockType.COMMAND,
            text: '[SETTING] input [ID]',
            arguments: {
              SETTING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'settings',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'setInputSettingOnAllStart',
            blockType: Scratch.BlockType.COMMAND,
            text: '[SETTING] all inputs with id starting with [ID]',
            arguments: {
              SETTING: {
                type: Scratch.ArgumentType.STRING,
                menu: 'settings',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input',
              },
            },
          },
          "---",
          {
            opcode: 'removeAllInputs',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove all inputs',
          },
          {
            opcode: 'removeAllInputsIdStart',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove all inputs with id starting with [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input',
              },
            },
          },
          {
            opcode: 'listInputs',
            blockType: Scratch.BlockType.REPORTER,
            text: 'list all inputs',
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Selections",
          },
          {
            opcode: 'getSelectionData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get selection data of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'getSelectionPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get selection position of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'setSelectionRange',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set selection range of input [ID] from [START] to [END]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              START: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              END: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: 'getCursorLine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get selection [SELECTION] line of input [ID]',
            arguments: {
              SELECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'selection',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'getCursorColumn',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get selection [SELECTION] column of input [ID]',
            arguments: {
              SELECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'selection',
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Scrolling",
          },
          {
            opcode: 'getScrollPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get scroll position of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            opcode: 'maxScrollPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'max scroll position of input [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Advanced",
          },
          {
            opcode: 'getAttribute',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get attribute [ATTR] of input with id [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              ATTR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value',
              },
            },
          },
          {
            opcode: 'setAttribute',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set attribute [ATTR] of input with id [ID] to [VALUE]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'input1',
              },
              ATTR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value',
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, World!',
              },
            },
          },
        ],
        menus: {
          settings: {
            acceptReporters: true,
            items: [
              "Focus",
              "Delete",
              "Disable",
              "Enable",
              "Hide",
              "Show",
            ]
          },
          selection: {
            acceptReporters: true,
            items: [
              "Start",
              "End",
            ]
          },
          list: {
            acceptReporters: true,
            items: "getLists"
          }
        }
      }
    }

    getLists() {
      let global = vm.runtime.getTargetForStage().variables
      global ??= {}
      global = Object.values(global).filter(v => v.type === 'list')

      let local = vm.editingTarget.variables
      local ??= {}
      local = Object.values(local).filter(v => v.type === 'list')

      if (global.length === 0 && local.length === 0) {
        return ["Pick A List"]
      }

      return global.concat(local).map(v => ({
        text: v.name,
        value: v.id
      }))
    }

    createInput({ ID, X, Y }) {
      ID = Cast.toString(ID);
      X = Cast.toNumber(X);
      Y = Cast.toNumber(Y);
      if (this.inputs[ID]) {
        Scratch.renderer.removeOverlay(this.inputs[ID]);
        delete this.inputs[ID];
      }
      let input = document.createElement('input');
      input.id = ID;
      input.style.position = 'absolute';
      input.style.left = (X + (runtime.stageWidth / 2)) + 'px';
      input.style.top = ((Y * -1) + (runtime.stageHeight / 2)) + 'px';
      input.style.pointerEvents = 'auto';
      input.style.fontFamily = "'Share Tech Mono', monospace";
      input.style.transform = 'translate(-50%, -50%)';
      input.changed = false;
      input.addEventListener('input', () => {
        input.changed = true;
      });
      Scratch.renderer.addOverlay(input);
      this.inputs[ID] = input;
    }

    createMultilineInput({ ID, X, Y }) {
      ID = Cast.toString(ID);
      X = Cast.toNumber(X);
      Y = Cast.toNumber(Y);
      if (this.inputs[ID]) {
        Scratch.renderer.removeOverlay(this.inputs[ID]);
        delete this.inputs[ID];
      }
      let textarea = document.createElement('textarea');
      textarea.id = ID;
      textarea.style.position = 'absolute';
      textarea.style.left = (X + (runtime.stageWidth / 2)) + 'px';
      textarea.style.top = ((Y * -1) + (runtime.stageHeight / 2)) + 'px';
      textarea.style.pointerEvents = 'auto';
      textarea.style.fontFamily = "'Share Tech Mono', monospace";
      textarea.style.overflow = 'scroll';
      textarea.style.whiteSpace = 'nowrap';
      textarea.style.resize = 'none';
      textarea.style.transform = 'translate(-50%, -50%)';
      textarea.changed = false;
      textarea.addEventListener('input', () => {
        textarea.changed = true;
      });
      Scratch.renderer.addOverlay(textarea);
      this.inputs[ID] = textarea;
    }

    getInputValue({ ID }) {
      ID = Cast.toString(ID);
      return this.inputs[ID] ? this.inputs[ID].value : '';
    }

    inputFocused({ ID }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        return this.inputs[ID] === document.activeElement;
      }
      return false;
    }

    setInputValue({ ID, VALUE }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        VALUE = Cast.toString(VALUE);
        this.inputs[ID].value = VALUE;
      }
    }

    setInputStyle({ ID, STYLE, VALUE }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        STYLE = Cast.toString(STYLE);
        VALUE = Cast.toString(VALUE);
        this.inputs[ID].style[STYLE] = VALUE;
      }
    }

    setInputStyleStart({ ID, STYLE, VALUE }) {
      ID = Cast.toString(ID);
      STYLE = Cast.toString(STYLE);
      VALUE = Cast.toString(VALUE);
      for (let input in this.inputs) {
        if (input.startsWith(ID)) {
          this.inputs[input].style[STYLE] = VALUE;
        }
      }
    }

    inputExists({ ID }) {
      ID = Cast.toString(ID);
      return !!this.inputs[ID];
    }

    getInputLines({ ID }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        return JSON.stringify(this.inputs[ID].value.split('\n'));
      }
      return '[]';
    }

    setListToInputLines({ ID, LIST }, util) {
      ID = Cast.toString(ID);
      LIST = Cast.toString(LIST);
      if (this.inputs[ID]) {
        let list = util.target.lookupVariableById(LIST);
        if (list.type !== 'list' || !list) {
          list = util.target.lookupVariableByNameAndType(LIST, "list");
        }
        if (list) {
          list.value = this.inputs[ID].value.split('\n');
        }
      }
    }

    inputChanged({ ID }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        let changed = this.inputs[ID].changed;
        this.inputs[ID].changed = false;
        return changed;
      }
      return false;
    }

    resetInputChanged({ ID }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        this.inputs[ID].changed = false;
      }
    }

    moveInput({ ID, X, Y }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        X = Cast.toNumber(X) + (runtime.stageWidth / 2);
        Y = (Cast.toNumber(Y) * -1) + (runtime.stageHeight / 2);
        this.inputs[ID].style.left = X + 'px';
        this.inputs[ID].style.top = Y + 'px';
      }
    }

    resizeInput({ ID, WIDTH, HEIGHT }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        WIDTH = Cast.toNumber(WIDTH);
        HEIGHT = Cast.toNumber(HEIGHT);
        this.inputs[ID].style.width = WIDTH + 'px';
        this.inputs[ID].style.height = HEIGHT + 'px';
      }
    }

    removeAllInputsIdStart({ ID }) {
      ID = Cast.toString(ID);
      for (let input in this.inputs) {
        if (input.startsWith(ID)) {
          Scratch.renderer.removeOverlay(this.inputs[input]);
          delete this.inputs[input];
        }
      }
    }

    listInputs() {
      return JSON.stringify(Object.keys(this.inputs));
    }

    getSelectionData({ ID }) {
      ID = Cast.toString(ID);
      if (!this.inputs[ID]) return "";
      return this.getText(this.inputs[ID]);
    }

    getSelectionPosition({ ID }) {
      ID = Cast.toString(ID);
      let elem = this.inputs[ID];
      if (!elem) return "[0,0]";
      if (elem.tagName === "TEXTAREA" || (elem.tagName === "INPUT" && elem.type === "text")) {
        return JSON.stringify([elem.selectionStart + 1, elem.selectionEnd + 1]);
      }
      return "[0,0]";
    }

    setSelectionRange({ ID, START, END }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        START = Cast.toNumber(START);
        END = Cast.toNumber(END);
        this.inputs[ID].setSelectionRange(START, END);
      }
    }

    getCursorLine({ SELECTION, ID }) {
      ID = Cast.toString(ID);
      let elem = this.inputs[ID];
      if (!elem) return 0;
      if (elem.tagName === "TEXTAREA" || (elem.tagName === "INPUT" && elem.type === "text")) {
        let pos = Cast.toString(SELECTION) === "End" ? elem.selectionEnd : elem.selectionStart;
        let text = elem.value.substring(0, pos);
        let lines = text.split("\n");
        return lines.length;
      }
      return 0;
    }

    getCursorColumn({ SELECTION, ID }) {
      ID = Cast.toString(ID);
      let elem = this.inputs[ID];
      if (!elem) return 0;
      if (elem.tagName === "TEXTAREA" || (elem.tagName === "INPUT" && elem.type === "text")) {
        let pos = Cast.toString(SELECTION) === "End" ? elem.selectionEnd : elem.selectionStart;
        let text = elem.value.substring(0, pos);
        let lines = text.split("\n");
        return lines[lines.length - 1].length + 1;
      }
      return 0;
    }

    inputSetting(SETTING,ID) {
      switch (SETTING) {
        case "Focus":
          this.inputs[ID].focus();
          break;
        case "Delete":
          Scratch.renderer.removeOverlay(this.inputs[ID]);
          delete this.inputs[ID];
          break;
        case "Disable":
          this.inputs[ID].style.pointerEvents = 'none';
          break;
        case "Enable":
          this.inputs[ID].style.pointerEvents = 'auto';
          break;
        case "Hide":
          this.inputs[ID].style.opacity = '0';
          break;
        case "Show":
          this.inputs[ID].style.opacity = '1';
          break;
      }
    }

    setInputSetting({ SETTING, ID }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        SETTING = Cast.toString(SETTING);
        this.inputSetting(SETTING,ID);
      }
    }

    setInputSettingOnAllStart({ SETTING, ID }) {
      ID = Cast.toString(ID);
      SETTING = Cast.toString(SETTING);
      for (let input in this.inputs) {
        if (input.startsWith(ID)) {
          this.inputSetting(SETTING,input);
        }
      }
    }

    removeAllInputs() {
      for (let input in this.inputs) {
        Scratch.renderer.removeOverlay(this.inputs[input]);
        delete this.inputs[input];
      }
    }

    getScrollPosition({ ID }) {
      ID = Cast.toString(ID);
      return this.inputs[ID] ? JSON.stringify([this.inputs[ID].scrollLeft, this.inputs[ID].scrollTop]) : "[0,0]";
    }

    maxScrollPosition({ ID }) {
      ID = Cast.toString(ID);
      return this.inputs[ID] ? JSON.stringify([this.inputs[ID].scrollWidth, this.inputs[ID].scrollHeight]) : "[0,0]";
    }

    getAttribute({ ID, ATTR }) {
      ID = Cast.toString(ID);
      ATTR = Cast.toString(ATTR);
      return this.inputs[ID] ? this.inputs[ID][ATTR] : '';
    }

    setAttribute({ ID, ATTR, VALUE }) {
      ID = Cast.toString(ID);
      if (this.inputs[ID]) {
        ATTR = Cast.toString(ATTR);
        this.inputs[ID][ATTR] = VALUE;
      }
    }
  }

  Scratch.extensions.register(new htmlInputs());
})(Scratch);
