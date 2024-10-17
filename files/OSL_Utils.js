function tokenise(CODE) {
  try {
    let letter = 0;
    let depth = "";
    let brackets = 0;
    let out = [];
    let split = [];
    const len = CODE.length;

    while (letter < len) {
      depth = CODE[letter];
      if (depth === '"') {
        brackets = 1 - brackets;
        out.push('"');
      } else {
        out.push(depth);
      }
      letter++;

      if (brackets === 0 && CODE[letter] === " ") {
        split.push(out.join(""));
        out = [];
        letter++;
      }
    }
    split.push(out.join(""));
    return split;
  } catch (e) {
    return [];
  }
}

function tokeniseEscaped(CODE) {
  try {
    let letter = 0;
    let depth = "";
    let brackets = 0;
    let out = [];
    let split = [];
    let escaped = false;
    const len = CODE.length;

    while (letter < len) {
      depth = CODE[letter];
      if (depth === '"' && !escaped) {
        brackets = 1 - brackets;
        out.push('"');
      } else if (depth === '\\') {
        escaped = !escaped;
        out.push("\\");
      } else {
        out.push(depth);
        escaped = false;
      }
      letter++;

      if (brackets === 0 && CODE[letter] === " ") {
        split.push(out.join(""));
        out = [];
        letter++;
      }
    }
    split.push(out.join(""));
    return split;
  } catch (e) {
    return [];
  }
}

function autoTokenise(CODE) {
  if (CODE.indexOf("\\") !== -1) {
    return tokeniseEscaped(CODE);
  } else if (CODE.indexOf('"') !== -1) {
    return tokenise(CODE);
  } else {
    return CODE.split(" ");
  }
}

function randomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function parseJsonLikeString(jsonLikeStr, replacements) {
  // Create a string that defines the variables
  let variableDefinitions = Object.entries(replacements)
    .map(([key, value]) => jsonLikeStr.indexOf(""+key) !== -1 ? `var ${key} = ${JSON.stringify(value)};` : "")
    .join('');

  // Append the JSON-like string
  let evalString = variableDefinitions + 'return ' + jsonLikeStr + ';';

  // Use a function constructor to safely create a function to evaluate the string
  return new Function(evalString)();
}

