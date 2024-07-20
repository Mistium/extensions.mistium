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
              defaultValue: '#000000'
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
            TYPE: {
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
          items: ['dataURI', 'array']
        }
      }
    };
  }

  createCanvas(args) {
    const { CANVAS_ID, X, Y, WIDTH, HEIGHT, COLOUR } = args;
    if (this.canvases[CANVAS_ID]) {
      this.canvases[CANVAS_ID].remove();
      delete this.canvases[CANVAS_ID]
    }
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
      canvas.x = X;
      canvas.y = Y;
      canvas.style.left = `${(vm.runtime.stageWidth / 2 + X) - (canvas.width / 2)}px`;
      canvas.style.top = `${(vm.runtime.stageHeight / 2 - Y) - (canvas.height / 2)}px`;
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
      canvas.style.left = `${(vm.runtime.stageWidth / 2 + canvas.x) - (WIDTH / 2)}px`;
      canvas.style.top = `${(vm.runtime.stageHeight / 2 - canvas.y) - (HEIGHT / 2)}px`;
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  setCanvasStyle(args) {
    const { CANVAS_ID, PROPERTY, VALUE } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      canvas.style[PROPERTY] = VALUE;
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
      let translatedX1 = (canvas.width  / 2) + X1;
      let translatedY1 = (canvas.height / 2) - Y1;
      let translatedX2 = (canvas.width  / 2) + X2;
      let translatedY2 = (canvas.height / 2) - Y2;
      let translatedX3 = (canvas.width  / 2) + X3;
      let translatedY3 = (canvas.height / 2) - Y3;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
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
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }

  drawRectangle(args) {
    const { CANVAS_ID, X, Y, WIDTH, HEIGHT, COLOUR, ROUNDING, FILL } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      ctx.strokeStyle = COLOUR;
  
      // Convert Scratch coordinates to canvas coordinates
      const translatedX = (canvas.width / 2) + X - (WIDTH / 2);
      const translatedY = (canvas.height / 2) - Y - (HEIGHT / 2);
  
      ctx.beginPath();
      if (ROUNDING > 0) {
        // Rounded rectangle
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
        // Regular rectangle
        ctx.rect(translatedX, translatedY, WIDTH, HEIGHT);
      }
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
  

  setPixel(args) {
    const { CANVAS_ID, X, Y, COLOUR } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      let translatedX1 = (canvas.width  / 2) + X;
      let translatedY1 = (canvas.height / 2) - Y;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = COLOUR;
      ctx.fillRect(translatedX1, translatedY1, 1, 1);
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
    // convert the x of the canvas to scratch coordinates
    if (canvas) {
      const stageWidth = vm.runtime.stageWidth;
      return (parseInt(canvas.style.left) + canvas.width / 2) - stageWidth / 2
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
      return 0;
    }
  }

  getCanvasY(args) {
    const { CANVAS_ID } = args;
    const canvas = this.canvases[CANVAS_ID];
    if (canvas) {
      const stageHeight = vm.runtime.stageHeight;
      return stageHeight / 2 - (parseInt(canvas.style.top) + canvas.height / 2);
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
      return 0;
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
      let translatedX1 = (canvas.width  / 2) + X;
      let translatedY1 = (canvas.height / 2) - Y;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(translatedX1, translatedY1, 1, 1);
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
      let translatedX1 = (canvas.width  / 2) + X;
      let translatedY1 = (canvas.height / 2) - Y;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(translatedX1, translatedY1, 1, 1);
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
      let translatedX1 = (canvas.width  / 2) + X1;
      let translatedY1 = (canvas.height / 2) - Y1;
      let translatedX2 = (canvas.width  / 2) + X2;
      let translatedY2 = (canvas.height / 2) - Y2;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = LINEWIDTH;
      ctx.strokeStyle = COLOUR;
      ctx.lineCap = LINECAP;
      ctx.beginPath();
      ctx.moveTo(translatedX1, translatedY1);
      ctx.lineTo(translatedX2, translatedY2);
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
        // Center the image based on canvas dimensions and specified X, Y
        const translatedX1 = (canvas.width  / 2) + X - (WIDTH  / 2);
        const translatedY1 = (canvas.height / 2) - Y - (HEIGHT / 2);
        ctx.drawImage(img, translatedX1, translatedY1, WIDTH, HEIGHT);
      }
      img.onerror = (err) => {
        console.log(`Error loading image: ${err}`);
      }
    } else {
      console.log(`Canvas ${CANVAS_ID} not found`);
    }
  }
}
Scratch.extensions.register(new CanvasExtension());
