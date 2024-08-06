blocks = ["Variables",
  {
    opcode: "getVariableIdByName",
    text: "get Sprite Variable ID of [A]",
    blockType: "REPORTER",
    code: 'Object.values(vm.editingTarget.variables).filter(variable => variable.name === [A] && variable.type !== "list")[0]?.id ?? ""',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "my variable" },
    },
  },
  {
    opcode: "getSpriteListIdByName",
    text: "get Sprite List ID of [A]",
    blockType: "REPORTER",
    code: 'Object.values(vm.editingTarget.variables).filter(variable => variable.name === [A] && variable.type === "list")[0]?.id ?? ""',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "my variable" },
    },
  },
  "---",
  {
    opcode: "getStageVariableIdByName",
    text: "get Stage Variable ID of [A]",
    blockType: "REPORTER",
    code: 'Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === [A] && variable.type !== "list")[0]?.id ?? ""',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "my variable" },
    },
  },
  {
    opcode: "getStageListIdByName",
    text: "get Stage List ID of [A]",
    blockType: "REPORTER",
    code: 'Object.values(vm.runtime.getTargetForStage().variables).filter(variable => variable.name === [A] && variable.type === "list")[0]?.id ?? ""',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "my variable" },
    },
  },
  {
    opcode: "setSpriteVariableById",
    text: "set var/list in Sprite (id: [A] value: [B])",
    blockType: "COMMAND",
    code: 'vm.editingTarget.variables[[A]].value = [B]',
    arguments: {
      A: { type: "STRING", defaultValue: "variable id" },
      B: { type: "STRING", defaultValue: "1" },
    }
  },
  {
    opcode: "setStageVariableById",
    text: "set var/list in Stage (id: [A] value: [B])",
    blockType: "COMMAND",
    code: 'vm.runtime.getTargetForStage().variables[[A]].value = [B]',
    arguments: {
      A: { type: "STRING", defaultValue: "variable id" },
      B: { type: "STRING", defaultValue: "1" },
    }
  },
]
