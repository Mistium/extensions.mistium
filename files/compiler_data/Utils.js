extension = {
  id: "mistsutils",
  color1: "#2DA4A0",
  name: "Mists Utils",
  version: 5.8,
};

comment = `/**!
 * Mist's Utils
 * @author mistium
 * @version ${extension.version}
 * @copyright MIT & LGPLv3 License
 * Basically half of this is 0znzw's code lmao
 * Do not remove this comment
 * Intended for originOS but can be used in other projects
 */`

constructor = `console.log("Loaded Mist's utils! (v${extension.version})");
  this.newUpdate = false;
  this.openSite = function () {
    Scratch.openWindow("https://extensions.mistium.com");
  }
  if (typeof window.scaffolding !== "object") {
    // fetch the extension from github
    // compare it to the current file
    fetch("https://raw.githubusercontent.com/Mistium/extensions.mistium/main/featured/Mist's%20Utils.js")
      .then((res) => res.text())
      .then((text) => {
        if (!(text.includes("${"version: " + extension.version},"))) { this.newUpdate = true; }
      })
  };`;

blocks = [
  {
    blockType: "BUTTON",
    text: "New Version Available!",
    func: "openSite",
    showIf: "this.newUpdate",
  },
  "Comparisons",
  {
    opcode: "notequals",
    text: "[A] !== [B]",
    blockType: "BOOLEAN",
    code: '([A] !== [B])',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "apple" },
    },
  },
  {
    opcode: "equals",
    text: "[A] === [B]",
    code: '([A] === [B])',
    blockType: "BOOLEAN",
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "apple" },
    },
  },
  {
    opcode: "greaterorequal",
    text: "[A] >= [B]",
    blockType: "BOOLEAN",
    code: '([A] >= [B])',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "NUMBER", defaultValue: 3 },
      B: { type: "NUMBER", defaultValue: 4 },
    },
  },
  {
    opcode: "lessthanorequal",
    text: "[A] <= [B]",
    blockType: "BOOLEAN",
    code: '([A] <= [B])',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "NUMBER", defaultValue: 3 },
      B: { type: "NUMBER", defaultValue: 4 },
    },
  },
  {
    opcode: "compare",
    text: "[A] [C] [B]",
    blockType: "BOOLEAN",
    code: '([A] [C] [B])',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "NUMBER", defaultValue: 3 },
      B: { type: "NUMBER", defaultValue: 4 },
      C: { type: "STRING", as: "RAW", defaultValue: "<" },
    },
  },
  "Maths",
  {
    opcode: "power",
    text: "[A] ^ [B]",
    blockType: "REPORTER",
    code: "Math.pow([A], [B])",
    returns: "NUMBER",
    arguments: {
      A: { type: "NUMBER", defaultValue: 3 },
      B: { type: "NUMBER", defaultValue: 4 },
    },
  },
  {
    opcode: "round",
    text: "round [A] to the nearest [B]",
    blockType: "REPORTER",
    code: "Math.round(([A] / [B]) * [B])",
    returns: "NUMBER",
    arguments: {
      A: { type: "NUMBER", defaultValue: 100 },
      B: { type: "NUMBER", defaultValue: 10 },
    },
  },
  {
    opcode: "clamp",
    text: "clamp [A] between [B] and [C]",
    blockType: "REPORTER",
    code: "Math.min(Math.max([A], [B]), [C])",
    returns: "NUMBER",
    arguments: {
      A: { type: "NUMBER", defaultValue: 100 },
      B: { type: "NUMBER", defaultValue: 1 },
      C: { type: "NUMBER", defaultValue: 50 },
    },
  },
  {
    opcode: "min",
    text: "min of [A] and [B]",
    blockType: "REPORTER",
    code: "Math.min([A], [B])",
    returns: "NUMBER",
    arguments: {
      A: { type: "NUMBER", defaultValue: 100 },
      B: { type: "NUMBER", defaultValue: 50 },
    },
  },
  {
    opcode: "max",
    text: "max of [A] and [B]",
    blockType: "REPORTER",
    code: "Math.max([A], [B])",
    returns: "NUMBER",
    arguments: {
      A: { type: "NUMBER", defaultValue: 100 },
      B: { type: "NUMBER", defaultValue: 50 },
    },
  },
  {
    opcode: "interpolate",
    text: "smooth [B] to [C] by [A]",
    blockType: "REPORTER",
    code: "[B] + (([C] - [B]) / [A])",
    returns: "NUMBER",
    arguments: {
      A: { type: "NUMBER", defaultValue: 3 },
      B: { type: "NUMBER", defaultValue: 0 },
      C: { type: "NUMBER", defaultValue: 100 },
    },
  },
  "Strings",
  {
    opcode: "ifthen",
    text: "if [A] then [B] else [C]",
    blockType: "REPORTER",
    code: '([A] ? [B] : [C])',
    returns: "STRING",
    arguments: {
      A: { type: "BOOLEAN", defaultValue: false },
      B: { type: "STRING", defaultValue: "yes" },
      C: { type: "STRING", defaultValue: "no" },
    },
  },
  {
    opcode: "letters",
    text: "letters [A] to [B] of [C]",
    blockType: "REPORTER",
    code: '([C]).substring(Math.max(0,[A]-1), Math.min([B], [C].length))',
    returns: "STRING",
    arguments: {
      A: { type: "NUMBER", defaultValue: 2 },
      B: { type: "NUMBER", defaultValue: 4 },
      C: { type: "STRING", defaultValue: "apple" },
    },
  },
  {
    opcode: "linecount",
    text: "line count of [A]",
    blockType: "REPORTER",
    code: '([A]).split("\\\\n").length',
    returns: "NUMBER",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
    },
  },
  {
    opcode: "linetoline",
    text: "lines [A] to [B] of [C]",
    blockType: "REPORTER",
    code: '([C]).split("\\\\n").slice(Math.max(0,[A]-1), Math.min([B], [C].split("\\\\n").length)).join("\\\\n")',
    returns: "STRING",
    arguments: {
      A: { type: "NUMBER", defaultValue: 2 },
      B: { type: "NUMBER", defaultValue: 4 },
      C: { type: "STRING", defaultValue: "apple" },
    },
  },
  {
    opcode: "starts",
    text: "[A] starts with [B]",
    blockType: "BOOLEAN",
    code: '([A]).startsWith([B])',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "app" },
    },
  },
  {
    opcode: "ends",
    text: "[A] ends with [B]",
    blockType: "BOOLEAN",
    code: '([A]).endsWith([B])',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "app" },
    },
  },
  {
    opcode: "toUnicode",
    text: "unicode Of [A]",
    blockType: "REPORTER",
    code: '([A]).charCodeAt(0)',
    returns: "NUMBER",
    arguments: {
      A: { type: "STRING", defaultValue: "A" },
    },
  },
  {
    opcode: "replace",
    text: "replace [C] in [A] with [B]",
    blockType: "REPORTER",
    code: '([C] === "" ? [A] : ([A]).replace([C], [B]))',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "l" },
      C: { type: "STRING", defaultValue: "p" },
    },
  },
  {
    opcode: "replaceall",
    text: "replace all [C] in [A] with [B]",
    blockType: "REPORTER",
    code: '([C] === "" ? [A] : ([A]).replaceAll([C], [B]))',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "l" },
      C: { type: "STRING", defaultValue: "p" },
    },
  },
  {
    opcode: "alltextAfterString",
    text: "text after [B] in [A]",
    blockType: "REPORTER",
    code: '([A]).substring(([A]).indexOf(""+([B])) + 1, (([A]).length))',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "l" },
    },
  },
  {
    opcode: "alltextBeforeString",
    text: "text before [B] in [A]",
    blockType: "REPORTER",
    code: '([A]).split([B], 1)[0]',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "l" },
    },
  },
  "JSON",
  {
    opcode: "split",
    text: "split [A] by [B] (stringify)",
    blockType: "REPORTER",
    code: 'JSON.stringify(([A]).split([B]))',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "l" },
    },
  },
  {
    opcode: "splitarray",
    text: "split [A] by [B] (array)",
    blockType: "REPORTER",
    code: '([A]).split([B])',
    returns: "RAW",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "l" },
    },
  },
  {
    opcode: "length",
    text: "[A].length",
    blockType: "REPORTER",
    code: "(([A]).length)",
    returns: "NUMBER",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "apple" },
    },
  },
  {
    opcode: "item",
    text: "item [C] of [A] split by [B]",
    blockType: "REPORTER",
    code: '([A]).split([B])[[C]]',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "l" },
      C: { type: "NUMBER", defaultValue: 1 },
    },
  },
  {
    opcode: "jsondelete",
    text: "delete Item [B] of [A]",
    code: "delete [A][[B]]",
    blockType: "COMMAND",
    arguments: {
      A: { type: "STRING", defaultValue: "" },
      B: { type: "STRING", defaultValue: "0" },
    },
  },
  {
    opcode: "jsonset",
    text: "set [B] to [C] in [A]",
    blockType: "COMMAND",
    code: "[A][[B]] = [C]",
    arguments: {
      A: { type: "STRING", defaultValue: "" },
      B: { type: "STRING", defaultValue: "0" },
      C: { type: "STRING", defaultValue: '"hello world"' },
    },
  },
  {
    opcode: "squarebrackets",
    text: "[A] item [B]",
    blockType: "REPORTER",
    code: "([A])[[B]]",
    returns: "STRING",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "apple" },
      B: { type: "STRING", defaultValue: "1" },
    },
  },
  {
    opcode: "jsonparse",
    text: "JSON.parse [A]",
    blockType: "REPORTER",
    code: "JSON.parse([A])",
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: '{"a": 1}' },
    },
  },
  {
    opcode: "jsonstringify",
    text: "JSON.stringify [A]",
    blockType: "REPORTER",
    code: "JSON.stringify([A])",
    returns: "STRING",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "" },
    },
  },
  "Types",
  {
    opcode: "isnumber",
    text: "[A] is a number",
    blockType: "BOOLEAN",
    code: 'Number([A]) == [A]',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "1" },
    },
  },
  {
    opcode: "isstring",
    text: "[A] is a string",
    blockType: "BOOLEAN",
    code: 'String([A]) == [A]',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "apple" },
    },
  },
  {
    opcode: "isboolean",
    text: "[A] is a boolean",
    blockType: "BOOLEAN",
    code: '[A] == "true" || [A] == "false"',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "true" },
    },
  },
  {
    opcode: "tostring",
    text: "to string [A]",
    blockType: "REPORTER",
    code: '[A]',
    returns: "STRING",
    arguments: {
      A: { type: "STRING", defaultValue: "1" },
    },
  },
  {
    opcode: "tonumber",
    text: "to number [A]",
    blockType: "REPORTER",
    code: 'isNaN(Number([A])) ? 0 : Number([A])',
    returns: "NUMBER",
    arguments: {
      A: { type: "STRING", defaultValue: "1" },
    },
  },
  {
    opcode: "toboolean",
    text: "to boolean [A]",
    blockType: "REPORTER",
    code: '[A] == "true" || [A] == "1" || [A] == "yes" ? "true" : "false"',
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", defaultValue: "true" },
    },
  },
  "Injections",
  {
    opcode: "patchreporter",
    text: "patch [A]",
    blockType: "REPORTER",
    code: "[A]",
    returns: "STRING",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "1 * 3" },
    },
    allowDropAnywhere: true,
  },
  {
    opcode: "patchreporter2",
    text: "patch [A][B]",
    blockType: "REPORTER",
    code: "[A][B]",
    returns: "STRING",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "1 * " },
      B: { type: "STRING", as: "RAW", defaultValue: "3" },
    },
    allowDropAnywhere: true,
  },
  {
    opcode: "patchreporter3",
    text: "patch [A][B][C]",
    blockType: "REPORTER",
    code: "[A][B][C]",
    returns: "STRING",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "1" },
      B: { type: "STRING", as: "RAW", defaultValue: '*' },
      C: { type: "STRING", as: "RAW", defaultValue: "3" },
    },
    allowDropAnywhere: true,
  },
  {
    opcode: "patchboolean",
    text: "patch [A]",
    blockType: "BOOLEAN",
    code: "[A]",
    returns: "BOOLEAN",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "1 == 6" },
    },
  },
  {
    opcode: "patchcommand",
    text: "patch [A]",
    blockType: "COMMAND",
    code: "[A]",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "1 + 5" },
    },
  },
  {
    opcode: "patchcommand2",
    text: "patch [A][B]",
    blockType: "COMMAND",
    code: "[A][B]",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "5 +" },
      B: { type: "STRING", as: "RAW", defaultValue: "5" },
    },
  },
  {
    opcode: "patchcommand3",
    text: "patch [A][B][C]",
    blockType: "COMMAND",
    code: "[A][B][C]",
    arguments: {
      A: { type: "STRING", as: "RAW", defaultValue: "console.log(" },
      B: { type: "STRING", as: "RAW", defaultValue: '"hello world"' },
      C: { type: "STRING", as: "RAW", defaultValue: ")" },
    },
  },
  "Reporters",
  {
    opcode: "true",
    text: "true",
    blockType: "BOOLEAN",
    code: true,
    returns: "BOOLEAN",
    disableMonitor: true,
  },
  {
    opcode: "false",
    text: "false",
    blockType: "BOOLEAN",
    code: false,
    returns: "BOOLEAN",
    disableMonitor: true,
  },
  {
    opcode: "isPackaged",
    text: "Is Packaged?",
    blockType: "BOOLEAN",
    code: "(typeof window.scaffolding === 'object')",
    returns: "BOOLEAN",
    disableMonitor: true,
  },
  {
    opcode: "performancenow",
    text: "performance.now()",
    blockType: "REPORTER",
    code: "performance.now()",
    returns: "NUMBER",
    disableMonitor: true,
  },
  {
    opcode: "stagewidth",
    text: "Stage Width",
    blockType: "REPORTER",
    code: "Scratch.vm.runtime.stageWidth",
    returns: "NUMBER",
    disableMonitor: true,
  },
  {
    opcode: "stageheight",
    text: "Stage Height",
    blockType: "REPORTER",
    code: "Scratch.vm.runtime.stageHeight",
    returns: "NUMBER",
    disableMonitor: true,
  },
  {
    opcode: "newline",
    text: "New Line",
    blockType: "REPORTER",
    code: '"\\\\n"',
    returns: "STRING",
    disableMonitor: true,
  },
  {
    opcode: "pi",
    text: "π",
    blockType: "REPORTER",
    code: "Math.PI",
    returns: "NUMBER",
    disableMonitor: true,
  },
  {
    opcode: "e",
    text: "e",
    blockType: "REPORTER",
    code: "Math.E",
    returns: "NUMBER",
    disableMonitor: true,
  },
  {
    opcode: "infinity",
    text: "∞",
    blockType: "REPORTER",
    code: "Infinity",
    returns: "NUMBER",
    disableMonitor: true,
  },
  {
    opcode: "MaxInt",
    text: "Max Int",
    blockType: "REPORTER",
    code: "Number.MAX_SAFE_INTEGER",
    returns: "NUMBER",
    disableMonitor: true,
  }
];