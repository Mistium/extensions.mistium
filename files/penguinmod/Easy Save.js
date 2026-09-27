// Name: Easy Save
// ID: jgEasySave
// Description: Unfinished: pick variables and lists to save.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_easySave
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Easy Save must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const formatMessage = (m) => typeof m === "string" ? m : m.default;

/**
 * Class for EasySave blocks
 * @constructor
 */
class jgEasySaveBlocks {
    constructor() {
        const runtime = Scratch.vm.runtime;
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgEasySave',
            name: 'Easy Save',
            color1: '#48a3d4',
            color2: '#3d89b3',
            blocks: [
                {
                    blockType: BlockType.LABEL,
                    text: "Saving"
                },
                {
                    opcode: 'addVarToSave',
                    text: 'add value of variable [VAR] to save',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VAR: {
                            menu: "variable"
                        }
                    }
                },
                {
                    opcode: 'addListToSave',
                    text: 'add value of list [LIST] to save',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LIST: {
                            menu: "list"
                        }
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Loading"
                },
            ],
            menus: {
                variable: {
                    acceptReporters: false,
                    items: "getVariables",
                },
                list: {
                    acceptReporters: false,
                    items: "getLists",
                },
            }
        };
    }

    getVariables() {
        const variables =
            // @ts-expect-error
            typeof Blockly === "undefined"
                ? []
                : // @ts-expect-error
                Blockly.getMainWorkspace()
                    .getVariableMap()
                    .getVariablesOfType("")
                    .map((model) => ({
                        text: model.name,
                        value: model.getId(),
                    }));
        if (variables.length > 0) {
            return variables;
        } else {
            return [{ text: "", value: "" }];
        }
    }
    getLists() {
        // using blockly causes unstable behavior
        // https://discord.com/channels/1033551490331197462/1038251742439149661/1202846831994863627
        const globalLists = Object.values(this.runtime.getTargetForStage().variables)
            .filter((x) => x.type == "list");
        const localLists = Object.values(Scratch.vm.editingTarget.variables)
            .filter((x) => x.type == "list");
        const uniqueLists = [...new Set([...globalLists, ...localLists])];
        if (uniqueLists.length === 0) return [{ text: "", value: "" }];
        return uniqueLists.map((i) => ({ text: i.name, value: i.id }));
    }

    addVarToSave(args, util) {
        const variable = util.target.lookupVariableById(args.VAR);
        console.log(variable);
    }
    addListToSave(args, util) {
        console.log(args.LIST);
        const variable = util.target.lookupVariableById(args.LIST);
        console.log(variable);
    }
}

Scratch.extensions.register(new jgEasySaveBlocks());
})(Scratch);
