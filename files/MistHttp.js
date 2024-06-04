// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
(function(Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Http extension must be unsandboxed");
    }

    class MistHttp {
        getInfo() {
            return {
                id: 'MistHttp',
                name: 'Mist\'s Http',
                color1: '#6cc644',
                blocks: [
                    {
                        opcode: 'get',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'GET [url]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            }
                        }
                    },
                    {
                        opcode: 'post',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'POST [url] with [data]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            },
                            data: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'put',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'PUT [url] with [data]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            },
                            data: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'delete',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'DELETE [url]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            }
                        }
                    },
                    {
                        opcode: 'patch',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'PATCH [url] with [data]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            },
                            data: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'head',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'HEAD [url]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            }
                        }
                    },
                    {
                        opcode: 'options',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'OPTIONS [url]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            }
                        }
                    },
                    {
                        opcode: 'trace',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'TRACE [url]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            }
                        }
                    },
                    {
                        opcode: 'connect',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'CONNECT [url]',
                        arguments: {
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://api.github.com'
                            }
                        }
                    }
                ]
            };
        }

        async get(args) {
            return fetch(args.url, {method: "GET"})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async post(args) {
            return fetch(args.url, {method: "POST", body: args.data})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async put(args) {
            return fetch(args.url, {method: "PUT", body: args.data})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async delete(args) {
            return fetch(args.url, {method: "DELETE"})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async patch(args) {
            return fetch(args.url, {method: "PATCH", body: args.data})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async head(args) {
            return fetch(args.url, {method: "HEAD"})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async options(args) {
            return fetch(args.url, {method: "OPTIONS"})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async trace(args) {
            return fetch(args.url, {method: "TRACE"})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }

        async connect(args) {
            return fetch(args.url, {method: "CONNECT"})
            .then(response => response.text())
            .catch(error => {
                console.warn(`Fetch error: ${error}`);
            });
        }
        
    }

    Scratch.extensions.register(new MistHttp());
})(Scratch);
