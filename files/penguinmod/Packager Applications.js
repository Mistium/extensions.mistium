// Name: Packager Applications
// ID: jgPackagerApplications
// Description: Move, resize, rename and fullscreen the window of a packaged project.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_packagerApplications
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Packager Applications must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const Icon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCwwLDYwLDYwIj4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMTAsLTE1MCkiPgogICAgICAgIDxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWNhcD0iYnV0dCIKICAgICAgICAgICAgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIgogICAgICAgICAgICBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+CiAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICBkPSJNMjE1LjE1Nzc4LDE2Ni4yNzM2MmwyNC44NDIyMywtMTMuNzI2MzhsMjQuODQyMjIsMTMuNzI2Mzh2MjcuNDUyNzZsLTI0Ljg0MjIyLDEzLjcyNjM4bC0yNC44NDIyMywtMTMuNzI2Mzh6IgogICAgICAgICAgICAgICAgZmlsbD0iIzY2YjhmZiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMjMuNDA0MjksMTY5Ljk1MTIxbDI0LjMzMTg2LC0xMi40NTI5N2w3LjA5ODQ5LDQuMDE5MjNsLTIzLjY2MTgyLDEyLjU4Njk3eiIgZmlsbD0iI2ZmZmZmZiIKICAgICAgICAgICAgICAgIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiAvPgogICAgICAgICAgICA8cGF0aCBkPSJNMjIzLjI0MTM1LDE3OC41NjU2NmwtMC4wMDA1OSwtOC41NzY1NWg3LjkwNjVsMC4wMDA4NywxMi41OTY4eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIgogICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPSIwIiAvPgogICAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgICAgZD0iTTIxNS4xNTc3OCwxNjYuMjczNjJsMjQuODQyMjMsLTEzLjcyNjM4bDI0Ljg0MjIyLDEzLjcyNjM4djI3LjQ1Mjc2bC0yNC44NDIyMiwxMy43MjYzOGwtMjQuODQyMjMsLTEzLjcyNjM4eiIKICAgICAgICAgICAgICAgIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiAvPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjI1Ljg0MjIyNTAwMDAwMDAxMzoyOC41OTUyNTg1NzIwNDQyLS0+";
const formatMessage = (m) => typeof m === "string" ? m : m.default;

class JgPackagerApplicationsBlocks {
    constructor() {
        const runtime = Scratch.vm.runtime;
        /**
         * The runtime instantiating this block package.
         */
        this.runtime = runtime;
    }

    /**
     * metadata for this extension and its blocks.
     * @returns {object}
     */
    getInfo() {
        return {
            id: "jgPackagerApplications",
            name: "Packager Applications",
            color1: "#66b8ff",
            color2: "#5092cc",
            blockIconURI: Icon,
            blocks: [
                {
                    opcode: "isPackaged",
                    blockType: BlockType.BOOLEAN,
                    text: "is packaged?"
                },
                {
                    opcode: "moveWindow",
                    blockType: BlockType.COMMAND,
                    text: "move window to x: [X] y: [Y]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "setX",
                    blockType: BlockType.COMMAND,
                    text: "set window x to [X]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "changeX",
                    blockType: BlockType.COMMAND,
                    text: "change window x by [X]",
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: "setY",
                    blockType: BlockType.COMMAND,
                    text: "set window y to [Y]",
                    arguments: {
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "changeY",
                    blockType: BlockType.COMMAND,
                    text: "change window y by [Y]",
                    arguments: {
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: "windowX",
                    blockType: BlockType.REPORTER,
                    text: "window x"
                },
                {
                    opcode: "windowY",
                    blockType: BlockType.REPORTER,
                    text: "window y"
                },
                "---",
                {
                    opcode: "resizeWindow",
                    blockType: BlockType.COMMAND,
                    text: "set window size to width: [WIDTH] height: [HEIGHT]",
                    arguments: {
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 640
                        },
                        HEIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 360
                        }
                    }
                },
                {
                    opcode: "windowWidth",
                    blockType: BlockType.REPORTER,
                    text: "window width"
                },
                {
                    opcode: "windowHeight",
                    blockType: BlockType.REPORTER,
                    text: "window height"
                },
                "---",
                {
                    opcode: "enableFullscreen",
                    blockType: BlockType.COMMAND,
                    text: "enable fullscreen"
                },
                {
                    opcode: "exitFullscreen",
                    blockType: BlockType.COMMAND,
                    text: "exit fullscreen"
                },
                {
                    opcode: "isFullscreen",
                    blockType: BlockType.BOOLEAN,
                    text: "in fullscreen?"
                },
                {
                    opcode: "screenWidth",
                    blockType: BlockType.REPORTER,
                    text: "screen width"
                },
                {
                    opcode: "screenHeight",
                    blockType: BlockType.REPORTER,
                    text: "screen height"
                },
                "---",
                {
                    opcode: "setWindowName",
                    blockType: BlockType.COMMAND,
                    text: "set window name to [NAME]",
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Cool Game"
                        }
                    }
                },
                {
                    opcode: "getWindowName",
                    blockType: BlockType.REPORTER,
                    text: "window name"
                },
                {
                    opcode: "isFocused",
                    blockType: BlockType.BOOLEAN,
                    text: "is user using this window?"
                },
                {
                    opcode: "closeWindow",
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    text: "close window"
                },
            ]
        };
    }

    // blocks
    isPackaged() {
        return this.runtime.isPackaged;
    }
    moveWindow(args) {
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        window.moveTo(x, y);
    }
    setX(args) {
        const x = Cast.toNumber(args.X);
        const y = window.screenY;
        window.moveTo(x, y);
    }
    changeX(args) {
        const x = Cast.toNumber(args.X);
        window.moveBy(x, 0);
    }
    setY(args) {
        const x = window.screenX;
        const y = Cast.toNumber(args.Y);
        window.moveTo(x, y);
    }
    changeY(args) {
        const y = Cast.toNumber(args.Y);
        window.moveBy(0, y);
    }
    windowX() {
        return window.screenLeft;
    }
    windowY() {
        return window.screenTop;
    }
    resizeWindow(args) {
        const width = Cast.toNumber(args.WIDTH);
        const height = Cast.toNumber(args.HEIGHT);
        window.resizeTo(width, height);
    }
    windowWidth() {
        return window.outerWidth;
    }
    windowHeight() {
        return window.outerHeight;
    }
    screenWidth() {
        return screen.width;
    }
    screenHeight() {
        return screen.height;
    }
    enableFullscreen() {
        document.documentElement.requestFullscreen();
    }
    exitFullscreen() {
        document.exitFullscreen();
    }
    isFullscreen() {
        if (document.fullscreenElement) {
            return true;
        }
        return false;
    }
    setWindowName(args) {
        const name = Cast.toString(args.NAME);
        document.title = name;
    }
    getWindowName() {
        return document.title;
    }
    isFocused() {
        return document.hasFocus();
    }
    closeWindow() {
        window.close();
    }
}

Scratch.extensions.register(new JgPackagerApplicationsBlocks());
})(Scratch);
