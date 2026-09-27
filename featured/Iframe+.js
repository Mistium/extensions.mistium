// Name: IframePlus
// By: @mistium on discord
// Description: Have many iframes at once

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Iframe+ must run unsandboxed.");
    }

    const iframesMap = new Map();
    const messageMap = new Map();
    const SANDBOX = [
        "allow-same-origin",
        "allow-scripts",
        "allow-forms",
        "allow-modals",
        "allow-popups",
        "allow-presentation",
        "allow-pointer-lock",
    ];

    const featurePolicy = {};
    let globalZ = 1;

    const getFrame = (ID) => iframesMap.get(Scratch.Cast.toString(ID));

    window.addEventListener("message", (event) => {
        for (const [id, info] of iframesMap.entries()) {
            try {
                if (info.iframe.contentWindow && event.source === info.iframe.contentWindow) {
                    const msg = typeof event.data === "string" ? event.data : JSON.stringify(event.data);
                    messageMap.set(id, msg);
                    break;
                }
            } catch (_) {}
        }
    });

    class IframePlusExtension {
        constructor() {
            // Percent-based layout depends on the stage size, so re-layout when it changes
            Scratch.vm.on("STAGE_SIZE_CHANGED", () => {
                for (const info of iframesMap.values()) this.updateFrameAttributes(info);
            });
            Scratch.vm.runtime.on("RUNTIME_DISPOSED", () => this.removeAllIframes());
        }

        setZIndex({ ID }) {
            const iframeInfo = getFrame(ID);
            if (iframeInfo) {
                const { iframe } = iframeInfo;
                iframe.style.zIndex = String(++globalZ);
            }
        }

        getInfo() {
            return {
                name: Scratch.translate("Iframe Plus"),
                id: "iframePlus",
                color1: '#333d82',
                blocks: [
                    {
                        opcode: "display",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("show website [URL] with ID [ID]"),
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://example.com",
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "showHtmlContent",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("show HTML content [HTML] with ID [ID]"),
                        arguments: {
                            HTML: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<p>Hello, world!</p>",
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "duplicate",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("duplicate iframe [ID] as new ID [NEW_ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            NEW_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe2",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "remove",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("remove iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "removeAllIframes",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("remove all iframes"),
                    },
                    "---",
                    {
                        opcode: "getIframeTitle",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("get title of iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "getIframeURL",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("get URL of iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "setIframeURL",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set URL of iframe with ID [ID] to [URL]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://example.com",
                            },
                        },
                    },
                    {
                        opcode: "reload",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("reload iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "show",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("show iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "hide",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("hide iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "isVisible",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate("iframe with ID [ID] is visible?"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "doesExist",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: Scratch.translate("iframe with ID [ID] exists?"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "resize",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("resize iframe with ID [ID] to width [WIDTH] and height [HEIGHT]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 480,
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 360,
                            },
                        },
                    },
                    {
                        opcode: "move",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("move iframe with ID [ID] to x [X] and y [Y]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                        },
                    },
                    {
                        opcode: "setCorners",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set iframe with ID [ID] top-left corner at x [X1] and y [Y1] bottom-right corner at x [X2] and y [Y2]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            X1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            X2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                            Y2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                        },
                    },
                    {
                        opcode: "setScale",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set iframe with ID [ID] scale to [SCALE]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "setOpacity",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set opacity of iframe with ID [ID] to [OPACITY]%"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                        },
                    },
                    {
                        opcode: "setBorderRadius",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set border radius of iframe with ID [ID] to [RADIUS]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            RADIUS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                        },
                    },
                    {
                        opcode: "setBorder",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set border of iframe with ID [ID] to width [WIDTH] and color [COLOR]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2,
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: "#ffffff",
                            },
                        },
                    },
                    {
                        opcode: "clearBorder",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("clear border of iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "setInteractive",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set iframe with ID [ID] interactive to [INTERACTIVE]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            INTERACTIVE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "boolMenu",
                                defaultValue: "true",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "setLayerOfIframe",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("set layer of iframe with ID [ID] to [LAYER]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                            LAYER: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "setZIndex",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("bring iframe with ID [ID] to front"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "getAllIframeIDs",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("all iframe IDs"),
                    },
                    {
                        opcode: "getTotalLayers",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("total number of layers"),
                    },
                    {
                        opcode: "getLayerOfIframe",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("layer of iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "sendMessage",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("send message [MSG] to iframe with ID [ID]"),
                        arguments: {
                            MSG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello",
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "getLastMessage",
                        blockType: Scratch.BlockType.REPORTER,
                        text: Scratch.translate("last message from iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                    {
                        opcode: "clearLastMessage",
                        blockType: Scratch.BlockType.COMMAND,
                        text: Scratch.translate("clear last message from iframe with ID [ID]"),
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "iframe1",
                            },
                        },
                    },
                ],

                menus: {
                    boolMenu: {
                        acceptReporters: true,
                        items: [
                            { text: Scratch.translate("true"), value: "true" },
                            { text: Scratch.translate("false"), value: "false" },
                        ],
                    },
                },
            };
        }

        setLayerOfIframe({ ID, LAYER }) {
            const iframeInfo = getFrame(ID);
            if (iframeInfo) {
                const { iframe } = iframeInfo;
                iframe.style.zIndex = String(Math.round(Scratch.Cast.toNumber(LAYER)));
            }
        }

        getTotalLayers() {
            return iframesMap.size;
        }

        getLayerOfIframe({ ID }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return -1;
            return parseInt(iframeInfo.iframe.style.zIndex || "0");
        }

        async display({ URL, ID }) {
            this.remove({ ID });

            try {
                if (await Scratch.canEmbed(URL)) {
                    const src = Scratch.Cast.toString(URL);
                    this.createFrame(src, ID);
                }
            } catch (e) {
                console.error(e);
            }
        }

        showHtmlContent({ HTML, ID }) {
            this.remove({ ID });

            const src = `data:text/html;charset=utf-8,${encodeURIComponent(Scratch.Cast.toString(HTML))}`;
            this.createFrame(src, ID);
        }

        duplicate({ ID, NEW_ID }) {
            const info = getFrame(ID);
            if (!info) return;
            this.remove({ ID: NEW_ID });
            this.createFrame(info.iframe.src, Scratch.Cast.toString(NEW_ID));
            const newInfo = getFrame(NEW_ID);
            if (!newInfo) return;
            newInfo.x = info.x;
            newInfo.y = info.y;
            newInfo.width = info.width;
            newInfo.height = info.height;
            newInfo.scale = info.scale;
            newInfo.interactive = info.interactive;
            newInfo.iframe.style.opacity = info.iframe.style.opacity;
            newInfo.iframe.style.borderRadius = info.iframe.style.borderRadius;
            newInfo.iframe.style.border = info.iframe.style.border;
            this.updateFrameAttributes(newInfo);
        }

        remove({ ID }) {
            ID = Scratch.Cast.toString(ID);
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                Scratch.renderer.removeOverlay(iframeInfo.iframe);
                iframeInfo.iframe.remove();
                iframesMap.delete(ID);
                messageMap.delete(ID);
            }
        }

        removeAllIframes() {
            for (const { iframe } of iframesMap.values()) {
                Scratch.renderer.removeOverlay(iframe);
                iframe.remove();
            }
            iframesMap.clear();
            messageMap.clear();
        }

        show({ ID }) {
            const iframeInfo = getFrame(ID);
            if (iframeInfo) {
                iframeInfo.iframe.style.display = "";
            }
        }

        hide({ ID }) {
            const iframeInfo = getFrame(ID);
            if (iframeInfo) {
                iframeInfo.iframe.style.display = "none";
            }
        }

        isVisible({ ID }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return false;
            return iframeInfo.iframe.style.display !== "none";
        }

        doesExist({ ID }) {
            return iframesMap.has(Scratch.Cast.toString(ID));
        }

        getIframeTitle({ ID }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return "";
            try {
                return iframeInfo.iframe.contentDocument?.title || "";
            } catch (e) {
                return "";
            }
        }

        getIframeURL({ ID }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return "";
            return iframeInfo.iframe.src || "";
        }

        async setIframeURL({ ID, URL }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            const src = Scratch.Cast.toString(URL);
            try {
                if (await Scratch.canEmbed(src)) {
                    iframeInfo.iframe.src = src;
                }
            } catch (e) {
                console.error(e);
            }
        }

        reload({ ID }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            try {
                iframeInfo.iframe.contentWindow?.location.reload();
            } catch (e) {
                const src = iframeInfo.iframe.src;
                iframeInfo.iframe.src = "";
                setTimeout(() => { iframeInfo.iframe.src = src; }, 0);
            }
        }

        resize({ ID, WIDTH, HEIGHT }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            iframeInfo.width = Scratch.Cast.toNumber(WIDTH);
            iframeInfo.height = Scratch.Cast.toNumber(HEIGHT);
            this.updateFrameAttributes(iframeInfo);
        }

        move({ ID, X, Y }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            iframeInfo.x = Scratch.Cast.toNumber(X);
            iframeInfo.y = Scratch.Cast.toNumber(Y);
            this.updateFrameAttributes(iframeInfo);
        }

        setCorners({ ID, X1, Y1, X2, Y2 }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            X1 = Scratch.Cast.toNumber(X1);
            Y1 = Scratch.Cast.toNumber(Y1);
            X2 = Scratch.Cast.toNumber(X2);
            Y2 = Scratch.Cast.toNumber(Y2);
            // x/y are the centre of the frame
            iframeInfo.x = (X1 + X2) / 2;
            iframeInfo.y = (Y1 + Y2) / 2;
            iframeInfo.width = Math.abs(X2 - X1);
            iframeInfo.height = Math.abs(Y2 - Y1);
            this.updateFrameAttributes(iframeInfo);
        }

        setScale({ ID, SCALE }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            iframeInfo.scale = Scratch.Cast.toNumber(SCALE);
            this.updateFrameAttributes(iframeInfo);
        }

        setOpacity({ ID, OPACITY }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            const clamped = Math.max(0, Math.min(100, Scratch.Cast.toNumber(OPACITY)));
            iframeInfo.iframe.style.opacity = String(clamped / 100);
        }

        setBorderRadius({ ID, RADIUS }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            iframeInfo.iframe.style.borderRadius = `${Scratch.Cast.toNumber(RADIUS)}px`;
            iframeInfo.iframe.style.overflow = "hidden";
        }

        setBorder({ ID, WIDTH, COLOR }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            iframeInfo.iframe.style.border = `${Scratch.Cast.toNumber(WIDTH)}px solid ${Scratch.Cast.toString(COLOR)}`;
            iframeInfo.iframe.style.boxSizing = "border-box";
        }

        clearBorder({ ID }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            iframeInfo.iframe.style.border = "none";
        }

        setInteractive({ ID, INTERACTIVE }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            iframeInfo.interactive = Scratch.Cast.toString(INTERACTIVE) !== "false";
            this.updateFrameAttributes(iframeInfo);
        }

        sendMessage({ MSG, ID }) {
            const iframeInfo = getFrame(ID);
            if (!iframeInfo) return;
            try {
                iframeInfo.iframe.contentWindow?.postMessage(Scratch.Cast.toString(MSG), "*");
            } catch (e) {
                console.error(e);
            }
        }

        getLastMessage({ ID }) {
            return messageMap.get(Scratch.Cast.toString(ID)) ?? "";
        }

        clearLastMessage({ ID }) {
            messageMap.delete(Scratch.Cast.toString(ID));
        }

        getAllIframeIDs() {
            return JSON.stringify(Array.from(iframesMap.keys()));
        }

        createFrame(src, ID) {
            ID = ID.toString();

            const iframe = document.createElement("iframe");
            iframe.style.border = "none";
            iframe.style.position = "absolute";
            iframe.style.zIndex = String(++globalZ);

            iframe.setAttribute("id", ID);
            iframe.setAttribute("sandbox", SANDBOX.join(" "));
            iframe.setAttribute(
                "allow",
                Object.entries(featurePolicy)
                    .map(([name, permission]) => `${name} ${permission}`)
                    .join("; ")
            );
            iframe.setAttribute("allowtransparency", "true");
            iframe.setAttribute("src", src);

            const overlay = Scratch.renderer.addOverlay(iframe, "manual");

            iframesMap.set(ID, {
                iframe,
                overlay,
                width: 480,
                height: 360,
                x: 0,
                y: 0,
                interactive: true,
                scale: 1
            });

            this.updateFrameAttributes(getFrame(ID));
        }

        updateFrameAttributes(iframeInfo) {
            if (!iframeInfo) return;

            const { iframe, width, height, x, y, scale, interactive } = iframeInfo;

            // Percentages keep the frame aligned when the stage is resized or goes fullscreen
            const { stageWidth, stageHeight } = Scratch.vm.runtime;

            iframe.style.width = `${(width / stageWidth) * 100}%`;
            iframe.style.height = `${(height / stageHeight) * 100}%`;
            iframe.style.left = `${(0.5 + (x - width / 2) / stageWidth) * 100}%`;
            iframe.style.top = `${(0.5 - (y + height / 2) / stageHeight) * 100}%`;

            iframe.style.transform = scale === 1 ? "" : `scale(${scale})`;
            iframe.style.transformOrigin = "center";

            iframe.style.pointerEvents = interactive ? "auto" : "none";
        }
    }

    Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumIframe = new IframePlusExtension());
})(Scratch);
