(function (Scratch) {
    'use strict';
    // This extension uses mistium's compiled block builder
    // Please don't remove this, be kind :P

    if (!Scratch.extensions.unsandboxed) {
      throw new Error("mistiumComments needs to be run unsandboxed.");
    }

    const vm = Scratch.vm,
          runtime = vm.runtime;

    class mistiumComments {
      getInfo() {
        return {
          id: 'mistiumComments',
          name: 'Comments',
          color1: '#146fa6', 
          blocks: [
  {
    "blockType": Scratch.BlockType.LABEL,
    "text": "Single line comment"
  },
  {
    "opcode": "blockcomment",
    "blockType": Scratch.BlockType.COMMAND,
    "text": "// [comment]",
    "code": "// ${nsLIjpTsCHRk}",
    "arguments": {
      "comment": {
        "type": Scratch.ArgumentType.STRING,
        "gen_id": "nsLIjpTsCHRk",
        "defaultValue": "This is a comment"
      }
    },
    "func": "err"
  },
  {
    "opcode": "Ccomment",
    "blockType": Scratch.BlockType.CONDITIONAL,
    "text": "// [comment]",
    "code": "true",
    "returns": "BOOLEAN",
    "arguments": {
      "comment": {
        "type": Scratch.ArgumentType.STRING,
        "gen_id": "SWYtAVkaIPfT",
        "defaultValue": "This is a comment"
      }
    },
    "func": "err"
  },
  {
    "opcode": "booleancomment",
    "blockType": Scratch.BlockType.BOOLEAN,
    "text": "[boolean] // [comment]",
    "code": "${FKYYpoWdPouw}",
    "returns": "BOOLEAN",
    "arguments": {
      "boolean": {
        "type": Scratch.ArgumentType.BOOLEAN,
        "gen_id": "FKYYpoWdPouw"
      },
      "comment": {
        "type": Scratch.ArgumentType.STRING,
        "gen_id": "bfUIxfFEyZpV",
        "defaultValue": "This is a comment"
      }
    },
    "func": "err"
  },
  {
    "opcode": "reportercomment",
    "blockType": Scratch.BlockType.REPORTER,
    "text": "[reporter] // [comment]",
    "code": "${icYnSSUiCnmJ}",
    "returns": "STRING",
    "allowDropAnywhere": true,
    "arguments": {
      "reporter": {
        "type": Scratch.ArgumentType.STRING,
        "gen_id": "icYnSSUiCnmJ",
        "defaultValue": "This is a comment"
      },
      "comment": {
        "type": Scratch.ArgumentType.STRING,
        "gen_id": "KarZDlXHhICE",
        "defaultValue": "This is a comment"
      }
    },
    "func": "err"
  },
  "---",
  {
    "blockType": Scratch.BlockType.LABEL,
    "text": "Multi line comment"
  },
  {
    "opcode": "openMutlilineComment",
    "blockType": Scratch.BlockType.COMMAND,
    "text": "Open Mutliline Comment",
    "code": "/*",
    "func": "err"
  },
  {
    "opcode": "closeMultilineComment",
    "blockType": Scratch.BlockType.COMMAND,
    "text": "Close Multiline Comment",
    "code": "*/",
    "func": "err"
  }
],
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

    const PATCHES_ID = 'mistiumComments_patches';
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
      if (typeof case_ === 'undefined') return '""'; // Sanitize undefined
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
          
case 'mistiumComments.blockcomment': 
const nsLIjpTsCHRk = descendTillSource.call(this, node.comment, caseSanitize) || "";
this.source += `\n// ${nsLIjpTsCHRk};\n`;
return;
case 'mistiumComments.Ccomment': 
const SWYtAVkaIPfT = descendTillSource.call(this, node.comment, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", true);\n`;
return;
case 'mistiumComments.booleancomment': 
const FKYYpoWdPouw = descendTillSource.call(this, node.boolean, caseSanitize) || "";
const bfUIxfFEyZpV = descendTillSource.call(this, node.comment, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", ${FKYYpoWdPouw});\n`;
return;
case 'mistiumComments.reportercomment': 
const icYnSSUiCnmJ = descendTillSource.call(this, node.reporter, caseSanitize) || "";
const KarZDlXHhICE = descendTillSource.call(this, node.comment, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", ${icYnSSUiCnmJ});\n`;
return;


case 'mistiumComments.openMutlilineComment': 
this.source += `\n/*;\n`;
return;
case 'mistiumComments.closeMultilineComment': 
this.source += `\n*/;\n`;
return;
          default:
            return originalFn.call(this, node);
        }
      },

      descendInput(originalFn, node) {
        switch (node.kind) {
          
case 'mistiumComments.blockcomment': 
const nsLIjpTsCHRk = descendTillSource.call(this, node.comment, caseSanitize) || "";
return new TypedInput(`// ${nsLIjpTsCHRk}`, TYPE_UNKNOWN);
case 'mistiumComments.Ccomment': 
const SWYtAVkaIPfT = descendTillSource.call(this, node.comment, caseSanitize) || "";
return new TypedInput(`true`, TYPE_BOOLEAN);
case 'mistiumComments.booleancomment': 
const FKYYpoWdPouw = descendTillSource.call(this, node.boolean, caseSanitize) || "";
const bfUIxfFEyZpV = descendTillSource.call(this, node.comment, caseSanitize) || "";
return new TypedInput(`${FKYYpoWdPouw}`, TYPE_BOOLEAN);
case 'mistiumComments.reportercomment': 
const icYnSSUiCnmJ = descendTillSource.call(this, node.reporter, caseSanitize) || "";
const KarZDlXHhICE = descendTillSource.call(this, node.comment, caseSanitize) || "";
return new TypedInput(`${icYnSSUiCnmJ}`, TYPE_STRING);


case 'mistiumComments.openMutlilineComment': 
return new TypedInput(`/*`, TYPE_UNKNOWN);
case 'mistiumComments.closeMultilineComment': 
return new TypedInput(`*/`, TYPE_UNKNOWN);
          default:
            return originalFn(node);
        }
      },
    });

    cst_patch(mist_STGP, {
      descendStackedBlock(originalFn, block) {
        switch (block.opcode) {
          
case 'mistiumComments_blockcomment':
return {
block,
kind: 'mistiumComments.blockcomment',
comment: this.descendInputOfBlock(block, 'comment'),

};
case 'mistiumComments_Ccomment':
return {
block,
kind: 'mistiumComments.Ccomment',
comment: this.descendInputOfBlock(block, 'comment'),

};
case 'mistiumComments_booleancomment':
return {
block,
kind: 'mistiumComments.booleancomment',
boolean: this.descendInputOfBlock(block, 'boolean'),
comment: this.descendInputOfBlock(block, 'comment'),

};
case 'mistiumComments_reportercomment':
return {
block,
kind: 'mistiumComments.reportercomment',
reporter: this.descendInputOfBlock(block, 'reporter'),
comment: this.descendInputOfBlock(block, 'comment'),

};


case 'mistiumComments_openMutlilineComment':
return {
block,
kind: 'mistiumComments.openMutlilineComment',

};
case 'mistiumComments_closeMultilineComment':
return {
block,
kind: 'mistiumComments.closeMultilineComment',

};
          default:
            return originalFn(block);
        }
      },

      descendInput(originalFn, block) {
        switch (block.opcode) {
          
case 'mistiumComments_blockcomment':
return {
block,
kind: 'mistiumComments.blockcomment',
comment: this.descendInputOfBlock(block, 'comment'),

};
case 'mistiumComments_Ccomment':
return {
block,
kind: 'mistiumComments.Ccomment',
comment: this.descendInputOfBlock(block, 'comment'),

};
case 'mistiumComments_booleancomment':
return {
block,
kind: 'mistiumComments.booleancomment',
boolean: this.descendInputOfBlock(block, 'boolean'),
comment: this.descendInputOfBlock(block, 'comment'),

};
case 'mistiumComments_reportercomment':
return {
block,
kind: 'mistiumComments.reportercomment',
reporter: this.descendInputOfBlock(block, 'reporter'),
comment: this.descendInputOfBlock(block, 'comment'),

};


case 'mistiumComments_openMutlilineComment':
return {
block,
kind: 'mistiumComments.openMutlilineComment',

};
case 'mistiumComments_closeMultilineComment':
return {
block,
kind: 'mistiumComments.closeMultilineComment',

};
          default:
            return originalFn(block);
        }
      },
    });

    Scratch.extensions.register(new mistiumComments());
  })(Scratch);
