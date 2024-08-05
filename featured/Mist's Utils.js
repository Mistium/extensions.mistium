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
      console.log("Loaded Mist's utils! (v5.4)");
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
            if (!(text.includes("version: 5.4,"))) {
              this.newUpdate = true;
            }
          })
      };
    }

    getInfo() {
      return {
        id: 'mistsutils',
        name: 'Mists Utils',
        color1: '#2DA4A0',
        version: 5.4,
        blocks: [{
            "blockType": Scratch.BlockType.BUTTON,
            "text": "New Version Available!",
            "func": "openSite",
            "hideFromPalette": !this.newUpdate
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Comparisons"
          },
          {
            "opcode": "notequals",
            "text": "[A] !== [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${xnCbqwQNpdPN} !== ${KOWUcEPhoVwC})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "xnCbqwQNpdPN"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "KOWUcEPhoVwC"
              }
            },
            "func": "err"
          },
          {
            "opcode": "equals",
            "text": "[A] === [B]",
            "code": "(${syEcomFhxGZF} === ${HgIOPdQEpZSU})",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "syEcomFhxGZF"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "HgIOPdQEpZSU"
              }
            },
            "func": "err"
          },
          {
            "opcode": "greaterorequal",
            "text": "[A] >= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${rUuXrJvZEcld} >= ${vursOXsZFwDT})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "rUuXrJvZEcld"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "vursOXsZFwDT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "lessthanorequal",
            "text": "[A] <= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${BCMFlfGxDWFF} <= ${KRwHvFIbAotT})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "BCMFlfGxDWFF"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "KRwHvFIbAotT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "compare",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${YiwSmCNNxikm} ${sYVdcGyhOiSV} ${ZXECtYTFHAPd})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "YiwSmCNNxikm"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "ZXECtYTFHAPd"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "<",
                "gen_id": "sYVdcGyhOiSV"
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
            "code": "Math.pow(${ZGJvOCpxHZNP}, ${DJtSeAnBCHTp})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "ZGJvOCpxHZNP"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "DJtSeAnBCHTp"
              }
            },
            "func": "err"
          },
          {
            "opcode": "round",
            "text": "round [A] to the nearest [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.round((${yPvUjmscNLsU} / ${xzAiIeAGjRoc}) * ${xzAiIeAGjRoc})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "yPvUjmscNLsU"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 10,
                "gen_id": "xzAiIeAGjRoc"
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
            "code": "Math.min(Math.max(${nCAYwNASYrLt}, ${LMGlcoMpSvTl}), ${ieyslCWRFKmw})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "nCAYwNASYrLt"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "LMGlcoMpSvTl"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "ieyslCWRFKmw"
              }
            },
            "func": "err"
          },
          {
            "opcode": "min",
            "text": "min of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(${aAKUrWCkJTyF}, ${unzEtdIgPxie})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "aAKUrWCkJTyF"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "unzEtdIgPxie"
              }
            },
            "func": "err"
          },
          {
            "opcode": "max",
            "text": "max of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.max(${esGRjIxAPFHu}, ${ZZjNCRBATolt})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "esGRjIxAPFHu"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "ZZjNCRBATolt"
              }
            },
            "func": "err"
          },
          {
            "opcode": "interpolate",
            "text": "smooth [B] to [C] by [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${XaLgWwtAbkna} + ((${UxIdStougfcY} - ${XaLgWwtAbkna}) / ${HVtTzwHHbkkI})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "HVtTzwHHbkkI"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "XaLgWwtAbkna"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "UxIdStougfcY"
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
            "code": "(${xqOvAxKHQDzq} ? ${TILcQDiZoVYS} : ${gpfXBubIfWgD})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.BOOLEAN,
                "defaultValue": false,
                "gen_id": "xqOvAxKHQDzq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "yes",
                "gen_id": "TILcQDiZoVYS"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "no",
                "gen_id": "gpfXBubIfWgD"
              }
            },
            "func": "err"
          },
          {
            "opcode": "letters",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${EjXPYRMVGmGp}).substring(${MXLbdyOWNzJV}, ${yUeJEfDtNdjw})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "MXLbdyOWNzJV"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "yUeJEfDtNdjw"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "EjXPYRMVGmGp"
              }
            },
            "func": "err"
          },
          {
            "opcode": "starts",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${OkMZJngyebyw}).startsWith(${TRgrrKittfsJ})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "OkMZJngyebyw"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "TRgrrKittfsJ"
              }
            },
            "func": "err"
          },
          {
            "opcode": "ends",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${nCxjlmNhlyOa}).endsWith(${MoHvsnvlePgl})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "nCxjlmNhlyOa"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "MoHvsnvlePgl"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toUnicode",
            "text": "unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${cZZohhklcJdb}).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "cZZohhklcJdb"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replace",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${SEwRjlAFVagp} === \"\" ? ${LLyWeNIweyjj} : (${LLyWeNIweyjj}).replace(${SEwRjlAFVagp}, ${qAWIJZfkaurn}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "LLyWeNIweyjj"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "qAWIJZfkaurn"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "SEwRjlAFVagp"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replaceall",
            "text": "replace all [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${VmPAbLyehMes} === \"\" ? ${TqnPSpueTdgf} : (${TqnPSpueTdgf}).replaceAll(${VmPAbLyehMes}, ${LtqzxqhAmHZZ}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "TqnPSpueTdgf"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "LtqzxqhAmHZZ"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "VmPAbLyehMes"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextAfterString",
            "text": "text after [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${vpAjynvOSaEB}).substring((${vpAjynvOSaEB}).indexOf(\"\"+(${gRFzIPnzIjiS})) + 1, ((${vpAjynvOSaEB}).length)",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "vpAjynvOSaEB"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "gRFzIPnzIjiS"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextBeforeString",
            "text": "text before [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${KKOHMFqpUikE}).split(${cGoJhNbfojcW}, 1)[0]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "KKOHMFqpUikE"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "cGoJhNbfojcW"
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
            "code": "JSON.stringify((${OiXHVsSNoXwz}).split(${FMMsjLmyqXAm}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "OiXHVsSNoXwz"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "FMMsjLmyqXAm"
              }
            },
            "func": "err"
          },
          {
            "opcode": "splitarray",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${wQqPqQNYvIBX}).split(${znfuVeVnFoWb})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "wQqPqQNYvIBX"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "znfuVeVnFoWb"
              }
            },
            "func": "err"
          },
          {
            "opcode": "length",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${PAZSOpgqIdRv}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "PAZSOpgqIdRv"
              }
            },
            "func": "err"
          },
          {
            "opcode": "item",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${cxamZoNgVSHC}).split(${ScXEeGoXmAHi})[${wJxAtGouIzps}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "cxamZoNgVSHC"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "ScXEeGoXmAHi"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "wJxAtGouIzps"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsondelete",
            "text": "delete Item [B] of [A]",
            "code": "delete ${qZZusoTlaRge}[${IkOsIAVazDhI}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "qZZusoTlaRge"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "IkOsIAVazDhI"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonset",
            "text": "set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${ztbwcjYLGLss}[${bUujEIpihSok}] = ${dZkgqYDOPUeZ}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "ztbwcjYLGLss"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "bUujEIpihSok"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "dZkgqYDOPUeZ"
              }
            },
            "func": "err"
          },
          {
            "opcode": "squarebrackets",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${szMcWuUeihvw})[${pkvmQIXIeMth}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "szMcWuUeihvw"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "pkvmQIXIeMth"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonparse",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${OharHLTZCjpW})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "OharHLTZCjpW"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonstringify",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${whZrNwpaRsZa})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "whZrNwpaRsZa"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Variables"
          },
          {
            "opcode": "getVariableIdByName",
            "text": "get Sprite Variable ID of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${KqXgHyeXcylB} && variable.type !== \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "KqXgHyeXcylB"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getSpriteListIdByName",
            "text": "get Sprite List ID of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${OpfIUZjioKdF} && variable.type === \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "OpfIUZjioKdF"
              }
            },
            "func": "err"
          },
          "---",
          {
            "opcode": "getStageVariableIdByName",
            "text": "get Stage Variable ID of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${jLWaOmVFidSc} && variable.type !== \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "jLWaOmVFidSc"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getStageListIdByName",
            "text": "get Stage List ID of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${WRttaTzqzHlK} && variable.type === \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "WRttaTzqzHlK"
              }
            },
            "func": "err"
          },
          {
            "opcode": "setSpriteVariableById",
            "text": "set var/list in Sprite (id: [A] value: [B])",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "vm.editingTarget.variables[${UOBIGVfRMWAP}].value = ${GSrFYlhGSrPV}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "variable id",
                "gen_id": "UOBIGVfRMWAP"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "GSrFYlhGSrPV"
              }
            },
            "func": "err"
          },
          {
            "opcode": "setStageVariableById",
            "text": "set var/list in Stage (id: [A] value: [B])",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "vm.runtime.getTargetForStage().variables[${yPhutDWCHUYn}].value = ${XeJJcXZVqqxb}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "variable id",
                "gen_id": "yPhutDWCHUYn"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "XeJJcXZVqqxb"
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
            "code": "Number(${IDVBSVREhEDf}) == ${IDVBSVREhEDf}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "IDVBSVREhEDf"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isstring",
            "text": "[A] is a string",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "String(${BkCispIfcwUT}) == ${BkCispIfcwUT}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "BkCispIfcwUT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isboolean",
            "text": "[A] is a boolean",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${qSJVytmPDmTz} == \"true\" || ${qSJVytmPDmTz} == \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "qSJVytmPDmTz"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tostring",
            "text": "to string [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${wZqwfMZxftZS}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "wZqwfMZxftZS"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tonumber",
            "text": "to number [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "isNaN(Number(${DtGXupjXgCwV})) ? 0 : Number(${DtGXupjXgCwV})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "DtGXupjXgCwV"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toboolean",
            "text": "to boolean [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${HualXtCECfGo} == \"true\" || ${HualXtCECfGo} == \"1\" || ${HualXtCECfGo} == \"yes\" ? \"true\" : \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "HualXtCECfGo"
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
            "text": "patch [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${VpEbqhQdWmdW}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "VpEbqhQdWmdW"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter2",
            "text": "patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${VesBQxlASnAN}${uMVNFYrOFMwM}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "VesBQxlASnAN"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "uMVNFYrOFMwM"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter3",
            "text": "patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${SNvjECAavzEN}${LfAetnbjBNky}${fldfRuyIbUqv}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "SNvjECAavzEN"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "LfAetnbjBNky"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "fldfRuyIbUqv"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchboolean",
            "text": "patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${hboXTNBhsACj}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "hboXTNBhsACj"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand",
            "text": "patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${EHrbaAJqwUAn}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "EHrbaAJqwUAn"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand2",
            "text": "patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${SDntBfZhvuEf}${dMXTgUBCvESK}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "SDntBfZhvuEf"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "dMXTgUBCvESK"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand3",
            "text": "patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${TsYsZlAFFdyy}${PSMjKclqChbS}${liZGcZaUYdIh}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "TsYsZlAFFdyy"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "PSMjKclqChbS"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "liZGcZaUYdIh"
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
          const xnCbqwQNpdPN = this.descendInput(node?.A).asString();
          const KOWUcEPhoVwC = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${xnCbqwQNpdPN} !== ${KOWUcEPhoVwC}))\n`;
          return;
        case 'mistsutils.equals':
          const syEcomFhxGZF = this.descendInput(node?.A).asString();
          const HgIOPdQEpZSU = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${syEcomFhxGZF} === ${HgIOPdQEpZSU}))\n`;
          return;
        case 'mistsutils.greaterorequal':
          const rUuXrJvZEcld = this.descendInput(node?.A).asNumber();
          const vursOXsZFwDT = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${rUuXrJvZEcld} >= ${vursOXsZFwDT}))\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const BCMFlfGxDWFF = this.descendInput(node?.A).asNumber();
          const KRwHvFIbAotT = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${BCMFlfGxDWFF} <= ${KRwHvFIbAotT}))\n`;
          return;
        case 'mistsutils.compare':
          const YiwSmCNNxikm = this.descendInput(node?.A).asNumber();
          const ZXECtYTFHAPd = this.descendInput(node?.B).asNumber();
          const sYVdcGyhOiSV = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${YiwSmCNNxikm} ${sYVdcGyhOiSV} ${ZXECtYTFHAPd}))\n`;
          return;

        case 'mistsutils.power':
          const ZGJvOCpxHZNP = this.descendInput(node?.A).asNumber();
          const DJtSeAnBCHTp = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${ZGJvOCpxHZNP}, ${DJtSeAnBCHTp}))\n`;
          return;
        case 'mistsutils.round':
          const yPvUjmscNLsU = this.descendInput(node?.A).asNumber();
          const xzAiIeAGjRoc = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.round((${yPvUjmscNLsU} / ${xzAiIeAGjRoc}) * ${xzAiIeAGjRoc}))\n`;
          return;
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;
        case 'mistsutils.clamp':
          const nCAYwNASYrLt = this.descendInput(node?.A).asNumber();
          const LMGlcoMpSvTl = this.descendInput(node?.B).asNumber();
          const ieyslCWRFKmw = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${nCAYwNASYrLt}, ${LMGlcoMpSvTl}), ${ieyslCWRFKmw}))\n`;
          return;
        case 'mistsutils.min':
          const aAKUrWCkJTyF = this.descendInput(node?.A).asNumber();
          const unzEtdIgPxie = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(${aAKUrWCkJTyF}, ${unzEtdIgPxie}))\n`;
          return;
        case 'mistsutils.max':
          const esGRjIxAPFHu = this.descendInput(node?.A).asNumber();
          const ZZjNCRBATolt = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(${esGRjIxAPFHu}, ${ZZjNCRBATolt}))\n`;
          return;
        case 'mistsutils.interpolate':
          const HVtTzwHHbkkI = this.descendInput(node?.A).asNumber();
          const XaLgWwtAbkna = this.descendInput(node?.B).asNumber();
          const UxIdStougfcY = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${XaLgWwtAbkna} + ((${UxIdStougfcY} - ${XaLgWwtAbkna}) / ${HVtTzwHHbkkI}))\n`;
          return;

        case 'mistsutils.?':
          const xqOvAxKHQDzq = this.descendInput(node?.A).asBoolean();
          const TILcQDiZoVYS = this.descendInput(node?.B).asString();
          const gpfXBubIfWgD = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${xqOvAxKHQDzq} ? ${TILcQDiZoVYS} : ${gpfXBubIfWgD}))\n`;
          return;
        case 'mistsutils.letters':
          const MXLbdyOWNzJV = this.descendInput(node?.A).asNumber();
          const yUeJEfDtNdjw = this.descendInput(node?.B).asNumber();
          const EjXPYRMVGmGp = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${EjXPYRMVGmGp}).substring(${MXLbdyOWNzJV}, ${yUeJEfDtNdjw}))\n`;
          return;
        case 'mistsutils.starts':
          const OkMZJngyebyw = this.descendInput(node?.A).asString();
          const TRgrrKittfsJ = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${OkMZJngyebyw}).startsWith(${TRgrrKittfsJ}))\n`;
          return;
        case 'mistsutils.ends':
          const nCxjlmNhlyOa = this.descendInput(node?.A).asString();
          const MoHvsnvlePgl = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${nCxjlmNhlyOa}).endsWith(${MoHvsnvlePgl}))\n`;
          return;
        case 'mistsutils.toUnicode':
          const cZZohhklcJdb = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${cZZohhklcJdb}).charCodeAt(0))\n`;
          return;
        case 'mistsutils.replace':
          const LLyWeNIweyjj = this.descendInput(node?.A).asString();
          const qAWIJZfkaurn = this.descendInput(node?.B).asString();
          const SEwRjlAFVagp = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${SEwRjlAFVagp} === "" ? ${LLyWeNIweyjj} : (${LLyWeNIweyjj}).replace(${SEwRjlAFVagp}, ${qAWIJZfkaurn})))\n`;
          return;
        case 'mistsutils.replaceall':
          const TqnPSpueTdgf = this.descendInput(node?.A).asString();
          const LtqzxqhAmHZZ = this.descendInput(node?.B).asString();
          const VmPAbLyehMes = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${VmPAbLyehMes} === "" ? ${TqnPSpueTdgf} : (${TqnPSpueTdgf}).replaceAll(${VmPAbLyehMes}, ${LtqzxqhAmHZZ})))\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const vpAjynvOSaEB = this.descendInput(node?.A).asString();
          const gRFzIPnzIjiS = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${vpAjynvOSaEB}).substring((${vpAjynvOSaEB}).indexOf(""+(${gRFzIPnzIjiS})) + 1, ((${vpAjynvOSaEB}).length))\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const KKOHMFqpUikE = this.descendInput(node?.A).asString();
          const cGoJhNbfojcW = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${KKOHMFqpUikE}).split(${cGoJhNbfojcW}, 1)[0])\n`;
          return;

        case 'mistsutils.split':
          const OiXHVsSNoXwz = this.descendInput(node?.A).asString();
          const FMMsjLmyqXAm = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${OiXHVsSNoXwz}).split(${FMMsjLmyqXAm})))\n`;
          return;
        case 'mistsutils.splitarray':
          const wQqPqQNYvIBX = this.descendInput(node?.A).asString();
          const znfuVeVnFoWb = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${wQqPqQNYvIBX}).split(${znfuVeVnFoWb}))\n`;
          return;
        case 'mistsutils.length':
          const PAZSOpgqIdRv = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${PAZSOpgqIdRv}).length))\n`;
          return;
        case 'mistsutils.item':
          const cxamZoNgVSHC = this.descendInput(node?.A).asString();
          const ScXEeGoXmAHi = this.descendInput(node?.B).asString();
          const wJxAtGouIzps = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${cxamZoNgVSHC}).split(${ScXEeGoXmAHi})[${wJxAtGouIzps}])\n`;
          return;
        case 'mistsutils.jsondelete':
          const qZZusoTlaRge = this.descendInput(node?.A).asString();
          const IkOsIAVazDhI = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${qZZusoTlaRge}[${IkOsIAVazDhI}]\n`;
          return;
        case 'mistsutils.jsonset':
          const ztbwcjYLGLss = this.descendInput(node?.A).asString();
          const bUujEIpihSok = this.descendInput(node?.B).asString();
          const dZkgqYDOPUeZ = this.descendInput(node?.C).asString();
          this.source += `\n${ztbwcjYLGLss}[${bUujEIpihSok}] = ${dZkgqYDOPUeZ}\n`;
          return;
        case 'mistsutils.squarebrackets':
          const szMcWuUeihvw = this.descendInput(node?.A).asString();
          const pkvmQIXIeMth = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${szMcWuUeihvw})[${pkvmQIXIeMth}])\n`;
          return;
        case 'mistsutils.jsonparse':
          const OharHLTZCjpW = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${OharHLTZCjpW}))\n`;
          return;
        case 'mistsutils.jsonstringify':
          const whZrNwpaRsZa = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${whZrNwpaRsZa}))\n`;
          return;

        case 'mistsutils.getVariableIdByName':
          const KqXgHyeXcylB = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${KqXgHyeXcylB} && variable.type !== "list")[0]?.id ?? "")\n`;
          return;
        case 'mistsutils.getSpriteListIdByName':
          const OpfIUZjioKdF = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${OpfIUZjioKdF} && variable.type === "list")[0]?.id ?? "")\n`;
          return;

        case 'mistsutils.getStageVariableIdByName':
          const jLWaOmVFidSc = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${jLWaOmVFidSc} && variable.type !== "list")[0]?.id ?? "")\n`;
          return;
        case 'mistsutils.getStageListIdByName':
          const WRttaTzqzHlK = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${WRttaTzqzHlK} && variable.type === "list")[0]?.id ?? "")\n`;
          return;
        case 'mistsutils.setSpriteVariableById':
          const UOBIGVfRMWAP = this.descendInput(node?.A).asString();
          const GSrFYlhGSrPV = this.descendInput(node?.B).asString();
          this.source += `\nvm.editingTarget.variables[${UOBIGVfRMWAP}].value = ${GSrFYlhGSrPV}\n`;
          return;
        case 'mistsutils.setStageVariableById':
          const yPhutDWCHUYn = this.descendInput(node?.A).asString();
          const XeJJcXZVqqxb = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.getTargetForStage().variables[${yPhutDWCHUYn}].value = ${XeJJcXZVqqxb}\n`;
          return;

        case 'mistsutils.isnumber':
          const IDVBSVREhEDf = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Number(${IDVBSVREhEDf}) == ${IDVBSVREhEDf})\n`;
          return;
        case 'mistsutils.isstring':
          const BkCispIfcwUT = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", String(${BkCispIfcwUT}) == ${BkCispIfcwUT})\n`;
          return;
        case 'mistsutils.isboolean':
          const qSJVytmPDmTz = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${qSJVytmPDmTz} == "true" || ${qSJVytmPDmTz} == "false")\n`;
          return;
        case 'mistsutils.tostring':
          const wZqwfMZxftZS = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${wZqwfMZxftZS})\n`;
          return;
        case 'mistsutils.tonumber':
          const DtGXupjXgCwV = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", isNaN(Number(${DtGXupjXgCwV})) ? 0 : Number(${DtGXupjXgCwV}))\n`;
          return;
        case 'mistsutils.toboolean':
          const HualXtCECfGo = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${HualXtCECfGo} == "true" || ${HualXtCECfGo} == "1" || ${HualXtCECfGo} == "yes" ? "true" : "false")\n`;
          return;

        case 'mistsutils.patchreporter':
          const VpEbqhQdWmdW = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${VpEbqhQdWmdW})\n`;
          return;
        case 'mistsutils.patchreporter2':
          const VesBQxlASnAN = this.descendInput(node?.A).asRaw();
          const uMVNFYrOFMwM = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${VesBQxlASnAN}${uMVNFYrOFMwM})\n`;
          return;
        case 'mistsutils.patchreporter3':
          const SNvjECAavzEN = this.descendInput(node?.A).asRaw();
          const LfAetnbjBNky = this.descendInput(node?.B).asRaw();
          const fldfRuyIbUqv = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${SNvjECAavzEN}${LfAetnbjBNky}${fldfRuyIbUqv})\n`;
          return;
        case 'mistsutils.patchboolean':
          const hboXTNBhsACj = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${hboXTNBhsACj})\n`;
          return;
        case 'mistsutils.patchcommand':
          const EHrbaAJqwUAn = this.descendInput(node?.A).asRaw();
          this.source += `\n${EHrbaAJqwUAn}\n`;
          return;
        case 'mistsutils.patchcommand2':
          const SDntBfZhvuEf = this.descendInput(node?.A).asRaw();
          const dMXTgUBCvESK = this.descendInput(node?.B).asRaw();
          this.source += `\n${SDntBfZhvuEf}${dMXTgUBCvESK}\n`;
          return;
        case 'mistsutils.patchcommand3':
          const TsYsZlAFFdyy = this.descendInput(node?.A).asRaw();
          const PSMjKclqChbS = this.descendInput(node?.B).asRaw();
          const liZGcZaUYdIh = this.descendInput(node?.C).asRaw();
          this.source += `\n${TsYsZlAFFdyy}${PSMjKclqChbS}${liZGcZaUYdIh}\n`;
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
          const xnCbqwQNpdPN = this.descendInput(node?.A).asString();
          const KOWUcEPhoVwC = this.descendInput(node?.B).asString();
          return new TypedInput(`(${xnCbqwQNpdPN} !== ${KOWUcEPhoVwC})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const syEcomFhxGZF = this.descendInput(node?.A).asString();
          const HgIOPdQEpZSU = this.descendInput(node?.B).asString();
          return new TypedInput(`(${syEcomFhxGZF} === ${HgIOPdQEpZSU})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const rUuXrJvZEcld = this.descendInput(node?.A).asNumber();
          const vursOXsZFwDT = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${rUuXrJvZEcld} >= ${vursOXsZFwDT})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const BCMFlfGxDWFF = this.descendInput(node?.A).asNumber();
          const KRwHvFIbAotT = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${BCMFlfGxDWFF} <= ${KRwHvFIbAotT})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const YiwSmCNNxikm = this.descendInput(node?.A).asNumber();
          const ZXECtYTFHAPd = this.descendInput(node?.B).asNumber();
          const sYVdcGyhOiSV = this.descendInput(node?.C).asRaw();
          return new TypedInput(`(${YiwSmCNNxikm} ${sYVdcGyhOiSV} ${ZXECtYTFHAPd})`, TYPE_BOOLEAN);

        case 'mistsutils.power':
          const ZGJvOCpxHZNP = this.descendInput(node?.A).asNumber();
          const DJtSeAnBCHTp = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${ZGJvOCpxHZNP}, ${DJtSeAnBCHTp})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const yPvUjmscNLsU = this.descendInput(node?.A).asNumber();
          const xzAiIeAGjRoc = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.round((${yPvUjmscNLsU} / ${xzAiIeAGjRoc}) * ${xzAiIeAGjRoc})`, TYPE_NUMBER);
        case 'mistsutils.undefined':
          return new TypedInput(`undefined`, TYPE_UNKNOWN);
        case 'mistsutils.clamp':
          const nCAYwNASYrLt = this.descendInput(node?.A).asNumber();
          const LMGlcoMpSvTl = this.descendInput(node?.B).asNumber();
          const ieyslCWRFKmw = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${nCAYwNASYrLt}, ${LMGlcoMpSvTl}), ${ieyslCWRFKmw})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const aAKUrWCkJTyF = this.descendInput(node?.A).asNumber();
          const unzEtdIgPxie = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.min(${aAKUrWCkJTyF}, ${unzEtdIgPxie})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const esGRjIxAPFHu = this.descendInput(node?.A).asNumber();
          const ZZjNCRBATolt = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.max(${esGRjIxAPFHu}, ${ZZjNCRBATolt})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const HVtTzwHHbkkI = this.descendInput(node?.A).asNumber();
          const XaLgWwtAbkna = this.descendInput(node?.B).asNumber();
          const UxIdStougfcY = this.descendInput(node?.C).asNumber();
          return new TypedInput(`${XaLgWwtAbkna} + ((${UxIdStougfcY} - ${XaLgWwtAbkna}) / ${HVtTzwHHbkkI})`, TYPE_NUMBER);

        case 'mistsutils.?':
          const xqOvAxKHQDzq = this.descendInput(node?.A).asBoolean();
          const TILcQDiZoVYS = this.descendInput(node?.B).asString();
          const gpfXBubIfWgD = this.descendInput(node?.C).asString();
          return new TypedInput(`(${xqOvAxKHQDzq} ? ${TILcQDiZoVYS} : ${gpfXBubIfWgD})`, TYPE_STRING);
        case 'mistsutils.letters':
          const MXLbdyOWNzJV = this.descendInput(node?.A).asNumber();
          const yUeJEfDtNdjw = this.descendInput(node?.B).asNumber();
          const EjXPYRMVGmGp = this.descendInput(node?.C).asString();
          return new TypedInput(`(${EjXPYRMVGmGp}).substring(${MXLbdyOWNzJV}, ${yUeJEfDtNdjw})`, TYPE_STRING);
        case 'mistsutils.starts':
          const OkMZJngyebyw = this.descendInput(node?.A).asString();
          const TRgrrKittfsJ = this.descendInput(node?.B).asString();
          return new TypedInput(`(${OkMZJngyebyw}).startsWith(${TRgrrKittfsJ})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const nCxjlmNhlyOa = this.descendInput(node?.A).asString();
          const MoHvsnvlePgl = this.descendInput(node?.B).asString();
          return new TypedInput(`(${nCxjlmNhlyOa}).endsWith(${MoHvsnvlePgl})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const cZZohhklcJdb = this.descendInput(node?.A).asString();
          return new TypedInput(`(${cZZohhklcJdb}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const LLyWeNIweyjj = this.descendInput(node?.A).asString();
          const qAWIJZfkaurn = this.descendInput(node?.B).asString();
          const SEwRjlAFVagp = this.descendInput(node?.C).asString();
          return new TypedInput(`(${SEwRjlAFVagp} === "" ? ${LLyWeNIweyjj} : (${LLyWeNIweyjj}).replace(${SEwRjlAFVagp}, ${qAWIJZfkaurn}))`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const TqnPSpueTdgf = this.descendInput(node?.A).asString();
          const LtqzxqhAmHZZ = this.descendInput(node?.B).asString();
          const VmPAbLyehMes = this.descendInput(node?.C).asString();
          return new TypedInput(`(${VmPAbLyehMes} === "" ? ${TqnPSpueTdgf} : (${TqnPSpueTdgf}).replaceAll(${VmPAbLyehMes}, ${LtqzxqhAmHZZ}))`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const vpAjynvOSaEB = this.descendInput(node?.A).asString();
          const gRFzIPnzIjiS = this.descendInput(node?.B).asString();
          return new TypedInput(`(${vpAjynvOSaEB}).substring((${vpAjynvOSaEB}).indexOf(""+(${gRFzIPnzIjiS})) + 1, ((${vpAjynvOSaEB}).length)`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const KKOHMFqpUikE = this.descendInput(node?.A).asString();
          const cGoJhNbfojcW = this.descendInput(node?.B).asString();
          return new TypedInput(`(${KKOHMFqpUikE}).split(${cGoJhNbfojcW}, 1)[0]`, TYPE_STRING);

        case 'mistsutils.split':
          const OiXHVsSNoXwz = this.descendInput(node?.A).asString();
          const FMMsjLmyqXAm = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((${OiXHVsSNoXwz}).split(${FMMsjLmyqXAm}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const wQqPqQNYvIBX = this.descendInput(node?.A).asString();
          const znfuVeVnFoWb = this.descendInput(node?.B).asString();
          return new TypedInput(`(${wQqPqQNYvIBX}).split(${znfuVeVnFoWb})`, TYPE_STRING);
        case 'mistsutils.length':
          const PAZSOpgqIdRv = this.descendInput(node?.A).asString();
          return new TypedInput(`((${PAZSOpgqIdRv}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const cxamZoNgVSHC = this.descendInput(node?.A).asString();
          const ScXEeGoXmAHi = this.descendInput(node?.B).asString();
          const wJxAtGouIzps = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(${cxamZoNgVSHC}).split(${ScXEeGoXmAHi})[${wJxAtGouIzps}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const qZZusoTlaRge = this.descendInput(node?.A).asString();
          const IkOsIAVazDhI = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${qZZusoTlaRge}[${IkOsIAVazDhI}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const ztbwcjYLGLss = this.descendInput(node?.A).asString();
          const bUujEIpihSok = this.descendInput(node?.B).asString();
          const dZkgqYDOPUeZ = this.descendInput(node?.C).asString();
          return new TypedInput(`${ztbwcjYLGLss}[${bUujEIpihSok}] = ${dZkgqYDOPUeZ}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const szMcWuUeihvw = this.descendInput(node?.A).asString();
          const pkvmQIXIeMth = this.descendInput(node?.B).asString();
          return new TypedInput(`(${szMcWuUeihvw})[${pkvmQIXIeMth}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const OharHLTZCjpW = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${OharHLTZCjpW})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const whZrNwpaRsZa = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${whZrNwpaRsZa})`, TYPE_STRING);

        case 'mistsutils.getVariableIdByName':
          const KqXgHyeXcylB = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${KqXgHyeXcylB} && variable.type !== "list")[0]?.id ?? ""`, TYPE_STRING);
        case 'mistsutils.getSpriteListIdByName':
          const OpfIUZjioKdF = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${OpfIUZjioKdF} && variable.type === "list")[0]?.id ?? ""`, TYPE_STRING);

        case 'mistsutils.getStageVariableIdByName':
          const jLWaOmVFidSc = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${jLWaOmVFidSc} && variable.type !== "list")[0]?.id ?? ""`, TYPE_STRING);
        case 'mistsutils.getStageListIdByName':
          const WRttaTzqzHlK = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${WRttaTzqzHlK} && variable.type === "list")[0]?.id ?? ""`, TYPE_STRING);
        case 'mistsutils.setSpriteVariableById':
          const UOBIGVfRMWAP = this.descendInput(node?.A).asString();
          const GSrFYlhGSrPV = this.descendInput(node?.B).asString();
          return new TypedInput(`vm.editingTarget.variables[${UOBIGVfRMWAP}].value = ${GSrFYlhGSrPV}`, TYPE_UNKNOWN);
        case 'mistsutils.setStageVariableById':
          const yPhutDWCHUYn = this.descendInput(node?.A).asString();
          const XeJJcXZVqqxb = this.descendInput(node?.B).asString();
          return new TypedInput(`vm.runtime.getTargetForStage().variables[${yPhutDWCHUYn}].value = ${XeJJcXZVqqxb}`, TYPE_UNKNOWN);

        case 'mistsutils.isnumber':
          const IDVBSVREhEDf = this.descendInput(node?.A).asString();
          return new TypedInput(`Number(${IDVBSVREhEDf}) == ${IDVBSVREhEDf}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const BkCispIfcwUT = this.descendInput(node?.A).asString();
          return new TypedInput(`String(${BkCispIfcwUT}) == ${BkCispIfcwUT}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const qSJVytmPDmTz = this.descendInput(node?.A).asString();
          return new TypedInput(`${qSJVytmPDmTz} == "true" || ${qSJVytmPDmTz} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const wZqwfMZxftZS = this.descendInput(node?.A).asString();
          return new TypedInput(`${wZqwfMZxftZS}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const DtGXupjXgCwV = this.descendInput(node?.A).asString();
          return new TypedInput(`isNaN(Number(${DtGXupjXgCwV})) ? 0 : Number(${DtGXupjXgCwV})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const HualXtCECfGo = this.descendInput(node?.A).asString();
          return new TypedInput(`${HualXtCECfGo} == "true" || ${HualXtCECfGo} == "1" || ${HualXtCECfGo} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);

        case 'mistsutils.patchreporter':
          const VpEbqhQdWmdW = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${VpEbqhQdWmdW}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const VesBQxlASnAN = this.descendInput(node?.A).asRaw();
          const uMVNFYrOFMwM = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${VesBQxlASnAN}${uMVNFYrOFMwM}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const SNvjECAavzEN = this.descendInput(node?.A).asRaw();
          const LfAetnbjBNky = this.descendInput(node?.B).asRaw();
          const fldfRuyIbUqv = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${SNvjECAavzEN}${LfAetnbjBNky}${fldfRuyIbUqv}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const hboXTNBhsACj = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${hboXTNBhsACj}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const EHrbaAJqwUAn = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${EHrbaAJqwUAn}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const SDntBfZhvuEf = this.descendInput(node?.A).asRaw();
          const dMXTgUBCvESK = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${SDntBfZhvuEf}${dMXTgUBCvESK}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const TsYsZlAFFdyy = this.descendInput(node?.A).asRaw();
          const PSMjKclqChbS = this.descendInput(node?.B).asRaw();
          const liZGcZaUYdIh = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${TsYsZlAFFdyy}${PSMjKclqChbS}${liZGcZaUYdIh}`, TYPE_UNKNOWN);

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

        case 'mistsutils_getVariableIdByName':
          return {
            block, kind: 'mistsutils.getVariableIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_getSpriteListIdByName':
          return {
            block, kind: 'mistsutils.getSpriteListIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };

        case 'mistsutils_getStageVariableIdByName':
          return {
            block, kind: 'mistsutils.getStageVariableIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_getStageListIdByName':
          return {
            block, kind: 'mistsutils.getStageListIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_setSpriteVariableById':
          return {
            block, kind: 'mistsutils.setSpriteVariableById',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_setStageVariableById':
          return {
            block, kind: 'mistsutils.setStageVariableById',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
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

        case 'mistsutils_getVariableIdByName':
          return {
            block,
            kind: 'mistsutils.getVariableIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_getSpriteListIdByName':
          return {
            block,
            kind: 'mistsutils.getSpriteListIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };

        case 'mistsutils_getStageVariableIdByName':
          return {
            block,
            kind: 'mistsutils.getStageVariableIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_getStageListIdByName':
          return {
            block,
            kind: 'mistsutils.getStageListIdByName',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_setSpriteVariableById':
          return {
            block,
            kind: 'mistsutils.setSpriteVariableById',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_setStageVariableById':
          return {
            block,
            kind: 'mistsutils.setStageVariableById',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
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
