class WebGLBlurExtension {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'mistiumLowLevelSkins',
            name: 'Low Level Skins',
            blocks: [
                {
                    opcode: 'cloneSkin',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'clone skin [SKIN]',
                    arguments: {
                        SKIN: { type: 'string', defaultValue: '' }
                    }
                },
                {
                    opcode: 'blurSkin',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'blur skin [SKIN] passes [PASSES]',
                    arguments: {
                        SKIN: { type: 'string', defaultValue: '' },
                        PASSES: { type: 'number', defaultValue: 1 }
                    }
                }
            ]
        };
    }

    cloneSkin({ SKIN }) {
        const skinId = +SKIN || -1;
        const renderer = vm.renderer;
        const originalSkin = renderer._allSkins[skinId];
        
        if (!originalSkin || !originalSkin._texture) {
            return -1;
        }
        
        const gl = renderer.gl;
        const width = originalSkin._textureSize[0];
        const height = originalSkin._textureSize[1];
        
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, 
            gl.COLOR_ATTACHMENT0, 
            gl.TEXTURE_2D, 
            originalSkin._texture, 
            0
        );
        
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(fb);

        const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);

        const clonedSkinId = renderer.createBitmapSkin(
            imageData,
            originalSkin._costumeResolution,
            originalSkin._rotationCenter.slice()
        );
        
        return clonedSkinId;
    }

    async blurSkin(args) {
        const gl = window.vm.renderer._gl;
        if (!gl) return;

        const skin = args.SKIN;
        if (!skin || typeof skin !== 'object') return;

        const passes = args.PASSES || 1;
        if (passes < 1) return;
        
        const texture = skin._texture;
        if (!texture) return;
        
        const width = skin._textureSize[0];
        const height = skin._textureSize[1];

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const createFBO = (tex) => {
            const fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            return fbo;
        };

        const tempTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tempTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const fboTemp = createFBO(tempTex);
        const fboOutput = createFBO(texture);

        const vs = `
            attribute vec2 aPos;
            varying vec2 vUV;
            void main() {
                vUV = aPos * 0.5 + 0.5;
                gl_Position = vec4(aPos, 0.0, 1.0);
            }
        `;

        const fs = (dirX, dirY) => `
            precision mediump float;
            uniform sampler2D uTex;
            uniform vec2 uTexel;
            varying vec2 vUV;
            
            vec4 sampleTex(vec2 uv) {
                // Return transparent black if outside bounds
                if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                    return vec4(0.0);
                }
                return texture2D(uTex, uv);
            }
            
            void main() {
                vec2 direction = vec2(float(${dirX}), float(${dirY}));
                vec4 sum = sampleTex(vUV) * 0.227027;
                sum += sampleTex(vUV + uTexel * direction * 1.0) * 0.1945946;
                sum += sampleTex(vUV - uTexel * direction * 1.0) * 0.1945946;
                sum += sampleTex(vUV + uTexel * direction * 2.0) * 0.1216216;
                sum += sampleTex(vUV - uTexel * direction * 2.0) * 0.1216216;
                sum += sampleTex(vUV + uTexel * direction * 3.0) * 0.0540541;
                sum += sampleTex(vUV - uTexel * direction * 3.0) * 0.0540541;
                sum += sampleTex(vUV + uTexel * direction * 4.0) * 0.0162162;
                sum += sampleTex(vUV - uTexel * direction * 4.0) * 0.0162162;
                gl_FragColor = sum;
            }
        `;

        const compileShader = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
            }
            return s;
        };

        const createProgram = (vsSrc, fsSrc) => {
            const p = gl.createProgram();
            gl.attachShader(p, compileShader(gl.VERTEX_SHADER, vsSrc));
            gl.attachShader(p, compileShader(gl.FRAGMENT_SHADER, fsSrc));
            gl.linkProgram(p);
            if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(p));
            }
            return p;
        };

        const hProg = createProgram(vs, fs(1, 0));
        const vProg = createProgram(vs, fs(0, 1));

        const quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const drawQuad = (program, tex) => {
            gl.useProgram(program);
            const loc = gl.getAttribLocation(program, 'aPos');
            gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(gl.getUniformLocation(program, 'uTex'), 0);
            gl.uniform2f(gl.getUniformLocation(program, 'uTexel'), 1 / width, 1 / height);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        const oldViewport = gl.getParameter(gl.VIEWPORT);
        const oldFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        const oldBlend = gl.getParameter(gl.BLEND);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        for (let i = 0; i < passes; i++) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fboTemp);
            gl.viewport(0, 0, width, height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            drawQuad(hProg, texture);

            gl.bindFramebuffer(gl.FRAMEBUFFER, fboOutput);
            gl.viewport(0, 0, width, height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            drawQuad(vProg, tempTex);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, oldFramebuffer);
        gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);
        if (!oldBlend) gl.disable(gl.BLEND);

        gl.deleteFramebuffer(fboTemp);
        gl.deleteFramebuffer(fboOutput);
        gl.deleteTexture(tempTex);
        gl.deleteProgram(hProg);
        gl.deleteProgram(vProg);
        gl.deleteBuffer(quadVBO);

        vm.renderer.dirty = true;
    }
}

Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumLowLevelSkins = new WebGLBlurExtension());