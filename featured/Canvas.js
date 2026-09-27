
// Name: Mistium's Canvases
// Author: Mistium
// Description: Create and manipulate canvases with this extension

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Canvas must run unsandboxed.");
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const renderer = runtime.renderer;
  const cast = Scratch.Cast;

  class CanvasExtension {
    constructor(runtime) {
      this.runtime = runtime;
      this.canvases = {};
    }


    getInfo() {
      return {
        id: 'MistiumCanvas',
        name: "Canvas",
        color1: '#4A893D',
        blocks: [
          {
            opcode: 'createCanvas',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create canvas [CANVAS_ID] at x: [X] y: [Y] width: [WIDTH] height: [HEIGHT] background colour: [COLOUR]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
            }
          },
          {
            opcode: 'createInvisCanvas',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create invisible canvas [CANVAS_ID] width: [WIDTH] height: [HEIGHT] background colour: [COLOUR]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
            }
          },
          "---",
          {
            opcode: 'moveCanvas',
            blockType: Scratch.BlockType.COMMAND,
            text: 'move canvas [CANVAS_ID] to x: [X] y: [Y]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'getCanvasX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get x of [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },
          {
            opcode: 'getCanvasY',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get y of [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },
          {
            opcode: 'showCanvasOn',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show canvas [CANVAS_ID] on myself',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },
          {
            opcode: 'resizeCanvas',
            blockType: Scratch.BlockType.COMMAND,
            text: 'resize canvas [CANVAS_ID] to width: [WIDTH] height: [HEIGHT]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          "---",
          {
            opcode: 'setCanvasStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set property [PROPERTY] to [VALUE] in canvas [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'borderRadius'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '10px'
              }
            }
          },
          "---",
          {
            opcode: 'deleteCanvas',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete canvas [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },
          {
            opcode: 'deleteAllCanvases',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete all canvases',
          },
          {
            opcode: 'clearCanvas',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear canvas [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },
          "---",
          {
            opcode: 'drawTriangle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw triangle on [CANVAS_ID] with vertices x1: [X1] y1: [Y1] x2: [X2] y2: [Y2] x3: [X3] y3: [Y3] with colour: [COLOUR] and fill: [FILL]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              X2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              Y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              X3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              FILL: {
                menu: 'FILL',
              }
            }
          },
          {
            opcode: 'drawRectangle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw rectangle on [CANVAS_ID] at x: [X] y: [Y] width: [WIDTH] height: [HEIGHT] with colour: [COLOUR] and rounding: [ROUNDING] and fill: [FILL]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              ROUNDING: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              FILL: {
                menu: 'FILL',
              }
            }
          },
          {
            opcode: 'drawLine',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw line on [CANVAS_ID] from x1: [X1] y1: [Y1] to x2: [X2] y2: [Y2] with colour: [COLOUR] and width: [LINEWIDTH] and cap: [LINECAP]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              X2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              Y2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              LINEWIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
              },
              LINECAP: {
                menu: 'LINECAP',
              }
            }
          },
          {
            opcode: 'drawCircle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw circle on [CANVAS_ID] at x: [X] y: [Y] radius: [RADIUS] with colour: [COLOUR] and fill: [FILL]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 25
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              FILL: {
                menu: 'FILL',
              }
            }
          },
          {
            opcode: 'drawText',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw text [TEXT] on [CANVAS_ID] at x: [X] y: [Y] with colour: [COLOUR] and font: [FONT]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello!'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              FONT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '16px sans-serif'
              }
            }
          },
          {
            opcode: 'stampImage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'stamp image [URL] on [CANVAS_ID] at x: [X] y: [Y] width: [WIDTH] height: [HEIGHT]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://extensions.turbowarp.org/dango.png'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'createPattern',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create pattern on [CANVAS_ID] with image [URL] and direction [DIRECTION] at x: [X] y: [Y] width: [WIDTH] height: [HEIGHT]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://extensions.turbowarp.org/dango.png'
              },
              DIRECTION: {
                menu: 'DIRECTION',
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          "---",
          {
            opcode: 'getPixelCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get pixel count on [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },
          {
            opcode: 'getWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get width of [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },
          {
            opcode: 'getHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get height of [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },

          "---",
          {
            opcode: 'setCanvasLayer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set canvas [CANVAS_ID] layer to [LAYER]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              LAYER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getCanvasLayer',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get layer of [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              }
            }
          },

          "---",
          {
            opcode: 'setPixel',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set pixel at x: [X] y: [Y] on [CANVAS_ID] to colour: [COLOUR]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              }
            }
          },
          {
            opcode: 'setPixelIndex',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set pixel at I: [INDEX] on [CANVAS_ID] to colour: [COLOUR]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              COLOUR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              }
            }
          },
          {
            opcode: 'getPixel',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get pixel at x: [X] y: [Y] on [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'getPixelIndex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get pixel at I: [INDEX] on [CANVAS_ID]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          "---",
          {
            opcode: 'getCanvasAs',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get canvas [CANVAS_ID] as [TYPE]',
            arguments: {
              CANVAS_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'canvas1'
              },
              TYPE: {
                menu: 'TYPE',
              }
            }
          },
          {
            opcode: 'getCanvasList',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get all canvases',
          }
        ],
        menus: {
          LINECAP: {
            acceptReporters: true,
            items: ['butt', 'round', 'square']
          },
          FILL: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          TYPE: {
            acceptReporters: true,
            items: ['dataURI', 'array']
          },
          DIRECTION: {
            acceptReporters: true,
            items: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat']
          }
        }
      };
    }

    _objToHex(obj) {
      const r = obj[0];
      const g = obj[1];
      const b = obj[2];
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    createCanvas({ CANVAS_ID, X, Y, WIDTH, HEIGHT, COLOUR }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      X = cast.toNumber(X);
      Y = cast.toNumber(Y);
      WIDTH = cast.toNumber(WIDTH);
      HEIGHT = cast.toNumber(HEIGHT);
      COLOUR = cast.toString(COLOUR);

      this.deleteCanvas({ CANVAS_ID });
      const canvas = document.createElement('canvas');
      canvas.id = CANVAS_ID;
      canvas.style.position = 'absolute';
      canvas.x = X;
      canvas.y = Y;
      canvas.style.left = `${(vm.runtime.stageWidth / 2 + X) - (WIDTH / 2)}px`;
      canvas.style.top = `${(vm.runtime.stageHeight / 2 - Y) - (HEIGHT / 2)}px`;
      canvas.style.backgroundColor = COLOUR;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      vm.renderer.addOverlay(canvas);
      this.canvases[CANVAS_ID] = canvas;
    }

    createInvisCanvas({ CANVAS_ID, WIDTH, HEIGHT, COLOUR }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      WIDTH = cast.toNumber(WIDTH);
      HEIGHT = cast.toNumber(HEIGHT);
      COLOUR = cast.toString(COLOUR);

      this.deleteCanvas({ CANVAS_ID });
      const canvas = document.createElement('canvas');
      canvas.id = CANVAS_ID;
      canvas.style.position = 'absolute';
      canvas.style.display = 'none'
      canvas.x = 0;
      canvas.y = 0;
      canvas.style.left = '0px';
      canvas.style.top = '0px';
      canvas.style.backgroundColor = COLOUR;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      this.canvases[CANVAS_ID] = canvas;
    }

    // Sprites showing the canvas skin go back to their costume before the skin is destroyed;
    // destroying a skin a drawable still uses crashes the renderer.
    _disposeCanvas(canvas) {
      if (canvas.skin && renderer._allSkins[canvas.skin]) {
        const skin = renderer._allSkins[canvas.skin];
        for (const target of runtime.targets) {
          const drawable = renderer._allDrawables[target.drawableID];
          if (drawable && drawable.skin === skin) target.updateAllDrawableProperties();
        }
        renderer.destroySkin(canvas.skin);
      }
      vm.renderer.removeOverlay(canvas);
      canvas.remove();
    }

    deleteCanvas({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      this._disposeCanvas(canvas);
      delete this.canvases[CANVAS_ID];
    }

    deleteAllCanvases() {
      for (const canvas of Object.values(this.canvases)) {
        this._disposeCanvas(canvas);
      }
      this.canvases = {};
    }

    moveCanvas({ CANVAS_ID, X, Y }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      X = cast.toNumber(X);
      Y = cast.toNumber(Y);
      canvas.x = X;
      canvas.y = Y;
      canvas.style.left = `${(vm.runtime.stageWidth / 2 + X) - (canvas.width / 2)}px`;
      canvas.style.top = `${(vm.runtime.stageHeight / 2 - Y) - (canvas.height / 2)}px`;
    }

    resizeCanvas({ CANVAS_ID, WIDTH, HEIGHT }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      canvas.width = cast.toNumber(WIDTH);
      canvas.height = cast.toNumber(HEIGHT);
      canvas.style.left = `${(vm.runtime.stageWidth / 2 + canvas.x) - (canvas.width / 2)}px`;
      canvas.style.top = `${(vm.runtime.stageHeight / 2 - canvas.y) - (canvas.height / 2)}px`;
    }

    setCanvasStyle({ CANVAS_ID, PROPERTY, VALUE }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      PROPERTY = cast.toString(PROPERTY);
      VALUE = cast.toString(VALUE);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      canvas.style[PROPERTY] = VALUE;
    }

    setCanvasLayer({ CANVAS_ID, LAYER }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      canvas.style.zIndex = cast.toNumber(LAYER);
    }

    clearCanvas({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawTriangle({ CANVAS_ID, X1, Y1, X2, Y2, X3, Y3, COLOUR, FILL }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      X1 = cast.toNumber(X1);
      Y1 = cast.toNumber(Y1);
      X2 = cast.toNumber(X2);
      Y2 = cast.toNumber(Y2);
      X3 = cast.toNumber(X3);
      Y3 = cast.toNumber(Y3);
      COLOUR = cast.toString(COLOUR);
      FILL = cast.toString(FILL);
      let translatedX1 = (canvas.width / 2) + X1;
      let translatedY1 = (canvas.height / 2) - Y1;
      let translatedX2 = (canvas.width / 2) + X2;
      let translatedY2 = (canvas.height / 2) - Y2;
      let translatedX3 = (canvas.width / 2) + X3;
      let translatedY3 = (canvas.height / 2) - Y3;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      ctx.strokeStyle = COLOUR;
      ctx.beginPath();
      ctx.moveTo(translatedX1, translatedY1);
      ctx.lineTo(translatedX2, translatedY2);
      ctx.lineTo(translatedX3, translatedY3);
      ctx.closePath();
      if (FILL === 'yes') {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }

    drawRectangle({ CANVAS_ID, X, Y, WIDTH, HEIGHT, COLOUR, ROUNDING, FILL }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      WIDTH = cast.toNumber(WIDTH);
      HEIGHT = cast.toNumber(HEIGHT);
      COLOUR = cast.toString(COLOUR);
      ROUNDING = cast.toNumber(ROUNDING);
      FILL = cast.toString(FILL);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      ctx.strokeStyle = COLOUR;

      const translatedX = (canvas.width / 2) + cast.toNumber(X) - (WIDTH / 2);
      const translatedY = (canvas.height / 2) - cast.toNumber(Y) - (HEIGHT / 2);

      ctx.beginPath();
      if (ROUNDING > 0) {
        const radius = Math.min(ROUNDING, WIDTH / 2, HEIGHT / 2);
        ctx.moveTo(translatedX + radius, translatedY);
        ctx.lineTo(translatedX + WIDTH - radius, translatedY);
        ctx.quadraticCurveTo(translatedX + WIDTH, translatedY, translatedX + WIDTH, translatedY + radius);
        ctx.lineTo(translatedX + WIDTH, translatedY + HEIGHT - radius);
        ctx.quadraticCurveTo(translatedX + WIDTH, translatedY + HEIGHT, translatedX + WIDTH - radius, translatedY + HEIGHT);
        ctx.lineTo(translatedX + radius, translatedY + HEIGHT);
        ctx.quadraticCurveTo(translatedX, translatedY + HEIGHT, translatedX, translatedY + HEIGHT - radius);
        ctx.lineTo(translatedX, translatedY + radius);
        ctx.quadraticCurveTo(translatedX, translatedY, translatedX + radius, translatedY);
      } else {
        ctx.rect(translatedX, translatedY, WIDTH, HEIGHT);
      }
      ctx.closePath();

      if (FILL === 'yes') {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }

    getWidth({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return 0;
      return canvas.width;
    }

    getHeight({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return 0;
      return canvas.height;
    }

    getCanvasLayer({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return 0;
      return cast.toNumber(canvas.style.zIndex);
    }

    getCanvasX({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return 0;
      return canvas.x;
    }

    getCanvasY({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return 0;
      return canvas.y;
    }

    _setSkin(skinId, target) {
      if (!target) return;
      const drawableID = target.drawableID;

      renderer._allDrawables[drawableID].skin = renderer._allSkins[skinId];
    }

    showCanvasOn({ CANVAS_ID }, util) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;

      let skinId = canvas.skin;
      if (skinId && renderer._allSkins[skinId]) {
        renderer.updateBitmapSkin(skinId, canvas, 1);
      } else {
        // Same resolution as updateBitmapSkin, otherwise the first show is a different size
        skinId = renderer.createBitmapSkin(canvas, 1);
        canvas.skin = skinId;
      }
      this._setSkin(skinId, util.target);
      runtime.requestRedraw();
    }

    getCanvasAs({ CANVAS_ID, TYPE }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      TYPE = cast.toString(TYPE);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return "";
      const ctx = canvas.getContext('2d');
      if (TYPE === 'dataURI') {
        return canvas.toDataURL();
      } else if (TYPE === 'array') {
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          return Array.prototype.join.call(imageData.data, ',');
        } catch (e) {
          console.error(e);
          return "";
        }
      }
      return "";
    }

    getPixelCount({ CANVAS_ID }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return 0;
      return canvas.width * canvas.height;
    }

    getPixel({ CANVAS_ID, X, Y }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return "";
      let translatedX1 = (canvas.width / 2) + cast.toNumber(X);
      let translatedY1 = (canvas.height / 2) - cast.toNumber(Y);
      const ctx = canvas.getContext('2d');
      try {
        const imageData = ctx.getImageData(translatedX1, translatedY1, 1, 1);
        return this._objToHex(imageData.data);
      } catch (e) {
        console.error(e);
        return "";
      }
    }

    getPixelIndex({ CANVAS_ID, INDEX }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return "";
      INDEX = Math.floor(cast.toNumber(INDEX));
      const ctx = canvas.getContext('2d');
      const x = INDEX % canvas.width;
      const y = Math.floor(INDEX / canvas.width);
      try {
        const imageData = ctx.getImageData(x, y, 1, 1);
        return this._objToHex(imageData.data);
      } catch (e) {
        console.error(e);
        return "";
      }
    }

    setPixelIndex({ CANVAS_ID, INDEX, COLOUR }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      INDEX = Math.floor(cast.toNumber(INDEX));
      const x = INDEX % canvas.width;
      const y = Math.floor(INDEX / canvas.width);
      ctx.fillStyle = cast.toString(COLOUR);
      ctx.fillRect(x, y, 1, 1);
    }

    setPixel({ CANVAS_ID, X, Y, COLOUR }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      let translatedX1 = (canvas.width / 2) + cast.toNumber(X);
      let translatedY1 = (canvas.height / 2) - cast.toNumber(Y);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = cast.toString(COLOUR);
      ctx.fillRect(translatedX1, translatedY1, 1, 1);
    }

    drawLine({ CANVAS_ID, X1, Y1, X2, Y2, COLOUR, LINEWIDTH, LINECAP }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      X1 = cast.toNumber(X1);
      Y1 = cast.toNumber(Y1);
      X2 = cast.toNumber(X2);
      Y2 = cast.toNumber(Y2);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      let translatedX1 = (canvas.width / 2) + X1;
      let translatedY1 = (canvas.height / 2) - Y1;
      let translatedX2 = (canvas.width / 2) + X2;
      let translatedY2 = (canvas.height / 2) - Y2;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = cast.toNumber(LINEWIDTH);
      ctx.strokeStyle = cast.toString(COLOUR);
      ctx.lineCap = cast.toString(LINECAP);
      ctx.beginPath();
      ctx.moveTo(translatedX1, translatedY1);
      ctx.lineTo(translatedX2, translatedY2);
      ctx.stroke()
    }

    async stampImage({ CANVAS_ID, URL, X, Y, WIDTH, HEIGHT }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      WIDTH = cast.toNumber(WIDTH);
      HEIGHT = cast.toNumber(HEIGHT);
      X = cast.toNumber(X);
      Y = cast.toNumber(Y);
      const ctx = canvas.getContext('2d');

      let bitmap;
      try {
        bitmap = await fetch(cast.toString(URL))
          .then(r => r.blob())
          .then(b => createImageBitmap(b));
      } catch (e) {
        console.error(`Error loading image: ${e}`);
        return;
      }

      const translatedX = (canvas.width / 2) + X - (WIDTH / 2);
      const translatedY = (canvas.height / 2) - Y - (HEIGHT / 2);
      ctx.drawImage(bitmap, translatedX, translatedY, WIDTH, HEIGHT);
      bitmap.close();
    }

    createPattern({ CANVAS_ID, URL, DIRECTION, X, Y, WIDTH, HEIGHT }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const pattern = ctx.createPattern(img, cast.toString(DIRECTION));
          ctx.fillStyle = pattern;
          const translatedX = (canvas.width / 2) + cast.toNumber(X) - (cast.toNumber(WIDTH) / 2);
          const translatedY = (canvas.height / 2) - cast.toNumber(Y) - (cast.toNumber(HEIGHT) / 2);
          ctx.fillRect(translatedX, translatedY, cast.toNumber(WIDTH), cast.toNumber(HEIGHT));
          resolve();
        }
        img.onerror = (err) => {
          console.log(`Error loading image: ${err}`);
          resolve();
        }
        img.src = cast.toString(URL);
      });
    }

    drawCircle({ CANVAS_ID, X, Y, RADIUS, COLOUR, FILL }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      COLOUR = cast.toString(COLOUR);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      ctx.strokeStyle = COLOUR;
      ctx.beginPath();
      ctx.arc((canvas.width / 2) + cast.toNumber(X), (canvas.height / 2) - cast.toNumber(Y), Math.abs(cast.toNumber(RADIUS)), 0, Math.PI * 2);
      if (cast.toString(FILL) === 'yes') {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }

    drawText({ CANVAS_ID, TEXT, X, Y, COLOUR, FONT }) {
      CANVAS_ID = cast.toString(CANVAS_ID);
      const canvas = this.canvases[CANVAS_ID];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.font = cast.toString(FONT);
      ctx.fillStyle = cast.toString(COLOUR);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cast.toString(TEXT), (canvas.width / 2) + cast.toNumber(X), (canvas.height / 2) - cast.toNumber(Y));
    }

    getCanvasList() {
      return JSON.stringify(Object.keys(this.canvases));
    }
  }
  Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumCanvas = new CanvasExtension());
})(Scratch);
