// Name: Shaders
// Author: Mistium
// Description: Run GLSL shaders on your sprites

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Shaders must run unsandboxed.");
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const renderer = runtime.renderer;
    const cast = Scratch.Cast;

    class ShadersExtension {
        constructor() {
            this.canvases = {};
            this.shaders = {};
        }

        getInfo() {
            return {
                id: 'mistiumshaders',
                name: 'Shaders',
                color1: '#3f87ff',
                color2: '#2f6fd4',
                color3: '#1d4ca0',
                blocks: [
                    {
                        opcode: 'newShader',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'new shader [ID] vertex [VERT] fragment [FRAG] width [W] height [H]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'shader1' },
                            VERT: { type: Scratch.ArgumentType.STRING, defaultValue: 'vertex source...' },
                            FRAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'fragment source...' },
                            W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 256 },
                            H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 256 },
                        },
                    },
                    {
                        opcode: 'resizeShader',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'resize shader [ID] to width [W] height [H]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'shader1' },
                            W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 256 },
                            H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 256 },
                        },
                    },
                    {
                        opcode: 'setUniform',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set uniform [NAME] on [ID] type [TYPE] to [VAL]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'u_time' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'shader1' },
                            TYPE: { type: Scratch.ArgumentType.STRING, menu: 'uniformTypes' },
                            VAL: { type: Scratch.ArgumentType.STRING, defaultValue: '1.0' },
                        },
                    },
                    {
                        opcode: 'renderShader',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'render shader [ID] to myself',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'shader1' },
                        },
                    },
                    {
                        opcode: 'deleteShader',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete shader [ID]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'shader1' },
                        },
                    },
                    {
                        opcode: 'allShaders',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all shaders',
                    },
                    {
                        opcode: 'shaderExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'shader [ID] exists?',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'shader1' },
                        },
                    },
                    {
                        opcode: 'getUniform',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'uniform [NAME] of [ID]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'u_time' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'shader1' },
                        },
                    },

                    "---",
                    {
                        opcode: 'vec2',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'vec2 [X], [Y]',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        },
                    },
                    {
                        opcode: 'vec3',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'vec3 [X], [Y], [Z]',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        },
                    },
                    {
                        opcode: 'vec4',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'vec4 [X], [Y], [Z], [W]',
                        arguments: {
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        },
                    },
                ],
                menus: {
                    uniformTypes: {
                        acceptReporters: true,
                        items: ['float', 'vec2', 'vec3', 'vec4', 'int'],
                    },
                },
            };
        }

        createGLContext(width, height) {
            const canvas = new OffscreenCanvas(width, height);
            const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
            if (!gl) throw new Error('WebGL not supported');
            return { canvas, gl };
        }

        // Canvas sizes must be positive integers; NaN/0/negatives break OffscreenCanvas and WebGL
        _size(value) {
            return Math.max(1, Math.round(cast.toNumber(value)) || 1);
        }

        compileShader(gl, source, type) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const log = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error(log);
            }
            return shader;
        }

        newShader(args) {
            const id = cast.toString(args.ID);
            if (this.shaders[id]) {
                this.deleteShader({ ID: id });
            }
            const vertSrc = cast.toString(args.VERT);
            const fragSrc = cast.toString(args.FRAG);
            const width = this._size(args.W);
            const height = this._size(args.H);

            const { canvas, gl } = this.createGLContext(width, height);

            try {
                const vertShader = this.compileShader(gl, vertSrc, gl.VERTEX_SHADER);
                const fragShader = this.compileShader(gl, fragSrc, gl.FRAGMENT_SHADER);

                const program = gl.createProgram();
                gl.attachShader(program, vertShader);
                gl.attachShader(program, fragShader);
                gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    throw new Error(gl.getProgramInfoLog(program));
                }

                // Fullscreen quad, created once instead of on every render
                const buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                    -1, -1, 1, -1, -1, 1,
                    -1, 1, 1, -1, 1, 1
                ]), gl.STATIC_DRAW);

                this.shaders[id] = { gl, program, buffer, uniforms: {}, width, height };
                this.canvases[id] = canvas;
            } catch (e) {
                // Don't leak a WebGL context per failed compile; browsers cap live contexts
                gl.getExtension('WEBGL_lose_context')?.loseContext();
                throw e;
            }
        }

        resizeShader(args) {
            const id = cast.toString(args.ID);
            const width = this._size(args.W);
            const height = this._size(args.H);

            const shader = this.shaders[id];
            if (!shader) return;

            shader.width = width;
            shader.height = height;
            shader.gl.canvas.width = width;
            shader.gl.canvas.height = height;
        }

        _parseUniform(type, value) {
            const parts = cast.toString(value).split(',').map(Number);
            const size = { vec2: 2, vec3: 3, vec4: 4 }[type] || 1;
            // Pad/trim to the exact length WebGL requires, NaN -> 0
            const out = [];
            for (let i = 0; i < size; i++) out.push(parts[i] || 0);
            return out;
        }

        setUniform(args) {
            const id = cast.toString(args.ID);
            const name = cast.toString(args.NAME);
            const type = cast.toString(args.TYPE);
            const value = args.VAL;

            const shader = this.shaders[id];
            if (!shader) return;

            const { gl, program } = shader;
            gl.useProgram(program);

            const location = gl.getUniformLocation(program, name);
            if (!location) return;

            const parts = this._parseUniform(type, value);

            // Uniform values persist in the program, so they only need setting once
            switch (type) {
                case 'float':
                    gl.uniform1f(location, parts[0]);
                    break;
                case 'vec2':
                    gl.uniform2fv(location, parts);
                    break;
                case 'vec3':
                    gl.uniform3fv(location, parts);
                    break;
                case 'vec4':
                    gl.uniform4fv(location, parts);
                    break;
                case 'int':
                    gl.uniform1i(location, Math.trunc(parts[0]));
                    break;
                default:
                    console.error(`Unknown uniform type: ${type}`);
                    return;
            }

            shader.uniforms[name] = { type, value: parts.join(',') };
        }

        runShader(args) {
            const id = cast.toString(args.ID);
            const shader = this.shaders[id];
            if (!shader) return;

            const { gl, program, buffer, width, height } = shader;
            gl.viewport(0, 0, width, height);
            gl.useProgram(program);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            const posLoc = gl.getAttribLocation(program, 'a_position');
            if (posLoc !== -1) {
                gl.enableVertexAttribArray(posLoc);
                gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
            }

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            gl.flush();
        }

        _setSkin(skinId, target) {
            if (!target) return;
            const drawableID = target.drawableID;

            renderer._allDrawables[drawableID].skin = renderer._allSkins[skinId];
        }

        renderShader(args, util) {
            const id = cast.toString(args.ID);
            const shader = this.shaders[id];
            if (!shader) return;

            const glCanvas = this.canvases[id];
            if (!glCanvas) return;

            this.runShader({ ID: id });

            let skinId = glCanvas.skin;
            if (skinId && renderer._allSkins[skinId]) {
                renderer.updateBitmapSkin(skinId, glCanvas, 1);
            } else {
                skinId = renderer.createBitmapSkin(glCanvas, 1);
                glCanvas.skin = skinId;
            }

            this._setSkin(skinId, util.target);
            runtime.requestRedraw();
        }

        deleteShader(args) {
            const id = cast.toString(args.ID);
            const shader = this.shaders[id];
            if (!shader) return;

            const skinId = this.canvases[id]?.skin;
            if (skinId && renderer._allSkins[skinId]) {
                // Put sprites showing this shader back on their costume before the skin goes away
                for (const target of runtime.targets) {
                    const drawable = renderer._allDrawables[target.drawableID];
                    if (drawable && drawable.skin === renderer._allSkins[skinId]) {
                        target.updateAllDrawableProperties();
                    }
                }
                renderer.destroySkin(skinId);
            }

            const { gl, program, buffer } = shader;
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            delete this.shaders[id];
            delete this.canvases[id];
        }

        allShaders() {
            return JSON.stringify(Object.keys(this.shaders));
        }

        shaderExists(args) {
            return Object.prototype.hasOwnProperty.call(this.shaders, cast.toString(args.ID));
        }

        getUniform(args) {
            const shader = this.shaders[cast.toString(args.ID)];
            const uniform = shader && shader.uniforms[cast.toString(args.NAME)];
            return uniform ? uniform.value : '';
        }

        vec2(args) {
            const x = cast.toNumber(args.X);
            const y = cast.toNumber(args.Y);
            return `${x},${y}`;
        }

        vec3(args) {
            const x = cast.toNumber(args.X);
            const y = cast.toNumber(args.Y);
            const z = cast.toNumber(args.Z);
            return `${x},${y},${z}`;
        }

        vec4(args) {
            const x = cast.toNumber(args.X);
            const y = cast.toNumber(args.Y);
            const z = cast.toNumber(args.Z);
            const w = cast.toNumber(args.W);
            return `${x},${y},${z},${w}`;
        }
    }

    Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumShaders = new ShadersExtension());
})(Scratch);
