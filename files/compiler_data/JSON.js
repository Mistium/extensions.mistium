let extension = {
  name: 'compiledJSON',
  id: 'compiledJSON',
};

let blocks = [
  {
    opcode: 'valueOfobject',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'value of [B] in [A]',
    code: '([A][[B]])',
    arguments: {
      A: { type: 'string', val: '{"key":"value"}' },
      B: { type: 'string', val: 'key' },
    },
  },
  {
    opcode: 'stringify',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'stringify [A]',
    code: '(JSON.stringify([A]))',
    arguments: {
      A: { type: 'string', val: '' },
    },
  },
  {
    opcode: 'parse',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'parse [A]',
    code: '(JSON.parse([A]))',
    arguments: {
      A: { type: 'string', val: '{"key":"value"}' },
    },
  },
  {
    opcode: 'setValue',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'set value of [B] in [A] to [C]',
    code: '([A][[B]] = [C])',
    arguments: {
      A: { type: 'string', val: '{}' },
      B: { type: 'string', val: 'key' },
      C: { type: 'string', val: 'value' },
    }
  },
  {
    opcode: 'deleteValueOfObject',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'delete value of [B] in [A]',
    code: 'delete [A][[B]]; return [A];',
    arguments: {
      A: { type: 'string', val: '{"key":"value"}' },
      B: { type: 'string', val: 'key' },
    }
  },
  {
    opcode: 'hasKey',
    blockType: 'BOOLEAN',
    returns: 'BOOLEAN',
    text: '[A] has key [B]',
    code: '([B] in [A])',
    arguments: {
      A: { type: 'string', val: '{"key":"value"}' },
      B: { type: 'string', val: 'key' },
    }
  },
  {
    opcode: 'keys',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'keys of [A]',
    code: 'Object.keys([A])',
    arguments: {
      A: { type: 'string', val: '{"key":"value"}' },
    }
  },
  {
    opcode: 'values',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'values of [A]',
    code: 'Object.values([A])',
    arguments: {
      A: { type: 'string', val: '{"key":"value"}' },
    }
  },
  {
    opcode: 'entries',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'entries of [A]',
    code: 'Object.entries([A])',
    arguments: {
      A: { type: 'string', val: '{"key":"value"}' },
    }
  },
  "---",
  {
    opcode: 'insertAtIndex',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'insert [B] at index [C] in [A]',
    code: '([A].splice([C], 0, [B]), [A])',
    arguments: {
      A: { type: 'string', val: '["a","b","c"]' },
      B: { type: 'string', val: '"d"' },
      C: { type: 'number', val: '1' },
    }
  },
  {
    opcode: 'removeAtIndex',
    blockType: 'REPORTER',
    returns: 'STRING',
    text: 'remove item at index [B] in [A]',
    code: '([A].splice([B], 1), [A])',
    arguments: {
      A: { type: 'string', val: '["a","b","c"]' },
      B: { type: 'number', val: '1' },
    }
  }
];
