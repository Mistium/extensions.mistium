// Name: Reflex
// ID: jwReflex
// Description: Position sprites relative to the stage size.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jw_reflex
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Reflex must run unsandboxed.");
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const TargetType = Scratch.TargetType;
  const formatMessage = (m) => (typeof m === "string" ? m : m.default);

  //const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAMAAAD6TlWYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAP+xNQDiGgCU/wAAAJEQGGoAAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOwwAADsMBx2+oZAAABA5JREFUeF7t0EtuW0EUA9F8vP81Z8JRAwzbLuk5COoMBb1LdP34EGJAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEHos4M+HZfbtDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0KPBfxfGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEZsBfh/z8z/r9SfnsywwIGRAyIGRAyICQASEDQp8OeMrfvk06vEzOXjPgIWevGfCQs9cMeMjZawY85Ow1Ax5y9poBDzl7zYCHnL2GA57y2dvlvW+TmcmARWYmAxaZmQxYZGYyYJGZyYBFZiYDFpmZDFhkZnp5wFPOvFze+TaZmQxYZGYyYJGZyYBFZiYDFpmZDFhkZjJgkZnJgEVmprcHPOXsl+V9j8lsZcAhs5UBh8xWBhwyWxlwyGxlwCGzlQGHzFYGHDJbPR7wlJlreddjMlsZcMhsZcAhs5UBh8xWBhwyWxlwyGxlwCGzlQGHzFbfHvCU2SrvekxmKwMOma0MOGS2MuCQ2cqAQ2YrAw6ZrQw4ZLYy4JDZyoBDZisDDpmtDDhktjLgkNnKgENmKwMOma0MOGS2MuCQ2erbA2bmWt71mMxWBhwyWxlwyGxlwCGzlQGHzFYGHDJbGXDIbGXAIbPV4wFz9svyrsdktjLgkNnKgENmKwMOma0MOGS2MuCQ2cqAQ2YrAw6Zrd4eMGdeLu97m8xMBiwyMxmwyMxkwCIzkwGLzEwGLDIzGbDIzGTAIjPTywPms7fLO98mM5MBi8xMBiwyMxmwyMxkwCIzkwGLzEwGLDIzGbDIzIQD5m/fJu99mZy9ZsBDzl4z4CFnrxnwkLPXDHjI2WsGPOTsNQMecvaaAQ85e+3TAfPzPysdruWzLzMgZEDIgJABIQNCBoQMCM2A+jsDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgMjHxx+IPExM0h8siAAAAABJRU5ErkJggg=="

  /**
   * Class for Reflex blocks
   * @constructor
   */
  class jwReflex {
      constructor() {
          /**
           * The runtime instantiating this block package.
           * @type {Runtime}
           */
          this.runtime = Scratch.vm.runtime;
      }

      /**
       * @returns {object} metadata for this extension and its blocks.
       */
      getInfo() {
          return {
              id: 'jwReflex',
              name: 'Reflex',
              //blockIconURI: blockIconURI,
              color1: '#000000', //tbd
              color2: '#ffffff', // tbd
              blocks: [
                  {
                      opcode: 'createFlex',
                      text: formatMessage({
                          id: 'jwReflex.blocks.createFlex',
                          default: 'create flex',
                          description: 'Creates the flex. If there is already a flex, nothing happens. You can only remove a flex by reloading the project.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      filter: [TargetType.SPRITE]
                  },
                  {
                      opcode: 'updateFlex',
                      text: formatMessage({
                          id: 'jwReflex.blocks.updateFlex',
                          default: 'update flex',
                          description: 'Update position of sprite with flex data.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      filter: [TargetType.SPRITE]
                  },
                  "---",
                  {
                      opcode: 'setFlexXY',
                      text: formatMessage({
                          id: 'jwReflex.blocks.setFlexXY',
                          default: 'set flex pos [FX] [FY]',
                          description: 'Sets flex position'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      arguments: {
                          FX: {
                              type: ArgumentType.NUMBER,
                              default: 0
                          },
                          FY: {
                              type: ArgumentType.NUMBER,
                              default: 0
                          }
                      },
                      filter: [TargetType.SPRITE]
                  },
                  {
                      opcode: 'getFlexX',
                      text: formatMessage({
                          id: 'jwReflex.blocks.getFlexX',
                          default: 'x flex position',
                          description: 'Gets the flex positon\'s x value'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      filter: [TargetType.SPRITE]
                  },
                  {
                      opcode: 'getFlexY',
                      text: formatMessage({
                          id: 'jwReflex.blocks.getFlexY',
                          default: 'y flex position',
                          description: 'Gets the flex positon\'s y value'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      filter: [TargetType.SPRITE]
                  },
                  "---",
                  {
                      opcode: 'setOffsetXY',
                      text: formatMessage({
                          id: 'jwReflex.blocks.setOffsetXY',
                          default: 'set offset pos [OX] [OY]',
                          description: 'Sets offset position'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      arguments: {
                          OX: {
                              type: ArgumentType.NUMBER,
                              default: 0
                          },
                          OY: {
                              type: ArgumentType.NUMBER,
                              default: 0
                          }
                      },
                      filter: [TargetType.SPRITE]
                  },
                  {
                      opcode: 'getOffsetX',
                      text: formatMessage({
                          id: 'jwReflex.blocks.getOffsetX',
                          default: 'x offset position',
                          description: 'Gets the offset positon\'s x value'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      filter: [TargetType.SPRITE]
                  },
                  {
                      opcode: 'getOffsetY',
                      text: formatMessage({
                          id: 'jwReflex.blocks.getOffsetY',
                          default: 'y offset position',
                          description: 'Gets the offset positon\'s y value'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      filter: [TargetType.SPRITE]
                  }
              ]
          };
      }

      flexes = {}

      _updateFlex(target) {
          const flex = this.flexes[target.getName()]
          if (flex && !flex.paused) {
              target.setXY((((flex.fx)/2)*this.runtime.stageWidth)+flex.ox,(((flex.fy)/2)*this.runtime.stageHeight)-flex.oy)
          }
      }

      createFlex(args, util) {
          if (util.target.isSprite() && !Object.keys(this.flexes).includes(util.target.getName())) {
              this.flexes[util.target.getName()] = {
                  fx: 0,
                  fy: 0,
                  ox: 0,
                  oy: 0,
              }
          }
          console.debug(this.flexes)
      }
      updateFlex(args, util) {
          this._updateFlex(util.target)
      }

      setFlexXY(args, util) {
          if (Object.keys(this.flexes).includes(util.target.getName())) {
              this.flexes[util.target.getName()].fx = Number(args.FX)
              this.flexes[util.target.getName()].fy = Number(args.FY)
          }
      }
      getFlexX(args, util) {
          if (Object.keys(this.flexes).includes(util.target.getName())) {
              return this.flexes[util.target.getName()].fx
          }
          return 0
      }
      getFlexY(args, util) {
          if (Object.keys(this.flexes).includes(util.target.getName())) {
              return this.flexes[util.target.getName()].fy
          }
          return 0
      }

      setOffsetXY(args, util) {
          if (Object.keys(this.flexes).includes(util.target.getName())) {
              this.flexes[util.target.getName()].ox = Number(args.OX)
              this.flexes[util.target.getName()].oy = Number(args.OY)
          }
      }
      getOffsetX(args, util) {
          if (Object.keys(this.flexes).includes(util.target.getName())) {
              return this.flexes[util.target.getName()].ox
          }
          return 0
      }
      getOffsetY(args, util) {
          if (Object.keys(this.flexes).includes(util.target.getName())) {
              return this.flexes[util.target.getName()].oy
          }
          return 0
      }
  }


  Scratch.extensions.register(new jwReflex());
})(Scratch);
