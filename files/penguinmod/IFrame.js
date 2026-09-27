// Name: IFrame
// ID: jgIframe
// Description: Embed websites on the stage in a movable, rotatable iframe.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_iframe
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("IFrame must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const formatMessage = (m) => typeof m === "string" ? m : m.default;

    // from src/util/color.js
    const rgbToHex = rgb => {
        let decimal = (rgb.r << 16) + (rgb.g << 8) + rgb.b;
        if (decimal < 0) decimal += 0xFFFFFF + 1;
        const hex = Math.round(Number(decimal)).toString(16);
        return `#${'000000'.substr(0, 6 - hex.length)}${hex}`;
    };

    const EffectOptions = {
        acceptReporters: true,
        items: [
            { text: "color", value: "color" },
            { text: "grayscale", value: "grayscale" },
            { text: "brightness", value: "brightness" },
            { text: "contrast", value: "contrast" },
            { text: "ghost", value: "ghost" },
            { text: "blur", value: "blur" },
            { text: "invert", value: "invert" },
            { text: "saturate", value: "saturate" },
            { text: "sepia", value: "sepia" }
        ]
    };

    /**
     * uhhhhhhhhhh
     * @param {Array} array the array
     * @param {*} value the value
     * @returns {Object} an object
     */
    const ArrayToValue = (array, value) => {
        const object = {};
        array.forEach(item => {
            object[String(item)] = value;
        });
        return object;
    };

    /**
     * Class for IFRAME blocks
     * @constructor
     */
    class JgIframeBlocks {
        constructor() {
            /**
             * The runtime instantiating this block package.
             * @type {Runtime}
             */
            this.runtime = Scratch.vm.runtime;
            this.createdIframe = null;
            this.iframeSettings = {
                x: 0,
                y: 0,
                rotation: 90,
                width: 480,
                height: 360,
                color: '#ffffff',
                opacity: 0,
                clickable: true
            };
            this.iframeFilters = ArrayToValue(EffectOptions.items.map(item => item.value), 0);
            this.iframeLoadedValue = false;
            this.displayWebsiteUrl = "";
            this.runtime.on('PROJECT_STOP_ALL', () => {
                // stop button clicked so delete the iframe
                this.RemoveIFrame();
            });
        }

        /**
         * @returns {object} metadata for this extension and its blocks.
         */
        getInfo() {
            return {
                id: 'jgIframe',
                name: 'IFrame',
                color1: '#F36518',
                color2: '#E64D18',
                blocks: [
                    {
                        opcode: 'createIframeElement',
                        text: formatMessage({
                            id: 'jgIframe.blocks.createIframeElement',
                            default: 'set new iframe',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'deleteIframeElement',
                        text: formatMessage({
                            id: 'jgIframe.blocks.deleteIframeElement',
                            default: 'delete iframe',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'iframeElementExists',
                        text: formatMessage({
                            id: 'jgIframe.blocks.iframeElementExists',
                            default: 'iframe exists?',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.BOOLEAN,
                        disableMonitor: true,
                    },
                    "---",
                    "---",
                    {
                        opcode: 'whenIframeIsLoaded',
                        text: formatMessage({
                            id: 'jgIframe.blocks.whenIframeIsLoaded',
                            default: 'when iframe loads site',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.HAT
                    },
                    {
                        opcode: 'setIframeUrl',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframeUrl',
                            default: 'set iframe url to [URL]',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            URL: {
                                type: ArgumentType.STRING,
                                defaultValue: "https://www.example.com"
                            }
                        }
                    },
                    {
                        opcode: 'setIframePosLeft',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframePosLeft',
                            default: 'set iframe x to [X]',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setIframePosTop',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframePosTop',
                            default: 'set iframe y to [Y]',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setIframeSizeWidth',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframeSizeWidth',
                            default: 'set iframe width to [WIDTH]',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            WIDTH: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 480
                            }
                        }
                    },
                    {
                        opcode: 'setIframeSizeHeight',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframeSizeHeight',
                            default: 'set iframe height to [HEIGHT]',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            HEIGHT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 360
                            }
                        }
                    },
                    {
                        opcode: 'setIframeRotation',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframeRotation',
                            default: 'point iframe in direction [ROTATE]',
                            description: ''
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            ROTATE: {
                                type: ArgumentType.ANGLE,
                                defaultValue: 90
                            }
                        }
                    },
                    {
                        opcode: 'setIframeBackgroundColor',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframeBackgroundColor',
                            default: 'set iframe background color to [COLOR]',
                            description: ''
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            COLOR: {
                                type: ArgumentType.COLOR
                            }
                        }
                    },
                    {
                        opcode: 'setIframeBackgroundOpacity',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframeBackgroundOpacity',
                            default: 'set iframe background transparency to [GHOST]%',
                            description: ''
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            GHOST: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'setIframeClickable',
                        text: formatMessage({
                            id: 'jgIframe.blocks.setIframeClickable',
                            default: 'toggle iframe to be [USABLE]',
                            description: ''
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            USABLE: {
                                type: ArgumentType.STRING,
                                menu: 'iframeClickable'
                            }
                        }
                    },
                    {
                        opcode: 'showIframeElement',
                        text: formatMessage({
                            id: 'jgIframe.blocks.showIframeElement',
                            default: 'show iframe',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'hideIframeElement',
                        text: formatMessage({
                            id: 'jgIframe.blocks.hideIframeElement',
                            default: 'hide iframe',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'getIframeLeft',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeLeft',
                            default: 'iframe x',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'getIframeTop',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeTop',
                            default: 'iframe y',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'getIframeWidth',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeWidth',
                            default: 'iframe width',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'getIframeHeight',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeHeight',
                            default: 'iframe height',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'getIframeRotation',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeRotation',
                            default: 'iframe rotation',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'getIframeBackgroundColor',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeBackgroundColor',
                            default: 'iframe background color',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'getIframeBackgroundOpacity',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeBackgroundOpacity',
                            default: 'iframe background transparency',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'getIframeTargetUrl',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeTargetUrl',
                            default: 'iframe target url',
                            description: ''
                        }),
                        blockType: BlockType.REPORTER
                    },
                    {
                        opcode: 'iframeElementIsHidden',
                        text: formatMessage({
                            id: 'jgIframe.blocks.iframeElementIsHidden',
                            default: 'iframe is hidden?',
                            description: 'im too lazy to write these anymore tbh'
                        }),
                        blockType: BlockType.BOOLEAN,
                        disableMonitor: true,
                    },
                    {
                        opcode: 'getIframeClickable',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeClickable',
                            default: 'iframe is interactable?',
                            description: ''
                        }),
                        blockType: BlockType.BOOLEAN,
                        disableMonitor: true,
                    },
                    "---",
                    "---",
                    // effects YAYYAYAWOOHOOO YEEAAAAAAAAA
                    {
                        opcode: 'iframeElementSetEffect',
                        text: formatMessage({
                            id: 'jgIframe.blocks.iframeElementSetEffect',
                            default: 'set [EFFECT] effect on iframe to [AMOUNT]',
                            description: 'YAYYAYAWOOHOOO YEEAAAAAAAAAYAYYAYAWOOHOOO YEEAAAAAAAAA'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            EFFECT: {
                                type: ArgumentType.STRING,
                                menu: 'effects',
                                defaultValue: "color"
                            },
                            AMOUNT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'iframeElementChangeEffect',
                        text: formatMessage({
                            id: 'jgIframe.blocks.iframeElementChangeEffect',
                            default: 'change [EFFECT] effect on iframe by [AMOUNT]',
                            description: 'YAYYAYAWOOHOOO YEEAAAAAAAAAYAYYAYAWOOHOOO YEEAAAAAAAAA'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            EFFECT: {
                                type: ArgumentType.STRING,
                                menu: 'effects',
                                defaultValue: "color"
                            },
                            AMOUNT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 25
                            }
                        }
                    },
                    {
                        opcode: 'iframeElementClearEffects',
                        text: formatMessage({
                            id: 'jgIframe.blocks.iframeElementClearEffects',
                            default: 'clear iframe effects',
                            description: 'YAYYAYAWOOHOOO YEEAAAAAAAAAYAYYAYAWOOHOOO YEEAAAAAAAAA'
                        }),
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'getIframeEffectAmount',
                        text: formatMessage({
                            id: 'jgIframe.blocks.getIframeEffectAmount',
                            default: 'iframe [EFFECT]',
                            description: 'YAYYAYAWOOHOOO YEEAAAAAAAAAYAYYAYAWOOHOOO YEEAAAAAAAAA'
                        }),
                        blockType: BlockType.REPORTER,
                        arguments: {
                            EFFECT: {
                                type: ArgumentType.STRING,
                                menu: 'effects',
                                defaultValue: "color"
                            }
                        }
                    },
                    "---"
                ],
                menus: {
                    effects: EffectOptions,
                    iframeClickable: {
                        acceptReporters: true,
                        items: [
                            'interactable',
                            'non-interactable'
                        ]
                    }
                }
            };
        }
        // permissions
        async IsWebsiteAllowed(url) {
            // TurboWarp-style permission prompt; allow when the host has no permission system
            if (typeof Scratch.canEmbed !== "function") return true;
            return await Scratch.canEmbed(url);
        }

        // utilities
        GetCurrentCanvas() {
            return this.runtime.renderer.canvas;
        }
        SetNewIFrame() {
            const iframe = document.createElement("iframe");
            iframe.onload = () => {
                this.iframeLoadedValue = true;
            };
            this.createdIframe = iframe;
            return iframe;
        }
        RemoveIFrame() {
            if (this.createdIframe) {
                this.createdIframe.remove();
                this.createdIframe = null;
            }
        }
        GetIFrameState() {
            if (this.createdIframe) {
                return true;
            }
            return false;
        }
        SetIFramePosition(iframe, x, y, width, height, rotation) {
            const frame = iframe;
            const stage = {
                width: this.runtime.stageWidth,
                height: this.runtime.stageHeight
            };
            frame.style.position = "absolute"; // position above canvas without pushing it down
            frame.style.width = `${(width / stage.width) * 100}%`; // convert pixel size to percentage for full screen
            frame.style.height = `${(height / stage.height) * 100}%`;
            frame.style.transformOrigin = "center center"; // rotation and translation begins at center

            // epic maths to place x and y at the center
            let xpos = ((((stage.width / 2) - (width / 2)) + x) / stage.width) * 100;
            let ypos = ((((stage.height / 2) - (height / 2)) - y) / stage.height) * 100;

            frame.style.left = `${xpos}%`;
            frame.style.top = `${ypos}%`;
            frame.style.transform = `rotate(${rotation - 90}deg)`;
            this.iframeSettings = {
                ...this.iframeSettings,
                x: x,
                y: y,
                rotation: rotation,
                width: width,
                height: height
            };

            // when switching between project page & editor, we need to place the iframe again since it gets lost
            if (iframe.parentElement !== this.GetCurrentCanvas().parentElement) {
                /* todo: create layers so that iframe appears above 3d every time this is done */
                this.GetCurrentCanvas().parentElement.prepend(iframe);
            }
        }
        SetIFrameColors(iframe, color, opacity) {
            const frame = iframe;

            const rgb = Cast.toRgbColorObject(color);
            const hex = rgbToHex(rgb);

            frame.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 100}%)`;
            this.iframeSettings = {
                ...this.iframeSettings,
                color: hex,
                opacity: Cast.toNumber(opacity)
            };

            // when switching between project page & editor, we need to place the iframe again since it gets lost
            if (iframe.parentElement !== this.GetCurrentCanvas().parentElement) {
                /* todo: create layers so that iframe appears above 3d every time this is done */
                this.GetCurrentCanvas().parentElement.prepend(iframe);
            }
        }
        SetIFrameClickable(iframe, clickable) {
            const frame = iframe;

            frame.style.pointerEvents = Cast.toBoolean(clickable) ? '' : 'none';
            this.iframeSettings = {
                ...this.iframeSettings,
                clickable: Cast.toBoolean(clickable)
            };

            // when switching between project page & editor, we need to place the iframe again since it gets lost
            if (iframe.parentElement !== this.GetCurrentCanvas().parentElement) {
                /* todo: create layers so that iframe appears above 3d every time this is done */
                this.GetCurrentCanvas().parentElement.prepend(iframe);
            }
        }
        GenerateCssFilter(color, grayscale, brightness, contrast, ghost, blur, invert, saturate, sepia) {
            return `hue-rotate(${(color / 200) * 360}deg) ` + // scratch color effect goes back to normal color at 200
                `grayscale(${grayscale}%) ` +
                `brightness(${brightness + 100}%) ` + // brightness at 0 will be 100
                `contrast(${contrast + 100}%) ` + // same thing here
                `opacity(${100 - ghost}%) ` + // opacity at 0 will be 100 but opacity at 100 will be 0
                `blur(${blur}px) ` +
                `invert(${invert}%) ` + // invert is actually a percentage lolol!
                `saturate(${saturate + 100}%) ` + // saturation at 0 will be 100
                `sepia(${sepia}%)`;
        }
        ApplyFilterOptions(iframe) {
            iframe.style.filter = this.GenerateCssFilter(
                this.iframeFilters.color,
                this.iframeFilters.grayscale,
                this.iframeFilters.brightness,
                this.iframeFilters.contrast,
                this.iframeFilters.ghost,
                this.iframeFilters.blur,
                this.iframeFilters.invert,
                this.iframeFilters.saturate,
                this.iframeFilters.sepia,
            );
        }

        createIframeElement() {
            this.RemoveIFrame();
            const iframe = this.SetNewIFrame();
            iframe.style.zIndex = 500;
            iframe.style.borderWidth = "0px";
            iframe.src = "data:text/html;base64,PERPQ1RZUEUgaHRtbD4KPGh0bWwgbGFuZz0iZW4tVVMiPgo8aGVhZD48L2hlYWQ+Cjxib2R5PjxoMT5IZWxsbyE8L2gxPjxwPllvdSd2ZSBqdXN0IGNyZWF0ZWQgYW4gaWZyYW1lIGVsZW1lbnQuPGJyPlVzZSB0aGlzIHRvIGVtYmVkIHdlYnNpdGVzIHdpdGggdGhlaXIgVVJMcy4gTm90ZSB0aGF0IHNvbWUgd2Vic2l0ZXMgbWlnaHQgbm90IGFsbG93IGlmcmFtZXMgdG8gd29yayBmb3IgdGhlaXIgd2Vic2l0ZS48L3A+PC9ib2R5Pgo8L2h0bWw+";
            this.displayWebsiteUrl = iframe.src;
            // positions iframe to fit stage
            this.SetIFramePosition(iframe, 0, 0, this.runtime.stageWidth, this.runtime.stageHeight, 90);
            // reset color & opacity
            this.SetIFrameColors(iframe, '#ffffff', 0);
            // reset other stuff
            this.SetIFrameClickable(iframe, true);
            // reset filters
            this.iframeFilters = ArrayToValue(EffectOptions.items.map(item => item.value), 0); // reset all filter stuff
            this.GetCurrentCanvas().parentElement.prepend(iframe); // adds the iframe above the canvas
            return iframe;
        }
        deleteIframeElement() {
            this.RemoveIFrame();
        }
        iframeElementExists() {
            return this.GetIFrameState();
        }
        setIframeUrl(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop

            let checkingUrl = args.URL;
            if (Cast.toString(args.URL) === 'about:blank') {
                this.createdIframe.src = "about:blank";
                this.displayWebsiteUrl = "about:blank";
                return;
            }
            this.IsWebsiteAllowed(checkingUrl).then(allowed => {
                if (!allowed || !this.createdIframe) return;
                this.createdIframe.src = args.URL;
                this.displayWebsiteUrl = this.createdIframe.src;
            });
        }
        setIframePosLeft(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            this.SetIFramePosition(iframe,
                Cast.toNumber(args.X),
                this.iframeSettings.y,
                this.iframeSettings.width,
                this.iframeSettings.height,
                this.iframeSettings.rotation,
            );
        }
        setIframePosTop(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            this.SetIFramePosition(iframe,
                this.iframeSettings.x,
                Cast.toNumber(args.Y),
                this.iframeSettings.width,
                this.iframeSettings.height,
                this.iframeSettings.rotation,
            );
        }
        setIframeSizeWidth(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            this.SetIFramePosition(iframe,
                this.iframeSettings.x,
                this.iframeSettings.y,
                Cast.toNumber(args.WIDTH),
                this.iframeSettings.height,
                this.iframeSettings.rotation,
            );
        }
        setIframeSizeHeight(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            this.SetIFramePosition(iframe,
                this.iframeSettings.x,
                this.iframeSettings.y,
                this.iframeSettings.width,
                Cast.toNumber(args.HEIGHT),
                this.iframeSettings.rotation,
            );
        }
        setIframeRotation(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            this.SetIFramePosition(iframe,
                this.iframeSettings.x,
                this.iframeSettings.y,
                this.iframeSettings.width,
                this.iframeSettings.height,
                Cast.toNumber(args.ROTATE),
            );
        }
        setIframeBackgroundColor(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            this.SetIFrameColors(iframe, args.COLOR, this.iframeSettings.opacity);
        }
        setIframeBackgroundOpacity(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            let opacity = Cast.toNumber(args.GHOST);
            if (opacity > 100) opacity = 100;
            if (opacity < 0) opacity = 0;
            opacity /= 100;
            opacity = 1 - opacity;
            this.SetIFrameColors(iframe, this.iframeSettings.color, opacity);
        }
        setIframeClickable(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            let clickable = false;
            if (Cast.toString(args.USABLE).toLowerCase() === 'interactable') {
                clickable = true;
            }
            if (Cast.toString(args.USABLE).toLowerCase() === 'on') {
                clickable = true;
            }
            if (Cast.toString(args.USABLE).toLowerCase() === 'enabled') {
                clickable = true;
            }
            if (Cast.toString(args.USABLE).toLowerCase() === 'true') {
                clickable = true;
            }
            this.SetIFrameClickable(iframe, clickable);
        }
        showIframeElement() {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            iframe.style.display = "";
        }
        hideIframeElement() {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            const iframe = this.createdIframe;
            iframe.style.display = "none";
        }

        getIframeLeft() {
            if (!this.GetIFrameState()) return 0; // iframe doesnt exist, stop
            return this.iframeSettings.x;
        }
        getIframeTop() {
            if (!this.GetIFrameState()) return 0; // iframe doesnt exist, stop
            return this.iframeSettings.y;
        }
        getIframeWidth() {
            if (!this.GetIFrameState()) return 480; // iframe doesnt exist, stop
            return this.iframeSettings.width;
        }
        getIframeHeight() {
            if (!this.GetIFrameState()) return 360; // iframe doesnt exist, stop
            return this.iframeSettings.height;
        }
        getIframeRotation() {
            if (!this.GetIFrameState()) return 90; // iframe doesnt exist, stop
            return this.iframeSettings.rotation;
        }
        getIframeTargetUrl() {
            if (!this.GetIFrameState()) return ''; // iframe doesnt exist, stop
            return this.displayWebsiteUrl;
        }
        getIframeBackgroundColor() {
            if (!this.GetIFrameState()) return '#ffffff'; // iframe doesnt exist, stop
            const rawColor = this.iframeSettings.color;
            const rgb = Cast.toRgbColorObject(rawColor);
            const hex = rgbToHex(rgb);
            return hex;
        }
        getIframeBackgroundOpacity() {
            if (!this.GetIFrameState()) return 100; // iframe doesnt exist, stop
            const rawOpacity = this.iframeSettings.opacity;
            return (1 - rawOpacity) * 100;
        }
        getIframeClickable() {
            if (!this.GetIFrameState()) return true; // iframe doesnt exist, stop
            return this.iframeSettings.clickable;
        }
        iframeElementIsHidden() {
            if (!this.GetIFrameState()) return false; // iframe doesnt exist, stop
            return this.createdIframe.style.display === "none";
        }

        whenIframeIsLoaded() {
            const value = this.iframeLoadedValue;
            this.iframeLoadedValue = false;
            return value;
        }

        // effect functions lolol
        iframeElementSetEffect(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            this.iframeFilters[args.EFFECT] = Cast.toNumber(args.AMOUNT);
            this.ApplyFilterOptions(this.createdIframe);
        }
        iframeElementChangeEffect(args) {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            this.iframeFilters[args.EFFECT] += Cast.toNumber(args.AMOUNT);
            this.ApplyFilterOptions(this.createdIframe);
        }
        iframeElementClearEffects() {
            if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
            this.iframeFilters = ArrayToValue(EffectOptions.items.map(item => item.value), 0); // reset all values to 0
            this.ApplyFilterOptions(this.createdIframe);
        }
        getIframeEffectAmount(args) {
            if (!this.GetIFrameState()) return 0; // iframe doesnt exist, stop
            return this.iframeFilters[args.EFFECT];
        }
    }

    Scratch.extensions.register(new JgIframeBlocks());
})(Scratch);
