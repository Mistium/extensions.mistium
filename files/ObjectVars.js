class ObjectVars {
    constructor() {
        this.objects = {}; // To store objects and their variables
    }

    getInfo() {
        return {
            id: 'ObjectVars',
            name: 'Custom Object',
            blocks: [
                {
                    opcode: 'setVar',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set [VAR] in [OBJECT] to [DATA]',
                    arguments: {
                        VAR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'variable'
                        },
                        OBJECT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'object'
                        },
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'data'
                        }
                    }
                },
                {
                    opcode: 'getVar',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get [VAR] in [OBJECT]',
                    arguments: {
                        VAR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'variable'
                        },
                        OBJECT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'object'
                        }
                    }
                },
                {
                    opcode: 'existsVar',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'exists [VAR] in [OBJECT]',
                    arguments: {
                        VAR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'variable'
                        },
                        OBJECT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'object'
                        }
                    }
                },
                {
                    opcode: 'deleteVar',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete [VAR] in [OBJECT]',
                    arguments: {
                        VAR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'variable'
                        },
                        OBJECT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'object'
                        }
                    }
                },
                {
                    opcode: 'deleteObject',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete object [OBJECT]',
                    arguments: {
                        OBJECT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'object'
                        }
                    }
                }
            ]
        };
    }

    setVar({VAR, OBJECT, DATA}) {
        if (!this.objects[OBJECT]) {
            this.objects[OBJECT] = {};
        }
        this.objects[OBJECT][VAR] = DATA;
    }

    getVar({VAR, OBJECT}) {
        if (this.objects[OBJECT] && this.objects[OBJECT][VAR] !== undefined) {
            return this.objects[OBJECT][VAR];
        }
        return '';
    }

    existsVar({VAR, OBJECT}) {
        return this.objects[OBJECT] && this.objects[OBJECT][VAR] !== undefined;
    }

    deleteVar({VAR, OBJECT}) {
        if (this.objects[OBJECT] && this.objects[OBJECT][VAR] !== undefined) {
            delete this.objects[OBJECT][VAR];
        }
    }

    deleteObject({OBJECT}) {
        if (this.objects[OBJECT] && this.objects[OBJECT] !== undefined) {
            delete this.objects[OBJECT];
        }
    }

}

Scratch.extensions.register(new ObjectVars());
