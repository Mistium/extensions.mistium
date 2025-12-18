// Name: originOSL
// By: @mistium on discord
// Description: Run OSL code in the originOSL environment through the live embed system
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";
    class OriginOSLExtension {
        constructor() {
            this.iframe = null;
            this.connected = false;
            this.booted = false;
            this.running = false;

            this.logQueue = [];
            this.currentLogIndex = 0;

            window.addEventListener('message', this._onMessage.bind(this));
        }

        getInfo() {
            return {
                id: 'originosl',
                name: 'origin OSL',
                color1: '#5b7cfa',
                color2: '#4a67d6',
                blocks: [
                    {
                        opcode: 'openExampleProject',
                        blockType: Scratch.BlockType.BUTTON,
                        text: 'open example project',
                    },
                    {
                        opcode: 'connect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'connect to origin'
                    },
                    {
                        opcode: 'run',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'run osl [CODE]',
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'log "hello world"'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'getLogProperty',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'log [INDEX] [PROPERTY]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'logProperty'
                            }
                        }
                    },
                    {
                        opcode: 'getLogCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'log count'
                    },
                    {
                        opcode: 'popLog',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'pop log'
                    },
                    {
                        opcode: 'clearLogs',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear logs'
                    },
                    '---',
                    {
                        opcode: 'isConnected',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'connected to originOS?'
                    },
                    {
                        opcode: 'isRunning',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is running?'
                    }
                ],
                menus: {
                    logProperty: {
                        acceptReporters: true,
                        items: ['type', 'message', 'timestamp']
                    }
                }
            };
        }

        openExampleProject() {
            window.open("https://warp.mistium.com/editor?project_url=https://extensions.mistium.com/examples/originOSL%20example.sb3")
        }

        connect() {
            if (this.iframe) return;

            this.iframe = document.createElement('iframe');
            this.iframe.src = 'https://origin.mistium.com?embed=';
            this.iframe.style.position = 'fixed';
            this.iframe.style.top = '0';
            this.iframe.style.left = '0';
            this.iframe.style.width = '1px';
            this.iframe.style.height = '1px';
            this.iframe.style.opacity = '0.01';
            this.iframe.style.pointerEvents = 'none';
            this.iframe.style.zIndex = '-1';
            document.body.appendChild(this.iframe);
        }

        _post(msg) {
            if (!this.iframe) return;
            this.iframe.contentWindow.postMessage(msg, '*');
        }

        _onMessage(e) {
            if (!this.iframe || e.source !== this.iframe.contentWindow) return;

            const msg = e.data;
            if (!msg || typeof msg !== 'object') return;

            switch (msg.type) {
                case 'booted':
                    this.booted = true;
                    this._post({ type: 'handshake' });
                    break;

                case 'handshake-ack':
                    this.connected = true;
                    break;

                case 'start':
                    this.running = true;
                    this.logQueue = [];
                    break;

                case 'log':
                case 'warn':
                case 'error':
                    this.logQueue.push({
                        type: msg.type,
                        message: msg.data || '',
                        timestamp: Date.now()
                    });
                    break;

                case 'end':
                    this.running = false;
                    break;
            }
        }

        run(args) {
            if (!this.connected || this.running) return;

            this._post({
                type: 'run',
                code: args.CODE
            });
        }

        getLogProperty(args) {
            const index = Number(args.INDEX) - 1;
            if (index < 0 || index >= this.logQueue.length) {
                return '';
            }

            const log = this.logQueue[index];
            const property = String(args.PROPERTY).toLowerCase();

            switch (property) {
                case 'type':
                    return log.type;
                case 'message':
                    return log.message;
                case 'timestamp':
                    return log.timestamp;
                default:
                    return '';
            }
        }

        getLogCount() {
            return this.logQueue.length;
        }

        popLog() {
            if (this.logQueue.length > 0) {
                this.logQueue.shift();
            }
        }

        clearLogs() {
            this.logQueue = [];
        }

        isConnected() {
            return this.connected;
        }

        isRunning() {
            return this.running;
        }
    }

    Scratch.extensions.register(new OriginOSLExtension());
})(Scratch);