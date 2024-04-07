class VirtualKeyboard {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'VirtualKeyboard',
            name: 'Virtual Keyboard',
            color1: '#FF9933',
            blocks: [
                {
                    opcode: 'isVirtualKeyboardEnabled',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'virtual keyboard allowed?'
                },
                {
                    opcode: 'showVirtualKeyboard',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'show virtual keyboard'
                },
                {
                    opcode: 'hideVirtualKeyboard',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'hide virtual keyboard'
                }
            ]
        };
    }

    isVirtualKeyboardEnabled() {
        return "virtualKeyboard" in navigator;
    }

    showVirtualKeyboard() {
        if (this.isVirtualKeyboardEnabled) {
            navigator.virtualKeyboard.show();
        }
    }

    hideVirtualKeyboard() {
        if (this.isVirtualKeyboardEnabled) {
            navigator.virtualKeyboard.hide();
        }
    }
}

Scratch.extensions.register(new VirtualKeyboard());
