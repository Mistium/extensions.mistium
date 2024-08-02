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
            "code": "((\"\"+(${VoBKsoJTGLHC})) !== (\"\"+(${lcMFPyFkALcI})))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "VoBKsoJTGLHC"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "lcMFPyFkALcI"
              }
            }
          },
          {
            "opcode": "equals",
            "func": "err",
            "text": "[A] === [B]",
            "code": "((\"\"+(${ypytryIebucd})) === (\"\"+(${zPtHurUdQGEe})))",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ypytryIebucd"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "zPtHurUdQGEe"
              }
            }
          },
          {
            "opcode": "compare",
            "func": "err",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(\"\"+(${fNBwTtePwCUM})) ${RraYzPVSbOLW} (\"\"+(${NfPkEnUBoBQj}))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "fNBwTtePwCUM"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "RraYzPVSbOLW"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "<",
                "gen_id": "NfPkEnUBoBQj"
              }
            }
          },
          {
            "opcode": "power",
            "func": "err",
            "text": "[A] ^ [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.pow(${NPOhgNgtpQLf}, ${SHZYPMTGKYyI})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "NPOhgNgtpQLf"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "SHZYPMTGKYyI"
              }
            }
          },
          "---",
          {
            "opcode": "clamp",
            "func": "err",
            "text": "clamp [A] between [B] and [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(Math.max(${phpHfstPNceD}, ${vDxIBGDSiggr}), ${MBwvjyXdHpFb})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "phpHfstPNceD"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "vDxIBGDSiggr"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "MBwvjyXdHpFb"
              }
            }
          },
          {
            "opcode": "letters",
            "func": "err",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${dxGRLhKjZkrs})).substring(${ipcRpVqdsSBO}, ${kmKJQBuugKEM})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "ipcRpVqdsSBO"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "kmKJQBuugKEM"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "dxGRLhKjZkrs"
              }
            }
          },
          "---",
          {
            "opcode": "starts",
            "func": "err",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(\"\"+(${GUVhpksGtimw})).startsWith(\"\"+(${KjImirYQBsQf}))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "GUVhpksGtimw"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "KjImirYQBsQf"
              }
            }
          },
          {
            "opcode": "ends",
            "func": "err",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(\"\"+(${SQzLVHXMSzNZ})).endsWith(\"\"+(${fQJrBOnLphng}))",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "SQzLVHXMSzNZ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "fQJrBOnLphng"
              }
            }
          },
          {
            "opcode": "toUnicode",
            "func": "err",
            "text": "Unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${TjrnfywWZnJy})).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "TjrnfywWZnJy"
              }
            }
          },
          {
            "opcode": "replace",
            "func": "err",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${NydQVJutnCTA})).replace(\"\"+(${lnaNGdRQJenf}), \"\"+(${BYXpKIGdQGAL}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "NydQVJutnCTA"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "BYXpKIGdQGAL"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "lnaNGdRQJenf"
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
            "code": "JSON.stringify((\"\"+(${ILVPVcerFKMA})).split(\"\"+(${JuWwedzHFfxG})))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ILVPVcerFKMA"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "JuWwedzHFfxG"
              }
            }
          },
          {
            "opcode": "splitarray",
            "func": "err",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${DacigUXbWAhV})).split(\"\"+(${CROHFMbOdLad}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "DacigUXbWAhV"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "CROHFMbOdLad"
              }
            }
          },
          {
            "opcode": "length",
            "func": "err",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${tqXxLzFYDlMW}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "tqXxLzFYDlMW"
              }
            }
          },
          {
            "opcode": "item",
            "func": "err",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(\"\"+(${fMqULEznRRFq})).split(\"\"+(${JSoPMXJnxbrn}))[${ymKLMdsgyxIc}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "fMqULEznRRFq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "JSoPMXJnxbrn"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "ymKLMdsgyxIc"
              }
            }
          },
          {
            "opcode": "jsondelete",
            "func": "err",
            "text": "Delete Item [B] of [A]",
            "code": "delete ${vZVdnpRcqZOr}[${FBuvJdKIBbit}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "vZVdnpRcqZOr"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "FBuvJdKIBbit"
              }
            }
          },
          {
            "opcode": "jsonset",
            "func": "err",
            "text": "Set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${lkBdviDJEEtE}[${sGVYsFZXWdVR}] = ${PFMUJzVnSVRR}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "lkBdviDJEEtE"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "sGVYsFZXWdVR"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "PFMUJzVnSVRR"
              }
            }
          },
          {
            "opcode": "squarebrackets",
            "func": "err",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${EjjIWIjRbtAh})[${qqCsKemLxZCA}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "EjjIWIjRbtAh"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "qqCsKemLxZCA"
              }
            }
          },
          {
            "opcode": "jsonparse",
            "func": "err",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${XbemjimGJQSv})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "XbemjimGJQSv"
              }
            }
          },
          {
            "opcode": "jsonstringify",
            "func": "err",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${TIqNwyKUWKGD})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "TIqNwyKUWKGD"
              }
            }
          },
          "---",
          {
            "opcode": "patchreporter",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${JcdULlsAictO}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "JcdULlsAictO"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${QYbwsysCwZOT}${kFINerOvjJmI}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "QYbwsysCwZOT"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "kFINerOvjJmI"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${DgGgWgUHcaft}${GyTyypwBnnUP}${ExqoVMmmuTXI}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "DgGgWgUHcaft"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "GyTyypwBnnUP"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "ExqoVMmmuTXI"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchboolean",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${OgyxIvKJcDhM}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "OgyxIvKJcDhM"
              }
            }
          },
          {
            "opcode": "patchcommand",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${KUkcjAyPofoN}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "KUkcjAyPofoN"
              }
            }
          },
          {
            "opcode": "patchcommand2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${imPSszgRbDhH}${NGnSxKTrxsBr}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "imPSszgRbDhH"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "NGnSxKTrxsBr"
              }
            }
          },
          {
            "opcode": "patchcommand3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${xzOhkHFUEAqX}${IcMPyRMvaiYs}${gfFuSoLHIHML}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "xzOhkHFUEAqX"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "IcMPyRMvaiYs"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "gfFuSoLHIHML"
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
          const VoBKsoJTGLHC = this.descendInput(node?.A).asString();
          const lcMFPyFkALcI = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((""+(${VoBKsoJTGLHC})) !== (""+(${lcMFPyFkALcI}))));\n`;
          return;
        case 'mistsutils.equals':
          const ypytryIebucd = this.descendInput(node?.A).asString();
          const zPtHurUdQGEe = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((""+(${ypytryIebucd})) === (""+(${zPtHurUdQGEe}))));\n`;
          return;
        case 'mistsutils.compare':
          const fNBwTtePwCUM = this.descendInput(node?.A).asNumber();
          const RraYzPVSbOLW = this.descendInput(node?.B).asNumber();
          const NfPkEnUBoBQj = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${fNBwTtePwCUM})) ${RraYzPVSbOLW} (""+(${NfPkEnUBoBQj})));\n`;
          return;
        case 'mistsutils.power':
          const NPOhgNgtpQLf = this.descendInput(node?.A).asNumber();
          const SHZYPMTGKYyI = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${NPOhgNgtpQLf}, ${SHZYPMTGKYyI}));\n`;
          return;

        case 'mistsutils.clamp':
          const phpHfstPNceD = this.descendInput(node?.A).asNumber();
          const vDxIBGDSiggr = this.descendInput(node?.B).asNumber();
          const MBwvjyXdHpFb = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${phpHfstPNceD}, ${vDxIBGDSiggr}), ${MBwvjyXdHpFb}));\n`;
          return;
        case 'mistsutils.letters':
          const ipcRpVqdsSBO = this.descendInput(node?.A).asNumber();
          const kmKJQBuugKEM = this.descendInput(node?.B).asNumber();
          const dxGRLhKjZkrs = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${dxGRLhKjZkrs})).substring(${ipcRpVqdsSBO}, ${kmKJQBuugKEM}));\n`;
          return;

        case 'mistsutils.starts':
          const GUVhpksGtimw = this.descendInput(node?.A).asString();
          const KjImirYQBsQf = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${GUVhpksGtimw})).startsWith(""+(${KjImirYQBsQf})));\n`;
          return;
        case 'mistsutils.ends':
          const SQzLVHXMSzNZ = this.descendInput(node?.A).asString();
          const fQJrBOnLphng = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${SQzLVHXMSzNZ})).endsWith(""+(${fQJrBOnLphng})));\n`;
          return;
        case 'mistsutils.toUnicode':
          const TjrnfywWZnJy = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${TjrnfywWZnJy})).charCodeAt(0));\n`;
          return;
        case 'mistsutils.replace':
          const NydQVJutnCTA = this.descendInput(node?.A).asString();
          const BYXpKIGdQGAL = this.descendInput(node?.B).asString();
          const lnaNGdRQJenf = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${NydQVJutnCTA})).replace(""+(${lnaNGdRQJenf}), ""+(${BYXpKIGdQGAL})));\n`;
          return;

        case 'mistsutils.split':
          const ILVPVcerFKMA = this.descendInput(node?.A).asString();
          const JuWwedzHFfxG = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((""+(${ILVPVcerFKMA})).split(""+(${JuWwedzHFfxG}))));\n`;
          return;
        case 'mistsutils.splitarray':
          const DacigUXbWAhV = this.descendInput(node?.A).asString();
          const CROHFMbOdLad = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${DacigUXbWAhV})).split(""+(${CROHFMbOdLad})));\n`;
          return;
        case 'mistsutils.length':
          const tqXxLzFYDlMW = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${tqXxLzFYDlMW}).length));\n`;
          return;
        case 'mistsutils.item':
          const fMqULEznRRFq = this.descendInput(node?.A).asString();
          const JSoPMXJnxbrn = this.descendInput(node?.B).asString();
          const ymKLMdsgyxIc = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (""+(${fMqULEznRRFq})).split(""+(${JSoPMXJnxbrn}))[${ymKLMdsgyxIc}]);\n`;
          return;
        case 'mistsutils.jsondelete':
          const vZVdnpRcqZOr = this.descendInput(node?.A).asString();
          const FBuvJdKIBbit = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${vZVdnpRcqZOr}[${FBuvJdKIBbit}];\n`;
          return;
        case 'mistsutils.jsonset':
          const lkBdviDJEEtE = this.descendInput(node?.A).asString();
          const sGVYsFZXWdVR = this.descendInput(node?.B).asString();
          const PFMUJzVnSVRR = this.descendInput(node?.C).asString();
          this.source += `\n${lkBdviDJEEtE}[${sGVYsFZXWdVR}] = ${PFMUJzVnSVRR};\n`;
          return;
        case 'mistsutils.squarebrackets':
          const EjjIWIjRbtAh = this.descendInput(node?.A).asString();
          const qqCsKemLxZCA = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${EjjIWIjRbtAh})[${qqCsKemLxZCA}]);\n`;
          return;
        case 'mistsutils.jsonparse':
          const XbemjimGJQSv = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${XbemjimGJQSv}));\n`;
          return;
        case 'mistsutils.jsonstringify':
          const TIqNwyKUWKGD = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${TIqNwyKUWKGD}));\n`;
          return;

        case 'mistsutils.patchreporter':
          const JcdULlsAictO = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${JcdULlsAictO});\n`;
          return;
        case 'mistsutils.patchreporter2':
          const QYbwsysCwZOT = this.descendInput(node?.A).asRaw();
          const kFINerOvjJmI = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${QYbwsysCwZOT}${kFINerOvjJmI});\n`;
          return;
        case 'mistsutils.patchreporter3':
          const DgGgWgUHcaft = this.descendInput(node?.A).asRaw();
          const GyTyypwBnnUP = this.descendInput(node?.B).asRaw();
          const ExqoVMmmuTXI = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${DgGgWgUHcaft}${GyTyypwBnnUP}${ExqoVMmmuTXI});\n`;
          return;
        case 'mistsutils.patchboolean':
          const OgyxIvKJcDhM = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${OgyxIvKJcDhM});\n`;
          return;
        case 'mistsutils.patchcommand':
          const KUkcjAyPofoN = this.descendInput(node?.A).asRaw();
          this.source += `\n${KUkcjAyPofoN};\n`;
          return;
        case 'mistsutils.patchcommand2':
          const imPSszgRbDhH = this.descendInput(node?.A).asRaw();
          const NGnSxKTrxsBr = this.descendInput(node?.B).asRaw();
          this.source += `\n${imPSszgRbDhH}${NGnSxKTrxsBr};\n`;
          return;
        case 'mistsutils.patchcommand3':
          const xzOhkHFUEAqX = this.descendInput(node?.A).asRaw();
          const IcMPyRMvaiYs = this.descendInput(node?.B).asRaw();
          const gfFuSoLHIHML = this.descendInput(node?.C).asRaw();
          this.source += `\n${xzOhkHFUEAqX}${IcMPyRMvaiYs}${gfFuSoLHIHML};\n`;
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
          const VoBKsoJTGLHC = this.descendInput(node?.A).asString();
          const lcMFPyFkALcI = this.descendInput(node?.B).asString();
          return new TypedInput(`((""+(${VoBKsoJTGLHC})) !== (""+(${lcMFPyFkALcI})))`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const ypytryIebucd = this.descendInput(node?.A).asString();
          const zPtHurUdQGEe = this.descendInput(node?.B).asString();
          return new TypedInput(`((""+(${ypytryIebucd})) === (""+(${zPtHurUdQGEe})))`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const fNBwTtePwCUM = this.descendInput(node?.A).asNumber();
          const RraYzPVSbOLW = this.descendInput(node?.B).asNumber();
          const NfPkEnUBoBQj = this.descendInput(node?.C).asString();
          return new TypedInput(`(""+(${fNBwTtePwCUM})) ${RraYzPVSbOLW} (""+(${NfPkEnUBoBQj}))`, TYPE_BOOLEAN);
        case 'mistsutils.power':
          const NPOhgNgtpQLf = this.descendInput(node?.A).asNumber();
          const SHZYPMTGKYyI = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${NPOhgNgtpQLf}, ${SHZYPMTGKYyI})`, TYPE_NUMBER);

        case 'mistsutils.clamp':
          const phpHfstPNceD = this.descendInput(node?.A).asNumber();
          const vDxIBGDSiggr = this.descendInput(node?.B).asNumber();
          const MBwvjyXdHpFb = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${phpHfstPNceD}, ${vDxIBGDSiggr}), ${MBwvjyXdHpFb})`, TYPE_NUMBER);
        case 'mistsutils.letters':
          const ipcRpVqdsSBO = this.descendInput(node?.A).asNumber();
          const kmKJQBuugKEM = this.descendInput(node?.B).asNumber();
          const dxGRLhKjZkrs = this.descendInput(node?.C).asString();
          return new TypedInput(`(""+(${dxGRLhKjZkrs})).substring(${ipcRpVqdsSBO}, ${kmKJQBuugKEM})`, TYPE_STRING);

        case 'mistsutils.starts':
          const GUVhpksGtimw = this.descendInput(node?.A).asString();
          const KjImirYQBsQf = this.descendInput(node?.B).asString();
          return new TypedInput(`(""+(${GUVhpksGtimw})).startsWith(""+(${KjImirYQBsQf}))`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const SQzLVHXMSzNZ = this.descendInput(node?.A).asString();
          const fQJrBOnLphng = this.descendInput(node?.B).asString();
          return new TypedInput(`(""+(${SQzLVHXMSzNZ})).endsWith(""+(${fQJrBOnLphng}))`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const TjrnfywWZnJy = this.descendInput(node?.A).asString();
          return new TypedInput(`(""+(${TjrnfywWZnJy})).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const NydQVJutnCTA = this.descendInput(node?.A).asString();
          const BYXpKIGdQGAL = this.descendInput(node?.B).asString();
          const lnaNGdRQJenf = this.descendInput(node?.C).asString();
          return new TypedInput(`(""+(${NydQVJutnCTA})).replace(""+(${lnaNGdRQJenf}), ""+(${BYXpKIGdQGAL}))`, TYPE_STRING);

        case 'mistsutils.split':
          const ILVPVcerFKMA = this.descendInput(node?.A).asString();
          const JuWwedzHFfxG = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((""+(${ILVPVcerFKMA})).split(""+(${JuWwedzHFfxG})))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const DacigUXbWAhV = this.descendInput(node?.A).asString();
          const CROHFMbOdLad = this.descendInput(node?.B).asString();
          return new TypedInput(`(""+(${DacigUXbWAhV})).split(""+(${CROHFMbOdLad}))`, TYPE_STRING);
        case 'mistsutils.length':
          const tqXxLzFYDlMW = this.descendInput(node?.A).asString();
          return new TypedInput(`((${tqXxLzFYDlMW}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const fMqULEznRRFq = this.descendInput(node?.A).asString();
          const JSoPMXJnxbrn = this.descendInput(node?.B).asString();
          const ymKLMdsgyxIc = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(""+(${fMqULEznRRFq})).split(""+(${JSoPMXJnxbrn}))[${ymKLMdsgyxIc}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const vZVdnpRcqZOr = this.descendInput(node?.A).asString();
          const FBuvJdKIBbit = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${vZVdnpRcqZOr}[${FBuvJdKIBbit}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const lkBdviDJEEtE = this.descendInput(node?.A).asString();
          const sGVYsFZXWdVR = this.descendInput(node?.B).asString();
          const PFMUJzVnSVRR = this.descendInput(node?.C).asString();
          return new TypedInput(`${lkBdviDJEEtE}[${sGVYsFZXWdVR}] = ${PFMUJzVnSVRR}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const EjjIWIjRbtAh = this.descendInput(node?.A).asString();
          const qqCsKemLxZCA = this.descendInput(node?.B).asString();
          return new TypedInput(`(${EjjIWIjRbtAh})[${qqCsKemLxZCA}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const XbemjimGJQSv = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${XbemjimGJQSv})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const TIqNwyKUWKGD = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${TIqNwyKUWKGD})`, TYPE_STRING);

        case 'mistsutils.patchreporter':
          const JcdULlsAictO = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${JcdULlsAictO}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const QYbwsysCwZOT = this.descendInput(node?.A).asRaw();
          const kFINerOvjJmI = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${QYbwsysCwZOT}${kFINerOvjJmI}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const DgGgWgUHcaft = this.descendInput(node?.A).asRaw();
          const GyTyypwBnnUP = this.descendInput(node?.B).asRaw();
          const ExqoVMmmuTXI = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${DgGgWgUHcaft}${GyTyypwBnnUP}${ExqoVMmmuTXI}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const OgyxIvKJcDhM = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${OgyxIvKJcDhM}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const KUkcjAyPofoN = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${KUkcjAyPofoN}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const imPSszgRbDhH = this.descendInput(node?.A).asRaw();
          const NGnSxKTrxsBr = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${imPSszgRbDhH}${NGnSxKTrxsBr}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const xzOhkHFUEAqX = this.descendInput(node?.A).asRaw();
          const IcMPyRMvaiYs = this.descendInput(node?.B).asRaw();
          const gfFuSoLHIHML = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${xzOhkHFUEAqX}${IcMPyRMvaiYs}${gfFuSoLHIHML}`, TYPE_UNKNOWN);

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
