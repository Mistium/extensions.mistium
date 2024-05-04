// made by @mistium on discord lmao

(function(Scratch) {
    class oneoperator {
        getInfo() {
            return {
                id: 'oneoperator',
                name: 'THE OPERATOR :3',
                color1: '#6cc644',
                blocks: [
                    {
                        opcode: 'oneoperatorlol',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[DATA]',
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'cool operator'
                            },
                        }
                    }
                ]
            };
        }

        oneoperatorlol({ DATA }) {
            return DATA;
        }
    }

    Scratch.extensions.register(new oneoperator());
})(Scratch);
