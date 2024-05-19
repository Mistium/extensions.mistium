// remaking this for turbowarp

/**
 * Class
 * @constructor
 */

(function(Scratch) {
  "use strict";

class tempVars {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {runtime}
         */
        this.runtime = runtime;
    }

    getThreadVars (thread) {
        if (!thread.tempVars) {
            thread.tempVars = Object.create(null);
        }
        return thread.tempVars;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'tempVars',
            name: 'Temporary Variables',
            color1: '#0069c2',
            color2: '#0060B4',
            color3: '#0060B4',
            blocks: [
                {
                    opcode: 'setVariable',
                    text: 'set [name] to [value]',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Variable'
                        },
                        value: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Value'
                        }
                    },
                    blockType: Scratch.BlockType.COMMAND
                },
                {
                    opcode: 'changeVariable',
                    text: 'change [name] by [value]',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Variable'
                        },
                        value: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '1'
                        }
                    },
                    blockType: Scratch.BlockType.COMMAND
                },
                {
                    opcode: 'getVariable',
                    text: 'get [name]',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Variable'
                        }
                    },
                    allowDropAnywhere: true,
                    blockType: Scratch.BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'deleteVariable',
                    text: 'delete [name]',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Variable'
                        }
                    },
                    blockType: Scratch.BlockType.COMMAND
                },
                {
                    opcode: 'deleteAllVariables',
                    text: 'delete all variables',
                    blockType: Scratch.BlockType.COMMAND
                },
                {
                    opcode: 'variableExists',
                    text: 'variable [name] exists?',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Variable'
                        }
                    },
                    disableMonitor: true,
                    blockType: Scratch.BlockType.BOOLEAN
                },
                {
                    opcode: 'allVariables',
                    text: 'current variables',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Variable'
                        }
                    },
                    disableMonitor: true,
                    blockType: Scratch.BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'forEachTempVar',
                    text: 'for each [NAME] in [REPEAT]',
                    branchCount: 1,
                    blockType: Scratch.BlockType.LOOP,
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Variable'
                        },
                        REPEAT: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                }
            ]
        };
    }
    /**
     * This function is used for any compiled blocks in the extension if they exist.
     * Data in this function is given to the IR & JS generators.
     * Data must be valid otherwise errors may occur.
     * @returns {object} functions that create data for compiled blocks.
     * @deprecated nolonger in use as all of this is now inside the compiler
     */
    getCompileInfoOld() {
        return {
            ir: {
                forEachTempVar: (generator, block) => {
                    generator.analyzeLoop();
                    return {
                        kind: 'stack',
                        name: generator.descendInputOfBlock(block, 'NAME'),
                        repeat: generator.descendInputOfBlock(block, 'REPEAT'),
                        do: generator.descendSubstack(block, 'SUBSTACK')
                    };
                }
            },
            js: {
                forEachTempVar: (node, compiler, imports) => {
                    const index = compiler.localVariables.next();
                    const name = compiler.localVariables.next();
                    const inputName = compiler.descendInput(node.name).asString();
                    const realName = `('threadVar_' + ${inputName})`;
                    compiler.source += `var ${index} = 0; `;
                    compiler.source += `var ${name} = ${realName}; `;
                    compiler.source += `while (${index} < ${compiler.descendInput(node.repeat).asNumber()}) { `;
                    compiler.source += `${index}++; `;
                    compiler.source += `if (!thread.tempVars) { `;
                    compiler.source += `thread.tempVars = {}; `;
                    compiler.source += `}\n`;
                    compiler.source += `thread.tempVars[${name}] = ${index};\n`;
                    compiler.descendStack(node.do, new imports.Frame(true));
                    compiler.yieldLoop();
                    compiler.source += '}\n';
                }
            }
        }
    }

    setVariable({name,value}, util) {
        const tempVars = this.getThreadVars(util.thread);
        name = `threadVar_${name}`;
        tempVars[name] = value;
    }

    changeVariable({name,value}, util) {
        const tempVars = this.getThreadVars(util.thread);
        name = `threadVar_${name}`;
        const oldNum = Number(tempVars[name]);
        const newNum = oldNum + value;
        if (!oldNum) {
            tempVars[name] = Number(value);
            return;
        }
        tempVars[name] = newNum;
    }

    getVariable({name}, util) {
        const tempVars = this.getThreadVars(util.thread);
        name = `threadVar_${name}`;
        const value = tempVars[name];
        if (!value) return '';
        return value;
    }

    deleteVariable({name}, util) {
        const tempVars = this.getThreadVars(util.thread);
        name = `threadVar_${name}`;
        if (!(name in tempVars)) return;
        delete tempVars[name];
    }
    
    deleteAllVariables({_}, util) {
        // resets the vars
        util.thread.tempVars = Object.create(null);
    }
    
    variableExists ({args}, util) {
        const tempVars = this.getThreadVars(util.thread);
        const name = `threadVar_${args.name}`;
        return (name in tempVars);
    }

    allVariables ({_}, util) {
        const tempVars = this.getThreadVars(util.thread);
        const keys = Object.keys(tempVars);
        const mapped = keys.map(name => name.replace('threadVar_', ''));
        return JSON.stringify(mapped);
    }

    forEachTempVar ({args}, util) {
        // compiled blocks need an interpreter version
        // for edge activated hats
        const count = Cast.toNumber(args.REPEAT);
        const name = Cast.toString(args.NAME);
        // Initialize loop
        if (typeof util.stackFrame.loopCounter === 'undefined') {
            util.stackFrame.loopCounter = count;
        }
        // Only execute once per frame.
        // When the branch finishes, `repeat` will be executed again and
        // the second branch will be taken, yielding for the rest of the frame.
        // Decrease counter
        util.stackFrame.loopCounter--;
        // If we still have some left, start the branch.
        if (util.stackFrame.loopCounter >= 0) {
            const i = (count - (util.stackFrame.loopCounter)) - 1;
            this.setVariable({ name: name, value: i + 1 }, util);
            util.startBranch(1, true);
        }
    }
}
  Scratch.extensions.register(new tempVars());
})(Scratch);
