extension = {
  name: 'Comments',
  id: 'mistiumComments',
  color1: "#146fa6",
}

blocks = [
  "Single line comment",
  {
    opcode: "blockcomment",
    blockType: "COMMAND",
    text: "// [comment]",
    code: "// [comment]",
    arguments: {
      comment: {
        type: "STRING",
        val: "This is a comment",
      }
    }
  },
  {
    opcode: "Ccomment",
    blockType: "CONDITIONAL",
    text: "// [comment]",
    code: "true",
    returns: "BOOLEAN",
    arguments: {
      comment: {
        type: "STRING",
        val: "This is a comment",
      }
    }
  },
  {
    opcode: "booleancomment",
    blockType: "BOOLEAN",
    text: "[boolean] // [comment]",
    code: "[boolean]",
    returns: "BOOLEAN",
    arguments: {
      boolean: {
        type: "BOOLEAN",
      },
      comment: {
        type: "STRING",
        val: "This is a comment",
      }
    }
  },
  {
    opcode: "reportercomment",
    blockType: "REPORTER",
    text: "[reporter] // [comment]",
    code: "[reporter]",
    returns: "STRING",
    allowDropAnywhere: true,
    arguments: {
      reporter: {
        type: "STRING",
        val: "This is a comment",
      },
      comment: {
        type: "STRING",
        val: "This is a comment",
      }
    }
  },
  "---",
  "Multi line comment",
  {
    opcode: "openMutlilineComment",
    blockType: "COMMAND",
    text: "Open Mutliline Comment",
    code: "/*",
  },
  {
    opcode: "closeMultilineComment",
    blockType: "COMMAND",
    text: "Close Multiline Comment",
    code: "*/",
  }
]
