class MistFetch {
    constructor() {
        this.requests = {};
    }

    getInfo() {
        return {
            id: 'mistfetch',
            name: 'Mist Fetch',
            blocks: [
                {
                    opcode: 'fetchUrlWithId',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'fetch [URL] with ID [ID]',
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
                {
                    opcode: 'inProgress',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'all requests in progress',
                }
            ]
        };
    }

    fetchUrlWithId({ URL, ID }) {
        if (this.requests[ID]) {
            return `Request with ID ${ID} is already in progress.`;
        }

        this.requests[ID] = { totalBytes: 0, response: '', completed: false };

        fetch(URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.body.getReader();
            })
            .then(reader => {
                let done = false;
                const decoder = new TextDecoder();
                const processStream = async () => {
                    while (!done) {
                        const { done: doneReading, value } = await reader.read();
                        if (doneReading) {
                            done = true;
                            Scratch.vm.runtime.startHats('mistfetch_whenIdRequestCompleted', { ID: ID });
                            this.requests[ID].completed = true;
                        } else {
                            this.requests[ID].totalBytes += value.length;
                            this.requests[ID].response += decoder.decode(value, { stream: true });
                        }
                    }
                };
                return processStream();
            })
            .catch(error => {
                this.requests[ID].error = error.message;
            });

        return `Started fetching URL with ID: ${ID}`;
    }

    getBytesById({ ID }) {
        if (this.requests[ID]) {
            if (this.requests[ID].error) {
                return `Error: ${this.requests[ID].error}`;
            }
            return this.requests[ID].totalBytes;
        }
        return `No request found for ID: ${ID}`;
    }

    getResponseBodyById({ ID }) {
        if (this.requests[ID]) {
            if (this.requests[ID].error) {
                return `Error: ${this.requests[ID].error}`;
            }
            return  this.requests[ID].response;
        }
        return `No request found for ID: ${ID}`;
    }

    isRequestCompleted({ ID }) {
        if (this.requests[ID]) {
            return this.requests[ID].completed;
        }
        return `No request found for ID: ${ID}`;
    }

    deleteRequestById({ ID }) {
        if (this.requests[ID]) {
            delete this.requests[ID];
            return `Request with ID ${ID} has been deleted.`;
        }
        return `No request found for ID: ${ID}`;
    }

    whenIdRequestCompleted({ ID }) {
        if (this.requests[ID] && this.requests[ID].completed) {
            return true;
        }
        return false;
    }

    inProgress() {
        return JSON.stringify(Object.keys(this.requests));
    }
}

// Register the extension
Scratch.extensions.register(new MistFetch());
