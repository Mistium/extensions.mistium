// made by @mistium on discord lmao
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

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
