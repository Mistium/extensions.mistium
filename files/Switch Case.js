/**!
 * Switch Case (Compiled)
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 * I gave them a colour :P - Mist
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Switch Case v1c" needs to be ran unsandboxed.`);
  }

  const vm = Scratch.vm, runtime = vm.runtime;
  class extension {
    getInfo() {
      return {
      id: '0zSwCc',
      name: 'Switch Case (Compiled)',
      color1: '#661c38',
      blocks: [{
        opcode: 'switch_', func: 'err',
        text: 'switch [C]',
        blockType: Scratch.BlockType.CONDITIONAL,
        arguments: {
          C: {type: Scratch.ArgumentType.STRING, defaultValue: 'apple'}
        },
      },{
        opcode: 'case_', func: 'err',
        text: 'case [C]',
        blockType: Scratch.BlockType.CONDITIONAL,
        arguments: {
          C: {type: Scratch.ArgumentType.STRING, defaultValue: 'apple'}
        },
      },{
        opcode: 'default_', func: 'err',
        text: 'default',
        blockType: Scratch.BlockType.CONDITIONAL,
        isTerminal: true,
      },{
        opcode: 'break_', func: 'err',
        text: 'break',
        blockType: Scratch.BlockType.COMMAND,
        isTerminal: true,
      }],
      }
    }
    err(args, util, blockJSON) {
      const err = 'This version of switch case only works in the compiler :trol:';
      runtime.visualReport(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op.id, err);
      return err;
    }
  }

  function sanitizeForEmbed(wrap, string) {
    // @ts-ignore Overdated syntax
    return String(string).replaceAll('\\', '\\\\').replaceAll(wrap, `\\${wrap}`);
  }

  const sanitize = string => {
    if (typeof string !== 'string') {
      console.warn(`sanitize got unexpected type: ${typeof string}`);
      string = '' + string;
    }
    return JSON.stringify(string).slice(1, -1);
  };

  class Frame {
    constructor(isLoop) {
      this.isLoop = isLoop;
      this.isLastBlock = false;
    }
  }

  const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
  const JSG = iwnafhwtb.JSGenerator;
  const STG = iwnafhwtb.ScriptTreeGenerator;
  const JSGP = JSG.prototype;
  const STGP = STG.prototype;

  const PATCHES_ID = '0zSwCc';
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
    if (typeof case_ == 'string') return `"${sanitize(case_)}"`;
    if (typeof case_ == 'number') return String(case_);
    console.warn(`sanitization failed on case of type: ${typeof case_}, casting to string`);
    return String(case_);
  }
  function descendTillSource(input, san) {
    let des = this.descendInput(input), src = false;
    if (des.constantValue?.value) return san(des.constantValue.value);
    des = this.descendInput(des.constantValue);
    if (des.constantValue?.value) return san(des.constantValue.value);
    src = true;
    if (des?.source ?? des?.constantValue?.source) return des?.source ?? des?.constantValue?.source;
    throw new Error('Unable to descend input');
  }

  cst_patch(JSGP, {
    descendStackedBlock(originalFn, node) {
      switch(node.kind) {
        case '0zSwCc.switch':
          const case1_ = descendTillSource.call(this, node.case, caseSanitize);
          const oldSrc1 = this.source ?? '';
          this.descendStack(node.code, new Frame(false, node.type));
          const stackSrc1 = this.source.substring(oldSrc1.length);
          this.source = oldSrc1;
          this.source += `\nswitch(${case1_}) {\n${stackSrc1}\n}\n`;
          return;
        case '0zSwCc.case':
          const case2_ = descendTillSource.call(this, node.case, caseSanitize);
          const oldSrc2 = this.source ?? '';
          this.descendStack(node.code, new Frame(false, node.type));
          const stackSrc2 = this.source.substring(oldSrc2.length);
          this.source = oldSrc2;
          this.source += `case ${case2_}:\n${stackSrc2}\n`;
          return;
        case '0zSwCc.default':
          const oldSrc3 = this.source ?? '';
          this.descendStack(node.code, new Frame(false, node.type));
          const stackSrc3 = this.source.substring(oldSrc3.length);
          this.source = oldSrc3;
          this.source += `default:\n${stackSrc3}\n`;
          return;
        case '0zSwCc.break':
          this.source += `\nbreak;`;
          return;
        default:
          return originalFn(node);
      }
    },
  });

  cst_patch(STGP, {
    descendStackedBlock(originalFn, block) {
      switch(block.opcode) {
        case '0zSwCc_switch_':
          return {
            kind: '0zSwCc.switch',
            case: {
              kind: 'constant',
              value: this.descendInputOfBlock(block, 'C'),
            },
            code: this.descendSubstack(block, 'SUBSTACK'),
          };
        case '0zSwCc_case_':
          return {
            kind: '0zSwCc.case',
            case: {
              kind: 'constant',
              value: this.descendInputOfBlock(block, 'C'),
            },
            code: this.descendSubstack(block, 'SUBSTACK'),
          };
        case '0zSwCc_default_':
          return {
            kind: '0zSwCc.default',
            code: this.descendSubstack(block, 'SUBSTACK'),
          };
        case '0zSwCc_break_':
          return {
            kind: '0zSwCc.break',
          };
        default:
          return originalFn(block);
      }
    },
  });
  Scratch.extensions.register(new extension());
})(Scratch);
