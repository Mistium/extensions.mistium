(function (Scratch) {
    'use strict';
    // This extension uses mistium's compiled block builder
    // Please don't remove this, be kind :P

    if (!Scratch.extensions.unsandboxed) {
      throw new Error("tables needs to be run unsandboxed.");
    }

    const vm = Scratch.vm,
          runtime = vm.runtime;

    class tables {
      getInfo() {
        return {
          id: 'tables',
          name: 'tables',
          blocks: [{"opcode":"newTable","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"new table","code":"([[]])","func":"err"},{"opcode":"addRow","blockType": Scratch.BlockType.COMMAND,"text":"add row to [A]","code":"(${fgouMfsWgqLf}.push(new Array(${fgouMfsWgqLf}[0].length).fill(\"\")))","arguments":{"A":{"type":"string","gen_id":"fgouMfsWgqLf","defaultValue":"table"}},"func":"err"},{"opcode":"addColumn","blockType": Scratch.BlockType.COMMAND,"text":"add column to [A]","code":"${EteGjdfPKpSh}.map(column => (column.push(\"\"), column))","arguments":{"A":{"type":"string","gen_id":"EteGjdfPKpSh","defaultValue":"table"}},"func":"err"},{"opcode":"setCell","blockType": Scratch.BlockType.COMMAND,"text":"set cell [X],[Y] in [A] to [B]","code":"(${HpCOfjhjpRFa}[${eCgMDixvXjRs}][${BCGxZEcbLkUO}] = ${OeaSJUlDHJfr})","arguments":{"A":{"type":"string","gen_id":"HpCOfjhjpRFa","defaultValue":"table"},"X":{"type":"string","gen_id":"eCgMDixvXjRs","defaultValue":"0"},"Y":{"type":"string","gen_id":"BCGxZEcbLkUO","defaultValue":"0"},"B":{"type":"string","gen_id":"OeaSJUlDHJfr","defaultValue":"value"}},"func":"err"},{"opcode":"getCell","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"cell [X],[Y] in [A]","code":"(${ySOpLGjADhjx}[${aAXXabcrGxpx}][${yXfAwidEzlRY}])","arguments":{"A":{"type":"string","gen_id":"ySOpLGjADhjx","defaultValue":"table"},"X":{"type":"string","gen_id":"aAXXabcrGxpx","defaultValue":"0"},"Y":{"type":"string","gen_id":"yXfAwidEzlRY","defaultValue":"0"}},"func":"err"},{"opcode":"deleteRow","blockType": Scratch.BlockType.COMMAND,"text":"delete row [X] in [A]","code":"(${IjOpMwnBrmSs}.splice(${CnBRSGSIpNQd}, 1))","arguments":{"A":{"type":"string","gen_id":"IjOpMwnBrmSs","defaultValue":"table"},"X":{"type":"string","gen_id":"CnBRSGSIpNQd","defaultValue":"0"}},"func":"err"},{"opcode":"deleteColumn","blockType": Scratch.BlockType.COMMAND,"text":"delete column [X] in [A]","code":"(${UIsUejspkoSu}.map(column => (column.splice(${rjGjXtxZdjOu}, 1), column)))","arguments":{"A":{"type":"string","gen_id":"UIsUejspkoSu","defaultValue":"table"},"X":{"type":"string","gen_id":"rjGjXtxZdjOu","defaultValue":"0"}},"func":"err"}],
        };
      }
      err(args, util, blockJSON) {
        const err = 'huh, weird error :shrug:';
        runtime.visualReport(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op.id, err);
        return err;
      }
    }

    const sanitize = (string) => {
      if (typeof string !== 'string') {
        console.warn(`sanitize got unexpected type: ${typeof string}`);
        string = '' + string;
      }
      return JSON.stringify(string).slice(1, -1);
    };

    const mistutil_iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
    const mist_JSG = mistutil_iwnafhwtb.JSGenerator;
    const mist_STG = mistutil_iwnafhwtb.ScriptTreeGenerator;
    const mist_JSGP = mist_JSG.prototype;
    const mist_STGP = mist_STG.prototype;

    const TYPE_NUMBER = 1;
    const TYPE_STRING = 2;
    const TYPE_BOOLEAN = 3;
    const TYPE_UNKNOWN = 4;
    const TYPE_NUMBER_NAN = 5;

    // prettier-ignore
    class TypedInput {
      constructor(t, s) {
        if ("number" != typeof s) throw Error("type is invalid");
        this.source = t, this.type = s
      }
      asNumber() {
        return this.type === TYPE_NUMBER ? this.source : this.type === TYPE_NUMBER_NAN ? `(${this.source} || 0)` : `(+${this.source} || 0)`
      }
      asNumberOrNaN() {
        return this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN ? this.source : `(+${this.source})`
      }
      asString() {
        return this.type === TYPE_STRING ? this.source : `("" + ${this.source})`
      }
      asBoolean() {
        return this.type === TYPE_BOOLEAN ? this.source : `toBoolean(${this.source})`
      }
      asColor() {
        return this.asUnknown()
      }
      asUnknown() {
        return this.source
      }
      asSafe() {
        return this.asUnknown()
      }
      isAlwaysNumber() {
        return this.type === TYPE_NUMBER
      }
      isAlwaysNumberOrNaN() {
        return this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN
      }
      isNeverNumber() {
        return !1
      }
    }

    // prettier-ignore
    class ConstantInput {
      constructor(t, s) {
        this.constantValue = t, this.safe = s
      }
      asNumber() {
        let t = +this.constantValue;
        return t ? t.toString() : Object.is(t, -0) ? "-0" : "0"
      }
      asNumberOrNaN() {
        return this.asNumber()
      }
      asString() {
        return `"${sanitize("" + this.constantValue)}"`
      }
      asBoolean() {
        return Cast.toBoolean(this.constantValue).toString()
      }
      asColor() {
        if (/^#[0-9a-f]{6, 8}$/i.test(this.constantValue)) {
          let t = this.constantValue.substr(1);
          return Number.parseInt(t, 16).toString()
        }
        return this.asUnknown()
      }
      asUnknown() {
        if ("number" == typeof this.constantValue) return this.constantValue;
        let t = +this.constantValue;
        return t.toString() === this.constantValue ? this.constantValue : this.asString()
      }
      asSafe() {
        return this.safe ? this.asUnknown() : this.asString()
      }
      isAlwaysNumber() {
        let t = +this.constantValue;
        return !Number.isNaN(t) && (0 !== t || "" !== this.constantValue.toString().trim())
      }
      isAlwaysNumberOrNaN() {
        return this.isAlwaysNumber()
      }
      isNeverNumber() {
        return Number.isNaN(+this.constantValue)
      }
    }

    // prettier-ignore
    class VariableInput {
      constructor(t) {
        this.source = t, this.type = TYPE_UNKNOWN, this._value = null
      }
      setInput(t) {
        if (t instanceof VariableInput) {
          if (t._value) t = t._value;
          else {
            this.type = TYPE_UNKNOWN, this._value = null;
            return;
          }
        }
        this._value = t, t instanceof TypedInput ? this.type = t.type : this.type = TYPE_UNKNOWN
      }
      asNumber() {
        return this.type === TYPE_NUMBER ? this.source : this.type === TYPE_NUMBER_NAN ? `(${this.source} || 0)` : `(+${this.source} || 0)`
      }
      asNumberOrNaN() {
        return this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN ? this.source : `(+${this.source})`
      }
      asString() {
        return this.type === TYPE_STRING ? this.source : `("" + ${this.source})`
      }
      asBoolean() {
        return this.type === TYPE_BOOLEAN ? this.source : `toBoolean(${this.source})`
      }
      asColor() {
        return this.asUnknown()
      }
      asUnknown() {
        return this.source
      }
      asSafe() {
        return this.asUnknown()
      }
      isAlwaysNumber() {
        return !!this._value && this._value.isAlwaysNumber()
      }
      isAlwaysNumberOrNaN() {
        return !!this._value && this._value.isAlwaysNumberOrNaN()
      }
      isNeverNumber() {
        return !!this._value && this._value.isNeverNumber()
      }
    }

    const PATCHES_ID = 'tables_patches';
    const cst_patch = (obj, functions) => {
      if (obj[PATCHES_ID]) return;
      obj[PATCHES_ID] = {};
      for (const name in functions) {
        const original = obj[name];
        obj[PATCHES_ID][name] = obj[name];
        if (original) {
          obj[name] = function (...args) {
            const callOriginal = (...args) => original.call(this, ...args);
            return functions[name].call(this, callOriginal, ...args);
          };
        } else {
          obj[name] = function (...args) {
            return functions[name].call(this, () => { }, ...args);
          };
        }
      }
    };

    function caseSanitize(case_) {
      if (typeof case_ === 'undefined') return 'undefined'; // Sanitize undefined
      if (typeof case_ === 'string') return `"${sanitize(case_)}"`;
      if (typeof case_ === 'number') return String(case_);
      console.warn(`sanitization failed on case of type: ${typeof case_}, casting to string`);
      return String(case_);
    }

    function descendTillSource(input, san) {
      let des = this.descendInput(input),
          src = false;
      if (input.kind === 'constant' && input?.value) return san(input.value);
      if (des.constantValue?.value) return san(des.constantValue.value);
      if (des?.source) return des.source;
      des = this.descendInput(des.constantValue);
      if (des.constantValue?.value) return san(des.constantValue.value);
      src = true;
      if (des?.source ?? des?.constantValue?.source) return des?.source ?? des?.constantValue?.source;
      throw new Error('Unable to descend input');
    }

    cst_patch(mist_JSGP, {
      descendStackedBlock(originalFn, node) {
        const block = node.block;
        switch (node.kind) {
          case 'tables.newTable': 
this.source += `\nvm.runtime.visualReport("${block.id}", ([[]]));\n`;
return;
case 'tables.addRow': 
const fgouMfsWgqLf = descendTillSource.call(this, node.A, caseSanitize);
this.source += `\n(${fgouMfsWgqLf}.push(new Array(${fgouMfsWgqLf}[0].length).fill("")));\n`;
return;
case 'tables.addColumn': 
const EteGjdfPKpSh = descendTillSource.call(this, node.A, caseSanitize);
this.source += `\n${EteGjdfPKpSh}.map(column => (column.push(""), column));\n`;
return;
case 'tables.setCell': 
const HpCOfjhjpRFa = descendTillSource.call(this, node.A, caseSanitize);
const eCgMDixvXjRs = descendTillSource.call(this, node.X, caseSanitize);
const BCGxZEcbLkUO = descendTillSource.call(this, node.Y, caseSanitize);
const OeaSJUlDHJfr = descendTillSource.call(this, node.B, caseSanitize);
this.source += `\n(${HpCOfjhjpRFa}[${eCgMDixvXjRs}][${BCGxZEcbLkUO}] = ${OeaSJUlDHJfr});\n`;
return;
case 'tables.getCell': 
const ySOpLGjADhjx = descendTillSource.call(this, node.A, caseSanitize);
const aAXXabcrGxpx = descendTillSource.call(this, node.X, caseSanitize);
const yXfAwidEzlRY = descendTillSource.call(this, node.Y, caseSanitize);
this.source += `\nvm.runtime.visualReport("${block.id}", (${ySOpLGjADhjx}[${aAXXabcrGxpx}][${yXfAwidEzlRY}]));\n`;
return;
case 'tables.deleteRow': 
const IjOpMwnBrmSs = descendTillSource.call(this, node.A, caseSanitize);
const CnBRSGSIpNQd = descendTillSource.call(this, node.X, caseSanitize);
this.source += `\n(${IjOpMwnBrmSs}.splice(${CnBRSGSIpNQd}, 1));\n`;
return;
case 'tables.deleteColumn': 
const UIsUejspkoSu = descendTillSource.call(this, node.A, caseSanitize);
const rjGjXtxZdjOu = descendTillSource.call(this, node.X, caseSanitize);
this.source += `\n(${UIsUejspkoSu}.map(column => (column.splice(${rjGjXtxZdjOu}, 1), column)));\n`;
return;
          default:
            return originalFn.call(this, node);
        }
      },

      descendInput(originalFn, node) {
        switch (node.kind) {
          case 'tables.newTable': 
return new TypedInput(`([[]])`, TYPE_STRING);
case 'tables.addRow': 
const fgouMfsWgqLf = descendTillSource.call(this, node.A, caseSanitize);
return new TypedInput(`(${fgouMfsWgqLf}.push(new Array(${fgouMfsWgqLf}[0].length).fill("")))`, TYPE_UNKNOWN);
case 'tables.addColumn': 
const EteGjdfPKpSh = descendTillSource.call(this, node.A, caseSanitize);
return new TypedInput(`${EteGjdfPKpSh}.map(column => (column.push(""), column))`, TYPE_UNKNOWN);
case 'tables.setCell': 
const HpCOfjhjpRFa = descendTillSource.call(this, node.A, caseSanitize);
const eCgMDixvXjRs = descendTillSource.call(this, node.X, caseSanitize);
const BCGxZEcbLkUO = descendTillSource.call(this, node.Y, caseSanitize);
const OeaSJUlDHJfr = descendTillSource.call(this, node.B, caseSanitize);
return new TypedInput(`(${HpCOfjhjpRFa}[${eCgMDixvXjRs}][${BCGxZEcbLkUO}] = ${OeaSJUlDHJfr})`, TYPE_UNKNOWN);
case 'tables.getCell': 
const ySOpLGjADhjx = descendTillSource.call(this, node.A, caseSanitize);
const aAXXabcrGxpx = descendTillSource.call(this, node.X, caseSanitize);
const yXfAwidEzlRY = descendTillSource.call(this, node.Y, caseSanitize);
return new TypedInput(`(${ySOpLGjADhjx}[${aAXXabcrGxpx}][${yXfAwidEzlRY}])`, TYPE_STRING);
case 'tables.deleteRow': 
const IjOpMwnBrmSs = descendTillSource.call(this, node.A, caseSanitize);
const CnBRSGSIpNQd = descendTillSource.call(this, node.X, caseSanitize);
return new TypedInput(`(${IjOpMwnBrmSs}.splice(${CnBRSGSIpNQd}, 1))`, TYPE_UNKNOWN);
case 'tables.deleteColumn': 
const UIsUejspkoSu = descendTillSource.call(this, node.A, caseSanitize);
const rjGjXtxZdjOu = descendTillSource.call(this, node.X, caseSanitize);
return new TypedInput(`(${UIsUejspkoSu}.map(column => (column.splice(${rjGjXtxZdjOu}, 1), column)))`, TYPE_UNKNOWN);
          default:
            return originalFn(node);
        }
      },
    });

    cst_patch(mist_STGP, {
      descendStackedBlock(originalFn, block) {
        switch (block.opcode) {
          case 'tables_newTable':
return {
block,
kind: 'tables.newTable',

};
case 'tables_addRow':
return {
block,
kind: 'tables.addRow',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_addColumn':
return {
block,
kind: 'tables.addColumn',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_setCell':
return {
block,
kind: 'tables.setCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_getCell':
return {
block,
kind: 'tables.getCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),

};
case 'tables_deleteRow':
return {
block,
kind: 'tables.deleteRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
case 'tables_deleteColumn':
return {
block,
kind: 'tables.deleteColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
          default:
            return originalFn(block);
        }
      },

      descendInput(originalFn, block) {
        switch (block.opcode) {
          case 'tables_newTable':
return {
block,
kind: 'tables.newTable',

};
case 'tables_addRow':
return {
block,
kind: 'tables.addRow',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_addColumn':
return {
block,
kind: 'tables.addColumn',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_setCell':
return {
block,
kind: 'tables.setCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_getCell':
return {
block,
kind: 'tables.getCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),

};
case 'tables_deleteRow':
return {
block,
kind: 'tables.deleteRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
case 'tables_deleteColumn':
return {
block,
kind: 'tables.deleteColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
          default:
            return originalFn(block);
        }
      },
    });

    Scratch.extensions.register(new tables());
  })(Scratch);
