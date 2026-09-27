// Name: html canvas
// ID: canvas
// Description: The original HTML canvas extension: draw rectangles and images onto named canvases.
// By: G1nX
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/gsa_canvas_old
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("html canvas must run unsandboxed.");
const { BlockType, ArgumentType, Cast } = Scratch;
const vm = Scratch.vm;

const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const uid = function () {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
};

class canvasStorage {
    /**
     * initiats the storage
     */
    constructor () {
        this.canvases = {};
    }

    attachRuntime (runtime) {
        this.runtime = runtime;
    }

    /**
     * gets a canvas with a given id
     * @param {string} id the id of the canvas to get
     * @returns {object} the canvas object with this id
     */
    getCanvas (id) {
        return this.canvases[id];
    }

    /**
     * deletes a canvas with a given id
     * @param {string} id the canvas id to delete
     * @returns {object} the deleted canvas
     */
    deleteCanvas (id) {
        const orignal = this.canvases[id];
        delete this.canvases[id];
        return orignal;
    }

    /**
     * creates a new canvas
     * @param {string} name the name to give the new canvas
     * @param {number} width the width of the canvas
     * @param {number} height the height of the canvas
     * @param {string} opt_id the id of the canvas
     * @returns {object} the new canvas object
     */
    newCanvas (name, width, height, opt_id) {
        width = width || this.runtime.stageWidth;
        height = height || this.runtime.stageHeight;
        
        const id = opt_id || uid();
        const element = document.createElement('canvas');
        element.id = id;
        element.width = width;
        element.height = height;

        const skin = !this.runtime.renderer
            ? null
            : this.runtime.renderer.createBitmapSkin(element, 1);

        const data = {
            name: name,
            id: id,
            element: element,
            skinId: skin,
            width: width, 
            height: height,
            context: element.getContext('2d')
        };
        this.canvases[id] = data;
        return data;
    }

    /**
     * gets or creates a canvas with name equal to 
     * @param {string} name the name of the canvas
     * @returns {object} A canvas variable
     */
    getCanvasByName (name) {
        return Object.values(this.canvases).find(canvas => canvas.name === name);
    }

    /**
     * gets all canvases 
     * @returns {Array} All the canvases stored
     */
    getAllCanvases () {
        return Object.values(this.canvases);
    }
}
const store = new canvasStorage();

/**
 * Class
 * @constructor
 */
class canvas {
    constructor() {
        /**
         * The runtime instantiating this block package.
         * @type {runtime}
         */
        this.runtime = vm.runtime;
        store.attachRuntime(this.runtime);
        // PenguinMod saves canvases through serialize()/deserialize().
        // Elsewhere those hooks aren't called, so keep the list in runtime.extensionStorage, which TurboWarp/MistWarp
        // save in the project. (This can load mid-project-load, after extensionStorage was read, so check again later.)
        if (!Scratch.extensions.isPenguinMod) {
            const load = () => {
                const data = this.runtime.extensionStorage && this.runtime.extensionStorage.canvas;
                if (Array.isArray(data)) this.deserialize(data);
            };
            load();
            this.runtime.on('PROJECT_LOADED', load);
        }
    }

    static get canvasStorageHeader() {
        return 'canvases: ';
    }

    deserialize(data) {
        store.canvases = {};
        for (const canvas of data) {
            store.newCanvas(canvas.name, canvas.width, canvas.height, canvas.id);
        }
    }

    serialize() {
        const data = store.getAllCanvases()
            .map(variable => ({
                name: variable.name,
                width: variable.width,
                height: variable.height,
                id: variable.id
            }));
        if (!Scratch.extensions.isPenguinMod && this.runtime.extensionStorage) this.runtime.extensionStorage.canvas = data;
        return data;
    }

