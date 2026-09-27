// Name: Colors
// ID: colors
// Description: Convert between color formats.
// By: G1nX (gsa)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/gsa_colorUtilBlocks
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Colors must run unsandboxed.");
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const Cast = Scratch.Cast;

  // from PenguinMod's util/color.js
  class Color {
      /**
       * @typedef {object} RGBObject - An object representing a color in RGB format.
       * @property {number} r - the red component, in the range [0, 255].
       * @property {number} g - the green component, in the range [0, 255].
       * @property {number} b - the blue component, in the range [0, 255].
       */

      /**
       * @typedef {object} HSVObject - An object representing a color in HSV format.
       * @property {number} h - hue, in the range [0-359).
       * @property {number} s - saturation, in the range [0,1].
       * @property {number} v - value, in the range [0,1].
       */

      /** @type {RGBObject} */
      static get RGB_BLACK () {
          return {r: 0, g: 0, b: 0};
      }

      /** @type {RGBObject} */
      static get RGB_WHITE () {
          return {r: 255, g: 255, b: 255};
      }

      /**
       * Convert a Scratch decimal color to a hex string, #RRGGBB.
       * @param {number} decimal RGB color as a decimal.
       * @return {string} RGB color as #RRGGBB hex string.
       */
      static decimalToHex (decimal) {
          if (decimal < 0) {
              decimal += 0xFFFFFF + 1;
          }
          let hex = Math.round(Number(decimal)).toString(16);
          hex = `#${'000000'.substr(0, 6 - hex.length)}${hex}`;
          return hex;
      }

      /**
       * Convert a Scratch decimal color to an RGB color object.
       * @param {number} decimal RGB color as decimal.
       * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
      static decimalToRgb (decimal) {
          const a = (decimal >> 24) & 0xFF;
          const r = (decimal >> 16) & 0xFF;
          const g = (decimal >> 8) & 0xFF;
          const b = decimal & 0xFF;
          return {r: r, g: g, b: b, a: a > 0 ? a : 255};
      }

      /**
       * Convert a hex color (e.g., F00, #03F, #0033FF) to an RGB color object.
       * @param {!string} hex Hex representation of the color.
       * @return {RGBObject} null on failure, or rgb: {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
      static hexToRgb (hex) {
          if (hex.startsWith('#')) {
              hex = hex.substring(1);
          }
          if (hex.length === 8) {
              hex = hex.slice(0, 6);
          }
          const parsed = parseInt(hex, 16);
          if (isNaN(parsed)) {
              return null;
          }
          if (hex.length === 6) {
              return {
                  r: (parsed >> 16) & 0xff,
                  g: (parsed >> 8) & 0xff,
                  b: parsed & 0xff
              };
          } else if (hex.length === 3) {
              const r = ((parsed >> 8) & 0xf);
              const g = ((parsed >> 4) & 0xf);
              const b = parsed & 0xf;
              return {
                  r: (r << 4) | r,
                  g: (g << 4) | g,
                  b: (b << 4) | b
              };
          }
          return null;
      }

      /**
       * Convert an RGB color object to a hex color.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {!string} Hex representation of the color.
       */
      static rgbToHex (rgb) {
          return Color.decimalToHex(Color.rgbToDecimal(rgb));
      }

      /**
       * Convert an RGB color object to a Scratch decimal color.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {!number} Number representing the color.
       */
      static rgbToDecimal (rgb) {
          return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
      }

      /**
       * Convert a hex color (e.g., F00, #03F, #0033FF) to a decimal color number.
       * @param {!string} hex Hex representation of the color.
       * @return {!number} Number representing the color.
       */
      static hexToDecimal (hex) {
          return Color.rgbToDecimal(Color.hexToRgb(hex));
      }

      /**
       * Convert an HSV color to RGB format.
       * @param {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
       * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
      static hsvToRgb (hsv) {
          let h = hsv.h % 360;
          if (h < 0) h += 360;
          const s = Math.max(0, Math.min(hsv.s, 1));
          const v = Math.max(0, Math.min(hsv.v, 1));

          const i = Math.floor(h / 60);
          const f = (h / 60) - i;
          const p = v * (1 - s);
          const q = v * (1 - (s * f));
          const t = v * (1 - (s * (1 - f)));

          let r;
          let g;
          let b;

          switch (i) {
          default:
          case 0:
              r = v;
              g = t;
              b = p;
              break;
          case 1:
              r = q;
              g = v;
              b = p;
              break;
          case 2:
              r = p;
              g = v;
              b = t;
              break;
          case 3:
              r = p;
              g = q;
              b = v;
              break;
          case 4:
              r = t;
              g = p;
              b = v;
              break;
          case 5:
              r = v;
              g = p;
              b = q;
              break;
          }

          return {
              r: Math.floor(r * 255),
              g: Math.floor(g * 255),
              b: Math.floor(b * 255)
          };
      }

      /**
       * Convert an RGB color to HSV format.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
       */
      static rgbToHsv (rgb) {
          const r = rgb.r / 255;
          const g = rgb.g / 255;
          const b = rgb.b / 255;
          const x = Math.min(Math.min(r, g), b);
          const v = Math.max(Math.max(r, g), b);

          // For grays, hue will be arbitrarily reported as zero. Otherwise, calculate
          let h = 0;
          let s = 0;
          if (x !== v) {
              const f = (r === x) ? g - b : ((g === x) ? b - r : r - g);
              const i = (r === x) ? 3 : ((g === x) ? 5 : 1);
              h = ((i - (f / (v - x))) * 60) % 360;
              s = (v - x) / v;
          }

          return {h: h, s: s, v: v};
      }

      /**
       * Linear interpolation between rgb0 and rgb1.
       * @param {RGBObject} rgb0 - the color corresponding to fraction1 <= 0.
       * @param {RGBObject} rgb1 - the color corresponding to fraction1 >= 1.
       * @param {number} fraction1 - the interpolation parameter. If this is 0.5, for example, mix the two colors equally.
       * @return {RGBObject} the interpolated color.
       */
      static mixRgb (rgb0, rgb1, fraction1) {
          if (fraction1 <= 0) return rgb0;
          if (fraction1 >= 1) return rgb1;
          const fraction0 = 1 - fraction1;
          return {
              r: (fraction0 * rgb0.r) + (fraction1 * rgb1.r),
              g: (fraction0 * rgb0.g) + (fraction1 * rgb1.g),
              b: (fraction0 * rgb0.b) + (fraction1 * rgb1.b)
          };
      }
  }

  // from PenguinMod's util/json-block-utilities.js
  const validateJSON = json => {
    let valid = false;
    let object = {};
    try {
      if (!json.startsWith('{')) throw new Error('error lol');
      object = JSON.parse(json);
      valid = true;
    } catch {}
    return {
      object: object,
      json: json,
      isValid: valid
    };
  };

  /**
   * Class for TurboWarp blocks
   * @constructor
   */
  class colorBlocks {
      constructor() {
          /**
           * The runtime instantiating this block package.
           * @type {Runtime}
           */
          this.runtime = Scratch.vm.runtime;
      }

      deafultHsv = '{"h": 360, "s": 1, "v": 1}';
      deafultRgb = '{"r": 255, "g": 0, "b": 0}';
      deafultHex = '#ff0000';
      deafultDecimal = '16711680';

      /**
       * @returns {object} metadata for this extension and its blocks.
       */
      getInfo () {
          return {
              id: 'colors',
              name: 'Colors',
              color1: '#ff4c4c',
              color2: '#e64444',
              blocks: [
                  {
                      opcode: 'colorPicker',
                      text: '[OUTPUT] of [COLOR]',
                      disableMonitor: true,
                      arguments: {
                          OUTPUT: {
                              type: ArgumentType.STRING,
                              menu: "outputColorType"
                          },
                          COLOR: {
                              type: ArgumentType.COLOR
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'defaultBlack',
                      text: 'black',
                      disableMonitor: true,
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'defaultWhite',
                      text: 'white',
                      disableMonitor: true,
                      blockType: BlockType.REPORTER
                  },
                  {
                      blockType: BlockType.LABEL,
                      text: 'RGB'
                  },
                  {
                      opcode: 'rgbToDecimal',
                      text: 'rgb [color] to decimal',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultRgb
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'rgbToHex',
                      text: 'rgb [color] to hex',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultRgb
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'rgbToHsv',
                      text: 'rgb [color] to hsv',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultRgb
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      blockType: BlockType.LABEL,
                      text: 'Hex'
                  },
                  {
                      opcode: 'hexToDecimal',
                      text: 'hex [color] to decimal',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultHex
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'hexToRgb',
                      text: 'hex [color] to rgb',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultHex
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'hexToHsv',
                      text: 'hex [color] to hsv',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultHex
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      blockType: BlockType.LABEL,
                      text: 'Decimal'
                  },
                  {
                      opcode: 'decimalToHex',
                      text: 'decimal [color] to hex',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultDecimal
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'decimalToRgb',
                      text: 'decimal [color] to rgb',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultDecimal
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'decimalToHsv',
                      text: 'decimal [color] to hsv',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultDecimal
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      blockType: BlockType.LABEL,
                      text: 'HSV'
                  },
                  {
                      opcode: 'hsvToHex',
                      text: 'hsv [color] to hex',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultHsv
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'hsvToRgb',
                      text: 'hsv [color] to rgb',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultHsv
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'hsvToDecimal',
                      text: 'hsv [color] to decimal',
                      arguments: {
                          color: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultHsv
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  "---",
                  {
                      blockType: BlockType.LABEL,
                      text: 'Other'
                  },
                  {
                      opcode: 'csbMaker',
                      text: 'color: [h] saturation: [s] brightness: [v] transparency: [a]',
                      arguments: {
                          h: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          s: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          v: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          a: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'hsvMaker',
                      text: 'h: [h] s: [s] v: [v] a: [a]',
                      arguments: {
                          h: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          s: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          v: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          a: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'rgbMaker',
                      text: 'r: [r] g: [g] b: [b] a: [a]',
                      arguments: {
                          r: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          g: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          b: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          },
                          a: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '50'
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'mixColors',
                      text: 'mix [color1] [color2] by [percent]',
                      arguments: {
                          color1: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultRgb
                          },
                          color2: {
                              type: ArgumentType.STRING,
                              defaultValue: this.deafultRgb
                          },
                          percent: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '0.5'
                          }
                      },
                      blockType: BlockType.REPORTER
                  }
              ],
              menus: {
                  outputColorType: {
                      items: [
                          { text: 'decimal', value: "decimal" },
                          { text: 'rgb', value: "rgb" },
                          { text: 'hsv', value: "hsv" },
                          { text: 'hex', value: "hex" }
                      ],
                      acceptReporters: true
                  }
              }
          };
      }

      defaultBlack () {
          return JSON.stringify(Color.RGB_BLACK);
      }
      defaultWhite () {
          return JSON.stringify(Color.RGB_WHITE);
      }

      colorPicker (args) {
          const color = Color.hexToDecimal(args.COLOR);
          const argsColor = { color: color };
          switch (Cast.toString(args.OUTPUT).toLowerCase()) {
          case "rgb":
              return this.decimalToRgb(argsColor);
          case "hsv":
              return this.decimalToHsv(argsColor);
          case "hex":
              // todo: args.COLOR is already hex now
              return this.decimalToHex(argsColor);
          default:
              return color;
          }
      }

      csbMaker (args) {
          const color = {
              h: args.h * 360 / 100,
              s: args.s / 100,
              v: args.v / 100
          };
          if (!isNaN(args.a)) color.a = args.a / 100;
          return JSON.stringify(color);
      }
      hsvMaker (args) {
          const color = {
              h: args.h,
              s: args.s,
              v: args.v
          };
          if (!isNaN(args.a)) color.a = args.a;
          return JSON.stringify(color);
      }
      rgbMaker (args) {
          const color = {
              r: args.r,
              g: args.g,
              b: args.b
          };
          if (!isNaN(args.a)) color.a = args.a;
          return JSON.stringify(color);
      }
      mixColors (args) {
          const color1 = validateJSON(args.color1).object;
          const color2 = validateJSON(args.color2).object;
          return JSON.stringify(Color.mixRgb(color1, color2, args.percent));
      }

      rgbToDecimal (args) {
          const color = validateJSON(args.color).object;
          return Color.rgbToDecimal(color);
      }
      rgbToHex (args) {
          const color = validateJSON(args.color).object;
          return Color.rgbToHex(color);
      }
      rgbToHsv (args) {
          const color = validateJSON(args.color).object;
          return JSON.stringify(Color.rgbToHsv(color));
      }
      hexToDecimal (args) {
          const color = args.color;
          return Color.hexToDecimal(color);
      }
      hexToRgb (args) {
          const color = Color.hexToRgb(args.color);
          return JSON.stringify(color);
      }
      hexToHsv (args) {
          const color = Color.hexToRgb(args.color);
          return JSON.stringify(Color.rgbToHsv(color));
      }
      decimalToHex (args) {
          const color = Number(args.color);
          return Color.decimalToHex(color);
      }
      decimalToRgb (args) {
          const color = Color.decimalToRgb(Number(args.color));
          return JSON.stringify(color);
      }
      decimalToHsv (args) {
          const color = Color.decimalToRgb(Number(args.color));
          return JSON.stringify(Color.rgbToHsv(color));
      }
      hsvToHex (args) {
          const color = Color.hsvToRgb(validateJSON(args.color).object);
          return Color.rgbToHex(color);
      }
      hsvToRgb (args) {
          const color = Color.hsvToRgb(validateJSON(args.color).object);
          return JSON.stringify(color);
      }
      hsvToDecimal (args) {
          const color = Color.hsvToRgb(validateJSON(args.color).object);
          return Color.rgbToDecimal(color);
      }
  }


  Scratch.extensions.register(new colorBlocks());
})(Scratch);