(function (Scratch) {
  "use strict";

  const vm = Scratch.vm;

  function compileStringConcat(OSL) {
    let out = [];
    for (let line of OSL) {
      if (line && line.indexOf("`") !== -1) {
        line = line
          .replace(/\$\{([^\}]*)\}/gm, '" ++ $1 ++ "')
          .replace(' ++ "" ++ ', '" ++ "')
          .replace(/\`([^\`]+)\`/gm, '( "$1" )')
          .replace(' ++ "" ', " ")
          .replace(' "" ++ ', " ");
      }
      out.push(line);
    }
    return out;
  }

  function extractQuotes(OSL) {
    let quotes = {};
    let regExp = /"(?:[^\\"]*|\\.)*("|$)/gm;
    OSL = OSL.replace(regExp, (match) => {
      let name = "§" + randomString(32);
      quotes[name] = match;
      return name;
    });
    return [OSL, quotes];
  }

  function insertQuotes(OSL, quotes) {
    for (let key in quotes) {
      OSL = OSL.replaceAll(key, quotes[key]);
    }
    return OSL;
  }

  function compileCloseBrackets(OSL) {
    let out = [];
    let methods = {};
    let regExp = /.\(([^()]*)\)/; // Regular expression to match innermost parentheses containing spaces or non-alphanumeric characters
    for (let line of OSL) {
      while (regExp.test(line)) {
        line = line.replace(regExp, (match, p1) => {
          let name = randomString(12); // Generate a random identifier
  
          if (match.startsWith(" ") || match.startsWith("(")) {
            out.push(`${name} = ${p1.trim()}`);
  
            if (match.startsWith("((")) {
              return `(${name}`;
            } else {
              return ` ${name}`;
            }
          } else {
            let temp = "§"+randomString(32);
            const trimmed = p1.trim();
            if (trimmed === "") {
              methods[temp] = "";
              return `${match[0] + temp}`;
            }
            if (
              trimmed.match(/^\W+$/) !== null
            ) {
              methods[temp] = trimmed;
              return `${match[0] + temp}`;
            }
  
            methods[temp] = name;
            if (trimmed.indexOf(",") !== -1) {
              let inputs = trimmed.split(",");
              name = randomString(12);
              const cur = inputs[0].trim();
              if (/^\w+$/.test(cur)) {
                methods[temp] = cur;
              } else {
                out.push(`${name} = ${cur}`);
                methods[temp] = `${name}`;
              }
              for (let i = 1; i < inputs.length; i++) {
                name = randomString(12);
                const cur = inputs[i].trim();
                if (/^\w+$/.test(cur)) {
                  methods[temp] += `,${cur}`;
                } else {
                  methods[temp] += `,${name}`;
                  out.push(`${name} = ${cur}`);
                }
              }
            } else {
              const cur = trimmed;
              if (/^\w+$/.test(cur)) {
                methods[temp] = cur;
              } else {
                out.push(`${name} = ${cur}`);
                methods[temp] = name;
              }
            }
            return `${match[0] + temp}`;
          }
        });
      }
      out.push(line);
    }
    out = out.join("\n");
    let key_reg;
    for (let key of Object.keys(methods).reverse()) {
      key_reg = new RegExp(key, "gm");
      out = out.replace(key_reg, `(${methods[key]})`);
    }
    return out.split("\n");
  }

  class OSLUtils {
    constructor() {
      this.regex =
        /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g;
      this.listVariable = "";
    }

    getInfo() {
      return {
        id: "OSLUtils",
        name: "OSL Utils",
        blocks: [
          {
            opcode: "tokenise",
            blockType: Scratch.BlockType.REPORTER,
            text: "Tokenise OSL [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'log "hello"',
              },
            },
          },
          {
            opcode: "tokeniseraw",
            blockType: Scratch.BlockType.REPORTER,
            text: "Tokenise OSL Raw [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'log "hello"',
              },
            },
          },
          {
            opcode: "splitmethods",
            blockType: Scratch.BlockType.REPORTER,
            text: "Tokenise Methods [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '"hello".index("l").bool',
              },
            },
          },
          {
            opcode: "getMethodInputs",
            blockType: Scratch.BlockType.REPORTER,
            text: "Get Method Inputs [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi("wow","test")',
              },
            },
          },
          "---",
          {
            opcode: "compileStringConcat",
            blockType: Scratch.BlockType.REPORTER,
            text: "Compile String Concat [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["hello","world"]',
              },
            },
          },
          {
            opcode: "compileCloseBrackets",
            blockType: Scratch.BlockType.REPORTER,
            text: "Compile Close Brackets [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["log \\"wow\\".left(1 + 1)"]',
              },
            },
          },
          {
            opcode: "cleanOSL",
            blockType: Scratch.BlockType.REPORTER,
            text: "Clean OSL [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["log 10","text 10 : c#fff","text 10 : c#fff"]',
              },
            },
          },
          "---",
          {
            opcode: "extractQuotes",
            blockType: Scratch.BlockType.REPORTER,
            text: "Extract Quotes From [CODE]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'log "hello test"',
              },
            },
          },
          {
            opcode: "insertQuotes",
            blockType: Scratch.BlockType.REPORTER,
            text: "Insert Quotes From [QUOTES] Into [CODE]",
            arguments: {
              QUOTES: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "{}",
              },
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "handleJSONvars",
            blockType: Scratch.BlockType.REPORTER,
            text: "Handle JSON Variables [CODE] [VARS]",
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              VARS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          }
        ],
      };
    }

    splitmethods({ CODE }) {
      return JSON.stringify(CODE.match(this.regex) || []);
    }

    getMethodInputs({ CODE }) {
      let depth = 1;
      let out = "";
      for (letter of CODE) {
        if (letter === "(") {
          depth += 1;
        } else if (letter === ")") {
          depth -= 1;
        }
        out += letter;
        if (depth === 0) {
          break;
        }
      }
      const argsString = out;
      const args = [];
      let currentArg = "";
      let inQuotes = false;

      for (let i = 0; i < argsString.length; i++) {
        const char = argsString.charAt(i);
        if (char === "," && !inQuotes) {
          args.push(currentArg.trim());
          currentArg = "";
        } else {
          currentArg += char;
          if (char === '"') inQuotes = !inQuotes;
        }
      }
      if (currentArg.trim() !== "") {
        args.push(currentArg.trim());
      }

      let mapargs = args.map((arg) => {
        arg = arg.trim();
        if (arg.startsWith('"') && arg.endsWith('"')) {
          return arg;
        } else if (!isNaN(arg)) {
          return Number(arg);
        } else if (arg.startsWith("[") && arg.endsWith("]")) {
          return JSON.parse(arg);
        } else {
          return arg;
        }
      });
      if (typeof mapargs == "object") {
        return JSON.stringify(mapargs);
      } else {
        return mapargs;
      }
    }

    tokenise({ CODE }) {
      return JSON.stringify(tokenise(CODE));
    }

    tokeniseraw({ CODE }) {
      return autoTokenise(Scratch.Cast.toString(CODE));
    }


    compileStringConcat({ CODE }) {
      return JSON.stringify(compileStringConcat(JSON.parse(CODE)));
    }

    compileCloseBrackets({ CODE }) {
      return JSON.stringify(compileCloseBrackets(JSON.parse(CODE)));
    }

    cleanOSL({ CODE }) {
      return JSON.stringify(
        JSON.parse(CODE)
          .join("\n")
          .replace(/\n+/gi, "\n")
          .replace(/\n +/gm, "\n")
          .replace(/\n\/[^\n]+/gm, "")
          .trim()
          .split("\n"),
      );
    }

    extractQuotes({ CODE }) {
      return JSON.stringify(extractQuotes(CODE));
    }

    insertQuotes({ QUOTES, CODE }) {
      return insertQuotes(CODE, JSON.parse(QUOTES));
    }

    handleJSONvars({ CODE, VARS }) {
      try {
        return JSON.stringify(
          parseJsonLikeString(CODE ?? "[]", VARS ?? {})
        );
      } catch (e) {
        return "[]";
      }
    }
  }

  Scratch.extensions.register(new OSLUtils());
})(Scratch);
