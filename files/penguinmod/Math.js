// Name: Math
// ID: blockly2math
// Description: Blockly-style math reporters: operations, functions, constants and number checks.
// By: PenguinMod team
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/blockly-2
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Math must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const formatMessage = (m) => typeof m === "string" ? m : m.default;

// const Cast = require('../../util/cast');

//const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAMAAAD6TlWYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAP+xNQDiGgCU/wAAAJEQGGoAAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOwwAADsMBx2+oZAAABA5JREFUeF7t0EtuW0EUA9F8vP81Z8JRAwzbLuk5COoMBb1LdP34EGJAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEHos4M+HZfbtDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0KPBfxfGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEZsBfh/z8z/r9SfnsywwIGRAyIGRAyICQASEDQp8OeMrfvk06vEzOXjPgIWevGfCQs9cMeMjZawY85Ow1Ax5y9poBDzl7zYCHnL2GA57y2dvlvW+TmcmARWYmAxaZmQxYZGYyYJGZyYBFZiYDFpmZDFhkZnp5wFPOvFze+TaZmQxYZGYyYJGZyYBFZiYDFpmZDFhkZjJgkZnJgEVmprcHPOXsl+V9j8lsZcAhs5UBh8xWBhwyWxlwyGxlwCGzlQGHzFYGHDJbPR7wlJlreddjMlsZcMhsZcAhs5UBh8xWBhwyWxlwyGxlwCGzlQGHzFbfHvCU2SrvekxmKwMOma0MOGS2MuCQ2cqAQ2YrAw6ZrQw4ZLYy4JDZyoBDZisDDpmtDDhktjLgkNnKgENmKwMOma0MOGS2MuCQ2erbA2bmWt71mMxWBhwyWxlwyGxlwCGzlQGHzFYGHDJbGXDIbGXAIbPV4wFz9svyrsdktjLgkNnKgENmKwMOma0MOGS2MuCQ2cqAQ2YrAw6Zrd4eMGdeLu97m8xMBiwyMxmwyMxkwCIzkwGLzEwGLDIzGbDIzGTAIjPTywPms7fLO98mM5MBi8xMBiwyMxmwyMxkwCIzkwGLzEwGLDIzGbDIzIQD5m/fJu99mZy9ZsBDzl4z4CFnrxnwkLPXDHjI2WsGPOTsNQMecvaaAQ85e+3TAfPzPysdruWzLzMgZEDIgJABIQNCBoQMCM2A+jsDQgaEDAgZEDIgZEDIgJABIQNCBoQMCBkQMiBkQMiAkAEhA0IGhAwIGRAyIGRAyICQASEDQgaEDAgZEDIgZEDIgMjHxx+IPExM0h8siAAAAABJRU5ErkJggg=="

/**
 * Class for Blocky2 blocks
 * @constructor
 */
