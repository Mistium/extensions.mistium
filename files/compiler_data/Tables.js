let extension = {
  name: "Tables",
  id: "mistytables",
  color1: "#ab1922",
};

let blocks = [
  {
    opcode: "newTable",
    blockType: "REPORTER",
    returns: "STRING",
    text: "new table",
    code: "([[]])",
  },
  "---",
  {
    opcode: "addRow",
    blockType: "COMMAND",
    text: "add row to [A]",
    code: '[A].push(new Array([A][0].length).fill(""))',
    arguments: {
      A: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "addColumn",
    blockType: "COMMAND",
    text: "add column to [A]",
    code: '[A].map(column => (column.push(""), column))',
    arguments: {
      A: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "deleteRow",
    blockType: "COMMAND",
    text: "delete row [X] in [A]",
    code: "[A] = ([A].splice([X], 1))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      X: { type: "number", val: "0" },
    },
  },
  {
    opcode: "deleteColumn",
    blockType: "COMMAND",
    text: "delete column [X] in [A]",
    code: "[A] = ([A].map(column => (column.splice([X], 1), column)))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      X: { type: "number", val: "0" },
    },
  },
  "---",
  {
    opcode: "addRows",
    blockType: "COMMAND",
    text: "add [A] rows to [B]",
    code: 'for (let i = 0; i < [A]; i++) { [B].push(new Array([B][0].length).fill("")) }',
    arguments: {
      A: { type: "number", val: "1" },
      B: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "addColumns",
    blockType: "COMMAND",
    text: "add [A] columns to [B]",
    code: 'for (let i = 0; i < [A]; i++) { [B].map(column => (column.push(""), column)) }',
    arguments: {
      A: { type: "number", val: "1" },
      B: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "deleteRows",
    blockType: "COMMAND",
    text: "delete rows [A] to [B] in [C]",
    code: "[C] = [C].splice([A], [B] - [A] + 1)",
    arguments: {
      A: { type: "number", val: "0" },
      B: { type: "number", val: "0" },
      C: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "deleteColumns",
    blockType: "COMMAND",
    text: "delete columns [A] to [B] in [C]",
    code: "[C] = [C].map(column => (column.splice([A], [B] - [A] + 1), column))",
    arguments: {
      A: { type: "number", val: "0" },
      B: { type: "number", val: "0" },
      C: { type: "string", as: "raw", val: "" },
    },
  },
  "---",
  {
    opcode: "setCell",
    blockType: "COMMAND",
    text: "set cell [X],[Y] in [A] to [B]",
    code: "([A][[X]][[Y]] = [B])",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      X: { type: "number", val: "0" },
      Y: { type: "number", val: "0" },
      B: { type: "string", val: "value" },
    },
  },
  {
    opcode: "getCell",
    blockType: "REPORTER",
    returns: "STRING",
    text: "cell [X],[Y] in [A]",
    code: "([A][[X]][[Y]])",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      X: { type: "number", val: "0" },
      Y: { type: "number", val: "0" },
    },
  },
  {
    opcode: "getRow",
    blockType: "REPORTER",
    returns: "STRING",
    text: "row [X] in [A]",
    code: '([A][[X]].join(","))',
    arguments: {
      A: { type: "string", as: "raw", val: "[]" },
      X: { type: "number", val: "0" },
    },
  },
  {
    opcode: "getColumn",
    blockType: "REPORTER",
    returns: "STRING",
    text: "column [X] in [A]",
    code: "(JSON.stringify([A].map(row => row[[X]])))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      X: { type: "number", val: "0" },
    },
  },
  "---",
  {
    opcode: "setRow",
    blockType: "COMMAND",
    text: "set row [X] in [A] to [B]",
    code: "([A][[X]] = JSON.parse([B]))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      X: { type: "number", val: "0" },
      B: { type: "string", val: "[]" },
    },
  },
  {
    opcode: "setColumn",
    blockType: "COMMAND",
    text: "set column [X] in [A] to [B]",
    code: "(const temp = JSON.parse([B]); [A].map((row, i) => (row[[X]] = temp[i], row)))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      X: { type: "number", val: "0" },
      B: { type: "string", val: "[]" },
    },
  },
  {
    opcode: "setTable",
    blockType: "COMMAND",
    text: "set [A] to [B]",
    code: "([A] = [B])",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      B: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "fillTable",
    blockType: "COMMAND",
    text: "fill [A] with [B]",
    code: "([A] = [A].map(row => row.map(cell => [B])))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
      B: { type: "string", val: "value" },
    },
  },
  {
    opcode: "clearTable",
    blockType: "COMMAND",
    text: "clear [A]",
    code: "([A] = [[]])",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
    },
  },
  "---",
  {
    opcode: "getTable",
    blockType: "REPORTER",
    returns: "STRING",
    text: "get table [A]",
    code: "(JSON.stringify([A]))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "getTableFormatted",
    blockType: "REPORTER",
    returns: "STRING",
    text: "get table [A] formatted",
    code: "([A].map(row => row.join(',')).join('\\n'))",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "getTotalRows",
    blockType: "REPORTER",
    returns: "STRING",
    text: "get rows in [A]",
    code: "([A].length)",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
    },
  },
  {
    opcode: "getTotalColumns",
    blockType: "REPORTER",
    returns: "STRING",
    text: "get columns in [A]",
    code: "([A][0].length)",
    arguments: {
      A: { type: "string", as: "raw", val: "" },
    },
  },
];
