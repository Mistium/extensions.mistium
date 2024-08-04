/**!
 * Mist's Utils
 * @author mistium
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Basically half of this is 0znzw's code lmao
 * Do not remove this comment
 * Intended for originOS but can be used in other projects
 */

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("mistsutils needs to be run unsandboxed.");
  }

  const {
    vm,
    BlockType,
    ArgumentType
  } = Scratch;
  const {
    runtime
  } = vm;
  const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
  const {
    JSGenerator,
    IRGenerator,
    ScriptTreeGenerator
  } = iwnafhwtb;
  const {
    TYPE_NUMBER,
    TYPE_STRING,
    TYPE_BOOLEAN,
    TYPE_UNKNOWN,
    TYPE_NUMBER_NAN,
    TypedInput,
    ConstantInput,
    VariableInput,
    Frame,
    sanitize
  } = JSGenerator.unstable_exports;
  const JSGP = JSGenerator.prototype,
    IRGP = IRGenerator.prototype,
    STGP = ScriptTreeGenerator.prototype;

  ConstantInput.prototype.asRaw = function() {
    return this.constantValue;
  };
  TypedInput.prototype.asRaw = function() {
    return this.asUnknown();
  };
  TypedInput.prototype.asSafe = function() {
    return this.asUnknown();
  };
  VariableInput.prototype.asRaw = function() {
    return this._value.asRaw();
  };

  class mistsutils {
    getInfo() {
      return {
        id: 'mistsutils',
        name: 'Mists Utils',
        color1: '#2DA4A0',
        blocks: [{
            "opcode": "notequals",
            "func": "err",
            "text": "[A] !== [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "((\"\"+(${BpbrqUadncSy})) !== (\"\"+(${xcJUGikkSlhs})))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "BpbrqUadncSy"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "xcJUGikkSlhs"
              }
            }
          },
          {
            "opcode": "equals",
            "func": "err",
            "text": "[A] === [B]",
            "code": "((\"\"+(${rOhBYXGkYYZi})) === (\"\"+(${FDNcFkQvRvST})))",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "rOhBYXGkYYZi"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "FDNcFkQvRvST"
              }
            }
          },
          {
            "opcode": "compare",
            "func": "err",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "((\"\"+(${EasMoVMZuWbC})) ${FvhIzHDUYWlJ} (\"\"+(${VfTHvBWhpNzv})))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "EasMoVMZuWbC"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "VfTHvBWhpNzv"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "FvhIzHDUYWlJ"
              }
            }
          },
          {
            "opcode": "power",
            "func": "err",
            "text": "[A] ^ [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.pow(${SKtyeIvYqBie}, ${FLIRwgigBdKD})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "SKtyeIvYqBie"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "FLIRwgigBdKD"
              }
            }
          },
          "---",
          {
            "opcode": "clamp",
            "func": "err",
            "text": "clamp [A] between [B] and [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(Math.max(${vpeNcXWAQBdZ}, ${HGJiQJKbROdG}), ${gajGxFxIpmiD})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "vpeNcXWAQBdZ"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "HGJiQJKbROdG"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "gajGxFxIpmiD"
              }
            }
          },
          {
            "opcode": "letters",
            "func": "err",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${yykUNXZktdgC})).substring(${OxsPKlpQtwXG}, ${NXLeXSrdmKUr})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "OxsPKlpQtwXG"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "NXLeXSrdmKUr"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "yykUNXZktdgC"
              }
            }
          },
          "---",
          {
            "opcode": "starts",
            "func": "err",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(\"\"+(${VMAkcAxsfzce})).startsWith(\"\"+(${uNYaQAusrgxm}))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "VMAkcAxsfzce"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "uNYaQAusrgxm"
              }
            }
          },
          {
            "opcode": "ends",
            "func": "err",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(\"\"+(${cDFqATRWeWeV})).endsWith(\"\"+(${EErWYavLDaLF}))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "cDFqATRWeWeV"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "EErWYavLDaLF"
              }
            }
          },
          {
            "opcode": "toUnicode",
            "func": "err",
            "text": "Unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${qsJDgalAWJWr})).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "qsJDgalAWJWr"
              }
            }
          },
          {
            "opcode": "replace",
            "func": "err",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${gKLDfNbOBrcO})).replace(\"\"+(${kFlvjCqvfTCu}), \"\"+(${uDzmTlSTXgnL}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "gKLDfNbOBrcO"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "uDzmTlSTXgnL"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "kFlvjCqvfTCu"
              }
            },
            "hideFromPalette": true
          },
          "---",
          {
            "opcode": "split",
            "func": "err",
            "text": "split [A] by [B] (stringify)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify((\"\"+(${ssPphKidhYrq})).split(\"\"+(${lTRsRKTEddUW})))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "ssPphKidhYrq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "lTRsRKTEddUW"
              }
            }
          },
          {
            "opcode": "splitarray",
            "func": "err",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${gjqImXXfJqvC})).split(\"\"+(${tzIKNnpJYPrf}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "gjqImXXfJqvC"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "tzIKNnpJYPrf"
              }
            }
          },
          {
            "opcode": "length",
            "func": "err",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${vDOiXJlGjNIo}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "vDOiXJlGjNIo"
              }
            }
          },
          {
            "opcode": "item",
            "func": "err",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${DJUPrPOAYvLq})).split(\"\"+(${TKnOlXkiFNuc}))[${SwlrMVjqrobP}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "DJUPrPOAYvLq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "TKnOlXkiFNuc"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "gen_id": "SwlrMVjqrobP"
              }
            }
          },
          {
            "opcode": "jsondelete",
            "func": "err",
            "text": "Delete Item [B] of [A]",
            "code": "delete ${HUwWDKBKgKUr}[${clCLnuGwKwtz}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "HUwWDKBKgKUr"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "clCLnuGwKwtz"
              }
            }
          },
          {
            "opcode": "jsonset",
            "func": "err",
            "text": "Set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${xTmhWgLyxmFS}[${rCbkIQCxYHDu}] = ${bCjCAOsDOrec}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "xTmhWgLyxmFS"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "rCbkIQCxYHDu"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "bCjCAOsDOrec"
              }
            }
          },
          {
            "opcode": "squarebrackets",
            "func": "err",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${kbneuKzwQHdl})[${psdKSCUGuwsT}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "kbneuKzwQHdl"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "psdKSCUGuwsT"
              }
            }
          },
          {
            "opcode": "jsonparse",
            "func": "err",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${xZOIdhuUPlmq})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "xZOIdhuUPlmq"
              }
            }
          },
          {
            "opcode": "jsonstringify",
            "func": "err",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${dmdDosYXFZII})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "gen_id": "dmdDosYXFZII"
              }
            }
          },
          "---",
          {
            "opcode": "patchreporter",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${AfVfUEYCQVIu}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "AfVfUEYCQVIu"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${fbnRfPoDEAUn}${oyaRHqPgFXAU}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "fbnRfPoDEAUn"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "oyaRHqPgFXAU"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${xKAQPGPjYnaJ}${seLoSPEYQMrA}${GPKUseXGhwJZ}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "xKAQPGPjYnaJ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "seLoSPEYQMrA"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "GPKUseXGhwJZ"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchboolean",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${nKqEHbcgJiUT}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "nKqEHbcgJiUT"
              }
            }
          },
          {
            "opcode": "patchcommand",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${fyjqpeJbVGer}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "fyjqpeJbVGer"
              }
            }
          },
          {
            "opcode": "patchcommand2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${OIFYGnzVJWYH}${lddiHdftUTCJ}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "OIFYGnzVJWYH"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "lddiHdftUTCJ"
              }
            }
          },
          {
            "opcode": "patchcommand3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${AhXXSwuTwvkJ}${HlRNNCeZdEfx}${VKVoFLQdoFhv}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "AhXXSwuTwvkJ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "HlRNNCeZdEfx"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "gen_id": "VKVoFLQdoFhv"
              }
            }
          },
          "---",
          {
            "opcode": "true",
            "func": "err",
            "text": "true",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": true,
            "returns": "BOOLEAN",
            "disableMonitor": true
          },
          {
            "opcode": "false",
            "func": "err",
            "text": "false",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": false,
            "returns": "BOOLEAN",
            "disableMonitor": true
          },
          {
            "opcode": "performancenow",
            "func": "err",
            "text": "performance.now()",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "performance.now()",
            "returns": "NUMBER",
            "disableMonitor": true
          },
          {
            "opcode": "stagewidth",
            "func": "err",
            "text": "Stage Width",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Scratch.vm.runtime.stageWidth",
            "returns": "NUMBER",
            "disableMonitor": true
          },
          {
            "opcode": "stageheight",
            "func": "err",
            "text": "Stage Height",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Scratch.vm.runtime.stageHeight",
            "returns": "NUMBER",
            "disableMonitor": true
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

  const PATCHES_ID = 'mistsutils_patches';
  const cst_patch = (obj, functions) => {
    if (obj[PATCHES_ID]) return;
    obj[PATCHES_ID] = {};
    for (const name in functions) {
      const original = obj[name];
      obj[PATCHES_ID][name] = obj[name];
      if (original) {
        obj[name] = function(...args) {
          const callOriginal = (...args) => original.call(this, ...args);
          return functions[name].call(this, callOriginal, ...args);
        };
      } else {
        obj[name] = function(...args) {
          return functions[name].call(this, () => {}, ...args);
        };
      }
    }
  };

  const fakesanitize = (string) => {
    return string;
  };

  cst_patch(JSGP, {
    descendStackedBlock(fn, node, ...args) {
      const block = node.block;
      switch (node.kind) {
        case 'mistsutils.notequals':
          const BpbrqUadncSy = this.descendInput(node?.A).asString();
          const xcJUGikkSlhs = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((""+(${BpbrqUadncSy})) !== (""+(${xcJUGikkSlhs}))));\n`;
          return;
        case 'mistsutils.equals':
          const rOhBYXGkYYZi = this.descendInput(node?.A).asString();
          const FDNcFkQvRvST = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((""+(${rOhBYXGkYYZi})) === (""+(${FDNcFkQvRvST}))));\n`;
          return;
        case 'mistsutils.compare':
          const EasMoVMZuWbC = this.descendInput(node?.A).asNumber();
          const VfTHvBWhpNzv = this.descendInput(node?.B).asNumber();
          const FvhIzHDUYWlJ = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((""+(${EasMoVMZuWbC})) ${FvhIzHDUYWlJ} (""+(${VfTHvBWhpNzv}))));\n`;
          return;
        case 'mistsutils.power':
          const SKtyeIvYqBie = this.descendInput(node?.A).asNumber();
          const FLIRwgigBdKD = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${SKtyeIvYqBie}, ${FLIRwgigBdKD}));\n`;
          return;

        case 'mistsutils.clamp':
          const vpeNcXWAQBdZ = this.descendInput(node?.A).asNumber();
          const HGJiQJKbROdG = this.descendInput(node?.B).asNumber();
          const gajGxFxIpmiD = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${vpeNcXWAQBdZ}, ${HGJiQJKbROdG}), ${gajGxFxIpmiD}));\n`;
          return;
        case 'mistsutils.letters':
          const OxsPKlpQtwXG = this.descendInput(node?.A).asNumber();
          const NXLeXSrdmKUr = this.descendInput(node?.B).asNumber();
          const yykUNXZktdgC = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${yykUNXZktdgC})).substring(${OxsPKlpQtwXG}, ${NXLeXSrdmKUr}));\n`;
          return;

        case 'mistsutils.starts':
          const VMAkcAxsfzce = this.descendInput(node?.A).asString();
          const uNYaQAusrgxm = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${VMAkcAxsfzce})).startsWith(""+(${uNYaQAusrgxm})));\n`;
          return;
        case 'mistsutils.ends':
          const cDFqATRWeWeV = this.descendInput(node?.A).asString();
          const EErWYavLDaLF = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${cDFqATRWeWeV})).endsWith(""+(${EErWYavLDaLF})));\n`;
          return;
        case 'mistsutils.toUnicode':
          const qsJDgalAWJWr = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${qsJDgalAWJWr})).charCodeAt(0));\n`;
          return;
        case 'mistsutils.replace':
          const gKLDfNbOBrcO = this.descendInput(node?.A).asString();
          const uDzmTlSTXgnL = this.descendInput(node?.B).asString();
          const kFlvjCqvfTCu = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${gKLDfNbOBrcO})).replace(""+(${kFlvjCqvfTCu}), ""+(${uDzmTlSTXgnL})));\n`;
          return;

        case 'mistsutils.split':
          const ssPphKidhYrq = this.descendInput(node?.A).asString();
          const lTRsRKTEddUW = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((""+(${ssPphKidhYrq})).split(""+(${lTRsRKTEddUW}))));\n`;
          return;
        case 'mistsutils.splitarray':
          const gjqImXXfJqvC = this.descendInput(node?.A).asString();
          const tzIKNnpJYPrf = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${gjqImXXfJqvC})).split(""+(${tzIKNnpJYPrf})));\n`;
          return;
        case 'mistsutils.length':
          const vDOiXJlGjNIo = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${vDOiXJlGjNIo}).length));\n`;
          return;
        case 'mistsutils.item':
          const DJUPrPOAYvLq = this.descendInput(node?.A).asString();
          const TKnOlXkiFNuc = this.descendInput(node?.B).asString();
          const SwlrMVjqrobP = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${DJUPrPOAYvLq})).split(""+(${TKnOlXkiFNuc}))[${SwlrMVjqrobP}]);\n`;
          return;
        case 'mistsutils.jsondelete':
          const HUwWDKBKgKUr = this.descendInput(node?.A).asString();
          const clCLnuGwKwtz = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${HUwWDKBKgKUr}[${clCLnuGwKwtz}];\n`;
          return;
        case 'mistsutils.jsonset':
          const xTmhWgLyxmFS = this.descendInput(node?.A).asString();
          const rCbkIQCxYHDu = this.descendInput(node?.B).asString();
          const bCjCAOsDOrec = this.descendInput(node?.C).asString();
          this.source += `\n${xTmhWgLyxmFS}[${rCbkIQCxYHDu}] = ${bCjCAOsDOrec};\n`;
          return;
        case 'mistsutils.squarebrackets':
          const kbneuKzwQHdl = this.descendInput(node?.A).asString();
          const psdKSCUGuwsT = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${kbneuKzwQHdl})[${psdKSCUGuwsT}]);\n`;
          return;
        case 'mistsutils.jsonparse':
          const xZOIdhuUPlmq = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${xZOIdhuUPlmq}));\n`;
          return;
        case 'mistsutils.jsonstringify':
          const dmdDosYXFZII = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${dmdDosYXFZII}));\n`;
          return;

        case 'mistsutils.patchreporter':
          const AfVfUEYCQVIu = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${AfVfUEYCQVIu});\n`;
          return;
        case 'mistsutils.patchreporter2':
          const fbnRfPoDEAUn = this.descendInput(node?.A).asRaw();
          const oyaRHqPgFXAU = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${fbnRfPoDEAUn}${oyaRHqPgFXAU});\n`;
          return;
        case 'mistsutils.patchreporter3':
          const xKAQPGPjYnaJ = this.descendInput(node?.A).asRaw();
          const seLoSPEYQMrA = this.descendInput(node?.B).asRaw();
          const GPKUseXGhwJZ = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${xKAQPGPjYnaJ}${seLoSPEYQMrA}${GPKUseXGhwJZ});\n`;
          return;
        case 'mistsutils.patchboolean':
          const nKqEHbcgJiUT = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${nKqEHbcgJiUT});\n`;
          return;
        case 'mistsutils.patchcommand':
          const fyjqpeJbVGer = this.descendInput(node?.A).asRaw();
          this.source += `\n${fyjqpeJbVGer};\n`;
          return;
        case 'mistsutils.patchcommand2':
          const OIFYGnzVJWYH = this.descendInput(node?.A).asRaw();
          const lddiHdftUTCJ = this.descendInput(node?.B).asRaw();
          this.source += `\n${OIFYGnzVJWYH}${lddiHdftUTCJ};\n`;
          return;
        case 'mistsutils.patchcommand3':
          const AhXXSwuTwvkJ = this.descendInput(node?.A).asRaw();
          const HlRNNCeZdEfx = this.descendInput(node?.B).asRaw();
          const VKVoFLQdoFhv = this.descendInput(node?.C).asRaw();
          this.source += `\n${AhXXSwuTwvkJ}${HlRNNCeZdEfx}${VKVoFLQdoFhv};\n`;
          return;

        case 'mistsutils.true':
          this.source += `\nvm.runtime.visualReport("${block.id}", true);\n`;
          return;
        case 'mistsutils.false':
          this.source += `\nvm.runtime.visualReport("${block.id}", false);\n`;
          return;
        case 'mistsutils.performancenow':
          this.source += `\nvm.runtime.visualReport("${block.id}", performance.now());\n`;
          return;
        case 'mistsutils.stagewidth':
          this.source += `\nvm.runtime.visualReport("${block.id}", Scratch.vm.runtime.stageWidth);\n`;
          return;
        case 'mistsutils.stageheight':
          this.source += `\nvm.runtime.visualReport("${block.id}", Scratch.vm.runtime.stageHeight);\n`;
          return;
        default:
          return fn(node, ...args);
      }
    },

    descendInput(fn, node, ...args) {
      switch (node.kind) {
        case 'mistsutils.notequals':
          const BpbrqUadncSy = this.descendInput(node?.A).asString();
          const xcJUGikkSlhs = this.descendInput(node?.B).asString();
          return new TypedInput(`((""+(${BpbrqUadncSy})) !== (""+(${xcJUGikkSlhs})))`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const rOhBYXGkYYZi = this.descendInput(node?.A).asString();
          const FDNcFkQvRvST = this.descendInput(node?.B).asString();
          return new TypedInput(`((""+(${rOhBYXGkYYZi})) === (""+(${FDNcFkQvRvST})))`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const EasMoVMZuWbC = this.descendInput(node?.A).asNumber();
          const VfTHvBWhpNzv = this.descendInput(node?.B).asNumber();
          const FvhIzHDUYWlJ = this.descendInput(node?.C).asRaw();
          return new TypedInput(`((""+(${EasMoVMZuWbC})) ${FvhIzHDUYWlJ} (""+(${VfTHvBWhpNzv})))`, TYPE_BOOLEAN);
        case 'mistsutils.power':
          const SKtyeIvYqBie = this.descendInput(node?.A).asNumber();
          const FLIRwgigBdKD = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${SKtyeIvYqBie}, ${FLIRwgigBdKD})`, TYPE_NUMBER);

        case 'mistsutils.clamp':
          const vpeNcXWAQBdZ = this.descendInput(node?.A).asNumber();
          const HGJiQJKbROdG = this.descendInput(node?.B).asNumber();
          const gajGxFxIpmiD = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${vpeNcXWAQBdZ}, ${HGJiQJKbROdG}), ${gajGxFxIpmiD})`, TYPE_NUMBER);
        case 'mistsutils.letters':
          const OxsPKlpQtwXG = this.descendInput(node?.A).asNumber();
          const NXLeXSrdmKUr = this.descendInput(node?.B).asNumber();
          const yykUNXZktdgC = this.descendInput(node?.C).asString();
          return new TypedInput(`(""+(${yykUNXZktdgC})).substring(${OxsPKlpQtwXG}, ${NXLeXSrdmKUr})`, TYPE_STRING);

        case 'mistsutils.starts':
          const VMAkcAxsfzce = this.descendInput(node?.A).asString();
          const uNYaQAusrgxm = this.descendInput(node?.B).asString();
          return new TypedInput(`(""+(${VMAkcAxsfzce})).startsWith(""+(${uNYaQAusrgxm}))`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const cDFqATRWeWeV = this.descendInput(node?.A).asString();
          const EErWYavLDaLF = this.descendInput(node?.B).asString();
          return new TypedInput(`(""+(${cDFqATRWeWeV})).endsWith(""+(${EErWYavLDaLF}))`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const qsJDgalAWJWr = this.descendInput(node?.A).asString();
          return new TypedInput(`(""+(${qsJDgalAWJWr})).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const gKLDfNbOBrcO = this.descendInput(node?.A).asString();
          const uDzmTlSTXgnL = this.descendInput(node?.B).asString();
          const kFlvjCqvfTCu = this.descendInput(node?.C).asString();
          return new TypedInput(`(""+(${gKLDfNbOBrcO})).replace(""+(${kFlvjCqvfTCu}), ""+(${uDzmTlSTXgnL}))`, TYPE_STRING);

        case 'mistsutils.split':
          const ssPphKidhYrq = this.descendInput(node?.A).asString();
          const lTRsRKTEddUW = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((""+(${ssPphKidhYrq})).split(""+(${lTRsRKTEddUW})))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const gjqImXXfJqvC = this.descendInput(node?.A).asString();
          const tzIKNnpJYPrf = this.descendInput(node?.B).asString();
          return new TypedInput(`(""+(${gjqImXXfJqvC})).split(""+(${tzIKNnpJYPrf}))`, TYPE_STRING);
        case 'mistsutils.length':
          const vDOiXJlGjNIo = this.descendInput(node?.A).asString();
          return new TypedInput(`((${vDOiXJlGjNIo}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const DJUPrPOAYvLq = this.descendInput(node?.A).asString();
          const TKnOlXkiFNuc = this.descendInput(node?.B).asString();
          const SwlrMVjqrobP = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(""+(${DJUPrPOAYvLq})).split(""+(${TKnOlXkiFNuc}))[${SwlrMVjqrobP}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const HUwWDKBKgKUr = this.descendInput(node?.A).asString();
          const clCLnuGwKwtz = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${HUwWDKBKgKUr}[${clCLnuGwKwtz}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const xTmhWgLyxmFS = this.descendInput(node?.A).asString();
          const rCbkIQCxYHDu = this.descendInput(node?.B).asString();
          const bCjCAOsDOrec = this.descendInput(node?.C).asString();
          return new TypedInput(`${xTmhWgLyxmFS}[${rCbkIQCxYHDu}] = ${bCjCAOsDOrec}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const kbneuKzwQHdl = this.descendInput(node?.A).asString();
          const psdKSCUGuwsT = this.descendInput(node?.B).asString();
          return new TypedInput(`(${kbneuKzwQHdl})[${psdKSCUGuwsT}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const xZOIdhuUPlmq = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${xZOIdhuUPlmq})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const dmdDosYXFZII = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${dmdDosYXFZII})`, TYPE_STRING);

        case 'mistsutils.patchreporter':
          const AfVfUEYCQVIu = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${AfVfUEYCQVIu}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const fbnRfPoDEAUn = this.descendInput(node?.A).asRaw();
          const oyaRHqPgFXAU = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${fbnRfPoDEAUn}${oyaRHqPgFXAU}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const xKAQPGPjYnaJ = this.descendInput(node?.A).asRaw();
          const seLoSPEYQMrA = this.descendInput(node?.B).asRaw();
          const GPKUseXGhwJZ = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${xKAQPGPjYnaJ}${seLoSPEYQMrA}${GPKUseXGhwJZ}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const nKqEHbcgJiUT = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${nKqEHbcgJiUT}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const fyjqpeJbVGer = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${fyjqpeJbVGer}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const OIFYGnzVJWYH = this.descendInput(node?.A).asRaw();
          const lddiHdftUTCJ = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${OIFYGnzVJWYH}${lddiHdftUTCJ}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const AhXXSwuTwvkJ = this.descendInput(node?.A).asRaw();
          const HlRNNCeZdEfx = this.descendInput(node?.B).asRaw();
          const VKVoFLQdoFhv = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${AhXXSwuTwvkJ}${HlRNNCeZdEfx}${VKVoFLQdoFhv}`, TYPE_UNKNOWN);

        case 'mistsutils.true':
          return new TypedInput(`true`, TYPE_BOOLEAN);
        case 'mistsutils.false':
          return new TypedInput(`false`, TYPE_BOOLEAN);
        case 'mistsutils.performancenow':
          return new TypedInput(`performance.now()`, TYPE_NUMBER);
        case 'mistsutils.stagewidth':
          return new TypedInput(`Scratch.vm.runtime.stageWidth`, TYPE_NUMBER);
        case 'mistsutils.stageheight':
          return new TypedInput(`Scratch.vm.runtime.stageHeight`, TYPE_NUMBER);
        default:
          return fn(node, ...args);
      }
    },
  });

  cst_patch(STGP, {
    descendStackedBlock(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistsutils_notequals':
          return {
            block, kind: 'mistsutils.notequals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_equals':
          return {
            block, kind: 'mistsutils.equals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_compare':
          return {
            block, kind: 'mistsutils.compare',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_power':
          return {
            block, kind: 'mistsutils.power',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };

        case 'mistsutils_clamp':
          return {
            block, kind: 'mistsutils.clamp',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_letters':
          return {
            block, kind: 'mistsutils.letters',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistsutils_starts':
          return {
            block, kind: 'mistsutils.starts',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_ends':
          return {
            block, kind: 'mistsutils.ends',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_toUnicode':
          return {
            block, kind: 'mistsutils.toUnicode',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_replace':
          return {
            block, kind: 'mistsutils.replace',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistsutils_split':
          return {
            block, kind: 'mistsutils.split',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_splitarray':
          return {
            block, kind: 'mistsutils.splitarray',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_length':
          return {
            block, kind: 'mistsutils.length',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_item':
          return {
            block, kind: 'mistsutils.item',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_jsondelete':
          return {
            block, kind: 'mistsutils.jsondelete',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_jsonset':
          return {
            block, kind: 'mistsutils.jsonset',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_squarebrackets':
          return {
            block, kind: 'mistsutils.squarebrackets',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_jsonparse':
          return {
            block, kind: 'mistsutils.jsonparse',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_jsonstringify':
          return {
            block, kind: 'mistsutils.jsonstringify',
              A: this.descendInputOfBlock(block, 'A'),
          };

        case 'mistsutils_patchreporter':
          return {
            block, kind: 'mistsutils.patchreporter',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchreporter2':
          return {
            block, kind: 'mistsutils.patchreporter2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchreporter3':
          return {
            block, kind: 'mistsutils.patchreporter3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_patchboolean':
          return {
            block, kind: 'mistsutils.patchboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand':
          return {
            block, kind: 'mistsutils.patchcommand',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand2':
          return {
            block, kind: 'mistsutils.patchcommand2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchcommand3':
          return {
            block, kind: 'mistsutils.patchcommand3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistsutils_true':
          return {
            block, kind: 'mistsutils.true',
          };
        case 'mistsutils_false':
          return {
            block, kind: 'mistsutils.false',
          };
        case 'mistsutils_performancenow':
          return {
            block, kind: 'mistsutils.performancenow',
          };
        case 'mistsutils_stagewidth':
          return {
            block, kind: 'mistsutils.stagewidth',
          };
        case 'mistsutils_stageheight':
          return {
            block, kind: 'mistsutils.stageheight',
          };
        default:
          return fn(block, ...args);
      }
    },

    descendInput(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistsutils_notequals':
          return {
            block,
            kind: 'mistsutils.notequals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_equals':
          return {
            block,
            kind: 'mistsutils.equals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_compare':
          return {
            block,
            kind: 'mistsutils.compare',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_power':
          return {
            block,
            kind: 'mistsutils.power',
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
        case 'mistsutils_replace':
          return {
            block,
            kind: 'mistsutils.replace',
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
        case 'mistsutils_splitarray':
          return {
            block,
            kind: 'mistsutils.splitarray',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_length':
          return {
            block,
            kind: 'mistsutils.length',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_item':
          return {
            block,
            kind: 'mistsutils.item',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_jsondelete':
          return {
            block,
            kind: 'mistsutils.jsondelete',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_jsonset':
          return {
            block,
            kind: 'mistsutils.jsonset',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_squarebrackets':
          return {
            block,
            kind: 'mistsutils.squarebrackets',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_jsonparse':
          return {
            block,
            kind: 'mistsutils.jsonparse',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_jsonstringify':
          return {
            block,
            kind: 'mistsutils.jsonstringify',
              A: this.descendInputOfBlock(block, 'A'),
          };

        case 'mistsutils_patchreporter':
          return {
            block,
            kind: 'mistsutils.patchreporter',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchreporter2':
          return {
            block,
            kind: 'mistsutils.patchreporter2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchreporter3':
          return {
            block,
            kind: 'mistsutils.patchreporter3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_patchboolean':
          return {
            block,
            kind: 'mistsutils.patchboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand':
          return {
            block,
            kind: 'mistsutils.patchcommand',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand2':
          return {
            block,
            kind: 'mistsutils.patchcommand2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchcommand3':
          return {
            block,
            kind: 'mistsutils.patchcommand3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistsutils_true':
          return {
            block,
            kind: 'mistsutils.true',
          };
        case 'mistsutils_false':
          return {
            block,
            kind: 'mistsutils.false',
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
        default:
          return fn(block, ...args);
      }
    },
  });

  Scratch.extensions.register(new mistsutils());
})(Scratch);
