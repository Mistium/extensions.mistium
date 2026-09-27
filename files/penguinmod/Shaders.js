// Name: Shaders
// ID: jgShaders
// Description: Unfinished shader extension; its blocks do nothing (same as in PenguinMod).
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_shaders
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Shaders must run unsandboxed.");

    const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;

    /**
     * Class for Shaders blocks
     * @constructor
     */
    class jgShadersBlocks {
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
                id: 'jgShaders',
                name: 'Shaders',
                blocks: [
                    {
                        opcode: 'enableShader',
                        text: 'enable [SHADER]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            SHADER: {
                                menu: "shaders"
                            }
                        }
                    },
                    {
                        opcode: 'disableShader',
                        text: 'disable [SHADER]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            SHADER: {
                                menu: "shaders"
                            }
                        }
                    },
                ],
                menus: {
                    shaders: {
                        items: [
                            'bloom'
                        ]
                    },
                }
            };
        }

        // these blocks do nothing in PenguinMod either (unfinished extension)
        enableShader(args) {
            const shader = Cast.toString(args.SHADER).toLowerCase();
        }
        disableShader(args) {
            const shader = Cast.toString(args.SHADER).toLowerCase();
        }
    }

    Scratch.extensions.register(new jgShadersBlocks());
})(Scratch);
