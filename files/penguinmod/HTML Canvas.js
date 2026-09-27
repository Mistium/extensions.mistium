// Name: HTML Canvas
// ID: newCanvas
// Description: Draw onto 2D HTML canvases and show them on sprites.
// By: G1nX / "gsa"
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/gsa_canvas
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("HTML Canvas must run unsandboxed.");

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const Cast = Scratch.Cast;

    // PenguinMod saves custom values in variables as { customType: true, typeId, serialized }.
    // MistWarp/TurboWarp have no serializer registry, so: provide registerSerializer if missing, write that format via
    // toJSON when the project is saved, and turn saved values back into objects after a project loads.
    const pmTypes = (() => {
      const runtime = Scratch.vm.runtime;
      if (runtime.pmTypesShim) return runtime.pmTypesShim;
      const native = typeof runtime.registerSerializer === "function";
      if (!runtime.serializers) runtime.serializers = {};
      const isSaved = (v) => v && typeof v === "object" && v.customType === true && typeof v.typeId === "string";
      const reviveValue = (v) => {
        if (isSaved(v) && runtime.serializers[v.typeId]) return runtime.serializers[v.typeId].deserialize(v.serialized);
        if (Array.isArray(v) && v.some(isSaved)) return v.map(reviveValue);
        return v;
      };
      const revive = () => {
        for (const target of runtime.targets) {
          for (const variable of Object.values(target.variables)) variable.value = reviveValue(variable.value);
        }
      };
      if (!native) {
        runtime.registerSerializer = (id, serialize, deserialize) => {
          runtime.serializers[id] = { serialize, deserialize };
          revive();
        };
        runtime.on("PROJECT_LOADED", revive);
      }
      const shim = {
        native,
        // call on each custom value class: class.prototype gets toJSON writing PenguinMod's format
        saveable(Class) {
          if (native || Class.prototype.toJSON) return;
          Class.prototype.toJSON = function () {
            const serializer = runtime.serializers[this.customId];
            return serializer ? { customType: true, typeId: this.customId, serialized: serializer.serialize(this) } : String(this);
          };
        },
      };
      return (runtime.pmTypesShim = shim);
    })();

    // from scratch-vm/src/util/uid.js
    const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const uid = function () {
        const id = [];
        for (let i = 0; i < 20; i++) id[i] = soup_.charAt(Math.random() * soup_.length);
        return id.join('');
    };

    // PenguinMod menus accept [text, value] pairs, MistWarp/TurboWarp want {text, value}.
    const toMenu = items => items.map(item => (Array.isArray(item) ? { text: item[0], value: item[1] } : item));

    const DefaultDrawImage = 'https://studio.penguinmod.com/favicon.ico';
    const canvasPropInfos = [
        ['compositing method', 'globalCompositeOperation', [
            ['source over', 'source-over'],
            ['source in', 'source-in'],
            ['source out', 'source-out'],
            ['source atop', 'source-atop'],
            ['destination over', 'destination-over'],
            ['destination in', 'destination-in'],
            ['destination out', 'destination-out'],
            ['destination atop', 'destination-atop'],
            ['lighter', 'lighter'],
            ['copy', 'copy'],
            ['xor', 'xor'],
            ['multiply', 'multiply'],
            ['screen', 'screen'],
            ['overlay', 'overlay'],
            ['darken', 'darken'],
            ['lighten', 'lighten'],
            ['color dodge', 'color-dodge'],
            ['color burn', 'color-burn'],
            ['hard light', 'hard-light'],
            ['soft light', 'soft-light'],
            ['difference', 'difference'],
            ['exclusion', 'exclusion'],
            ['hue', 'hue'],
            ['saturation', 'saturation'],
            ['color', 'color'],
            ['luminosity', 'luminosity']
        ], 'source-over'],
        ['CSS filter', 'filter', Scratch.ArgumentType.STRING, 'none'],
        ['font', 'font', Scratch.ArgumentType.STRING, ''],
        ['font kerning method', 'fontKerning', [
            ['browser defined', 'auto'],
            ['font defined', 'normal'],
            ['none', 'none']
        ], 'normal'],
        ['font stretch', 'fontStretch', [
            ['ultra condensed', 'ultra-condensed'],
            ['extra condensed', 'extra-condensed'],
            ['condensed', 'condensed'],
            ['normal', 'normal'],
            ['semi expanded', 'semi-expanded'],
            ['expanded', 'expanded'],
            ['extra expanded', 'extra-expanded'],
            ['ultra expanded', 'ultra-expanded']
        ], 'normal'],
        ['font case sizing', 'fontVariantCaps', [
            ['normal', 'normal'],
            ['uni-case', 'unicase'],
            ['titling-case', 'titling-caps'],
            ['smaller uppercase', 'small-caps'],
            ['smaller cased characters', 'all-small-caps'],
            ['petite uppercase', 'petite-caps'],
            ['petite cased characters', 'all-petite-caps']
        ], 'normal'],
        ['transparency', 'globalAlpha', Scratch.ArgumentType.NUMBER, '0'],
        ['image smoothing', 'imageSmoothingEnabled', Scratch.ArgumentType.BOOLEAN, ''],
        ['image smoothing quality', 'imageSmoothingQuality', [
            ['low', 'low'],
            ['medium', 'medium'],
            ['high', 'high']
        ], 'low'],
        ['letter spacing', 'letterSpacing', Scratch.ArgumentType.NUMBER, '0'],
        ['line cap shape', 'lineCap', [
            ['sharp', 'butt'],
            ['round', 'round'],
            ['square', 'square']
        ], 'butt'],
        ['line dash offset', 'lineDashOffset', Scratch.ArgumentType.NUMBER, '0'],
        ['line join shape', 'lineJoin', [
            ['round', 'round'],
            ['beveled', 'bevel'],
            ['sharp', 'miter']
        ], 'miter'],
        ['line size', 'lineWidth', Scratch.ArgumentType.NUMBER, '1'],
        ['sharp line join limit', 'miterLimit', Scratch.ArgumentType.NUMBER, '10'],
        ['shadow blur', 'shadowBlur', Scratch.ArgumentType.NUMBER, '0'],
        ['shadow color', 'shadowColor', Scratch.ArgumentType.COLOR, null],
        ['shadow X offset', 'shadowOffsetX', Scratch.ArgumentType.NUMBER, '0'],
        ['shadow Y offset', 'shadowOffsetY', Scratch.ArgumentType.NUMBER, '0'],
        ['line color', 'strokeStyle', Scratch.ArgumentType.COLOR, null],
        ['text horizontal alignment', 'textAlign', [
            ['start', 'start'],
            ['left', 'left'],
            ['center', 'center'],
            ['right', 'right'],
            ['end', 'end']
        ], 'start'],
        ['text vertical alignment', 'textBaseline', [
            ['top', 'top'],
            ['hanging', 'hanging'],
            ['middle', 'middle'],
            ['alphabetic', 'alphabetic'],
            ['ideographic', 'ideographic'],
            ['bottom', 'bottom']
        ], 'alphabetic'],
        ['text rendering optimisation', 'textRendering', [
            ['auto', 'auto'],
            ['render speed', 'optimizeSpeed'],
            ['legibility', 'optimizeLegibility'],
            ['geometric precision', 'geometricPrecision']
        ], 'auto'],
        ['word spacing', 'wordSpacing', Scratch.ArgumentType.NUMBER, '0']
    ];

    // Port of canvasData.js. PenguinMod-only: PM stores canvases as a custom variable type on targets
    // (saved under "customVars"); here the extension keeps them itself (global, looked up by name) and saves
    // them in the project's extension storage.
    class CanvasVar {
        static customId = 'canvasData';

        constructor(id, name, img = [1, 1]) {
            this.id = id ?? uid();
            this.name = name;
            this.type = 'canvas';
            this.customId = CanvasVar.customId;
            this.canvas = document.createElement('canvas');
            this._skinId = runtime.renderer ? runtime.renderer.createBitmapSkin(this.canvas, 1) : null;
            this._cameraStuff = {
                x: 0,
                y: 0,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
            };
            // img is just a size to be given to the canvas
            if (Array.isArray(img)) {
                this.size = img;
                return;
            }
            if (img) this.loadImage(img);
        }

        serialize() {
            return [this.id, this.name, this.canvas.toDataURL()];
        }
        toString() {
            return this.canvas.toDataURL();
        }

        get size() {
            return [this.canvas.width, this.canvas.height];
        }
        set size(size) {
            this.canvas.width = size[0];
            this.canvas.height = size[1];
        }

        async loadImage(img) {
            if (typeof img === 'string') {
                await new Promise(resolve => {
                    const src = img;
                    img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = src;
                });
            }
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.canvas.getContext('2d').drawImage(img, 0, 0);
            this.updateCanvasContentRenders();
        }

        updateCanvasContentRenders() {
            if (!runtime.renderer) return;
            // public renderer API instead of PM's skin._setTexture(getImageData())
            runtime.renderer.updateBitmapSkin(this._skinId, this.canvas, 1);
            runtime.requestRedraw();
        }

        applyCanvasToTarget(target) {
            if (runtime.renderer) runtime.renderer.updateDrawableSkinId(target.drawableID, this._skinId);
        }

        dispose() {
            if (runtime.renderer) runtime.renderer.destroySkin(this._skinId);
        }
    }
    pmTypes.saveable(CanvasVar);

    // PM's compiler helper; PM's version referenced an undefined `imgUrl` (so it never resolved) and resolved
    // onload immediately. Returns undefined for images that fail to load.
    const resolveImageURL = async imgURL => {
        if (imgURL instanceof CanvasVar) return imgURL.canvas;
        imgURL = Cast.toString(imgURL);
        if (Scratch.canFetch && !(await Scratch.canFetch(imgURL))) return;
        return new Promise(resolve => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = () => resolve();
            image.src = imgURL;
        });
    };
    // PM's version was a syntax error (`try return ...`).
    const parseJSONSafe = json => {
        try {
            return JSON.parse(json);
        } catch {
            return {};
        }
    };

    class canvas {
        constructor() {
            this.runtime = runtime;
            this.preloadedImages = {};
            /** @type {Record<string, CanvasVar>} by id */
            this.canvases = {};
            this.propList = [];
            this.sbInfo = {};
            for (const item of canvasPropInfos) {
                this.propList.push(item.slice(0, 2));
                this.sbInfo[item[1]] = {
                    isDummy: !Object.values(Scratch.ArgumentType).includes(item[2]),
                    default: item[3],
                    type: item[2]
                };
            }
            this.runtime.registerSerializer(
                CanvasVar.customId,
                canvas => canvas.id,
                varId => this.canvases[varId]
            );
            // restore before the serializer shim revives variable values that reference canvases
            runtime.prependListener('PROJECT_LOADED', () => this._syncStorage());
            this._syncStorage();
        }

        // keeps runtime.extensionStorage.newCanvas as a live view of the canvases; loads them from it after a project loads
        _syncStorage() {
            const saved = runtime.extensionStorage.newCanvas;
            if (saved && saved._live) return;
            for (const c of Object.values(this.canvases)) c.dispose();
            this.canvases = {};
            if (saved && Array.isArray(saved.canvases)) {
                for (const [id, name, url] of saved.canvases) this.canvases[id] = new CanvasVar(id, name, url);
            }
            const self = this;
            const live = {
                get canvases() {
                    return Object.values(self.canvases).map(c => c.serialize());
                }
            };
            Object.defineProperty(live, '_live', { value: true });
            runtime.extensionStorage.newCanvas = live;
            vm.extensionManager.refreshBlocks?.();
        }

        getCanvasMenu() {
            const names = Object.values(this.canvases).map(c => c.name);
            return names.length ? names : [''];
        }

        // PM: getOrCreateVariable. Accepts a canvas name, or a canvas object from the [canvas] reporter.
        getCanvas(canvas) {
            if (canvas instanceof CanvasVar) return canvas;
            const name = Cast.toString(canvas);
            const found = Object.values(this.canvases).find(c => c.name === name);
            if (found) return found;
            const created = new CanvasVar(null, name);
            this.canvases[created.id] = created;
            vm.extensionManager.refreshBlocks?.();
            return created;
        }
        ctx(canvas) {
            return this.getCanvas(canvas).canvas.getContext('2d');
        }

        getInfo() {
            const info = {
                id: 'newCanvas',
                name: 'HTML Canvas',
                color1: '#0069c2',
                isDynamic: true,
                blocks: [
                    {
                        func: 'createNewCanvas',
                        blockType: Scratch.BlockType.BUTTON,
                        text: 'Make a Canvas'
                    },
                    {
                        opcode: 'canvasGetter',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        },
                        text: '[canvas]'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Utilizing"
                    },
                    {
                        opcode: 'putOffSprite',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'show this sprite'
                    },
                    {
                        opcode: 'putOntoSprite',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'show canvas [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'getDataURI',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get data URL of [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'getWidthOfCanvas',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get width of [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'getHeightOfCanvas',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get height of [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Stylizing"
                    },
                    {
                        opcode: 'setSize',
                        text: 'set width: [width] height: [height] of [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageWidth
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageHeight
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'setProperty',
                        // PenguinMod-only: PM swaps the value slot's type per property with a Blockly hook;
                        // here it is always a text slot named "value" (PM saves it as field or input "value").
                        text: 'set [prop] of [canvas] to [value]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            prop: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvasProps'
                            },
                            value: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'source-over'
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'getProperty',
                        text: 'get [prop] of [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            prop: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvasProps'
                            }
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: 'dash',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set line dash to [dashing] in [canvas]',
                        arguments: {
                            dashing: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '[10, 10]'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Canvas Reseting"
                    },
                    {
                        opcode: 'clearCanvas',
                        text: 'clear canvas [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'clearAria',
                        text: 'clear area at x: [x] y: [y] with width: [width] height: [height] on [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageWidth
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageHeight
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Simple Drawing"
                    },
                    {
                        opcode: 'drawRect',
                        text: 'draw rectangle at x: [x] y: [y] with width: [width] height: [height] on [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageWidth
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageHeight
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'outlineRect',
                        text: 'draw rectangle outline at x: [x] y: [y] with width: [width] height: [height] on [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageWidth
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.runtime.stageHeight
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    "---",
                    {
                        opcode: 'drawText',
                        text: 'draw text [text] at [x] [y] onto [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'photos printed'
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'drawTextWithCap',
                        text: 'draw text [text] at [x] [y] with size cap [cap] onto [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'photos printed'
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            cap: {
                                type: Scratch.ArgumentType.NUMBER,
                                defauleValue: '10'
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'outlineText',
                        text: 'draw text outline for [text] at [x] [y] onto [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'photos printed'
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'outlineTextWithCap',
                        text: 'draw text outline for [text] at [x] [y] with size cap [cap] onto [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'photos printed'
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            cap: {
                                type: Scratch.ArgumentType.NUMBER,
                                defauleValue: '10'
                            }
                        },
                        blockType: Scratch.BlockType.COMMAND
                    },
                    {
                        opcode: 'getDrawnWidthOfText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get [dimension] of text [text] when drawn to [canvas]',
                        arguments: {
                            dimension: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'textDimension'
                            },
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'bogos binted'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Image Drawing"
                    },
                    {
                        opcode: 'preloadUriImage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'preload image [URI] as [NAME]',
                        arguments: {
                            URI: {
                                type: Scratch.ArgumentType.STRING,
                                exemptFromNormalization: true,
                                defaultValue: DefaultDrawImage
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "preloaded image"
                            }
                        }
                    },
                    {
                        opcode: 'unloadUriImage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'unload image [NAME]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "preloaded image"
                            }
                        }
                    },
                    {
                        opcode: 'getWidthOfPreloaded',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get width of [name]',
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "preloaded image"
                            }
                        }
                    },
                    {
                        opcode: 'getHeightOfPreloaded',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get height of [name]',
                        arguments: {
                            name: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "preloaded image"
                            }
                        }
                    },
                    {
                        opcode: 'drawUriImage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'draw image [URI] at x:[X] y:[Y] onto canvas [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            URI: {
                                type: Scratch.ArgumentType.STRING,
                                exemptFromNormalization: true,
                                defaultValue: DefaultDrawImage
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
                        opcode: 'drawUriImageWHR',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'draw image [URI] at x:[X] y:[Y] width:[WIDTH] height:[HEIGHT] pointed at: [ROTATE] onto canvas [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            URI: {
                                type: Scratch.ArgumentType.STRING,
                                exemptFromNormalization: true,
                                defaultValue: DefaultDrawImage
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
                                defaultValue: 64
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 64
                            },
                            ROTATE: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 90
                            }
                        }
                    },
                    {
                        opcode: 'drawUriImageWHCX1Y1X2Y2R',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'draw image [URI] at x:[X] y:[Y] width:[WIDTH] height:[HEIGHT] cropping from x:[CROPX] y:[CROPY] width:[CROPW] height:[CROPH] pointed at: [ROTATE] onto canvas [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            },
                            URI: {
                                type: Scratch.ArgumentType.STRING,
                                exemptFromNormalization: true,
                                defaultValue: DefaultDrawImage
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
                                defaultValue: 64
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 64
                            },
                            CROPX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CROPY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            CROPW: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            CROPH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            ROTATE: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 90
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Path Drawing"
                    },
                    {
                        opcode: 'beginPath',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'begin path drawing on [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'moveTo',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'move pen to x:[x] y:[y] on [canvas]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'lineTo',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add line going to x:[x] y:[y] on [canvas]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'arcTo',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add arc going to x:[x] y:[y] on [canvas] with control points [controlPoints] and radius [radius]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            controlPoints: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0, 0]",
                                nodes: 2
                            },
                            radius: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'addRect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add a rectangle at x:[x] y:[y] with width:[width] height:[height] to [canvas]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'addEllipse',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add a ellipse at x:[x] y:[y] with width:[width] height:[height] pointed towards [dir] to [canvas]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            dir: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 90
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'addEllipseStartStop',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add a ellipse with starting rotation [start] and ending rotation [end] at x:[x] y:[y] with width:[width] height:[height] pointed towards [dir] to [canvas]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            start: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '0'
                            },
                            end: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '360'
                            },
                            dir: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 90
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'closePath',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'close current path in [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'stroke',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'draw outline for current path in [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'fill',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'draw fill for current path in [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Transforms"
                    },
                    {
                        opcode: 'resetTransform',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear transform in [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'saveTransform',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'save [canvas]\'s transform',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'restoreTransform',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset to [canvas]\'s saved transform',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'turnRotationLeft',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'turn left [degrees] in [canvas]',
                        arguments: {
                            degrees: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '90'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'turnRotationRight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'turn right [degrees] in [canvas]',
                        arguments: {
                            degrees: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '90'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'setRotation',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set rotation to [degrees] in [canvas]',
                        arguments: {
                            degrees: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: '90'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'setTranslateXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set translation X: [x] Y: [y] on [canvas]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'changeTranslateXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change translation X: [x] Y: [y] on [canvas]',
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'changeTranslateX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change X translation by [amount] on [canvas]',
                        arguments: {
                            amount: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'setTranslateX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set X translation to [amount] on [canvas]',
                        arguments: {
                            amount: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '50'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'changeTranslateY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change Y translation by [amount] on [canvas]',
                        arguments: {
                            amount: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'setTranslateY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set Y translation by [amount] on [canvas]',
                        arguments: {
                            amount: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '50'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'changeScaleXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change scale by [percent]% on [canvas]',
                        arguments: {
                            percent: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'setScaleXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set scale to [percent]% on [canvas]',
                        arguments: {
                            percent: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '50'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'changeScaleX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change X scale by [percent]% on [canvas]',
                        arguments: {
                            percent: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '10'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'setScaleX',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set X scale to [percent]% on [canvas]',
                        arguments: {
                            percent: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '50'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'changeScaleY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change Y scale by [percent]% on [canvas]',
                        arguments: {
                            percent: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '50'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'setScaleY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set Y scale to [percent]% on [canvas]',
                        arguments: {
                            percent: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: '50'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'loadTransform',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set new transform [transform] on [canvas]',
                        arguments: {
                            transform: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '[1, 0, 0, 1, 0, 0]'
                            },
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    },
                    {
                        opcode: 'getTransform',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get current transform in [canvas]',
                        arguments: {
                            canvas: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'canvas'
                            }
                        }
                    }
                ],
                menus: {
                    textDimension: {
                        items: toMenu([
                            'width',
                            'height',
                            ['bounding box left', 'actualBoundingBoxLeft'],
                            ['bounding box right', 'actualBoundingBoxRight'],
                            ['bounding box ascent', 'actualBoundingBoxAscent'],
                            ['bounding box descent', 'actualBoundingBoxDescent'],
                            ['font bounding box ascent', 'fontBoundingBoxAscent'],
                            ['font bounding box descent', 'fontBoundingBoxDescent']
                            // maby add the other ones but the em ones be hella spotty
                        ])
                    },
                    // PenguinMod-only: PM uses a custom "canvas" variable type here; the port lists canvases by name.
                    canvas: {
                        acceptReporters: false,
                        items: 'getCanvasMenu'
                    },
                    canvasProps: {
                        items: toMenu(this.propList)
                    }
                }
            };
            // PenguinMod-only: PM hides every block but the button until a canvas exists (orderBlocks); same here.
            if (!Object.keys(this.canvases).length) {
                for (const block of info.blocks) {
                    if (typeof block === 'object' && block.func !== 'createNewCanvas') block.hideFromPalette = true;
                }
            }
            return info;
        }

        createNewCanvas() {
            // PenguinMod-only: PM uses ScratchBlocks.prompt with a "for all sprites / this sprite" choice;
            // canvases here are always global.
            const name = prompt('New Canvas name:');
            if (!name) return;
            if (Object.values(this.canvases).some(c => c.name === name)) {
                alert(`A Canvas named "${name}" already exists.`);
                return;
            }
            this.getCanvas(name);
            vm.extensionManager.refreshBlocks?.();
        }

        // PM's blocks below only had compiled implementations (registerCompiledExtensionBlocks);
        // these are the same operations as plain methods.
        canvasGetter({ canvas }) {
            return this.getCanvas(canvas);
        }
        putOffSprite(args, util) {
            const target = util.target;
            if (!runtime.renderer) return;
            runtime.renderer.updateDrawableSkinId(target.drawableID, target.getCostumes()[target.currentCostume].skinId);
        }
        putOntoSprite({ canvas }, util) {
            this.getCanvas(canvas).applyCanvasToTarget(util.target);
        }
        getDataURI({ canvas }) {
            return this.getCanvas(canvas).toString();
        }
        getWidthOfCanvas({ canvas }) {
            return this.getCanvas(canvas).size[0];
        }
        getHeightOfCanvas({ canvas }) {
            return this.getCanvas(canvas).size[1];
        }

        setSize(args) {
            const canvasObj = this.getCanvas(args.canvas);
            canvasObj.canvas.width = Cast.toNumber(args.width);
            canvasObj.canvas.height = Cast.toNumber(args.height);
            canvasObj.updateCanvasContentRenders();
        }
        setProperty(args) {
            const target = this.sbInfo[args.prop];
            if (!target) return;
            let value = args.value;
            switch (target.type) {
            case Scratch.ArgumentType.NUMBER:
                value = Cast.toNumber(value);
                break;
            case Scratch.ArgumentType.BOOLEAN:
                value = Cast.toBoolean(value);
                break;
            default:
                value = Cast.toString(value);
            }
            this.ctx(args.canvas)[args.prop] = value;
        }
        getProperty(args) {
            if (!this.sbInfo[args.prop]) return '';
            return this.ctx(args.canvas)[args.prop];
        }
        dash(args) {
            const dashing = parseJSONSafe(Cast.toString(args.dashing));
            // PM passed non-arrays straight through, which throws
            if (Array.isArray(dashing)) this.ctx(args.canvas).setLineDash(dashing);
        }

        clearCanvas(args) {
            const canvasObj = this.getCanvas(args.canvas);
            const ctx = canvasObj.canvas.getContext('2d');
            ctx.save();
            ctx.resetTransform();
            ctx.clearRect(0, 0, canvasObj.canvas.width, canvasObj.canvas.height);
            ctx.restore();
            canvasObj.updateCanvasContentRenders();
        }
        clearAria(args) {
            const canvasObj = this.getCanvas(args.canvas);
            canvasObj.canvas.getContext('2d').clearRect(
                Cast.toNumber(args.x), Cast.toNumber(args.y), Cast.toNumber(args.width), Cast.toNumber(args.height)
            );
            canvasObj.updateCanvasContentRenders();
        }

        _draw(canvas, fn) {
            const canvasObj = this.getCanvas(canvas);
            fn(canvasObj.canvas.getContext('2d'));
            canvasObj.updateCanvasContentRenders();
        }
        drawRect(args) {
            this._draw(args.canvas, ctx => ctx.fillRect(
                Cast.toNumber(args.x), Cast.toNumber(args.y), Cast.toNumber(args.width), Cast.toNumber(args.height)
            ));
        }
        outlineRect(args) {
            this._draw(args.canvas, ctx => ctx.strokeRect(
                Cast.toNumber(args.x), Cast.toNumber(args.y), Cast.toNumber(args.width), Cast.toNumber(args.height)
            ));
        }
        drawText(args) {
            this._draw(args.canvas, ctx => ctx.fillText(Cast.toString(args.text), Cast.toNumber(args.x), Cast.toNumber(args.y)));
        }
        drawTextWithCap(args) {
            this._draw(args.canvas, ctx => ctx.fillText(
                Cast.toString(args.text), Cast.toNumber(args.x), Cast.toNumber(args.y), Cast.toNumber(args.cap)
            ));
        }
        outlineText(args) {
            this._draw(args.canvas, ctx => ctx.strokeText(Cast.toString(args.text), Cast.toNumber(args.x), Cast.toNumber(args.y)));
        }
        outlineTextWithCap(args) {
            this._draw(args.canvas, ctx => ctx.strokeText(
                Cast.toString(args.text), Cast.toNumber(args.x), Cast.toNumber(args.y), Cast.toNumber(args.cap)
            ));
        }
        getDrawnWidthOfText(args) {
            const measure = this.ctx(args.canvas).measureText(Cast.toString(args.text));
            if (args.dimension === 'height') return measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
            return measure[args.dimension] ?? 0;
        }

        async preloadUriImage(args) {
            this.preloadedImages[Cast.toString(args.NAME)] = await resolveImageURL(args.URI);
        }
        unloadUriImage(args) {
            const name = Cast.toString(args.NAME);
            if (this.preloadedImages[name]) {
                this.preloadedImages[name].remove?.();
                delete this.preloadedImages[name];
            }
        }
        getWidthOfPreloaded({ name }) {
            if (!this.preloadedImages.hasOwnProperty(name)) return 0;
            return this.preloadedImages[name]?.width ?? 0;
        }
        getHeightOfPreloaded({ name }) {
            if (!this.preloadedImages.hasOwnProperty(name)) return 0;
            return this.preloadedImages[name]?.height ?? 0;
        }
        async _getImage(uri) {
            // like PM: the URI slot also accepts the name of a preloaded image
            if (typeof uri === 'string' && this.preloadedImages[uri]) return this.preloadedImages[uri];
            return resolveImageURL(uri);
        }
        async drawUriImage(args) {
            const image = await this._getImage(args.URI);
            if (!image) return;
            this._draw(args.canvas, ctx => ctx.drawImage(image, Cast.toNumber(args.X), Cast.toNumber(args.Y)));
        }
        // PM called drawImage with the rotation as an extra argument, which throws; rotation is applied
        // around the image centre instead (90 = no rotation, like the other direction inputs here).
        _drawRotated(ctx, image, args, crop) {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            const w = Cast.toNumber(args.WIDTH);
            const h = Cast.toNumber(args.HEIGHT);
            ctx.save();
            ctx.translate(x + w / 2, y + h / 2);
            ctx.rotate((Cast.toNumber(args.ROTATE) - 90) * Math.PI / 180);
            if (crop) ctx.drawImage(image, ...crop, -w / 2, -h / 2, w, h);
            else ctx.drawImage(image, -w / 2, -h / 2, w, h);
            ctx.restore();
        }
        async drawUriImageWHR(args) {
            const image = await this._getImage(args.URI);
            if (!image) return;
            this._draw(args.canvas, ctx => this._drawRotated(ctx, image, args));
        }
        async drawUriImageWHCX1Y1X2Y2R(args) {
            const image = await this._getImage(args.URI);
            if (!image) return;
            const crop = [args.CROPX, args.CROPY, args.CROPW, args.CROPH].map(Cast.toNumber);
            this._draw(args.canvas, ctx => this._drawRotated(ctx, image, args, crop));
        }

        beginPath(args) {
            this.ctx(args.canvas).beginPath();
        }
        moveTo(args) {
            this.ctx(args.canvas).moveTo(Cast.toNumber(args.x), Cast.toNumber(args.y));
        }
        lineTo(args) {
            this.ctx(args.canvas).lineTo(Cast.toNumber(args.x), Cast.toNumber(args.y));
        }
        arcTo(args) {
            // PenguinMod-only: controlPoints was a PM "polygon" input; here it is text like "[x, y]"
            // (or PM's [{x, y}] form), flattened into the second point of arcTo.
            let points = parseJSONSafe(Cast.toString(args.controlPoints));
            if (!Array.isArray(points)) points = [];
            points = points.flatMap(p => (p && typeof p === 'object' ? [p.x, p.y] : [p])).map(Cast.toNumber);
            this.ctx(args.canvas).arcTo(
                Cast.toNumber(args.x), Cast.toNumber(args.y), points[0] ?? 0, points[1] ?? 0, Math.max(0, Cast.toNumber(args.radius))
            );
        }
        addRect(args) {
            this.ctx(args.canvas).rect(
                Cast.toNumber(args.x), Cast.toNumber(args.y), Cast.toNumber(args.width), Cast.toNumber(args.height)
            );
        }
        addEllipse(args) {
            this.ctx(args.canvas).ellipse(
                Cast.toNumber(args.x), Cast.toNumber(args.y),
                // negative radii throw
                Math.abs(Cast.toNumber(args.width)), Math.abs(Cast.toNumber(args.height)),
                (Cast.toNumber(args.dir) - 90) * Math.PI / 180, 0, 2 * Math.PI
            );
        }
        addEllipseStartStop(args) {
            this.ctx(args.canvas).ellipse(
                Cast.toNumber(args.x), Cast.toNumber(args.y),
                Math.abs(Cast.toNumber(args.width)), Math.abs(Cast.toNumber(args.height)),
                (Cast.toNumber(args.dir) - 90) * Math.PI / 180,
                (Cast.toNumber(args.start) - 90) * Math.PI / 180,
                (Cast.toNumber(args.end) - 90) * Math.PI / 180
            );
        }
        closePath(args) {
            // PM's compiled version had a typo (`compiler.soource`) and did nothing
            this.ctx(args.canvas).closePath();
        }
        stroke(args) {
            this._draw(args.canvas, ctx => ctx.stroke());
        }
        fill(args) {
            this._draw(args.canvas, ctx => ctx.fill());
        }

        resetTransform(args) {
            this.ctx(args.canvas).resetTransform();
        }
        saveTransform(args) {
            this.ctx(args.canvas).save();
        }
        restoreTransform(args) {
            this.ctx(args.canvas).restore();
        }
        _cam(args) {
            const canvasObj = this.getCanvas(args.canvas);
            return [canvasObj.canvas.getContext('2d'), canvasObj._cameraStuff];
        }
        turnRotationLeft(args) {
            const [ctx, cam] = this._cam(args);
            ctx.rotate((cam.rotation -= Cast.toNumber(args.degrees)) * Math.PI / 180);
        }
        turnRotationRight(args) {
            const [ctx, cam] = this._cam(args);
            ctx.rotate((cam.rotation += Cast.toNumber(args.degrees)) * Math.PI / 180);
        }
        setRotation(args) {
            const [ctx, cam] = this._cam(args);
            ctx.rotate(((cam.rotation = Cast.toNumber(args.degrees)) - 90) * Math.PI / 180);
        }
        setTranslateXY(args) {
            const [ctx, cam] = this._cam(args);
            ctx.translate(cam.x = Cast.toNumber(args.x), cam.y = Cast.toNumber(args.y));
        }
        changeTranslateXY(args) {
            const [ctx, cam] = this._cam(args);
            ctx.translate(cam.x += Cast.toNumber(args.x), cam.y += Cast.toNumber(args.y));
        }
        changeTranslateX(args) {
            const [ctx, cam] = this._cam(args);
            ctx.translate(cam.x += Cast.toNumber(args.amount), cam.y);
        }
        setTranslateX(args) {
            const [ctx, cam] = this._cam(args);
            ctx.translate(cam.x = Cast.toNumber(args.amount), cam.y);
        }
        changeTranslateY(args) {
            const [ctx, cam] = this._cam(args);
            ctx.translate(cam.x, cam.y += Cast.toNumber(args.amount));
        }
        setTranslateY(args) {
            const [ctx, cam] = this._cam(args);
            ctx.translate(cam.x, cam.y = Cast.toNumber(args.amount));
        }
        changeScaleXY(args) {
            const [ctx, cam] = this._cam(args);
            const scale = Cast.toNumber(args.percent) / 100;
            ctx.scale(cam.scaleX += scale, cam.scaleY += scale);
        }
        setScaleXY(args) {
            const [ctx, cam] = this._cam(args);
            const scale = Cast.toNumber(args.percent) / 100;
            ctx.scale(cam.scaleX = scale, cam.scaleY = scale);
        }
        changeScaleX(args) {
            const [ctx, cam] = this._cam(args);
            ctx.scale(cam.scaleX += Cast.toNumber(args.percent) / 100, cam.scaleY);
        }
        setScaleX(args) {
            const [ctx, cam] = this._cam(args);
            ctx.scale(cam.scaleX = Cast.toNumber(args.percent) / 100, cam.scaleY);
        }
        changeScaleY(args) {
            const [ctx, cam] = this._cam(args);
            ctx.scale(cam.scaleX, cam.scaleY += Cast.toNumber(args.percent) / 100);
        }
        setScaleY(args) {
            const [ctx, cam] = this._cam(args);
            ctx.scale(cam.scaleX, cam.scaleY = Cast.toNumber(args.percent) / 100);
        }
        loadTransform(args) {
            const transform = parseJSONSafe(Cast.toString(args.transform));
            // PM passed the array itself, which setTransform reads as the identity matrix
            if (Array.isArray(transform) && transform.length === 6) this.ctx(args.canvas).setTransform(...transform.map(Cast.toNumber));
        }
        getTransform(args) {
            const t = this.ctx(args.canvas).getTransform();
            return JSON.stringify([t.a, t.b, t.c, t.d, t.e, t.f]);
        }
    }

    Scratch.extensions.register(new canvas());
})(Scratch);