class Blockly2Math {
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
            id: 'blockly2math',
            name: 'Math',
            //blockIconURI: blockIconURI,
            color1: '#5b67a5',
            color2: '#444d7c',
            blocks: [
                {
                    opcode: 'Number',
                    text: formatMessage({
                        id: 'blockly2math.blocks.Number',
                        default: '[NUMBER]',
                        description: 'Define a number'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 123
                        }
                    }
                },
                {
                    opcode: 'Operation',
                    text: formatMessage({
                        id: 'blockly2math.blocks.Operation',
                        default: '[ONE][OP][TWO]',
                        description: 'Perform a basic math operation'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        OP: {
                            type: ArgumentType.STRING,
                            defaultValue: "+",
                            menu: "Operation"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'AdvancedOperation',
                    text: formatMessage({
                        id: 'blockly2math.blocks.AdvancedOperation',
                        default: '[OP][ONE]',
                        description: 'Perform a advanced math operation'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        OP: {
                            type: ArgumentType.STRING,
                            defaultValue: "square root",
                            menu: "AdvancedOperation"
                        },
                    }
                },
                {
                    opcode: 'Function',
                    text: formatMessage({
                        id: 'blockly2math.blocks.Function',
                        default: '[OP][ONE]',
                        description: 'Perform a math function'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        OP: {
                            type: ArgumentType.STRING,
                            defaultValue: "sin",
                            menu: "Function"
                        },
                    }
                },
                {
                    opcode: 'Constant',
                    text: formatMessage({
                        id: 'blockly2math.blocks.Constant',
                        default: '[CONST]',
                        description: 'Retrieve a constant'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CONST: {
                            type: ArgumentType.STRING,
                            defaultValue: "π",
                            menu: "Constant"
                        },
                    }
                },
                {
                    opcode: 'IsOption',
                    text: formatMessage({
                        id: 'blockly2math.blocks.IsOption',
                        default: '[ONE] is [OPTION]?',
                        description: 'Check if number match condition'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        OPTION: {
                            type: ArgumentType.STRING,
                            defaultValue: "even",
                            menu: "IsOption"
                        },
                    }
                },
                {
                    opcode: 'IsOption2',
                    text: formatMessage({
                        id: 'blockly2math.blocks.IsOption2',
                        default: '[ONE] is [OPTION] [TWO]?',
                        description: 'Check if numbers match condition'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        OPTION: {
                            type: ArgumentType.STRING,
                            defaultValue: "even",
                            menu: "IsOption2"
                        },
                    }
                },
            ],
            menus: {
                Operation: [
                    "+",
                    "-",
                    "×",
                    "÷",
                    "^"
                ],
                AdvancedOperation: [
                    "square root",
                    "absolute",
                    "-",
                    "ln",
                    "log10",
                    "e^",
                    "10^"
                ],
                Function: [
                    "sin",
                    "cos",
                    "tan",
                    "asin",
                    "acos",
                    "atan"
                ],
                Constant: [
                    "π",
                    "e",
                    "φ",
                    "sqrt(2)",
                    "sqrt(½)",
                    "∞"
                ],
                IsOption: [
                    "even",
                    "odd",
                    "prime",
                    "whole",
                    "positive",
                    "negative",
                ],
                IsOption2: [
                    "divisible by"
                ]
            }
        };
    }

    Number(args, util) {
        return Number(args.NUMBER)
    }

    Operation(args, util) {
        switch (String(args.OP)) {
            case "+": return Number(args.ONE) + Number(args.TWO)
            case "-": return Number(args.ONE) - Number(args.TWO)
            case "×": return Number(args.ONE) * Number(args.TWO)
            case "÷": return Number(args.ONE) / Number(args.TWO)
            case "^": return Number(args.ONE) ** Number(args.TWO)
            default: return Number(args.ONE)
        } 
    }
    
    AdvancedOperation(args, util) {
        switch (String(args.OP)) {
            case "square root": return Math.sqrt(Number(args.ONE))
            case "absolute": return Math.abs(Number(args.ONE))
            case "-": return 0 - Number(args.ONE)
            case "ln": return Math.log(Number(args.ONE))
            case "log10": return Math.log10(Number(args.ONE))
            case "e^": return Math.exp(Number(args.ONE))
            case "10^": return Math.pow(10, Number(args.ONE))
            default: return Number(args.ONE)
        }
    }
    
    Function(args, util) {
        switch (String(args.OP)) {
            case "sin": return Math.sin(Number(args.ONE) / 180 * Math.PI)
            case "tan": return Math.tan(Number(args.ONE) / 180 * Math.PI)
            case "cos": return Math.cos(Number(args.ONE) / 180 * Math.PI)
            case "asin": return Math.asin(Number(args.ONE)) / Math.PI * 180
            case "atan": return Math.atan(Number(args.ONE)) / Math.PI * 180
            case "acos": return Math.acos(Number(args.ONE)) / Math.PI * 180
            default: return Number(args.ONE)
        }
    }

    Constant(args, util) {
        switch (String(args.CONST)) {
            case "π": return Math.PI
            case "e": return Math.E
            case "φ": return (1 + Math.sqrt(5)) / 2
            case "sqrt(2)": return Math.SQRT2
            case "sqrt(½)": return Math.SQRT1_2
            case "∞": return Infinity
            default: return 0
        }
    }

    IsOption(args, util) {
        switch (String(args.OPTION)) {
            case "even": return Number(args.ONE) % 2 == 0
            case "odd": return Number(args.ONE) % 2 == 1
            case "prime": return this._isprime(Number(args.ONE))
            case "whole": return Number(args.ONE) % 1 == 0
            case "positive": return Number(args.ONE) > 0
            case "negative": return Number(args.ONE) < 0
            default: return false
        }
    }

    IsOption2(args, util) {
        switch (String(args.OPTION)) {
            case "divisible by": return Number(args.ONE) % Number(args.TWO) == 0
            default: return false
        }
    }

    _isprime(n) {
        if (n == 2 || n == 3) {
            return true;
        }

        if (isNaN(n) || n <= 1 || n % 1 !== 0 || n % 2 === 0 || n % 3 === 0) {
            return false;
        }

        for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {
            if (n % (x - 1) === 0 || n % (x + 1) === 0) {
                return false;
            }
        }
        return true;
    }
}

Scratch.extensions.register(new Blockly2Math());
})(Scratch);
