// Name: Clone Communication
// ID: jgClones
// Description: Read and set data and variables between clones and their main sprite.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_clones
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Clone Communication must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const formatMessage = (m) => typeof m === "string" ? m : m.default;


    /**
     * Class for CloneTool blocks
     * @constructor
     */
    class JgCloneToolBlocks {
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
                id: 'jgClones',
                name: 'Clone Communication',
                color1: '#FFAB19',
                color2: '#EC9C13',
                blocks: [
                    {
                        blockType: BlockType.LABEL,
                        text: "Main Sprite Communication"
                    },
                    {
                        opcode: 'getCloneWithVariableSetTo',
                        text: formatMessage({
                            id: 'jgClones.blocks.getCloneWithVariableSetTo',
                            default: 'get [DATA] of clone with [VAR] set to [VALUE]',
                            description: 'Block that returns the value of the item picked within a clone with a variable set to a certain value.'
                        }),
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            DATA: { type: ArgumentType.STRING, menu: 'spriteData' },
                            VAR: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                            VALUE: { type: ArgumentType.STRING, defaultValue: '0' },
                        }
                    },
                    {
                        opcode: 'getCloneVariableWithVariableSetTo',
                        text: formatMessage({
                            id: 'jgClones.blocks.getCloneVariableWithVariableSetTo',
                            default: 'get [VAR1] of clone with [VAR2] set to [VALUE]',
                            description: 'Block that returns the value of the variable picked within a clone with a variable set to a certain value.'
                        }),
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            VAR1: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                            VAR2: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                            VALUE: { type: ArgumentType.STRING, defaultValue: '0' },
                        }
                    },
                    // {
                    //     opcode: 'setValueOnCloneWithVariableSetTo',
                    //     text: formatMessage({
                    //         id: 'jgClones.blocks.setValueOnCloneWithVariableSetTo',
                    //         default: 'set [DATA] to [VALUE1] on clone with [VAR] set to [VALUE2]',
                    //         description: 'Block that sets the value of the item picked within a clone with a variable set to a certain value.'
                    //     }),
                    //     blockType: BlockType.COMMAND,
                    //     arguments: {
                    //         DATA: { type: ArgumentType.STRING, menu: 'spriteData' },
                    //         VALUE1: { type: ArgumentType.STRING, defaultValue: '0' },
                    //         VAR: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                    //         VALUE2: { type: ArgumentType.STRING, defaultValue: '0' },
                    //     }
                    // },
                    {
                        opcode: 'setVariableOnCloneWithVariableSetTo',
                        text: formatMessage({
                            id: 'jgClones.blocks.setVariableOnCloneWithVariableSetTo',
                            default: 'set [VAR1] to [VALUE1] on clone with [VAR2] set to [VALUE2]',
                            description: 'Block that sets a variable within a clone with a variable set to a certain value.'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VAR1: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                            VALUE1: { type: ArgumentType.STRING, defaultValue: '0' },
                            VAR2: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                            VALUE2: { type: ArgumentType.STRING, defaultValue: '0' },
                        }
                    },
                    "---",
                    "---",
                    {
                        blockType: BlockType.LABEL,
                        text: "Clone Communication"
                    },
                    {
                        opcode: 'getMainSpriteData',
                        text: formatMessage({
                            id: 'jgClones.blocks.getMainSpriteData',
                            default: 'get [DATA] of main sprite',
                            description: 'Block that returns the value of the item picked on the main sprite.'
                        }),
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            DATA: { type: ArgumentType.STRING, menu: 'spriteData' }
                        }
                    },
                    {
                        opcode: 'getVariableOnMainSprite',
                        text: formatMessage({
                            id: 'jgClones.blocks.getVariableOnMainSprite',
                            default: 'get [VAR] of main sprite',
                            description: 'Block that returns the value of the variable picked on the main sprite.'
                        }),
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            VAR: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                        }
                    },
                    // {
                    //     opcode: 'setValueOnMainSprite',
                    //     text: formatMessage({
                    //         id: 'jgClones.blocks.setValueOnMainSprite',
                    //         default: 'set [DATA] to [VALUE] on main sprite',
                    //         description: 'Block that sets the value of the item picked within the main sprite.'
                    //     }),
                    //     blockType: BlockType.COMMAND,
                    //     arguments: {
                    //         DATA: { type: ArgumentType.STRING, menu: 'spriteData' },
                    //         VALUE: { type: ArgumentType.STRING, defaultValue: '0' }
                    //     }
                    // },
                    {
                        opcode: 'setVariableOnMainSprite',
                        text: formatMessage({
                            id: 'jgClones.blocks.setVariableOnMainSprite',
                            default: 'set [VAR] to [VALUE] on main sprite',
                            description: 'Block that sets a variable within the main sprite.'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VAR: { type: ArgumentType.STRING, menu: 'spriteVariables' },
                            VALUE: { type: ArgumentType.STRING, defaultValue: '0' }
                        }
                    },
                    "---",
                    "---",
                    {
                        blockType: BlockType.LABEL,
                        text: "Other"
                    },
                    {
                        opcode: 'getIsClone',
                        text: formatMessage({
                            id: 'jgClones.blocks.getIsClone',
                            default: 'is clone?',
                            description: 'Block that returns whether the current sprite is a clone or not.'
                        }),
                        disableMonitor: true,
                        blockType: BlockType.BOOLEAN
                    },
                    {
                        opcode: 'clonesInSprite',
                        text: formatMessage({
                            id: 'jgClones.blocks.clonesInSprite',
                            default: 'clone count of [SPRITE]',
                            description: 'Block that returns the amount of clones of this sprite that currently exist.'
                        }),
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            SPRITE: { type: ArgumentType.STRING, menu: 'sprites' },
                        }
                    }
                ],
                menus: {
                    sprites: "getSpriteMenu",
                    spriteVariables: "getSpriteVariablesMenu",
                    spriteData: {
                        acceptReporters: true,
                        items: [
                            // motion
                            "x position",
                            "y position",
                            "direction",
                            "rotation style",
                            // looks (excluding effects)
                            "visible",
                            "costume number",
                            "costume name",
                            "size",
                            "x stretch",
                            "y stretch",
                            // sound
                            "volume",
                            // sensing
                            "draggable",
                            // music (doesnt seem to work)
                            // "tempo",

                            // effects
                            "color effect",
                            "fisheye effect",
                            "whirl effect",
                            "pixelate effect",
                            "mosaic effect",
                            "brightness effect",
                            "ghost effect",
                            "saturation effect",
                            "red effect",
                            "green effect",
                            "blue effect",
                            "opaque effect",
                        ].map(item => ({ text: item, value: item }))
                    }
                }
            };
        }
        // utilities
        getClones (sprite) {
            // i call this the stair step null check
            if (!sprite.clones) return [];
            const clones = sprite.clones
            return clones.filter(clone => clone.isOriginal === false);
        }
        getTargetBySpriteName (name) {
            const targets = this.runtime.targets;
            const sprites = targets.filter(target => target.isOriginal).filter(target => target.sprite.name == name);
            return sprites[0];
        }
        getTargetClonesByVariableSetToValue (target, variableName, value) {
            const clones = this.getClones(target.sprite);
            const cloneList = clones.filter(clone => {
                const variables = Object.getOwnPropertyNames(clone.variables).map(variableId => {
                    return clone.variables[variableId];
                });
                const variable = variables.filter(variable => variable.name == variableName)[0];
                if (!variable) return false;
                if (String(variable.value) != String(value)) return false;
                return true;
            });
            return cloneList;
        }
        getTargetCloneByVariableSetToValue (target, variableName, value) {
            const clones = this.getTargetClonesByVariableSetToValue(target, variableName, value);
            if (!clones) return;
            return clones[0];
        }
        menuOptionToTargetProperty (option) {
            switch (option) {
                case "x position":
                    return "x";
                case "y position":
                    return "y";
                case "x stretch":
                    return "xStretch";
                case "y stretch":
                    return "yStretch";
                case "rotation style":
                    return "rotationStyle";
                case "costume number":
                    return "currentCostume";
                case "costume name":
                    return "costumeName";
                default:
                    return option;
            }
        }
        getMainSprite (target) {
            if (!target.sprite) return;
            const clones = target.sprite.clones;
            const mainSprites = clones.filter(clone => clone.isOriginal);
            return mainSprites[0];
        }

        // menus
        getSpriteMenu () {
            const targets = this.runtime.targets;
            const emptyMenu = [{ text: "", value: "" }];
            if (!targets) return emptyMenu;
            const menu = targets.filter(target => target.isOriginal && (!target.isStage)).map(target => ({ text: target.sprite.name, value: target.sprite.name }));
            return (menu.length > 0) ? menu : emptyMenu;
        }
        getSpriteVariablesMenu () {
            const target = Scratch.vm.editingTarget;
            const emptyMenu = [{ text: "", value: "" }];
            if (!target) return emptyMenu;
            if (!target.variables) return emptyMenu;
            const menu = Object.getOwnPropertyNames(target.variables).map(variableId => {
                const variable = target.variables[variableId]
                return {
                    text: variable.name,
                    value: variable.name,
                }
            });
            // check if menu has 0 items because pm throws an error if theres no items
            return (menu.length > 0) ? menu : emptyMenu;
        }

        // blocks
        // other blocks
        getIsClone (_, util) {
            return !util.target.isOriginal;
        }
        clonesInSprite (args) {
            const target = this.getTargetBySpriteName(args.SPRITE);
            if (!target) return 0;
            const clones = this.getClones(target.sprite);
            return clones.length;
        }

        // main sprite communication
        getCloneWithVariableSetTo (args, util) {
            const target = util.target;
            const clone = this.getTargetCloneByVariableSetToValue(target, args.VAR, String(args.VALUE));
            if (!clone) return "";
            const property = this.menuOptionToTargetProperty(args.DATA);
            switch (property) {
                case "currentCostume":
                    return clone.currentCostume + 1;
                case "costumeName":
                    return clone.sprite.costumes_[clone.currentCostume].name;
                case "xStretch":
                    return clone.stretch[0];
                case "yStretch":
                    return clone.stretch[1];
                case "color effect":
                    return clone.effects.color;
                case "fisheye effect":
                    return clone.effects.fisheye;
                case "whirl effect":
                    return clone.effects.whirl;
                case "pixelate effect":
                    return clone.effects.pixelate;
                case "mosaic effect":
                    return clone.effects.mosaic;
                case "brightness effect":
                    return clone.effects.brightness;
                case "ghost effect":
                    return clone.effects.ghost;
                case "red effect":
                    return clone.effects.red ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "green effect":
                    return clone.effects.green ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "blue effect":
                    return clone.effects.blue ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "opaque effect":
                    return clone.effects.opaque ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "saturation effect":
                    return clone.effects.saturation ?? 0; // PenguinMod-only effect, 0 elsewhere
                default:
                    return clone[property];
            }
        }
        getCloneVariableWithVariableSetTo (args, util) {
            const target = util.target;
            const clone = this.getTargetCloneByVariableSetToValue(target, args.VAR2, String(args.VALUE));
            if (!clone) return "";
            const variables = {};
            Object.getOwnPropertyNames(clone.variables).forEach(id => {
                variables[clone.variables[id].name] = clone.variables[id].value;
            });
            return variables[args.VAR1];
        }
        setVariableOnCloneWithVariableSetTo (args, util) {
            const target = util.target;
            const clones = this.getTargetClonesByVariableSetToValue(target, args.VAR2, String(args.VALUE2));
            clones.forEach(clone => {
                Object.getOwnPropertyNames(clone.variables).forEach(variableId => {
                    const variable = clone.variables[variableId];
                    if (variable.name !== args.VAR1) return;
                    const value = isNaN(Number(args.VALUE1)) ? String(args.VALUE1) : Number(args.VALUE1);
                    variable.value = value;
                });
            });
        }

        // clone communication
        getMainSpriteData (args, util) {
            const target = util.target;
            const mainSprite = this.getMainSprite(target);
            if (!mainSprite) return "";
            const property = this.menuOptionToTargetProperty(args.DATA);
            switch (property) {
                case "currentCostume":
                    return mainSprite.currentCostume + 1;
                case "costumeName":
                    return mainSprite.sprite.costumes_[mainSprite.currentCostume].name;
                case "xStretch":
                    return mainSprite.stretch[0];
                case "yStretch":
                    return mainSprite.stretch[1];
                case "color effect":
                    return mainSprite.effects.color;
                case "fisheye effect":
                    return mainSprite.effects.fisheye;
                case "whirl effect":
                    return mainSprite.effects.whirl;
                case "pixelate effect":
                    return mainSprite.effects.pixelate;
                case "mosaic effect":
                    return mainSprite.effects.mosaic;
                case "brightness effect":
                    return mainSprite.effects.brightness;
                case "ghost effect":
                    return mainSprite.effects.ghost;
                case "red effect":
                    return mainSprite.effects.red ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "green effect":
                    return mainSprite.effects.green ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "blue effect":
                    return mainSprite.effects.blue ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "opaque effect":
                    return mainSprite.effects.opaque ?? 0; // PenguinMod-only effect, 0 elsewhere
                case "saturation effect":
                    return mainSprite.effects.saturation ?? 0; // PenguinMod-only effect, 0 elsewhere
                default:
                    return mainSprite[property];
            }
        }
        getVariableOnMainSprite(args, util) {
            const target = util.target;
            const mainSprite = this.getMainSprite(target);
            if (!mainSprite) return "";
            const variables = {};
            Object.getOwnPropertyNames(mainSprite.variables).forEach(id => {
                variables[mainSprite.variables[id].name] = mainSprite.variables[id].value;
            });
            return variables[args.VAR];
        }
        setVariableOnMainSprite (args, util) {
            const target = util.target;
            const mainSprite = this.getMainSprite(target);
            Object.getOwnPropertyNames(mainSprite.variables).forEach(variableId => {
                const variable = mainSprite.variables[variableId];
                if (variable.name !== args.VAR) return;
                const value = isNaN(Number(args.VALUE)) ? String(args.VALUE) : Number(args.VALUE);
                variable.value = value;
            });
        }
    }

    Scratch.extensions.register(new JgCloneToolBlocks());
})(Scratch);
