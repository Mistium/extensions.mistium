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

      console.log("loaded mist's utils!");
      // fetch the extension from github
      // compare it to the current file
      fetch("https://raw.githubusercontent.com/Mistium/extensions.mistium/main/featured/Mist's%20Utils.js")
        .then((res) => res.text())
        .then((text) => {
          if (text.includes("version: 5.1,")) {
            console.log("no new updates");
          } else {
            console.log("new update available");
            this.newUpdate = true
          }
        });

    }

    getInfo() {
      return {
        id: 'mistsutils',
        name: 'Mists Utils',
        color1: '#2DA4A0',
        version: 5.1,
        blocks: [{
            "blockType": Scratch.BlockType.BUTTON,
            "text": "New Version Available!",
            "func": "err",
            "hideFromPallet": !newUpdate
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Comparisons"
          },
          {
            "opcode": "notequals",
            "func": "err",
            "text": "[A] !== [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${uDYsMumpNcKu} !== ${YSIIWGikdcGt})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "uDYsMumpNcKu"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "YSIIWGikdcGt"
              }
            }
          },
          {
            "opcode": "equals",
            "func": "err",
            "text": "[A] === [B]",
            "code": "(${FZBeobDJFkIr} === ${ghnJovzNQBAB})",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "FZBeobDJFkIr"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ghnJovzNQBAB"
              }
            }
          },
          {
            "opcode": "greaterorequal",
            "func": "err",
            "text": "[A] >= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${lFYutmSrkaLh} >= ${GKcKtoXVvDed})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "lFYutmSrkaLh"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "GKcKtoXVvDed"
              }
            }
          },
          {
            "opcode": "lessthanorequal",
            "func": "err",
            "text": "[A] <= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${HVstTcWlpmla} <= ${DLhLOYoutuRa})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "HVstTcWlpmla"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "DLhLOYoutuRa"
              }
            }
          },
          {
            "opcode": "compare",
            "func": "err",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${lqieAmYFCUFx} ${moMxwyjTpwlq} ${hjAvogxkGwVM})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "lqieAmYFCUFx"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "hjAvogxkGwVM"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "<",
                "gen_id": "moMxwyjTpwlq"
              }
            }
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Maths"
          },
          {
            "opcode": "power",
            "func": "err",
            "text": "[A] ^ [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.pow(${GfcuqVleXSru}, ${vDTkHiUWtNwi})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "GfcuqVleXSru"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "vDTkHiUWtNwi"
              }
            }
          },
          {
            "opcode": "round",
            "func": "err",
            "text": "round [A] to the nearest [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.round((${kJefGPraufMg} / ${GQlUewbJjySW}) * ${GQlUewbJjySW})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "kJefGPraufMg"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 10,
                "gen_id": "GQlUewbJjySW"
              }
            }
          },
          {
            "func": "err"
          },
          {
            "opcode": "clamp",
            "func": "err",
            "text": "clamp [A] between [B] and [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(Math.max(${MpjxHnBdHBFl}, ${kArOwTjJvKLX}), ${PvwcNAYhyYge})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "MpjxHnBdHBFl"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "kArOwTjJvKLX"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "PvwcNAYhyYge"
              }
            }
          },
          {
            "opcode": "min",
            "func": "err",
            "text": "min of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(${kcClyXWGsCEI}, ${AwSHlVoPEaee})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "kcClyXWGsCEI"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "AwSHlVoPEaee"
              }
            }
          },
          {
            "opcode": "max",
            "func": "err",
            "text": "max of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.max(${JirAAPGaxoLs}, ${ifqTrwhNmHqU})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "JirAAPGaxoLs"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "ifqTrwhNmHqU"
              }
            }
          },
          {
            "opcode": "interpolate",
            "func": "err",
            "text": "smooth [B] to [C] by [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${OmvFcTLMreKe} + ((${AyEAsvknICWp} - ${OmvFcTLMreKe}) / ${DWPcykpZzxbW})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "DWPcykpZzxbW"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "OmvFcTLMreKe"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "AyEAsvknICWp"
              }
            }
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Strings"
          },
          {
            "opcode": "?",
            "func": "err",
            "text": "if [A] then [B] else [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${ZlkjJQrfASaV} ? (${uNeXphMfOszR} : ${RFeDZLuyeoHW}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.BOOLEAN,
                "defaultValue": false,
                "gen_id": "ZlkjJQrfASaV"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "yes",
                "gen_id": "uNeXphMfOszR"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "no",
                "gen_id": "RFeDZLuyeoHW"
              }
            }
          },
          {
            "opcode": "letters",
            "func": "err",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${GhvIAfustAju}).substring(${iAlyvSNoQIUk}, ${nwjpSHkGJrNe})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "iAlyvSNoQIUk"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "nwjpSHkGJrNe"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "GhvIAfustAju"
              }
            }
          },
          {
            "opcode": "starts",
            "func": "err",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${lBLMzNfJlIkE}).startsWith(${HBBfUSGipUeW})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "lBLMzNfJlIkE"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "HBBfUSGipUeW"
              }
            }
          },
          {
            "opcode": "ends",
            "func": "err",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${JKmHhQeutmQh}).endsWith(${dlJEslzeHLqe})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "JKmHhQeutmQh"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "dlJEslzeHLqe"
              }
            }
          },
          {
            "opcode": "toUnicode",
            "func": "err",
            "text": "Unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${RuSwLdfIyvkI}).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "RuSwLdfIyvkI"
              }
            }
          },
          {
            "opcode": "replace",
            "func": "err",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${PyXTksQczrnK} === \"\" ? ${dZvyHAnOPdya} : (${dZvyHAnOPdya}).replace(${PyXTksQczrnK}, ${WaRsHfDgPIaN}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "dZvyHAnOPdya"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "WaRsHfDgPIaN"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "PyXTksQczrnK"
              }
            }
          },
          {
            "opcode": "replaceall",
            "func": "err",
            "text": "replace all [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${jsBxLXzYcebO} === \"\" ? ${GQwKtQSMrEBq} : (${GQwKtQSMrEBq}).replaceAll(${jsBxLXzYcebO}, ${mBDVhRAgEwUp}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "GQwKtQSMrEBq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "mBDVhRAgEwUp"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "jsBxLXzYcebO"
              }
            }
          },
          {
            "opcode": "alltextAfterString",
            "func": "err",
            "text": "text after [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${nzwWiXmiiIxF}).substring((${nzwWiXmiiIxF}).indexOf(\"\"+(${WWjBMqaFORdK})) + 1, ((${nzwWiXmiiIxF}).length)",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "nzwWiXmiiIxF"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "WWjBMqaFORdK"
              }
            }
          },
          {
            "opcode": "alltextBeforeString",
            "func": "err",
            "text": "text before [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${opWQEHVrvBWw}).split(${oHjYDzrMmBUg}, 1)[0]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "opWQEHVrvBWw"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "oHjYDzrMmBUg"
              }
            }
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "JSON"
          },
          {
            "opcode": "split",
            "func": "err",
            "text": "split [A] by [B] (stringify)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify((${nmUnkhygKmWD}).split(${gMsxQaPUyflm}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "nmUnkhygKmWD"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "gMsxQaPUyflm"
              }
            }
          },
          {
            "opcode": "splitarray",
            "func": "err",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${sGgDHMZPerQt}).split(${HdEcZlwEEKqO})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "sGgDHMZPerQt"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "HdEcZlwEEKqO"
              }
            }
          },
          {
            "opcode": "length",
            "func": "err",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${cvjLKqMgOEXm}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "cvjLKqMgOEXm"
              }
            }
          },
          {
            "opcode": "item",
            "func": "err",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${fzBEGoyzCBZk}).split(${PjJToGWUMmFQ})[${xsxcYpfvciRY}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "fzBEGoyzCBZk"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "PjJToGWUMmFQ"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "xsxcYpfvciRY"
              }
            }
          },
          {
            "opcode": "jsondelete",
            "func": "err",
            "text": "Delete Item [B] of [A]",
            "code": "delete ${UPzXIZQUIiEo}[${zwWOlsXZchFm}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "UPzXIZQUIiEo"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "zwWOlsXZchFm"
              }
            }
          },
          {
            "opcode": "jsonset",
            "func": "err",
            "text": "Set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${oWpXewkSiuuA}[${TodNTtQNLewQ}] = ${FXvrRQKpfvdV}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "oWpXewkSiuuA"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "TodNTtQNLewQ"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "FXvrRQKpfvdV"
              }
            }
          },
          {
            "opcode": "squarebrackets",
            "func": "err",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${WbnkuDhHHRqQ})[${GFuFiLoMGTGJ}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "WbnkuDhHHRqQ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "GFuFiLoMGTGJ"
              }
            }
          },
          {
            "opcode": "jsonparse",
            "func": "err",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${EoxxLhsgakLU})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "EoxxLhsgakLU"
              }
            }
          },
          {
            "opcode": "jsonstringify",
            "func": "err",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${KWrCXlAifUAC})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "KWrCXlAifUAC"
              }
            }
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Types"
          },
          {
            "opcode": "isnumber",
            "func": "err",
            "text": "[A] is a number",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "Number(${PjyQqgvwFbbs}) == ${PjyQqgvwFbbs}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "PjyQqgvwFbbs"
              }
            }
          },
          {
            "opcode": "isstring",
            "func": "err",
            "text": "[A] is a string",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "String(${HsmNNoWaaYPb}) == ${HsmNNoWaaYPb}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "HsmNNoWaaYPb"
              }
            }
          },
          {
            "opcode": "isboolean",
            "func": "err",
            "text": "[A] is a boolean",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${jTwSZFrrnOTu} == \"true\" || ${jTwSZFrrnOTu} == \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "jTwSZFrrnOTu"
              }
            }
          },
          {
            "opcode": "tostring",
            "func": "err",
            "text": "to string [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${xaDVwNyOhYVs}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "xaDVwNyOhYVs"
              }
            }
          },
          {
            "opcode": "tonumber",
            "func": "err",
            "text": "to number [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "isNaN(Number(${OJtuNDFfUpUp})) ? 0 : Number(${OJtuNDFfUpUp})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "OJtuNDFfUpUp"
              }
            }
          },
          {
            "opcode": "toboolean",
            "func": "err",
            "text": "to boolean [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${NpOkzPsXJJJN} == \"true\" || ${NpOkzPsXJJJN} == \"1\" || ${NpOkzPsXJJJN} == \"yes\" ? \"true\" : \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "NpOkzPsXJJJN"
              }
            }
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Injections"
          },
          {
            "opcode": "patchreporter",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${bmHcLTRoeypQ}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "bmHcLTRoeypQ"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${wkUSRJMgixnC}${cPdwMaFMclCT}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "wkUSRJMgixnC"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "cPdwMaFMclCT"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${RteIdtTfiEMs}${NDRZrjegURYa}${fXrTgwydVicU}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "RteIdtTfiEMs"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "NDRZrjegURYa"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "fXrTgwydVicU"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchboolean",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${vSfjuBqualrW}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "vSfjuBqualrW"
              }
            }
          },
          {
            "opcode": "patchcommand",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${XnaLXYpHvaGq}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "XnaLXYpHvaGq"
              }
            }
          },
          {
            "opcode": "patchcommand2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${YjsyviaxKqJC}${wjdRPuVMaDYA}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "YjsyviaxKqJC"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "wjdRPuVMaDYA"
              }
            }
          },
          {
            "opcode": "patchcommand3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${FJtAqwxTerpo}${oqPAxLRLilQy}${yKrOvgmWNWWj}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "FJtAqwxTerpo"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "oqPAxLRLilQy"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "yKrOvgmWNWWj"
              }
            }
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Reporters"
          },
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
          },
          {
            "opcode": "newline",
            "func": "err",
            "text": "New Line",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "\"\\\\n\"",
            "returns": "STRING",
            "disableMonitor": true
          },
          {
            "opcode": "pi",
            "func": "err",
            "text": "π",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.PI",
            "returns": "NUMBER",
            "disableMonitor": true
          },
          {
            "opcode": "e",
            "func": "err",
            "text": "e",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.E",
            "returns": "NUMBER",
            "disableMonitor": true
          },
          {
            "opcode": "infinity",
            "func": "err",
            "text": "∞",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Infinity",
            "returns": "NUMBER",
            "disableMonitor": true
          },
          {
            "opcode": "MaxInt",
            "func": "err",
            "text": "Max Int",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Number.MAX_SAFE_INTEGER",
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
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;

        case 'mistsutils.notequals':
          const uDYsMumpNcKu = this.descendInput(node?.A).asString();
          const YSIIWGikdcGt = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${uDYsMumpNcKu} !== ${YSIIWGikdcGt}))\n`;
          return;
        case 'mistsutils.equals':
          const FZBeobDJFkIr = this.descendInput(node?.A).asString();
          const ghnJovzNQBAB = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${FZBeobDJFkIr} === ${ghnJovzNQBAB}))\n`;
          return;
        case 'mistsutils.greaterorequal':
          const lFYutmSrkaLh = this.descendInput(node?.A).asNumber();
          const GKcKtoXVvDed = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${lFYutmSrkaLh} >= ${GKcKtoXVvDed}))\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const HVstTcWlpmla = this.descendInput(node?.A).asNumber();
          const DLhLOYoutuRa = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${HVstTcWlpmla} <= ${DLhLOYoutuRa}))\n`;
          return;
        case 'mistsutils.compare':
          const lqieAmYFCUFx = this.descendInput(node?.A).asNumber();
          const hjAvogxkGwVM = this.descendInput(node?.B).asNumber();
          const moMxwyjTpwlq = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${lqieAmYFCUFx} ${moMxwyjTpwlq} ${hjAvogxkGwVM}))\n`;
          return;

        case 'mistsutils.power':
          const GfcuqVleXSru = this.descendInput(node?.A).asNumber();
          const vDTkHiUWtNwi = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${GfcuqVleXSru}, ${vDTkHiUWtNwi}))\n`;
          return;
        case 'mistsutils.round':
          const kJefGPraufMg = this.descendInput(node?.A).asNumber();
          const GQlUewbJjySW = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.round((${kJefGPraufMg} / ${GQlUewbJjySW}) * ${GQlUewbJjySW}))\n`;
          return;
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;
        case 'mistsutils.clamp':
          const MpjxHnBdHBFl = this.descendInput(node?.A).asNumber();
          const kArOwTjJvKLX = this.descendInput(node?.B).asNumber();
          const PvwcNAYhyYge = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${MpjxHnBdHBFl}, ${kArOwTjJvKLX}), ${PvwcNAYhyYge}))\n`;
          return;
        case 'mistsutils.min':
          const kcClyXWGsCEI = this.descendInput(node?.A).asNumber();
          const AwSHlVoPEaee = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(${kcClyXWGsCEI}, ${AwSHlVoPEaee}))\n`;
          return;
        case 'mistsutils.max':
          const JirAAPGaxoLs = this.descendInput(node?.A).asNumber();
          const ifqTrwhNmHqU = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(${JirAAPGaxoLs}, ${ifqTrwhNmHqU}))\n`;
          return;
        case 'mistsutils.interpolate':
          const DWPcykpZzxbW = this.descendInput(node?.A).asNumber();
          const OmvFcTLMreKe = this.descendInput(node?.B).asNumber();
          const AyEAsvknICWp = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${OmvFcTLMreKe} + ((${AyEAsvknICWp} - ${OmvFcTLMreKe}) / ${DWPcykpZzxbW}))\n`;
          return;

        case 'mistsutils.?':
          const ZlkjJQrfASaV = this.descendInput(node?.A).asBoolean();
          const uNeXphMfOszR = this.descendInput(node?.B).asString();
          const RFeDZLuyeoHW = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ZlkjJQrfASaV} ? (${uNeXphMfOszR} : ${RFeDZLuyeoHW})))\n`;
          return;
        case 'mistsutils.letters':
          const iAlyvSNoQIUk = this.descendInput(node?.A).asNumber();
          const nwjpSHkGJrNe = this.descendInput(node?.B).asNumber();
          const GhvIAfustAju = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${GhvIAfustAju}).substring(${iAlyvSNoQIUk}, ${nwjpSHkGJrNe}))\n`;
          return;
        case 'mistsutils.starts':
          const lBLMzNfJlIkE = this.descendInput(node?.A).asString();
          const HBBfUSGipUeW = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${lBLMzNfJlIkE}).startsWith(${HBBfUSGipUeW}))\n`;
          return;
        case 'mistsutils.ends':
          const JKmHhQeutmQh = this.descendInput(node?.A).asString();
          const dlJEslzeHLqe = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${JKmHhQeutmQh}).endsWith(${dlJEslzeHLqe}))\n`;
          return;
        case 'mistsutils.toUnicode':
          const RuSwLdfIyvkI = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${RuSwLdfIyvkI}).charCodeAt(0))\n`;
          return;
        case 'mistsutils.replace':
          const dZvyHAnOPdya = this.descendInput(node?.A).asString();
          const WaRsHfDgPIaN = this.descendInput(node?.B).asString();
          const PyXTksQczrnK = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${PyXTksQczrnK} === "" ? ${dZvyHAnOPdya} : (${dZvyHAnOPdya}).replace(${PyXTksQczrnK}, ${WaRsHfDgPIaN})))\n`;
          return;
        case 'mistsutils.replaceall':
          const GQwKtQSMrEBq = this.descendInput(node?.A).asString();
          const mBDVhRAgEwUp = this.descendInput(node?.B).asString();
          const jsBxLXzYcebO = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${jsBxLXzYcebO} === "" ? ${GQwKtQSMrEBq} : (${GQwKtQSMrEBq}).replaceAll(${jsBxLXzYcebO}, ${mBDVhRAgEwUp})))\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const nzwWiXmiiIxF = this.descendInput(node?.A).asString();
          const WWjBMqaFORdK = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${nzwWiXmiiIxF}).substring((${nzwWiXmiiIxF}).indexOf(""+(${WWjBMqaFORdK})) + 1, ((${nzwWiXmiiIxF}).length))\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const opWQEHVrvBWw = this.descendInput(node?.A).asString();
          const oHjYDzrMmBUg = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${opWQEHVrvBWw}).split(${oHjYDzrMmBUg}, 1)[0])\n`;
          return;

        case 'mistsutils.split':
          const nmUnkhygKmWD = this.descendInput(node?.A).asString();
          const gMsxQaPUyflm = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${nmUnkhygKmWD}).split(${gMsxQaPUyflm})))\n`;
          return;
        case 'mistsutils.splitarray':
          const sGgDHMZPerQt = this.descendInput(node?.A).asString();
          const HdEcZlwEEKqO = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${sGgDHMZPerQt}).split(${HdEcZlwEEKqO}))\n`;
          return;
        case 'mistsutils.length':
          const cvjLKqMgOEXm = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${cvjLKqMgOEXm}).length))\n`;
          return;
        case 'mistsutils.item':
          const fzBEGoyzCBZk = this.descendInput(node?.A).asString();
          const PjJToGWUMmFQ = this.descendInput(node?.B).asString();
          const xsxcYpfvciRY = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${fzBEGoyzCBZk}).split(${PjJToGWUMmFQ})[${xsxcYpfvciRY}])\n`;
          return;
        case 'mistsutils.jsondelete':
          const UPzXIZQUIiEo = this.descendInput(node?.A).asString();
          const zwWOlsXZchFm = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${UPzXIZQUIiEo}[${zwWOlsXZchFm}]\n`;
          return;
        case 'mistsutils.jsonset':
          const oWpXewkSiuuA = this.descendInput(node?.A).asString();
          const TodNTtQNLewQ = this.descendInput(node?.B).asString();
          const FXvrRQKpfvdV = this.descendInput(node?.C).asString();
          this.source += `\n${oWpXewkSiuuA}[${TodNTtQNLewQ}] = ${FXvrRQKpfvdV}\n`;
          return;
        case 'mistsutils.squarebrackets':
          const WbnkuDhHHRqQ = this.descendInput(node?.A).asString();
          const GFuFiLoMGTGJ = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${WbnkuDhHHRqQ})[${GFuFiLoMGTGJ}])\n`;
          return;
        case 'mistsutils.jsonparse':
          const EoxxLhsgakLU = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${EoxxLhsgakLU}))\n`;
          return;
        case 'mistsutils.jsonstringify':
          const KWrCXlAifUAC = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${KWrCXlAifUAC}))\n`;
          return;

        case 'mistsutils.isnumber':
          const PjyQqgvwFbbs = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Number(${PjyQqgvwFbbs}) == ${PjyQqgvwFbbs})\n`;
          return;
        case 'mistsutils.isstring':
          const HsmNNoWaaYPb = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", String(${HsmNNoWaaYPb}) == ${HsmNNoWaaYPb})\n`;
          return;
        case 'mistsutils.isboolean':
          const jTwSZFrrnOTu = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${jTwSZFrrnOTu} == "true" || ${jTwSZFrrnOTu} == "false")\n`;
          return;
        case 'mistsutils.tostring':
          const xaDVwNyOhYVs = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${xaDVwNyOhYVs})\n`;
          return;
        case 'mistsutils.tonumber':
          const OJtuNDFfUpUp = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", isNaN(Number(${OJtuNDFfUpUp})) ? 0 : Number(${OJtuNDFfUpUp}))\n`;
          return;
        case 'mistsutils.toboolean':
          const NpOkzPsXJJJN = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${NpOkzPsXJJJN} == "true" || ${NpOkzPsXJJJN} == "1" || ${NpOkzPsXJJJN} == "yes" ? "true" : "false")\n`;
          return;

        case 'mistsutils.patchreporter':
          const bmHcLTRoeypQ = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${bmHcLTRoeypQ})\n`;
          return;
        case 'mistsutils.patchreporter2':
          const wkUSRJMgixnC = this.descendInput(node?.A).asRaw();
          const cPdwMaFMclCT = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${wkUSRJMgixnC}${cPdwMaFMclCT})\n`;
          return;
        case 'mistsutils.patchreporter3':
          const RteIdtTfiEMs = this.descendInput(node?.A).asRaw();
          const NDRZrjegURYa = this.descendInput(node?.B).asRaw();
          const fXrTgwydVicU = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${RteIdtTfiEMs}${NDRZrjegURYa}${fXrTgwydVicU})\n`;
          return;
        case 'mistsutils.patchboolean':
          const vSfjuBqualrW = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${vSfjuBqualrW})\n`;
          return;
        case 'mistsutils.patchcommand':
          const XnaLXYpHvaGq = this.descendInput(node?.A).asRaw();
          this.source += `\n${XnaLXYpHvaGq}\n`;
          return;
        case 'mistsutils.patchcommand2':
          const YjsyviaxKqJC = this.descendInput(node?.A).asRaw();
          const wjdRPuVMaDYA = this.descendInput(node?.B).asRaw();
          this.source += `\n${YjsyviaxKqJC}${wjdRPuVMaDYA}\n`;
          return;
        case 'mistsutils.patchcommand3':
          const FJtAqwxTerpo = this.descendInput(node?.A).asRaw();
          const oqPAxLRLilQy = this.descendInput(node?.B).asRaw();
          const yKrOvgmWNWWj = this.descendInput(node?.C).asRaw();
          this.source += `\n${FJtAqwxTerpo}${oqPAxLRLilQy}${yKrOvgmWNWWj}\n`;
          return;

        case 'mistsutils.true':
          this.source += `\nvm.runtime.visualReport("${block.id}", true)\n`;
          return;
        case 'mistsutils.false':
          this.source += `\nvm.runtime.visualReport("${block.id}", false)\n`;
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
          const uDYsMumpNcKu = this.descendInput(node?.A).asString();
          const YSIIWGikdcGt = this.descendInput(node?.B).asString();
          return new TypedInput(`(${uDYsMumpNcKu} !== ${YSIIWGikdcGt})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const FZBeobDJFkIr = this.descendInput(node?.A).asString();
          const ghnJovzNQBAB = this.descendInput(node?.B).asString();
          return new TypedInput(`(${FZBeobDJFkIr} === ${ghnJovzNQBAB})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const lFYutmSrkaLh = this.descendInput(node?.A).asNumber();
          const GKcKtoXVvDed = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${lFYutmSrkaLh} >= ${GKcKtoXVvDed})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const HVstTcWlpmla = this.descendInput(node?.A).asNumber();
          const DLhLOYoutuRa = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${HVstTcWlpmla} <= ${DLhLOYoutuRa})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const lqieAmYFCUFx = this.descendInput(node?.A).asNumber();
          const hjAvogxkGwVM = this.descendInput(node?.B).asNumber();
          const moMxwyjTpwlq = this.descendInput(node?.C).asRaw();
          return new TypedInput(`(${lqieAmYFCUFx} ${moMxwyjTpwlq} ${hjAvogxkGwVM})`, TYPE_BOOLEAN);

        case 'mistsutils.power':
          const GfcuqVleXSru = this.descendInput(node?.A).asNumber();
          const vDTkHiUWtNwi = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${GfcuqVleXSru}, ${vDTkHiUWtNwi})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const kJefGPraufMg = this.descendInput(node?.A).asNumber();
          const GQlUewbJjySW = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.round((${kJefGPraufMg} / ${GQlUewbJjySW}) * ${GQlUewbJjySW})`, TYPE_NUMBER);
        case 'mistsutils.undefined':
          return new TypedInput(`undefined`, TYPE_UNKNOWN);
        case 'mistsutils.clamp':
          const MpjxHnBdHBFl = this.descendInput(node?.A).asNumber();
          const kArOwTjJvKLX = this.descendInput(node?.B).asNumber();
          const PvwcNAYhyYge = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${MpjxHnBdHBFl}, ${kArOwTjJvKLX}), ${PvwcNAYhyYge})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const kcClyXWGsCEI = this.descendInput(node?.A).asNumber();
          const AwSHlVoPEaee = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.min(${kcClyXWGsCEI}, ${AwSHlVoPEaee})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const JirAAPGaxoLs = this.descendInput(node?.A).asNumber();
          const ifqTrwhNmHqU = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.max(${JirAAPGaxoLs}, ${ifqTrwhNmHqU})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const DWPcykpZzxbW = this.descendInput(node?.A).asNumber();
          const OmvFcTLMreKe = this.descendInput(node?.B).asNumber();
          const AyEAsvknICWp = this.descendInput(node?.C).asNumber();
          return new TypedInput(`${OmvFcTLMreKe} + ((${AyEAsvknICWp} - ${OmvFcTLMreKe}) / ${DWPcykpZzxbW})`, TYPE_NUMBER);

        case 'mistsutils.?':
          const ZlkjJQrfASaV = this.descendInput(node?.A).asBoolean();
          const uNeXphMfOszR = this.descendInput(node?.B).asString();
          const RFeDZLuyeoHW = this.descendInput(node?.C).asString();
          return new TypedInput(`(${ZlkjJQrfASaV} ? (${uNeXphMfOszR} : ${RFeDZLuyeoHW}))`, TYPE_STRING);
        case 'mistsutils.letters':
          const iAlyvSNoQIUk = this.descendInput(node?.A).asNumber();
          const nwjpSHkGJrNe = this.descendInput(node?.B).asNumber();
          const GhvIAfustAju = this.descendInput(node?.C).asString();
          return new TypedInput(`(${GhvIAfustAju}).substring(${iAlyvSNoQIUk}, ${nwjpSHkGJrNe})`, TYPE_STRING);
        case 'mistsutils.starts':
          const lBLMzNfJlIkE = this.descendInput(node?.A).asString();
          const HBBfUSGipUeW = this.descendInput(node?.B).asString();
          return new TypedInput(`(${lBLMzNfJlIkE}).startsWith(${HBBfUSGipUeW})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const JKmHhQeutmQh = this.descendInput(node?.A).asString();
          const dlJEslzeHLqe = this.descendInput(node?.B).asString();
          return new TypedInput(`(${JKmHhQeutmQh}).endsWith(${dlJEslzeHLqe})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const RuSwLdfIyvkI = this.descendInput(node?.A).asString();
          return new TypedInput(`(${RuSwLdfIyvkI}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const dZvyHAnOPdya = this.descendInput(node?.A).asString();
          const WaRsHfDgPIaN = this.descendInput(node?.B).asString();
          const PyXTksQczrnK = this.descendInput(node?.C).asString();
          return new TypedInput(`(${PyXTksQczrnK} === "" ? ${dZvyHAnOPdya} : (${dZvyHAnOPdya}).replace(${PyXTksQczrnK}, ${WaRsHfDgPIaN}))`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const GQwKtQSMrEBq = this.descendInput(node?.A).asString();
          const mBDVhRAgEwUp = this.descendInput(node?.B).asString();
          const jsBxLXzYcebO = this.descendInput(node?.C).asString();
          return new TypedInput(`(${jsBxLXzYcebO} === "" ? ${GQwKtQSMrEBq} : (${GQwKtQSMrEBq}).replaceAll(${jsBxLXzYcebO}, ${mBDVhRAgEwUp}))`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const nzwWiXmiiIxF = this.descendInput(node?.A).asString();
          const WWjBMqaFORdK = this.descendInput(node?.B).asString();
          return new TypedInput(`(${nzwWiXmiiIxF}).substring((${nzwWiXmiiIxF}).indexOf(""+(${WWjBMqaFORdK})) + 1, ((${nzwWiXmiiIxF}).length)`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const opWQEHVrvBWw = this.descendInput(node?.A).asString();
          const oHjYDzrMmBUg = this.descendInput(node?.B).asString();
          return new TypedInput(`(${opWQEHVrvBWw}).split(${oHjYDzrMmBUg}, 1)[0]`, TYPE_STRING);

        case 'mistsutils.split':
          const nmUnkhygKmWD = this.descendInput(node?.A).asString();
          const gMsxQaPUyflm = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((${nmUnkhygKmWD}).split(${gMsxQaPUyflm}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const sGgDHMZPerQt = this.descendInput(node?.A).asString();
          const HdEcZlwEEKqO = this.descendInput(node?.B).asString();
          return new TypedInput(`(${sGgDHMZPerQt}).split(${HdEcZlwEEKqO})`, TYPE_STRING);
        case 'mistsutils.length':
          const cvjLKqMgOEXm = this.descendInput(node?.A).asString();
          return new TypedInput(`((${cvjLKqMgOEXm}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const fzBEGoyzCBZk = this.descendInput(node?.A).asString();
          const PjJToGWUMmFQ = this.descendInput(node?.B).asString();
          const xsxcYpfvciRY = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(${fzBEGoyzCBZk}).split(${PjJToGWUMmFQ})[${xsxcYpfvciRY}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const UPzXIZQUIiEo = this.descendInput(node?.A).asString();
          const zwWOlsXZchFm = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${UPzXIZQUIiEo}[${zwWOlsXZchFm}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const oWpXewkSiuuA = this.descendInput(node?.A).asString();
          const TodNTtQNLewQ = this.descendInput(node?.B).asString();
          const FXvrRQKpfvdV = this.descendInput(node?.C).asString();
          return new TypedInput(`${oWpXewkSiuuA}[${TodNTtQNLewQ}] = ${FXvrRQKpfvdV}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const WbnkuDhHHRqQ = this.descendInput(node?.A).asString();
          const GFuFiLoMGTGJ = this.descendInput(node?.B).asString();
          return new TypedInput(`(${WbnkuDhHHRqQ})[${GFuFiLoMGTGJ}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const EoxxLhsgakLU = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${EoxxLhsgakLU})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const KWrCXlAifUAC = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${KWrCXlAifUAC})`, TYPE_STRING);

        case 'mistsutils.isnumber':
          const PjyQqgvwFbbs = this.descendInput(node?.A).asString();
          return new TypedInput(`Number(${PjyQqgvwFbbs}) == ${PjyQqgvwFbbs}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const HsmNNoWaaYPb = this.descendInput(node?.A).asString();
          return new TypedInput(`String(${HsmNNoWaaYPb}) == ${HsmNNoWaaYPb}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const jTwSZFrrnOTu = this.descendInput(node?.A).asString();
          return new TypedInput(`${jTwSZFrrnOTu} == "true" || ${jTwSZFrrnOTu} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const xaDVwNyOhYVs = this.descendInput(node?.A).asString();
          return new TypedInput(`${xaDVwNyOhYVs}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const OJtuNDFfUpUp = this.descendInput(node?.A).asString();
          return new TypedInput(`isNaN(Number(${OJtuNDFfUpUp})) ? 0 : Number(${OJtuNDFfUpUp})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const NpOkzPsXJJJN = this.descendInput(node?.A).asString();
          return new TypedInput(`${NpOkzPsXJJJN} == "true" || ${NpOkzPsXJJJN} == "1" || ${NpOkzPsXJJJN} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);

        case 'mistsutils.patchreporter':
          const bmHcLTRoeypQ = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${bmHcLTRoeypQ}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const wkUSRJMgixnC = this.descendInput(node?.A).asRaw();
          const cPdwMaFMclCT = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${wkUSRJMgixnC}${cPdwMaFMclCT}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const RteIdtTfiEMs = this.descendInput(node?.A).asRaw();
          const NDRZrjegURYa = this.descendInput(node?.B).asRaw();
          const fXrTgwydVicU = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${RteIdtTfiEMs}${NDRZrjegURYa}${fXrTgwydVicU}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const vSfjuBqualrW = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${vSfjuBqualrW}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const XnaLXYpHvaGq = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${XnaLXYpHvaGq}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const YjsyviaxKqJC = this.descendInput(node?.A).asRaw();
          const wjdRPuVMaDYA = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${YjsyviaxKqJC}${wjdRPuVMaDYA}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const FJtAqwxTerpo = this.descendInput(node?.A).asRaw();
          const oqPAxLRLilQy = this.descendInput(node?.B).asRaw();
          const yKrOvgmWNWWj = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${FJtAqwxTerpo}${oqPAxLRLilQy}${yKrOvgmWNWWj}`, TYPE_UNKNOWN);

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
