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
            "code": "(${ZZvYAmSsBOGZ} !== ${DpLKEyuTLNbT})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ZZvYAmSsBOGZ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "DpLKEyuTLNbT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "equals",
            "text": "[A] === [B]",
            "code": "(${hfioqcsrqXlg} === ${syleWUYaQqvN})",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "hfioqcsrqXlg"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "syleWUYaQqvN"
              }
            },
            "func": "err"
          },
          {
            "opcode": "greaterorequal",
            "text": "[A] >= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${RxRexylJuktu} >= ${iOWGrfhYZkUq})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "RxRexylJuktu"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "iOWGrfhYZkUq"
              }
            },
            "func": "err"
          },
          {
            "opcode": "lessthanorequal",
            "text": "[A] <= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${HQKPjVIGWHKu} <= ${sMKVhnxUUgEZ})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "HQKPjVIGWHKu"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "sMKVhnxUUgEZ"
              }
            },
            "func": "err"
          },
          {
            "opcode": "compare",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${sOLCoHIoTXGW} ${UQBGzahmPSKu} ${RTofpjoAQlHH})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "sOLCoHIoTXGW"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "RTofpjoAQlHH"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "<",
                "gen_id": "UQBGzahmPSKu"
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
            "code": "Math.pow(${hlcvMFOlKDuk}, ${XZjhKQyEhPgz})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "hlcvMFOlKDuk"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "XZjhKQyEhPgz"
              }
            },
            "func": "err"
          },
          {
            "opcode": "round",
            "text": "round [A] to the nearest [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.round((${iwxHSMuTGXJz} / ${AoAkzWdWnJZw}) * ${AoAkzWdWnJZw})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "iwxHSMuTGXJz"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 10,
                "gen_id": "AoAkzWdWnJZw"
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
            "code": "Math.min(Math.max(${hgohoZSGXbgL}, ${yQeqmEkfSyxe}), ${EsbqPDMfwIde})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "hgohoZSGXbgL"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "yQeqmEkfSyxe"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "EsbqPDMfwIde"
              }
            },
            "func": "err"
          },
          {
            "opcode": "min",
            "text": "min of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(${povjdDTvGdYk}, ${DNudbTNJNyog})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "povjdDTvGdYk"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "DNudbTNJNyog"
              }
            },
            "func": "err"
          },
          {
            "opcode": "max",
            "text": "max of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.max(${zdFFMhXOppUi}, ${UfCkwJYkktmA})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "zdFFMhXOppUi"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "UfCkwJYkktmA"
              }
            },
            "func": "err"
          },
          {
            "opcode": "interpolate",
            "text": "smooth [B] to [C] by [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${OdgBirffmVOE} + ((${xTeXRYHOCBHg} - ${OdgBirffmVOE}) / ${EYbmNAvpFvKb})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "EYbmNAvpFvKb"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "OdgBirffmVOE"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "xTeXRYHOCBHg"
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
            "code": "(${jLKszdlYaNuF} ? (${ETATHafCjyGq} : ${MBNawnmYMIty}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.BOOLEAN,
                "defaultValue": false,
                "gen_id": "jLKszdlYaNuF"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "yes",
                "gen_id": "ETATHafCjyGq"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "no",
                "gen_id": "MBNawnmYMIty"
              }
            },
            "func": "err"
          },
          {
            "opcode": "letters",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${kXldyGglBDba}).substring(${oxLhxBgjeOes}, ${eZjsyArBNJwp})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "oxLhxBgjeOes"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "eZjsyArBNJwp"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "kXldyGglBDba"
              }
            },
            "func": "err"
          },
          {
            "opcode": "starts",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${YfqjRDyBdjYJ}).startsWith(${iMTipgKWzHok})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "YfqjRDyBdjYJ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "iMTipgKWzHok"
              }
            },
            "func": "err"
          },
          {
            "opcode": "ends",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${zKwHCeYeqLwH}).endsWith(${rvHGmZqXxzLw})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "zKwHCeYeqLwH"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "rvHGmZqXxzLw"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toUnicode",
            "text": "unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${aSFbxrZnluti}).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "aSFbxrZnluti"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replace",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${DJHxhodyMhrQ} === \"\" ? ${TMKGZGrUFJjk} : (${TMKGZGrUFJjk}).replace(${DJHxhodyMhrQ}, ${IYHyROGFpFQU}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "TMKGZGrUFJjk"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "IYHyROGFpFQU"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "DJHxhodyMhrQ"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replaceall",
            "text": "replace all [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${QcDULyOAqtgy} === \"\" ? ${rShNubOFEcra} : (${rShNubOFEcra}).replaceAll(${QcDULyOAqtgy}, ${hvJfRcwiuqSx}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "rShNubOFEcra"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "hvJfRcwiuqSx"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "QcDULyOAqtgy"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextAfterString",
            "text": "text after [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${EZFeJqkSciSy}).substring((${EZFeJqkSciSy}).indexOf(\"\"+(${hwZdtKexIJdd})) + 1, ((${EZFeJqkSciSy}).length)",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "EZFeJqkSciSy"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "hwZdtKexIJdd"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextBeforeString",
            "text": "text before [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${DmbwPZcygUIE}).split(${UmJKQPtqmvKg}, 1)[0]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "DmbwPZcygUIE"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "UmJKQPtqmvKg"
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
            "code": "JSON.stringify((${vsGInVZRQoYx}).split(${yclMGIdYFGDM}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "vsGInVZRQoYx"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "yclMGIdYFGDM"
              }
            },
            "func": "err"
          },
          {
            "opcode": "splitarray",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${ITDxXQhcQgiL}).split(${nQllylMAUeFi})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ITDxXQhcQgiL"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "nQllylMAUeFi"
              }
            },
            "func": "err"
          },
          {
            "opcode": "length",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${RTxLnctqghvf}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "RTxLnctqghvf"
              }
            },
            "func": "err"
          },
          {
            "opcode": "item",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${SYCDmPMNfCUN}).split(${qBIdoyDeRcDX})[${lxguiSBBFQFJ}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "SYCDmPMNfCUN"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "qBIdoyDeRcDX"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "lxguiSBBFQFJ"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsondelete",
            "text": "delete Item [B] of [A]",
            "code": "delete ${pBHXodtTEcjU}[${pXoxHfLgsOGT}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "pBHXodtTEcjU"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "pXoxHfLgsOGT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonset",
            "text": "set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${tPVFcIOCXXlE}[${zhisOybyBsNw}] = ${glEPIERkMwHN}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "tPVFcIOCXXlE"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "zhisOybyBsNw"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "glEPIERkMwHN"
              }
            },
            "func": "err"
          },
          {
            "opcode": "squarebrackets",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${OhfHZEdfEzRA})[${fnlFqzCeFaWF}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "OhfHZEdfEzRA"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "fnlFqzCeFaWF"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonparse",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${HnnflYJNQxif})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "HnnflYJNQxif"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonstringify",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${fEkOyLfWZWxk})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "fEkOyLfWZWxk"
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
            "code": "Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${JIdBaRHJcxVh} && variable.type !== \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "JIdBaRHJcxVh"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getSpriteListIdByName",
            "text": "get Sprite List ID of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${DwJIPlHZMPDw} && variable.type === \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "DwJIPlHZMPDw"
              }
            },
            "func": "err"
          },
          "---",
          {
            "opcode": "getStageVariableIdByName",
            "text": "get Stage Variable ID of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${JcNoKtmwrVvn} && variable.type !== \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "JcNoKtmwrVvn"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getStageListIdByName",
            "text": "get Stage List ID of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${JWneOLfhbRwN} && variable.type === \"list\")[0]?.id ?? \"\"",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "my variable",
                "gen_id": "JWneOLfhbRwN"
              }
            },
            "func": "err"
          },
          {
            "opcode": "setSpriteVariableById",
            "text": "set var/list in Sprite (id: [A] value: [B])",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "vm.editingTarget.variables[${FgxrTTQKyzvD}].value = ${DHkGSHDKnwqg}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "variable id",
                "gen_id": "FgxrTTQKyzvD"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "DHkGSHDKnwqg"
              }
            },
            "func": "err"
          },
          {
            "opcode": "setStageVariableById",
            "text": "set var/list in Stage (id: [A] value: [B])",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "vm.runtime.getTargetForStage().variables[${DidAzriHEVCY}].value = ${IugjZOGDnirX}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "variable id",
                "gen_id": "DidAzriHEVCY"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "IugjZOGDnirX"
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
            "code": "Number(${lsDecsshHeCT}) == ${lsDecsshHeCT}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "lsDecsshHeCT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isstring",
            "text": "[A] is a string",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "String(${qpeRFsnerPyr}) == ${qpeRFsnerPyr}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "qpeRFsnerPyr"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isboolean",
            "text": "[A] is a boolean",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${FhgshDgnladC} == \"true\" || ${FhgshDgnladC} == \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "FhgshDgnladC"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tostring",
            "text": "to string [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${wBKQCyeOggLr}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "wBKQCyeOggLr"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tonumber",
            "text": "to number [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "isNaN(Number(${DjgVDIuTVJIs})) ? 0 : Number(${DjgVDIuTVJIs})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "DjgVDIuTVJIs"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toboolean",
            "text": "to boolean [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${GvYGqhjmTLJQ} == \"true\" || ${GvYGqhjmTLJQ} == \"1\" || ${GvYGqhjmTLJQ} == \"yes\" ? \"true\" : \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "GvYGqhjmTLJQ"
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
            "code": "${OWDYKtOvQQyN}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "OWDYKtOvQQyN"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter2",
            "text": "patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${pZAdjAEegOYy}${uxrCOmiLDAZo}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "pZAdjAEegOYy"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "uxrCOmiLDAZo"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter3",
            "text": "patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${cZmUwKiEMXRN}${jZlzARXtFlhf}${UyZWxzhVzAWq}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "cZmUwKiEMXRN"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "jZlzARXtFlhf"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "UyZWxzhVzAWq"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchboolean",
            "text": "patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${SRqALExLaYDq}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "SRqALExLaYDq"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand",
            "text": "patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${dCfqgiVydzRG}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "dCfqgiVydzRG"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand2",
            "text": "patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${QDpUnhhdTuxv}${EBYemqGMPgyd}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "QDpUnhhdTuxv"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "EBYemqGMPgyd"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand3",
            "text": "patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${TdTLZHFxuLCq}${dSWKMgUizelP}${kyApRbbWqQph}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "TdTLZHFxuLCq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "dSWKMgUizelP"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "kyApRbbWqQph"
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
          const ZZvYAmSsBOGZ = this.descendInput(node?.A).asString();
          const DpLKEyuTLNbT = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ZZvYAmSsBOGZ} !== ${DpLKEyuTLNbT}))\n`;
          return;
        case 'mistsutils.equals':
          const hfioqcsrqXlg = this.descendInput(node?.A).asString();
          const syleWUYaQqvN = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${hfioqcsrqXlg} === ${syleWUYaQqvN}))\n`;
          return;
        case 'mistsutils.greaterorequal':
          const RxRexylJuktu = this.descendInput(node?.A).asNumber();
          const iOWGrfhYZkUq = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${RxRexylJuktu} >= ${iOWGrfhYZkUq}))\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const HQKPjVIGWHKu = this.descendInput(node?.A).asNumber();
          const sMKVhnxUUgEZ = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${HQKPjVIGWHKu} <= ${sMKVhnxUUgEZ}))\n`;
          return;
        case 'mistsutils.compare':
          const sOLCoHIoTXGW = this.descendInput(node?.A).asNumber();
          const RTofpjoAQlHH = this.descendInput(node?.B).asNumber();
          const UQBGzahmPSKu = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${sOLCoHIoTXGW} ${UQBGzahmPSKu} ${RTofpjoAQlHH}))\n`;
          return;

        case 'mistsutils.power':
          const hlcvMFOlKDuk = this.descendInput(node?.A).asNumber();
          const XZjhKQyEhPgz = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${hlcvMFOlKDuk}, ${XZjhKQyEhPgz}))\n`;
          return;
        case 'mistsutils.round':
          const iwxHSMuTGXJz = this.descendInput(node?.A).asNumber();
          const AoAkzWdWnJZw = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.round((${iwxHSMuTGXJz} / ${AoAkzWdWnJZw}) * ${AoAkzWdWnJZw}))\n`;
          return;
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;
        case 'mistsutils.clamp':
          const hgohoZSGXbgL = this.descendInput(node?.A).asNumber();
          const yQeqmEkfSyxe = this.descendInput(node?.B).asNumber();
          const EsbqPDMfwIde = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${hgohoZSGXbgL}, ${yQeqmEkfSyxe}), ${EsbqPDMfwIde}))\n`;
          return;
        case 'mistsutils.min':
          const povjdDTvGdYk = this.descendInput(node?.A).asNumber();
          const DNudbTNJNyog = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(${povjdDTvGdYk}, ${DNudbTNJNyog}))\n`;
          return;
        case 'mistsutils.max':
          const zdFFMhXOppUi = this.descendInput(node?.A).asNumber();
          const UfCkwJYkktmA = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(${zdFFMhXOppUi}, ${UfCkwJYkktmA}))\n`;
          return;
        case 'mistsutils.interpolate':
          const EYbmNAvpFvKb = this.descendInput(node?.A).asNumber();
          const OdgBirffmVOE = this.descendInput(node?.B).asNumber();
          const xTeXRYHOCBHg = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${OdgBirffmVOE} + ((${xTeXRYHOCBHg} - ${OdgBirffmVOE}) / ${EYbmNAvpFvKb}))\n`;
          return;

        case 'mistsutils.?':
          const jLKszdlYaNuF = this.descendInput(node?.A).asBoolean();
          const ETATHafCjyGq = this.descendInput(node?.B).asString();
          const MBNawnmYMIty = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${jLKszdlYaNuF} ? (${ETATHafCjyGq} : ${MBNawnmYMIty})))\n`;
          return;
        case 'mistsutils.letters':
          const oxLhxBgjeOes = this.descendInput(node?.A).asNumber();
          const eZjsyArBNJwp = this.descendInput(node?.B).asNumber();
          const kXldyGglBDba = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${kXldyGglBDba}).substring(${oxLhxBgjeOes}, ${eZjsyArBNJwp}))\n`;
          return;
        case 'mistsutils.starts':
          const YfqjRDyBdjYJ = this.descendInput(node?.A).asString();
          const iMTipgKWzHok = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${YfqjRDyBdjYJ}).startsWith(${iMTipgKWzHok}))\n`;
          return;
        case 'mistsutils.ends':
          const zKwHCeYeqLwH = this.descendInput(node?.A).asString();
          const rvHGmZqXxzLw = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${zKwHCeYeqLwH}).endsWith(${rvHGmZqXxzLw}))\n`;
          return;
        case 'mistsutils.toUnicode':
          const aSFbxrZnluti = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${aSFbxrZnluti}).charCodeAt(0))\n`;
          return;
        case 'mistsutils.replace':
          const TMKGZGrUFJjk = this.descendInput(node?.A).asString();
          const IYHyROGFpFQU = this.descendInput(node?.B).asString();
          const DJHxhodyMhrQ = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${DJHxhodyMhrQ} === "" ? ${TMKGZGrUFJjk} : (${TMKGZGrUFJjk}).replace(${DJHxhodyMhrQ}, ${IYHyROGFpFQU})))\n`;
          return;
        case 'mistsutils.replaceall':
          const rShNubOFEcra = this.descendInput(node?.A).asString();
          const hvJfRcwiuqSx = this.descendInput(node?.B).asString();
          const QcDULyOAqtgy = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${QcDULyOAqtgy} === "" ? ${rShNubOFEcra} : (${rShNubOFEcra}).replaceAll(${QcDULyOAqtgy}, ${hvJfRcwiuqSx})))\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const EZFeJqkSciSy = this.descendInput(node?.A).asString();
          const hwZdtKexIJdd = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${EZFeJqkSciSy}).substring((${EZFeJqkSciSy}).indexOf(""+(${hwZdtKexIJdd})) + 1, ((${EZFeJqkSciSy}).length))\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const DmbwPZcygUIE = this.descendInput(node?.A).asString();
          const UmJKQPtqmvKg = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${DmbwPZcygUIE}).split(${UmJKQPtqmvKg}, 1)[0])\n`;
          return;

        case 'mistsutils.split':
          const vsGInVZRQoYx = this.descendInput(node?.A).asString();
          const yclMGIdYFGDM = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${vsGInVZRQoYx}).split(${yclMGIdYFGDM})))\n`;
          return;
        case 'mistsutils.splitarray':
          const ITDxXQhcQgiL = this.descendInput(node?.A).asString();
          const nQllylMAUeFi = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ITDxXQhcQgiL}).split(${nQllylMAUeFi}))\n`;
          return;
        case 'mistsutils.length':
          const RTxLnctqghvf = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${RTxLnctqghvf}).length))\n`;
          return;
        case 'mistsutils.item':
          const SYCDmPMNfCUN = this.descendInput(node?.A).asString();
          const qBIdoyDeRcDX = this.descendInput(node?.B).asString();
          const lxguiSBBFQFJ = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${SYCDmPMNfCUN}).split(${qBIdoyDeRcDX})[${lxguiSBBFQFJ}])\n`;
          return;
        case 'mistsutils.jsondelete':
          const pBHXodtTEcjU = this.descendInput(node?.A).asString();
          const pXoxHfLgsOGT = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${pBHXodtTEcjU}[${pXoxHfLgsOGT}]\n`;
          return;
        case 'mistsutils.jsonset':
          const tPVFcIOCXXlE = this.descendInput(node?.A).asString();
          const zhisOybyBsNw = this.descendInput(node?.B).asString();
          const glEPIERkMwHN = this.descendInput(node?.C).asString();
          this.source += `\n${tPVFcIOCXXlE}[${zhisOybyBsNw}] = ${glEPIERkMwHN}\n`;
          return;
        case 'mistsutils.squarebrackets':
          const OhfHZEdfEzRA = this.descendInput(node?.A).asString();
          const fnlFqzCeFaWF = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${OhfHZEdfEzRA})[${fnlFqzCeFaWF}])\n`;
          return;
        case 'mistsutils.jsonparse':
          const HnnflYJNQxif = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${HnnflYJNQxif}))\n`;
          return;
        case 'mistsutils.jsonstringify':
          const fEkOyLfWZWxk = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${fEkOyLfWZWxk}))\n`;
          return;

        case 'mistsutils.getVariableIdByName':
          const JIdBaRHJcxVh = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${JIdBaRHJcxVh} && variable.type !== "list")[0]?.id ?? "")\n`;
          return;
        case 'mistsutils.getSpriteListIdByName':
          const DwJIPlHZMPDw = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${DwJIPlHZMPDw} && variable.type === "list")[0]?.id ?? "")\n`;
          return;

        case 'mistsutils.getStageVariableIdByName':
          const JcNoKtmwrVvn = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${JcNoKtmwrVvn} && variable.type !== "list")[0]?.id ?? "")\n`;
          return;
        case 'mistsutils.getStageListIdByName':
          const JWneOLfhbRwN = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${JWneOLfhbRwN} && variable.type === "list")[0]?.id ?? "")\n`;
          return;
        case 'mistsutils.setSpriteVariableById':
          const FgxrTTQKyzvD = this.descendInput(node?.A).asString();
          const DHkGSHDKnwqg = this.descendInput(node?.B).asString();
          this.source += `\nvm.editingTarget.variables[${FgxrTTQKyzvD}].value = ${DHkGSHDKnwqg}\n`;
          return;
        case 'mistsutils.setStageVariableById':
          const DidAzriHEVCY = this.descendInput(node?.A).asString();
          const IugjZOGDnirX = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.getTargetForStage().variables[${DidAzriHEVCY}].value = ${IugjZOGDnirX}\n`;
          return;

        case 'mistsutils.isnumber':
          const lsDecsshHeCT = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Number(${lsDecsshHeCT}) == ${lsDecsshHeCT})\n`;
          return;
        case 'mistsutils.isstring':
          const qpeRFsnerPyr = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", String(${qpeRFsnerPyr}) == ${qpeRFsnerPyr})\n`;
          return;
        case 'mistsutils.isboolean':
          const FhgshDgnladC = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${FhgshDgnladC} == "true" || ${FhgshDgnladC} == "false")\n`;
          return;
        case 'mistsutils.tostring':
          const wBKQCyeOggLr = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${wBKQCyeOggLr})\n`;
          return;
        case 'mistsutils.tonumber':
          const DjgVDIuTVJIs = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", isNaN(Number(${DjgVDIuTVJIs})) ? 0 : Number(${DjgVDIuTVJIs}))\n`;
          return;
        case 'mistsutils.toboolean':
          const GvYGqhjmTLJQ = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${GvYGqhjmTLJQ} == "true" || ${GvYGqhjmTLJQ} == "1" || ${GvYGqhjmTLJQ} == "yes" ? "true" : "false")\n`;
          return;

        case 'mistsutils.patchreporter':
          const OWDYKtOvQQyN = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${OWDYKtOvQQyN})\n`;
          return;
        case 'mistsutils.patchreporter2':
          const pZAdjAEegOYy = this.descendInput(node?.A).asRaw();
          const uxrCOmiLDAZo = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${pZAdjAEegOYy}${uxrCOmiLDAZo})\n`;
          return;
        case 'mistsutils.patchreporter3':
          const cZmUwKiEMXRN = this.descendInput(node?.A).asRaw();
          const jZlzARXtFlhf = this.descendInput(node?.B).asRaw();
          const UyZWxzhVzAWq = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${cZmUwKiEMXRN}${jZlzARXtFlhf}${UyZWxzhVzAWq})\n`;
          return;
        case 'mistsutils.patchboolean':
          const SRqALExLaYDq = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${SRqALExLaYDq})\n`;
          return;
        case 'mistsutils.patchcommand':
          const dCfqgiVydzRG = this.descendInput(node?.A).asRaw();
          this.source += `\n${dCfqgiVydzRG}\n`;
          return;
        case 'mistsutils.patchcommand2':
          const QDpUnhhdTuxv = this.descendInput(node?.A).asRaw();
          const EBYemqGMPgyd = this.descendInput(node?.B).asRaw();
          this.source += `\n${QDpUnhhdTuxv}${EBYemqGMPgyd}\n`;
          return;
        case 'mistsutils.patchcommand3':
          const TdTLZHFxuLCq = this.descendInput(node?.A).asRaw();
          const dSWKMgUizelP = this.descendInput(node?.B).asRaw();
          const kyApRbbWqQph = this.descendInput(node?.C).asRaw();
          this.source += `\n${TdTLZHFxuLCq}${dSWKMgUizelP}${kyApRbbWqQph}\n`;
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
          const ZZvYAmSsBOGZ = this.descendInput(node?.A).asString();
          const DpLKEyuTLNbT = this.descendInput(node?.B).asString();
          return new TypedInput(`(${ZZvYAmSsBOGZ} !== ${DpLKEyuTLNbT})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const hfioqcsrqXlg = this.descendInput(node?.A).asString();
          const syleWUYaQqvN = this.descendInput(node?.B).asString();
          return new TypedInput(`(${hfioqcsrqXlg} === ${syleWUYaQqvN})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const RxRexylJuktu = this.descendInput(node?.A).asNumber();
          const iOWGrfhYZkUq = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${RxRexylJuktu} >= ${iOWGrfhYZkUq})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const HQKPjVIGWHKu = this.descendInput(node?.A).asNumber();
          const sMKVhnxUUgEZ = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${HQKPjVIGWHKu} <= ${sMKVhnxUUgEZ})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const sOLCoHIoTXGW = this.descendInput(node?.A).asNumber();
          const RTofpjoAQlHH = this.descendInput(node?.B).asNumber();
          const UQBGzahmPSKu = this.descendInput(node?.C).asRaw();
          return new TypedInput(`(${sOLCoHIoTXGW} ${UQBGzahmPSKu} ${RTofpjoAQlHH})`, TYPE_BOOLEAN);

        case 'mistsutils.power':
          const hlcvMFOlKDuk = this.descendInput(node?.A).asNumber();
          const XZjhKQyEhPgz = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${hlcvMFOlKDuk}, ${XZjhKQyEhPgz})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const iwxHSMuTGXJz = this.descendInput(node?.A).asNumber();
          const AoAkzWdWnJZw = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.round((${iwxHSMuTGXJz} / ${AoAkzWdWnJZw}) * ${AoAkzWdWnJZw})`, TYPE_NUMBER);
        case 'mistsutils.undefined':
          return new TypedInput(`undefined`, TYPE_UNKNOWN);
        case 'mistsutils.clamp':
          const hgohoZSGXbgL = this.descendInput(node?.A).asNumber();
          const yQeqmEkfSyxe = this.descendInput(node?.B).asNumber();
          const EsbqPDMfwIde = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${hgohoZSGXbgL}, ${yQeqmEkfSyxe}), ${EsbqPDMfwIde})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const povjdDTvGdYk = this.descendInput(node?.A).asNumber();
          const DNudbTNJNyog = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.min(${povjdDTvGdYk}, ${DNudbTNJNyog})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const zdFFMhXOppUi = this.descendInput(node?.A).asNumber();
          const UfCkwJYkktmA = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.max(${zdFFMhXOppUi}, ${UfCkwJYkktmA})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const EYbmNAvpFvKb = this.descendInput(node?.A).asNumber();
          const OdgBirffmVOE = this.descendInput(node?.B).asNumber();
          const xTeXRYHOCBHg = this.descendInput(node?.C).asNumber();
          return new TypedInput(`${OdgBirffmVOE} + ((${xTeXRYHOCBHg} - ${OdgBirffmVOE}) / ${EYbmNAvpFvKb})`, TYPE_NUMBER);

        case 'mistsutils.?':
          const jLKszdlYaNuF = this.descendInput(node?.A).asBoolean();
          const ETATHafCjyGq = this.descendInput(node?.B).asString();
          const MBNawnmYMIty = this.descendInput(node?.C).asString();
          return new TypedInput(`(${jLKszdlYaNuF} ? (${ETATHafCjyGq} : ${MBNawnmYMIty}))`, TYPE_STRING);
        case 'mistsutils.letters':
          const oxLhxBgjeOes = this.descendInput(node?.A).asNumber();
          const eZjsyArBNJwp = this.descendInput(node?.B).asNumber();
          const kXldyGglBDba = this.descendInput(node?.C).asString();
          return new TypedInput(`(${kXldyGglBDba}).substring(${oxLhxBgjeOes}, ${eZjsyArBNJwp})`, TYPE_STRING);
        case 'mistsutils.starts':
          const YfqjRDyBdjYJ = this.descendInput(node?.A).asString();
          const iMTipgKWzHok = this.descendInput(node?.B).asString();
          return new TypedInput(`(${YfqjRDyBdjYJ}).startsWith(${iMTipgKWzHok})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const zKwHCeYeqLwH = this.descendInput(node?.A).asString();
          const rvHGmZqXxzLw = this.descendInput(node?.B).asString();
          return new TypedInput(`(${zKwHCeYeqLwH}).endsWith(${rvHGmZqXxzLw})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const aSFbxrZnluti = this.descendInput(node?.A).asString();
          return new TypedInput(`(${aSFbxrZnluti}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const TMKGZGrUFJjk = this.descendInput(node?.A).asString();
          const IYHyROGFpFQU = this.descendInput(node?.B).asString();
          const DJHxhodyMhrQ = this.descendInput(node?.C).asString();
          return new TypedInput(`(${DJHxhodyMhrQ} === "" ? ${TMKGZGrUFJjk} : (${TMKGZGrUFJjk}).replace(${DJHxhodyMhrQ}, ${IYHyROGFpFQU}))`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const rShNubOFEcra = this.descendInput(node?.A).asString();
          const hvJfRcwiuqSx = this.descendInput(node?.B).asString();
          const QcDULyOAqtgy = this.descendInput(node?.C).asString();
          return new TypedInput(`(${QcDULyOAqtgy} === "" ? ${rShNubOFEcra} : (${rShNubOFEcra}).replaceAll(${QcDULyOAqtgy}, ${hvJfRcwiuqSx}))`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const EZFeJqkSciSy = this.descendInput(node?.A).asString();
          const hwZdtKexIJdd = this.descendInput(node?.B).asString();
          return new TypedInput(`(${EZFeJqkSciSy}).substring((${EZFeJqkSciSy}).indexOf(""+(${hwZdtKexIJdd})) + 1, ((${EZFeJqkSciSy}).length)`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const DmbwPZcygUIE = this.descendInput(node?.A).asString();
          const UmJKQPtqmvKg = this.descendInput(node?.B).asString();
          return new TypedInput(`(${DmbwPZcygUIE}).split(${UmJKQPtqmvKg}, 1)[0]`, TYPE_STRING);

        case 'mistsutils.split':
          const vsGInVZRQoYx = this.descendInput(node?.A).asString();
          const yclMGIdYFGDM = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((${vsGInVZRQoYx}).split(${yclMGIdYFGDM}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const ITDxXQhcQgiL = this.descendInput(node?.A).asString();
          const nQllylMAUeFi = this.descendInput(node?.B).asString();
          return new TypedInput(`(${ITDxXQhcQgiL}).split(${nQllylMAUeFi})`, TYPE_STRING);
        case 'mistsutils.length':
          const RTxLnctqghvf = this.descendInput(node?.A).asString();
          return new TypedInput(`((${RTxLnctqghvf}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const SYCDmPMNfCUN = this.descendInput(node?.A).asString();
          const qBIdoyDeRcDX = this.descendInput(node?.B).asString();
          const lxguiSBBFQFJ = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(${SYCDmPMNfCUN}).split(${qBIdoyDeRcDX})[${lxguiSBBFQFJ}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const pBHXodtTEcjU = this.descendInput(node?.A).asString();
          const pXoxHfLgsOGT = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${pBHXodtTEcjU}[${pXoxHfLgsOGT}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const tPVFcIOCXXlE = this.descendInput(node?.A).asString();
          const zhisOybyBsNw = this.descendInput(node?.B).asString();
          const glEPIERkMwHN = this.descendInput(node?.C).asString();
          return new TypedInput(`${tPVFcIOCXXlE}[${zhisOybyBsNw}] = ${glEPIERkMwHN}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const OhfHZEdfEzRA = this.descendInput(node?.A).asString();
          const fnlFqzCeFaWF = this.descendInput(node?.B).asString();
          return new TypedInput(`(${OhfHZEdfEzRA})[${fnlFqzCeFaWF}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const HnnflYJNQxif = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${HnnflYJNQxif})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const fEkOyLfWZWxk = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${fEkOyLfWZWxk})`, TYPE_STRING);

        case 'mistsutils.getVariableIdByName':
          const JIdBaRHJcxVh = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${JIdBaRHJcxVh} && variable.type !== "list")[0]?.id ?? ""`, TYPE_STRING);
        case 'mistsutils.getSpriteListIdByName':
          const DwJIPlHZMPDw = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.editingTarget.variables).filter(variable => variable.name === ${DwJIPlHZMPDw} && variable.type === "list")[0]?.id ?? ""`, TYPE_STRING);

        case 'mistsutils.getStageVariableIdByName':
          const JcNoKtmwrVvn = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${JcNoKtmwrVvn} && variable.type !== "list")[0]?.id ?? ""`, TYPE_STRING);
        case 'mistsutils.getStageListIdByName':
          const JWneOLfhbRwN = this.descendInput(node?.A).asString();
          return new TypedInput(`Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === ${JWneOLfhbRwN} && variable.type === "list")[0]?.id ?? ""`, TYPE_STRING);
        case 'mistsutils.setSpriteVariableById':
          const FgxrTTQKyzvD = this.descendInput(node?.A).asString();
          const DHkGSHDKnwqg = this.descendInput(node?.B).asString();
          return new TypedInput(`vm.editingTarget.variables[${FgxrTTQKyzvD}].value = ${DHkGSHDKnwqg}`, TYPE_UNKNOWN);
        case 'mistsutils.setStageVariableById':
          const DidAzriHEVCY = this.descendInput(node?.A).asString();
          const IugjZOGDnirX = this.descendInput(node?.B).asString();
          return new TypedInput(`vm.runtime.getTargetForStage().variables[${DidAzriHEVCY}].value = ${IugjZOGDnirX}`, TYPE_UNKNOWN);

        case 'mistsutils.isnumber':
          const lsDecsshHeCT = this.descendInput(node?.A).asString();
          return new TypedInput(`Number(${lsDecsshHeCT}) == ${lsDecsshHeCT}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const qpeRFsnerPyr = this.descendInput(node?.A).asString();
          return new TypedInput(`String(${qpeRFsnerPyr}) == ${qpeRFsnerPyr}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const FhgshDgnladC = this.descendInput(node?.A).asString();
          return new TypedInput(`${FhgshDgnladC} == "true" || ${FhgshDgnladC} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const wBKQCyeOggLr = this.descendInput(node?.A).asString();
          return new TypedInput(`${wBKQCyeOggLr}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const DjgVDIuTVJIs = this.descendInput(node?.A).asString();
          return new TypedInput(`isNaN(Number(${DjgVDIuTVJIs})) ? 0 : Number(${DjgVDIuTVJIs})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const GvYGqhjmTLJQ = this.descendInput(node?.A).asString();
          return new TypedInput(`${GvYGqhjmTLJQ} == "true" || ${GvYGqhjmTLJQ} == "1" || ${GvYGqhjmTLJQ} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);

        case 'mistsutils.patchreporter':
          const OWDYKtOvQQyN = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${OWDYKtOvQQyN}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const pZAdjAEegOYy = this.descendInput(node?.A).asRaw();
          const uxrCOmiLDAZo = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${pZAdjAEegOYy}${uxrCOmiLDAZo}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const cZmUwKiEMXRN = this.descendInput(node?.A).asRaw();
          const jZlzARXtFlhf = this.descendInput(node?.B).asRaw();
          const UyZWxzhVzAWq = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${cZmUwKiEMXRN}${jZlzARXtFlhf}${UyZWxzhVzAWq}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const SRqALExLaYDq = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${SRqALExLaYDq}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const dCfqgiVydzRG = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${dCfqgiVydzRG}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const QDpUnhhdTuxv = this.descendInput(node?.A).asRaw();
          const EBYemqGMPgyd = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${QDpUnhhdTuxv}${EBYemqGMPgyd}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const TdTLZHFxuLCq = this.descendInput(node?.A).asRaw();
          const dSWKMgUizelP = this.descendInput(node?.B).asRaw();
          const kyApRbbWqQph = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${TdTLZHFxuLCq}${dSWKMgUizelP}${kyApRbbWqQph}`, TYPE_UNKNOWN);

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
