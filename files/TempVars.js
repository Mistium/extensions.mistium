(function(Scratch) {
  "use strict";

class TempVars {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getThreadVars(thread) {
        if (!thread.tempVars) {
            thread.tempVars = Object.create(null);
        }
        return thread.tempVars;
    }

    getInfo() {
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
                            defaultValue: 1
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
                    blockType: Scratch.BlockType.BOOLEAN
                },
                {
                    opcode: 'allVariables',
                    text: 'current variables',
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

    setVariable({name, value}, util) {
        const tempVars = this.getThreadVars(util.thread);
        name = `threadVar_${name}`;
        tempVars[name] = value;
    }

    changeVariable({name, value}, util) {
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
        if (value === undefined) return '';
        return value;
    }

    deleteVariable({name}, util) {
        const tempVars = this.getThreadVars(util.thread);
        name = `threadVar_${name}`;
        if (!(name in tempVars)) return;
        delete tempVars[name];
    }

    deleteAllVariables(_, util) {
        util.thread.tempVars = Object.create(null);
    }

    variableExists({name}, util) {
        const tempVars = this.getThreadVars(util.thread);
        const varName = `threadVar_${name}`;
        return (varName in tempVars);
    }

    allVariables(_, util) {
        const tempVars = this.getThreadVars(util.thread);
        const keys = Object.keys(tempVars);
        const mapped = keys.map(name => name.replace('threadVar_', ''));
        return JSON.stringify(mapped);
    }

    forEachTempVar({NAME, REPEAT}, util) {
        const count = Scratch.Cast.toNumber(REPEAT);
        const name = Scratch.Cast.toString(NAME);

        if (typeof util.stackFrame.loopCounter === 'undefined') {
            util.stackFrame.loopCounter = count;
        }

        util.stackFrame.loopCounter--;

        if (util.stackFrame.loopCounter >= 0) {
            const i = (count - util.stackFrame.loopCounter) - 1;
            this.setVariable({ name: name, value: i + 1 }, util);
            util.startBranch(1, true);
        }
    }
}

Scratch.extensions.register(new TempVars());
})(Scratch);
