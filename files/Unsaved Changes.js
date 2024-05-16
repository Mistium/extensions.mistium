// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
class UnsavedChangesExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.unsavedChangesDetected = false;
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this); // Bind handleBeforeUnload to this context
    }

    getInfo() {
        return {
            id: 'unsavedChanges',
            name: 'Unsaved Changes',
            blocks: [
                {
                    opcode: 'activateUnsavedChangesAlert',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Activate unsaved changes alert',
                },
                {
                    opcode: 'disableUnsavedChangesAlert',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Disable unsaved changes alert',
                },
                {
                    opcode: 'whenUnsavedChanges',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when unsaved changes alert triggered',
                }
            ],
        };
    }

    activateUnsavedChangesAlert() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    disableUnsavedChangesAlert() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    handleBeforeUnload(event) {
        event.preventDefault();
        event.returnValue = '';
        this.unsavedChangesDetected = true;
    }

    whenUnsavedChanges() {
        if (this.unsavedChangesDetected) {
            this.unsavedChangesDetected = false; // Reset the flag
            return true;
        }
        return false;
    }
}

Scratch.extensions.register(new UnsavedChangesExtension());
