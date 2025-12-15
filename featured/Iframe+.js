// Name: IframePlus
// By: @mistium on discord
// Description: Have many iframes at once

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";

    const iframesMap = new Map();
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

    class IframePlusExtension {
        setZIndex({
            ID
        }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                const {
                    iframe
                } = iframeInfo;
                const windowIndex = this.getWindowIndex(ID);
                iframe.style.zIndex = windowIndex;
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
                ],
            };
        }

        setLayerOfIframe({ ID, LAYER }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                const { iframe, overlay } = iframeInfo;

                if (overlay && overlay.style) {
                    overlay.style.zIndex = LAYER;
                }

                if (iframe && iframe.style) {
                    iframe.style.zIndex = LAYER;
                }
            }
        }

        getTotalLayers() {
            return Scratch.renderer._overlays.length;
        }

        getLayerOfIframe({ ID }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                const { overlay } = iframeInfo;
                return Scratch.renderer._overlays.indexOf(overlay);
            }
            return -1;
        }

        async display({ URL, ID }) {
            this.remove({ ID });

            if (await Scratch.canEmbed(URL)) {
                const src = Scratch.Cast.toString(URL);
                this.createFrame(src, ID);
            }
        }

        showHtmlContent({ HTML, ID }) {
            this.remove({ ID });

            const src = `data:text/html;charset=utf-8,${encodeURIComponent(HTML)}`;
            this.createFrame(src, ID);
        }

        remove({ ID }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                Scratch.renderer.removeOverlay(iframeInfo.iframe);
                iframeInfo.iframe.remove();
                iframesMap.delete(ID);
            }
        }

        getAllIframeIDs() {
            return Array.from(iframesMap.keys());
        }

        removeAllIframes() {
            for (const { iframe, overlay } of iframesMap.values()) {
                Scratch.renderer.removeOverlay(iframe);
                Scratch.renderer.removeOverlay(overlay);
            }
            iframesMap.clear();
        }

        show({ ID }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                const { iframe } = iframeInfo;
                iframe.style.display = "";
            }
        }

        hide({ ID }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                const { iframe } = iframeInfo;
                iframe.style.display = "none";
            }
        }

        getIframeTitle({ ID }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                try {
                    return iframeInfo.iframe.contentDocument?.title || "";
                } catch (e) {
                    console.warn("Cannot access iframe title (cross-origin):", e);
                    return "";
                }
            }
            return "";
        }

        resize({ ID, WIDTH, HEIGHT }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                iframeInfo.x -= (WIDTH - iframeInfo.width) / 2;
                iframeInfo.y -= (HEIGHT - iframeInfo.height) / 2;
                iframeInfo.width = WIDTH;
                iframeInfo.height = HEIGHT;
                this.updateFrameAttributes(iframeInfo);
            }
        }

        move({ ID, X, Y }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                iframeInfo.x = X - iframeInfo.width / 2;
                iframeInfo.y = Y - iframeInfo.height / 2;
                this.updateFrameAttributes(iframeInfo);
            }
        }


        setCorners({ ID, X1, Y1, X2, Y2 }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                iframeInfo.x = X1;
                iframeInfo.y = Y1;
                iframeInfo.width = X2 - X1;
                iframeInfo.height = Y2 - Y1;
                this.updateFrameAttributes(iframeInfo);
            }
        }

        setScale({ ID, SCALE }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                iframeInfo.scale = SCALE;
                this.updateFrameAttributes(iframeInfo);
            }
        }

        getIframeURL(ID) {
            ID = ID.ID;
            const iframe = document.getElementById(ID);
            if (iframe) {
                const iframeUrl = iframe.src;
                return iframeUrl;
            } else {
                console.error("Iframe with ID " + ID.toString() + " not found.");
                return null;
            }
        }

        setIframeURL({ ID, URL }) {
            const iframeInfo = iframesMap.get(ID);
            if (iframeInfo) {
                const { iframe } = iframeInfo;
                iframe.src = URL;
            }
        }

        getIframeDataURL(iframe) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = iframe.offsetWidth;
            canvas.height = iframe.offsetHeight;

            context.drawImage(iframe.contentWindow.document.body, 0, 0, canvas.width, canvas.height);

            return canvas.toDataURL();
        }

        createFrame(src, ID) {
            ID = ID.toString()
            const iframe = document.createElement("iframe");
            iframe.style.border = "none";
            iframe.style.position = "absolute";
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

            this.updateFrameAttributes(iframesMap.get(ID));
        }


        updateFrameAttributes(iframeInfo) {
            if (!iframeInfo) return;

            const {
                iframe,
                overlay,
                width,
                height,
                x,
                y,
                interactive,
                scale
            } = iframeInfo;

            const stageScale = Scratch.vm.renderer.canvas.clientWidth / Scratch.vm.runtime.stageWidth;

            const centerX = Scratch.vm.runtime.stageWidth / 2;
            const centerY = Scratch.vm.runtime.stageHeight / 2;

            const scaledX = (centerX + x) * stageScale;
            const scaledY = (centerY - y) * stageScale;

            iframe.style.width = `${width * scale}px`;
            iframe.style.height = `${height * scale}px`;

            iframe.style.transform = `translate(${scaledX}px, ${scaledY}px) scale(${1 / (scale / stageScale)})`;
            iframe.style.transformOrigin = "top left";

            overlay.mode = "manual";
            Scratch.renderer._updateOverlays();

            iframe.style.pointerEvents = interactive ? "auto" : "none";
        }

    }

    Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumIframe = new IframePlusExtension());
})(Scratch);