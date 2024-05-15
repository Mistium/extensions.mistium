/**!
 * Mist's Utils
 * @author mistium
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Basically half of this is 0znzw's code lmao
 * Do not remove this comment
 * Intended for originOS but can be used in other projects
 */

(function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`Mist's Utils needs to be ran unsandboxed.`);
  }

  const vm = Scratch.vm,
    runtime = vm.runtime;
  class mistiumcomp {
    getInfo() {
      return {
        id: 'mistsutils',
        color1: '#2DA4A0',
        name: 'Mist\'s Utils',
        blocks: [
          {
            opcode: 'notequals',
            func: 'err',
            text: '[A] !== [B]',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
            },
          },
          {
            opcode: 'equals',
            func: 'err',
            text: '[A] === [B]',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
            },
          },
          {
            opcode: 'clamp',
            func: 'err',
            text: 'clamp [A] between [B] and [C]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              C: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
            },
          },
          {
            opcode: 'letters',
            func: 'err',
            text: 'letters [A] to [B] of [C]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
              C: { type: Scratch.ArgumentType.STRING, defaultValue: "apple" },
            },
          },
          {
            opcode: 'split',
            func: 'err',
            text: 'split [A] by [B]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: "apple" },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: "l" },
            },
          },
          {
            opcode: 'item',
            func: 'err',
            text: 'item [C] of [A] split by [B]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: "apple" },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: "l" },
              C: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            },
          },
          {
            opcode: 'true',
            func: 'err',
            text: 'true',
            blockType: Scratch.BlockType.BOOLEAN,
          },
          {
            opcode: 'false',
            func: 'err',
            text: 'false',
            blockType: Scratch.BlockType.BOOLEAN,
          },
          {
            opcode: 'performancenow',
            func: 'err',
            text: 'performance.now()',
            blockType: Scratch.BlockType.REPORTER,
          },
          {
            opcode: 'stagewidth',
            func: 'err',
            text: 'Stage Width',
            blockType: Scratch.BlockType.REPORTER,
          },
          {
            opcode: 'stageheight',
            func: 'err',
            text: 'Stage Height',
            blockType: Scratch.BlockType.REPORTER,
          },
          {
            opcode: 'starts',
            func: 'err',
            text: '[A] starts with [B]',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: 'app' },
            },
          },
          {
            opcode: 'ends',
            func: 'err',
            text: '[A] ends with [B]',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: 'app' },
            },
          },
          {
            opcode: 'toUnicode',
            func: 'err',
            text: 'Unicode Of [A]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: 'A' },
            },
          },
        ],
      };
    }
    err(args, util, blockJSON) {
      const err = 'huh, weird error :shrug:';
      runtime.visualReport(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op.id, err);
      return err;
    }
  }

  function sanitizeForEmbed(wrap, string) {
    // @ts-ignore Overdated syntax
    return String(string).replaceAll('\\', '\\\\').replaceAll(wrap, `\\${wrap}`);
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

  // Importing classes and "TYPE_*"s from JSG
  const TYPE_NUMBER = 1;
  const TYPE_STRING = 2;
  const TYPE_BOOLEAN = 3;
  const TYPE_UNKNOWN = 4;
  const TYPE_NUMBER_NAN = 5;
  // prettier-ignore
  class TypedInput{constructor(t,s){if("number"!=typeof s)throw Error("type is invalid");this.source=t,this.type=s}asNumber(){return this.type===TYPE_NUMBER?this.source:this.type===TYPE_NUMBER_NAN?`(${this.source} || 0)`:`(+${this.source} || 0)`}asNumberOrNaN(){return this.type===TYPE_NUMBER||this.type===TYPE_NUMBER_NAN?this.source:`(+${this.source})`}asString(){return this.type===TYPE_STRING?this.source:`("" + ${this.source})`}asBoolean(){return this.type===TYPE_BOOLEAN?this.source:`toBoolean(${this.source})`}asColor(){return this.asUnknown()}asUnknown(){return this.source}asSafe(){return this.asUnknown()}isAlwaysNumber(){return this.type===TYPE_NUMBER}isAlwaysNumberOrNaN(){return this.type===TYPE_NUMBER||this.type===TYPE_NUMBER_NAN}isNeverNumber(){return!1}}
  // prettier-ignore
  class ConstantInput{constructor(t,s){this.constantValue=t,this.safe=s}asNumber(){let t=+this.constantValue;return t?t.toString():Object.is(t,-0)?"-0":"0"}asNumberOrNaN(){return this.asNumber()}asString(){return`"${sanitize(""+this.constantValue)}"`}asBoolean(){return Cast.toBoolean(this.constantValue).toString()}asColor(){if(/^#[0-9a-f]{6,8}$/i.test(this.constantValue)){let t=this.constantValue.substr(1);return Number.parseInt(t,16).toString()}return this.asUnknown()}asUnknown(){if("number"==typeof this.constantValue)return this.constantValue;let t=+this.constantValue;return t.toString()===this.constantValue?this.constantValue:this.asString()}asSafe(){return this.safe?this.asUnknown():this.asString()}isAlwaysNumber(){let t=+this.constantValue;return!Number.isNaN(t)&&(0!==t||""!==this.constantValue.toString().trim())}isAlwaysNumberOrNaN(){return this.isAlwaysNumber()}isNeverNumber(){return Number.isNaN(+this.constantValue)}}
  // prettier-ignore
  class VariableInput{constructor(t){this.source=t,this.type=TYPE_UNKNOWN,this._value=null}setInput(t){if(t instanceof VariableInput){if(t._value)t=t._value;else{this.type=TYPE_UNKNOWN,this._value=null;return}}this._value=t,t instanceof TypedInput?this.type=t.type:this.type=TYPE_UNKNOWN}asNumber(){return this.type===TYPE_NUMBER?this.source:this.type===TYPE_NUMBER_NAN?`(${this.source} || 0)`:`(+${this.source} || 0)`}asNumberOrNaN(){return this.type===TYPE_NUMBER||this.type===TYPE_NUMBER_NAN?this.source:`(+${this.source})`}asString(){return this.type===TYPE_STRING?this.source:`("" + ${this.source})`}asBoolean(){return this.type===TYPE_BOOLEAN?this.source:`toBoolean(${this.source})`}asColor(){return this.asUnknown()}asUnknown(){return this.source}asSafe(){return this.asUnknown()}isAlwaysNumber(){return!!this._value&&this._value.isAlwaysNumber()}isAlwaysNumberOrNaN(){return!!this._value&&this._value.isAlwaysNumberOrNaN()}isNeverNumber(){return!!this._value&&this._value.isNeverNumber()}}
  

  const PATCHES_ID = 'mistsutils';
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
          return functions[name].call(this, () => {}, ...args);
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
        case 'mistsutils.equals':
          const A_eql = descendTillSource.call(this, node.A, caseSanitize);
          const B_eql = descendTillSource.call(this, node.B, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${A_eql}) === (${B_eql})));\n`;
          return;
        case 'mistsutils.notequals':
          const A_noteql = descendTillSource.call(this, node.A, caseSanitize);
          const B_noteql = descendTillSource.call(this, node.B, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${A_noteql}) !== (${B_noteql})));\n`;
          return;
        case 'mistsutils.clamp':
          const A_clamp = descendTillSource.call(this, node.A, caseSanitize);
          const B_clamp = descendTillSource.call(this, node.B, caseSanitize);
          const C_clamp = descendTillSource.call(this, node.C, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(((${B_clamp}) || 0), Math.min(((${C_clamp}) || 0), ((${A_clamp})) || 0)));\n`;
          return;
        case 'mistsutils.letters':
          const A_letters = descendTillSource.call(this, node.A, caseSanitize);
          const B_letters = descendTillSource.call(this, node.B, caseSanitize);
          const C_letters = descendTillSource.call(this, node.C, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", (${C_letters}).substring(Math.max(((${A_letters}) || 0) - 1, 0), Math.min(((${B_letters}) || 0), (${C_letters}).length)));\n`;
          return;
        case 'mistsutils.split':
          const A_split = descendTillSource.call(this, node.A, caseSanitize);
          const B_split = descendTillSource.call(this, node.B, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${A_split}).split(${B_split})));\n`;
          return;
        case 'mistsutils.item':
          const A_item = descendTillSource.call(this, node.A, caseSanitize);
          const B_item = descendTillSource.call(this, node.B, caseSanitize);
          const C_item = descendTillSource.call(this, node.C, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", (${A_item}).split(${B_item})[((${C_item}) || 1) - 1]);\n`;
          return;
        case 'mistsutils.replace':
          const A_repl = descendTillSource.call(this, node.A, caseSanitize);
          const B_repl = descendTillSource.call(this, node.B, caseSanitize);
          const C_repl = descendTillSource.call(this, node.C, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${A_repl} || "")).replace(new RegExp(((${C_repl}) ?? ""), 'g'), (${B_repl}) ?? ""));\n`;
          return;
        case 'mistsutils.true':
          this.source += `\nvm.runtime.visualReport("${block.id}", "true");\n`;
          return;
        case 'mistsutils.false':
          this.source += `\nvm.runtime.visualReport("${block.id}", "false");\n`;
          return;
        case 'mistsutils.performancenow':
          this.source += `\nvm.runtime.visualReport("${block.id}", window.performance.now());\n`;
          return;
        case 'mistsutils.stagewidth':
          this.source += `\nvm.runtime.visualReport("${block.id}", Scratch.vm.runtime.stageWidth);\n`;
          return;
        case 'mistsutils.stageheight':
          this.source += `\nvm.runtime.visualReport("${block.id}", Scratch.vm.runtime.stageHeight);\n`;
          return;
        case 'mistsutils.starts':
          const A_starts = descendTillSource.call(this, node.A, caseSanitize);
          const B_starts = descendTillSource.call(this, node.B, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", ("" + (${A_starts})).startsWith("" + (${B_starts})));\n`;
          return;
        case 'mistsutils.ends':
          const A_ends = descendTillSource.call(this, node.A, caseSanitize);
          const B_ends = descendTillSource.call(this, node.B, caseSanitize);
          this.source += `\nvm.runtime.visualReport("${block.id}", ("" + (${A_ends})).endsWith("" + (${B_ends})));\n`;
          return;
        case 'mistsutils.toUnicode':
          this.source += `\nvm.runtime.visualReport("${block.id}", ("" + (${descendTillSource.call(this, node.A, caseSanitize)})).codePointAt(0));\n`;
          return;
        default:
          return originalFn(node);
      }
    },
    descendInput(originalFn, node) {
      switch (node.kind) {
        case 'mistsutils.equals':
          const A_eql = descendTillSource.call(this, node.A, caseSanitize);
          const B_eql = descendTillSource.call(this, node.B, caseSanitize);
          return new TypedInput(`((${A_eql}) === (${B_eql}))`, TYPE_BOOLEAN);
        case 'mistsutils.notequals':
          const A_noteql = descendTillSource.call(this, node.A, caseSanitize);
          const B_noteql = descendTillSource.call(this, node.B, caseSanitize);
          return new TypedInput(`((${A_noteql}) !== (${B_noteql}))`, TYPE_BOOLEAN);
        case 'mistsutils.clamp':
          const A_clamp = descendTillSource.call(this, node.A, caseSanitize);
          const B_clamp = descendTillSource.call(this, node.B, caseSanitize);
          const C_clamp = descendTillSource.call(this, node.C, caseSanitize);
          return new TypedInput(`Math.max(((${B_clamp}) || 0), Math.min(((${C_clamp}) || 0), ((${A_clamp})) || 0))`, TYPE_NUMBER);
        case 'mistsutils.letters':
          const A_letters = descendTillSource.call(this, node.A, caseSanitize);
          const B_letters = descendTillSource.call(this, node.B, caseSanitize);
          const C_letters = descendTillSource.call(this, node.C, caseSanitize);
          return new TypedInput(`(${C_letters}).substring(Math.max(((${A_letters}) || 0) - 1, 0), Math.min(((${B_letters}) || 0), (${C_letters}).length))`, TYPE_NUMBER);
        case 'mistsutils.split':
          const A_split = descendTillSource.call(this, node.A, caseSanitize);
          const B_split = descendTillSource.call(this, node.B, caseSanitize);
          return new TypedInput(`JSON.stringify((${A_split}).split(${B_split}))`, TYPE_STRING);
        case 'mistsutils.item':
          const A_item = descendTillSource.call(this, node.A, caseSanitize);
          const B_item = descendTillSource.call(this, node.B, caseSanitize);
          const C_item = descendTillSource.call(this, node.C, caseSanitize);
          return new TypedInput(`(${A_item}).split(${B_item})[((${C_item}) || 1) - 1]`, TYPE_STRING);
        case 'mistsutils.replace':
          const A_repl = descendTillSource.call(this, node.A, caseSanitize);
          const B_repl = descendTillSource.call(this, node.B, caseSanitize);
          const C_repl = descendTillSource.call(this, node.C, caseSanitize);
          return new TypedInput(`((${A_repl} || "")).replace(new RegExp(((${C_repl}) ?? ""), 'g'), (${B_repl}) ?? "")`, TYPE_STRING);
        case 'mistsutils.true':
          return new TypedInput(true, TYPE_BOOLEAN);
        case 'mistsutils.false':
          return new TypedInput(false, TYPE_BOOLEAN);
        case 'mistsutils.performancenow':
          return new TypedInput('window.performance.now()', TYPE_NUMBER);
        case 'mistsutils.stagewidth':
          return new TypedInput('Scratch.vm.runtime.stageWidth', TYPE_NUMBER);
        case 'mistsutils.stageheight':
          return new TypedInput('Scratch.vm.runtime.stageHeight', TYPE_NUMBER);
        case 'mistsutils.starts':
          const A_starts = descendTillSource.call(this, node.A, caseSanitize);
          const B_starts = descendTillSource.call(this, node.B, caseSanitize);
          return new TypedInput(`("" + (${A_starts})).startsWith("" + (${B_starts}))`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const A_ends = descendTillSource.call(this, node.A, caseSanitize);
          const B_ends = descendTillSource.call(this, node.B, caseSanitize);
          return new TypedInput(`("" + (${A_ends})).endsWith("" + (${B_ends}))`, TYPE_BOOLEAN);
        case "mistsutils.toUnicode":
          return new TypedInput(`("" + (${descendTillSource.call(this, node.A, caseSanitize)})).codePointAt(0)`, TYPE_NUMBER);
        default:
          return originalFn(node);
      }
    },
  });
  cst_patch(mist_STGP, {
    descendStackedBlock(originalFn, block) {
      switch (block.opcode) {
        case 'mistsutils_equals':
          return {
            block,
            kind: 'mistsutils.equals',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_notequals':
          return {
            block,
            kind: 'mistsutils.notequals',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_letterof':
          return {
            block,
            kind: 'mistsutils.letterof',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_clamp':
          return {
            block,
            kind: 'mistsutils.clamp',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_letters':
          return {
            block,
            kind: 'mistsutils.letters',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_split':
          return {
            block,
            kind: 'mistsutils.split',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_item':
          return {
            block,
            kind: 'mistsutils.item',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_replace':
          return {
            block,
            kind: 'mistsutils.replace',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_performancenow':
          return {
            block,
            kind: 'mistsutils.performancenow',
          };
        case 'mistsutils_stagewidth':
          return {
            block,
            kind: 'mistsutils.stagewidth',
          };
        case 'mistsutils_stageheight':
          return {
            block,
            kind: 'mistsutils.stageheight',
          };
        case 'mistsutils_starts':
          return {
            block,
            kind: 'mistsutils.starts',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_ends':
          return {
            block,
            kind: 'mistsutils.ends',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_toUnicode':
          return {
            block,
            kind: 'mistsutils.toUnicode',
            A: this.descendInputOfBlock(block, 'A'),
          };
        default:
          return originalFn(block);
      }
    },
    descendInput(originalFn, block) {
      switch (block.opcode) {
        case 'mistsutils_equals':
          return {
            kind: 'mistsutils.equals',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_notequals':
          return {
            kind: 'mistsutils.notequals',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_letterof':
          return {
            kind: 'mistsutils.letterof',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_clamp':
          return {
            kind: 'mistsutils.clamp',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_letters':
          return {
            kind: 'mistsutils.letters',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_split':
          return {
            kind: 'mistsutils.split',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_item':
          return {
            kind: 'mistsutils.item',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_replace':
          return {
            kind: 'mistsutils.replace',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
            C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_performancenow':
          return {
            kind: 'mistsutils.performancenow',
          };
        case 'mistsutils_true':
          return {
            kind: 'mistsutils.true',
          };
        case 'mistsutils_false':
          return {
            kind: 'mistsutils.false',
          };
        case 'mistsutils_stagewidth':
          return {
            kind: 'mistsutils.stagewidth',
          };
        case 'mistsutils_stageheight':
          return {
            kind: 'mistsutils.stageheight',
          };
        case 'mistsutils_starts':
          return {
            kind: 'mistsutils.starts',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_ends':
          return {
            kind: 'mistsutils.ends',
            A: this.descendInputOfBlock(block, 'A'),
            B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_toUnicode':
          return {
            kind: 'mistsutils.toUnicode',
            A: this.descendInputOfBlock(block, 'A'),
          };
        default:
          return originalFn(block);
      }
    },
  });
  Scratch.extensions.register(new mistiumcomp());
})(Scratch);
