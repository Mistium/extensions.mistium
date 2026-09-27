// Name: MistFetch
// Author: Mistium
// Description: my fetch extension for http and stuff cos i needed a better one for originOS

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("MistFetch must run unsandboxed.");
    }

    const Cast = Scratch.Cast;

    class MistFetch {
        constructor() {
            this.requests = {};
            // ID -> frame it completed in, kept until its completion hats have run
            this.justCompleted = new Map();
            this.frame = 0;
            Scratch.vm.runtime.on('BEFORE_EXECUTE', () => this.frame++);
            Scratch.vm.runtime.on('AFTER_EXECUTE', () => {
                for (const [id, frame] of this.justCompleted) {
                    if (frame < this.frame) this.justCompleted.delete(id);
                }
            });
        }

        getInfo() {
            return {
                id: 'mistfetch',
                name: 'Mist Fetch',
                color1: "#6fa6eb",
                blocks: [
                    // Fetch
                    {
                        opcode: 'fetchUrlWithId',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[method] [URL] with ID [ID] headers [headers] body [body]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://extensions.turbowarp.org/hello.txt'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            },
                            headers: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{}'
                            },
                            method: {
                                menu: "METHODS"
                            },
                            body: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{}'
                            }
                        }
                    },
                    {
                        opcode: 'fetchGet',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'GET [URL] with ID [ID]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://extensions.turbowarp.org/hello.txt'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'setRequestTimeout',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set timeout of [TIMEOUT] ms on request [ID]',
                        arguments: {
                            TIMEOUT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5000
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    "---",
                    // Response
                    {
                        opcode: 'getResponseBodyById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'response body for ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'getBytesById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'bytes downloaded for ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'getHeadersById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'headers for ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'getHeaderByName',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'header [HEADER] for ID [ID]',
                        arguments: {
                            HEADER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'content-type'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'getErrorById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'error for ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    "---",
                    // Status
                    {
                        opcode: 'isRequestCompleted',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is request [ID] completed?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'hasRequest',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'has request with ID [ID]?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'isRequestErrored',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is request [ID] errored?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'getInfoById',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[INFO] for ID [ID]',
                        arguments: {
                            INFO: {
                                menu: "INFO"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    "---",
                    // Waiting
                    {
                        opcode: 'waitForRequest',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'wait for request [ID] to complete',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'waitForRequestTimeout',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'wait for request [ID] to complete or [TIMEOUT] ms',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            },
                            TIMEOUT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5000
                            }
                        }
                    },
                    {
                        opcode: 'whileInProgress',
                        blockType: Scratch.BlockType.LOOP,
                        text: 'while request [ID] in progress',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'whenIdRequestCompleted',
                        blockType: Scratch.BlockType.EVENT,
                        text: 'when request [ID] completed',
                        isEdgeActivated: false,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    "---",
                    // Management
                    {
                        opcode: 'cancelRequestById',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'cancel request with ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'deleteRequestById',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete request with ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'request1'
                            }
                        }
                    },
                    {
                        opcode: 'deleteAllRequests',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete all requests',
                    },
                    "---",
                    // Info
                    {
                        opcode: 'inProgress',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all requests in progress',
                    },
                    {
                        opcode: 'all',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'full request object',
                    }
                ],
                menus: {
                    METHODS: {
                        acceptReporters: true,
                        items: ["GET", "POST", "HEAD", "OPTIONS", "TRACE", "PUT", "DELETE", "PATCH", "PURGE"]
                    },
                    INFO: {
                        acceptReporters: true,
                        items: ["PERCENT", "STATUS", "URL", "JSON", "METHOD"]
                    }
                },
            };
        }

        stringify(value) {
            if (typeof value === 'object') {
                return JSON.stringify(value);
            }
            return value;
        }

        finishRequest(ID, error) {
            const request = this.requests[ID];
            if (!request || request.completed) return;
            if (error !== undefined) request.error = error;
            request.completed = true;
            if (request.requestTimeout) {
                clearTimeout(request.requestTimeout);
                request.requestTimeout = null;
            }
            // hat arguments are inputs, not fields, so match them in the hat predicate
            this.justCompleted.set(ID, this.frame);
            Scratch.vm.runtime.startHats('mistfetch_whenIdRequestCompleted');
        }

        sanitise(request) {
            const { controller, requestTimeout, ...rest } = request;
            return rest;
        }

        headersToObject(headers) {
            const obj = {};
            headers.forEach((value, key) => { obj[key] = value; });
            return obj;
        }

        startRequest(URL, ID, method, headers, body) {
            if (!ID || !URL) return;

            if (this.requests[ID]) {
                return;
            }

            method = Cast.toString(method ?? 'GET').toUpperCase();

            if (headers) {
                try {
                    headers = typeof headers === 'string' ? JSON.parse(Cast.toString(headers)) : headers;
                } catch (e) {
                    this.requests[ID] = { totalBytes: 0, response: '', status: 0, completed: true, contentLength: 0, url: URL, method: method, error: e.message };
                    return;
                }
            }

            const hasBody = method !== 'GET' && method !== 'HEAD';

            const controller = new AbortController();
            const signal = controller.signal;

            this.requests[ID] = { totalBytes: 0, response: '', status: 0, completed: false, contentLength: 0, url: URL, method: method, controller: controller };

            const fetchOptions = {
                method: method,
                headers: headers,
                body: hasBody && body != null && body !== '' ? this.stringify(body) : undefined,
                signal: signal
            };

            fetch(URL, fetchOptions)
                .then(response => {
                    if (!this.requests[ID]) return;

                    this.requests[ID].status = response.status;
                    this.requests[ID].contentLength = parseInt(response.headers.get('Content-Length'), 10) || 0;
                    this.requests[ID].headers = this.headersToObject(response.headers);

                    if (!response.body) {
                        this.finishRequest(ID);
                        return;
                    }

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    const processStream = async () => {
                        try {
                            while (true) {
                                const { done, value } = await reader.read();

                                if (!this.requests[ID]) return;

                                if (done) {
                                    this.requests[ID].response += decoder.decode();
                                    this.finishRequest(ID);
                                    break;
                                }

                                this.requests[ID].totalBytes += value.byteLength;
                                this.requests[ID].response += decoder.decode(value, { stream: true });
                            }
                        } catch (streamError) {
                            this.finishRequest(ID, streamError.name === 'AbortError' ? 'Fetch aborted' : streamError.message);
                        }
                    };

                    return processStream();
                })
                .catch(error => {
                    this.finishRequest(ID, error.name === 'AbortError' ? 'Fetch aborted' : error.message);
                });
        }

        fetchUrlWithId({ URL, ID, headers, method, body }) {
            ID = Cast.toString(ID);
            URL = Cast.toString(URL);
            this.startRequest(URL, ID, method, headers, body);
        }

        fetchGet({ URL, ID }) {
            ID = Cast.toString(ID);
            URL = Cast.toString(URL);
            this.startRequest(URL, ID, 'GET', null, null);
        }

        setRequestTimeout({ TIMEOUT, ID }) {
            ID = Cast.toString(ID);
            TIMEOUT = Cast.toNumber(TIMEOUT);

            if (!this.requests[ID] || this.requests[ID].completed) {
                return;
            }
            if (this.requests[ID].requestTimeout) {
                clearTimeout(this.requests[ID].requestTimeout);
            }
            this.requests[ID].requestTimeout = setTimeout(() => {
                if (this.requests[ID] && !this.requests[ID].completed) {
                    this.requests[ID].requestTimeout = null;
                    this.finishRequest(ID, 'Fetch aborted');
                    this.requests[ID].controller.abort();
                }
            }, TIMEOUT);
        }

        getBytesById({ ID }) {
            ID = Cast.toString(ID);

            if (this.requests[ID]) {
                if (this.requests[ID].error) {
                    return `Error: ${this.requests[ID].error}`;
                }
                return this.requests[ID].totalBytes;
            }
            return '';
        }

        getResponseBodyById({ ID }) {
            ID = Cast.toString(ID);

            if (this.requests[ID]) {
                if (this.requests[ID].error) {
                    return `Error: ${this.requests[ID].error}`;
                }
                return this.requests[ID].response;
            }
            return '';
        }

        isRequestCompleted({ ID }) {
            ID = Cast.toString(ID);

            if (this.requests[ID]) {
                return this.requests[ID].completed;
            }
            return false;
        }

        hasRequest({ ID }) {
            return Object.prototype.hasOwnProperty.call(this.requests, Cast.toString(ID));
        }

        isRequestErrored({ ID }) {
            ID = Cast.toString(ID);
            if (this.requests[ID]) {
                return !!this.requests[ID].error;
            }
            return false;
        }

        getErrorById({ ID }) {
            ID = Cast.toString(ID);
            if (this.requests[ID]) {
                return this.requests[ID].error ?? '';
            }
            return '';
        }

        waitForRequest({ ID }) {
            ID = Cast.toString(ID);

            if (!this.requests[ID] || this.requests[ID].completed) {
                return;
            }
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (!this.requests[ID] || this.requests[ID].completed) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 16);
            });
        }

        waitForRequestTimeout({ ID, TIMEOUT }) {
            ID = Cast.toString(ID);
            TIMEOUT = Cast.toNumber(TIMEOUT);

            if (!this.requests[ID] || this.requests[ID].completed) {
                return;
            }
            return new Promise(resolve => {
                const timer = setTimeout(() => {
                    clearInterval(interval);
                    resolve();
                }, TIMEOUT);
                const interval = setInterval(() => {
                    if (!this.requests[ID] || this.requests[ID].completed) {
                        clearInterval(interval);
                        clearTimeout(timer);
                        resolve();
                    }
                }, 16);
            });
        }

        whileInProgress({ ID }, util) {
            ID = Cast.toString(ID);
            if (this.requests[ID] && !this.requests[ID].completed) {
                util.startBranch(1, true);
            }
        }

        deleteRequestById({ ID }) {
            ID = Cast.toString(ID);

            if (this.requests[ID]) {
                if (this.requests[ID].requestTimeout) clearTimeout(this.requests[ID].requestTimeout);
                if (this.requests[ID].controller) this.requests[ID].controller.abort();
                delete this.requests[ID];
            }
        }

        deleteAllRequests() {
            for (const ID in this.requests) {
                if (this.requests[ID].requestTimeout) clearTimeout(this.requests[ID].requestTimeout);
                if (this.requests[ID].controller) this.requests[ID].controller.abort();
            }
            this.requests = {};
        }

        cancelRequestById({ ID }) {
            ID = Cast.toString(ID);

            if (this.requests[ID] && !this.requests[ID].completed) {
                this.finishRequest(ID, 'Fetch aborted');
                if (this.requests[ID].controller) this.requests[ID].controller.abort();
            }
        }

        whenIdRequestCompleted({ ID }) {
            ID = Cast.toString(ID);

            return this.justCompleted.has(ID);
        }

        inProgress() {
            return JSON.stringify(Object.keys(this.requests).filter(id => !this.requests[id].completed));
        }

        getInfoById({ INFO, ID }) {
            ID = Cast.toString(ID);

            if (!this.requests[ID]) return '';
            if (this.requests[ID].error) return `Error: ${this.requests[ID].error}`;

            const request = this.requests[ID];
            switch (Cast.toString(INFO)) {
                case "PERCENT":
                    if (request.contentLength > 0) {
                        return (request.totalBytes / request.contentLength) * 100;
                    }
                    return -1;
                case "STATUS":
                    return request.status ?? 0;
                case "URL":
                    return request.url ?? "";
                case "JSON":
                    return JSON.stringify(this.sanitise(request));
                case "METHOD":
                    return request.method ?? "";
                default:
                    return '';
            }
        }

        getHeadersById({ ID }) {
            ID = Cast.toString(ID);

            if (!this.requests[ID]) return '';

            if (this.requests[ID].error) {
                return `Error: ${this.requests[ID].error}`;
            }
            return JSON.stringify(this.requests[ID].headers ?? {});
        }

        getHeaderByName({ HEADER, ID }) {
            ID = Cast.toString(ID);
            HEADER = Cast.toString(HEADER).toLowerCase();

            if (!this.requests[ID]) return '';
            if (this.requests[ID].error) return `Error: ${this.requests[ID].error}`;
            return this.requests[ID].headers?.[HEADER] ?? '';
        }

        all() {
            const sanitised = {};
            for (const id of Object.keys(this.requests)) {
                sanitised[id] = this.sanitise(this.requests[id]);
            }
            return JSON.stringify(sanitised);
        }
    }

    // Register the extension
    Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumFetch = new MistFetch());
})(Scratch)
