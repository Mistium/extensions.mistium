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

    constructor() {
      console.log("Loaded Mist's utils! (v5.2)");
      this.newUpdate = false;
      this.openSite = function() {
        Scratch.openWindow("https://extensions.mistium.com");
      }
      if (typeof window.scaffolding !== "object") {
        // fetch the extension from github
        // compare it to the current file
        fetch("https://raw.githubusercontent.com/Mistium/extensions.mistium/main/featured/Mist's%20Utils.js")
          .then((res) => res.text())
          .then((text) => {
            if (!text.includes("version: 5.2,")) {
              this.newUpdate = true
            }
          })
      };
    }

    getInfo() {
      return {
        id: 'mistsutils',
        name: 'Mists Utils',
        color1: '#2DA4A0',
        version: 5.2,
        blocks: [{
            "blockType": Scratch.BlockType.BUTTON,
            "text": "New Version Available!",
            "func": "openSite",
            "showIf": "this.newUpdate"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Comparisons"
          },
          {
            "opcode": "notequals",
            "text": "[A] !== [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${FAOZEHmHqalF} !== ${agKhyPLxvfXS})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "FAOZEHmHqalF"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "agKhyPLxvfXS"
              }
            },
            "func": "err"
          },
          {
            "opcode": "equals",
            "text": "[A] === [B]",
            "code": "(${VStpIzkkdBKy} === ${FWtTdOHtLbRf})",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "VStpIzkkdBKy"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "FWtTdOHtLbRf"
              }
            },
            "func": "err"
          },
          {
            "opcode": "greaterorequal",
            "text": "[A] >= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${HxaldkVgHGRm} >= ${besMgTSWmtol})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "HxaldkVgHGRm"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "besMgTSWmtol"
              }
            },
            "func": "err"
          },
          {
            "opcode": "lessthanorequal",
            "text": "[A] <= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${ECTDoJwrqwNc} <= ${MPwXtCTVNshu})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "ECTDoJwrqwNc"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "MPwXtCTVNshu"
              }
            },
            "func": "err"
          },
          {
            "opcode": "compare",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${ugfDYbYgexUP} ${UcjYeZEKIZrI} ${jJuiFGaUCQOH})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "ugfDYbYgexUP"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "jJuiFGaUCQOH"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "<",
                "gen_id": "UcjYeZEKIZrI"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Maths"
          },
          {
            "opcode": "power",
            "text": "[A] ^ [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.pow(${BlWWsNAWkFFk}, ${fuhTfIedDmDM})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "BlWWsNAWkFFk"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "fuhTfIedDmDM"
              }
            },
            "func": "err"
          },
          {
            "opcode": "round",
            "text": "round [A] to the nearest [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.round((${kMgebTQyvnlB} / ${LIYbyrRpYWva}) * ${LIYbyrRpYWva})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "kMgebTQyvnlB"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 10,
                "gen_id": "LIYbyrRpYWva"
              }
            },
            "func": "err"
          },
          {
            "func": "err"
          },
          {
            "opcode": "clamp",
            "text": "clamp [A] between [B] and [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(Math.max(${eklxBjzdumta}, ${XQCOVERzEALI}), ${EKFsWLnwZwnH})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "eklxBjzdumta"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "XQCOVERzEALI"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "EKFsWLnwZwnH"
              }
            },
            "func": "err"
          },
          {
            "opcode": "min",
            "text": "min of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(${opvThqpxjVOh}, ${gLVxxFGcmRXq})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "opvThqpxjVOh"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "gLVxxFGcmRXq"
              }
            },
            "func": "err"
          },
          {
            "opcode": "max",
            "text": "max of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.max(${IzGLJPBvQnKl}, ${HKfbZiQtZpwX})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "IzGLJPBvQnKl"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "HKfbZiQtZpwX"
              }
            },
            "func": "err"
          },
          {
            "opcode": "interpolate",
            "text": "smooth [B] to [C] by [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${IZFfPBHytttl} + ((${WQsAToQkKkTQ} - ${IZFfPBHytttl}) / ${AfHaWHRUSkyT})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "AfHaWHRUSkyT"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "IZFfPBHytttl"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "WQsAToQkKkTQ"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Strings"
          },
          {
            "opcode": "?",
            "text": "if [A] then [B] else [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${FuYIOOybVrHc} ? (${sSDCszFNYtNJ} : ${EzUwWMmQfFQg}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.BOOLEAN,
                "defaultValue": false,
                "gen_id": "FuYIOOybVrHc"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "yes",
                "gen_id": "sSDCszFNYtNJ"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "no",
                "gen_id": "EzUwWMmQfFQg"
              }
            },
            "func": "err"
          },
          {
            "opcode": "letters",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${eMFXgNiYxVMI}).substring(${ceILXoRfAPPC}, ${ZfhaankgnDmo})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "ceILXoRfAPPC"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "ZfhaankgnDmo"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "eMFXgNiYxVMI"
              }
            },
            "func": "err"
          },
          {
            "opcode": "starts",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${OYQJVEurjpPV}).startsWith(${FphLQgJqnhvI})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "OYQJVEurjpPV"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "FphLQgJqnhvI"
              }
            },
            "func": "err"
          },
          {
            "opcode": "ends",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${eDrkAhuXDlLR}).endsWith(${IWqVKpgpsARx})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "eDrkAhuXDlLR"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "IWqVKpgpsARx"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toUnicode",
            "text": "Unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${ADXtPZjJusxT}).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "ADXtPZjJusxT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replace",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${ngFwDurcKFck} === \"\" ? ${OhNcXvXOfbVW} : (${OhNcXvXOfbVW}).replace(${ngFwDurcKFck}, ${metgSrRxFbFj}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "OhNcXvXOfbVW"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "metgSrRxFbFj"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "ngFwDurcKFck"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replaceall",
            "text": "replace all [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${tqHQIvQEJxvk} === \"\" ? ${KoeaarGAAmRg} : (${KoeaarGAAmRg}).replaceAll(${tqHQIvQEJxvk}, ${XbDBcMhLNPUp}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "KoeaarGAAmRg"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "XbDBcMhLNPUp"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "tqHQIvQEJxvk"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextAfterString",
            "text": "text after [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${lCZJxBKwbJus}).substring((${lCZJxBKwbJus}).indexOf(\"\"+(${qVqjuUTxtNWb})) + 1, ((${lCZJxBKwbJus}).length)",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "lCZJxBKwbJus"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "qVqjuUTxtNWb"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextBeforeString",
            "text": "text before [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${nmcZrckVCkiU}).split(${oDTAxtVlUVqp}, 1)[0]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "nmcZrckVCkiU"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "oDTAxtVlUVqp"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "JSON"
          },
          {
            "opcode": "split",
            "text": "split [A] by [B] (stringify)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify((${wIQCHRZrtFLI}).split(${fSGLJuUMACox}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "wIQCHRZrtFLI"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "fSGLJuUMACox"
              }
            },
            "func": "err"
          },
          {
            "opcode": "splitarray",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${oeTlTPuZsZJU}).split(${yKiGzQzdtUuY})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "oeTlTPuZsZJU"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "yKiGzQzdtUuY"
              }
            },
            "func": "err"
          },
          {
            "opcode": "length",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${BXmhKhrJTJzw}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "BXmhKhrJTJzw"
              }
            },
            "func": "err"
          },
          {
            "opcode": "item",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${SsyNoQPTncef}).split(${tzjjNuCuKAeZ})[${mPulVFzUkFws}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "SsyNoQPTncef"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "tzjjNuCuKAeZ"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "mPulVFzUkFws"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsondelete",
            "text": "Delete Item [B] of [A]",
            "code": "delete ${mNNbjolbMyVK}[${GJDSfcqSvWgY}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "mNNbjolbMyVK"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "GJDSfcqSvWgY"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonset",
            "text": "Set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${XbQPtKRJcQuc}[${inBFrJqkykBe}] = ${pWdzsJXOXxGX}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "XbQPtKRJcQuc"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "inBFrJqkykBe"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "pWdzsJXOXxGX"
              }
            },
            "func": "err"
          },
          {
            "opcode": "squarebrackets",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${BVcJUOkkXaPq})[${cFyMntOtkiEK}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "BVcJUOkkXaPq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "cFyMntOtkiEK"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonparse",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${aYuKZgDCDRFG})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "aYuKZgDCDRFG"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonstringify",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${uQIKXeFputhy})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "uQIKXeFputhy"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Types"
          },
          {
            "opcode": "isnumber",
            "text": "[A] is a number",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "Number(${DdTRjvZEZxcN}) == ${DdTRjvZEZxcN}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "DdTRjvZEZxcN"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isstring",
            "text": "[A] is a string",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "String(${xmrWBDCrbweU}) == ${xmrWBDCrbweU}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "xmrWBDCrbweU"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isboolean",
            "text": "[A] is a boolean",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${JXAXaTwdtRjl} == \"true\" || ${JXAXaTwdtRjl} == \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "JXAXaTwdtRjl"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tostring",
            "text": "to string [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${uuXylSVILwoD}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "uuXylSVILwoD"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tonumber",
            "text": "to number [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "isNaN(Number(${hOhqiMtKPfze})) ? 0 : Number(${hOhqiMtKPfze})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "hOhqiMtKPfze"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toboolean",
            "text": "to boolean [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${aJrgWjaNzTyB} == \"true\" || ${aJrgWjaNzTyB} == \"1\" || ${aJrgWjaNzTyB} == \"yes\" ? \"true\" : \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "aJrgWjaNzTyB"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Injections"
          },
          {
            "opcode": "patchreporter",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${HKKqqelMaFDt}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "HKKqqelMaFDt"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter2",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${IyYEkVzGwIkq}${AjoMDFsuUIQs}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "IyYEkVzGwIkq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "AjoMDFsuUIQs"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter3",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${OKWgmmISgAqA}${xHHxMStNtgKW}${hSwVubqzXkFB}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "OKWgmmISgAqA"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "xHHxMStNtgKW"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "hSwVubqzXkFB"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchboolean",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${txkZyksAxCKg}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "txkZyksAxCKg"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${MnmHKVReSYLE}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "MnmHKVReSYLE"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand2",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${FVOKmpAVAbwr}${emsRqrzaUcjY}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "FVOKmpAVAbwr"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "emsRqrzaUcjY"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand3",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${tNAvenLRGWQc}${UHrlXQPbCEcr}${NzkhiQPtqoSE}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "tNAvenLRGWQc"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "UHrlXQPbCEcr"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "NzkhiQPtqoSE"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Reporters"
          },
          {
            "opcode": "true",
            "text": "true",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": true,
            "returns": "BOOLEAN",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "false",
            "text": "false",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": false,
            "returns": "BOOLEAN",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "isPackaged",
            "text": "Is Packaged?",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(typeof window.scaffolding === 'object')",
            "returns": "BOOLEAN",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "performancenow",
            "text": "performance.now()",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "performance.now()",
            "returns": "NUMBER",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "stagewidth",
            "text": "Stage Width",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Scratch.vm.runtime.stageWidth",
            "returns": "NUMBER",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "stageheight",
            "text": "Stage Height",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Scratch.vm.runtime.stageHeight",
            "returns": "NUMBER",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "newline",
            "text": "New Line",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "\"\\\\n\"",
            "returns": "STRING",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "pi",
            "text": "π",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.PI",
            "returns": "NUMBER",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "e",
            "text": "e",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.E",
            "returns": "NUMBER",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "infinity",
            "text": "∞",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Infinity",
            "returns": "NUMBER",
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "MaxInt",
            "text": "Max Int",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Number.MAX_SAFE_INTEGER",
            "returns": "NUMBER",
            "disableMonitor": true,
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
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;

        case 'mistsutils.notequals':
          const FAOZEHmHqalF = this.descendInput(node?.A).asString();
          const agKhyPLxvfXS = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${FAOZEHmHqalF} !== ${agKhyPLxvfXS}))\n`;
          return;
        case 'mistsutils.equals':
          const VStpIzkkdBKy = this.descendInput(node?.A).asString();
          const FWtTdOHtLbRf = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${VStpIzkkdBKy} === ${FWtTdOHtLbRf}))\n`;
          return;
        case 'mistsutils.greaterorequal':
          const HxaldkVgHGRm = this.descendInput(node?.A).asNumber();
          const besMgTSWmtol = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${HxaldkVgHGRm} >= ${besMgTSWmtol}))\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const ECTDoJwrqwNc = this.descendInput(node?.A).asNumber();
          const MPwXtCTVNshu = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ECTDoJwrqwNc} <= ${MPwXtCTVNshu}))\n`;
          return;
        case 'mistsutils.compare':
          const ugfDYbYgexUP = this.descendInput(node?.A).asNumber();
          const jJuiFGaUCQOH = this.descendInput(node?.B).asNumber();
          const UcjYeZEKIZrI = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ugfDYbYgexUP} ${UcjYeZEKIZrI} ${jJuiFGaUCQOH}))\n`;
          return;

        case 'mistsutils.power':
          const BlWWsNAWkFFk = this.descendInput(node?.A).asNumber();
          const fuhTfIedDmDM = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${BlWWsNAWkFFk}, ${fuhTfIedDmDM}))\n`;
          return;
        case 'mistsutils.round':
          const kMgebTQyvnlB = this.descendInput(node?.A).asNumber();
          const LIYbyrRpYWva = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.round((${kMgebTQyvnlB} / ${LIYbyrRpYWva}) * ${LIYbyrRpYWva}))\n`;
          return;
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;
        case 'mistsutils.clamp':
          const eklxBjzdumta = this.descendInput(node?.A).asNumber();
          const XQCOVERzEALI = this.descendInput(node?.B).asNumber();
          const EKFsWLnwZwnH = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${eklxBjzdumta}, ${XQCOVERzEALI}), ${EKFsWLnwZwnH}))\n`;
          return;
        case 'mistsutils.min':
          const opvThqpxjVOh = this.descendInput(node?.A).asNumber();
          const gLVxxFGcmRXq = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(${opvThqpxjVOh}, ${gLVxxFGcmRXq}))\n`;
          return;
        case 'mistsutils.max':
          const IzGLJPBvQnKl = this.descendInput(node?.A).asNumber();
          const HKfbZiQtZpwX = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(${IzGLJPBvQnKl}, ${HKfbZiQtZpwX}))\n`;
          return;
        case 'mistsutils.interpolate':
          const AfHaWHRUSkyT = this.descendInput(node?.A).asNumber();
          const IZFfPBHytttl = this.descendInput(node?.B).asNumber();
          const WQsAToQkKkTQ = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${IZFfPBHytttl} + ((${WQsAToQkKkTQ} - ${IZFfPBHytttl}) / ${AfHaWHRUSkyT}))\n`;
          return;

        case 'mistsutils.?':
          const FuYIOOybVrHc = this.descendInput(node?.A).asBoolean();
          const sSDCszFNYtNJ = this.descendInput(node?.B).asString();
          const EzUwWMmQfFQg = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${FuYIOOybVrHc} ? (${sSDCszFNYtNJ} : ${EzUwWMmQfFQg})))\n`;
          return;
        case 'mistsutils.letters':
          const ceILXoRfAPPC = this.descendInput(node?.A).asNumber();
          const ZfhaankgnDmo = this.descendInput(node?.B).asNumber();
          const eMFXgNiYxVMI = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${eMFXgNiYxVMI}).substring(${ceILXoRfAPPC}, ${ZfhaankgnDmo}))\n`;
          return;
        case 'mistsutils.starts':
          const OYQJVEurjpPV = this.descendInput(node?.A).asString();
          const FphLQgJqnhvI = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${OYQJVEurjpPV}).startsWith(${FphLQgJqnhvI}))\n`;
          return;
        case 'mistsutils.ends':
          const eDrkAhuXDlLR = this.descendInput(node?.A).asString();
          const IWqVKpgpsARx = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${eDrkAhuXDlLR}).endsWith(${IWqVKpgpsARx}))\n`;
          return;
        case 'mistsutils.toUnicode':
          const ADXtPZjJusxT = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ADXtPZjJusxT}).charCodeAt(0))\n`;
          return;
        case 'mistsutils.replace':
          const OhNcXvXOfbVW = this.descendInput(node?.A).asString();
          const metgSrRxFbFj = this.descendInput(node?.B).asString();
          const ngFwDurcKFck = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ngFwDurcKFck} === "" ? ${OhNcXvXOfbVW} : (${OhNcXvXOfbVW}).replace(${ngFwDurcKFck}, ${metgSrRxFbFj})))\n`;
          return;
        case 'mistsutils.replaceall':
          const KoeaarGAAmRg = this.descendInput(node?.A).asString();
          const XbDBcMhLNPUp = this.descendInput(node?.B).asString();
          const tqHQIvQEJxvk = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${tqHQIvQEJxvk} === "" ? ${KoeaarGAAmRg} : (${KoeaarGAAmRg}).replaceAll(${tqHQIvQEJxvk}, ${XbDBcMhLNPUp})))\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const lCZJxBKwbJus = this.descendInput(node?.A).asString();
          const qVqjuUTxtNWb = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${lCZJxBKwbJus}).substring((${lCZJxBKwbJus}).indexOf(""+(${qVqjuUTxtNWb})) + 1, ((${lCZJxBKwbJus}).length))\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const nmcZrckVCkiU = this.descendInput(node?.A).asString();
          const oDTAxtVlUVqp = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${nmcZrckVCkiU}).split(${oDTAxtVlUVqp}, 1)[0])\n`;
          return;

        case 'mistsutils.split':
          const wIQCHRZrtFLI = this.descendInput(node?.A).asString();
          const fSGLJuUMACox = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${wIQCHRZrtFLI}).split(${fSGLJuUMACox})))\n`;
          return;
        case 'mistsutils.splitarray':
          const oeTlTPuZsZJU = this.descendInput(node?.A).asString();
          const yKiGzQzdtUuY = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${oeTlTPuZsZJU}).split(${yKiGzQzdtUuY}))\n`;
          return;
        case 'mistsutils.length':
          const BXmhKhrJTJzw = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${BXmhKhrJTJzw}).length))\n`;
          return;
        case 'mistsutils.item':
          const SsyNoQPTncef = this.descendInput(node?.A).asString();
          const tzjjNuCuKAeZ = this.descendInput(node?.B).asString();
          const mPulVFzUkFws = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${SsyNoQPTncef}).split(${tzjjNuCuKAeZ})[${mPulVFzUkFws}])\n`;
          return;
        case 'mistsutils.jsondelete':
          const mNNbjolbMyVK = this.descendInput(node?.A).asString();
          const GJDSfcqSvWgY = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${mNNbjolbMyVK}[${GJDSfcqSvWgY}]\n`;
          return;
        case 'mistsutils.jsonset':
          const XbQPtKRJcQuc = this.descendInput(node?.A).asString();
          const inBFrJqkykBe = this.descendInput(node?.B).asString();
          const pWdzsJXOXxGX = this.descendInput(node?.C).asString();
          this.source += `\n${XbQPtKRJcQuc}[${inBFrJqkykBe}] = ${pWdzsJXOXxGX}\n`;
          return;
        case 'mistsutils.squarebrackets':
          const BVcJUOkkXaPq = this.descendInput(node?.A).asString();
          const cFyMntOtkiEK = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${BVcJUOkkXaPq})[${cFyMntOtkiEK}])\n`;
          return;
        case 'mistsutils.jsonparse':
          const aYuKZgDCDRFG = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${aYuKZgDCDRFG}))\n`;
          return;
        case 'mistsutils.jsonstringify':
          const uQIKXeFputhy = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${uQIKXeFputhy}))\n`;
          return;

        case 'mistsutils.isnumber':
          const DdTRjvZEZxcN = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Number(${DdTRjvZEZxcN}) == ${DdTRjvZEZxcN})\n`;
          return;
        case 'mistsutils.isstring':
          const xmrWBDCrbweU = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", String(${xmrWBDCrbweU}) == ${xmrWBDCrbweU})\n`;
          return;
        case 'mistsutils.isboolean':
          const JXAXaTwdtRjl = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${JXAXaTwdtRjl} == "true" || ${JXAXaTwdtRjl} == "false")\n`;
          return;
        case 'mistsutils.tostring':
          const uuXylSVILwoD = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${uuXylSVILwoD})\n`;
          return;
        case 'mistsutils.tonumber':
          const hOhqiMtKPfze = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", isNaN(Number(${hOhqiMtKPfze})) ? 0 : Number(${hOhqiMtKPfze}))\n`;
          return;
        case 'mistsutils.toboolean':
          const aJrgWjaNzTyB = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${aJrgWjaNzTyB} == "true" || ${aJrgWjaNzTyB} == "1" || ${aJrgWjaNzTyB} == "yes" ? "true" : "false")\n`;
          return;

        case 'mistsutils.patchreporter':
          const HKKqqelMaFDt = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${HKKqqelMaFDt})\n`;
          return;
        case 'mistsutils.patchreporter2':
          const IyYEkVzGwIkq = this.descendInput(node?.A).asRaw();
          const AjoMDFsuUIQs = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${IyYEkVzGwIkq}${AjoMDFsuUIQs})\n`;
          return;
        case 'mistsutils.patchreporter3':
          const OKWgmmISgAqA = this.descendInput(node?.A).asRaw();
          const xHHxMStNtgKW = this.descendInput(node?.B).asRaw();
          const hSwVubqzXkFB = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${OKWgmmISgAqA}${xHHxMStNtgKW}${hSwVubqzXkFB})\n`;
          return;
        case 'mistsutils.patchboolean':
          const txkZyksAxCKg = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${txkZyksAxCKg})\n`;
          return;
        case 'mistsutils.patchcommand':
          const MnmHKVReSYLE = this.descendInput(node?.A).asRaw();
          this.source += `\n${MnmHKVReSYLE}\n`;
          return;
        case 'mistsutils.patchcommand2':
          const FVOKmpAVAbwr = this.descendInput(node?.A).asRaw();
          const emsRqrzaUcjY = this.descendInput(node?.B).asRaw();
          this.source += `\n${FVOKmpAVAbwr}${emsRqrzaUcjY}\n`;
          return;
        case 'mistsutils.patchcommand3':
          const tNAvenLRGWQc = this.descendInput(node?.A).asRaw();
          const UHrlXQPbCEcr = this.descendInput(node?.B).asRaw();
          const NzkhiQPtqoSE = this.descendInput(node?.C).asRaw();
          this.source += `\n${tNAvenLRGWQc}${UHrlXQPbCEcr}${NzkhiQPtqoSE}\n`;
          return;

        case 'mistsutils.true':
          this.source += `\nvm.runtime.visualReport("${block.id}", true)\n`;
          return;
        case 'mistsutils.false':
          this.source += `\nvm.runtime.visualReport("${block.id}", false)\n`;
          return;
        case 'mistsutils.isPackaged':
          this.source += `\nvm.runtime.visualReport("${block.id}", (typeof window.scaffolding === 'object'))\n`;
          return;
        case 'mistsutils.performancenow':
          this.source += `\nvm.runtime.visualReport("${block.id}", performance.now())\n`;
          return;
        case 'mistsutils.stagewidth':
          this.source += `\nvm.runtime.visualReport("${block.id}", Scratch.vm.runtime.stageWidth)\n`;
          return;
        case 'mistsutils.stageheight':
          this.source += `\nvm.runtime.visualReport("${block.id}", Scratch.vm.runtime.stageHeight)\n`;
          return;
        case 'mistsutils.newline':
          this.source += `\nvm.runtime.visualReport("${block.id}", "\\n")\n`;
          return;
        case 'mistsutils.pi':
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.PI)\n`;
          return;
        case 'mistsutils.e':
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.E)\n`;
          return;
        case 'mistsutils.infinity':
          this.source += `\nvm.runtime.visualReport("${block.id}", Infinity)\n`;
          return;
        case 'mistsutils.MaxInt':
          this.source += `\nvm.runtime.visualReport("${block.id}", Number.MAX_SAFE_INTEGER)\n`;
          return;
        default:
          return fn(node, ...args);
      }
    },

    descendInput(fn, node, ...args) {
      switch (node.kind) {
        case 'mistsutils.undefined':
          return new TypedInput(`undefined`, TYPE_UNKNOWN);

        case 'mistsutils.notequals':
          const FAOZEHmHqalF = this.descendInput(node?.A).asString();
          const agKhyPLxvfXS = this.descendInput(node?.B).asString();
          return new TypedInput(`(${FAOZEHmHqalF} !== ${agKhyPLxvfXS})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const VStpIzkkdBKy = this.descendInput(node?.A).asString();
          const FWtTdOHtLbRf = this.descendInput(node?.B).asString();
          return new TypedInput(`(${VStpIzkkdBKy} === ${FWtTdOHtLbRf})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const HxaldkVgHGRm = this.descendInput(node?.A).asNumber();
          const besMgTSWmtol = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${HxaldkVgHGRm} >= ${besMgTSWmtol})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const ECTDoJwrqwNc = this.descendInput(node?.A).asNumber();
          const MPwXtCTVNshu = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${ECTDoJwrqwNc} <= ${MPwXtCTVNshu})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const ugfDYbYgexUP = this.descendInput(node?.A).asNumber();
          const jJuiFGaUCQOH = this.descendInput(node?.B).asNumber();
          const UcjYeZEKIZrI = this.descendInput(node?.C).asRaw();
          return new TypedInput(`(${ugfDYbYgexUP} ${UcjYeZEKIZrI} ${jJuiFGaUCQOH})`, TYPE_BOOLEAN);

        case 'mistsutils.power':
          const BlWWsNAWkFFk = this.descendInput(node?.A).asNumber();
          const fuhTfIedDmDM = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${BlWWsNAWkFFk}, ${fuhTfIedDmDM})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const kMgebTQyvnlB = this.descendInput(node?.A).asNumber();
          const LIYbyrRpYWva = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.round((${kMgebTQyvnlB} / ${LIYbyrRpYWva}) * ${LIYbyrRpYWva})`, TYPE_NUMBER);
        case 'mistsutils.undefined':
          return new TypedInput(`undefined`, TYPE_UNKNOWN);
        case 'mistsutils.clamp':
          const eklxBjzdumta = this.descendInput(node?.A).asNumber();
          const XQCOVERzEALI = this.descendInput(node?.B).asNumber();
          const EKFsWLnwZwnH = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${eklxBjzdumta}, ${XQCOVERzEALI}), ${EKFsWLnwZwnH})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const opvThqpxjVOh = this.descendInput(node?.A).asNumber();
          const gLVxxFGcmRXq = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.min(${opvThqpxjVOh}, ${gLVxxFGcmRXq})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const IzGLJPBvQnKl = this.descendInput(node?.A).asNumber();
          const HKfbZiQtZpwX = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.max(${IzGLJPBvQnKl}, ${HKfbZiQtZpwX})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const AfHaWHRUSkyT = this.descendInput(node?.A).asNumber();
          const IZFfPBHytttl = this.descendInput(node?.B).asNumber();
          const WQsAToQkKkTQ = this.descendInput(node?.C).asNumber();
          return new TypedInput(`${IZFfPBHytttl} + ((${WQsAToQkKkTQ} - ${IZFfPBHytttl}) / ${AfHaWHRUSkyT})`, TYPE_NUMBER);

        case 'mistsutils.?':
          const FuYIOOybVrHc = this.descendInput(node?.A).asBoolean();
          const sSDCszFNYtNJ = this.descendInput(node?.B).asString();
          const EzUwWMmQfFQg = this.descendInput(node?.C).asString();
          return new TypedInput(`(${FuYIOOybVrHc} ? (${sSDCszFNYtNJ} : ${EzUwWMmQfFQg}))`, TYPE_STRING);
        case 'mistsutils.letters':
          const ceILXoRfAPPC = this.descendInput(node?.A).asNumber();
          const ZfhaankgnDmo = this.descendInput(node?.B).asNumber();
          const eMFXgNiYxVMI = this.descendInput(node?.C).asString();
          return new TypedInput(`(${eMFXgNiYxVMI}).substring(${ceILXoRfAPPC}, ${ZfhaankgnDmo})`, TYPE_STRING);
        case 'mistsutils.starts':
          const OYQJVEurjpPV = this.descendInput(node?.A).asString();
          const FphLQgJqnhvI = this.descendInput(node?.B).asString();
          return new TypedInput(`(${OYQJVEurjpPV}).startsWith(${FphLQgJqnhvI})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const eDrkAhuXDlLR = this.descendInput(node?.A).asString();
          const IWqVKpgpsARx = this.descendInput(node?.B).asString();
          return new TypedInput(`(${eDrkAhuXDlLR}).endsWith(${IWqVKpgpsARx})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const ADXtPZjJusxT = this.descendInput(node?.A).asString();
          return new TypedInput(`(${ADXtPZjJusxT}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const OhNcXvXOfbVW = this.descendInput(node?.A).asString();
          const metgSrRxFbFj = this.descendInput(node?.B).asString();
          const ngFwDurcKFck = this.descendInput(node?.C).asString();
          return new TypedInput(`(${ngFwDurcKFck} === "" ? ${OhNcXvXOfbVW} : (${OhNcXvXOfbVW}).replace(${ngFwDurcKFck}, ${metgSrRxFbFj}))`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const KoeaarGAAmRg = this.descendInput(node?.A).asString();
          const XbDBcMhLNPUp = this.descendInput(node?.B).asString();
          const tqHQIvQEJxvk = this.descendInput(node?.C).asString();
          return new TypedInput(`(${tqHQIvQEJxvk} === "" ? ${KoeaarGAAmRg} : (${KoeaarGAAmRg}).replaceAll(${tqHQIvQEJxvk}, ${XbDBcMhLNPUp}))`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const lCZJxBKwbJus = this.descendInput(node?.A).asString();
          const qVqjuUTxtNWb = this.descendInput(node?.B).asString();
          return new TypedInput(`(${lCZJxBKwbJus}).substring((${lCZJxBKwbJus}).indexOf(""+(${qVqjuUTxtNWb})) + 1, ((${lCZJxBKwbJus}).length)`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const nmcZrckVCkiU = this.descendInput(node?.A).asString();
          const oDTAxtVlUVqp = this.descendInput(node?.B).asString();
          return new TypedInput(`(${nmcZrckVCkiU}).split(${oDTAxtVlUVqp}, 1)[0]`, TYPE_STRING);

        case 'mistsutils.split':
          const wIQCHRZrtFLI = this.descendInput(node?.A).asString();
          const fSGLJuUMACox = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((${wIQCHRZrtFLI}).split(${fSGLJuUMACox}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const oeTlTPuZsZJU = this.descendInput(node?.A).asString();
          const yKiGzQzdtUuY = this.descendInput(node?.B).asString();
          return new TypedInput(`(${oeTlTPuZsZJU}).split(${yKiGzQzdtUuY})`, TYPE_STRING);
        case 'mistsutils.length':
          const BXmhKhrJTJzw = this.descendInput(node?.A).asString();
          return new TypedInput(`((${BXmhKhrJTJzw}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const SsyNoQPTncef = this.descendInput(node?.A).asString();
          const tzjjNuCuKAeZ = this.descendInput(node?.B).asString();
          const mPulVFzUkFws = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(${SsyNoQPTncef}).split(${tzjjNuCuKAeZ})[${mPulVFzUkFws}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const mNNbjolbMyVK = this.descendInput(node?.A).asString();
          const GJDSfcqSvWgY = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${mNNbjolbMyVK}[${GJDSfcqSvWgY}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const XbQPtKRJcQuc = this.descendInput(node?.A).asString();
          const inBFrJqkykBe = this.descendInput(node?.B).asString();
          const pWdzsJXOXxGX = this.descendInput(node?.C).asString();
          return new TypedInput(`${XbQPtKRJcQuc}[${inBFrJqkykBe}] = ${pWdzsJXOXxGX}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const BVcJUOkkXaPq = this.descendInput(node?.A).asString();
          const cFyMntOtkiEK = this.descendInput(node?.B).asString();
          return new TypedInput(`(${BVcJUOkkXaPq})[${cFyMntOtkiEK}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const aYuKZgDCDRFG = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${aYuKZgDCDRFG})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const uQIKXeFputhy = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${uQIKXeFputhy})`, TYPE_STRING);

        case 'mistsutils.isnumber':
          const DdTRjvZEZxcN = this.descendInput(node?.A).asString();
          return new TypedInput(`Number(${DdTRjvZEZxcN}) == ${DdTRjvZEZxcN}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const xmrWBDCrbweU = this.descendInput(node?.A).asString();
          return new TypedInput(`String(${xmrWBDCrbweU}) == ${xmrWBDCrbweU}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const JXAXaTwdtRjl = this.descendInput(node?.A).asString();
          return new TypedInput(`${JXAXaTwdtRjl} == "true" || ${JXAXaTwdtRjl} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const uuXylSVILwoD = this.descendInput(node?.A).asString();
          return new TypedInput(`${uuXylSVILwoD}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const hOhqiMtKPfze = this.descendInput(node?.A).asString();
          return new TypedInput(`isNaN(Number(${hOhqiMtKPfze})) ? 0 : Number(${hOhqiMtKPfze})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const aJrgWjaNzTyB = this.descendInput(node?.A).asString();
          return new TypedInput(`${aJrgWjaNzTyB} == "true" || ${aJrgWjaNzTyB} == "1" || ${aJrgWjaNzTyB} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);

        case 'mistsutils.patchreporter':
          const HKKqqelMaFDt = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${HKKqqelMaFDt}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const IyYEkVzGwIkq = this.descendInput(node?.A).asRaw();
          const AjoMDFsuUIQs = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${IyYEkVzGwIkq}${AjoMDFsuUIQs}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const OKWgmmISgAqA = this.descendInput(node?.A).asRaw();
          const xHHxMStNtgKW = this.descendInput(node?.B).asRaw();
          const hSwVubqzXkFB = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${OKWgmmISgAqA}${xHHxMStNtgKW}${hSwVubqzXkFB}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const txkZyksAxCKg = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${txkZyksAxCKg}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const MnmHKVReSYLE = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${MnmHKVReSYLE}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const FVOKmpAVAbwr = this.descendInput(node?.A).asRaw();
          const emsRqrzaUcjY = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${FVOKmpAVAbwr}${emsRqrzaUcjY}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const tNAvenLRGWQc = this.descendInput(node?.A).asRaw();
          const UHrlXQPbCEcr = this.descendInput(node?.B).asRaw();
          const NzkhiQPtqoSE = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${tNAvenLRGWQc}${UHrlXQPbCEcr}${NzkhiQPtqoSE}`, TYPE_UNKNOWN);

        case 'mistsutils.true':
          return new TypedInput(`true`, TYPE_BOOLEAN);
        case 'mistsutils.false':
          return new TypedInput(`false`, TYPE_BOOLEAN);
        case 'mistsutils.isPackaged':
          return new TypedInput(`(typeof window.scaffolding === 'object')`, TYPE_BOOLEAN);
        case 'mistsutils.performancenow':
          return new TypedInput(`performance.now()`, TYPE_NUMBER);
        case 'mistsutils.stagewidth':
          return new TypedInput(`Scratch.vm.runtime.stageWidth`, TYPE_NUMBER);
        case 'mistsutils.stageheight':
          return new TypedInput(`Scratch.vm.runtime.stageHeight`, TYPE_NUMBER);
        case 'mistsutils.newline':
          return new TypedInput(`"\\n"`, TYPE_STRING);
        case 'mistsutils.pi':
          return new TypedInput(`Math.PI`, TYPE_NUMBER);
        case 'mistsutils.e':
          return new TypedInput(`Math.E`, TYPE_NUMBER);
        case 'mistsutils.infinity':
          return new TypedInput(`Infinity`, TYPE_NUMBER);
        case 'mistsutils.MaxInt':
          return new TypedInput(`Number.MAX_SAFE_INTEGER`, TYPE_NUMBER);
        default:
          return fn(node, ...args);
      }
    },
  });

  cst_patch(STGP, {
    descendStackedBlock(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistsutils_undefined':
          return {
            block, kind: 'mistsutils.undefined',
          };

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
        case 'mistsutils_greaterorequal':
          return {
            block, kind: 'mistsutils.greaterorequal',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_lessthanorequal':
          return {
            block, kind: 'mistsutils.lessthanorequal',
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
        case 'mistsutils_round':
          return {
            block, kind: 'mistsutils.round',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_undefined':
          return {
            block, kind: 'mistsutils.undefined',
          };
        case 'mistsutils_clamp':
          return {
            block, kind: 'mistsutils.clamp',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_min':
          return {
            block, kind: 'mistsutils.min',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_max':
          return {
            block, kind: 'mistsutils.max',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_interpolate':
          return {
            block, kind: 'mistsutils.interpolate',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistsutils_?':
          return {
            block, kind: 'mistsutils.?',
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
        case 'mistsutils_replaceall':
          return {
            block, kind: 'mistsutils.replaceall',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_alltextAfterString':
          return {
            block, kind: 'mistsutils.alltextAfterString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_alltextBeforeString':
          return {
            block, kind: 'mistsutils.alltextBeforeString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
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

        case 'mistsutils_isnumber':
          return {
            block, kind: 'mistsutils.isnumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isstring':
          return {
            block, kind: 'mistsutils.isstring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isboolean':
          return {
            block, kind: 'mistsutils.isboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tostring':
          return {
            block, kind: 'mistsutils.tostring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tonumber':
          return {
            block, kind: 'mistsutils.tonumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_toboolean':
          return {
            block, kind: 'mistsutils.toboolean',
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
        case 'mistsutils_isPackaged':
          return {
            block, kind: 'mistsutils.isPackaged',
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
        case 'mistsutils_newline':
          return {
            block, kind: 'mistsutils.newline',
          };
        case 'mistsutils_pi':
          return {
            block, kind: 'mistsutils.pi',
          };
        case 'mistsutils_e':
          return {
            block, kind: 'mistsutils.e',
          };
        case 'mistsutils_infinity':
          return {
            block, kind: 'mistsutils.infinity',
          };
        case 'mistsutils_MaxInt':
          return {
            block, kind: 'mistsutils.MaxInt',
          };
        default:
          return fn(block, ...args);
      }
    },

    descendInput(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistsutils_undefined':
          return {
            block,
            kind: 'mistsutils.undefined',
          };

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
        case 'mistsutils_greaterorequal':
          return {
            block,
            kind: 'mistsutils.greaterorequal',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_lessthanorequal':
          return {
            block,
            kind: 'mistsutils.lessthanorequal',
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
        case 'mistsutils_round':
          return {
            block,
            kind: 'mistsutils.round',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_undefined':
          return {
            block,
            kind: 'mistsutils.undefined',
          };
        case 'mistsutils_clamp':
          return {
            block,
            kind: 'mistsutils.clamp',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_min':
          return {
            block,
            kind: 'mistsutils.min',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_max':
          return {
            block,
            kind: 'mistsutils.max',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_interpolate':
          return {
            block,
            kind: 'mistsutils.interpolate',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistsutils_?':
          return {
            block,
            kind: 'mistsutils.?',
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
        case 'mistsutils_replaceall':
          return {
            block,
            kind: 'mistsutils.replaceall',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_alltextAfterString':
          return {
            block,
            kind: 'mistsutils.alltextAfterString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_alltextBeforeString':
          return {
            block,
            kind: 'mistsutils.alltextBeforeString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
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

        case 'mistsutils_isnumber':
          return {
            block,
            kind: 'mistsutils.isnumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isstring':
          return {
            block,
            kind: 'mistsutils.isstring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isboolean':
          return {
            block,
            kind: 'mistsutils.isboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tostring':
          return {
            block,
            kind: 'mistsutils.tostring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tonumber':
          return {
            block,
            kind: 'mistsutils.tonumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_toboolean':
          return {
            block,
            kind: 'mistsutils.toboolean',
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
        case 'mistsutils_isPackaged':
          return {
            block,
            kind: 'mistsutils.isPackaged',
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
        case 'mistsutils_newline':
          return {
            block,
            kind: 'mistsutils.newline',
          };
        case 'mistsutils_pi':
          return {
            block,
            kind: 'mistsutils.pi',
          };
        case 'mistsutils_e':
          return {
            block,
            kind: 'mistsutils.e',
          };
        case 'mistsutils_infinity':
          return {
            block,
            kind: 'mistsutils.infinity',
          };
        case 'mistsutils_MaxInt':
          return {
            block,
            kind: 'mistsutils.MaxInt',
          };
        default:
          return fn(block, ...args);
      }
    },
  });

  Scratch.extensions.register(new mistsutils());
})(Scratch);
