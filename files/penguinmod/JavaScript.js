// Name: JavaScript
// ID: jgJavascript
// Description: Run JavaScript code, sandboxed in an iframe or unsandboxed.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_javascript
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("JavaScript must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const formatMessage = (m) => typeof m === "string" ? m : m.default;

// from PenguinMod util/sandboxed-javascript-runner
// from scratch-vm util/uid
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

// probably good
const generateQuadUid = () => uid() + uid() + uid() + uid();

// idk i just copied this lol
const none = "'none'";
const featurePolicy = {
    'accelerometer': none,
    'ambient-light-sensor': none,
    'battery': none,
    'camera': none,
    'display-capture': none,
    'document-domain': none,
    'encrypted-media': none,
    'fullscreen': none,
    'geolocation': none,
    'gyroscope': none,
    'magnetometer': none,
    'microphone': none,
    'midi': none,
    'payment': none,
    'picture-in-picture': none,
    'publickey-credentials-get': none,
    'speaker-selection': none,
    'usb': none,
    'vibrate': none,
    'vr': none,
    'screen-wake-lock': none,
    'web-share': none,
    'interest-cohort': none
};

// idk i just copied this lol
const generateAllow = () => Object.entries(featurePolicy)
    .map(([name, permission]) => `${name} ${permission}`)
    .join('; ');

const createFrame = () => {
    const element = document.createElement("iframe");
    const frameId = generateQuadUid(); // this is how we differentiate iframe messages from other messages
    // hopefully pm doesnt do sonme weird stuff that makes this not work lol
    element.dataset.id = frameId;
    element.style.display = "none";
    element.setAttribute('aria-hidden', 'true');
    // allow modals so people can use alert & stuff
    element.sandbox = 'allow-scripts allow-modals';
    element.allow = generateAllow();
    document.body.append(element);
    return element;
};

const origin = window.origin;

/**
 * vscode give me autofill
 * @param {MessageEvent} event The nessage event to handle
 * @param {HTMLIFrameElement} iframe The iframe who produced the event
 * @param {Function} removeHandler The handle to remove that i
 * @returns {Promise<object>} The data provided by the message
 */
const messageHandler = (event, iframe, removeHandler) => new Promise(resolve => {
    if (!event.data.payload) return;

    if (event.data.payload.id !== iframe.dataset.id) return;
    const data = event.data.payload;

    window.removeEventListener('message', removeHandler);
    try {
        const url = iframe.src;
        // delete object url
        URL.revokeObjectURL(url);
    } catch {
        // honestly idk how this could fail im just doing this incase
        // something stupid happens and people cant use eval anymore
        console.warn('failed to revoke url of iframe sandboxed eval');
    }
    iframe.remove();

    // send back data
    resolve(data);
});

/**
 * generates a string that can be placed into the iframe src
 * @param {string} code the code
 * @returns {string} the code that can be placed into the eval in the iframe src
 */
const prepareCodeForEval = (code) => {
    const escaped = JSON.stringify(code);
    // when the html encounters a closing script tag, itll end the script
    // so just put a backslash before it and it should be fine
    const scriptEscaped = escaped.replaceAll('<\/script>', '<\\/script>');
    return scriptEscaped;
}

const generateEvaluateSrc = (code, frame) => {
    // this puts some funny stuff in the iframe src
    // so that it actually works
    const runnerCode = `(async () => {
    let result = null;
    let success = true;
    try {
        // techincally eval can also postMessage
        // and also modify success & result probably
        // but theres no real reason to prevent it
        // nor does the user have any reason to do it
        result = await eval(${prepareCodeForEval(code)});
    } catch (err) {
        success = false;
        result = err;
    }

    const parent = window.parent;
    const origin = '*';
    console.log(origin);

    try {
        parent.postMessage({
            payload: {
                success: success,
                value: result,
                id: ${JSON.stringify(frame.dataset.id)}
            },
        }, origin);
    } catch (topLevelError) {
        // couldnt clone likely
        try {
            parent.postMessage({
                payload: {
                    success: success,
                    value: JSON.stringify(result),
                    id: ${JSON.stringify(frame.dataset.id)}
                },
            }, origin);
        } catch (err) {
            // ok we cant stringify it just error
            parent.postMessage({
                payload: {
                    success: false,
                    value: [String(topLevelError), String(err)].join("; "),
                    id: ${JSON.stringify(frame.dataset.id)}
                },
            }, origin);
        }
    }
})();`;

    const html = [
        '<!DOCTYPE html>',
        '<html>',
        '<body>',
        '<script>',
        runnerCode,
        '</script>',
        '</body>',
        '</html>'
    ].join("\n");

    const blob = new Blob([html], { type: 'text/html;charset=UTF-8' });
    const url = URL.createObjectURL(blob);

    return url;
};

class SandboxRunner {
    static execute(code) {
        return new Promise(resolve => {
            const frame = createFrame();
            /**
             * please vscode show me the autofill
             * @param {MessageEvent} e -
             */
            const trueHandler = e => {
                // this code is weird but we need to remove
                // event handler ladter
                messageHandler(e, frame, trueHandler).then(payload => {
                    resolve({
                        success: payload.success,
                        value: payload.value
                    });
                });
            };
            window.addEventListener('message', trueHandler);
            frame.src = generateEvaluateSrc(code, frame);
        });
    }
}

/**
 * Class
 * oh yea you cant access util in the runner anymore
 * im not adding it because im done with implementing eval in PM since it was done like 3 times
 * @constructor
 */
class jgJavascript {
    constructor() {
        const runtime = Scratch.vm.runtime;
        /**
         * The runtime instantiating this block package.
         * @type {runtime}
         */
        this.runtime = runtime;
        this.runningEditorUnsandboxed = false;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgJavascript',
            name: 'JavaScript',
            isDynamic: true,
            // color1: '#EFC900', look like doo doo
            blocks: [
                {
                    opcode: 'unsandbox',
                    func: 'unsandbox', // TurboWarp/MistWarp buttons call `func`, not `opcode`
                    text: 'Run Unsandboxed',
                    blockType: BlockType.BUTTON,
                    hideFromPalette: this.runningEditorUnsandboxed
                },
                {
                    opcode: 'sandbox',
                    func: 'sandbox',
                    text: 'Run Sandboxed',
                    blockType: BlockType.BUTTON,
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    opcode: 'javascriptHat',
                    text: 'when javascript [CODE] == true',
                    blockType: BlockType.HAT,
                    hideFromPalette: !this.runningEditorUnsandboxed, // this block seems to cause strange behavior because of how sandboxed eval is done
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Math.round(Math.random()) === 1"
                        }
                    }
                },
                {
                    opcode: 'javascriptStack',
                    text: 'javascript [CODE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "alert('Hello!')"
                        }
                    }
                },
                {
                    opcode: 'javascriptString',
                    text: 'javascript [CODE]',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Math.random()"
                        }
                    }
                },
                {
                    opcode: 'javascriptBool',
                    text: 'javascript [CODE]',
                    blockType: BlockType.BOOLEAN,
                    disableMonitor: true,
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Math.round(Math.random()) === 1"
                        }
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'You can run unsandboxed',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'when packaging the project.',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: '⠀',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'Player Options >',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'Remove sandbox on the JavaScript Ext.',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
            ]
        };
    }

    async unsandbox() {
        // PenguinMod-only: securityManager.canUnsandbox. Elsewhere ask directly, like PenguinMod does:
        // unsandboxed code can do anything the page can. (runtime.vm only exists in PenguinMod.)
        const securityManager = Scratch.vm.securityManager;
        const unsandbox = typeof securityManager?.canUnsandbox === "function"
            ? await securityManager.canUnsandbox('JavaScript')
            : window.confirm("Let this project run JavaScript unsandboxed? It will be able to do anything this page can.");
        if (!unsandbox) return;
        this.runningEditorUnsandboxed = true;
        Scratch.vm.extensionManager.refreshBlocks("jgJavascript");
    }
    sandbox() {
        this.runningEditorUnsandboxed = false;
        Scratch.vm.extensionManager.refreshBlocks("jgJavascript");
    }

    // util
    // PenguinMod-only: the PenguinMod packager's "remove sandbox" option; missing elsewhere, so it's off.
    _runtimeOptions() {
        return this.runtime.extensionRuntimeOptions || {};
    }
    evaluateCode(code, args, util, realBlockInfo) {
        // used for packager
        if (this._runtimeOptions().javascriptUnsandboxed === true || this.runningEditorUnsandboxed) {
            let result;
            try {
                // eslint-disable-next-line no-eval
                result = eval(code);
            } catch (err) {
                result = err;
            }
            return result;
        }
        // we are not packaged
        return new Promise((resolve) => {
            SandboxRunner.execute(code).then(result => {
                // result is { value: any, success: boolean }
                // in PM, we always ignore errors
                return resolve(result.value);
            })
        })
    }

    // blocks
    javascriptStack(args, util, realBlockInfo) {
        const code = Cast.toString(args.CODE);
        return this.evaluateCode(code, args, util, realBlockInfo);
    }
    javascriptString(args, util, realBlockInfo) {
        const code = Cast.toString(args.CODE);
        return this.evaluateCode(code, args, util, realBlockInfo);
    }
    javascriptBool(args, util, realBlockInfo) {
        const code = Cast.toString(args.CODE);
        const possiblePromise = this.evaluateCode(code, args, util, realBlockInfo);
        if (possiblePromise && typeof possiblePromise.then === 'function') {
            return (async () => {
                const value = await possiblePromise;
                return Boolean(value); // this is a JavaScript extension, we should use the JavaScript way of determining booleans
            })();
        }
        return Boolean(possiblePromise);
    }
    javascriptHat(...args) {
        if (!this._runtimeOptions().javascriptUnsandboxed && !this.runningEditorUnsandboxed) {
            return false; // we will cause issues otherwise, edging hats cause weird issues when waiting for promises each frame
        }
        const possiblePromise = this.javascriptBool(...args);
        if (possiblePromise && typeof possiblePromise.then === 'function') {
            return false; // we will cause issues otherwise, edging hats cause weird issues when waiting for promises each frame
        }
        return possiblePromise;
    }
}

Scratch.extensions.register(new jgJavascript());
})(Scratch);
