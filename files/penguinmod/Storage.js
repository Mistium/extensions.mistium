// Name: Storage
// ID: jgStorage
// Description: Save values in local storage, per project, or on a storage server.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_storage
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Storage must run unsandboxed.");

const BlockType = Scratch.BlockType;
const ArgumentType = Scratch.ArgumentType;
const Cast = Scratch.Cast;
const scratchFetch = (...args) => (Scratch.fetch ? Scratch.fetch(...args) : fetch(...args));

// from PenguinMod-Vm src/util/uid.js
const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const uid = function () {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
};

const serialize = v => {
    if (typeof v == "object" && v != null && typeof v.customId == "string") {
        try {
            return JSON.stringify({
                customType: true,
                typeId: v.customId,
                serialized: Scratch.vm.runtime.serializers[v.customId].serialize(v)
            });
        } catch (e) {}
    }
    return JSON.stringify(Cast.toString(v));
};

const deserialize = v => {
    try {
        let parsed = JSON.parse(v);
        if (typeof parsed == "object" && parsed != null && parsed.customType === true) {
            try {
                return Scratch.vm.runtime.serializers[parsed.typeId].deserialize(parsed.serialized);
            } catch (e) {}
        }
        return parsed;
    } catch (e) {}
    return v;
}

/**
 * Class for storage blocks
 * @constructor
 */
