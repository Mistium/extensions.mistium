// Name: Arrays
// ID: jwArray
// Description: An array value type with blocks to build, read, change, loop over and sort arrays.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jwArray
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Arrays must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const vm = Scratch.vm;
    const shape = (name) => Scratch.BlockShape?.[name] ?? Scratch.BlockShape?.SQUARE;

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

    // MistWarp/TurboWarp validate projects on load and turn object variable values into "[object Object]"
    // (sb3fix), so the object format above never survives a reload there. So while saving, custom values are
    // written as that same JSON inside a string, and such strings become objects again after a project loads.
    // Guarded separately from the shim so it installs whichever port loads first.
    (() => {
      const runtime = Scratch.vm.runtime;
      if (pmTypes.native || runtime.pmTypesStringSave) return;
      runtime.pmTypesStringSave = true;
      const prefix = '{"customType":true,"typeId":"';
      const encode = (v) => {
        if (Array.isArray(v)) {
          const out = v.map(encode);
          return out.some((x, i) => x !== v[i]) ? out : v;
        }
        const serializer = v && typeof v === "object" && runtime.serializers[v.customId];
        return serializer ? JSON.stringify({ customType: true, typeId: v.customId, serialized: serializer.serialize(v) }) : v;
      };
      const decode = (v) => {
        if (Array.isArray(v)) {
          const out = v.map(decode);
          return out.some((x, i) => x !== v[i]) ? out : v;
        }
        if (typeof v === "string" && v.startsWith(prefix)) {
          try {
            const saved = JSON.parse(v);
            if (runtime.serializers[saved.typeId]) return runtime.serializers[saved.typeId].deserialize(saved.serialized);
          } catch {}
        }
        return v;
      };
      const eachVariable = (fn) => {
        for (const target of runtime.targets) for (const variable of Object.values(target.variables)) fn(variable);
      };
      const toJSON = Scratch.vm.toJSON;
      Scratch.vm.toJSON = function (...args) {
        const changed = [];
        eachVariable((variable) => {
          const encoded = encode(variable.value);
          if (encoded !== variable.value) changed.push([variable, variable.value]);
          variable.value = encoded;
        });
        try {
          return toJSON.apply(this, args);
        } finally {
          for (const [variable, value] of changed) variable.value = value;
        }
      };
      const revive = () => eachVariable((variable) => { variable.value = decode(variable.value); });
      runtime.on("PROJECT_LOADED", revive);
      const register = runtime.registerSerializer;
      runtime.registerSerializer = function (...args) {
        const result = register.apply(this, args);
        revive();
        return result;
      };
    })();

    // PenguinMod compiles the branches of reporter blocks inline. MistWarp/TurboWarp can't, so a branch (or an input
    // that must be re-evaluated) runs in a separate interpreted thread that shares this thread's jw* state. It is
    // stepped immediately, so it finishes within the block unless it waits; then the block waits for it.
    // procedures_return inside it stops at the bottom frame, which is where its value is read from.
    const currentBlockId = (util) => util.thread.peekStackFrame()?.op?.id ?? util.thread.peekStack();
    const findBlocks = (util, id) => [util.thread.blockContainer, util.target.blocks, vm.runtime.flyoutBlocks]
        .find(blocks => blocks && blocks.getBlock(id));
    const inputBlockId = (util, name) => {
        const id = currentBlockId(util);
        const input = findBlocks(util, id)?.getBlock(id).inputs[name];
        // no block, or just the shadow (a literal): nothing to re-evaluate
        return input && input.block && input.block !== input.shadow ? input.block : null;
    };
    const runInline = (util, blocks, blockId, isReporter, setup) => {
        const runtime = vm.runtime;
        const parent = util.thread;
        const child = new parent.constructor(blockId);
        child.target = util.target;
        child.blockContainer = blocks;
        child.triedToCompile = true;
        child.pushStack("jwInlineEnd"); // not a block: the interpreter retires the thread when it gets back here
        const base = child.peekStackFrame();
        base.waitingReporter = true;
        base.warpMode = true; // ponytail: always warp, PenguinMod inherits the caller's warp mode
        // custom block arguments (only reachable when the caller is interpreted; compiled scripts keep them in JS locals)
        base.params = parent.stackFrames.slice().reverse().find(frame => frame.params)?.params ?? null;
        child.pushStack(blockId);
        for (const key of Object.keys(parent)) if (key.startsWith("_jw")) child[key] = parent[key];
        if (setup) setup(child);
        const result = () => isReporter ? (child.justReported ?? "") : base.executionContext?.returnValue;
        const utilThread = util.thread;
        const utilSequencer = util.sequencer;
        runtime.sequencer.stepThread(child);
        util.thread = utilThread;
        util.sequencer = utilSequencer;
        if (child.status === 4 /* STATUS_DONE */) return result();
        runtime.threads.push(child);
        child.inThreadList = true;
        return new Promise(resolve => {
            const check = () => {
                if (child.status !== 4) return;
                runtime.off("AFTER_EXECUTE", check);
                resolve(result());
            };
            runtime.on("AFTER_EXECUTE", check);
        });
    };
    const after = (value, fn) => value instanceof Promise ? value.then(fn) : fn(value);

    let arrayLimit = 2 ** 32 - 1

    // credit to sharpool because i stole the for each code from his extension haha im soo evil

    /**
    * @param {number} x
    * @returns {string}
    */
    function formatNumber(x) {
        if (x >= 1e6) {
            return x.toExponential(4)
        } else {
            x = Math.floor(x * 1000) / 1000
            return x.toFixed(Math.min(3, (String(x).split('.')[1] || '').length))
        }
    }

    const escapeHTML = unsafe => {
        return unsafe
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;")
    };

    function clampIndex(x) {
        return Math.min(Math.max(Math.floor(x), 0), arrayLimit)
    }

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    function isObject(x) {
        return x !== null && typeof x === "object" && [null, Object.prototype].includes(Object.getPrototypeOf(x));
    }

    class ArrayType {
        customId = "jwArray"

        array = []

        constructor(array = [], safe = false) {
            this.array = safe ? array : array.map(v => {
                if (v instanceof Array) return new ArrayType([...v])
                if (vm.dogeiscutObject && isObject(v)) return new vm.dogeiscutObject.Type({...v})
                return v
            })
        }

        static toArray(x, readOnly = false) {
            if (x instanceof ArrayType) return readOnly ? x : new ArrayType([...x.array], true)
            if (x instanceof Array) return readOnly ? new ArrayType(x) : new ArrayType([...x])
            if (x === "" || x === null || x === undefined) return new ArrayType([], true)
            if (typeof x == "object" && typeof x.toJSON == "function") {
                let parsed = x.toJSON()
                if (parsed instanceof Array) return new ArrayType(parsed)
                if (isObject(parsed)) return new ArrayType(Object.values(parsed))
                return new ArrayType([parsed])
            }
            try {
                let parsed = JSON.parse(x)
                if (parsed instanceof Array) return new ArrayType(parsed)
            } catch {}
            return new ArrayType([x], true)
        }

        static validArray(x) {
            if (x instanceof ArrayType) return true;
            if (x instanceof Array) return true;
            if (typeof x == "object" && typeof x.toJSON == "function") return true;
            try {
                let parsed = JSON.parse(Cast.toString(x));
                if (parsed instanceof Array) return true;
            } catch {}
            return false;
        }

        static forArray(x) {
            if (x instanceof ArrayType) return new ArrayType([...x.array])
            if (x instanceof Array) return new ArrayType([...x])
            if (vm.dogeiscutObject && isObject(x)) return new vm.dogeiscutObject.Type({...x})
            return x
        }

        static display(x) {
            try {
                switch (typeof x) {
                    case "object":
                        if (x === null) return "null"
                        if (typeof x.jwArrayHandler == "function") {
                            return x.jwArrayHandler()
                        }
                        return "Object"
                    case "undefined":
                        return "null"
                    case "number":
                        return formatNumber(x)
                    case "boolean":
                        return x ? "true" : "false"
                    case "string":
                        return `"${escapeHTML(Cast.toString(x))}"`
                }
            } catch {}
            return "?"
        }

        jwArrayHandler() {
            return `Array<${formatNumber(this.array.length)}>`
        }

        toString(pretty = false) {
            return JSON.stringify(this.toJSON(), null, pretty ? "\t" : null)
        }
        toJSON() {
            return this.array.map(v => {
                if (typeof v == "object" && v !== null) {
                    if (v.toJSON && typeof v.toJSON == "function") return v.toJSON()
                    if (v.toString && typeof v.toString == "function") return v.toString()
                    return JSON.stringify(v)
                }
                return v
            })
        }

        toMonitorContent() {
            return span(escapeHTML(this.toString()));
        }

        toReporterContent() {
            let root = document.createElement('div')
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'

            let arrayDisplay = span(`[${this.array.slice(0, 50).map(v => ArrayType.display(v)).join(', ')}]`)
            arrayDisplay.style.overflow = "hidden"
            arrayDisplay.style.whiteSpace = "nowrap"
            arrayDisplay.style.textOverflow = "ellipsis"
            arrayDisplay.style.maxWidth = "256px"
            root.appendChild(arrayDisplay)

            root.appendChild(span(`Length: ${this.array.length}`))

            return root
        }

        flat(depth = 1) {
            depth = Math.floor(depth)
            if (depth < 1) return this
            return new ArrayType(this.array.reduce((o, v) => {
                if (v instanceof ArrayType) return [...o, ...v.flat(depth - 1).array]
                return [...o, v]
            }, []), true)
        }

        get length() {
            return this.array.length
        }
    }

    const jwArray = {
        Type: ArrayType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: shape("SQUARE"),
            forceOutputType: "Array",
            //allowDropAnywhere: true,
            disableMonitor: true
        },
        Argument: {
            shape: shape("SQUARE"),
            exemptFromNormalization: true,
            check: ["Array"],
            compilerInfo: {
                jwArrayUnmodified: true
            }
        }
        // PenguinMod-only: compilerModification (the jwArrayCompilerModifications compiler patch) is not ported.
    }

    class Extension {
        constructor() {
            vm.jwArray = jwArray
            vm.runtime.registerSerializer( //this basically copies variable serialization
                "jwArray",
                v => v.array.map(w => {
                    if (typeof w == "object" && w != null && w.customId && vm.runtime.serializers[w.customId]) {
                        return {
                            customType: true,
                            typeId: w.customId,
                            serialized: vm.runtime.serializers[w.customId].serialize(w)
                        };
                    }
                    return w
                }),
                v => new jwArray.Type(v.map(w => {
                    // fixed: an item of a type whose extension isn't loaded no longer throws
                    if (typeof w == "object" && w != null && w.customType && vm.runtime.serializers[w.typeId]) {
                        return vm.runtime.serializers[w.typeId].deserialize(w.serialized)
                    }
                    return w
                }), true)
            );
            // PenguinMod-only: registerCompiledExtensionBlocks. Every block has a JS implementation below; builder
            // runs its branch through runInline, which needs the interpreter, so MistWarp is told not to compile
            // scripts that contain it (they fall back to the interpreter).
            // TurboWarp's compiler has no such hook: there, "array builder" needs the compiler turned off.
            vm.exports?.compiler?.register?.("jwArray", {
                builder: {
                    type: "any",
                    compile() {
                        throw new Error("jwArray_builder runs in the interpreter");
                    }
                }
            });
        }

        getInfo() {
            return {
                id: "jwArray",
                name: "Arrays",
                color1: "#ff513d",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM6Yng9Imh0dHBzOi8vYm94eS1zdmcuY29tIj4KICA8Y2lyY2xlIHN0eWxlPSJzdHJva2Utd2lkdGg6IDJweDsgcGFpbnQtb3JkZXI6IHN0cm9rZTsgZmlsbDogcmdiKDI1NSwgODEsIDYxKTsgc3Ryb2tlOiByZ2IoMjA1LCA1OSwgNDQpOyIgY3g9IjEwIiBjeT0iMTAiIHI9IjkiPjwvY2lyY2xlPgogIDxwYXRoIGQ9Ik0gOC4wNzMgNC4yMiBMIDYuMTQ3IDQuMjIgQyA1LjA4MyA0LjIyIDQuMjIgNS4wODMgNC4yMiA2LjE0NyBMIDQuMjIgMTMuODUzIEMgNC4yMiAxNC45MTkgNS4wODMgMTUuNzggNi4xNDcgMTUuNzggTCA4LjA3MyAxNS43OCBMIDguMDczIDEzLjg1MyBMIDYuMTQ3IDEzLjg1MyBMIDYuMTQ3IDYuMTQ3IEwgOC4wNzMgNi4xNDcgTCA4LjA3MyA0LjIyIFogTSAxMS45MjcgMTMuODUzIEwgMTMuODUzIDEzLjg1MyBMIDEzLjg1MyA2LjE0NyBMIDExLjkyNyA2LjE0NyBMIDExLjkyNyA0LjIyIEwgMTMuODUzIDQuMjIgQyAxNC45MTcgNC4yMiAxNS43OCA1LjA4MyAxNS43OCA2LjE0NyBMIDE1Ljc4IDEzLjg1MyBDIDE1Ljc4IDE0LjkxOSAxNC45MTcgMTUuNzggMTMuODUzIDE1Ljc4IEwgMTEuOTI3IDE1Ljc4IEwgMTEuOTI3IDEzLjg1MyBaIiBmaWxsPSIjZmZmIiBzdHlsZT0iIj48L3BhdGg+Cjwvc3ZnPg==",
                blocks: [
                    {
                        opcode: 'blank',
                        text: 'blank array',
                        ...jwArray.Block
                    },
                    {
                        opcode: 'blankLength',
                        text: 'blank array of length [LENGTH]',
                        arguments: {
                            LENGTH: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'fromList',
                        text: 'array from list [LIST]',
                        arguments: {
                            LIST: {
                                menu: "list"
                            }
                        },
                        hideFromPalette: true, //doesn't work for some reason
                        ...jwArray.Block
                    },
                    {
                        opcode: 'parse',
                        text: 'parse [INPUT] as array',
                        arguments: {
                            INPUT: {
                                type: ArgumentType.STRING,
                                defaultValue: '["a", "b", "c"]',
                                exemptFromNormalization: true,
                                compilerInfo: {
                                    jwArrayUnmodified: true
                                }
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'split',
                        text: 'split [STRING] by [DIVIDER]',
                        arguments: {
                            STRING: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                            DIVIDER: {
                                type: ArgumentType.STRING
                            }
                        },
                        ...jwArray.Block
                    },
                    "---",
                    {
                        opcode: 'builder',
                        text: 'array builder [SHADOW]',
                        // PenguinMod's `branches: [{}]` on a reporter; branchCount adds the same SUBSTACK input
                        branchCount: 1,
                        arguments: {
                            SHADOW: {
                                // PenguinMod-only: fillIn (a draggable "current array" in the slot); the slot is empty
                                // and "current array" is shown in the palette instead
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'builderCurrent',
                        text: 'current array',
                        hideFromPalette: false, // PenguinMod-only: fillIn, see builder
                        canDragDuplicate: true,
                        ...jwArray.Block
                    },
                    {
                        opcode: 'builderAppend',
                        text: 'append [VALUE] to builder',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true,
                                compilerInfo: {
                                    jwArrayUnmodified: true
                                }
                            }
                        }
                    },
                    {
                        opcode: 'builderSet',
                        text: 'set builder to [ARRAY]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            ARRAY: jwArray.Argument
                        }
                    },
                    "---",
                    {
                        opcode: 'get',
                        text: 'get [INDEX] in [ARRAY]',
                        blockType: BlockType.REPORTER,
                        allowDropAnywhere: true,
                        arguments: {
                            ARRAY: jwArray.Argument,
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'items',
                        text: 'items [X] to [Y] in [ARRAY]',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 3
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'index',
                        text: 'index of [VALUE] in [ARRAY]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            ARRAY: jwArray.Argument,
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true,
                                compilerInfo: {
                                    jwArrayUnmodified: true
                                }
                            }
                        }
                    },
                    {
                        opcode: 'has',
                        text: '[ARRAY] has [VALUE]',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            ARRAY: jwArray.Argument,
                            VALUE: {
                                type: ArgumentType.STRING,
                                exemptFromNormalization: true,
                                compilerInfo: {
                                    jwArrayUnmodified: true
                                }
                            }
                        }
                    },
                    {
                        opcode: 'length',
                        text: 'length of [ARRAY]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            ARRAY: jwArray.Argument
                        }
                    },
                    "---",
                    {
                        opcode: 'set',
                        text: 'set [INDEX] in [ARRAY] to [VALUE]',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true,
                                compilerInfo: {
                                    jwArrayUnmodified: true
                                }
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'append',
                        text: 'append [VALUE] to [ARRAY]',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true,
                                compilerInfo: {
                                    jwArrayUnmodified: true
                                }
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'concat',
                        text: 'merge [ONE] with [TWO]',
                        arguments: {
                            ONE: jwArray.Argument,
                            TWO: jwArray.Argument
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'fill',
                        text: 'fill [ARRAY] with [VALUE]',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true,
                                compilerInfo: {
                                    jwArrayUnmodified: true
                                }
                            }
                        },
                        ...jwArray.Block
                    },
                    "---",
                    {
                        opcode: 'reverse',
                        text: 'reverse [ARRAY]',
                        arguments: {
                            ARRAY: jwArray.Argument
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'splice',
                        text: 'splice [ARRAY] at [INDEX] with [ITEMS] items',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            ITEMS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'repeat',
                        text: 'repeat [ARRAY] [TIMES] times',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            TIMES: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        },
                        ...jwArray.Block
                    },
                    {
                        opcode: 'flat',
                        text: 'flat [ARRAY] with depth [DEPTH]',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            DEPTH: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...jwArray.Block
                    },
                    "---",
                    {
                        opcode: 'toString',
                        text: 'stringify [ARRAY] [FORMAT]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            ARRAY: jwArray.Argument,
                            FORMAT: {
                                menu: "stringifyFormat",
                                defaultValue: "compact"
                            }
                        }
                    },
                    {
                        opcode: 'join',
                        text: 'join [ARRAY] with [DIVIDER]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            ARRAY: jwArray.Argument,
                            DIVIDER: {
                                type: ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: 'sum',
                        text: 'sum of [ARRAY]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            ARRAY: jwArray.Argument
                        }
                    },
                    "---",
                    {
                        opcode: 'forEachI',
                        text: 'index',
                        blockType: BlockType.REPORTER,
                        hideFromPalette: false, // PenguinMod-only: fillIn, see forEach
                        canDragDuplicate: true
                    },
                    {
                        opcode: 'forEachV',
                        text: 'value',
                        blockType: BlockType.REPORTER,
                        hideFromPalette: false, // PenguinMod-only: fillIn, see forEach
                        allowDropAnywhere: true,
                        canDragDuplicate: true
                    },
                    {
                        opcode: 'forEach',
                        text: 'for [I] [V] of [ARRAY]',
                        blockType: BlockType.LOOP,
                        arguments: {
                            ARRAY: jwArray.Argument,
                            // PenguinMod-only: fillIn; the slots are empty, "index" and "value" are in the palette
                            I: {},
                            V: {}
                        }
                    },
                    {
                        opcode: 'basicSort',
                        text: 'sort [ARRAY] [I] [V] > [VALUE]',
                        arguments: {
                            ARRAY: jwArray.Argument,
                            I: {},
                            V: {},
                            VALUE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...jwArray.Block
                    },
                    "---",
                    {
                        opcode: 'validate',
                        text: 'is [INPUT] a valid array?',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            INPUT: {
                                type: ArgumentType.STRING,
                                defaultValue: '["a", "b", "c"]',
                                exemptFromNormalization: true
                            }
                        }
                    },
                ],
                menus: {
                    list: {
                        // PenguinMod-only: variableType "list" menus; a list-name menu instead
                        acceptReporters: false,
                        items: 'getListMenu'
                    },
                    stringifyFormat: {
                        acceptReporters: false,
                        items: [
                            "compact",
                            "pretty"
                        ]
                    }
                }
            };
        }

        getListMenu() {
            const target = vm.editingTarget
            const lists = target ? target.getAllVariableNamesInScopeByType("list") : []
            return lists.length ? lists : [""]
        }

        blank() {
            return new jwArray.Type([], true)
        }

        blankLength({LENGTH}) {
            LENGTH = clampIndex(Cast.toNumber(LENGTH))

            return new jwArray.Type(Array(LENGTH).fill(null), true)
        }

        fromList({LIST}, util) {
            const list = util.target.lookupVariableByNameAndType(Cast.toString(LIST), "list")
            return jwArray.Type.toArray(list ? list.value : LIST)
        }

        parse({INPUT}) {
            return jwArray.Type.toArray(INPUT)
        }

        split({STRING, DIVIDER}) {
            STRING = Cast.toString(STRING)
            DIVIDER = Cast.toString(DIVIDER)

            return new jwArray.Type(STRING.split(DIVIDER), true)
        }

        builder(args, util) {
            const id = currentBlockId(util)
            const blocks = findBlocks(util, id)
            const substack = blocks && blocks.getBlock(id).inputs.SUBSTACK?.block
            const bi = (util.thread._jwArrayBuilderIndex ??= [])
            bi.push([])
            const run = substack ? runInline(util, blocks, substack, false) : undefined
            return after(run, returned => {
                const built = bi.pop()
                // a "return" inside the builder makes that the result, like PenguinMod's compiled builder
                return jwArray.Type.toArray(returned === undefined ? built : returned)
            })
        }

        builderCurrent({}, util) {
            let bi = util.thread._jwArrayBuilderIndex ?? []
            return bi[bi.length-1] ? new jwArray.Type(bi[bi.length-1]) : new jwArray.Type([], true)
        }

        builderAppend({VALUE}, util) {
            let bi = util.thread._jwArrayBuilderIndex ?? []
            if (bi[bi.length-1]) {
                bi[bi.length-1].push(VALUE)
            }
        }

        builderSet({ARRAY}, util) {
            ARRAY = jwArray.Type.toArray(ARRAY)
            let bi = util.thread._jwArrayBuilderIndex ?? []
            if (bi[bi.length-1]) {
                bi[bi.length-1] = [...ARRAY.array]
            }
        }

        get({ARRAY, INDEX}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)

            return jwArray.Type.forArray(ARRAY.array[Cast.toNumber(INDEX)-1] === undefined ? "" : ARRAY.array[Cast.toNumber(INDEX)-1])
        }

        index({ARRAY, VALUE}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)

            return ARRAY.array.map(v => Cast.toString(v)).indexOf(Cast.toString(VALUE)) + 1
        }

        has({ARRAY, VALUE}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)

            return ARRAY.array.map(v => Cast.toString(v)).includes(Cast.toString(VALUE))
        }

        length({ARRAY}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)

            return ARRAY.length
        }

        set({ARRAY, INDEX, VALUE}) {
            ARRAY = jwArray.Type.toArray(ARRAY)
            INDEX = Cast.toNumber(INDEX)

            ARRAY.array[clampIndex(Cast.toNumber(INDEX)-1)] = jwArray.Type.forArray(VALUE)
            ARRAY.array = [...ARRAY.array] // no sparse arrays
            return ARRAY
        }

        append({ARRAY, VALUE}) {
            ARRAY = jwArray.Type.toArray(ARRAY)

            ARRAY.array.push(jwArray.Type.forArray(VALUE))
            return ARRAY
        }

        concat({ONE, TWO}) {
            ONE = jwArray.Type.toArray(ONE)
            TWO = jwArray.Type.toArray(TWO)

            return new jwArray.Type(ONE.array.concat(TWO.array), true)
        }

        fill({ARRAY, VALUE}) {
            ARRAY = jwArray.Type.toArray(ARRAY)

            ARRAY.array.fill(jwArray.Type.forArray(VALUE))
            return ARRAY
        }

        items({ARRAY, X, Y}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)
            X = clampIndex(Cast.toNumber(X))
            Y = clampIndex(Cast.toNumber(Y))

            return new jwArray.Type(ARRAY.array.slice(X - 1, Y), true)
        }

        splice({ARRAY, INDEX, ITEMS}) {
            ARRAY = jwArray.Type.toArray(ARRAY)
            INDEX = Cast.toNumber(INDEX)
            ITEMS = Cast.toNumber(ITEMS)

            ARRAY.array.splice(INDEX - 1, ITEMS)
            return ARRAY
        }

        repeat({ARRAY, TIMES}) {
            TIMES = clampIndex(Cast.toNumber(TIMES))
            if (TIMES === 0) return new jwArray.Type([], true)
            ARRAY = jwArray.Type.toArray(ARRAY, true)
            if (TIMES === 1 || ARRAY.array.length == 0) return ARRAY
            return new jwArray.Type(Array(TIMES).fill(ARRAY.array).flat(), true)
        }

        reverse({ARRAY}) {
            ARRAY = jwArray.Type.toArray(ARRAY)

            ARRAY.array.reverse()
            return ARRAY
        }

        flat({ARRAY, DEPTH}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)
            DEPTH = Cast.toNumber(DEPTH)

            return ARRAY.flat(DEPTH)
        }

        toString({ARRAY, FORMAT}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)

            return ARRAY.toString(FORMAT === "pretty")
        }

        join({ARRAY, DIVIDER}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)
            DIVIDER = Cast.toString(DIVIDER)

            return ARRAY.array.map(v => Cast.toString(v)).join(DIVIDER)
        }

        sum({ARRAY}) {
            ARRAY = jwArray.Type.toArray(ARRAY, true)

            return ARRAY.array.reduce((o, v) => o + Cast.toNumber(v), 0)
        }

        forEachI({}, util) {
            return (util.thread._jwArrayForEach && util.thread._jwArrayForEach[util.thread._jwArrayForEach.length-1]) ? util.thread._jwArrayForEach[util.thread._jwArrayForEach.length-1][0] : 0
        }

        forEachV({}, util) {
            return (util.thread._jwArrayForEach && util.thread._jwArrayForEach[util.thread._jwArrayForEach.length-1]) ? util.thread._jwArrayForEach[util.thread._jwArrayForEach.length-1][1] : ""
        }

        forEach({ARRAY}, util) {
            // LOOP block: called again after each pass of the branch; the array is read once, on the first call
            const frame = util.stackFrame
            const stack = (util.thread._jwArrayForEach ??= [])
            if (!frame.jwArray) {
                frame.jwArray = jwArray.Type.toArray(ARRAY, true).array
                frame.jwIndex = 0
                frame.jwSlot = stack.push([]) - 1
            }
            if (frame.jwIndex < frame.jwArray.length) {
                stack[frame.jwSlot] = [frame.jwIndex + 1, frame.jwArray[frame.jwIndex]]
                frame.jwIndex++
                util.startBranch(1, true)
            } else {
                stack.pop()
            }
        }

        basicSort({ARRAY, VALUE}, util) {
            // PenguinMod re-evaluates VALUE for every item; this re-runs the VALUE reporter the same way
            const valueBlock = inputBlockId(util, "VALUE")
            const blocks = valueBlock && findBlocks(util, valueBlock)
            const stack = (util.thread._jwArrayForEach ??= [])
            const slot = stack.push([]) - 1
            const og = jwArray.Type.toArray(ARRAY, true).array
            const out = []
            const next = (i) => {
                for (; i < og.length; i++) {
                    stack[slot] = [i + 1, og[i]]
                    const value = blocks ? runInline(util, blocks, valueBlock, true) : VALUE
                    if (value instanceof Promise) {
                        const index = i
                        return value.then(v => { out.push([index, Cast.toNumber(v)]); return next(index + 1) })
                    }
                    out.push([i, Cast.toNumber(value)])
                }
                stack.pop()
                out.sort((a, b) => a[1] - b[1])
                return new jwArray.Type(out.map(v => og[v[0]]))
            }
            return next(0)
        }

        validate({INPUT}) {
            return jwArray.Type.validArray(INPUT);
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
