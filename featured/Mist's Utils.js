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
      console.log("Loaded Mist's utils! (v5.3)");
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
            console.log(text)
            console.log(text.includes("version: 5.3,"))
            if (!(text.includes("version: 5.3,"))) {
              this.newUpdate = true;
              console.log("Mist Utils New Update")
            }
          })
        console.log(this.newUpdate)
      };
    }

    getInfo() {
      return {
        id: 'mistsutils',
        name: 'Mists Utils',
        color1: '#2DA4A0',
        version: 5.3,
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
            "code": "(${YKLwcLOAhfFM} !== ${sTFletITjXRk})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "YKLwcLOAhfFM"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "sTFletITjXRk"
              }
            },
            "func": "err"
          },
          {
            "opcode": "equals",
            "text": "[A] === [B]",
            "code": "(${BZMvyIwQxCTy} === ${wjDAwfEcSJTO})",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "BZMvyIwQxCTy"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "wjDAwfEcSJTO"
              }
            },
            "func": "err"
          },
          {
            "opcode": "greaterorequal",
            "text": "[A] >= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${ByusBpTCoGol} >= ${BBnQqmRcrQhB})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "ByusBpTCoGol"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "BBnQqmRcrQhB"
              }
            },
            "func": "err"
          },
          {
            "opcode": "lessthanorequal",
            "text": "[A] <= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${vhlOGKryfbdx} <= ${jTrErcExWiLC})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "vhlOGKryfbdx"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "jTrErcExWiLC"
              }
            },
            "func": "err"
          },
          {
            "opcode": "compare",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${clRalpOrfQnF} ${ZyTVRqWwEmLu} ${JJCCVAEFGthz})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "clRalpOrfQnF"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "JJCCVAEFGthz"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "<",
                "gen_id": "ZyTVRqWwEmLu"
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
            "code": "Math.pow(${VCRGVmPLLnjK}, ${CzUUdIuTIavA})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "VCRGVmPLLnjK"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "CzUUdIuTIavA"
              }
            },
            "func": "err"
          },
          {
            "opcode": "round",
            "text": "round [A] to the nearest [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.round((${qrUNeRMorrlg} / ${HKgVYGQKsBqb}) * ${HKgVYGQKsBqb})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "qrUNeRMorrlg"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 10,
                "gen_id": "HKgVYGQKsBqb"
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
            "code": "Math.min(Math.max(${XaShRlriyLXt}, ${nSgdzRkumylU}), ${lpBdcAGWsMcz})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "XaShRlriyLXt"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "nSgdzRkumylU"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "lpBdcAGWsMcz"
              }
            },
            "func": "err"
          },
          {
            "opcode": "min",
            "text": "min of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(${NTzOpsRFrikr}, ${aqAoFUXiLOdr})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "NTzOpsRFrikr"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "aqAoFUXiLOdr"
              }
            },
            "func": "err"
          },
          {
            "opcode": "max",
            "text": "max of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.max(${bJjvPGcYHXZA}, ${VEuiUmkmuQKR})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "bJjvPGcYHXZA"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "VEuiUmkmuQKR"
              }
            },
            "func": "err"
          },
          {
            "opcode": "interpolate",
            "text": "smooth [B] to [C] by [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${yhbirbanGDLk} + ((${eYduDAgNYNDC} - ${yhbirbanGDLk}) / ${XSQedVYHuiAE})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "XSQedVYHuiAE"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "yhbirbanGDLk"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "eYduDAgNYNDC"
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
            "code": "(${AVdWByMjElJQ} ? (${pqrjPThDPnUB} : ${FEuycUefkRrV}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.BOOLEAN,
                "defaultValue": false,
                "gen_id": "AVdWByMjElJQ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "yes",
                "gen_id": "pqrjPThDPnUB"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "no",
                "gen_id": "FEuycUefkRrV"
              }
            },
            "func": "err"
          },
          {
            "opcode": "letters",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${LeMBRDfspHdg}).substring(${uSMpStXihMYb}, ${uCwYmrTbYrEU})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "uSMpStXihMYb"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "uCwYmrTbYrEU"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "LeMBRDfspHdg"
              }
            },
            "func": "err"
          },
          {
            "opcode": "starts",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${GZECFOiZrbCX}).startsWith(${uEPKmwekmIEO})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "GZECFOiZrbCX"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "uEPKmwekmIEO"
              }
            },
            "func": "err"
          },
          {
            "opcode": "ends",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${IBjdjXCuoEBS}).endsWith(${qTOgpyXgaNVp})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "IBjdjXCuoEBS"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "qTOgpyXgaNVp"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toUnicode",
            "text": "Unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${SRWxcGmXYfxL}).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "SRWxcGmXYfxL"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replace",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${iBEbvnLzyQzT} === \"\" ? ${dWWQALaFPLnz} : (${dWWQALaFPLnz}).replace(${iBEbvnLzyQzT}, ${tInmvjqtjdzn}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "dWWQALaFPLnz"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "tInmvjqtjdzn"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "iBEbvnLzyQzT"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replaceall",
            "text": "replace all [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${bvyvBxvEWhWd} === \"\" ? ${yfDKqVTQQdgu} : (${yfDKqVTQQdgu}).replaceAll(${bvyvBxvEWhWd}, ${duUjueSrfPkA}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "yfDKqVTQQdgu"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "duUjueSrfPkA"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "bvyvBxvEWhWd"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextAfterString",
            "text": "text after [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${xyHaeRfgAyEq}).substring((${xyHaeRfgAyEq}).indexOf(\"\"+(${RRbkdTyeYAAR})) + 1, ((${xyHaeRfgAyEq}).length)",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "xyHaeRfgAyEq"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "RRbkdTyeYAAR"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextBeforeString",
            "text": "text before [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${CgMCZviLhlit}).split(${QzooCUnqDnFi}, 1)[0]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "CgMCZviLhlit"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "QzooCUnqDnFi"
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
            "code": "JSON.stringify((${DwixPvnyyXHR}).split(${MBWMdqBwiCji}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "DwixPvnyyXHR"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "MBWMdqBwiCji"
              }
            },
            "func": "err"
          },
          {
            "opcode": "splitarray",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${jdODxhoWDRpD}).split(${BZbBsMstgzBY})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "jdODxhoWDRpD"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "BZbBsMstgzBY"
              }
            },
            "func": "err"
          },
          {
            "opcode": "length",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${zyWwWfnNgRFb}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "zyWwWfnNgRFb"
              }
            },
            "func": "err"
          },
          {
            "opcode": "item",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${ZZRuQBwCIfAO}).split(${PtuJwQGmEkrn})[${aCxlBONuVmXG}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ZZRuQBwCIfAO"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "PtuJwQGmEkrn"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "aCxlBONuVmXG"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsondelete",
            "text": "Delete Item [B] of [A]",
            "code": "delete ${NUvRYLUXNRRv}[${pXCPViwtEljs}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "NUvRYLUXNRRv"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "pXCPViwtEljs"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonset",
            "text": "Set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${YJOgrFcCqRCc}[${suruChsIFVuQ}] = ${ShArwscfyouV}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "YJOgrFcCqRCc"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "suruChsIFVuQ"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "ShArwscfyouV"
              }
            },
            "func": "err"
          },
          {
            "opcode": "squarebrackets",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${OjSRIYgHqwlW})[${fVHsPFQKGeou}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "OjSRIYgHqwlW"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "fVHsPFQKGeou"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonparse",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${GJYiqYUOoVNy})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "GJYiqYUOoVNy"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonstringify",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${dwgblCYIkfon})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "dwgblCYIkfon"
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
            "code": "Number(${jHrORuTAkBmm}) == ${jHrORuTAkBmm}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "jHrORuTAkBmm"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isstring",
            "text": "[A] is a string",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "String(${FFmVkgDsAArP}) == ${FFmVkgDsAArP}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "FFmVkgDsAArP"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isboolean",
            "text": "[A] is a boolean",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${ZBBrHZKrdwYy} == \"true\" || ${ZBBrHZKrdwYy} == \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "ZBBrHZKrdwYy"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tostring",
            "text": "to string [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${qsOVzzyjpfXB}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "qsOVzzyjpfXB"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tonumber",
            "text": "to number [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "isNaN(Number(${agQdjmAeYxwf})) ? 0 : Number(${agQdjmAeYxwf})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "agQdjmAeYxwf"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toboolean",
            "text": "to boolean [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${FYsKUUZPaJOU} == \"true\" || ${FYsKUUZPaJOU} == \"1\" || ${FYsKUUZPaJOU} == \"yes\" ? \"true\" : \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "FYsKUUZPaJOU"
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
            "code": "${USHIPCjNzHcg}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "USHIPCjNzHcg"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter2",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${XWQqTMuvzWNY}${LgpbIWwlvIXY}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "XWQqTMuvzWNY"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "LgpbIWwlvIXY"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter3",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${IgEIVUwCufed}${qQeglpBvaApO}${AHQKTBMrDIhh}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "IgEIVUwCufed"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "qQeglpBvaApO"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "AHQKTBMrDIhh"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchboolean",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${zkyZFxvpUVNk}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "zkyZFxvpUVNk"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${brWDexoEudij}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "brWDexoEudij"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand2",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${lgKikLvQyshU}${VaoEDctIkqIi}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "lgKikLvQyshU"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "VaoEDctIkqIi"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand3",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${NNvdBwSFygZg}${uKKehPXwQSgs}${qpfEjqTKfLWn}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "NNvdBwSFygZg"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "uKKehPXwQSgs"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "qpfEjqTKfLWn"
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
          const YKLwcLOAhfFM = this.descendInput(node?.A).asString();
          const sTFletITjXRk = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${YKLwcLOAhfFM} !== ${sTFletITjXRk}))\n`;
          return;
        case 'mistsutils.equals':
          const BZMvyIwQxCTy = this.descendInput(node?.A).asString();
          const wjDAwfEcSJTO = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${BZMvyIwQxCTy} === ${wjDAwfEcSJTO}))\n`;
          return;
        case 'mistsutils.greaterorequal':
          const ByusBpTCoGol = this.descendInput(node?.A).asNumber();
          const BBnQqmRcrQhB = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ByusBpTCoGol} >= ${BBnQqmRcrQhB}))\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const vhlOGKryfbdx = this.descendInput(node?.A).asNumber();
          const jTrErcExWiLC = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${vhlOGKryfbdx} <= ${jTrErcExWiLC}))\n`;
          return;
        case 'mistsutils.compare':
          const clRalpOrfQnF = this.descendInput(node?.A).asNumber();
          const JJCCVAEFGthz = this.descendInput(node?.B).asNumber();
          const ZyTVRqWwEmLu = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${clRalpOrfQnF} ${ZyTVRqWwEmLu} ${JJCCVAEFGthz}))\n`;
          return;

        case 'mistsutils.power':
          const VCRGVmPLLnjK = this.descendInput(node?.A).asNumber();
          const CzUUdIuTIavA = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${VCRGVmPLLnjK}, ${CzUUdIuTIavA}))\n`;
          return;
        case 'mistsutils.round':
          const qrUNeRMorrlg = this.descendInput(node?.A).asNumber();
          const HKgVYGQKsBqb = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.round((${qrUNeRMorrlg} / ${HKgVYGQKsBqb}) * ${HKgVYGQKsBqb}))\n`;
          return;
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;
        case 'mistsutils.clamp':
          const XaShRlriyLXt = this.descendInput(node?.A).asNumber();
          const nSgdzRkumylU = this.descendInput(node?.B).asNumber();
          const lpBdcAGWsMcz = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${XaShRlriyLXt}, ${nSgdzRkumylU}), ${lpBdcAGWsMcz}))\n`;
          return;
        case 'mistsutils.min':
          const NTzOpsRFrikr = this.descendInput(node?.A).asNumber();
          const aqAoFUXiLOdr = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(${NTzOpsRFrikr}, ${aqAoFUXiLOdr}))\n`;
          return;
        case 'mistsutils.max':
          const bJjvPGcYHXZA = this.descendInput(node?.A).asNumber();
          const VEuiUmkmuQKR = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(${bJjvPGcYHXZA}, ${VEuiUmkmuQKR}))\n`;
          return;
        case 'mistsutils.interpolate':
          const XSQedVYHuiAE = this.descendInput(node?.A).asNumber();
          const yhbirbanGDLk = this.descendInput(node?.B).asNumber();
          const eYduDAgNYNDC = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${yhbirbanGDLk} + ((${eYduDAgNYNDC} - ${yhbirbanGDLk}) / ${XSQedVYHuiAE}))\n`;
          return;

        case 'mistsutils.?':
          const AVdWByMjElJQ = this.descendInput(node?.A).asBoolean();
          const pqrjPThDPnUB = this.descendInput(node?.B).asString();
          const FEuycUefkRrV = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${AVdWByMjElJQ} ? (${pqrjPThDPnUB} : ${FEuycUefkRrV})))\n`;
          return;
        case 'mistsutils.letters':
          const uSMpStXihMYb = this.descendInput(node?.A).asNumber();
          const uCwYmrTbYrEU = this.descendInput(node?.B).asNumber();
          const LeMBRDfspHdg = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${LeMBRDfspHdg}).substring(${uSMpStXihMYb}, ${uCwYmrTbYrEU}))\n`;
          return;
        case 'mistsutils.starts':
          const GZECFOiZrbCX = this.descendInput(node?.A).asString();
          const uEPKmwekmIEO = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${GZECFOiZrbCX}).startsWith(${uEPKmwekmIEO}))\n`;
          return;
        case 'mistsutils.ends':
          const IBjdjXCuoEBS = this.descendInput(node?.A).asString();
          const qTOgpyXgaNVp = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${IBjdjXCuoEBS}).endsWith(${qTOgpyXgaNVp}))\n`;
          return;
        case 'mistsutils.toUnicode':
          const SRWxcGmXYfxL = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${SRWxcGmXYfxL}).charCodeAt(0))\n`;
          return;
        case 'mistsutils.replace':
          const dWWQALaFPLnz = this.descendInput(node?.A).asString();
          const tInmvjqtjdzn = this.descendInput(node?.B).asString();
          const iBEbvnLzyQzT = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${iBEbvnLzyQzT} === "" ? ${dWWQALaFPLnz} : (${dWWQALaFPLnz}).replace(${iBEbvnLzyQzT}, ${tInmvjqtjdzn})))\n`;
          return;
        case 'mistsutils.replaceall':
          const yfDKqVTQQdgu = this.descendInput(node?.A).asString();
          const duUjueSrfPkA = this.descendInput(node?.B).asString();
          const bvyvBxvEWhWd = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${bvyvBxvEWhWd} === "" ? ${yfDKqVTQQdgu} : (${yfDKqVTQQdgu}).replaceAll(${bvyvBxvEWhWd}, ${duUjueSrfPkA})))\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const xyHaeRfgAyEq = this.descendInput(node?.A).asString();
          const RRbkdTyeYAAR = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${xyHaeRfgAyEq}).substring((${xyHaeRfgAyEq}).indexOf(""+(${RRbkdTyeYAAR})) + 1, ((${xyHaeRfgAyEq}).length))\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const CgMCZviLhlit = this.descendInput(node?.A).asString();
          const QzooCUnqDnFi = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${CgMCZviLhlit}).split(${QzooCUnqDnFi}, 1)[0])\n`;
          return;

        case 'mistsutils.split':
          const DwixPvnyyXHR = this.descendInput(node?.A).asString();
          const MBWMdqBwiCji = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${DwixPvnyyXHR}).split(${MBWMdqBwiCji})))\n`;
          return;
        case 'mistsutils.splitarray':
          const jdODxhoWDRpD = this.descendInput(node?.A).asString();
          const BZbBsMstgzBY = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${jdODxhoWDRpD}).split(${BZbBsMstgzBY}))\n`;
          return;
        case 'mistsutils.length':
          const zyWwWfnNgRFb = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${zyWwWfnNgRFb}).length))\n`;
          return;
        case 'mistsutils.item':
          const ZZRuQBwCIfAO = this.descendInput(node?.A).asString();
          const PtuJwQGmEkrn = this.descendInput(node?.B).asString();
          const aCxlBONuVmXG = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ZZRuQBwCIfAO}).split(${PtuJwQGmEkrn})[${aCxlBONuVmXG}])\n`;
          return;
        case 'mistsutils.jsondelete':
          const NUvRYLUXNRRv = this.descendInput(node?.A).asString();
          const pXCPViwtEljs = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${NUvRYLUXNRRv}[${pXCPViwtEljs}]\n`;
          return;
        case 'mistsutils.jsonset':
          const YJOgrFcCqRCc = this.descendInput(node?.A).asString();
          const suruChsIFVuQ = this.descendInput(node?.B).asString();
          const ShArwscfyouV = this.descendInput(node?.C).asString();
          this.source += `\n${YJOgrFcCqRCc}[${suruChsIFVuQ}] = ${ShArwscfyouV}\n`;
          return;
        case 'mistsutils.squarebrackets':
          const OjSRIYgHqwlW = this.descendInput(node?.A).asString();
          const fVHsPFQKGeou = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${OjSRIYgHqwlW})[${fVHsPFQKGeou}])\n`;
          return;
        case 'mistsutils.jsonparse':
          const GJYiqYUOoVNy = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${GJYiqYUOoVNy}))\n`;
          return;
        case 'mistsutils.jsonstringify':
          const dwgblCYIkfon = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${dwgblCYIkfon}))\n`;
          return;

        case 'mistsutils.isnumber':
          const jHrORuTAkBmm = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Number(${jHrORuTAkBmm}) == ${jHrORuTAkBmm})\n`;
          return;
        case 'mistsutils.isstring':
          const FFmVkgDsAArP = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", String(${FFmVkgDsAArP}) == ${FFmVkgDsAArP})\n`;
          return;
        case 'mistsutils.isboolean':
          const ZBBrHZKrdwYy = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${ZBBrHZKrdwYy} == "true" || ${ZBBrHZKrdwYy} == "false")\n`;
          return;
        case 'mistsutils.tostring':
          const qsOVzzyjpfXB = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${qsOVzzyjpfXB})\n`;
          return;
        case 'mistsutils.tonumber':
          const agQdjmAeYxwf = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", isNaN(Number(${agQdjmAeYxwf})) ? 0 : Number(${agQdjmAeYxwf}))\n`;
          return;
        case 'mistsutils.toboolean':
          const FYsKUUZPaJOU = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${FYsKUUZPaJOU} == "true" || ${FYsKUUZPaJOU} == "1" || ${FYsKUUZPaJOU} == "yes" ? "true" : "false")\n`;
          return;

        case 'mistsutils.patchreporter':
          const USHIPCjNzHcg = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${USHIPCjNzHcg})\n`;
          return;
        case 'mistsutils.patchreporter2':
          const XWQqTMuvzWNY = this.descendInput(node?.A).asRaw();
          const LgpbIWwlvIXY = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${XWQqTMuvzWNY}${LgpbIWwlvIXY})\n`;
          return;
        case 'mistsutils.patchreporter3':
          const IgEIVUwCufed = this.descendInput(node?.A).asRaw();
          const qQeglpBvaApO = this.descendInput(node?.B).asRaw();
          const AHQKTBMrDIhh = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${IgEIVUwCufed}${qQeglpBvaApO}${AHQKTBMrDIhh})\n`;
          return;
        case 'mistsutils.patchboolean':
          const zkyZFxvpUVNk = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${zkyZFxvpUVNk})\n`;
          return;
        case 'mistsutils.patchcommand':
          const brWDexoEudij = this.descendInput(node?.A).asRaw();
          this.source += `\n${brWDexoEudij}\n`;
          return;
        case 'mistsutils.patchcommand2':
          const lgKikLvQyshU = this.descendInput(node?.A).asRaw();
          const VaoEDctIkqIi = this.descendInput(node?.B).asRaw();
          this.source += `\n${lgKikLvQyshU}${VaoEDctIkqIi}\n`;
          return;
        case 'mistsutils.patchcommand3':
          const NNvdBwSFygZg = this.descendInput(node?.A).asRaw();
          const uKKehPXwQSgs = this.descendInput(node?.B).asRaw();
          const qpfEjqTKfLWn = this.descendInput(node?.C).asRaw();
          this.source += `\n${NNvdBwSFygZg}${uKKehPXwQSgs}${qpfEjqTKfLWn}\n`;
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
          const YKLwcLOAhfFM = this.descendInput(node?.A).asString();
          const sTFletITjXRk = this.descendInput(node?.B).asString();
          return new TypedInput(`(${YKLwcLOAhfFM} !== ${sTFletITjXRk})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const BZMvyIwQxCTy = this.descendInput(node?.A).asString();
          const wjDAwfEcSJTO = this.descendInput(node?.B).asString();
          return new TypedInput(`(${BZMvyIwQxCTy} === ${wjDAwfEcSJTO})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const ByusBpTCoGol = this.descendInput(node?.A).asNumber();
          const BBnQqmRcrQhB = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${ByusBpTCoGol} >= ${BBnQqmRcrQhB})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const vhlOGKryfbdx = this.descendInput(node?.A).asNumber();
          const jTrErcExWiLC = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${vhlOGKryfbdx} <= ${jTrErcExWiLC})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const clRalpOrfQnF = this.descendInput(node?.A).asNumber();
          const JJCCVAEFGthz = this.descendInput(node?.B).asNumber();
          const ZyTVRqWwEmLu = this.descendInput(node?.C).asRaw();
          return new TypedInput(`(${clRalpOrfQnF} ${ZyTVRqWwEmLu} ${JJCCVAEFGthz})`, TYPE_BOOLEAN);

        case 'mistsutils.power':
          const VCRGVmPLLnjK = this.descendInput(node?.A).asNumber();
          const CzUUdIuTIavA = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${VCRGVmPLLnjK}, ${CzUUdIuTIavA})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const qrUNeRMorrlg = this.descendInput(node?.A).asNumber();
          const HKgVYGQKsBqb = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.round((${qrUNeRMorrlg} / ${HKgVYGQKsBqb}) * ${HKgVYGQKsBqb})`, TYPE_NUMBER);
        case 'mistsutils.undefined':
          return new TypedInput(`undefined`, TYPE_UNKNOWN);
        case 'mistsutils.clamp':
          const XaShRlriyLXt = this.descendInput(node?.A).asNumber();
          const nSgdzRkumylU = this.descendInput(node?.B).asNumber();
          const lpBdcAGWsMcz = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${XaShRlriyLXt}, ${nSgdzRkumylU}), ${lpBdcAGWsMcz})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const NTzOpsRFrikr = this.descendInput(node?.A).asNumber();
          const aqAoFUXiLOdr = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.min(${NTzOpsRFrikr}, ${aqAoFUXiLOdr})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const bJjvPGcYHXZA = this.descendInput(node?.A).asNumber();
          const VEuiUmkmuQKR = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.max(${bJjvPGcYHXZA}, ${VEuiUmkmuQKR})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const XSQedVYHuiAE = this.descendInput(node?.A).asNumber();
          const yhbirbanGDLk = this.descendInput(node?.B).asNumber();
          const eYduDAgNYNDC = this.descendInput(node?.C).asNumber();
          return new TypedInput(`${yhbirbanGDLk} + ((${eYduDAgNYNDC} - ${yhbirbanGDLk}) / ${XSQedVYHuiAE})`, TYPE_NUMBER);

        case 'mistsutils.?':
          const AVdWByMjElJQ = this.descendInput(node?.A).asBoolean();
          const pqrjPThDPnUB = this.descendInput(node?.B).asString();
          const FEuycUefkRrV = this.descendInput(node?.C).asString();
          return new TypedInput(`(${AVdWByMjElJQ} ? (${pqrjPThDPnUB} : ${FEuycUefkRrV}))`, TYPE_STRING);
        case 'mistsutils.letters':
          const uSMpStXihMYb = this.descendInput(node?.A).asNumber();
          const uCwYmrTbYrEU = this.descendInput(node?.B).asNumber();
          const LeMBRDfspHdg = this.descendInput(node?.C).asString();
          return new TypedInput(`(${LeMBRDfspHdg}).substring(${uSMpStXihMYb}, ${uCwYmrTbYrEU})`, TYPE_STRING);
        case 'mistsutils.starts':
          const GZECFOiZrbCX = this.descendInput(node?.A).asString();
          const uEPKmwekmIEO = this.descendInput(node?.B).asString();
          return new TypedInput(`(${GZECFOiZrbCX}).startsWith(${uEPKmwekmIEO})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const IBjdjXCuoEBS = this.descendInput(node?.A).asString();
          const qTOgpyXgaNVp = this.descendInput(node?.B).asString();
          return new TypedInput(`(${IBjdjXCuoEBS}).endsWith(${qTOgpyXgaNVp})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const SRWxcGmXYfxL = this.descendInput(node?.A).asString();
          return new TypedInput(`(${SRWxcGmXYfxL}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const dWWQALaFPLnz = this.descendInput(node?.A).asString();
          const tInmvjqtjdzn = this.descendInput(node?.B).asString();
          const iBEbvnLzyQzT = this.descendInput(node?.C).asString();
          return new TypedInput(`(${iBEbvnLzyQzT} === "" ? ${dWWQALaFPLnz} : (${dWWQALaFPLnz}).replace(${iBEbvnLzyQzT}, ${tInmvjqtjdzn}))`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const yfDKqVTQQdgu = this.descendInput(node?.A).asString();
          const duUjueSrfPkA = this.descendInput(node?.B).asString();
          const bvyvBxvEWhWd = this.descendInput(node?.C).asString();
          return new TypedInput(`(${bvyvBxvEWhWd} === "" ? ${yfDKqVTQQdgu} : (${yfDKqVTQQdgu}).replaceAll(${bvyvBxvEWhWd}, ${duUjueSrfPkA}))`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const xyHaeRfgAyEq = this.descendInput(node?.A).asString();
          const RRbkdTyeYAAR = this.descendInput(node?.B).asString();
          return new TypedInput(`(${xyHaeRfgAyEq}).substring((${xyHaeRfgAyEq}).indexOf(""+(${RRbkdTyeYAAR})) + 1, ((${xyHaeRfgAyEq}).length)`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const CgMCZviLhlit = this.descendInput(node?.A).asString();
          const QzooCUnqDnFi = this.descendInput(node?.B).asString();
          return new TypedInput(`(${CgMCZviLhlit}).split(${QzooCUnqDnFi}, 1)[0]`, TYPE_STRING);

        case 'mistsutils.split':
          const DwixPvnyyXHR = this.descendInput(node?.A).asString();
          const MBWMdqBwiCji = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((${DwixPvnyyXHR}).split(${MBWMdqBwiCji}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const jdODxhoWDRpD = this.descendInput(node?.A).asString();
          const BZbBsMstgzBY = this.descendInput(node?.B).asString();
          return new TypedInput(`(${jdODxhoWDRpD}).split(${BZbBsMstgzBY})`, TYPE_STRING);
        case 'mistsutils.length':
          const zyWwWfnNgRFb = this.descendInput(node?.A).asString();
          return new TypedInput(`((${zyWwWfnNgRFb}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const ZZRuQBwCIfAO = this.descendInput(node?.A).asString();
          const PtuJwQGmEkrn = this.descendInput(node?.B).asString();
          const aCxlBONuVmXG = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(${ZZRuQBwCIfAO}).split(${PtuJwQGmEkrn})[${aCxlBONuVmXG}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const NUvRYLUXNRRv = this.descendInput(node?.A).asString();
          const pXCPViwtEljs = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${NUvRYLUXNRRv}[${pXCPViwtEljs}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const YJOgrFcCqRCc = this.descendInput(node?.A).asString();
          const suruChsIFVuQ = this.descendInput(node?.B).asString();
          const ShArwscfyouV = this.descendInput(node?.C).asString();
          return new TypedInput(`${YJOgrFcCqRCc}[${suruChsIFVuQ}] = ${ShArwscfyouV}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const OjSRIYgHqwlW = this.descendInput(node?.A).asString();
          const fVHsPFQKGeou = this.descendInput(node?.B).asString();
          return new TypedInput(`(${OjSRIYgHqwlW})[${fVHsPFQKGeou}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const GJYiqYUOoVNy = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${GJYiqYUOoVNy})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const dwgblCYIkfon = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${dwgblCYIkfon})`, TYPE_STRING);

        case 'mistsutils.isnumber':
          const jHrORuTAkBmm = this.descendInput(node?.A).asString();
          return new TypedInput(`Number(${jHrORuTAkBmm}) == ${jHrORuTAkBmm}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const FFmVkgDsAArP = this.descendInput(node?.A).asString();
          return new TypedInput(`String(${FFmVkgDsAArP}) == ${FFmVkgDsAArP}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const ZBBrHZKrdwYy = this.descendInput(node?.A).asString();
          return new TypedInput(`${ZBBrHZKrdwYy} == "true" || ${ZBBrHZKrdwYy} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const qsOVzzyjpfXB = this.descendInput(node?.A).asString();
          return new TypedInput(`${qsOVzzyjpfXB}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const agQdjmAeYxwf = this.descendInput(node?.A).asString();
          return new TypedInput(`isNaN(Number(${agQdjmAeYxwf})) ? 0 : Number(${agQdjmAeYxwf})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const FYsKUUZPaJOU = this.descendInput(node?.A).asString();
          return new TypedInput(`${FYsKUUZPaJOU} == "true" || ${FYsKUUZPaJOU} == "1" || ${FYsKUUZPaJOU} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);

        case 'mistsutils.patchreporter':
          const USHIPCjNzHcg = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${USHIPCjNzHcg}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const XWQqTMuvzWNY = this.descendInput(node?.A).asRaw();
          const LgpbIWwlvIXY = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${XWQqTMuvzWNY}${LgpbIWwlvIXY}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const IgEIVUwCufed = this.descendInput(node?.A).asRaw();
          const qQeglpBvaApO = this.descendInput(node?.B).asRaw();
          const AHQKTBMrDIhh = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${IgEIVUwCufed}${qQeglpBvaApO}${AHQKTBMrDIhh}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const zkyZFxvpUVNk = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${zkyZFxvpUVNk}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const brWDexoEudij = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${brWDexoEudij}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const lgKikLvQyshU = this.descendInput(node?.A).asRaw();
          const VaoEDctIkqIi = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${lgKikLvQyshU}${VaoEDctIkqIi}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const NNvdBwSFygZg = this.descendInput(node?.A).asRaw();
          const uKKehPXwQSgs = this.descendInput(node?.B).asRaw();
          const qpfEjqTKfLWn = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${NNvdBwSFygZg}${uKKehPXwQSgs}${qpfEjqTKfLWn}`, TYPE_UNKNOWN);

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
