// Name: Skins
// ID: lmsSkins
// Description: Have your sprites render as other images or costumes.
// By: LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// License: MIT AND LGPL-3.0

/*
  this extension was modified by @mistium
  
  modifications:
  Async loading of images
  Fix the delete all skins block in the vm
  Added gif animation support
  Blurring images
*/

/* generated l10n code */Scratch.translate.setup({ "fi": { "_Skins": "Ulkoasu", "_[ATTRIBUTE] of skin [NAME]": "ulkoasun [NAME] [ATTRIBUTE]", "_create SVG skin [SVG] as [NAME]": "luo SVG-ulkoasu [SVG] nimellä [NAME]", "_current skin of [TARGET]": "hahmon [TARGET] nykyinen ulkoasu", "_delete all skins": "poista kaikki ulkoasut", "_delete skin [NAME]": "poista ulkoasu [NAME]", "_height": "korkeus", "_load skin from URL [URL] as [NAME]": "lataa ulkoasu URL-osoitteesta [URL] nimellä [NAME]", "_load skin from [COSTUME] as [NAME]": "lataa ulkoasu asusteesta [COSTUME] nimellä [NAME]", "_restore skin of [TARGET]": "palauta hahmon [TARGET] ulkoasu", "_restore targets with skin [NAME]": "palauta ulkoasua [NAME] käyttävät hahmot", "_set skin of [TARGET] to [NAME]": "aseta hahmon [TARGET] ulkoasuksi [NAME]", "_skin [NAME] is loaded?": "onko ulkoasu [NAME] ladattu? ", "_width": "leveys" }, "it": { "_Skins": "Altro Costumi Plus ", "_height": "altezza", "_width": "larghezza" }, "ja": { "_Skins": "スキン", "_height": "高さ", "_width": "横幅" }, "ko": { "_Skins": "스킨", "_[ATTRIBUTE] of skin [NAME]": "스킨 [NAME]의 [ATTRIBUTE]", "_create SVG skin [SVG] as [NAME]": "SVG 스킨 [NAME] 만들기 [SVG] ", "_current skin of [TARGET]": "현재 스킨의 [TARGET]", "_delete all skins": "모든 스킨 삭제하기", "_delete skin [NAME]": "스킨 [NAME] 삭제하기", "_height": "높이", "_load skin from URL [URL] as [NAME]": "스킨 [NAME]을(를) URL에서 불러오기 [URL]", "_load skin from [COSTUME] as [NAME]": "스킨 [NAME]을(를) [COSTUME](으)로 불러오기", "_restore skin of [TARGET]": "[TARGET]의 스킨 복구하기", "_set skin of [TARGET] to [NAME]": "[TARGET]의 스킨을 [NAME](으)로 정하기", "_width": "넓이" }, "nb": { "_Skins": "Skinner", "_height": "høyde", "_width": "bredde" }, "nl": { "_[ATTRIBUTE] of skin [NAME]": "[ATTRIBUTE] van skin [NAME]", "_create SVG skin [SVG] as [NAME]": "creëer SVG-skin [SVG] als [NAME]", "_current skin of [TARGET]": "huidige skin van [TARGET]", "_delete all skins": "verwijder alle skins", "_delete skin [NAME]": "verwijder skin [NAME]", "_height": "hoogte", "_load skin from URL [URL] as [NAME]": "laad skin van URL [URL] als [NAME]", "_load skin from [COSTUME] as [NAME]": "laad skin van [COSTUME] als [NAME]", "_restore skin of [TARGET]": "herstel skin van [TARGET]", "_restore targets with skin [NAME]": "herstel alle met skin [NAME]", "_set skin of [TARGET] to [NAME]": "maak skin van [TARGET] [NAME]", "_skin [NAME] is loaded?": "skin [NAME] is geladen?", "_width": "breedte" }, "pl": { "_height": "wysokość", "_width": "szerokość" }, "ru": { "_Skins": "Скины", "_[ATTRIBUTE] of skin [NAME]": "[ATTRIBUTE] скина [NAME]", "_create SVG skin [SVG] as [NAME]": "создать SVG скин [SVG] как [NAME]", "_current skin of [TARGET]": "текущий скин [TARGET]", "_delete all skins": "удалить все скины", "_delete skin [NAME]": "удалить скин [NAME]", "_height": "высота", "_load skin from URL [URL] as [NAME]": "загрузить скин из URL [URL] как [NAME]", "_load skin from [COSTUME] as [NAME]": "загрузить скин из [COSTUME] как [NAME]", "_restore skin of [TARGET]": "восстановить скин [TARGET]", "_restore targets with skin [NAME]": "восстановить цели со скином [NAME]", "_set skin of [TARGET] to [NAME]": "задать скин [TARGET] на [NAME]", "_skin [NAME] is loaded?": "скин [NAME] загружен?", "_width": "ширина" }, "tr": { "_Skins": "Ciltler" }, "uk": { "_Skins": "Скіни", "_height": "висота", "_width": "ширина" }, "zh-cn": { "_Skins": "纹理", "_[ATTRIBUTE] of skin [NAME]": "纹理[NAME]的[ATTRIBUTE]", "_create SVG skin [SVG] as [NAME]": "创建SVG纹理[SVG]并命名为[NAME]", "_current skin of [TARGET]": "[TARGET]的当前纹理", "_delete all skins": "删除所有纹理", "_delete skin [NAME]": "删除纹理[NAME]", "_height": "高度", "_load skin from URL [URL] as [NAME]": "从URL[URL]加载纹理并命名为[NAME]", "_load skin from [COSTUME] as [NAME]": "从[COSTUME]加载纹理并命名为[NAME]", "_restore skin of [TARGET]": "恢复[TARGET]的纹理为原造型", "_restore targets with skin [NAME]": "恢复所有纹理为[NAME]的角色造型", "_set skin of [TARGET] to [NAME]": "将[TARGET]的纹理设为[NAME]", "_skin [NAME] is loaded?": "纹理[NAME]已加载？", "_width": "宽度" } });/* end generated l10n code */

