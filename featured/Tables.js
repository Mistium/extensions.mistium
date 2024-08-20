(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("mistytables needs to be run unsandboxed.");
  }

  class mistytables {
    getInfo() {
      return {
        id: 'mistytables',
        name: 'Tables',
        color1: '#ab1922',

        blocks: [{
            "opcode": "newTable",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "new table",
            "code": "([[]])",
            "func": "err"
          },
          "---",
          {
            "opcode": "addRow",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "add row to [A]",
            "code": "${addRow_1}.push(new Array(${addRow_1}[0].length).fill(\"\"))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "addRow_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "addColumn",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "add column to [A]",
            "code": "${addColumn_1}.map(column => (column.push(\"\"), column))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "addColumn_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "deleteRow",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "delete row [X] in [A]",
            "code": "${deleteRow_1} = (${deleteRow_1}.splice(${deleteRow_2}, 1))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "deleteRow_1"
              },
              "X": {
                "type": "number",
                "gen_id": "deleteRow_2",
                "defaultValue": "0"
              }
            },
            "func": "err"
          },
          {
            "opcode": "deleteColumn",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "delete column [X] in [A]",
            "code": "${deleteColumn_1} = (${deleteColumn_1}.map(column => (column.splice(${deleteColumn_2}, 1), column)))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "deleteColumn_1"
              },
              "X": {
                "type": "number",
                "gen_id": "deleteColumn_2",
                "defaultValue": "0"
              }
            },
            "func": "err"
          },
          "---",
          {
            "opcode": "addRows",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "add [A] rows to [B]",
            "code": "for (let i = 0; i < ${addRows_1}; i++) { ${addRows_2}.push(new Array(${addRows_2}[0].length).fill(\"\")) }",
            "arguments": {
              "A": {
                "type": "number",
                "gen_id": "addRows_1",
                "defaultValue": "1"
              },
              "B": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "addRows_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "addColumns",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "add [A] columns to [B]",
            "code": "for (let i = 0; i < ${addColumns_1}; i++) { ${addColumns_2}.map(column => (column.push(\"\"), column)) }",
            "arguments": {
              "A": {
                "type": "number",
                "gen_id": "addColumns_1",
                "defaultValue": "1"
              },
              "B": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "addColumns_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "deleteRows",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "delete rows [A] to [B] in [C]",
            "code": "${deleteRows_3} = ${deleteRows_3}.splice(${deleteRows_1}, ${deleteRows_2} - ${deleteRows_1} + 1)",
            "arguments": {
              "A": {
                "type": "number",
                "gen_id": "deleteRows_1",
                "defaultValue": "0"
              },
              "B": {
                "type": "number",
                "gen_id": "deleteRows_2",
                "defaultValue": "0"
              },
              "C": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "deleteRows_3"
              }
            },
            "func": "err"
          },
          {
            "opcode": "deleteColumns",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "delete columns [A] to [B] in [C]",
            "code": "${deleteColumns_3} = ${deleteColumns_3}.map(column => (column.splice(${deleteColumns_1}, ${deleteColumns_2} - ${deleteColumns_1} + 1), column))",
            "arguments": {
              "A": {
                "type": "number",
                "gen_id": "deleteColumns_1",
                "defaultValue": "0"
              },
              "B": {
                "type": "number",
                "gen_id": "deleteColumns_2",
                "defaultValue": "0"
              },
              "C": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "deleteColumns_3"
              }
            },
            "func": "err"
          },
          "---",
          {
            "opcode": "setCell",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "set cell [X],[Y] in [A] to [B]",
            "code": "(${setCell_1}[${setCell_2}][${setCell_3}] = ${setCell_4})",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "setCell_1"
              },
              "X": {
                "type": "number",
                "gen_id": "setCell_2",
                "defaultValue": "0"
              },
              "Y": {
                "type": "number",
                "gen_id": "setCell_3",
                "defaultValue": "0"
              },
              "B": {
                "type": "string",
                "gen_id": "setCell_4",
                "defaultValue": "value"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getCell",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "cell [X],[Y] in [A]",
            "code": "(${getCell_1}[${getCell_2}][${getCell_3}])",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "getCell_1"
              },
              "X": {
                "type": "number",
                "gen_id": "getCell_2",
                "defaultValue": "0"
              },
              "Y": {
                "type": "number",
                "gen_id": "getCell_3",
                "defaultValue": "0"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getRow",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "row [X] in [A]",
            "code": "(${getRow_1}[${getRow_2}].join(\",\"))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "gen_id": "getRow_1",
                "defaultValue": "[]"
              },
              "X": {
                "type": "number",
                "gen_id": "getRow_2",
                "defaultValue": "0"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getColumn",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "column [X] in [A]",
            "code": "(JSON.stringify(${getColumn_1}.map(row => row[${getColumn_2}])))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "getColumn_1"
              },
              "X": {
                "type": "number",
                "gen_id": "getColumn_2",
                "defaultValue": "0"
              }
            },
            "func": "err"
          },
          "---",
          {
            "opcode": "setRow",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "set row [X] in [A] to [B]",
            "code": "(${setRow_1}[${setRow_2}] = JSON.parse(${setRow_3}))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "setRow_1"
              },
              "X": {
                "type": "number",
                "gen_id": "setRow_2",
                "defaultValue": "0"
              },
              "B": {
                "type": "string",
                "gen_id": "setRow_3",
                "defaultValue": "[]"
              }
            },
            "func": "err"
          },
          {
            "opcode": "setColumn",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "set column [X] in [A] to [B]",
            "code": "(const temp = JSON.parse(${setColumn_3}); ${setColumn_1}.map((row, i) => (row[${setColumn_2}] = temp[i], row)))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "setColumn_1"
              },
              "X": {
                "type": "number",
                "gen_id": "setColumn_2",
                "defaultValue": "0"
              },
              "B": {
                "type": "string",
                "gen_id": "setColumn_3",
                "defaultValue": "[]"
              }
            },
            "func": "err"
          },
          {
            "opcode": "setTable",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "set [A] to [B]",
            "code": "(${setTable_1} = ${setTable_2})",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "setTable_1"
              },
              "B": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "setTable_2"
              }
            },
            "func": "err"
          },
          {
            "opcode": "fillTable",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "fill [A] with [B]",
            "code": "(${fillTable_1} = ${fillTable_1}.map(row => row.map(cell => ${fillTable_2})))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "fillTable_1"
              },
              "B": {
                "type": "string",
                "gen_id": "fillTable_2",
                "defaultValue": "value"
              }
            },
            "func": "err"
          },
          {
            "opcode": "clearTable",
            "blockType": Scratch.BlockType.COMMAND,
            "text": "clear [A]",
            "code": "(${clearTable_1} = [[]])",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "clearTable_1"
              }
            },
            "func": "err"
          },
          "---",
          {
            "opcode": "getTable",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "get table [A]",
            "code": "(JSON.stringify(${getTable_1}))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "getTable_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getTableFormatted",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "get table [A] formatted",
            "code": "(${getTableFormatted_1}.map(row => row.join(',')).join('\\n'))",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "getTableFormatted_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getTotalRows",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "get rows in [A]",
            "code": "(${getTotalRows_1}.length)",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "getTotalRows_1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "getTotalColumns",
            "blockType": Scratch.BlockType.REPORTER,
            "returns": "STRING",
            "text": "get columns in [A]",
            "code": "(${getTotalColumns_1}[0].length)",
            "arguments": {
              "A": {
                "type": "string",
                "as": "raw",
                "val": "",
                "gen_id": "getTotalColumns_1"
              }
            },
            "func": "err"
          }
        ],
      };
    }

    err(util) {
      const err = 'huh, weird error :shrug:';
      return err;
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

  const PATCHES_ID = 'mistytables_patches';
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
      let block = node.block;
      switch (node.kind) {
        case 'mistytables.newTable':
          this.source += `\nvm.runtime.visualReport("${block.id}", ([[]]))\n`;
          return;

        case 'mistytables.addRow':
          const addRow_1 = this.descendInput(node?.A).asRaw();
          this.source += `\n${addRow_1}.push(new Array(${addRow_1}[0].length).fill(""))\n`;
          return;
        case 'mistytables.addColumn':
          const addColumn_1 = this.descendInput(node?.A).asRaw();
          this.source += `\n${addColumn_1}.map(column => (column.push(""), column))\n`;
          return;
        case 'mistytables.deleteRow':
          const deleteRow_1 = this.descendInput(node?.A).asRaw();
          const deleteRow_2 = this.descendInput(node?.X).asNumber();
          this.source += `\n${deleteRow_1} = (${deleteRow_1}.splice(${deleteRow_2}, 1))\n`;
          return;
        case 'mistytables.deleteColumn':
          const deleteColumn_1 = this.descendInput(node?.A).asRaw();
          const deleteColumn_2 = this.descendInput(node?.X).asNumber();
          this.source += `\n${deleteColumn_1} = (${deleteColumn_1}.map(column => (column.splice(${deleteColumn_2}, 1), column)))\n`;
          return;

        case 'mistytables.addRows':
          const addRows_1 = this.descendInput(node?.A).asNumber();
          const addRows_2 = this.descendInput(node?.B).asRaw();
          this.source += `\nfor (let i = 0; i < ${addRows_1}; i++) { ${addRows_2}.push(new Array(${addRows_2}[0].length).fill("")) }\n`;
          return;
        case 'mistytables.addColumns':
          const addColumns_1 = this.descendInput(node?.A).asNumber();
          const addColumns_2 = this.descendInput(node?.B).asRaw();
          this.source += `\nfor (let i = 0; i < ${addColumns_1}; i++) { ${addColumns_2}.map(column => (column.push(""), column)) }\n`;
          return;
        case 'mistytables.deleteRows':
          const deleteRows_1 = this.descendInput(node?.A).asNumber();
          const deleteRows_2 = this.descendInput(node?.B).asNumber();
          const deleteRows_3 = this.descendInput(node?.C).asRaw();
          this.source += `\n${deleteRows_3} = ${deleteRows_3}.splice(${deleteRows_1}, ${deleteRows_2} - ${deleteRows_1} + 1)\n`;
          return;
        case 'mistytables.deleteColumns':
          const deleteColumns_1 = this.descendInput(node?.A).asNumber();
          const deleteColumns_2 = this.descendInput(node?.B).asNumber();
          const deleteColumns_3 = this.descendInput(node?.C).asRaw();
          this.source += `\n${deleteColumns_3} = ${deleteColumns_3}.map(column => (column.splice(${deleteColumns_1}, ${deleteColumns_2} - ${deleteColumns_1} + 1), column))\n`;
          return;

        case 'mistytables.setCell':
          const setCell_1 = this.descendInput(node?.A).asRaw();
          const setCell_2 = this.descendInput(node?.X).asNumber();
          const setCell_3 = this.descendInput(node?.Y).asNumber();
          const setCell_4 = this.descendInput(node?.B).asString();
          this.source += `\n(${setCell_1}[${setCell_2}][${setCell_3}] = ${setCell_4})\n`;
          return;
        case 'mistytables.getCell':
          const getCell_1 = this.descendInput(node?.A).asRaw();
          const getCell_2 = this.descendInput(node?.X).asNumber();
          const getCell_3 = this.descendInput(node?.Y).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${getCell_1}[${getCell_2}][${getCell_3}]))\n`;
          return;
        case 'mistytables.getRow':
          const getRow_1 = this.descendInput(node?.A).asRaw();
          const getRow_2 = this.descendInput(node?.X).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${getRow_1}[${getRow_2}].join(",")))\n`;
          return;
        case 'mistytables.getColumn':
          const getColumn_1 = this.descendInput(node?.A).asRaw();
          const getColumn_2 = this.descendInput(node?.X).asNumber();
          this.source += `\nvm.runtime.visualReport("${block.id}", (JSON.stringify(${getColumn_1}.map(row => row[${getColumn_2}]))))\n`;
          return;

        case 'mistytables.setRow':
          const setRow_1 = this.descendInput(node?.A).asRaw();
          const setRow_2 = this.descendInput(node?.X).asNumber();
          const setRow_3 = this.descendInput(node?.B).asString();
          this.source += `\n(${setRow_1}[${setRow_2}] = JSON.parse(${setRow_3}))\n`;
          return;
        case 'mistytables.setColumn':
          const setColumn_1 = this.descendInput(node?.A).asRaw();
          const setColumn_2 = this.descendInput(node?.X).asNumber();
          const setColumn_3 = this.descendInput(node?.B).asString();
          this.source += `\n(const temp = JSON.parse(${setColumn_3}); ${setColumn_1}.map((row, i) => (row[${setColumn_2}] = temp[i], row)))\n`;
          return;
        case 'mistytables.setTable':
          const setTable_1 = this.descendInput(node?.A).asRaw();
          const setTable_2 = this.descendInput(node?.B).asRaw();
          this.source += `\n(${setTable_1} = ${setTable_2})\n`;
          return;
        case 'mistytables.fillTable':
          const fillTable_1 = this.descendInput(node?.A).asRaw();
          const fillTable_2 = this.descendInput(node?.B).asString();
          this.source += `\n(${fillTable_1} = ${fillTable_1}.map(row => row.map(cell => ${fillTable_2})))\n`;
          return;
        case 'mistytables.clearTable':
          const clearTable_1 = this.descendInput(node?.A).asRaw();
          this.source += `\n(${clearTable_1} = [[]])\n`;
          return;

        case 'mistytables.getTable':
          const getTable_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (JSON.stringify(${getTable_1})))\n`;
          return;
        case 'mistytables.getTableFormatted':
          const getTableFormatted_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${getTableFormatted_1}.map(row => row.join(',')).join('\n')))\n`;
          return;
        case 'mistytables.getTotalRows':
          const getTotalRows_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${getTotalRows_1}.length))\n`;
          return;
        case 'mistytables.getTotalColumns':
          const getTotalColumns_1 = this.descendInput(node?.A).asRaw();
          this.source += `\nvm.runtime.visualReport("${block.id}", (${getTotalColumns_1}[0].length))\n`;
          return;
        default:
          return fn(node, ...args);
      }
    },
    descendInput(fn, node, ...args) {
      switch (node.kind) {
        case 'mistytables.newTable':
          return new TypedInput(`([[]])`, TYPE_STRING);

        case 'mistytables.addRow':
          const addRow_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${addRow_1}.push(new Array(${addRow_1}[0].length).fill(""))`, TYPE_UNKNOWN);
        case 'mistytables.addColumn':
          const addColumn_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`${addColumn_1}.map(column => (column.push(""), column))`, TYPE_UNKNOWN);
        case 'mistytables.deleteRow':
          const deleteRow_1 = this.descendInput(node?.A).asRaw();
          const deleteRow_2 = this.descendInput(node?.X).asNumber();
          return new TypedInput(`${deleteRow_1} = (${deleteRow_1}.splice(${deleteRow_2}, 1))`, TYPE_UNKNOWN);
        case 'mistytables.deleteColumn':
          const deleteColumn_1 = this.descendInput(node?.A).asRaw();
          const deleteColumn_2 = this.descendInput(node?.X).asNumber();
          return new TypedInput(`${deleteColumn_1} = (${deleteColumn_1}.map(column => (column.splice(${deleteColumn_2}, 1), column)))`, TYPE_UNKNOWN);

        case 'mistytables.addRows':
          const addRows_1 = this.descendInput(node?.A).asNumber();
          const addRows_2 = this.descendInput(node?.B).asRaw();
          return new TypedInput(`for (let i = 0; i < ${addRows_1}; i++) { ${addRows_2}.push(new Array(${addRows_2}[0].length).fill("")) }`, TYPE_UNKNOWN);
        case 'mistytables.addColumns':
          const addColumns_1 = this.descendInput(node?.A).asNumber();
          const addColumns_2 = this.descendInput(node?.B).asRaw();
          return new TypedInput(`for (let i = 0; i < ${addColumns_1}; i++) { ${addColumns_2}.map(column => (column.push(""), column)) }`, TYPE_UNKNOWN);
        case 'mistytables.deleteRows':
          const deleteRows_1 = this.descendInput(node?.A).asNumber();
          const deleteRows_2 = this.descendInput(node?.B).asNumber();
          const deleteRows_3 = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${deleteRows_3} = ${deleteRows_3}.splice(${deleteRows_1}, ${deleteRows_2} - ${deleteRows_1} + 1)`, TYPE_UNKNOWN);
        case 'mistytables.deleteColumns':
          const deleteColumns_1 = this.descendInput(node?.A).asNumber();
          const deleteColumns_2 = this.descendInput(node?.B).asNumber();
          const deleteColumns_3 = this.descendInput(node?.C).asRaw();
          return new TypedInput(`${deleteColumns_3} = ${deleteColumns_3}.map(column => (column.splice(${deleteColumns_1}, ${deleteColumns_2} - ${deleteColumns_1} + 1), column))`, TYPE_UNKNOWN);

        case 'mistytables.setCell':
          const setCell_1 = this.descendInput(node?.A).asRaw();
          const setCell_2 = this.descendInput(node?.X).asNumber();
          const setCell_3 = this.descendInput(node?.Y).asNumber();
          const setCell_4 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${setCell_1}[${setCell_2}][${setCell_3}] = ${setCell_4})`, TYPE_UNKNOWN);
        case 'mistytables.getCell':
          const getCell_1 = this.descendInput(node?.A).asRaw();
          const getCell_2 = this.descendInput(node?.X).asNumber();
          const getCell_3 = this.descendInput(node?.Y).asNumber();
          return new TypedInput(`(${getCell_1}[${getCell_2}][${getCell_3}])`, TYPE_STRING);
        case 'mistytables.getRow':
          const getRow_1 = this.descendInput(node?.A).asRaw();
          const getRow_2 = this.descendInput(node?.X).asNumber();
          return new TypedInput(`(${getRow_1}[${getRow_2}].join(","))`, TYPE_STRING);
        case 'mistytables.getColumn':
          const getColumn_1 = this.descendInput(node?.A).asRaw();
          const getColumn_2 = this.descendInput(node?.X).asNumber();
          return new TypedInput(`(JSON.stringify(${getColumn_1}.map(row => row[${getColumn_2}])))`, TYPE_STRING);

        case 'mistytables.setRow':
          const setRow_1 = this.descendInput(node?.A).asRaw();
          const setRow_2 = this.descendInput(node?.X).asNumber();
          const setRow_3 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${setRow_1}[${setRow_2}] = JSON.parse(${setRow_3}))`, TYPE_UNKNOWN);
        case 'mistytables.setColumn':
          const setColumn_1 = this.descendInput(node?.A).asRaw();
          const setColumn_2 = this.descendInput(node?.X).asNumber();
          const setColumn_3 = this.descendInput(node?.B).asString();
          return new TypedInput(`(const temp = JSON.parse(${setColumn_3}); ${setColumn_1}.map((row, i) => (row[${setColumn_2}] = temp[i], row)))`, TYPE_UNKNOWN);
        case 'mistytables.setTable':
          const setTable_1 = this.descendInput(node?.A).asRaw();
          const setTable_2 = this.descendInput(node?.B).asRaw();
          return new TypedInput(`(${setTable_1} = ${setTable_2})`, TYPE_UNKNOWN);
        case 'mistytables.fillTable':
          const fillTable_1 = this.descendInput(node?.A).asRaw();
          const fillTable_2 = this.descendInput(node?.B).asString();
          return new TypedInput(`(${fillTable_1} = ${fillTable_1}.map(row => row.map(cell => ${fillTable_2})))`, TYPE_UNKNOWN);
        case 'mistytables.clearTable':
          const clearTable_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`(${clearTable_1} = [[]])`, TYPE_UNKNOWN);

        case 'mistytables.getTable':
          const getTable_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`(JSON.stringify(${getTable_1}))`, TYPE_STRING);
        case 'mistytables.getTableFormatted':
          const getTableFormatted_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`(${getTableFormatted_1}.map(row => row.join(',')).join('\n'))`, TYPE_STRING);
        case 'mistytables.getTotalRows':
          const getTotalRows_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`(${getTotalRows_1}.length)`, TYPE_STRING);
        case 'mistytables.getTotalColumns':
          const getTotalColumns_1 = this.descendInput(node?.A).asRaw();
          return new TypedInput(`(${getTotalColumns_1}[0].length)`, TYPE_STRING);
        default:
          return fn(node, ...args);
      }
    },
  });
  cst_patch(STGP, {
    descendStackedBlock(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistytables_newTable':
          return {
            block, kind: 'mistytables.newTable',
          };

        case 'mistytables_addRow':
          return {
            block, kind: 'mistytables.addRow',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_addColumn':
          return {
            block, kind: 'mistytables.addColumn',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_deleteRow':
          return {
            block, kind: 'mistytables.deleteRow',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };
        case 'mistytables_deleteColumn':
          return {
            block, kind: 'mistytables.deleteColumn',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };

        case 'mistytables_addRows':
          return {
            block, kind: 'mistytables.addRows',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_addColumns':
          return {
            block, kind: 'mistytables.addColumns',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_deleteRows':
          return {
            block, kind: 'mistytables.deleteRows',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistytables_deleteColumns':
          return {
            block, kind: 'mistytables.deleteColumns',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistytables_setCell':
          return {
            block, kind: 'mistytables.setCell',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              Y: this.descendInputOfBlock(block, 'Y'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_getCell':
          return {
            block, kind: 'mistytables.getCell',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              Y: this.descendInputOfBlock(block, 'Y'),
          };
        case 'mistytables_getRow':
          return {
            block, kind: 'mistytables.getRow',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };
        case 'mistytables_getColumn':
          return {
            block, kind: 'mistytables.getColumn',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };

        case 'mistytables_setRow':
          return {
            block, kind: 'mistytables.setRow',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_setColumn':
          return {
            block, kind: 'mistytables.setColumn',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_setTable':
          return {
            block, kind: 'mistytables.setTable',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_fillTable':
          return {
            block, kind: 'mistytables.fillTable',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_clearTable':
          return {
            block, kind: 'mistytables.clearTable',
              A: this.descendInputOfBlock(block, 'A'),
          };

        case 'mistytables_getTable':
          return {
            block, kind: 'mistytables.getTable',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_getTableFormatted':
          return {
            block, kind: 'mistytables.getTableFormatted',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_getTotalRows':
          return {
            block, kind: 'mistytables.getTotalRows',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_getTotalColumns':
          return {
            block, kind: 'mistytables.getTotalColumns',
              A: this.descendInputOfBlock(block, 'A'),
          };
        default:
          return fn(block, ...args);
      }
    },
    descendInput(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistytables_newTable':
          return {
            block,
            kind: 'mistytables.newTable',
          };

        case 'mistytables_addRow':
          return {
            block,
            kind: 'mistytables.addRow',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_addColumn':
          return {
            block,
            kind: 'mistytables.addColumn',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_deleteRow':
          return {
            block,
            kind: 'mistytables.deleteRow',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };
        case 'mistytables_deleteColumn':
          return {
            block,
            kind: 'mistytables.deleteColumn',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };

        case 'mistytables_addRows':
          return {
            block,
            kind: 'mistytables.addRows',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_addColumns':
          return {
            block,
            kind: 'mistytables.addColumns',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_deleteRows':
          return {
            block,
            kind: 'mistytables.deleteRows',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistytables_deleteColumns':
          return {
            block,
            kind: 'mistytables.deleteColumns',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };

        case 'mistytables_setCell':
          return {
            block,
            kind: 'mistytables.setCell',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              Y: this.descendInputOfBlock(block, 'Y'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_getCell':
          return {
            block,
            kind: 'mistytables.getCell',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              Y: this.descendInputOfBlock(block, 'Y'),
          };
        case 'mistytables_getRow':
          return {
            block,
            kind: 'mistytables.getRow',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };
        case 'mistytables_getColumn':
          return {
            block,
            kind: 'mistytables.getColumn',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
          };

        case 'mistytables_setRow':
          return {
            block,
            kind: 'mistytables.setRow',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_setColumn':
          return {
            block,
            kind: 'mistytables.setColumn',
              A: this.descendInputOfBlock(block, 'A'),
              X: this.descendInputOfBlock(block, 'X'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_setTable':
          return {
            block,
            kind: 'mistytables.setTable',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_fillTable':
          return {
            block,
            kind: 'mistytables.fillTable',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistytables_clearTable':
          return {
            block,
            kind: 'mistytables.clearTable',
              A: this.descendInputOfBlock(block, 'A'),
          };

        case 'mistytables_getTable':
          return {
            block,
            kind: 'mistytables.getTable',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_getTableFormatted':
          return {
            block,
            kind: 'mistytables.getTableFormatted',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_getTotalRows':
          return {
            block,
            kind: 'mistytables.getTotalRows',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistytables_getTotalColumns':
          return {
            block,
            kind: 'mistytables.getTotalColumns',
              A: this.descendInputOfBlock(block, 'A'),
          };
        default:
          return fn(block, ...args);
      }
    },
  });
  Scratch.extensions.register(new mistytables());
})(Scratch);
