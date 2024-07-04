// Name: Mistium's Canvases
// Author: Mistium
// Description: Create and manipulate canvases with this extension

class CanvasExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.canvases = {};
    console.log('CanvasExtension initialized');
  }

  getInfo() {
    return {
      id: 'MistiumCanvas',
      name: "Mist's Canvases",
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
              defaultValue: '#ffffff'
            }
          }
        },
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
          text: 'draw rectangle on [CANVAS_ID] at x: [X] y: [Y] width: [WIDTH] height: [HEIGHT] with colour: [COLOUR] and fill: [FILL]',
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
            TYPE:{
              menu: 'TYPE',
            }
          }
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
          items: ['dataURI','array']
        }
      }
    };
  }

  createCanvas(args) {
    const { CANVAS_ID, X, Y, WIDTH, HEIGHT, COLOUR } = args;
    const canvas = document.createElement('canvas');
    canvas.id = CANVAS_ID;
    canvas.style.position = 'absolute';
    canvas.style.left = `${X}px`;
    canvas.style.top = `${Y}px`;
    canvas.style.backgroundColor = COLOUR;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    vm.renderer.addOverlay(canvas);
    this.canvases[CANVAS_ID] = canvas;
  }

  deleteCanvas(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      canvas.remove();
      delete this.canvases[CANVAS_ID]
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  moveCanvas(args) {
    const { CANVAS_ID, X, Y } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      canvas.style.left = `${X}px`;
      canvas.style.top = `${Y}px`;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  resizeCanvas(args) {
    const { CANVAS_ID, WIDTH, HEIGHT } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  setCanvasLayer(args) {
    const { CANVAS_ID, LAYER } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      canvas.style.zIndex = LAYER;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  clearCanvas(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  drawTriangle(args) {
    const { CANVAS_ID, X1, Y1, X2, Y2, X3, Y3, COLOUR, FILL } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      ctx.beginPath();
      ctx.moveTo(X1, Y1);
      ctx.lineTo(X2, Y2);
      ctx.lineTo(X3, Y3);
      ctx.closePath();
      if (FILL === 'yes') {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  drawRectangle(args) {
    const { CANVAS_ID, X, Y, WIDTH, HEIGHT, COLOUR, FILL } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      if (FILL === 'yes') {
        ctx.fillRect(X, Y, WIDTH, HEIGHT);
      } else {
        ctx.strokeRect(X, Y, WIDTH, HEIGHT);
      }
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  setPixel(args) {
    const { CANVAS_ID, X, Y, COLOUR } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      ctx.fillRect(X, Y, 1, 1);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getWidth(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      return canvas.width;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getHeight(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      return canvas.height;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getCanvasLayer(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      return canvas.style.zIndex;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getCanvasX(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      return parseInt(canvas.style.left);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getCanvasY(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      return parseInt(canvas.style.top);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getCanvasAs(args) {
    const { CANVAS_ID, TYPE } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (TYPE === 'dataURI') {
        return canvas.toDataURL();
      } else if (TYPE === 'array') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imageData.data;
      }
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getPixelCount(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.length / 4;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getPixel(args) {
    const { CANVAS_ID, X, Y } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(X, Y, 1, 1);
      return imageData.data;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  getPixelIndex(args) {
    const { CANVAS_ID, INDEX } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.slice(INDEX * 4, INDEX * 4 + 4);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  setPixelIndex(args) {
    const { CANVAS_ID, INDEX, COLOUR } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imageData.data.set(COLOUR, INDEX * 4);
      ctx.putImageData(imageData, 0, 0);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  setPixel(args) {
    const { CANVAS_ID, X, Y, COLOUR } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(X, Y, 1, 1);
      imageData.data.set(COLOUR);
      ctx.putImageData(imageData, X, Y);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  drawLine(args) {
    const { CANVAS_ID, X1, Y1, X2, Y2, COLOUR, LINEWIDTH, LINECAP } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = LINEWIDTH;
      ctx.strokeStyle = COLOUR;
      ctx.lineCap = LINECAP;
      ctx.beginPath();
      ctx.moveTo(X1, Y1);
      ctx.lineTo(X2, Y2);
      ctx.stroke()
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  stampImage(args) {
    const { CANVAS_ID, URL, X, Y, WIDTH, HEIGHT } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = URL;
      img.onload = () => {
        ctx.drawImage(img, X, Y, WIDTH, HEIGHT);
      }
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }
}

Scratch.extensions.register(new CanvasExtension());
