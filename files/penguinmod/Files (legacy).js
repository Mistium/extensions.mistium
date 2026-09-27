// Name: Files (legacy)
// ID: jgFiles
// Description: Ask the user for files and download text, data URIs or byte arrays.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_files
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Files (legacy) must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const formatMessage = (m) => typeof m === "string" ? m : m.default;

    // from src/util/json-block-utilities.js
    const validateArray = array => {
        let valid = false;
        let allay = [];
        try {
            if (!array.startsWith('[')) throw new Error('error lol');
            allay = JSON.parse(array);
            valid = true;
        } catch {}

        return {
            array: allay,
            json: array,
            isValid: valid
        };
    };
    // from src/util/array buffer.js
    const BufferStuff = {
        bufferToArray (buffer) {
            buffer = new DataView(buffer);
            const array = [];
            for (let idx = 0; idx < buffer.byteLength; idx++) {
                array.push(buffer.getUint8(idx));
            }
            return array;
        },
        arrayToBuffer (array) {
            const buffer = new ArrayBuffer(array.length);
            const view = new DataView(buffer);
            array.forEach((byte, offset) => {
                view.setUint8(offset, byte);
            });
            return view.buffer;
        }
    };

    const noopSwitch = { isNoop: true };

    /**
     * Class for File blocks
     * @constructor
     */
    class JgFilesBlocks {
        constructor() {
            /**
             * The runtime instantiating this block package.
             * @type {Runtime}
             */
            this.runtime = Scratch.vm.runtime;
        }

        /**
         * @returns {object} metadata for this extension and its blocks.
         */
        getInfo () {
            return {
                id: 'jgFiles',
                name: 'Files (legacy)',
                color1: '#ffbb00',
                color2: '#ffaa00',
                // docsURI: 'https://docs.turbowarp.org/blocks',
                blocks: [
                    {
                        opcode: 'isFileReaderSupported',
                        text: 'can files be used?',
                        disableMonitor: false,
                        blockType: BlockType.BOOLEAN
                    },
                    {
                        opcode: 'askUserForFileOfType',
                        text: 'ask user for a file of type [FILE_TYPE]',
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            FILE_TYPE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'txt savefile'
                            }
                        },
                        switches: [
                            noopSwitch,
                            'askUserForFileOfTypeAsArrayBuffer',
                            'askUserForFileOfTypeAsDataUri',
                        ],
                        switchText: 'ask for file'
                    },
                    {
                        opcode: 'askUserForFileOfTypeAsArrayBuffer',
                        text: 'ask user for an array buffer file of type [FILE_TYPE]',
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            FILE_TYPE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'txt savefile'
                            }
                        },
                        switches: [
                            'askUserForFileOfType',
                            noopSwitch,
                            'askUserForFileOfTypeAsDataUri',
                        ],
                        switchText: 'ask for array buffer'
                    },
                    {
                        opcode: 'askUserForFileOfTypeAsDataUri',
                        text: 'ask user for a data uri file of type [FILE_TYPE]',
                        disableMonitor: true,
                        blockType: BlockType.REPORTER,
                        arguments: {
                            FILE_TYPE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'png'
                            }
                        },
                        switches: [
                            'askUserForFileOfType',
                            'askUserForFileOfTypeAsArrayBuffer',
                            noopSwitch,
                        ],
                        switchText: 'ask for data uri'
                    },
                    {
                        opcode: 'downloadFile',
                        text: 'download content [FILE_CONTENT] as file name [FILE_NAME]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            FILE_CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: 'Hello!'
                            },
                            FILE_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'text.txt'
                            }
                        },
                        switches: [
                            noopSwitch,
                            'downloadFileDataUri',
                            'downloadFileBuffer',
                        ],
                        switchText: 'download file'
                    },
                    {
                        opcode: 'downloadFileDataUri',
                        text: 'download data uri [FILE_CONTENT] as file name [FILE_NAME]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            FILE_CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: 'data:image/png;base64,'
                            },
                            FILE_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'content.png'
                            }
                        },
                        switches: [
                            'downloadFile',
                            noopSwitch,
                            'downloadFileBuffer',
                        ],
                        switchText: 'download data uri'
                    },
                    {
                        opcode: 'downloadFileBuffer',
                        text: 'download array buffer [FILE_CONTENT] as file name [FILE_NAME]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            FILE_CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: '[]'
                            },
                            FILE_NAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'data.bin'
                            }
                        },
                        switches: [
                            'downloadFile',
                            'downloadFileDataUri',
                            noopSwitch
                        ],
                        switchText: 'download array buffer'
                    }
                ]
            };
        }

        isFileReaderSupported () {
            return (window.FileReader !== null) && (window.document !== null);
        }

        dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }

        __askUserForFile (acceptTypes) {
            try {
                return new Promise(resolve => {
                    const fileReader = new FileReader();
                    fileReader.onload = e => {
                        resolve(e.target.result);
                    };
                    const input = document.createElement("input");
                    input.type = "file";
                    if (acceptTypes !== null) {
                        input.accept = acceptTypes;
                    }
                    input.style.display = "none";
                    document.body.append(input);
                    input.onchange = () => {
                        const file = input.files[0];
                        if (!file) {
                            resolve("");
                            return;
                        }
                        fileReader.readAsText(file);

                        input.remove();
                    };
                    input.onblur = () => {
                        input.onchange();
                    };
                    input.focus();
                    input.click();
                });
            } catch (e) {
                return;
            }
        }
        __askUserForFilearraybuffer (acceptTypes) {
            try {
                return new Promise(resolve => {
                    const fileReader = new FileReader();
                    fileReader.onload = e => {
                        resolve(JSON.stringify(BufferStuff.bufferToArray(e.target.result)));
                    };
                    const input = document.createElement("input");
                    input.type = "file";
                    if (acceptTypes !== null) {
                        input.accept = acceptTypes;
                    }
                    input.style.display = "none";
                    document.body.append(input);
                    input.onchange = () => {
                        const file = input.files[0];
                        if (!file) {
                            resolve("");
                            return;
                        }
                        fileReader.readAsArrayBuffer(file);

                        input.remove();
                    };
                    input.onblur = () => {
                        input.onchange();
                    };
                    input.focus();
                    input.click();
                });
            } catch (e) {
                return;
            }
        }
        __askUserForFiledatauri (acceptTypes) {
            try {
                return new Promise(resolve => {
                    const fileReader = new FileReader();
                    fileReader.onload = e => {
                        resolve(e.target.result);
                    };
                    const input = document.createElement("input");
                    input.type = "file";
                    if (acceptTypes !== null) {
                        input.accept = acceptTypes;
                    }
                    input.style.display = "none";
                    document.body.append(input);
                    input.onchange = () => {
                        const file = input.files[0];
                        if (!file) {
                            resolve("");
                            return;
                        }
                        fileReader.readAsDataURL(file);

                        input.remove();
                    };
                    input.onblur = () => {
                        input.onchange();
                    };
                    input.focus();
                    input.click();
                });
            } catch (e) {
                return;
            }
        }

        askUserForFileOfType (args) {
            const fileTypesAllowed = [];
            const input = args.FILE_TYPE
                .toLowerCase()
                .replace(/.,/gmi, "");
            if (input === "any") return this.__askUserForFile(null);
            input.split(" ").forEach(type => {
                fileTypesAllowed.push(`.${type}`);
            });
            return this.__askUserForFile(fileTypesAllowed.join(","), false);
        }
        askUserForFileOfTypeAsArrayBuffer (args) {
            const fileTypesAllowed = [];
            const input = args.FILE_TYPE
                .toLowerCase()
                .replace(/.,/gmi, "");
            if (input === "any") return this.__askUserForFilearraybuffer(null);
            input.split(" ").forEach(type => {
                fileTypesAllowed.push(`.${type}`);
            });
            return this.__askUserForFilearraybuffer(fileTypesAllowed.join(","));
        }
        askUserForFileOfTypeAsDataUri (args) {
            const fileTypesAllowed = [];
            const input = args.FILE_TYPE
                .toLowerCase()
                .replace(/.,/gmi, "");
            if (input === "any") return this.__askUserForFiledatauri(null);
            input.split(" ").forEach(type => {
                fileTypesAllowed.push(`.${type}`);
            });
            return this.__askUserForFiledatauri(fileTypesAllowed.join(","));
        }

        downloadFile (args, _, __, downloadArray, downloadBase64) {
            let content = "";
            let fileName = "text.txt";

            content = String(args.FILE_CONTENT) || content;
            fileName = String(args.FILE_NAME) || fileName;

            const array = validateArray(args.FILE_CONTENT);
            if (array.isValid && downloadArray) {
                content = BufferStuff.arrayToBuffer(array.array);
            }

            let blob;
            if (downloadBase64) {
                blob = this.dataURLtoBlob(content);
            } else {
                blob = new Blob([content]);
            }
            const a = document.createElement("a");
            a.style.display = "none";
            document.body.append(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        }
        downloadFileDataUri(args) {
            return this.downloadFile(args, null, null, false, true);
        }
        downloadFileBuffer(args) {
            return this.downloadFile(args, null, null, true, false);
        }
    }

    Scratch.extensions.register(new JgFilesBlocks());
})(Scratch);
