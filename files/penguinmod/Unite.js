// Name: Unite
// ID: jwUnite
// Description: Deprecated collection of utility blocks (now part of PenguinMod's core blocks).
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jw_unite
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Unite must run unsandboxed.");
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const formatMessage = (m) => (typeof m === "string" ? m : m.default);
  // from PenguinMod's util/json-block-utilities.js
  const validateRegex = (value, regrule) => {
    let valid = false;
    try {
      new RegExp(value, regrule);
      valid = true;
    } catch {}
    return valid;
  };

  const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAMAAAD6TlWYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAP+xNQDiGgCU/wAAAJEQGGoAAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOwwAADsMBx2+oZAAABA5JREFUeF7t0EtuW0EUA9F8vP81Z8JRAwzbLuk5COoMBb1LdP34EGJAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEHos4M+HZfbtDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0KPBfxfGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEZsBfh/z8z/r9SfnsywwIGRAyIGRAyICQASEDQp8OeMrfvk06vEzOXjPgIWevGfCQs9cMeMjZawY85Ow1Ax5y9poBDzl7zYCHnL2GA57y2dvlvW+TmcmARWYmAxaZmQxYZGYyYJGZyYBFZiYDFpmZDFhkZnp5wFPOvFze+TaZmQxYZGYyYJGZyYBFZiYDFpmZDFhkZjJgkZnJgEVmprcHPOXsl+V9j8lsZcAhs5UBh8xWBhwyWxlwyGxlwCGzlQGHzFYGHDJbPR7wlJlreddjMlsZcMhsZcAhs5UBh8xWBhwyWxlwyGxlwCGzlQGHzFbfHvCU2SrvekxmKwMOma0MOGS2MuCQ2cqAQ2YrAw6ZrQw4ZLYy4JDZyoBDZisDDpmtDDhktjLgkNnKgENmKwMOma0MOGS2MuCQ2erbA2bmWt71mMxWBhwyWxlwyGxlwCGzlQGHzFYGHDJbGXDIbGXAIbPV4wFz9svyrsdktjLgkNnKgENmKwMOma0MOGS2MuCQ2cqAQ2YrAw6Zrd4eMGdeLu97m8xMBiwyMxmwyMxkwCIzkwGLzEwGLDIzGbDIzGTAIjPTywPms7fLO98mM5MBi8xMBiwyMxmwyMxkwCIzkwGLzEwGLDIzGbDIzIQD5m/fJu99mZy9ZsBDzl4z4CFnrxnwkLPXDHjI2WsGPOTsNQMecvaaAQ85e+3TAfPzPysdruWzLzMgZEDIgJABIQNCBoQMCM2A+jsDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgMjHxx+IPExM0h8siAAAAABJRU5ErkJggg=="

  /**
   * Class for Unite blocks
   * @constructor
   */
  class jwUnite {
      constructor() {
          /**
           * The runtime instantiating this block package.
           * @type {Runtime}
           */
          this.runtime = Scratch.vm.runtime;
          // PenguinMod-only: PenguinMod alerted here that Unite is deprecated and converts its blocks to core
          // blocks on load. Those core blocks don't exist elsewhere, so the port keeps working blocks and no alert.
          // "always" is an EVENT block; PenguinMod's core event_always is started every step, do the same here.
          this.runtime.on('BEFORE_EXECUTE', () => this.runtime.startHats('jwUnite_always'));
      }

      /**
       * @returns {object} metadata for this extension and its blocks.
       */
      getInfo() {
          return {
              id: 'jwUnite',
              name: 'Unite',
              blockIconURI: blockIconURI,
              color1: '#7ddcff',
              color2: '#4a98ff',
              blocks: [
                  {
                      opcode: 'always',
                      text: formatMessage({
                          id: 'jwUnite.blocks.always',
                          default: 'always',
                          description: 'Runs the code every tick'
                      }),
                      disableMonitor: true,
                      isEdgeActivated: false,
                      blockType: BlockType.EVENT
                  },
                  {
                      opcode: 'whenanything',
                      text: formatMessage({
                          id: 'jwUnite.blocks.whenanything',
                          default: 'when [ANYTHING]',
                          description: 'Runs blocks when set boolean is true'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.HAT,
                      arguments: {
                          ANYTHING: {
                              type: ArgumentType.BOOLEAN,
                          }
                      }
                  },
                  "---",
                  {
                      opcode: 'getspritewithattrib',
                      text: formatMessage({
                          id: 'jwUnite.blocks.getspritewithattrib',
                          default: 'get sprite with [var] set to [val]',
                          description: 'Reports the first sprite with a variable set to a value'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          var: {
                              type: ArgumentType.STRING,
                              defaultValue: "my variable"
                          },
                          val: {
                              type: ArgumentType.STRING,
                              defaultValue: "0"
                          }
                      }
                  },
                  "---",
                  {
                      opcode: 'backToGreenFlag',
                      text: formatMessage({
                          id: 'jwUnite.blocks.backToGreenFlag',
                          default: 'run [FLAG]',
                          description: 'Acts like a click on the flag has been done.'
                      }),
                      terminal: true,
                      blockType: BlockType.COMMAND,
                      arguments: {
                          FLAG: {
                              type: ArgumentType.IMAGE,
                              dataURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAACJ0lEQVRIid2Uy09TQRSHv2kv1VR5hhQQqwlYGtqCmtbHokhDTNQtEVz4B/gfmBCDXoyGmLj3kbBwY2LY6MpHWJDUoBukKsTKQ6I2paWGBipCo73jBii30BpI78ZfMpkzMznznTOPAwZLbFgt/ZWY011k9gzysSdZLICStdJXkPRjSns41hcH2Y7EjmAVmESKFyjyCaPqr50AzBtWbeAsEKDE0oy7w4rnfAXNbWU0nlY40CQwmX0kY73UBr4QGw5vu5vndg31Zy6wv3OGhecZfQbrajk3Rp2zXRdCqe0Irg5o8k8w+uwWR9VLmE13eaeNgarRqtoQ4jKKdpUy+wLy+3Hg2vaAQlIsbk51ZUjNJ/n8egBv5CBan2Bf5TL1nlkafGkWYz8YeVy94bIjwHpOpTY/vs7Nc1WAHQCNr5sXTLsA/EOaNBagabph8QEyYzAA3QkZkYGeUOAVyTlWUt/I/M5gLa/GpDjYXFryuumPaCsgMWsl+ilEfLoOSQTBClBBuW2GExcXsVi9hQFSF8RWQGT8MNCLwzXAYHc2nNabbQzdu4/TH6ThpBMhbDmef1iKhRgf8iHFo/wAeEpIfUgoZ/bD9SAB1Us42MPUiJOaxhBVh5YwKYKfib3MhZtYXS5B0sl79VUhQH4Nq6vADbzqHaJTbUQn3QjKECKOlG8Iqblh7apUsFayX661gjLgH/zPgPm1PlFMQPaSHa4HTIcnSFW8LSbAcP0F3uGqEimnx6MAAAAASUVORK5CYII=',
                              alt: 'Blue Flag'
                          }
                      }
                  },
                  "---",
                  {
                      opcode: 'trueBoolean',
                      text: formatMessage({
                          id: 'jwUnite.blocks.trueBoolean',
                          default: 'true',
                          description: 'Returns true'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.BOOLEAN,
                  },
                  {
                      opcode: 'falseBoolean',
                      text: formatMessage({
                          id: 'jwUnite.blocks.falseBoolean',
                          default: 'false',
                          description: 'Returns false'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.BOOLEAN,
                  },
                  {
                      opcode: 'randomBoolean',
                      text: formatMessage({
                          id: 'jwUnite.blocks.randomBoolean',
                          default: 'random',
                          description: 'Returns true or false'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.BOOLEAN,
                  },
                  "---",
                  {
                      opcode: 'mobile',
                      text: formatMessage({
                          id: 'jwUnite.blocks.mobile',
                          default: 'mobile?',
                          description: 'Returns true if the project is running on a mobile device'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.BOOLEAN,
                  },
                  "---",
                  {
                      opcode: 'thing_is_text',
                      text: formatMessage({
                          id: 'jwUnite.blocks.thing_is_text',
                          default: '[TEXT1] is text?',
                          description: 'Checks if something is text!'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.BOOLEAN,
                      arguments: {
                          TEXT1: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.thing_is_text_whatToCheck',
                                  default: 'world',
                                  description: 'What to check.'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'thing_is_number',
                      text: formatMessage({
                          id: 'jwUnite.blocks.thing_is_number',
                          default: '[TEXT1] is number?',
                          description: 'Checks if something is a number!'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.BOOLEAN,
                      arguments: {
                          TEXT1: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.thing_is_number_whatToCheck',
                                  default: '10',
                                  description: 'What to check.'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'if_return_else_return',
                      text: formatMessage({
                          id: 'jwUnite.blocks.if_return_else_return',
                          default: 'if [boolean] is true [TEXT1] is false [TEXT2]',
                          description: 'Returns a value based on wether or not the boolean is true or false'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          boolean: {
                              type: ArgumentType.BOOLEAN
                          },
                          TEXT1: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.if_return_else_return_ifValue',
                                  default: 'foo',
                                  description: 'What to return if the boolean is true.'
                              })
                          },
                          TEXT2: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.if_return_else_return_elseValue',
                                  default: 'bar',
                                  description: 'What to return if the boolean is false.'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'indexOfTextInText',
                      text: formatMessage({
                          id: 'jwUnite.blocks.indexOfTextInText',
                          default: 'index of [TEXT1] in [TEXT2]',
                          description: 'Finds the position of some text in another piece of text.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          TEXT1: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.indexof_textToFind',
                                  default: 'world',
                                  description: 'The text to look for.'
                              })
                          },
                          TEXT2: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.indexof_textToSearch',
                                  default: 'Hello world!',
                                  description: 'The text to search in.'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'regextest',
                      text: formatMessage({
                          id: 'jwUnite.blocks.regextest',
                          default: 'test [text] with regex [reg]',
                          description: 'tests a string to see if its valid for this regex'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.BOOLEAN,
                      arguments: {
                          text: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.regextest_text',
                                  default: 'foo bar',
                                  description: 'the text to test'
                              })
                          },
                          reg: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.regextest_regex',
                                  default: '/foo/g',
                                  description: 'the regex to test the text with'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'regexmatch',
                      text: formatMessage({
                          id: 'jwUnite.blocks.regexmatch',
                          default: 'match [text] with regex [reg]',
                          description: 'gets all regex matxhes on a string'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          text: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.regexmatch_text',
                                  default: 'foo bar',
                                  description: 'the text to test'
                              })
                          },
                          reg: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.regexmatch_regex',
                                  default: '/foo/g',
                                  description: 'the regex to test the text with'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'replaceAll',
                      text: formatMessage({
                          id: 'jwUnite.blocks.replaceAll',
                          default: 'in [text] replace all [term] with [res]',
                          description: 'replaces all of somthing with something in a string'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          text: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.replaceAll_text',
                                  default: 'foo bar',
                                  description: 'the text to test'
                              })
                          },
                          term: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.replaceAll_replacy',
                                  default: 'foo',
                                  description: 'what text to replace'
                              })
                          },
                          res: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.replaceAll_replacer',
                                  default: 'bar',
                                  description: 'the text to replace with'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'getLettersFromIndexToIndexInText',
                      text: formatMessage({
                          id: 'jwUnite.blocks.getLettersFromIndexToIndexInText',
                          default: 'letters from [INDEX1] to [INDEX2] in [TEXT]',
                          description: 'Gets a part of text using the indexes specified.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          INDEX1: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 2
                          },
                          INDEX2: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 3
                          },
                          TEXT: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.getLettersFromIndexToIndexInText_text',
                                  default: 'Hello!',
                                  description: 'The text to get a substring from.'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'readLineInMultilineText',
                      text: formatMessage({
                          id: 'jwUnite.blocks.readLineInMultilineText',
                          default: 'read line [LINE] in [TEXT]',
                          description: 'Reads a certain line in text with multiple lines.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          LINE: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 1
                          },
                          TEXT: {
                              type: ArgumentType.STRING,
                              defaultValue: formatMessage({
                                  id: 'jwUnite.readLineInMultilineText_text',
                                  default: 'Text with multiple lines here',
                                  description: 'The text to read lines from.'
                              })
                          }
                      }
                  },
                  {
                      opcode: 'newLine',
                      text: formatMessage({
                          id: 'jwUnite.blocks.newLine',
                          default: 'newline',
                          description: 'Represents a new line character.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'stringify',
                      text: formatMessage({
                          id: 'jwUnite.blocks.stringify',
                          default: '[ONE] as string',
                          description: 'Represents a new line character.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          ONE: {
                              type: ArgumentType.STRING,
                              defaultValue: "foo"
                          }
                  }},
                  {
                      opcode: 'lerpFunc',
                      text: formatMessage({
                          id: 'jwUnite.blocks.lerpFunc',
                          default: 'interpolate [ONE] to [TWO] by [AMOUNT]',
                          description: 'Linearly interpolates the first number to the second by the amount.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          ONE: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 1
                          },
                          TWO: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 3
                          },
                          AMOUNT: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 0.5
                          }
                      }
                  },
                  {
                      opcode: 'advMath',
                      text: formatMessage({
                          id: 'jwUnite.blocks.advMath',
                          default: '[ONE] [OPTION] [TWO]',
                          description: 'Operators advanced math function but with 2 variables'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          ONE: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 1
                          },
                          OPTION: {
                              type: ArgumentType.NUMBER,
                              defaultValue: "^",
                              menu: 'advMath'
                          },
                          TWO: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 2
                          }
                      }
                  },
                  {
                      opcode: 'constrainnumber',
                      text: formatMessage({
                          id: 'jwUnite.blocks.constrainnumber',
                          default: 'constrain [inp] min [min] max [max]',
                          description: 'Constrains a number to a specified minimum and maximum'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          inp: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 50
                          },
                          min: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 1,
                          },
                          max: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 100
                          }
                      }
                  },
                  "---",
                  {
                      opcode: 'setReplacer',
                      text: formatMessage({
                          id: 'jwUnite.blocks.setReplacer',
                          default: 'replacer [REPLACER] to [VALUE]',
                          description: 'Sets a replacer to a value'
                      }),
                      arguments: {
                          REPLACER: {
                              type: ArgumentType.STRING,
                              defaultValue: "foo",
                          },
                          VALUE: {
                              type: ArgumentType.STRING,
                              defaultValue: "bar"
                          },
                      },
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                  },
                  {
                      opcode: 'replaceWithReplacers',
                      text: formatMessage({
                          id: 'jwUnite.blocks.replaceWithReplacers',
                          default: 'replace [STRING] with replacers',
                          description: 'Replaces all replacer names with their respective value'
                      }),
                    
                      arguments: {
                          STRING: {
                              type: ArgumentType.STRING,
                              defaultValue: "Hello {foo}!"
                          },
                      },
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                  },
              ],
              menus: {
                  advMath: [
                      '^',
                      'root',
                      'log'
                  ]/*
                  sprites: {
                      items: 'getAllSprites',
                      acceptReporters: true
                  }
                  */
              }
          };
      }
      /*
      getAllSprites() {
          return this.runtime.targets.map(x => {
              return {
                  text: x.sprite ? x.sprite.name : `Unkown ${x.id}`,
                  value: x.id
              }
          })
      */

      replacers = {}
      knownLinks = {}

      whenanything(args, util) {
          return Boolean(args.ANYTHING || false)
      }

      backToGreenFlag(args, util) {
          Scratch.vm.greenFlag()
      }

      trueBoolean() {return true}
      falseBoolean() {return false}
      randomBoolean() {return Boolean(Math.round(Math.random()))}

      indexOfTextInText(args, util) {
          const lookfor = String(args.TEXT1);
          const searchin = String(args.TEXT2);
          let index = 0;
          if (searchin.includes(lookfor)) {
              index = searchin.indexOf(lookfor) + 1;
          }
          return index;
      }
      getLettersFromIndexToIndexInText(args, util) {
          const index1 = (Number(args.INDEX1) ? Number(args.INDEX1) : 1) - 1;
          const index2 = (Number(args.INDEX2) ? Number(args.INDEX2) : 1) - 1;
          const string = String(args.TEXT);
          const substring = string.substring(index1, index2);
          return substring;
      }
      readLineInMultilineText(args, util) {
          const line = (Number(args.LINE) ? Number(args.LINE) : 1) - 1;
          const text = String(args.TEXT);
          const readline = text.split("\n")[line] || "";
          return readline;
      }
      newLine() { return "\n" }
      stringify(args, util) {return args.ONE}

      lerpFunc(args, util) {
          const one = isNaN(Number(args.ONE)) ? 0 : Number(args.ONE);
          const two = isNaN(Number(args.TWO)) ? 0 : Number(args.TWO);
          const amount = isNaN(Number(args.AMOUNT)) ? 0 : Number(args.AMOUNT);
          let lerped = one;
          lerped += ((two - one) / (amount / (amount * amount)));
          return lerped;
      }
      advMath(args, util) {
          const one = isNaN(Number(args.ONE)) ? 0 : Number(args.ONE)
          const two = isNaN(Number(args.TWO)) ? 0 : Number(args.TWO)
          const operator = String(args.OPTION)
          switch(operator) {
              case "^": return one ** two
              case "root": return one ** 1/two
              case "log": return Math.log(two) / Math.log(one)
              default: return 0
          }
      }

      setReplacer(args, util) {
          this.replacers["{" + String(args.REPLACER) + "}"] = String(args.VALUE || "")
      }
      replaceWithReplacers(args, util) {
          let string = String(args.STRING || "")
          for (const replacer of Object.keys(this.replacers)) {
              string = string.replaceAll(replacer, this.replacers[replacer])
          }
          return string
      }

      thing_is_number(args, util) {
          // i hate js
          // i also hate regex
          // so im gonna do this the lazy way
          // no. String(Number(value)) === value does infact do the job X)
          // also what was originaly here was inificiant as hell
          return String(Number(args.TEXT1)) == args.TEXT1 && !isNaN(Number(args.TEXT1))
      }
      thing_is_text(args, util) {
          // WHY IS NAN NOT EQUAL TO ITSELF
          // HOW IS NAN A NUMBER
          // because nan is how numbers say the value put into me is not a number
          return isNaN(Number(args.TEXT1))
      }

      if_return_else_return(args) {
          return args.boolean ? args.TEXT1 : args.TEXT2
      }
      mobile(args, util) {
          return navigator.userAgent.includes("Mobile") || window.matchMedia("(max-width: 767px)").matches
      }
      getspritewithattrib(args, util) {
          // strip out usless data
          const sprites = util.runtime.targets.map(x => {
              return {
                  id: x.id, 
                  name: x.sprite ? x.sprite.name : "Unkown",
                  variables: Object.values(x.variables).reduce((obj, value) => {
                      if (!value.name) return obj
                      obj[value.name] = String(value.value)
                      return obj
                  }, {})
              }
          })
          // get the target with variable x set to y
          let res = "No sprites found"
          for (
              // define the index and the sprite
              let idx = 1, sprite = sprites[0]; 
              // standard for loop thing
              idx < sprites.length;
              // set sprite to a new item  
              sprite = sprites[idx++]
          ) {
              if (sprite.variables[args.var] == args.val) {
                  res = `{"id": "${sprite.id}", "name": "${sprite.name}"}`
                  break
              }
          }
        
          return res
      }

      constrainnumber(args) {
          return Math.min(Math.max(args.min, args.inp), args.max)
      }

      regextest(args) {
          if (!validateRegex(args.reg)) return false
          const regex = new RegExp(args.reg)
          return regex.test(args.text)
      }
      regexmatch(args) {
          if (!validateRegex(args.reg)) return "[]"
          const regex = new RegExp(args.reg)
          const matches = args.text.match(regex)
          return JSON.stringify(matches ? matches : [])
      }
      replaceAll(args) {
          return args.text.replaceAll(args.term, args.res)
      }
  }


  Scratch.extensions.register(new jwUnite());
})(Scratch);
