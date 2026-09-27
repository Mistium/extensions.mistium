// Name: Random Extras
// Author: Mistium
// Description: Extra random value generator blocks.

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
                    },
                    {
                        opcode: 'shuffleList',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'shuffle list [LIST]',
                        arguments: {
                            LIST: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '1, 2, 3'
                            }
                        }
                    },
                    {
                        opcode: 'randomUUID',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'random UUID'
                    }
                ]
            };
        }

        randomNumber({ MIN, MAX }) {
            MIN = Scratch.Cast.toNumber(MIN);
            MAX = Scratch.Cast.toNumber(MAX);
            return Math.random() * (MAX - MIN) + MIN;
        }

        randomInteger({ MIN, MAX }) {
            MIN = Scratch.Cast.toNumber(MIN);
            MAX = Scratch.Cast.toNumber(MAX);
            const low = Math.ceil(Math.min(MIN, MAX));
            const high = Math.floor(Math.max(MIN, MAX));
            if (low > high) return Math.round(MIN);
            return Math.floor(Math.random() * (high - low + 1)) + low;
        }

        randomString({ LENGTH }) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = Scratch.Cast.toNumber(LENGTH);
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        randomBoolean() {
            return Math.random() < 0.5;
        }

        randomList({ LIST }) {
            const items = Scratch.Cast.toString(LIST).split(',').map(item => item.trim());
            return items[Math.floor(Math.random() * items.length)];
        }

        shuffleList({ LIST }) {
            const items = Scratch.Cast.toString(LIST).split(',').map(item => item.trim());
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }
            return items.join(', ');
        }

        randomUUID() {
            return crypto.randomUUID();
        }
    }

    Scratch.extensions.register(new RandomExtension());
})(Scratch);
