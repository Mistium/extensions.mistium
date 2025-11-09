// Name: Shaders
// Author: Mistium
// Description: Run GLSL shaders on your sprites

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const renderer = runtime.renderer;
    const cast = Scratch.Cast;

    class ShadersExtension {
        constructor() {
            this.canvases = {};
            this.shaders = {};
            console.log('ShadersExtension initialized');
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

        compileShader(gl, source, type) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        newShader(args) {
            const id = args.ID;
            if (this.shaders[id]) {
                this.deleteShader({ ID: id });
            }
            const vertSrc = args.VERT;
            const fragSrc = args.FRAG;
            const width = cast.toNumber(args.W);
            const height = cast.toNumber(args.H);

            const { canvas, gl } = this.createGLContext(width, height);

            const vertShader = this.compileShader(gl, vertSrc, gl.VERTEX_SHADER);
            const fragShader = this.compileShader(gl, fragSrc, gl.FRAGMENT_SHADER);

            const program = gl.createProgram();
            gl.attachShader(program, vertShader);
            gl.attachShader(program, fragShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(program));
            }

            this.shaders[id] = { gl, program, uniforms: {}, width, height };
            this.canvases[id] = canvas;
        }

        resizeShader(args) {
            const id = args.ID;
            const width = cast.toNumber(args.W);
            const height = cast.toNumber(args.H);

            const shader = this.shaders[id];
            if (!shader) return;

            shader.width = width;
            shader.height = height;
            shader.gl.canvas.width = width;
            shader.gl.canvas.height = height;
            shader.outputCanvas.width = width;
            shader.outputCanvas.height = height;
        }

        setUniform(args) {
            const id = args.ID;
            const name = args.NAME;
            const type = args.TYPE;
            const value = args.VAL;

            const shader = this.shaders[id];
            if (!shader) return;

            const { gl, program } = shader;
            gl.useProgram(program);

            const location = gl.getUniformLocation(program, name);
            if (!location) return;

            const parts = value.toString().split(',').map(Number);

            switch (type) {
                case 'float':
                    gl.uniform1f(location, parseFloat(value));
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
                    gl.uniform1i(location, parseInt(value));
                    break;
                default:
                    console.error(`Unknown uniform type: ${type}`);
                    return;
            }

            shader.uniforms[name] = { type, value };
        }

        runShader(args) {
            const id = args.ID;
            const shader = this.shaders[id];
            if (!shader) return;

            const { gl, program, width, height, uniforms } = shader;
            gl.viewport(0, 0, width, height);
            gl.useProgram(program);

            for (const [name, { type, value }] of Object.entries(uniforms)) {
                const loc = gl.getUniformLocation(program, name);
                if (!loc) continue;
                const parts = value.toString().split(',').map(Number);
                switch (type) {
                    case 'float': gl.uniform1f(loc, parts[0]); break;
                    case 'vec2': gl.uniform2fv(loc, parts); break;
                    case 'vec3': gl.uniform3fv(loc, parts); break;
                    case 'vec4': gl.uniform4fv(loc, parts); break;
                    case 'int': gl.uniform1i(loc, parts[0]); break;
                }
            }

            const verts = new Float32Array([
                -1, -1, 1, -1, -1, 1,
                -1, 1, 1, -1, 1, 1
            ]);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

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
            const id = args.ID;
            const shader = this.shaders[id];
            if (!shader) return;

            const glCanvas = this.canvases[id];
            if (!glCanvas) return;

            const gl = glCanvas.getContext('webgl', { preserveDrawingBuffer: true });
            if (!gl) {
                console.error('No WebGL context found.');
                return;
            }

            if (!shader.outputCanvas) {
                const outputCanvas = document.createElement('canvas');
                outputCanvas.width = glCanvas.width;
                outputCanvas.height = glCanvas.height;
                shader.outputCanvas = outputCanvas;
            }

            this.runShader({ ID: id });
            const outputCanvas = shader.outputCanvas;
            const ctx = outputCanvas.getContext('2d');
            ctx.drawImage(glCanvas, 0, 0);

            const renderer = vm.renderer;
            let skinId = outputCanvas.skin;
            if (skinId && renderer._allSkins[skinId]) {
                renderer.updateBitmapSkin(skinId, outputCanvas, 1);
            } else {
                skinId = renderer.createBitmapSkin(outputCanvas);
                outputCanvas.skin = skinId;
            }

            this._setSkin(skinId, util.target);
        }

        deleteShader(args) {
            const id = args.ID;
            const shader = this.shaders[id];
            if (!shader) return;

            const { gl, program } = shader;
            gl.deleteProgram(program);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            delete this.shaders[id];
            delete this.canvases[id];
        }

        allShaders() {
            return JSON.stringify(Object.keys(this.shaders));
        }

        vec2(args) {
            const x = cast.toNumber(args.X) | 0;
            const y = cast.toNumber(args.Y) | 0;
            return `${x},${y}`;
        }

        vec3(args) {
            const x = cast.toNumber(args.X) | 0;
            const y = cast.toNumber(args.Y) | 0;
            const z = cast.toNumber(args.Z) | 0;
            return `${x},${y},${z}`;
        }

        vec4(args) {
            const x = cast.toNumber(args.X) | 0;
            const y = cast.toNumber(args.Y) | 0;
            const z = cast.toNumber(args.Z) | 0;
            const w = cast.toNumber(args.W) | 0;
            return `${x},${y},${z},${w}`;
        }
    }

    Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumShaders = new ShadersExtension());
})(Scratch);
