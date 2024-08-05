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
            "blockType": Scratch.BlockType.LABEL,
            "text": "Comparisons"
          },
          {
            "opcode": "notequals",
            "func": "err",
            "text": "[A] !== [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${ZmBAqyDVQZSE} !== ${GtMkSslYbYkF})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ZmBAqyDVQZSE"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "GtMkSslYbYkF"
              }
            }
          },
          {
            "opcode": "equals",
            "func": "err",
            "text": "[A] === [B]",
            "code": "(${cgGOhrZQwqBW} === ${qCznDLTlbLWd})",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "cgGOhrZQwqBW"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "qCznDLTlbLWd"
              }
            }
          },
          {
            "opcode": "greaterorequal",
            "func": "err",
            "text": "[A] >= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${LQQEMqzsveZn} >= ${rUktCxUAPACi})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "LQQEMqzsveZn"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "rUktCxUAPACi"
              }
            }
          },
          {
            "opcode": "lessthanorequal",
            "func": "err",
            "text": "[A] <= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${AlEFzeHStlUQ} <= ${SZZUfiDzpCrD})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "AlEFzeHStlUQ"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "SZZUfiDzpCrD"
              }
            }
          },
          {
            "opcode": "compare",
            "func": "err",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${eQLlBCiNlHvV} ${ozixJuRFswhr} ${kZpXNzSlFlMu})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "eQLlBCiNlHvV"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "kZpXNzSlFlMu"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "<",
                "gen_id": "ozixJuRFswhr"
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
            "code": "Math.pow(${rBgqvwpeWbVP}, ${llMFYWCiAXnc})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "rBgqvwpeWbVP"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "llMFYWCiAXnc"
              }
            }
          },
          {
            "opcode": "round",
            "func": "err",
            "text": "round [A] to the nearest [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.round((${fifOxBZXZeBw} / ${hySLjOgoXNny}) * ${hySLjOgoXNny})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "fifOxBZXZeBw"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 10,
                "gen_id": "hySLjOgoXNny"
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
            "code": "Math.min(Math.max(${BblXWktWdiXW}, ${zBaTYWUorkGD}), ${NJQljCHoKcoL})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "BblXWktWdiXW"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "zBaTYWUorkGD"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "NJQljCHoKcoL"
              }
            }
          },
          {
            "opcode": "min",
            "func": "err",
            "text": "min of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(${RaVRBgoiQVqs}, ${FwTwgelNmqYN})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "RaVRBgoiQVqs"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "FwTwgelNmqYN"
              }
            }
          },
          {
            "opcode": "max",
            "func": "err",
            "text": "max of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.max(${dGHcHvntsPBT}, ${DMugfLnYSAxJ})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "dGHcHvntsPBT"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "DMugfLnYSAxJ"
              }
            }
          },
          {
            "opcode": "interpolate",
            "func": "err",
            "text": "smooth [B] to [C] by [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${QRtaZVNtNHkh} + ((${CztDCNWpWXtk} - ${QRtaZVNtNHkh}) / ${TRakQIQNRMgp})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "TRakQIQNRMgp"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "QRtaZVNtNHkh"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "CztDCNWpWXtk"
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
            "code": "(${XzCqcksiSplC} ? (${cQOqWDBifGkF} : ${lveIWvcptfgX}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.BOOLEAN,
                "defaultValue": false,
                "gen_id": "XzCqcksiSplC"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "yes",
                "gen_id": "cQOqWDBifGkF"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "no",
                "gen_id": "lveIWvcptfgX"
              }
            }
          },
          {
            "opcode": "letters",
            "func": "err",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${zqafNfwmuEeQ}).substring(${BPvHkoCCTgfc}, ${DbUewKSJIFvE})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "BPvHkoCCTgfc"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "DbUewKSJIFvE"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "zqafNfwmuEeQ"
              }
            }
          },
          {
            "opcode": "starts",
            "func": "err",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${gXHyaccsaMrX}).startsWith(${dcWVOyMBhBVb})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "gXHyaccsaMrX"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "dcWVOyMBhBVb"
              }
            }
          },
          {
            "opcode": "ends",
            "func": "err",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${cLDIbIyLKaZT}).endsWith(${PgsiZbbWWUuo})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "cLDIbIyLKaZT"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "PgsiZbbWWUuo"
              }
            }
          },
          {
            "opcode": "toUnicode",
            "func": "err",
            "text": "Unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${vdSaCwukZXCH}).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "vdSaCwukZXCH"
              }
            }
          },
          {
            "opcode": "replace",
            "func": "err",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${hmvDVxBDyPAm} === \"\" ? ${tBFrZBrRQdpz} : (${tBFrZBrRQdpz}).replace(${hmvDVxBDyPAm}, ${NllxqnmFoIyf}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "tBFrZBrRQdpz"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "NllxqnmFoIyf"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "hmvDVxBDyPAm"
              }
            }
          },
          {
            "opcode": "replaceall",
            "func": "err",
            "text": "replace all [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${PaOAAPDwyLMy} === \"\" ? ${fkpbdHRDWoJu} : (${fkpbdHRDWoJu}).replaceAll(${PaOAAPDwyLMy}, ${qKBjbPhdwPEU}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "fkpbdHRDWoJu"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "qKBjbPhdwPEU"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "PaOAAPDwyLMy"
              }
            }
          },
          {
            "opcode": "alltextAfterString",
            "func": "err",
            "text": "text after [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${meKymCjKxZXp}).substring((${meKymCjKxZXp}).indexOf(\"\"+(${QTDoBHTlBlpS})) + 1, ((${meKymCjKxZXp}).length)",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "meKymCjKxZXp"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "QTDoBHTlBlpS"
              }
            }
          },
          {
            "opcode": "alltextBeforeString",
            "func": "err",
            "text": "text before [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${AwkLGdATVkJP}).split(${kgYSJcYPvZPX}, 1)[0]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "AwkLGdATVkJP"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "kgYSJcYPvZPX"
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
            "code": "JSON.stringify((${NrrBBAxmCwQj}).split(${HlpjQYsRwiKD}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "NrrBBAxmCwQj"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "HlpjQYsRwiKD"
              }
            }
          },
          {
            "opcode": "splitarray",
            "func": "err",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${BYSPoJQullIf}).split(${QaBNCFYHjHUj})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "BYSPoJQullIf"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "QaBNCFYHjHUj"
              }
            }
          },
          {
            "opcode": "length",
            "func": "err",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${ZBXhgcKjnVZW}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ZBXhgcKjnVZW"
              }
            }
          },
          {
            "opcode": "item",
            "func": "err",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${HdJljhuuRLne}).split(${FqtTsgcqCUoJ})[${xStMJfeYCPXH}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "HdJljhuuRLne"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "FqtTsgcqCUoJ"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "xStMJfeYCPXH"
              }
            }
          },
          {
            "opcode": "jsondelete",
            "func": "err",
            "text": "Delete Item [B] of [A]",
            "code": "delete ${rkUbcNDBVrOs}[${tmrkVEBgjlyg}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "rkUbcNDBVrOs"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "tmrkVEBgjlyg"
              }
            }
          },
          {
            "opcode": "jsonset",
            "func": "err",
            "text": "Set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${badSPwyHsFNe}[${UMPwqAVNUOXg}] = ${NuwuFpLRsfHC}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "badSPwyHsFNe"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "UMPwqAVNUOXg"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "NuwuFpLRsfHC"
              }
            }
          },
          {
            "opcode": "squarebrackets",
            "func": "err",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${XKiGoHYZzfMw})[${yOFlKQhQPeTR}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "XKiGoHYZzfMw"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "yOFlKQhQPeTR"
              }
            }
          },
          {
            "opcode": "jsonparse",
            "func": "err",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${UjCKngnHnCad})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "UjCKngnHnCad"
              }
            }
          },
          {
            "opcode": "jsonstringify",
            "func": "err",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${yOKMtiiJOqYU})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "yOKMtiiJOqYU"
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
            "code": "Number(${dTxeKTgdjAdx}) == ${dTxeKTgdjAdx}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "dTxeKTgdjAdx"
              }
            }
          },
          {
            "opcode": "isstring",
            "func": "err",
            "text": "[A] is a string",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "String(${sthLDqMXJNkN}) == ${sthLDqMXJNkN}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "sthLDqMXJNkN"
              }
            }
          },
          {
            "opcode": "isboolean",
            "func": "err",
            "text": "[A] is a boolean",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${kVRBWZxiMWOr} == \"true\" || ${kVRBWZxiMWOr} == \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "kVRBWZxiMWOr"
              }
            }
          },
          {
            "opcode": "tostring",
            "func": "err",
            "text": "to string [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${hHcDEvuuOVWY}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "hHcDEvuuOVWY"
              }
            }
          },
          {
            "opcode": "tonumber",
            "func": "err",
            "text": "to number [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "isNaN(Number(${SerILyoyjQdY})) ? 0 : Number(${SerILyoyjQdY})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "SerILyoyjQdY"
              }
            }
          },
          {
            "opcode": "toboolean",
            "func": "err",
            "text": "to boolean [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${QsFPHPyvSVKE} == \"true\" || ${QsFPHPyvSVKE} == \"1\" || ${QsFPHPyvSVKE} == \"yes\" ? \"true\" : \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "QsFPHPyvSVKE"
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
            "code": "${iJZqQAZbKKgo}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "iJZqQAZbKKgo"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${jFOKvOfRmBMo}${VywOGJCyYbxY}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "jFOKvOfRmBMo"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "VywOGJCyYbxY"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchreporter3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${ODmGHEmbZtce}${aIkmacqstUPx}${xYhTlyIUiFTI}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "ODmGHEmbZtce"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "aIkmacqstUPx"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "xYhTlyIUiFTI"
              }
            },
            "allowDropAnywhere": true
          },
          {
            "opcode": "patchboolean",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${QDbldwHiJdkJ}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "QDbldwHiJdkJ"
              }
            }
          },
          {
            "opcode": "patchcommand",
            "func": "err",
            "text": "Patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${OENVJtKLhJKz}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "OENVJtKLhJKz"
              }
            }
          },
          {
            "opcode": "patchcommand2",
            "func": "err",
            "text": "Patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${EukcSnTDXKws}${DFDVAhHEYthZ}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "EukcSnTDXKws"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "DFDVAhHEYthZ"
              }
            }
          },
          {
            "opcode": "patchcommand3",
            "func": "err",
            "text": "Patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${NbGwoZnUNkqQ}${QfpOfTrRrwxT}${jUIFXkerMnDG}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "return",
                "gen_id": "NbGwoZnUNkqQ"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"\"",
                "gen_id": "QfpOfTrRrwxT"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ";",
                "gen_id": "jUIFXkerMnDG"
              }
            }
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Vm"
          },
          {
            "opcode": "totalClones",
            "func": "err",
            "text": "Total Clones",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Scratch.vm.editingTarget.sprite.clones.length",
            "returns": "NUMBER",
            "disableMonitor": true
          },
          {
            "opcode": "getCloneVariables",
            "func": "err",
            "text": "Get All Variables In Clone [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(Object.values(Scratch.vm.editingTarget.sprite.clones[${xFpaolyomXVy}]?.variables))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "xFpaolyomXVy"
              }
            }
          },
          {
            "opcode": "moveCloneTo",
            "func": "err",
            "text": "Move Clone [A] to [B], [C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "Scratch.vm.editingTarget.sprite.clones[${tcOqReDemdYl}].setXY(${veSvNLKNcMPc}, ${uOIgATCjqawS})",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "tcOqReDemdYl"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "veSvNLKNcMPc"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "uOIgATCjqawS"
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

        case 'mistsutils.notequals':
          const ZmBAqyDVQZSE = this.descendInput(node?.A).asString();
          const GtMkSslYbYkF = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ZmBAqyDVQZSE} !== ${GtMkSslYbYkF}));\n`;
          return;
        case 'mistsutils.equals':
          const cgGOhrZQwqBW = this.descendInput(node?.A).asString();
          const qCznDLTlbLWd = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${cgGOhrZQwqBW} === ${qCznDLTlbLWd}));\n`;
          return;
        case 'mistsutils.greaterorequal':
          const LQQEMqzsveZn = this.descendInput(node?.A).asNumber();
          const rUktCxUAPACi = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${LQQEMqzsveZn} >= ${rUktCxUAPACi}));\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const AlEFzeHStlUQ = this.descendInput(node?.A).asNumber();
          const SZZUfiDzpCrD = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${AlEFzeHStlUQ} <= ${SZZUfiDzpCrD}));\n`;
          return;
        case 'mistsutils.compare':
          const eQLlBCiNlHvV = this.descendInput(node?.A).asNumber();
          const kZpXNzSlFlMu = this.descendInput(node?.B).asNumber();
          const ozixJuRFswhr = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${eQLlBCiNlHvV} ${ozixJuRFswhr} ${kZpXNzSlFlMu}));\n`;
          return;

        case 'mistsutils.power':
          const rBgqvwpeWbVP = this.descendInput(node?.A).asNumber();
          const llMFYWCiAXnc = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${rBgqvwpeWbVP}, ${llMFYWCiAXnc}));\n`;
          return;
        case 'mistsutils.round':
          const fifOxBZXZeBw = this.descendInput(node?.A).asNumber();
          const hySLjOgoXNny = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.round((${fifOxBZXZeBw} / ${hySLjOgoXNny}) * ${hySLjOgoXNny}));\n`;
          return;
        case 'mistsutils.undefined':
          this.source += `\nundefined;\n`;
          return;
        case 'mistsutils.clamp':
          const BblXWktWdiXW = this.descendInput(node?.A).asNumber();
          const zBaTYWUorkGD = this.descendInput(node?.B).asNumber();
          const NJQljCHoKcoL = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${BblXWktWdiXW}, ${zBaTYWUorkGD}), ${NJQljCHoKcoL}));\n`;
          return;
        case 'mistsutils.min':
          const RaVRBgoiQVqs = this.descendInput(node?.A).asNumber();
          const FwTwgelNmqYN = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(${RaVRBgoiQVqs}, ${FwTwgelNmqYN}));\n`;
          return;
        case 'mistsutils.max':
          const dGHcHvntsPBT = this.descendInput(node?.A).asNumber();
          const DMugfLnYSAxJ = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(${dGHcHvntsPBT}, ${DMugfLnYSAxJ}));\n`;
          return;
        case 'mistsutils.interpolate':
          const TRakQIQNRMgp = this.descendInput(node?.A).asNumber();
          const QRtaZVNtNHkh = this.descendInput(node?.B).asNumber();
          const CztDCNWpWXtk = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${QRtaZVNtNHkh} + ((${CztDCNWpWXtk} - ${QRtaZVNtNHkh}) / ${TRakQIQNRMgp}));\n`;
          return;

        case 'mistsutils.?':
          const XzCqcksiSplC = this.descendInput(node?.A).asBoolean();
          const cQOqWDBifGkF = this.descendInput(node?.B).asString();
          const lveIWvcptfgX = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${XzCqcksiSplC} ? (${cQOqWDBifGkF} : ${lveIWvcptfgX})));\n`;
          return;
        case 'mistsutils.letters':
          const BPvHkoCCTgfc = this.descendInput(node?.A).asNumber();
          const DbUewKSJIFvE = this.descendInput(node?.B).asNumber();
          const zqafNfwmuEeQ = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${zqafNfwmuEeQ}).substring(${BPvHkoCCTgfc}, ${DbUewKSJIFvE}));\n`;
          return;
        case 'mistsutils.starts':
          const gXHyaccsaMrX = this.descendInput(node?.A).asString();
          const dcWVOyMBhBVb = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${gXHyaccsaMrX}).startsWith(${dcWVOyMBhBVb}));\n`;
          return;
        case 'mistsutils.ends':
          const cLDIbIyLKaZT = this.descendInput(node?.A).asString();
          const PgsiZbbWWUuo = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${cLDIbIyLKaZT}).endsWith(${PgsiZbbWWUuo}));\n`;
          return;
        case 'mistsutils.toUnicode':
          const vdSaCwukZXCH = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${vdSaCwukZXCH}).charCodeAt(0));\n`;
          return;
        case 'mistsutils.replace':
          const tBFrZBrRQdpz = this.descendInput(node?.A).asString();
          const NllxqnmFoIyf = this.descendInput(node?.B).asString();
          const hmvDVxBDyPAm = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${hmvDVxBDyPAm} === "" ? ${tBFrZBrRQdpz} : (${tBFrZBrRQdpz}).replace(${hmvDVxBDyPAm}, ${NllxqnmFoIyf})));\n`;
          return;
        case 'mistsutils.replaceall':
          const fkpbdHRDWoJu = this.descendInput(node?.A).asString();
          const qKBjbPhdwPEU = this.descendInput(node?.B).asString();
          const PaOAAPDwyLMy = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${PaOAAPDwyLMy} === "" ? ${fkpbdHRDWoJu} : (${fkpbdHRDWoJu}).replaceAll(${PaOAAPDwyLMy}, ${qKBjbPhdwPEU})));\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const meKymCjKxZXp = this.descendInput(node?.A).asString();
          const QTDoBHTlBlpS = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${meKymCjKxZXp}).substring((${meKymCjKxZXp}).indexOf(""+(${QTDoBHTlBlpS})) + 1, ((${meKymCjKxZXp}).length));\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const AwkLGdATVkJP = this.descendInput(node?.A).asString();
          const kgYSJcYPvZPX = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${AwkLGdATVkJP}).split(${kgYSJcYPvZPX}, 1)[0]);\n`;
          return;

        case 'mistsutils.split':
          const NrrBBAxmCwQj = this.descendInput(node?.A).asString();
          const HlpjQYsRwiKD = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${NrrBBAxmCwQj}).split(${HlpjQYsRwiKD})));\n`;
          return;
        case 'mistsutils.splitarray':
          const BYSPoJQullIf = this.descendInput(node?.A).asString();
          const QaBNCFYHjHUj = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${BYSPoJQullIf}).split(${QaBNCFYHjHUj}));\n`;
          return;
        case 'mistsutils.length':
          const ZBXhgcKjnVZW = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${ZBXhgcKjnVZW}).length));\n`;
          return;
        case 'mistsutils.item':
          const HdJljhuuRLne = this.descendInput(node?.A).asString();
          const FqtTsgcqCUoJ = this.descendInput(node?.B).asString();
          const xStMJfeYCPXH = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${HdJljhuuRLne}).split(${FqtTsgcqCUoJ})[${xStMJfeYCPXH}]);\n`;
          return;
        case 'mistsutils.jsondelete':
          const rkUbcNDBVrOs = this.descendInput(node?.A).asString();
          const tmrkVEBgjlyg = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${rkUbcNDBVrOs}[${tmrkVEBgjlyg}];\n`;
          return;
        case 'mistsutils.jsonset':
          const badSPwyHsFNe = this.descendInput(node?.A).asString();
          const UMPwqAVNUOXg = this.descendInput(node?.B).asString();
          const NuwuFpLRsfHC = this.descendInput(node?.C).asString();
          this.source += `\n${badSPwyHsFNe}[${UMPwqAVNUOXg}] = ${NuwuFpLRsfHC};\n`;
          return;
        case 'mistsutils.squarebrackets':
          const XKiGoHYZzfMw = this.descendInput(node?.A).asString();
          const yOFlKQhQPeTR = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${XKiGoHYZzfMw})[${yOFlKQhQPeTR}]);\n`;
          return;
        case 'mistsutils.jsonparse':
          const UjCKngnHnCad = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${UjCKngnHnCad}));\n`;
          return;
        case 'mistsutils.jsonstringify':
          const yOKMtiiJOqYU = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${yOKMtiiJOqYU}));\n`;
          return;

        case 'mistsutils.isnumber':
          const dTxeKTgdjAdx = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Number(${dTxeKTgdjAdx}) == ${dTxeKTgdjAdx});\n`;
          return;
        case 'mistsutils.isstring':
          const sthLDqMXJNkN = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", String(${sthLDqMXJNkN}) == ${sthLDqMXJNkN});\n`;
          return;
        case 'mistsutils.isboolean':
          const kVRBWZxiMWOr = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${kVRBWZxiMWOr} == "true" || ${kVRBWZxiMWOr} == "false");\n`;
          return;
        case 'mistsutils.tostring':
          const hHcDEvuuOVWY = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${hHcDEvuuOVWY});\n`;
          return;
        case 'mistsutils.tonumber':
          const SerILyoyjQdY = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", isNaN(Number(${SerILyoyjQdY})) ? 0 : Number(${SerILyoyjQdY}));\n`;
          return;
        case 'mistsutils.toboolean':
          const QsFPHPyvSVKE = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${QsFPHPyvSVKE} == "true" || ${QsFPHPyvSVKE} == "1" || ${QsFPHPyvSVKE} == "yes" ? "true" : "false");\n`;
          return;

        case 'mistsutils.patchreporter':
          const iJZqQAZbKKgo = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${iJZqQAZbKKgo});\n`;
          return;
        case 'mistsutils.patchreporter2':
          const jFOKvOfRmBMo = this.descendInput(node?.A).asRaw();
          const VywOGJCyYbxY = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${jFOKvOfRmBMo}${VywOGJCyYbxY});\n`;
          return;
        case 'mistsutils.patchreporter3':
          const ODmGHEmbZtce = this.descendInput(node?.A).asRaw();
          const aIkmacqstUPx = this.descendInput(node?.B).asRaw();
          const xYhTlyIUiFTI = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${ODmGHEmbZtce}${aIkmacqstUPx}${xYhTlyIUiFTI});\n`;
          return;
        case 'mistsutils.patchboolean':
          const QDbldwHiJdkJ = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${QDbldwHiJdkJ});\n`;
          return;
        case 'mistsutils.patchcommand':
          const OENVJtKLhJKz = this.descendInput(node?.A).asRaw();
          this.source += `\n${OENVJtKLhJKz};\n`;
          return;
        case 'mistsutils.patchcommand2':
          const EukcSnTDXKws = this.descendInput(node?.A).asRaw();
          const DFDVAhHEYthZ = this.descendInput(node?.B).asRaw();
          this.source += `\n${EukcSnTDXKws}${DFDVAhHEYthZ};\n`;
          return;
        case 'mistsutils.patchcommand3':
          const NbGwoZnUNkqQ = this.descendInput(node?.A).asRaw();
          const QfpOfTrRrwxT = this.descendInput(node?.B).asRaw();
          const jUIFXkerMnDG = this.descendInput(node?.C).asRaw();
          this.source += `\n${NbGwoZnUNkqQ}${QfpOfTrRrwxT}${jUIFXkerMnDG};\n`;
          return;

        case 'mistsutils.totalClones':
          this.source += `\nvm.runtime.visualReport("${block.id}", Scratch.vm.editingTarget.sprite.clones.length);\n`;
          return;
        case 'mistsutils.getCloneVariables':
          const xFpaolyomXVy = this.descendInput(node?.A).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(Object.values(Scratch.vm.editingTarget.sprite.clones[${xFpaolyomXVy}]?.variables)));\n`;
          return;
        case 'mistsutils.moveCloneTo':
          const tcOqReDemdYl = this.descendInput(node?.A).asNumber();
          const veSvNLKNcMPc = this.descendInput(node?.B).asNumber();
          const uOIgATCjqawS = this.descendInput(node?.C).asNumber();
          this.source += `\nScratch.vm.editingTarget.sprite.clones[${tcOqReDemdYl}].setXY(${veSvNLKNcMPc}, ${uOIgATCjqawS});\n`;
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
        case 'mistsutils.newline':
          this.source += `\nvm.runtime.visualReport("${block.id}", "\\n");\n`;
          return;
        case 'mistsutils.pi':
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.PI);\n`;
          return;
        case 'mistsutils.e':
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.E);\n`;
          return;
        case 'mistsutils.infinity':
          this.source += `\nvm.runtime.visualReport("${block.id}", Infinity);\n`;
          return;
        case 'mistsutils.MaxInt':
          this.source += `\nvm.runtime.visualReport("${block.id}", Number.MAX_SAFE_INTEGER);\n`;
          return;
        default:
          return fn(node, ...args);
      }
    },

    descendInput(fn, node, ...args) {
      switch (node.kind) {

        case 'mistsutils.notequals':
          const ZmBAqyDVQZSE = this.descendInput(node?.A).asString();
          const GtMkSslYbYkF = this.descendInput(node?.B).asString();
          return new TypedInput(`(${ZmBAqyDVQZSE} !== ${GtMkSslYbYkF})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const cgGOhrZQwqBW = this.descendInput(node?.A).asString();
          const qCznDLTlbLWd = this.descendInput(node?.B).asString();
          return new TypedInput(`(${cgGOhrZQwqBW} === ${qCznDLTlbLWd})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const LQQEMqzsveZn = this.descendInput(node?.A).asNumber();
          const rUktCxUAPACi = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${LQQEMqzsveZn} >= ${rUktCxUAPACi})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const AlEFzeHStlUQ = this.descendInput(node?.A).asNumber();
          const SZZUfiDzpCrD = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${AlEFzeHStlUQ} <= ${SZZUfiDzpCrD})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const eQLlBCiNlHvV = this.descendInput(node?.A).asNumber();
          const kZpXNzSlFlMu = this.descendInput(node?.B).asNumber();
          const ozixJuRFswhr = this.descendInput(node?.C).asRaw();
          return new TypedInput(`(${eQLlBCiNlHvV} ${ozixJuRFswhr} ${kZpXNzSlFlMu})`, TYPE_BOOLEAN);

        case 'mistsutils.power':
          const rBgqvwpeWbVP = this.descendInput(node?.A).asNumber();
          const llMFYWCiAXnc = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${rBgqvwpeWbVP}, ${llMFYWCiAXnc})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const fifOxBZXZeBw = this.descendInput(node?.A).asNumber();
          const hySLjOgoXNny = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.round((${fifOxBZXZeBw} / ${hySLjOgoXNny}) * ${hySLjOgoXNny})`, TYPE_NUMBER);
        case 'mistsutils.undefined':
          return new TypedInput(`undefined`, TYPE_UNKNOWN);
        case 'mistsutils.clamp':
          const BblXWktWdiXW = this.descendInput(node?.A).asNumber();
          const zBaTYWUorkGD = this.descendInput(node?.B).asNumber();
          const NJQljCHoKcoL = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${BblXWktWdiXW}, ${zBaTYWUorkGD}), ${NJQljCHoKcoL})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const RaVRBgoiQVqs = this.descendInput(node?.A).asNumber();
          const FwTwgelNmqYN = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.min(${RaVRBgoiQVqs}, ${FwTwgelNmqYN})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const dGHcHvntsPBT = this.descendInput(node?.A).asNumber();
          const DMugfLnYSAxJ = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.max(${dGHcHvntsPBT}, ${DMugfLnYSAxJ})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const TRakQIQNRMgp = this.descendInput(node?.A).asNumber();
          const QRtaZVNtNHkh = this.descendInput(node?.B).asNumber();
          const CztDCNWpWXtk = this.descendInput(node?.C).asNumber();
          return new TypedInput(`${QRtaZVNtNHkh} + ((${CztDCNWpWXtk} - ${QRtaZVNtNHkh}) / ${TRakQIQNRMgp})`, TYPE_NUMBER);

        case 'mistsutils.?':
          const XzCqcksiSplC = this.descendInput(node?.A).asBoolean();
          const cQOqWDBifGkF = this.descendInput(node?.B).asString();
          const lveIWvcptfgX = this.descendInput(node?.C).asString();
          return new TypedInput(`(${XzCqcksiSplC} ? (${cQOqWDBifGkF} : ${lveIWvcptfgX}))`, TYPE_STRING);
        case 'mistsutils.letters':
          const BPvHkoCCTgfc = this.descendInput(node?.A).asNumber();
          const DbUewKSJIFvE = this.descendInput(node?.B).asNumber();
          const zqafNfwmuEeQ = this.descendInput(node?.C).asString();
          return new TypedInput(`(${zqafNfwmuEeQ}).substring(${BPvHkoCCTgfc}, ${DbUewKSJIFvE})`, TYPE_STRING);
        case 'mistsutils.starts':
          const gXHyaccsaMrX = this.descendInput(node?.A).asString();
          const dcWVOyMBhBVb = this.descendInput(node?.B).asString();
          return new TypedInput(`(${gXHyaccsaMrX}).startsWith(${dcWVOyMBhBVb})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const cLDIbIyLKaZT = this.descendInput(node?.A).asString();
          const PgsiZbbWWUuo = this.descendInput(node?.B).asString();
          return new TypedInput(`(${cLDIbIyLKaZT}).endsWith(${PgsiZbbWWUuo})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const vdSaCwukZXCH = this.descendInput(node?.A).asString();
          return new TypedInput(`(${vdSaCwukZXCH}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const tBFrZBrRQdpz = this.descendInput(node?.A).asString();
          const NllxqnmFoIyf = this.descendInput(node?.B).asString();
          const hmvDVxBDyPAm = this.descendInput(node?.C).asString();
          return new TypedInput(`(${hmvDVxBDyPAm} === "" ? ${tBFrZBrRQdpz} : (${tBFrZBrRQdpz}).replace(${hmvDVxBDyPAm}, ${NllxqnmFoIyf}))`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const fkpbdHRDWoJu = this.descendInput(node?.A).asString();
          const qKBjbPhdwPEU = this.descendInput(node?.B).asString();
          const PaOAAPDwyLMy = this.descendInput(node?.C).asString();
          return new TypedInput(`(${PaOAAPDwyLMy} === "" ? ${fkpbdHRDWoJu} : (${fkpbdHRDWoJu}).replaceAll(${PaOAAPDwyLMy}, ${qKBjbPhdwPEU}))`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const meKymCjKxZXp = this.descendInput(node?.A).asString();
          const QTDoBHTlBlpS = this.descendInput(node?.B).asString();
          return new TypedInput(`(${meKymCjKxZXp}).substring((${meKymCjKxZXp}).indexOf(""+(${QTDoBHTlBlpS})) + 1, ((${meKymCjKxZXp}).length)`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const AwkLGdATVkJP = this.descendInput(node?.A).asString();
          const kgYSJcYPvZPX = this.descendInput(node?.B).asString();
          return new TypedInput(`(${AwkLGdATVkJP}).split(${kgYSJcYPvZPX}, 1)[0]`, TYPE_STRING);

        case 'mistsutils.split':
          const NrrBBAxmCwQj = this.descendInput(node?.A).asString();
          const HlpjQYsRwiKD = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((${NrrBBAxmCwQj}).split(${HlpjQYsRwiKD}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const BYSPoJQullIf = this.descendInput(node?.A).asString();
          const QaBNCFYHjHUj = this.descendInput(node?.B).asString();
          return new TypedInput(`(${BYSPoJQullIf}).split(${QaBNCFYHjHUj})`, TYPE_STRING);
        case 'mistsutils.length':
          const ZBXhgcKjnVZW = this.descendInput(node?.A).asString();
          return new TypedInput(`((${ZBXhgcKjnVZW}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const HdJljhuuRLne = this.descendInput(node?.A).asString();
          const FqtTsgcqCUoJ = this.descendInput(node?.B).asString();
          const xStMJfeYCPXH = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(${HdJljhuuRLne}).split(${FqtTsgcqCUoJ})[${xStMJfeYCPXH}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const rkUbcNDBVrOs = this.descendInput(node?.A).asString();
          const tmrkVEBgjlyg = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${rkUbcNDBVrOs}[${tmrkVEBgjlyg}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const badSPwyHsFNe = this.descendInput(node?.A).asString();
          const UMPwqAVNUOXg = this.descendInput(node?.B).asString();
          const NuwuFpLRsfHC = this.descendInput(node?.C).asString();
          return new TypedInput(`${badSPwyHsFNe}[${UMPwqAVNUOXg}] = ${NuwuFpLRsfHC}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const XKiGoHYZzfMw = this.descendInput(node?.A).asString();
          const yOFlKQhQPeTR = this.descendInput(node?.B).asString();
          return new TypedInput(`(${XKiGoHYZzfMw})[${yOFlKQhQPeTR}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const UjCKngnHnCad = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${UjCKngnHnCad})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const yOKMtiiJOqYU = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.stringify(${yOKMtiiJOqYU})`, TYPE_STRING);

        case 'mistsutils.isnumber':
          const dTxeKTgdjAdx = this.descendInput(node?.A).asString();
          return new TypedInput(`Number(${dTxeKTgdjAdx}) == ${dTxeKTgdjAdx}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const sthLDqMXJNkN = this.descendInput(node?.A).asString();
          return new TypedInput(`String(${sthLDqMXJNkN}) == ${sthLDqMXJNkN}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const kVRBWZxiMWOr = this.descendInput(node?.A).asString();
          return new TypedInput(`${kVRBWZxiMWOr} == "true" || ${kVRBWZxiMWOr} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const hHcDEvuuOVWY = this.descendInput(node?.A).asString();
          return new TypedInput(`${hHcDEvuuOVWY}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const SerILyoyjQdY = this.descendInput(node?.A).asString();
          return new TypedInput(`isNaN(Number(${SerILyoyjQdY})) ? 0 : Number(${SerILyoyjQdY})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const QsFPHPyvSVKE = this.descendInput(node?.A).asString();
          return new TypedInput(`${QsFPHPyvSVKE} == "true" || ${QsFPHPyvSVKE} == "1" || ${QsFPHPyvSVKE} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);

        case 'mistsutils.patchreporter':
          const iJZqQAZbKKgo = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${iJZqQAZbKKgo}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const jFOKvOfRmBMo = this.descendInput(node?.A).asRaw();
          const VywOGJCyYbxY = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${jFOKvOfRmBMo}${VywOGJCyYbxY}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const ODmGHEmbZtce = this.descendInput(node?.A).asRaw();
          const aIkmacqstUPx = this.descendInput(node?.B).asRaw();
          const xYhTlyIUiFTI = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${ODmGHEmbZtce}${aIkmacqstUPx}${xYhTlyIUiFTI}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const QDbldwHiJdkJ = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${QDbldwHiJdkJ}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const OENVJtKLhJKz = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${OENVJtKLhJKz}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const EukcSnTDXKws = this.descendInput(node?.A).asRaw();
          const DFDVAhHEYthZ = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${EukcSnTDXKws}${DFDVAhHEYthZ}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const NbGwoZnUNkqQ = this.descendInput(node?.A).asRaw();
          const QfpOfTrRrwxT = this.descendInput(node?.B).asRaw();
          const jUIFXkerMnDG = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${NbGwoZnUNkqQ}${QfpOfTrRrwxT}${jUIFXkerMnDG}`, TYPE_UNKNOWN);

        case 'mistsutils.totalClones':
          return new TypedInput(`Scratch.vm.editingTarget.sprite.clones.length`, TYPE_NUMBER);
        case 'mistsutils.getCloneVariables':
          const xFpaolyomXVy = this.descendInput(node?.A).asNumber();
          return new TypedInput(`JSON.stringify(Object.values(Scratch.vm.editingTarget.sprite.clones[${xFpaolyomXVy}]?.variables))`, TYPE_STRING);
        case 'mistsutils.moveCloneTo':
          const tcOqReDemdYl = this.descendInput(node?.A).asNumber();
          const veSvNLKNcMPc = this.descendInput(node?.B).asNumber();
          const uOIgATCjqawS = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Scratch.vm.editingTarget.sprite.clones[${tcOqReDemdYl}].setXY(${veSvNLKNcMPc}, ${uOIgATCjqawS})`, TYPE_UNKNOWN);

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

        case 'mistsutils_totalClones':
          return {
            block, kind: 'mistsutils.totalClones',
          };
        case 'mistsutils_getCloneVariables':
          return {
            block, kind: 'mistsutils.getCloneVariables',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_moveCloneTo':
          return {
            block, kind: 'mistsutils.moveCloneTo',
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

        case 'mistsutils_totalClones':
          return {
            block,
            kind: 'mistsutils.totalClones',
          };
        case 'mistsutils_getCloneVariables':
          return {
            block,
            kind: 'mistsutils.getCloneVariables',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_moveCloneTo':
          return {
            block,
            kind: 'mistsutils.moveCloneTo',
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