class JgStorageBlocks {
    constructor() {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = Scratch.vm.runtime;

        this.currentServer = "https://storage-ext.penguinmod.com/";
        this.usePenguinMod = true;
        this.useGlobal = true;
        this.waitingForResponse = false;
        this.serverFailedResponse = false;
        this.serverError = "";

        this.uniquePrefix = "u" + uid();
        // A value stored in the PMP of the project.
        // This value should always be globally unique to
        // every project.
        // The chance that 2 projects have the same "unique"
        // prefix is about very small.
        // The u at the start is to make sure that it can never
        // be mistaken for a project id.
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgStorage',
            name: 'Storage',
            color1: '#76A8FE',
            color2: '#538EFC',
            docsURI: 'https://docs.penguinmod.com/extensions/storage',
            blocks: [
                {
                    blockType: BlockType.LABEL,
                    text: "Local Storage"
                },
                {
                    opcode: 'getValue',
                    text: 'get [KEY]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    allowDropAnywhere: true,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                    }
                },
                {
                    opcode: 'setValue',
                    text: 'set [KEY] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "value"
                        },
                    }
                },
                {
                    opcode: 'deleteValue',
                    text: 'delete [KEY]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        }
                    }
                },
                {
                    opcode: 'getKeys',
                    text: 'get all stored names',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Local Uploaded Project Storage"
                },
                {
                    opcode: 'getProjectValue',
                    text: 'get uploaded project [KEY]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    allowDropAnywhere: true,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                    }
                },
                {
                    opcode: 'setProjectValue',
                    text: 'set uploaded project [KEY] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "value"
                        },
                    }
                },
                {
                    opcode: 'deleteProjectValue',
                    text: 'delete uploaded project [KEY]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        }
                    }
                },
                {
                    opcode: 'getProjectKeys',
                    text: 'get all stored names in this uploaded project',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Local Project Storage"
                },
                {
                    opcode: 'getUniqueValue',
                    text: 'get local project [KEY]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    allowDropAnywhere: true,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                    }
                },
                {
                    opcode: 'setUniqueValue',
                    text: 'set local project [KEY] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "value"
                        },
                    }
                },
                {
                    opcode: 'deleteUniqueValue',
                    text: 'delete local project [KEY]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        }
                    }
                },
                {
                    opcode: 'getUniqueKeys',
                    text: 'get all stored names in this local project',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Server Storage"
                },
                {
                    opcode: 'isGlobalServer',
                    text: 'is using global server?',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'useCertainServer',
                    text: 'set server to [SERVER] server',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SERVER: {
                            type: ArgumentType.STRING,
                            menu: "serverType"
                        },
                    }
                },
                {
                    opcode: 'waitingForConnection',
                    text: 'waiting for server to respond?',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'connectionFailed',
                    text: 'server failed to respond?',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'serverErrorOutput',
                    text: 'server error',
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                "---",
                {
                    opcode: 'getServerValue',
                    text: 'get server [KEY]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                    }
                },
                {
                    opcode: 'setServerValue',
                    text: 'set server [KEY] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "value"
                        },
                    }
                },
                {
                    opcode: 'deleteServerValue',
                    text: 'delete server [KEY]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "key"
                        }
                    }
                }
            ],
            menus: {
                serverType: {
                    acceptReporters: true,
                    items: [
                        "project",
                        "global"
                    ].map(item => ({ text: item, value: item }))
                }
            }
        };
    }
    // Storage
    serialize() {
        return { uniqueId: this.uniquePrefix }
    }

    deserialize(data) {
        this.uniquePrefix = data.uniqueId;
    }
    /**
     * PenguinMod saves uniquePrefix through serialize()/deserialize().
     * Elsewhere those hooks aren't called, so keep it in runtime.extensionStorage,
     * which TurboWarp/MistWarp save in the project.
     */
    getUniquePrefix() {
        if (Scratch.extensions.isPenguinMod) return this.uniquePrefix;
        const storage = this.runtime.extensionStorage;
        if (!storage.jgStorage || typeof storage.jgStorage.uniqueId !== "string") {
            storage.jgStorage = { uniqueId: this.uniquePrefix };
        }
        return storage.jgStorage.uniqueId;
    }

    // utilities
    /**
     * @returns {string} Prefix for any keys saved
     */
    getPrefix(projectId) {
        return `PM_PROJECTSTORAGE_EXT_${projectId == null ? "" : `${projectId}_`}`;
    }
    getAllKeys(projectId) {
        return Object.keys(localStorage).filter(key => key.startsWith(this.getPrefix(projectId))).map(key => key.replace(this.getPrefix(projectId), ""));
    }
    getProjectId() {
        /* todo: get the project id in a like 190x better way lol */
        const hash = String(window.location.hash).replace(/#/gmi, "");
        return Cast.toNumber(hash);
    }

    runPenguinWebRequest(url, options, ifFailReturn) {
        this.waitingForResponse = true;
        this.serverFailedResponse = false;
        this.serverError = "";
        return new Promise((resolve) => {
            let promise = null;
            if (options !== null) {
                promise = scratchFetch(url, options);
            } else {
                promise = scratchFetch(url);
            }
            promise.then(response => {
                response.text().then(text => {
                    if (!response.ok) {
                        this.waitingForResponse = false;
                        this.serverFailedResponse = true;
                        this.serverError = Cast.toString(text);
                        if (ifFailReturn !== null) {
                            return resolve(ifFailReturn);
                        }
                        resolve(text);
                        return;
                    }
                    this.waitingForResponse = false;
                    this.serverFailedResponse = false;
                    this.serverError = "";
                    resolve(text);
                }).catch(err => {
                    this.waitingForResponse = false;
                    this.serverFailedResponse = true;
                    this.serverError = Cast.toString(err);
                    if (ifFailReturn !== null) {
                        return resolve(ifFailReturn);
                    }
                    resolve(err);
                })
            }).catch(err => {
                this.waitingForResponse = false;
                this.serverFailedResponse = true;
                this.serverError = Cast.toString(err);
                if (ifFailReturn !== null) {
                    return resolve(ifFailReturn);
                }
                resolve(err);
            })
        })
    }

    getCurrentServer() {
        return `https://storage-ext.penguinmod.com/`
    }

    // blocks
    getKeys() {
        return JSON.stringify(this.getAllKeys());
    }
    getValue(args) {
        const key = this.getPrefix() + Cast.toString(args.KEY);

        const returned = localStorage.getItem(key);
        return deserialize(returned);
    }
    setValue(args) {
        const key = this.getPrefix() + Cast.toString(args.KEY);
        const value = args.VALUE;

        return localStorage.setItem(key, serialize(value));
    }
    deleteValue(args) {
        const key = this.getPrefix() + Cast.toString(args.KEY);

        return localStorage.removeItem(key);
    }

    // project blocks
    getProjectKeys() {
        return JSON.stringify(this.getAllKeys(this.getProjectId()));
    }
    getProjectValue(args) {
        const key = this.getPrefix(this.getProjectId()) + Cast.toString(args.KEY);

        const returned = localStorage.getItem(key);
        return deserialize(returned);
    }
    setProjectValue(args) {
        const key = this.getPrefix(this.getProjectId()) + Cast.toString(args.KEY);
        const value = args.VALUE;

        return localStorage.setItem(key, serialize(value));
    }
    deleteProjectValue(args) {
        const key = this.getPrefix(this.getProjectId()) + Cast.toString(args.KEY);

        return localStorage.removeItem(key);
    }

    // global unique blocks
    getUniqueKeys() {
        return JSON.stringify(this.getAllKeys(this.getUniquePrefix()));
    }
    getUniqueValue(args) {
        const key = this.getPrefix(this.getUniquePrefix()) + Cast.toString(args.KEY);

        const returned = localStorage.getItem(key);
        return deserialize(returned);
    }
    setUniqueValue(args) {
        const key = this.getPrefix(this.getUniquePrefix()) + Cast.toString(args.KEY);
        const value = args.VALUE;

        return localStorage.setItem(key, serialize(value));
    }
    deleteUniqueValue(args) {
        const key = this.getPrefix(this.getUniquePrefix()) + Cast.toString(args.KEY);

        return localStorage.removeItem(key);
    }

    // server blocks
    isGlobalServer() {
        return this.useGlobal;
    }
    useCertainServer(args) {
        const serverType = Cast.toString(args.SERVER).toLowerCase();
        if (["project", "global"].includes(serverType)) {
            // this is a menu option
            this.currentServer = "https://storage-ext.penguinmod.com/";
            this.usePenguinMod = true;
            this.useGlobal = serverType === "global";
        } else {
            // this is a url
            this.currentServer = Cast.toString(args.SERVER);
            if (!this.currentServer.endsWith("/")) {
                this.currentServer += "/";
            }
            this.usePenguinMod = false;
            this.useGlobal = true;
        }
        // now lets wait until the server responds saying it is online
        return this.runPenguinWebRequest(this.currentServer);
    }
    waitingForConnection() {
        return this.waitingForResponse;
    }
    connectionFailed() {
        return this.serverFailedResponse;
    }
    serverErrorOutput() {
        return this.serverError;
    }

    async getServerValue(args) {
        const key = Cast.toString(args.KEY);

        return deserialize(await this.runPenguinWebRequest(`${this.currentServer}get?key=${key}${this.useGlobal ? "" : `&project=${this.getProjectId()}`}`, null, ""));
    }
    setServerValue(args) {
        const key = Cast.toString(args.KEY);
        const value = serialize(args.VALUE);

        return this.runPenguinWebRequest(`${this.currentServer}set?key=${key}${this.useGlobal ? "" : `&project=${this.getProjectId()}`}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "value": value
            })
        });
    }
    deleteServerValue(args) {
        const key = Cast.toString(args.KEY);

        return this.runPenguinWebRequest(`${this.currentServer}delete?key=${key}${this.useGlobal ? "" : `&project=${this.getProjectId()}`}`, {
            method: "DELETE"
        });
    }
}

Scratch.extensions.register(new JgStorageBlocks());
})(Scratch);
