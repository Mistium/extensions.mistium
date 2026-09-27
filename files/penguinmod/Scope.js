// Name: Scope
// ID: jwScope
// Description: Scoped variables that only exist inside the script or C-block branch they were set in.
// By: jwklong
// Needs: Array (jwArray) for "current scope" and "all scopes"
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jwScope
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Scope must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const vm = Scratch.vm;
    const shape = (name) => Scratch.BlockShape?.[name] ?? Scratch.BlockShape?.SQUARE;

    // PenguinMod patches the compiler so every script and every branch gets a new scope level.
    // Without compiler patches the levels come from where the block sits: the script's top block and the first block
    // of each branch (SUBSTACK input) around it each own one level, stored per thread (a new run starts empty).
    // ponytail: a level is kept for the whole run, not recreated on each loop pass or custom block call
    // like PenguinMod does; that needs per-iteration hooks the VM doesn't expose.
    const currentBlockId = (util) => util.thread.peekStackFrame()?.op?.id ?? util.thread.peekStack();
    const scopeOf = (util) => {
        const levels = (util.thread._jwScope ??= new Map()); // _jw* state is shared with Lambda/Arrays inline threads
        const id = currentBlockId(util);
        const blocks = [util.thread.blockContainer, util.target.blocks, vm.runtime.flyoutBlocks]
            .find(b => b && b.getBlock(id));
        const keys = [];
        let block = blocks && blocks.getBlock(id);
        while (block) {
            const parent = block.parent && blocks.getBlock(block.parent);
            if (!parent) {
                keys.push(block.id);
                break;
            }
            const id = block.id;
            if (Object.keys(parent.inputs).some(name => name.startsWith("SUBSTACK") && parent.inputs[name].block === id)) keys.push(id);
            block = parent;
        }
        if (!keys.length) keys.push("");
        return keys.reverse().map(key => {
            if (!levels.has(key)) levels.set(key, Object.create(null));
            return levels.get(key);
        });
    };

    const jwScope = {
        create(array, name) {
            array[array.length-1][name] ??= null
        },

        delete(array, name) {
            for (let i = array.length-1; i >= 0; i--) {
                if (name in array[i]) {
                    delete array[i][name]
                    return
                }
            }
        },

        set(array, name, value) {
            for (let i = array.length-1; i >= 0; i--) {
                if (name in array[i]) {
                    array[i][name] = value
                    return
                }
            }
            array[array.length-1][name] = value
        },

        change(array, name, value) {
            for (let i = array.length-1; i >= 0; i--) {
                if (name in array[i]) {
                    array[i][name] = Cast.toNumber(array[i][name]) + value
                    return
                }
            }
            array[array.length-1][name] = value
        },

        get(array, name) {
            for (let i = array.length-1; i >= 0; i--) {
                if (name in array[i]) {
                    return array[i][name]
                }
            }
            return null
        },

        has(array, name) {
            for (let i = array.length-1; i >= 0; i--) {
                if (name in array[i]) {
                    return true
                }
            }
            return false
        },

        reset(array) {
            // the levels are shared objects here, so they are emptied instead of replaced
            for (let i = array.length-1; i >= 0; i--) {
                for (const key in array[i]) delete array[i][key];
            }
        },

        depth(array) {
            return array.length
        },

        current(array) {
            let set = new Set()
            for (let i = 0; i < array.length; i++) {
                Object.keys(array[i]).forEach(v => {set.delete(v); set.add(v)})
            }
            return new vm.jwArray.Type(Array.from(set))
        },

        all(array) {
            return new vm.jwArray.Type(array.map(v => Object.keys(v)).filter(v => v.length > 0).map(v => new vm.jwArray.Type(v)))
        }
    }

    class Extension {
        constructor() {
            // PenguinMod-only: the JSGenerator compile/descendStack patches are replaced by scopeOf above
            vm.jwScope = jwScope
            // show "current scope"/"all scopes" once Arrays is added later
            vm.runtime.on("EXTENSION_ADDED", info => {
                if (info.id === "jwArray") Promise.resolve(vm.extensionManager.refreshBlocks("jwScope")).catch(() => {})
            })
        }

        getInfo() {
            return {
                id: "jwScope",
                name: "Scope",
                color1: "#4f85f3",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+CiAgPGVsbGlwc2Ugc3R5bGU9InN0cm9rZS1saW5lam9pbjogcm91bmQ7IHBhaW50LW9yZGVyOiBmaWxsOyBzdHJva2U6IHJnYig3MSwgMTE5LCAyMTkpOyBmaWxsOiByZ2IoNzksIDEzMywgMjQzKTsiIGN4PSIxMCIgY3k9IjEwIiByeD0iOS41IiByeT0iOS41Ij48L2VsbGlwc2U+CiAgPHJlY3Qgc3R5bGU9InBhaW50LW9yZGVyOiBzdHJva2U7IGZpbGw6IG5vbmU7IHN0cm9rZTogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyBzdHJva2Utd2lkdGg6IDJweDsiIHg9IjUiIHk9IjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcng9IjMiIHJ5PSIzIj48L3JlY3Q+Cjwvc3ZnPg==",
                docsURI: 'https://docs.penguinmod.com/extensions/jwScope/',
                blocks: [
                    {
                        opcode: "set",
                        blockType: BlockType.COMMAND,
                        text: "set [NAME] to [VALUE]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "var",
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: "apple",
                                exemptFromNormalization: true
                            }
                        },
                    },
                    {
                        opcode: "change",
                        blockType: BlockType.COMMAND,
                        text: "change [NAME] by [VALUE]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "var",
                            },
                            VALUE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: "1"
                            }
                        },
                    },
                    "---",
                    {
                        opcode: "get",
                        blockType: BlockType.REPORTER,
                        text: "get [NAME]",
                        allowDropAnywhere: true,
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "var"
                            }
                        },
                    },
                    {
                        opcode: "has",
                        blockType: BlockType.BOOLEAN,
                        text: "is [NAME] defined?",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "var"
                            }
                        },
                    },
                    "---",
                    {
                        opcode: "create",
                        blockType: BlockType.COMMAND,
                        text: "init [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "var",
                            }
                        },
                    },
                    {
                        opcode: "delete",
                        blockType: BlockType.COMMAND,
                        text: "remove [NAME]",
                        arguments: {
                            NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: "var",
                            }
                        },
                    },
                    {
                        opcode: "reset",
                        blockType: BlockType.COMMAND,
                        text: "reset scope"
                    },
                    "---",
                    {
                        opcode: "depth",
                        blockType: BlockType.REPORTER,
                        text: "depth of scope",
                        disableMonitor: true
                    },
                    "---",
                    {
                        opcode: "current",
                        text: "current scope",
                        hideFromPalette: !vm.jwArray,
                        blockType: BlockType.REPORTER,
                        blockShape: shape("SQUARE"),
                        ...(vm.jwArray ? vm.jwArray.Block : {})
                    },
                    {
                        opcode: "all",
                        text: "all scopes",
                        hideFromPalette: !vm.jwArray,
                        blockType: BlockType.REPORTER,
                        blockShape: shape("SQUARE"),
                        ...(vm.jwArray ? vm.jwArray.Block : {})
                    }
                ]
            };
        }

        create({NAME}, util) {
            jwScope.create(scopeOf(util), Cast.toString(NAME))
        }

        delete({NAME}, util) {
            jwScope.delete(scopeOf(util), Cast.toString(NAME))
        }

        set({NAME, VALUE}, util) {
            jwScope.set(scopeOf(util), Cast.toString(NAME), VALUE)
        }

        change({NAME, VALUE}, util) {
            jwScope.change(scopeOf(util), Cast.toString(NAME), Cast.toNumber(VALUE))
        }

        get({NAME}, util) {
            return jwScope.get(scopeOf(util), Cast.toString(NAME))
        }

        has({NAME}, util) {
            return jwScope.has(scopeOf(util), Cast.toString(NAME))
        }

        reset(args, util) {
            jwScope.reset(scopeOf(util))
        }

        depth(args, util) {
            return jwScope.depth(scopeOf(util))
        }

        current(args, util) {
            return vm.jwArray ? jwScope.current(scopeOf(util)) : 0
        }

        all(args, util) {
            return vm.jwArray ? jwScope.all(scopeOf(util)) : 0
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