(function (Scratch) {
  "use strict";

  const requireNonPackagedRuntime = (blockName) => {
    if (Scratch.vm.runtime.isPackaged) {
      alert(
        `To use the Skins ${blockName} block, the creator of the packaged project must uncheck "Remove raw asset data after loading to save RAM" under advanced settings in the packager.`
      );
      return false;
    }
    return true;
  };

  /**
   * @param {RenderWebGL.SVGSkin} svgSkin
   * @returns {Promise<void>}
   */
  const svgSkinFinishedLoading = (svgSkin) => {
    return new Promise((resolve) => {
      if (svgSkin._svgImageLoaded) {
        resolve();
      } else {
        svgSkin._svgImage.addEventListener("load", () => {
          resolve();
        });
        svgSkin._svgImage.addEventListener("error", () => {
          resolve();
        });
      }
    });
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const renderer = vm.renderer;
  const Cast = Scratch.Cast;

  const createdSkins = new Map();
  const loadingSkins = new Set();

  const gifState = {
    decoders: new Map(),
    animations: new Map(),
    frameCache: new Map(),
  };

  const blurCache = {
    programs: null,
    quadVBO: null,
    fbo1: null,
    fbo2: null,
    tempTex1: null,
    tempTex2: null,
    lastWidth: 0,
    lastHeight: 0,
    supportsHalfFloat: false,
    // Cache for recent GL state reads to avoid repeated expensive getParameter calls
    _stateCache: new WeakMap(),
    init(gl) {
      if (this.programs) return;

      const ext = gl.getExtension('OES_texture_half_float') || gl.getExtension('OES_texture_float');
      this.supportsHalfFloat = !!ext;

      const vs = `
        attribute vec2 aPos;
        varying vec2 vUV;
        void main() {
          vUV = aPos * 0.5 + 0.5;
          gl_Position = vec4(aPos, 0.0, 1.0);
        }
      `;

      const blurFS = (dirX, dirY) => `
        precision mediump float;
        uniform sampler2D uTex;
        uniform vec2 uTexel;
        varying vec2 vUV;
        
        void main() {
          vec2 dir = vec2(${dirX}.0, ${dirY}.0) * uTexel;
          vec4 sum = texture2D(uTex, vUV) * 0.29411764705882354;
          sum += texture2D(uTex, vUV + dir) * 0.23529411764705882;
          sum += texture2D(uTex, vUV - dir) * 0.23529411764705882;
          sum += texture2D(uTex, vUV + dir * 2.0) * 0.11764705882352941;
          sum += texture2D(uTex, vUV - dir * 2.0) * 0.11764705882352941;
          gl_FragColor = sum;
        }
      `;

      const copyFS = `
        precision mediump float;
        uniform sampler2D uTex;
        varying vec2 vUV;
        void main() {
          gl_FragColor = texture2D(uTex, vUV);
        }
      `;

      const compileShader = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };

      const createProgram = (vsSrc, fsSrc) => {
        const p = gl.createProgram();
        gl.attachShader(p, compileShader(gl.VERTEX_SHADER, vsSrc));
        gl.attachShader(p, compileShader(gl.FRAGMENT_SHADER, fsSrc));
        gl.linkProgram(p);
        return p;
      };

      const makeProgramObj = (fsSrc) => {
        const p = createProgram(vs, fsSrc);
        const obj = { program: p };
        obj.locs = {
          aPos: gl.getAttribLocation(p, 'aPos'),
          uTex: gl.getUniformLocation(p, 'uTex'),
          uTexel: gl.getUniformLocation(p, 'uTexel')
        };
        return obj;
      };

      this.programs = {
        hBlur: makeProgramObj(blurFS(1, 0)),
        vBlur: makeProgramObj(blurFS(0, 1)),
        copy: makeProgramObj(copyFS)
      };

      this.quadVBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVBO);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    },
    ensureTextures(gl, width, height) {
      if (this.tempTex1 && this.lastWidth === width && this.lastHeight === height) {
        return;
      }

      if (this.tempTex1) {
        gl.deleteTexture(this.tempTex1);
        gl.deleteTexture(this.tempTex2);
        gl.deleteFramebuffer(this.fbo1);
        gl.deleteFramebuffer(this.fbo2);
      }

      this.lastWidth = width;
      this.lastHeight = height;

      const texType = gl.UNSIGNED_BYTE;
      const format = gl.RGBA;

      // Create temp textures
      this.tempTex1 = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.tempTex1);
      gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, texType, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.tempTex2 = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.tempTex2);
      gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, texType, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.fbo1 = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo1);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempTex1, 0);

      this.fbo2 = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo2);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tempTex2, 0);
    },
    cleanup(gl) {
      if (this.tempTex1) {
        gl.deleteTexture(this.tempTex1);
        gl.deleteTexture(this.tempTex2);
        gl.deleteFramebuffer(this.fbo1);
        gl.deleteFramebuffer(this.fbo2);
        gl.deleteBuffer(this.quadVBO);
        this.tempTex1 = null;
        this.tempTex2 = null;
        this.fbo1 = null;
        this.fbo2 = null;
        this.quadVBO = null;
      }
    }
  };
  class GifAnimator {
    constructor(skinName, decoder, initialSkinId, renderer) {
      this.skinName = skinName;
      this.decoder = decoder;
      this.paused = false;
      this.renderer = renderer;
      this.frameIndex = 0;
      this.stopped = false;
      this.lastFrameTime = 0;
      this.accumulatedTime = 0;
      this.cache = gifState.frameCache.get(skinName);
      this.frameCount = this.cache.frameSkins.length;
      this.currentSkinId = initialSkinId;
    }

    async preloadFrames(count = 10) {
      const framesToLoad = Math.min(this.frameCount, count);
      const cache = gifState.frameCache.get(this.skinName);

      const preloadPromises = [];
      for (let i = 1; i < framesToLoad; i++) {
        preloadPromises.push(this._cacheFrame(i, cache));
      }

      await Promise.allSettled(preloadPromises);
    }

    async update(currentTime) {
      if (this.stopped || this.paused || !createdSkins.has(this.skinName)) {
        return this.stopped ? false : true;
      }

      if (this.lastFrameTime === 0) {
        this.lastFrameTime = currentTime;
        return true;
      }

      const deltaTime = currentTime - this.lastFrameTime;
      this.accumulatedTime += deltaTime;
      this.lastFrameTime = currentTime;

      const duration = this.cache.durations[this.frameIndex];

      if (this.accumulatedTime >= duration) {
        this.accumulatedTime -= duration;
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        this.currentSkinId = this.cache.frameSkins[this.frameIndex];

        this._updateDrawablesWithNewSkin();
        this.renderer.dirty = true;
      }

      return true;
    }

    _updateDrawablesWithNewSkin() {
      const drawables = this.renderer._allDrawables;
      const skins = this.renderer._allSkins;
      const cache = gifState.frameCache.get(this.skinName);

      if (!cache || !skins[this.currentSkinId]) return;

      for (const target of runtime.targets) {
        const drawable = drawables[target.drawableID];
        if (!drawable || !drawable.skin) continue;

        const currentSkinId = drawable.skin.id || drawable.skin._id;

        if (cache.frameSkins.includes(currentSkinId)) {
          drawable.skin = skins[this.currentSkinId];
          drawable._skinWasAltered();
          runtime.requestRedraw();
        }
      }
    }

    stop() {
      this.stopped = true;
    }

    pause() {
      this.paused = true;
    }

    resume() {
      this.paused = false;
      this.lastFrameTime = 0;
      this.accumulatedTime = 0;
    }

    cleanup() {
      this.stop();
      if (this.cache) {
        for (const skinId of this.cache.frameSkins) {
          if (this.renderer._allSkins[skinId]) {
            this.renderer.destroySkin(skinId);
          }
        }
        gifState.frameCache.delete(this.skinName);
      }
      if (this.decoder) {
        this.decoder.close();
        gifState.decoders.delete(this.skinName);
      }
      gifState.animations.delete(this.skinName);
    }
  }

  class Skins {
    constructor() {
      runtime.on("PROJECT_START", () => {
        this._refreshTargets();
      });

      runtime.on("PROJECT_STOP_ALL", () => {
        this._refreshTargets();
        this._stopAllGifAnimations();
      });

      runtime.on("PROJECT_LOADED", () => {
        this.deleteAllSkins();
        if (renderer && renderer.gl) {
          blurCache.cleanup(renderer.gl);
        }
      });

      runtime.on("BEFORE_EXECUTE", () => {
        this._updateAllGifAnimations();
      });

      runtime.on("RUNTIME_PAUSED", () => {
        this._pauseAllGifAnimations();
      });

      runtime.on("RUNTIME_UNPAUSED", () => {
        this._resumeAllGifAnimations();
      });
    }

    _pauseAllGifAnimations() {
      for (const animator of gifState.animations.values()) {
        animator.pause();
      }
    }

    _resumeAllGifAnimations() {
      for (const animator of gifState.animations.values()) {
        animator.resume();
      }
    }

    _updateAllGifAnimations() {
      if (gifState.animations.size === 0) return;

      const currentTime = performance.now();
      const animatorsToRemove = [];

      for (const [skinName, animator] of gifState.animations) {
        animator.update(currentTime).then(shouldContinue => {
          if (!shouldContinue) {
            animatorsToRemove.push(skinName);
          }
        }).catch(err => {
          console.warn(`GIF animation error for ${skinName}:`, err);
          animatorsToRemove.push(skinName);
        });
      }

      if (animatorsToRemove.length > 0) {
        Promise.resolve().then(() => {
          for (const skinName of animatorsToRemove) {
            const animator = gifState.animations.get(skinName);
            if (animator) {
              animator.cleanup();
            }
          }
        });
      }
    }

    getInfo() {
      return {
        id: "mistSkins",
        name: Scratch.translate("Skins"),
        color1: "#ff69b4",
        color2: "#ff5cae",
        color3: "#ff4fa8",
        docsURI: "https://extensions.turbowarp.org/Lily/Skins",
        blocks: [
          {
            opcode: "registerSVGSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("create SVG skin [SVG] as [NAME]"),
            arguments: {
              SVG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "<svg />",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },

          "---",

          {
            opcode: "registerCostumeSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("load skin from [COSTUME] as [NAME]"),
            arguments: {
              COSTUME: {
                type: Scratch.ArgumentType.COSTUME,
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },
          {
            opcode: "registerURLSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("load skin from URL [URL] as [NAME]"),
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://extensions.turbowarp.org/dango.png",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },
          {
            opcode: "loadSkinFromId",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("load skin from ID [ID] as [NAME]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },
          {
            opcode: "registerBlurredURLSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("load skin from URL [URL] as [NAME] and blur by [BLUR] pixels"),
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://extensions.turbowarp.org/dango.png",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
              BLUR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
              },
            },
            hideFromPalette: true,
          },
          {
            opcode: "getSkinLoaded",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("skin [NAME] is loaded?"),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },
          {
            opcode: "getSkinLoading",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("skin [NAME] is loading?"),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },
          {
            opcode: "getSkins",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("get all skins"),
          },

          "---",

          {
            opcode: "cloneSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: "clone skin [SKIN] as [NAME]",
            arguments: {
              SKIN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my clone",
              },
            },
          },
          {
            opcode: "blurExistingSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: "blur skin [SKIN] by [PASSES] passes as [NAME]",
            arguments: {
              SKIN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
              PASSES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "blurred skin",
              },
            },
          },

          "---",

          {
            opcode: "setSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set skin of [TARGET] to [NAME]"),
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "targetMenu",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },
          {
            opcode: "restoreSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("restore skin of [TARGET]"),
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "targetMenu",
              },
            },
          },
          {
            opcode: "restoreTargets",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("restore targets with skin [NAME]"),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },

          "---",

          {
            opcode: "getCurrentSkin",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("current skin of [TARGET]"),
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: "targetMenu",
              },
            },
          },
          {
            opcode: "getSkinAttribute",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[ATTRIBUTE] of skin [NAME]"),
            arguments: {
              ATTRIBUTE: {
                type: Scratch.ArgumentType.STRING,
                menu: "skinAttributes",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },

          "---",

          {
            opcode: "deleteSkin",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete skin [NAME]"),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my skin",
              },
            },
          },
          {
            opcode: "deleteAllSkins",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete all skins"),
          },
        ],
        menus: {
          targetMenu: {
            acceptReporters: true,
            items: "_getTargets",
          },
          skinAttributes: {
            acceptReporters: true,
            items: [
              {
                text: Scratch.translate("width"),
                value: "width",
              },
              {
                text: Scratch.translate("height"),
                value: "height",
              },
              {
                text: Scratch.translate("frames"),
                value: "frames"
              },
              {
                text: Scratch.translate("id"),
                value: "id"
              }
            ],
          },
        },
      };
    }

    async registerSVGSkin(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      const svgData = Cast.toString(args.SVG);

      let oldSkinId = null;
      if (createdSkins.has(skinName)) {
        oldSkinId = createdSkins.get(skinName);
      }

      // This generally takes a few frames, so yield the block
      const skinId = renderer.createSVGSkin(svgData);
      createdSkins.set(skinName, skinId);

      await svgSkinFinishedLoading(renderer._allSkins[skinId]);

      if (oldSkinId && renderer._allSkins[oldSkinId]) {
        this._refreshTargetsFromID(oldSkinId, false, skinId);
        renderer.destroySkin(oldSkinId);
      }
    }

    blurImage(args) {
      const dataUri = args.URL;
      const blur = args.BLUR;
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", {
            alpha: true,
            willReadFrequently: false,
            desynchronized: true
          });

          const scale = Math.min(1, 800 / Math.max(image.width, image.height));
          canvas.width = Math.floor(image.width * scale);
          canvas.height = Math.floor(image.height * scale);

          ctx.filter = `blur(${blur * scale}px)`;
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          const blurredDataUrl = canvas.toDataURL('image/png', 0.92);

          canvas.width = canvas.height = 0;
          resolve(blurredDataUrl);
        };
        image.onerror = function () {
          reject(new Error("Failed to load image from URL: " + dataUri));
        };
        image.src = dataUri;
      });
    }

    // Register an existing skin with the extension, no cloning or anything
    loadSkinFromId(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      const skinId = Cast.toNumber(args.ID);

      let oldSkinId = null;
      if (createdSkins.has(skinName)) {
        oldSkinId = createdSkins.get(skinName);
        this._stopGifAnimation(skinName);
      }

      const skin = renderer._allSkins[skinId];
      if (!skin) return;

      createdSkins.set(skinName, skinId);

      if (oldSkinId && renderer._allSkins[oldSkinId]) {
        this._refreshTargetsFromID(oldSkinId, false, skinId);
        renderer.destroySkin(oldSkinId);
      }
    }

    async registerBlurredURLSkin(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      const url = Cast.toString(args.URL);
      const blur = Cast.toNumber(args.BLUR);

      let oldSkinId = null;
      if (createdSkins.has(skinName)) {
        oldSkinId = createdSkins.get(skinName);
        this._stopGifAnimation(skinName);
      }

      loadingSkins.add(skinName);
      try {
        const dataUri = await this.blurImage({ URL: url, BLUR: blur });
        const skinId = await this._createURLSkin(dataUri, undefined, skinName);
        loadingSkins.delete(skinName);

        if (!skinId) return;
        createdSkins.set(skinName, skinId);

        if (oldSkinId && renderer._allSkins[oldSkinId]) {
          this._refreshTargetsFromID(oldSkinId, false, skinId);
          renderer.destroySkin(oldSkinId);
        }
      } catch (error) {
        loadingSkins.delete(skinName);
        console.error("Failed to create blurred skin:", error);
      }
    }

    async registerCostumeSkin(args, util) {
      if (!requireNonPackagedRuntime("add costume skin")) {
        return;
      }

      const skinName = `lms-${Cast.toString(args.NAME)}`;
      const costumeIndex = util.target.getCostumeIndexByName(args.COSTUME);
      if (costumeIndex === -1) return;
      const costume = util.target.sprite.costumes[costumeIndex];

      const url = costume.asset.encodeDataURI();
      const rotationCenterX = costume.rotationCenterX;
      const rotationCenterY = costume.rotationCenterY;

      let rotationCenter = [rotationCenterX, rotationCenterY];
      if (!rotationCenterX || !rotationCenterY) rotationCenter = undefined;

      let oldSkinId = null;
      if (createdSkins.has(skinName)) {
        oldSkinId = createdSkins.get(skinName);
        this._stopGifAnimation(skinName);
      }

      const skinId = await this._createURLSkin(url, rotationCenter, skinName);
      if (!skinId) return;

      createdSkins.set(skinName, skinId);

      if (oldSkinId && renderer._allSkins[oldSkinId]) {
        this._refreshTargetsFromID(oldSkinId, false, skinId);
        renderer.destroySkin(oldSkinId);
      }
    }

    async registerURLSkin(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      const url = Cast.toString(args.URL);

      let oldSkinId = null;
      if (createdSkins.has(skinName)) {
        oldSkinId = createdSkins.get(skinName);
        this._stopGifAnimation(skinName);
      }

      loadingSkins.add(skinName);
      try {
        const skinId = await this._createURLSkin(url, undefined, skinName);
        loadingSkins.delete(skinName);

        if (!skinId) return;
        createdSkins.set(skinName, skinId);

        if (oldSkinId && renderer._allSkins[oldSkinId]) {
          this._refreshTargetsFromID(oldSkinId, false, skinId);
          renderer.destroySkin(oldSkinId);
        }
      } catch (error) {
        loadingSkins.delete(skinName);
        console.error("Failed to create URL skin:", error);
      }
    }

    getSkinLoaded(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      return createdSkins.has(skinName);
    }

    getSkinLoading(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      return loadingSkins.has(skinName);
    }

    getSkins() {
      return JSON.stringify(Array.from(createdSkins.keys()).map((skin) => skin.replace(/^lms\-/, "")));
    }

    setSkin(args, util) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      if (!createdSkins.has(skinName)) return;

      const targetName = Cast.toString(args.TARGET);
      const target = this._getTargetFromMenu(targetName, util);
      if (!target) return;
      const drawableID = target.drawableID;

      const skinId = createdSkins.get(skinName);

      const animator = gifState.animations.get(skinName);
      if (animator) {
        renderer._allDrawables[drawableID].skin = renderer._allSkins[animator.currentSkinId];
      } else {
        renderer._allDrawables[drawableID].skin = renderer._allSkins[skinId];
      }

      renderer.dirty = true;
    }

    restoreSkin(args, util) {
      const targetName = Cast.toString(args.TARGET);
      const target = this._getTargetFromMenu(targetName, util);
      if (!target) return;
      target.updateAllDrawableProperties();
    }

    getCurrentSkin(args, util) {
      const targetName = Cast.toString(args.TARGET);
      const target = this._getTargetFromMenu(targetName, util);
      if (!target) return "";
      const drawableID = target.drawableID;

      const skinId = renderer._allDrawables[drawableID].skin._id;
      const skinName = this._getSkinNameFromID(skinId);
      return skinName ? skinName.replace("lms-", "") : "";
    }

    getSkinAttribute(args) {
      const skins = renderer._allSkins;
      const skinName = `lms-${Cast.toString(args.NAME)}`;

      if (!createdSkins.has(skinName)) return 0;
      const skinId = createdSkins.get(skinName);
      if (!skins[skinId]) return 0;

      const size = skins[skinId].size;
      const attribute = Cast.toString(args.ATTRIBUTE).toLowerCase();

      switch (attribute) {
        case "width":
          return Math.ceil(size[0]);
        case "height":
          return Math.ceil(size[1]);
        case "frames":
          const cache = gifState.frameCache.get(skinName);
          return cache ? cache.size : 0;
        case "id":
          return skinId;
        default:
          return 0;
      }
    }

    deleteSkin(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      if (!createdSkins.has(skinName)) return;
      const skinId = createdSkins.get(skinName);

      this._stopGifAnimation(skinName);
      this._refreshTargetsFromID(skinId, true);
      if (renderer._allSkins[skinId]) {
        renderer.destroySkin(skinId);
      }
      createdSkins.delete(skinName);
      loadingSkins.delete(skinName);
    }

    deleteAllSkins() {
      this._refreshTargets();
      this._stopAllGifAnimations();

      for (const [skinName, skinId] of createdSkins) {
        if (renderer._allSkins[skinId]) {
          renderer.destroySkin(skinId);
        }
      }

      createdSkins.clear();
      loadingSkins.clear();
    }

    restoreTargets(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      if (!createdSkins.has(skinName)) return;
      const skinId = createdSkins.get(skinName);

      this._refreshTargetsFromID(skinId, true);
    }

    cloneSkin(args) {
      const sourceSkinName = `lms-${Cast.toString(args.SKIN)}`;
      const newSkinName = `lms-${Cast.toString(args.NAME)}`;

      if (!createdSkins.has(sourceSkinName)) {
        console.warn(`Source skin "${args.SKIN}" not found`);
        return "";
      }

      const sourceSkinId = createdSkins.get(sourceSkinName);
      const originalSkin = renderer._allSkins[sourceSkinId];

      if (!originalSkin || !originalSkin._texture) {
        console.warn(`Source skin "${args.SKIN}" has no texture`);
        return "";
      }

      const gl = renderer.gl;
      const width = originalSkin._textureSize[0];
      const height = originalSkin._textureSize[1];

      // Create framebuffer to read texture data
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        originalSkin._texture,
        0
      );

      // Read pixels from texture
      const pixels = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      // Clean up framebuffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fb);

      // Create ImageData from pixels
      const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);

      // Check if skin already exists
      let oldSkinId = null;
      if (createdSkins.has(newSkinName)) {
        oldSkinId = createdSkins.get(newSkinName);
      }
      // Create new bitmap skin
      const clonedSkinId = renderer.createBitmapSkin(
        imageData,
        originalSkin._costumeResolution,
        originalSkin._rotationCenter.slice()
      );

      // Store the new skin
      createdSkins.set(newSkinName, clonedSkinId);

      // Refresh targets using the old skin
      if (oldSkinId && renderer._allSkins[oldSkinId]) {
        this._refreshTargetsFromID(oldSkinId, false, clonedSkinId);
        renderer.destroySkin(oldSkinId);
      }

      return Cast.toString(args.NAME);
    }

    blurExistingSkin(args) {
      const sourceSkinName = `lms-${Cast.toString(args.SKIN)}`;
      const newSkinName = `lms-${Cast.toString(args.NAME)}`;
      const passes = Cast.toNumber(args.PASSES);

      if (!createdSkins.has(sourceSkinName)) {
        console.warn(`Source skin "${args.SKIN}" not found`);
        return;
      }

      if (passes < 1) return;

      const sourceSkinId = createdSkins.get(sourceSkinName);
      const originalSkin = renderer._allSkins[sourceSkinId];

      if (!originalSkin || !originalSkin._texture) {
        console.warn(`Source skin "${args.SKIN}" has no texture`);
        return;
      }

      const newSkinId = createdSkins.get(newSkinName);
      if (!newSkinId) {

        // Clone the skin first
        const cloneResult = this.cloneSkin({
          SKIN: args.SKIN,
          NAME: args.NAME
        });

        if (!cloneResult) return;
      }

      // Now blur the cloned skin
      const skinToBlur = renderer._allSkins[newSkinId];

      this._blurSkinTexture(skinToBlur, passes);
      this._refreshTargetsOfSkin(newSkinId);
    }

    _blurSkinTexture(skin, passes) {
      const gl = renderer.gl;
      if (!gl) return;

      const texture = skin._texture;
      if (!texture) return;

      const width = skin._textureSize[0];
      const height = skin._textureSize[1];

      blurCache.init(gl);

      let downscale = 4;
      const pixelCount = width * height;
      if (pixelCount > 1000000) downscale = 8;
      else if (pixelCount > 250000) downscale = 6;
      else if (pixelCount < 40000) downscale = 2;

      const smallWidth = Math.max(1, Math.floor(width / downscale));
      const smallHeight = Math.max(1, Math.floor(height / downscale));

      blurCache.ensureTextures(gl, smallWidth, smallHeight);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const fboOutput = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboOutput);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.activeTexture(gl.TEXTURE0);

      gl.bindBuffer(gl.ARRAY_BUFFER, blurCache.quadVBO);

      const drawQuad = (programObj, tex, w, h) => {
        const program = programObj.program;
        const locs = programObj.locs || {};
        gl.useProgram(program);
        const aPos = locs.aPos !== undefined ? locs.aPos : gl.getAttribLocation(program, 'aPos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        const uTex = locs.uTex !== undefined ? locs.uTex : gl.getUniformLocation(program, 'uTex');
        if (uTex) gl.uniform1i(uTex, 0);
        const uTexel = locs.uTexel;
        if (uTexel) gl.uniform2f(uTexel, 1 / w, 1 / h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };

      gl.bindFramebuffer(gl.FRAMEBUFFER, blurCache.fbo1);
      gl.viewport(0, 0, smallWidth, smallHeight);
      drawQuad(blurCache.programs.copy, texture, width, height);

      for (let i = 0; i < passes; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, blurCache.fbo2);
        drawQuad(blurCache.programs.hBlur, blurCache.tempTex1, smallWidth, smallHeight);

        gl.bindFramebuffer(gl.FRAMEBUFFER, blurCache.fbo1);
        drawQuad(blurCache.programs.vBlur, blurCache.tempTex2, smallWidth, smallHeight);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, fboOutput);
      gl.viewport(0, 0, width, height);
      drawQuad(blurCache.programs.copy, blurCache.tempTex1, smallWidth, smallHeight);

      gl.deleteFramebuffer(fboOutput);

      renderer.dirty = true;
    }

    _stopGifAnimation(skinName) {
      const animator = gifState.animations.get(skinName);
      if (animator) {
        animator.cleanup();
      }
    }

    _stopAllGifAnimations() {
      for (const animator of gifState.animations.values()) {
        animator.cleanup();
      }
      gifState.animations.clear();
      gifState.decoders.clear();
      gifState.frameCache.clear();
    }

    async _decodeGif(skinName, buffer) {
      if (!window.ImageDecoder) {
        console.warn("ImageDecoder API not available. GIF animation will not work.");
        return null;
      }

      try {
        const decoder = new ImageDecoder({
          data: buffer,
          type: "image/gif",
          preferAnimation: true
        });

        await decoder.tracks.ready;

        const track = decoder.tracks.selectedTrack;
        const frameCount = track.frameCount;

        if (frameCount === 1) {
          const result = await decoder.decode({ frameIndex: 0 });
          const bitmap = await createImageBitmap(result.image);
          return renderer.createBitmapSkin(bitmap);
        }

        const frameSkins = new Array(frameCount);
        const durations = new Array(frameCount);
        gifState.frameCache.set(skinName, { frameSkins, durations });

        const decodePromises = [];
        for (let i = 0; i < frameCount; i++) {
          decodePromises.push(
            decoder.decode({ frameIndex: i }).then(async (result) => {
              const bitmap = await createImageBitmap(result.image);
              const skinId = renderer.createBitmapSkin(bitmap);
              durations[i] = result.image.duration / 1000.0 || 0.1;
              frameSkins[i] = skinId;
              bitmap.close();
            })
          );
        }

        await Promise.all(decodePromises);

        gifState.decoders.set(skinName, decoder);

        const initialSkinId = frameSkins[0];
        const animator = new GifAnimator(skinName, decoder, initialSkinId, renderer);
        gifState.animations.set(skinName, animator);

        return initialSkinId;
      } catch (e) {
        console.error("Error decoding GIF:", e);
        return null;
      }
    }

    _refreshTargetsFromID(skinId, reset, newId) {
      const drawables = renderer._allDrawables;
      const skins = renderer._allSkins;

      for (const target of runtime.targets) {
        const drawableID = target.drawableID;
        if (!drawables[drawableID]) continue;

        const targetSkin = drawables[drawableID].skin;
        if (!targetSkin) continue;

        const targetSkinId = targetSkin.id || targetSkin._id;

        if (targetSkinId === skinId) {
          target.updateAllDrawableProperties();
          if (!reset && newId && skins[newId])
            drawables[drawableID].skin = skins[newId];
        }
      }
    }

    _refreshTargetsOfSkin(skinId) {
      const drawables = renderer._allDrawables;
      const skins = renderer._allSkins;

      for (const target of runtime.targets) {
        const drawableID = target.drawableID;
        if (!drawables[drawableID]) continue;

        const targetSkin = drawables[drawableID].skin;
        if (!targetSkin) continue;

        const targetSkinId = targetSkin.id || targetSkin._id;

        if (targetSkinId === skinId) {
          target.updateAllDrawableProperties();
          drawables[drawableID]._skinWasAltered()
        }
      }
    }

    _refreshTargets() {
      for (const target of runtime.targets) {
        target.updateAllDrawableProperties();
      }
    }

    _getSkinNameFromID(skinId) {
      for (const [skinName, id] of createdSkins) {
        if (id === skinId) return skinName;
      }
      return null;
    }

    _getTargetFromMenu(targetName, util) {
      let target = Scratch.vm.runtime.getSpriteTargetByName(targetName);
      if (targetName === "_myself_") target = util.target;
      if (targetName === "_stage_") target = runtime.getTargetForStage();
      return target;
    }

    async _createURLSkin(URL, rotationCenter, skinName) {
      let imageData;
      try {
        if (await Scratch.canFetch(URL)) {
          imageData = await Scratch.fetch(URL);
        } else {
          return null;
        }
      } catch (error) {
        console.error("Failed to fetch URL:", error);
        return null;
      }

      const contentType = imageData.headers.get("Content-Type");

      try {
        if (contentType === "image/svg+xml") {
          const svgText = await imageData.text();
          return renderer.createSVGSkin(svgText, rotationCenter);
        } else if (contentType === "image/gif") {
          const buffer = await imageData.arrayBuffer();
          return await this._decodeGif(skinName, buffer);
        } else if (
          contentType === "image/png" ||
          contentType === "image/jpeg" ||
          contentType === "image/bmp"
        ) {
          const blob = await imageData.blob();
          const bitmap = await createImageBitmap(blob);
          return renderer.createBitmapSkin(bitmap);
        }
      } catch (error) {
        console.error("Failed to create skin:", error);
        return null;
      }

      return null;
    }

    _getTargets() {
      const spriteNames = [
        { text: "myself", value: "_myself_" },
        { text: "Stage", value: "_stage_" },
      ];
      const targets = Scratch.vm.runtime.targets;
      for (let index = 1; index < targets.length; index++) {
        const target = targets[index];
        if (target.isOriginal) {
          const targetName = target.getName();
          spriteNames.push({
            text: targetName,
            value: targetName,
          });
        }
      }
      return spriteNames;
    }
  }

  Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumSkins = new Skins());
})(Scratch);
