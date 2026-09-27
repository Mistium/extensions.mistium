// Name: Tab_Utils
// By: @mistium on discord
// Description: Detect when the tab key is pressed and allow it to be disabled and enabled.
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Tab Utils must run unsandboxed.");
    }

    class TabControlExtension {
        constructor() {
            // When true, Tab is captured as a normal key instead of moving focus
            this.captureTab = false;
            this.tab_pressed = false;
            document.addEventListener('keydown', this.handleTabKeyDown.bind(this));
            document.addEventListener('keyup', this.handleTabKeyUp.bind(this));
            window.addEventListener('blur', () => {
                this.tab_pressed = false;
            });
        }

        getInfo() {
            return {
                id: 'tabcontrol',
                name: 'Tab Control',
                blocks: [
                    {
                        opcode: 'disableTabKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Use Default Tab Method',
                    },
                    {
                        opcode: 'enableTabKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Make Tab Into A Normal Key',
                    },
                    {
                        opcode: 'tabKeyPressed',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'Tab Key Pressed?',
                    },
                ],
            };
        }

        disableTabKey() {
            this.captureTab = false;
        }

        enableTabKey() {
            this.captureTab = true;
        }

        tabKeyPressed() {
            return this.tab_pressed;
        }

        handleTabKeyDown(event) {
            if (event.key === 'Tab') {
                this.tab_pressed = true;
                if (this.captureTab) event.preventDefault();
            }
        }

        handleTabKeyUp(event) {
            if (event.key === 'Tab') {
                this.tab_pressed = false;
            }
        }
    }

    Scratch.extensions.register(new TabControlExtension());
})(Scratch);
