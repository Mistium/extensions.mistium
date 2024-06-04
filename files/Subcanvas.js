class SubCanvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }

    draw(x, y, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, 1, 1);
    }

    stamp(mainContext, x, y) {
        mainContext.drawImage(this.canvas, x, y);
    }
}

class SubCanvasExtension {
    constructor(runtime) {
        this.runtime = vm.runtime;
        this.subCanvases = {};
    }

    getInfo() {
        return {
            id: 'subcanvas',
            name: 'SubCanvas',
            blocks: [
                {
                    opcode: 'createSubCanvas',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create sub-canvas [NAME] with width [WIDTH] and height [HEIGHT]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'myCanvas'
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
                    opcode: 'drawOnSubCanvas',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'draw on sub-canvas [NAME] at x [X] y [Y] with color [COLOR]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'myCanvas'
                        },
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        COLOR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '#000000'
                        }
                    }
                },
                {
                    opcode: 'stampSubCanvas',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stamp sub-canvas [NAME] at x [X] y [Y] on main canvas',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'myCanvas'
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
                }
            ]
        };
    }

    createSubCanvas(args) {
        const name = args.NAME;
        const width = args.WIDTH;
        const height = args.HEIGHT;
        this.subCanvases[name] = new SubCanvas(width, height);
    }

    drawOnSubCanvas(args) {
        const name = args.NAME;
        const x = args.X;
        const y = args.Y;
        const color = args.COLOR;
        const subCanvas = this.subCanvases[name];
        if (subCanvas) {
            subCanvas.draw(x, y, color);
        }
    }

    stampSubCanvas(args) {
        const name = args.NAME;
        const x = args.X;
        const y = args.Y;
        const subCanvas = this.subCanvases[name];
        if (subCanvas) {
            const mainContext = this.runtime.renderer.penSkin._canvas.getContext('2d');
            subCanvas.stamp(mainContext, x, y);
        }
    }
}

Scratch.extensions.register(new SubCanvasExtension());