    readAsImageElement(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = function () {
                resolve(image);
                image.onload = null;
                image.onerror = null;
            };
            image.onerror = function () {
                reject(new Error('Costume load failed. Asset could not be read.'));
                image.onload = null;
                image.onerror = null;
            };
            image.src = src;
        });
    }

    orderCategoryBlocks(blocks) {
        const button = blocks[0];
        const varBlock = blocks[1];
        delete blocks[0];
        delete blocks[1];
        // create the variable block xml's
        const varBlocks = store.getAllCanvases().map(canvas => varBlock
            .replace('{canvasId}', canvas.id));
        if (!varBlocks.length) {
            return [button];
        }
        // push the button to the top of the var list
        varBlocks
            .reverse()
            .push(button);
        // merge the category blocks and variable blocks into one block list
        blocks = varBlocks
            .reverse()
            .concat(blocks);
        return blocks;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'canvas',
            name: 'html canvas',
            color1: '#0069c2',
            color2: '#0060B4',
            color3: '#0060B4',
            isDynamic: true,
            // PenguinMod-only: orderBlocks puts one reporter per canvas in the palette;
            // elsewhere the palette shows one reporter with a canvas dropdown.
            orderBlocks: this.orderCategoryBlocks,
            blocks: [
                {
                    opcode: 'createNewCanvas',
                    func: 'createNewCanvas', // TurboWarp/MistWarp buttons use func
                    blockType: BlockType.BUTTON,
                    text: 'create new canvas'
                },
                {
                    opcode: 'canvasGetter',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: Scratch.extensions.isPenguinMod ? '{canvasId}' : ''
                        }
                    },
                    text: '[canvas]'
                },
                {
                    blockType: BlockType.LABEL,
                    text: "config"
                },
                {
                    opcode: 'setGlobalCompositeOperation',
                    text: 'set composite operation of [canvas] to [CompositeOperation]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        CompositeOperation: {
                            type: ArgumentType.STRING,
                            menu: 'CompositeOperation',
                            defaultValue: ""
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'setSize',
                    text: 'set width: [width] height: [height] of [canvas]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        width: {
                            type: ArgumentType.NUMBER,
                            defaultValue: this.runtime.stageWidth
                        },
                        height: {
                            type: ArgumentType.NUMBER,
                            defaultValue: this.runtime.stageHeight
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'setTransparency',
                    text: 'set transparency of [canvas] to [transparency]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        transparency: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'setFill',
                    text: 'set fill color of [canvas] to [color]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        color: {
                            type: ArgumentType.COLOR
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'setBorderColor',
                    text: 'set border color of [canvas] to [color]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        color: {
                            type: ArgumentType.COLOR
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    blockType: BlockType.LABEL,
                    text: "drawing"
                },
                {
                    opcode: 'clearCanvas',
                    text: 'clear canvas [canvas]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'clearAria',
                    text: 'clear area at x: [x] y: [y] with width: [width] height: [height] on [canvas]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        width: {
                            type: ArgumentType.NUMBER,
                            defaultValue: this.runtime.stageWidth
                        },
                        height: {
                            type: ArgumentType.NUMBER,
                            defaultValue: this.runtime.stageHeight
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'drawRect',
                    text: 'draw rectangle at x: [x] y: [y] with width: [width] height: [height] on [canvas]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        width: {
                            type: ArgumentType.NUMBER,
                            defaultValue: this.runtime.stageWidth
                        },
                        height: {
                            type: ArgumentType.NUMBER,
                            defaultValue: this.runtime.stageHeight
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'drawImage',
                    text: 'draw image [src] at x: [x] y: [y] on [canvas]',
                    arguments: {
                        canvas: {
                            type: ArgumentType.STRING,
                            menu: 'canvas',
                            defaultValue: ""
                        },
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        src: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://studio.penguinmod.com/favicon.ico'
                        }
                    },
                    blockType: BlockType.COMMAND
                }
            ],
            menus: {
                canvas: 'getCanvasMenuItems',
                CompositeOperation: {
                    items: [
                        {
                            "text": "source-over",
                            "value": "source-over"
                        },
                        {
                            "text": "source-in",
                            "value": "source-in"
                        },
                        {
                            "text": "source-out",
                            "value": "source-out"
                        },
                        {
                            "text": "source-atop",
                            "value": "source-atop"
                        },
                        {
                            "text": "destination-over",
                            "value": "destination-over"
                        },
                        {
                            "text": "destination-in",
                            "value": "destination-in"
                        },
                        {
                            "text": "destination-out",
                            "value": "destination-out"
                        },
                        {
                            "text": "destination-atop",
                            "value": "destination-atop"
                        },
                        {
                            "text": "lighter",
                            "value": "lighter"
                        },
                        {
                            "text": "copy",
                            "value": "copy"
                        },
                        {
                            "text": "xor",
                            "value": "xor"
                        },
                        {
                            "text": "multiply",
                            "value": "multiply"
                        },
                        {
                            "text": "screen",
                            "value": "screen"
                        },
                        {
                            "text": "overlay",
                            "value": "overlay"
                        },
                        {
                            "text": "darken",
                            "value": "darken"
                        },
                        {
                            "text": "lighten",
                            "value": "lighten"
                        },
                        {
                            "text": "color-dodge",
                            "value": "color-dodge"
                        },
                        {
                            "text": "color-burn",
                            "value": "color-burn"
                        },
                        {
                            "text": "hard-light",
                            "value": "hard-light"
                        },
                        {
                            "text": "soft-light",
                            "value": "soft-light"
                        },
                        {
                            "text": "difference",
                            "value": "difference"
                        },
                        {
                            "text": "exclusion",
                            "value": "exclusion"
                        },
                        {
                            "text": "hue",
                            "value": "hue"
                        },
                        {
                            "text": "saturation",
                            "value": "saturation"
                        },
                        {
                            "text": "color",
                            "value": "color"
                        },
                        {
                            "text": "luminosity",
                            "value": "luminosity"
                        }
                    ]
                }
            }
        };
    }

    createNewCanvas() {
        const newCanvas = prompt('canvas name?', 'newCanvas');
        // if this camvas already exists, remove it to minimize confusion
        if (!newCanvas) return alert('Canceled')
        if (store.getCanvasByName(newCanvas)) return;
        store.newCanvas(newCanvas);
        vm.emitWorkspaceUpdate();
        this.serialize();
    }

    getCanvasMenuItems() {
        const canvases = store.getAllCanvases();
        if (canvases.length < 1) return [{ text: '', value: '' }];
        return canvases.map(canvas => ({
            text: canvas.name,
            value: canvas.id
        }));
    }

    canvasGetter(args) {
        const canvasObj = store.getCanvas(args.canvas);
        return canvasObj.element.toDataURL();
    }

    setGlobalCompositeOperation(args) {
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.context.globalCompositeOperation = args.CompositeOperation;
    }

    setBorderColor(args) {
        const color = Cast.toString(args.color);
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.context.strokeStyle = color;
    }

    setFill(args) {
        const color = Cast.toString(args.color);
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.context.fillStyle = color;
    }

    setSize(args) {
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.element.width = args.width;
        canvasObj.element.height = args.height;
        canvasObj.context = canvasObj.element.getContext('2d');
    }

    drawRect(args) {
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.context.fillRect(args.x, args.y, args.width, args.height);
    }

    drawImage(args) {
        return new Promise(resolve => {
            const canvasObj = store.getCanvas(args.canvas);
            const image = new Image();
            image.onload = () => {
                canvasObj.context.drawImage(image, args.x, args.y);
                resolve();
            };
            image.src = args.src;
        });
    }

    clearAria(args) {
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.context.clearRect(args.x, args.y, args.width, args.height);
    }

    clearCanvas(args) {
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.context.clearRect(0, 0, canvasObj.width, canvasObj.height);
    }

    setTransparency(args) {
        const canvasObj = store.getCanvas(args.canvas);
        canvasObj.context.globalAlpha = args.transparency / 100;
    }
}


Scratch.extensions.register(new canvas());
})(Scratch);
