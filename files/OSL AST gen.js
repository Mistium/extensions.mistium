(function (Scratch) {

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
        if (depth === "\"") {
          brackets = 1 - brackets;
          out.push("\"");
        } else {
          out.push(depth);
        }
        letter++;

        if (brackets === 0 && CODE[letter] === " ") {
          split.push(out.join(''));
          out = [];
          letter++;
        }
      }
      split.push(out.join(''));
      return split;
    } catch (e) {
      return [];
    }
  }


  function parseMethod(method) {
    let regex = /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g
    return method.match(regex) || []
  }


  function evaluateToken(token) {
    let current = {};
    if (token[0] === "\"") {
      current.type = "string";
      current.value = token.slice(1, -1);
    } else if (token == "") {
      current = { "type": "null", "value": "" };
    } else if (Number(token) == token) {
      current.type = "number";
      current.value = Number(token);
    } else if (token == "true" || token == "false") {
      current.type = "boolean";
      current.value = token == "true";
    } else if (token == "∆") {
      current = {}
    } else if (typeof token == "object") {
      current.type = "object";
      current = token
    } else if (("" + token).indexOf(".") !== -1) {
      current.type = "method";
      let method_tokens = parseMethod(token);
      current.left = evaluateToken(method_tokens[0] ?? "");
      let methods = method_tokens.slice(1, method_tokens.length)
      for (let mi in methods) {
        current_method = {
          name: methods[mi].split("(")[0],
        }
        if ((methods[mi]).indexOf("(") !== -1) {
          let args = methods[mi].slice(methods[mi].indexOf("(") + 1, methods[mi].indexOf(")")).split(",");
          for (let ai in args) {
            args[ai] = evaluateToken(args[ai]);
          }
          current_method.args = args;
        }
        methods[mi] = current_method;
      }
      current.right = methods;
    } else if (token[0] == "[") {
      current.type = "array";
      current.value = token;
    } else if (token[0] == "{") {
      current.type = "object";
      current.value = token;
    } else {
      current.type = "unknown";
      current.value = token;
    }
    return current;
  }

  function evaluateDouble(tokens, i, current) {
    current.left = evaluateToken(tokens[i - 1]);
    tokens[i - 1] = current.left;
    current.right = evaluateToken(tokens[i + 1]);
    tokens[i + 1] = current.right;
    tokens.splice(i - 1, 2);
    tokens[i - 1] = current;
    return tokens;
  }

  class OSLAST {

    constructor() {
      this.assignment_vars = ["=", "+=", "-=", "/=", "*=", "^=", "%=", "++", "--"];
      this.operators = [">", "<", "==", "===", "!=", "!==", "<=", ">=", "in", "not in", "and", "or", "nor", "nand", "xor"];
      this.maths = ["+", "-", "/", "*", "%", "^", "++"];
    }

    getInfo() {
      return {
        "id": "OSLAST",
        "name": "OSL AST",
        "blocks": [
          {
            opcode: "generateAST",
            blockType: Scratch.BlockType.REPORTER,
            text: "generate AST for [code]",
            arguments: {
              code: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[\"log \\\"Hello World!\\\"\"]"
              }
            }
          },
          {
            opcode: 'setOperators',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set operators to [OPERATORS]',
            arguments: {
              OPERATORS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[">","<","==","===","!=","!==","<=",">=","in","not in","and","or","nor","nand","xor"]'
              }
            }
          },
          {
            opcode: 'setMaths',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set maths to [MATHS]',
            arguments: {
              MATHS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["+","-","/","*","%","^","++"]'
              }
            }
          },
          {
            opcode: 'setAssignmentVars',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set assignment vars to [ASSIGNMENT_VARS]',
            arguments: {
              ASSIGNMENT_VARS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["=","+=","-=","/=","*=","^=","%=","++","--"]'
              }
            }
          }
        ]
      }
    }

    generateAST({ code }) {
      let lines = JSON.parse(code);
      let ast = [];

      for (let line of lines) {
        let tokens = tokenise(line);
        let i = 0
        if (tokens.length == 0) {
          continue;
        } else if (this.assignment_vars.includes(tokens[1])) {
          tokens[0] = {
            "type": "assignmnent",
            "left": tokens[0],
            "value": tokens[1],
          };
          tokens.splice(1, 1);
        } else if (tokens[0].indexOf(".") !== -1) {
          let method_tokens = evaluateToken(tokens[0]);
          tokens[0] = {
            type: "assignmnent",
            left: method_tokens.left,
            value: "="
          };
          tokens[1] = method_tokens;
        } else {
          tokens[0] = { "type": "command", "value": tokens[0] };
        }
        while (i < tokens.length - 1) {
          i++;
          let token = tokens[i];
          let current = {}
          if (this.operators.includes(token)) {
            current.type = "operator";
            current.value = token;
            tokens = evaluateDouble(tokens, i, current);
            i -= 1
          } else if (this.maths.includes(token)) {
            current.type = "math";
            current.value = token;
            tokens = evaluateDouble(tokens, i, current);
            i -= 1
          } else {
            tokens[i] = evaluateToken(token);
          }
        }
        if (tokens[0].type == "assignmnent") {
          tokens[0].right = tokens.slice(1, tokens.length);
          tokens = [tokens[0]];
        }
        ast.push(tokens);
      }

      return ast;
    }

    setOperators(args) {
      this.operators = JSON.parse(args.OPERATORS);
    }

    setMaths(args) {
      this.maths = JSON.parse(args.MATHS);
    }

    setAssignmentVars(args) {
      this.assignment_vars = JSON.parse(args.ASSIGNMENT_VARS);
    }
  }
  Scratch.extensions.register(new OSLAST());
})(Scratch);
