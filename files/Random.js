// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
(function (Scratch) {
    class RandomExtension {
        getInfo() {
            return {
                id: 'mistiumrandom',
                name: 'RandomExtras',
                blocks: [
                    {
                        opcode: 'randomNumber',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick random number from [MIN] to [MAX]',
                        arguments: {
                            MIN: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            MAX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'randomInteger',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick random integer from [MIN] to [MAX]',
                        arguments: {
                            MIN: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            MAX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'randomString',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick random string of length [LENGTH]',
                        arguments: {
                            LENGTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: 'randomBoolean',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick random boolean'
                    },
                    {
                        opcode: 'randomList',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick random item from list [LIST]',
                        arguments: {
                            LIST: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '1, 2, 3'
                            }
                        }
                    }
                ]
            };
        }

        randomNumber({ MIN, MAX }) {
            return Math.random() * (MAX - MIN) + MIN;
        }

        randomInteger({ MIN, MAX }) {
            return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
        }

        randomString({ LENGTH }) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < LENGTH; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        randomBoolean() {
            return Math.random() < 0.5;
        }

        randomList({ LIST }) {
            const items = LIST.split(',').map(item => item.trim());
            return items[Math.floor(Math.random() * items.length)];
        }
    }

    Scratch.extensions.register(new RandomExtension());
})(Scratch);
