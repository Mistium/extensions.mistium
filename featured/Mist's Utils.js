/**!
 * Mist's Utils
 * @author mistium
 * @version 5.7
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

  class mistsutils {
    getInfo() {
      return {
        id: 'mistsutils',
        name: 'Mists Utils',
        color1: '#2DA4A0',
        version: 5.7,
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
            "code": "(${notequals_1} !== ${notequals_2})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "notequals_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "notequals_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "equals",
            "text": "[A] === [B]",
            "code": "(${equals_1} === ${equals_2})",
            "blockType": Scratch.BlockType.BOOLEAN,
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "equals_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "equals_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "greaterorequal",
            "text": "[A] >= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${greaterorequal_1} >= ${greaterorequal_2})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "greaterorequal_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "greaterorequal_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "lessthanorequal",
            "text": "[A] <= [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${lessthanorequal_1} <= ${lessthanorequal_2})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "lessthanorequal_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "lessthanorequal_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "compare",
            "text": "[A] [C] [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${compare_1} ${compare_3} ${compare_2})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "compare_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "compare_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "<",
                "gen_id": "compare_3"
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
            "code": "Math.pow(${power_1}, ${power_2})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "power_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "power_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "round",
            "text": "round [A] to the nearest [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.round((${round_1} / ${round_2}) * ${round_2})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "round_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 10,
                "gen_id": "round_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "clamp",
            "text": "clamp [A] between [B] and [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(Math.max(${clamp_1}, ${clamp_2}), ${clamp_3})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "clamp_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "clamp_2"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "clamp_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "min",
            "text": "min of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.min(${min_1}, ${min_2})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "min_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "min_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "max",
            "text": "max of [A] and [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "Math.max(${max_1}, ${max_2})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "max_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 50,
                "gen_id": "max_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "interpolate",
            "text": "smooth [B] to [C] by [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${interpolate_2} + ((${interpolate_3} - ${interpolate_2}) / ${interpolate_1})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 3,
                "gen_id": "interpolate_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 0,
                "gen_id": "interpolate_2"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 100,
                "gen_id": "interpolate_3"
              }
            },
            "func": "err"
          },
          {
            "blockType": Scratch.BlockType.LABEL,
            "text": "Strings"
          },
          {
            "opcode": "ifthen",
            "text": "if [A] then [B] else [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${ifthen_1} ? ${ifthen_2} : ${ifthen_3})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.BOOLEAN,
                "defaultValue": false,
                "gen_id": "ifthen_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "yes",
                "gen_id": "ifthen_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "no",
                "gen_id": "ifthen_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "letters",
            "text": "letters [A] to [B] of [C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${letters_3}).substring(Math.max(0,${letters_1}-1), Math.min(${letters_2}, ${letters_3}.length))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 2,
                "gen_id": "letters_1"
              },
              "B": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 4,
                "gen_id": "letters_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "letters_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "starts",
            "text": "[A] starts with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${starts_1}).startsWith(${starts_2})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "starts_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "starts_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "ends",
            "text": "[A] ends with [B]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "(${ends_1}).endsWith(${ends_2})",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "ends_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "app",
                "gen_id": "ends_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toUnicode",
            "text": "unicode Of [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${toUnicode_1}).charCodeAt(0)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "A",
                "gen_id": "toUnicode_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replace",
            "text": "replace [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${replace_3} === \"\" ? ${replace_1} : (${replace_1}).replace(${replace_3}, ${replace_2}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "replace_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "replace_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "replace_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replaceall",
            "text": "replace all [C] in [A] with [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${replaceall_3} === \"\" ? ${replaceall_1} : (${replaceall_1}).replaceAll(${replaceall_3}, ${replaceall_2}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "replaceall_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "replaceall_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "p",
                "gen_id": "replaceall_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextAfterString",
            "text": "text after [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${alltextAfterString_1}).substring((${alltextAfterString_1}).indexOf(\"\"+(${alltextAfterString_2})) + 1, ((${alltextAfterString_1}).length))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "alltextAfterString_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "alltextAfterString_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextBeforeString",
            "text": "text before [B] in [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${alltextBeforeString_1}).split(${alltextBeforeString_2}, 1)[0]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "alltextBeforeString_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "alltextBeforeString_2"
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
            "code": "JSON.stringify((${split_1}).split(${split_2}))",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "split_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "split_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "splitarray",
            "text": "split [A] by [B] (array)",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${splitarray_1}).split(${splitarray_2})",
            "returns": "RAW",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "splitarray_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "splitarray_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "length",
            "text": "[A].length",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "((${length_1}).length)",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "length_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "item",
            "text": "item [C] of [A] split by [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${item_1}).split(${item_2})[${item_3}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "item_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "l",
                "gen_id": "item_2"
              },
              "C": {
                "type": Scratch.ArgumentType.NUMBER,
                "defaultValue": 1,
                "gen_id": "item_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsondelete",
            "text": "delete Item [B] of [A]",
            "code": "delete ${jsondelete_1}[${jsondelete_2}]",
            "blockType": Scratch.BlockType.COMMAND,
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "jsondelete_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "jsondelete_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonset",
            "text": "set [B] to [C] in [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${jsonset_1}[${jsonset_2}] = ${jsonset_3}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "",
                "gen_id": "jsonset_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "0",
                "gen_id": "jsonset_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "\"hello world\"",
                "gen_id": "jsonset_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "squarebrackets",
            "text": "[A] item [B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "(${squarebrackets_1})[${squarebrackets_2}]",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "apple",
                "gen_id": "squarebrackets_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "squarebrackets_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonparse",
            "text": "JSON.parse [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.parse(${jsonparse_1})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "{\"a\": 1}",
                "gen_id": "jsonparse_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonstringify",
            "text": "JSON.stringify [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "JSON.stringify(${jsonstringify_1})",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "",
                "gen_id": "jsonstringify_1"
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
            "code": "Number(${isnumber_1}) == ${isnumber_1}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "isnumber_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isstring",
            "text": "[A] is a string",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "String(${isstring_1}) == ${isstring_1}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "apple",
                "gen_id": "isstring_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isboolean",
            "text": "[A] is a boolean",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${isboolean_1} == \"true\" || ${isboolean_1} == \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "isboolean_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tostring",
            "text": "to string [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${tostring_1}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "tostring_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tonumber",
            "text": "to number [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "isNaN(Number(${tonumber_1})) ? 0 : Number(${tonumber_1})",
            "returns": "NUMBER",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "1",
                "gen_id": "tonumber_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toboolean",
            "text": "to boolean [A]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${toboolean_1} == \"true\" || ${toboolean_1} == \"1\" || ${toboolean_1} == \"yes\" ? \"true\" : \"false\"",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "defaultValue": "true",
                "gen_id": "toboolean_1"
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
            "code": "${patchreporter_1}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1 * 3",
                "gen_id": "patchreporter_1"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter2",
            "text": "patch [A][B]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${patchreporter2_1}${patchreporter2_2}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1 * ",
                "gen_id": "patchreporter2_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "3",
                "gen_id": "patchreporter2_2"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter3",
            "text": "patch [A][B][C]",
            "blockType": Scratch.BlockType.REPORTER,
            "code": "${patchreporter3_1}${patchreporter3_2}${patchreporter3_3}",
            "returns": "STRING",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1",
                "gen_id": "patchreporter3_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "*",
                "gen_id": "patchreporter3_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "3",
                "gen_id": "patchreporter3_3"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchboolean",
            "text": "patch [A]",
            "blockType": Scratch.BlockType.BOOLEAN,
            "code": "${patchboolean_1}",
            "returns": "BOOLEAN",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1 == 6",
                "gen_id": "patchboolean_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand",
            "text": "patch [A]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${patchcommand_1}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "1 + 5",
                "gen_id": "patchcommand_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand2",
            "text": "patch [A][B]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${patchcommand2_1}${patchcommand2_2}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "5 +",
                "gen_id": "patchcommand2_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "5",
                "gen_id": "patchcommand2_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand3",
            "text": "patch [A][B][C]",
            "blockType": Scratch.BlockType.COMMAND,
            "code": "${patchcommand3_1}${patchcommand3_2}${patchcommand3_3}",
            "arguments": {
              "A": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "console.log(",
                "gen_id": "patchcommand3_1"
              },
              "B": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": "\"hello world\"",
                "gen_id": "patchcommand3_2"
              },
              "C": {
                "type": Scratch.ArgumentType.STRING,
                "as": "RAW",
                "defaultValue": ")",
                "gen_id": "patchcommand3_3"
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

    constructor() {
      console.log("Loaded Mist's utils! (v5.7)");
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
            if (!(text.includes("version: 5.7,"))) {
              this.newUpdate = true;
            }
          })
      };
    }

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
    return this.asSafe();
  };

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

  cst_patch(JSGP, {
    descendStackedBlock(fn, node, ...args) {
      const block = node.block;
      switch (node.kind) {
        case 'mistsutils.undefined':
          this.source += `\nundefined\n`;
          return;

        case 'mistsutils.notequals':
          const notequals_1 = this.descendInput(node?.A).asString();
          const notequals_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${notequals_1} !== ${notequals_2}))\n`;
          return;
        case 'mistsutils.equals':
          const equals_1 = this.descendInput(node?.A).asString();
          const equals_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${equals_1} === ${equals_2}))\n`;
          return;
        case 'mistsutils.greaterorequal':
          const greaterorequal_1 = this.descendInput(node?.A).asNumber();
          const greaterorequal_2 = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${greaterorequal_1} >= ${greaterorequal_2}))\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const lessthanorequal_1 = this.descendInput(node?.A).asNumber();
          const lessthanorequal_2 = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${lessthanorequal_1} <= ${lessthanorequal_2}))\n`;
          return;
        case 'mistsutils.compare':
          const compare_1 = this.descendInput(node?.A).asNumber();
          const compare_2 = this.descendInput(node?.B).asNumber();
          const compare_3 = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${compare_1} ${compare_3} ${compare_2}))\n`;
          return;

        case 'mistsutils.power':
          const power_1 = this.descendInput(node?.A).asNumber();
          const power_2 = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.pow(${power_1}, ${power_2}))\n`;
          return;
        case 'mistsutils.round':
          const round_1 = this.descendInput(node?.A).asNumber();
          const round_2 = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.round((${round_1} / ${round_2}) * ${round_2}))\n`;
          return;
        case 'mistsutils.clamp':
          const clamp_1 = this.descendInput(node?.A).asNumber();
          const clamp_2 = this.descendInput(node?.B).asNumber();
          const clamp_3 = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(Math.max(${clamp_1}, ${clamp_2}), ${clamp_3}))\n`;
          return;
        case 'mistsutils.min':
          const min_1 = this.descendInput(node?.A).asNumber();
          const min_2 = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.min(${min_1}, ${min_2}))\n`;
          return;
        case 'mistsutils.max':
          const max_1 = this.descendInput(node?.A).asNumber();
          const max_2 = this.descendInput(node?.B).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", Math.max(${max_1}, ${max_2}))\n`;
          return;
        case 'mistsutils.interpolate':
          const interpolate_1 = this.descendInput(node?.A).asNumber();
          const interpolate_2 = this.descendInput(node?.B).asNumber();
          const interpolate_3 = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${interpolate_2} + ((${interpolate_3} - ${interpolate_2}) / ${interpolate_1}))\n`;
          return;

        case 'mistsutils.ifthen':
          const ifthen_1 = this.descendInput(node?.A).asBoolean();
          const ifthen_2 = this.descendInput(node?.B).asString();
          const ifthen_3 = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ifthen_1} ? ${ifthen_2} : ${ifthen_3}))\n`;
          return;
        case 'mistsutils.letters':
          const letters_1 = this.descendInput(node?.A).asNumber();
          const letters_2 = this.descendInput(node?.B).asNumber();
          const letters_3 = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${letters_3}).substring(Math.max(0,${letters_1}-1), Math.min(${letters_2}, ${letters_3}.length)))\n`;
          return;
        case 'mistsutils.starts':
          const starts_1 = this.descendInput(node?.A).asString();
          const starts_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${starts_1}).startsWith(${starts_2}))\n`;
          return;
        case 'mistsutils.ends':
          const ends_1 = this.descendInput(node?.A).asString();
          const ends_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${ends_1}).endsWith(${ends_2}))\n`;
          return;
        case 'mistsutils.toUnicode':
          const toUnicode_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${toUnicode_1}).charCodeAt(0))\n`;
          return;
        case 'mistsutils.replace':
          const replace_1 = this.descendInput(node?.A).asString();
          const replace_2 = this.descendInput(node?.B).asString();
          const replace_3 = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${replace_3} === "" ? ${replace_1} : (${replace_1}).replace(${replace_3}, ${replace_2})))\n`;
          return;
        case 'mistsutils.replaceall':
          const replaceall_1 = this.descendInput(node?.A).asString();
          const replaceall_2 = this.descendInput(node?.B).asString();
          const replaceall_3 = this.descendInput(node?.C).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${replaceall_3} === "" ? ${replaceall_1} : (${replaceall_1}).replaceAll(${replaceall_3}, ${replaceall_2})))\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const alltextAfterString_1 = this.descendInput(node?.A).asString();
          const alltextAfterString_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${alltextAfterString_1}).substring((${alltextAfterString_1}).indexOf(""+(${alltextAfterString_2})) + 1, ((${alltextAfterString_1}).length)))\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const alltextBeforeString_1 = this.descendInput(node?.A).asString();
          const alltextBeforeString_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${alltextBeforeString_1}).split(${alltextBeforeString_2}, 1)[0])\n`;
          return;

        case 'mistsutils.split':
          const split_1 = this.descendInput(node?.A).asString();
          const split_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify((${split_1}).split(${split_2})))\n`;
          return;
        case 'mistsutils.splitarray':
          const splitarray_1 = this.descendInput(node?.A).asString();
          const splitarray_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${splitarray_1}).split(${splitarray_2}))\n`;
          return;
        case 'mistsutils.length':
          const length_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ((${length_1}).length))\n`;
          return;
        case 'mistsutils.item':
          const item_1 = this.descendInput(node?.A).asRaw();
          const item_2 = this.descendInput(node?.B).asString();
          const item_3 = this.descendInput(node?.C).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${item_1}).split(${item_2})[${item_3}])\n`;
          return;
        case 'mistsutils.jsondelete':
          const jsondelete_1 = this.descendInput(node?.A).asString();
          const jsondelete_2 = this.descendInput(node?.B).asString();
          this.source += `\ndelete ${jsondelete_1}[${jsondelete_2}]\n`;
          return;
        case 'mistsutils.jsonset':
          const jsonset_1 = this.descendInput(node?.A).asString();
          const jsonset_2 = this.descendInput(node?.B).asString();
          const jsonset_3 = this.descendInput(node?.C).asString();
          this.source += `\n${jsonset_1}[${jsonset_2}] = ${jsonset_3}\n`;
          return;
        case 'mistsutils.squarebrackets':
          const squarebrackets_1 = this.descendInput(node?.A).asRaw();
          const squarebrackets_2 = this.descendInput(node?.B).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${squarebrackets_1})[${squarebrackets_2}])\n`;
          return;
        case 'mistsutils.jsonparse':
          const jsonparse_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.parse(${jsonparse_1}))\n`;
          return;
        case 'mistsutils.jsonstringify':
          const jsonstringify_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", JSON.stringify(${jsonstringify_1}))\n`;
          return;

        case 'mistsutils.isnumber':
          const isnumber_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", Number(${isnumber_1}) == ${isnumber_1})\n`;
          return;
        case 'mistsutils.isstring':
          const isstring_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", String(${isstring_1}) == ${isstring_1})\n`;
          return;
        case 'mistsutils.isboolean':
          const isboolean_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${isboolean_1} == "true" || ${isboolean_1} == "false")\n`;
          return;
        case 'mistsutils.tostring':
          const tostring_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${tostring_1})\n`;
          return;
        case 'mistsutils.tonumber':
          const tonumber_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", isNaN(Number(${tonumber_1})) ? 0 : Number(${tonumber_1}))\n`;
          return;
        case 'mistsutils.toboolean':
          const toboolean_1 = this.descendInput(node?.A).asString();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${toboolean_1} == "true" || ${toboolean_1} == "1" || ${toboolean_1} == "yes" ? "true" : "false")\n`;
          return;

        case 'mistsutils.patchreporter':
          const patchreporter_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${patchreporter_1})\n`;
          return;
        case 'mistsutils.patchreporter2':
          const patchreporter2_1 = this.descendInput(node?.A).asRaw();
          const patchreporter2_2 = this.descendInput(node?.B).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${patchreporter2_1}${patchreporter2_2})\n`;
          return;
        case 'mistsutils.patchreporter3':
          const patchreporter3_1 = this.descendInput(node?.A).asRaw();
          const patchreporter3_2 = this.descendInput(node?.B).asRaw();
          const patchreporter3_3 = this.descendInput(node?.C).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${patchreporter3_1}${patchreporter3_2}${patchreporter3_3})\n`;
          return;
        case 'mistsutils.patchboolean':
          const patchboolean_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", ${patchboolean_1})\n`;
          return;
        case 'mistsutils.patchcommand':
          const patchcommand_1 = this.descendInput(node?.A).asRaw();
          this.source += `\n${patchcommand_1}\n`;
          return;
        case 'mistsutils.patchcommand2':
          const patchcommand2_1 = this.descendInput(node?.A).asRaw();
          const patchcommand2_2 = this.descendInput(node?.B).asRaw();
          this.source += `\n${patchcommand2_1}${patchcommand2_2}\n`;
          return;
        case 'mistsutils.patchcommand3':
          const patchcommand3_1 = this.descendInput(node?.A).asRaw();
          const patchcommand3_2 = this.descendInput(node?.B).asRaw();
          const patchcommand3_3 = this.descendInput(node?.C).asRaw();
          this.source += `\n${patchcommand3_1}${patchcommand3_2}${patchcommand3_3}\n`;
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
          const notequals_1 = this.descendInput(node?.A).asString();
          const notequals_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${notequals_1} !== ${notequals_2})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const equals_1 = this.descendInput(node?.A).asString();
          const equals_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${equals_1} === ${equals_2})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const greaterorequal_1 = this.descendInput(node?.A).asNumber();
          const greaterorequal_2 = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${greaterorequal_1} >= ${greaterorequal_2})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const lessthanorequal_1 = this.descendInput(node?.A).asNumber();
          const lessthanorequal_2 = this.descendInput(node?.B).asNumber();
          return new TypedInput(`(${lessthanorequal_1} <= ${lessthanorequal_2})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const compare_1 = this.descendInput(node?.A).asNumber();
          const compare_2 = this.descendInput(node?.B).asNumber();
          const compare_3 = this.descendInput(node?.C).asRaw();
          return new TypedInput(`(${compare_1} ${compare_3} ${compare_2})`, TYPE_BOOLEAN);

        case 'mistsutils.power':
          const power_1 = this.descendInput(node?.A).asNumber();
          const power_2 = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.pow(${power_1}, ${power_2})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const round_1 = this.descendInput(node?.A).asNumber();
          const round_2 = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.round((${round_1} / ${round_2}) * ${round_2})`, TYPE_NUMBER);
        case 'mistsutils.clamp':
          const clamp_1 = this.descendInput(node?.A).asNumber();
          const clamp_2 = this.descendInput(node?.B).asNumber();
          const clamp_3 = this.descendInput(node?.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${clamp_1}, ${clamp_2}), ${clamp_3})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const min_1 = this.descendInput(node?.A).asNumber();
          const min_2 = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.min(${min_1}, ${min_2})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const max_1 = this.descendInput(node?.A).asNumber();
          const max_2 = this.descendInput(node?.B).asNumber();
          return new TypedInput(`Math.max(${max_1}, ${max_2})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const interpolate_1 = this.descendInput(node?.A).asNumber();
          const interpolate_2 = this.descendInput(node?.B).asNumber();
          const interpolate_3 = this.descendInput(node?.C).asNumber();
          return new TypedInput(`${interpolate_2} + ((${interpolate_3} - ${interpolate_2}) / ${interpolate_1})`, TYPE_NUMBER);

        case 'mistsutils.ifthen':
          const ifthen_1 = this.descendInput(node?.A).asBoolean();
          const ifthen_2 = this.descendInput(node?.B).asString();
          const ifthen_3 = this.descendInput(node?.C).asString();
          return new TypedInput(`(${ifthen_1} ? ${ifthen_2} : ${ifthen_3})`, TYPE_STRING);
        case 'mistsutils.letters':
          const letters_1 = this.descendInput(node?.A).asNumber();
          const letters_2 = this.descendInput(node?.B).asNumber();
          const letters_3 = this.descendInput(node?.C).asString();
          return new TypedInput(`(${letters_3}).substring(Math.max(0,${letters_1}-1), Math.min(${letters_2}, ${letters_3}.length))`, TYPE_STRING);
        case 'mistsutils.starts':
          const starts_1 = this.descendInput(node?.A).asString();
          const starts_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${starts_1}).startsWith(${starts_2})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const ends_1 = this.descendInput(node?.A).asString();
          const ends_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${ends_1}).endsWith(${ends_2})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const toUnicode_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`(${toUnicode_1}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const replace_1 = this.descendInput(node?.A).asString();
          const replace_2 = this.descendInput(node?.B).asString();
          const replace_3 = this.descendInput(node?.C).asString();
          return new TypedInput(`(${replace_3} === "" ? ${replace_1} : (${replace_1}).replace(${replace_3}, ${replace_2}))`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const replaceall_1 = this.descendInput(node?.A).asString();
          const replaceall_2 = this.descendInput(node?.B).asString();
          const replaceall_3 = this.descendInput(node?.C).asString();
          return new TypedInput(`(${replaceall_3} === "" ? ${replaceall_1} : (${replaceall_1}).replaceAll(${replaceall_3}, ${replaceall_2}))`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const alltextAfterString_1 = this.descendInput(node?.A).asString();
          const alltextAfterString_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${alltextAfterString_1}).substring((${alltextAfterString_1}).indexOf(""+(${alltextAfterString_2})) + 1, ((${alltextAfterString_1}).length))`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const alltextBeforeString_1 = this.descendInput(node?.A).asString();
          const alltextBeforeString_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${alltextBeforeString_1}).split(${alltextBeforeString_2}, 1)[0]`, TYPE_STRING);

        case 'mistsutils.split':
          const split_1 = this.descendInput(node?.A).asString();
          const split_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`JSON.stringify((${split_1}).split(${split_2}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const splitarray_1 = this.descendInput(node?.A).asString();
          const splitarray_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${splitarray_1}).split(${splitarray_2})`, TYPE_UNKNOWN);
        case 'mistsutils.length':
          const length_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`((${length_1}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const item_1 = this.descendInput(node?.A).asRaw();
          const item_2 = this.descendInput(node?.B).asString();
          const item_3 = this.descendInput(node?.C).asNumber();
          return new TypedInput(`(${item_1}).split(${item_2})[${item_3}]`, TYPE_STRING);
        case 'mistsutils.jsondelete':
          const jsondelete_1 = this.descendInput(node?.A).asString();
          const jsondelete_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`delete ${jsondelete_1}[${jsondelete_2}]`, TYPE_UNKNOWN);
        case 'mistsutils.jsonset':
          const jsonset_1 = this.descendInput(node?.A).asString();
          const jsonset_2 = this.descendInput(node?.B).asString();
          const jsonset_3 = this.descendInput(node?.C).asString();
          return new TypedInput(`${jsonset_1}[${jsonset_2}] = ${jsonset_3}`, TYPE_UNKNOWN);
        case 'mistsutils.squarebrackets':
          const squarebrackets_1 = this.descendInput(node?.A).asRaw();
          const squarebrackets_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${squarebrackets_1})[${squarebrackets_2}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const jsonparse_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`JSON.parse(${jsonparse_1})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const jsonstringify_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`JSON.stringify(${jsonstringify_1})`, TYPE_STRING);

        case 'mistsutils.isnumber':
          const isnumber_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`Number(${isnumber_1}) == ${isnumber_1}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const isstring_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`String(${isstring_1}) == ${isstring_1}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const isboolean_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`${isboolean_1} == "true" || ${isboolean_1} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const tostring_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`${tostring_1}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const tonumber_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`isNaN(Number(${tonumber_1})) ? 0 : Number(${tonumber_1})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const toboolean_1 = this.descendInput(node?.A).asString();
          return new TypedInput(`${toboolean_1} == "true" || ${toboolean_1} == "1" || ${toboolean_1} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);

        case 'mistsutils.patchreporter':
          const patchreporter_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${patchreporter_1}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const patchreporter2_1 = this.descendInput(node?.A).asRaw();
          const patchreporter2_2 = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${patchreporter2_1}${patchreporter2_2}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const patchreporter3_1 = this.descendInput(node?.A).asRaw();
          const patchreporter3_2 = this.descendInput(node?.B).asRaw();
          const patchreporter3_3 = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${patchreporter3_1}${patchreporter3_2}${patchreporter3_3}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const patchboolean_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${patchboolean_1}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const patchcommand_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${patchcommand_1}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const patchcommand2_1 = this.descendInput(node?.A).asRaw();
          const patchcommand2_2 = this.descendInput(node?.B).asRaw();
          return new TypedInput(`${patchcommand2_1}${patchcommand2_2}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const patchcommand3_1 = this.descendInput(node?.A).asRaw();
          const patchcommand3_2 = this.descendInput(node?.B).asRaw();
          const patchcommand3_3 = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${patchcommand3_1}${patchcommand3_2}${patchcommand3_3}`, TYPE_UNKNOWN);

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

        case 'mistsutils_ifthen':
          return {
            block, kind: 'mistsutils.ifthen',
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

        case 'mistsutils_ifthen':
          return {
            block,
            kind: 'mistsutils.ifthen',
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
