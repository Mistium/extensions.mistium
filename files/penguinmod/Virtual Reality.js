// Name: Virtual Reality
// ID: jgVr
// Description: Show the stage in a VR headset with WebXR and read the headset's position and rotation.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_vr
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Virtual Reality must run unsandboxed.");

    const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;

    const SESSION_TYPE = "immersive-vr";

    // WebXR unfortunately does not give us Euler angles easily
    // so lets do it ourselves
    // thanks to twoerner94 for quaternion-to-euler on npm
    function quaternionToEuler(quat) {
        const q0 = quat[0];
        const q1 = quat[1];
        const q2 = quat[2];
        const q3 = quat[3];

        const Rx = Math.atan2(2 * (q0 * q1 + q2 * q3), 1 - (2 * (q1 * q1 + q2 * q2)));
        const Ry = Math.asin(2 * (q0 * q2 - q3 * q1));
        const Rz = Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - (2 * (q2 * q2 + q3 * q3)));

        const euler = [Rx, Ry, Rz];

        return euler;
    };

    function toRad(deg) {
        return deg * (Math.PI / 180);
    }
    function toDeg(rad) {
        return rad * (180 / Math.PI);
    }

    // same as twgl.m4.ortho, used by the split-screen drawing below
    function ortho(left, right, bottom, top, near, far) {
        const dst = new Float32Array(16);
        dst[0] = 2 / (right - left);
        dst[5] = 2 / (top - bottom);
        dst[10] = 2 / (near - far);
        dst[12] = (right + left) / (left - right);
        dst[13] = (top + bottom) / (bottom - top);
        dst[14] = (far + near) / (near - far);
        dst[15] = 1;
        return dst;
    }

    /**
     * PenguinMod's renderer can draw the stage into a WebXR layer (xrEnabled, xrLayer, xrSplitting, xrSplitOffset).
     * Other renderers can't, so wrap this renderer instance's draw() with PenguinMod's XR drawing code.
     * Normal drawing is untouched while XR is off.
     */
    function installXrDraw(renderer) {
        if (renderer._jgVrDraw) return;
        if (typeof renderer._drawThese !== "function") return; // unknown renderer, leave it alone
        const originalDraw = renderer.draw;
        renderer._jgVrDraw = true;
        if (typeof renderer.xrSplitOffset !== "number") renderer.xrSplitOffset = 0;
        renderer.draw = function () {
            if (!this.xrEnabled) return originalDraw.call(this);
            if (!this.dirty) return;
            // dont crash, just dont draw if we dont have a layer
            // can happen when exiting
            if (!this.xrLayer) return;
            this.dirty = false;
            this._doExitDrawRegion();

            const gl = this._gl;
            const xrLayer = this.xrLayer;
            gl.bindFramebuffer(gl.FRAMEBUFFER, xrLayer.framebuffer);
            gl.viewport(0, 0, xrLayer.framebufferWidth, xrLayer.framebufferHeight);
            // black full transparency apparently
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const snapshotRequested = this._snapshotCallbacks.length > 0;
            if (!this.xrSplitting) {
                // draw normally
                this._drawThese(this._drawList, "default", this._projection, {
                    framebufferWidth: gl.canvas.width,
                    framebufferHeight: gl.canvas.height,
                    skipPrivateSkins: snapshotRequested
                });
            } else {
                // draw split
                const width = xrLayer.framebufferWidth;
                const height = xrLayer.framebufferHeight;
                const stageWidth = this._xRight - this._xLeft;
                // #1 is used for the left eye, #2 is used for the right eye
                const projection1 = ortho(
                    this._xLeft + this.xrSplitOffset,
                    this._xRight + stageWidth + this.xrSplitOffset,
                    this._yBottom, this._yTop, -1, 1
                );
                const projection2 = ortho(
                    this._xLeft - stageWidth - this.xrSplitOffset,
                    this._xRight + stageWidth - stageWidth - this.xrSplitOffset,
                    this._yBottom, this._yTop, -1, 1
                );
                const opts = { framebufferWidth: width, framebufferHeight: height, skipPrivateSkins: snapshotRequested };
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(0, 0, width / 2, height);
                this._drawThese(this._drawList, "default", projection1, opts);
                gl.scissor(width / 2, 0, width / 2, height);
                this._drawThese(this._drawList, "default", projection2, opts);
                gl.disable(gl.SCISSOR_TEST);
            }

            if (snapshotRequested) {
                const snapshot = gl.canvas.toDataURL();
                this._snapshotCallbacks.forEach(cb => cb(snapshot));
                this._snapshotCallbacks = [];
                this.dirty = true;
            }
        };
    }

    /**
     * Class of 2025
     * @constructor
     */
    class jgVr {
        constructor() {
            /**
             * The runtime instantiating this block package.
             * @type {runtime}
             */
            this.runtime = Scratch.vm.runtime;
            this.open = false;
            this.session = null;

            this.view = null;
            this.localSpace = null;

            /**
             * If true, VR sessions will begin split
             * If false, VR sessions will begin with no split
             */
            this.splitState = false;
        }

        /**
         * @returns {object} metadata for this extension and its blocks.
         */
        getInfo() {
            return {
                id: 'jgVr',
                name: 'Virtual Reality',
                color1: '#3888cf',
                color2: '#2f72ad',
                blocks: [
                    // CORE
                    {
                        opcode: 'isSupported',
                        text: 'is vr supported?',
                        blockType: BlockType.BOOLEAN,
                        disableMonitor: true
                    },
                    {
                        opcode: 'createSession',
                        text: 'create vr session',
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'closeSession',
                        text: 'close vr session',
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'isOpened',
                        text: 'is vr open?',
                        blockType: BlockType.BOOLEAN,
                        disableMonitor: true
                    },
                    '---', // SCREEN SPLITTING SETTINGS
                    {
                        opcode: 'enableDisableSplitting',
                        text: 'turn auto-splitting [ONOFF]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            ONOFF: {
                                type: ArgumentType.STRING,
                                menu: 'onoff'
                            }
                        }
                    },
                    {
                        opcode: 'splittingOffset',
                        text: 'set auto-split offset to [PX] pixels',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            PX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 40
                            }
                        }
                    },
                    {
                        opcode: 'placement169',
                        text: '[SIDE] x placement',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            SIDE: {
                                type: ArgumentType.STRING,
                                menu: 'side'
                            }
                        }
                    },
                    '---', // HEADSET POSITION
                    {
                        opcode: 'headsetPosition',
                        text: 'headset position [VECTOR3]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            VECTOR3: {
                                type: ArgumentType.STRING,
                                menu: 'vector3'
                            }
                        }
                    },
                    {
                        opcode: 'headsetRotation',
                        text: 'headset rotation [VECTOR3]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            VECTOR3: {
                                type: ArgumentType.STRING,
                                menu: 'vector3'
                            }
                        }
                    },
                    '---', // CONTROLLER INPUT
                    {
                        opcode: 'controllerPosition',
                        text: 'controller #[COUNT] position [VECTOR3]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            COUNT: {
                                type: ArgumentType.NUMBER,
                                menu: 'count'
                            },
                            VECTOR3: {
                                type: ArgumentType.STRING,
                                menu: 'vector3'
                            }
                        }
                    },
                    {
                        opcode: 'controllerRotation',
                        text: 'controller #[COUNT] rotation [VECTOR3]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            COUNT: {
                                type: ArgumentType.NUMBER,
                                menu: 'count'
                            },
                            VECTOR3: {
                                type: ArgumentType.STRING,
                                menu: 'vector3'
                            }
                        }
                    },
                ],
                menus: {
                    vector3: {
                        acceptReporters: true,
                        items: [
                            "x",
                            "y",
                            "z",
                        ].map(item => ({ text: item, value: item }))
                    },
                    count: {
                        acceptReporters: true,
                        items: [
                            "1",
                            "2",
                        ].map(item => ({ text: item, value: item }))
                    },
                    side: {
                        acceptReporters: false,
                        items: [
                            "left",
                            "right",
                        ].map(item => ({ text: item, value: item }))
                    },
                    onoff: {
                        acceptReporters: false,
                        items: [
                            "on",
                            "off",
                        ].map(item => ({ text: item, value: item }))
                    },
                }
            };
        }

        // menus
        _isVector3Menu(option) {
            const normalized = Cast.toString(option).toLowerCase().trim();
            return ['x', 'y', 'z'].includes(normalized);
        }
        _onOffBoolean(onoff) {
            const normalized = Cast.toString(onoff).toLowerCase().trim();
            return normalized === 'on';
        }

        // util
        _getCanvas() {
            if (!this.runtime) return;
            if (!this.runtime.renderer) return;
            return this.runtime.renderer.canvas;
        }
        _getContext() {
            if (!this.runtime) return;
            if (!this.runtime.renderer) return;
            return this.runtime.renderer.gl;
        }
        _getRenderer() {
            if (!this.runtime) return;
            return this.runtime.renderer;
        }

        _disposeImmersive() {
            this.session = null;
            const gl = this._getContext();
            if (!gl) return;
            // bind frame buffer to canvas
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // reset renderer info
            const renderer = this._getRenderer();
            if (!renderer) return;
            renderer.xrEnabled = false;
            renderer.xrSplitting = false;
            renderer.xrLayer = null;
        }
        async _createImmersive() {
            if (!('xr' in navigator)) return false;
            const gl = this._getContext();
            if (!gl) return;
            const renderer = this._getRenderer();
            if (!renderer) return;

            installXrDraw(renderer);
            await gl.makeXRCompatible();
            const session = await navigator.xr.requestSession(SESSION_TYPE);
            this.session = session;
            this.open = true;

            renderer.xrEnabled = true;
            renderer.xrSplitting = this.splitState;

            // we need to make sure stuff is back to normal once the vr session is done
            // but this isnt always triggered by the close session block
            // the user can also close it themselves, so we need to handle that
            // this is also triggered by the close session block btw so we dont need
            // to repeat
            session.addEventListener("end", () => {
                this.open = false;
                this._disposeImmersive();
            });

            // set render state to use a new layer for the vr session
            // renderer will handle this
            const layer = new XRWebGLLayer(session, gl, {
                alpha: true,
                stencil: true,
                antialias: false,
            });
            session.updateRenderState({
                baseLayer: layer
            });
            renderer.xrLayer = layer;
            // for debugging & other extensions, never used by the renderer
            renderer._xrSession = session;

            // setup render loop
            const drawFrame = (_, frame) => {
                // breaks the loop once the session has ended
                if (!this.open) return;
                // get view info
                const viewerPose = frame.getViewerPose(this.localSpace);
                const transform = viewerPose.transform;
                // set view info
                this.view = {
                    position: [
                        transform.position.x,
                        transform.position.y,
                        transform.position.z
                    ],
                    quaternion: [
                        transform.orientation.w,
                        transform.orientation.y,
                        transform.orientation.x,
                        transform.orientation.z
                    ]
                }
                // force renderer to draw a new frame
                // otherwise we would only actually draw outside of this loop
                // which just ends up showing nothing
                // since rendering only happens in session.requestAnimationFrame
                renderer.dirty = true;
                renderer.draw();
                // loop again
                session.requestAnimationFrame(drawFrame);
            }
            session.requestAnimationFrame(drawFrame);

            // reference space
            session.requestReferenceSpace("local").then(space => {
                this.localSpace = space;
                // TODO: add "when position reset" hat?
                //     done with space.addEventListener("reset")
            });

            return session;
        }

        // blocks
        isSupported() {
            if (!('xr' in navigator)) return false;
            return navigator.xr.isSessionSupported(SESSION_TYPE);
        }
        isOpened() {
            return this.open;
        }

        createSession() {
            if (this.open) return;
            if (this.session) return;
            return this._createImmersive();
        }
        closeSession() {
            this.open = false;
            if (!this.session) return;
            return this.session.end();
        }

        // splitting blocks
        enableDisableSplitting(args) {
            const renderer = this._getRenderer();
            if (!renderer) return;

            const boolean = this._onOffBoolean(args.ONOFF);
            this.splitState = boolean;
            // setting xrSplitting outside of XR mode WILL work
            // so prevent this by just checking if we ARE in XR rendering mode
            if (!renderer.xrEnabled) return;
            renderer.xrSplitting = this.splitState;
        }
        splittingOffset(args) {
            const renderer = this._getRenderer();
            if (!renderer) return;

            // pixels should be negative
            // otherwise we push away from the center
            const pixels = Cast.toNumber(args.PX);
            renderer.xrSplitOffset = 0 - pixels;
        }

        // inputs
        headsetPosition(args) {
            if (!this.open) return 0;
            if (!this.session) return 0;
            if (!this.view) return 0;
            const vector3 = Cast.toString(args.VECTOR3).toLowerCase().trim();
            if (!this._isVector3Menu(vector3)) return 0;
            const axisArray = ['x', 'y', 'z'];
            const idx = axisArray.indexOf(vector3);
            return this.view.position[idx] * 100;
        }
        headsetRotation(args) {
            if (!this.open) return 0;
            if (!this.session) return 0;
            if (!this.view) return 0;
            const vector3 = Cast.toString(args.VECTOR3).toLowerCase().trim();
            if (!this._isVector3Menu(vector3)) return 0;
            const axisArray = ['x', 'y', 'z'];
            const idx = axisArray.indexOf(vector3);
            const quaternion = this.view.quaternion;
            const euler = quaternionToEuler(quaternion);
            return toDeg(euler[idx]);
        }

        // these blocks are in PenguinMod's block list but were never implemented there, so they report nothing
        controllerPosition() {
            return "";
        }
        controllerRotation() {
            return "";
        }

        // helper
        placement169(args) {
            const side = Cast.toString(args.SIDE).toLowerCase().trim();

            const width = this.runtime.stageWidth;
            const multX = width / 640;

            // this was found with experimentation
            // please tell me if stuff needs to be added for certain cases
            const valueR = ((640 / 4) - 40) * multX;
            const valueL = 0 - valueR;

            if (side === 'right') {
                return valueR;
            }
            return valueL;
        }
    }

    Scratch.extensions.register(new jgVr());
})(Scratch);
