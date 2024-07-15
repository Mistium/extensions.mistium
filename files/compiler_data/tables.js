let extension = {
  name: 'tables',
  id: 'tables',
}

let blocks = [
  {
    opcode: 'newTable',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'new table',
    code: '([[]])',
  },
  {
    opcode: 'addRow',
    blockType: 'COMMAND',
    returns: 'STRING',
    text: 'add row to [A]',
    code: '([A].push(new Array([A][0].length).fill("")))',
    arguments: {
      A: { type: 'string', val: 'table' },
    }
  },
  {
    opcode: 'addColumn',
    blockType: 'COMMAND',
    returns: 'STRING',
    text: 'add column to [A]',
    code: '[A].map(column => (column.push(""), column))',
    arguments: {
      A: { type: 'string', val: 'table' },
    }
  },
  {
    opcode: 'setCell',
    blockType: 'COMMAND',
    returns: 'STRING',
    text: 'set cell [X],[Y] in [A] to [B]',
    code: '([A][[X]][[Y]] = [B])',
    arguments: {
      A: { type: 'string', val: 'table' },
      X: { type: 'string', val: '0' },
      Y: { type: 'string', val: '0' },
      B: { type: 'string', val: 'value' },
    }
  },
  {
    opcode: 'getCell',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'cell [X],[Y] in [A]',
    code: '([A][[X]][[Y]])',
    arguments: {
      A: { type: 'string', val: 'table' },
      X: { type: 'string', val: '0' },
      Y: { type: 'string', val: '0' },
    }
  },
  {
    opcode: 'deleteRow',
    blockType: 'COMMAND',
    returns: 'STRING',
    text: 'delete row [X] in [A]',
    code: '([A].splice([X], 1))',
    arguments: {
      A: { type: 'string', val: 'table' },
      X: { type: 'string', val: '0' },
    }
  },
  {
    opcode: 'deleteColumn',
    blockType: 'COMMAND',
    returns: 'STRING',
    text: 'delete column [X] in [A]',
    code: '([A].map(column => (column.splice([X], 1), column)))',
    arguments: {
      A: { type: 'string', val: 'table' },
      X: { type: 'string', val: '0' },
    }
  },
]
