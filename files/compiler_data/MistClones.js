let extension = {
  "id":"mistclones",
  "name":"Mist's Clone Stuff",
}

let blocks = [
  {
    opcode: "totalClones",
    func: "err",
    text: "Total Clones",
    blockType: "REPORTER",
    code: "target.sprite.clones.length",
    returns: "NUMBER",
    disableMonitor: true,
  },
  {
    opcode: "getCloneVariables",
    func: "err",
    text: "Get All Variables In Clone [A]",
    blockType: "REPORTER",
    code: "JSON.stringify(Object.values(target.sprite.clones[[A]]?.variables ?? {}))",
    returns: "STRING",
    arguments: {
      A: { type: "NUMBER", defaultValue: 1 },
    },
  },
  {
    opcode: "moveCloneTo",
    func: "err",
    text: "Move Clone [A] to [B], [C]",
    blockType: "COMMAND",
    code: "target.sprite.clones[[A]]?.setXY([B], [C])",
    arguments: {
      A: { type: "NUMBER", defaultValue: 1 },
      B: { type: "NUMBER", defaultValue: 0 },
      C: { type: "NUMBER", defaultValue: 0 },
    },
  },
]
