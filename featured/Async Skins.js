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
  const renderer = runtime.renderer;
  const Cast = Scratch.Cast;

  const createdSkins = new Map();
  const loadingSkins = new Set();
  
  const gifState = {
    decoders: new Map(),
    animations: new Map(),
    frameCache: new Map(),
  };
  class GifAnimator {
    constructor(skinName, decoder, skinId, renderer) {
      this.skinName = skinName;
      this.decoder = decoder;
      this.skinId = skinId;
      this.renderer = renderer;
      this.frameIndex = 0;
      this.stopped = false;
      this.paused = false;
      this.timeoutId = null;
      this.rafId = null;
      this.remainingTime = 0;
      this.currentDuration = 0;
      this.startTime = 0;
      this.track = decoder.tracks.selectedTrack;
      this.frameCount = this.track.frameCount;
      
      gifState.frameCache.set(skinName, new Map());
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

    async _cacheFrame(frameIndex, cache) {
      if (cache.has(frameIndex)) return;
      
      try {
        const result = await this.decoder.decode({ frameIndex });
        const bitmap = await createImageBitmap(result.image);
        const duration = result.image.duration / 1000.0 || 100;
        
        cache.set(frameIndex, { bitmap, duration });
      } catch (e) {
        console.warn(`Failed to cache frame ${frameIndex}:`, e);
      }
    }

    async renderFrame(frameIndex) {
      if (this.stopped || this.paused || !createdSkins.has(this.skinName)) {
        if (this.stopped) this.cleanup();
        return;
      }

      const cache = gifState.frameCache.get(this.skinName);
      if (!cache) {
        this.cleanup();
        return;
      }

      try {
        let frameData = cache.get(frameIndex);
        
        if (!frameData) {
          await this._cacheFrame(frameIndex, cache);
          frameData = cache.get(frameIndex);
          if (!frameData) {
            this.stop();
            return;
          }
        }

        const { bitmap, duration } = frameData;
        
        this.renderer.updateBitmapSkin(this.skinId, bitmap, 1);

        this.frameIndex = (frameIndex + 1) % this.frameCount;
        this.currentDuration = duration;
        this.startTime = Date.now();

        this.timeoutId = setTimeout(() => {
          this.rafId = requestAnimationFrame(() => this.renderFrame(this.frameIndex));
        }, duration);

      } catch (e) {
        console.error("Error rendering GIF frame:", e);
        if (frameIndex !== 0) {
          this.frameIndex = 0;
          this.renderFrame(0);
        } else {
          this.stop();
        }
      }
    }

    pause() {
      this.paused = true;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.remainingTime = this.currentDuration - (Date.now() - this.startTime);
        if (this.remainingTime < 0) this.remainingTime = 0;
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    resume() {
      if (!this.paused || this.stopped) return;
      this.paused = false;
      const timeToWait = this.remainingTime > 0 ? this.remainingTime : this.currentDuration;
      this.remainingTime = 0;
      if (timeToWait > 0) {
        this.timeoutId = setTimeout(() => {
          this.rafId = requestAnimationFrame(() => this.renderFrame(this.frameIndex));
        }, timeToWait);
      }
    }

    stop() {
      this.stopped = true;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    cleanup() {
      this.stop();
      
      const cache = gifState.frameCache.get(this.skinName);
      if (cache) {
        for (const frameData of cache.values()) {
          if (frameData.bitmap && typeof frameData.bitmap.close === 'function') {
            frameData.bitmap.close();
          }
        }
        gifState.frameCache.delete(this.skinName);
      }
      
      const decoder = gifState.decoders.get(this.skinName);
      if (decoder) {
        decoder.close();
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
      });

      this.isPaused = vm.runtime.ioDevices?.clock?._paused ?? false;
      this.pauseChecker = setInterval(() => {
        const currentPaused = vm.runtime.ioDevices?.clock?._paused ?? false;
        if (currentPaused !== this.isPaused) {
          this.isPaused = currentPaused;
          for (const animator of gifState.animations.values()) {
            if (this.isPaused) {
              animator.pause();
            } else {
              animator.resume();
            }
          }
        }
      }, 50);
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

      if (oldSkinId) {
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
          const ctx = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.filter = "blur(" + blur + "px)";
          ctx.drawImage(image, 0, 0, image.width, image.height);
          const blurredDataUrl = canvas.toDataURL();
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          resolve(blurredDataUrl);
        };
        image.onerror = function () {
          reject(new Error("Failed to load image from URL: " + dataUri));
        };
        image.src = dataUri;
      });
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
        const skinId = await this._createURLSkin(dataUri, null, skinName);
        loadingSkins.delete(skinName);
        
        if (!skinId) return;
        createdSkins.set(skinName, skinId);

        if (oldSkinId) {
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
      if (!rotationCenterX || !rotationCenterY) rotationCenter = null;

      let oldSkinId = null;
      if (createdSkins.has(skinName)) {
        oldSkinId = createdSkins.get(skinName);
        this._stopGifAnimation(skinName);
      }

      const skinId = await this._createURLSkin(url, rotationCenter, skinName);
      if (!skinId) return;
      
      createdSkins.set(skinName, skinId);

      if (oldSkinId) {
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
        const skinId = await this._createURLSkin(url, null, skinName);
        loadingSkins.delete(skinName);
        
        if (!skinId) return;
        createdSkins.set(skinName, skinId);

        if (oldSkinId) {
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
      renderer._allDrawables[drawableID].skin = renderer._allSkins[skinId];
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
      renderer.destroySkin(skinId);
      createdSkins.delete(skinName);
      loadingSkins.delete(skinName);
    }

    deleteAllSkins() {
      this._refreshTargets();
      this._stopAllGifAnimations();
      
      for (const [skinName, skinId] of createdSkins) {
        renderer.destroySkin(skinId);
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

        const result = await decoder.decode({ frameIndex: 0 });
        const firstFrame = await createImageBitmap(result.image);
        const duration = result.image.duration / 1000.0 || 100;

        const skinId = renderer.createBitmapSkin(firstFrame);
        
        const track = decoder.tracks.selectedTrack;
        if (track.frameCount > 1) {
          const animator = new GifAnimator(skinName, decoder, skinId, renderer);
          
          gifState.decoders.set(skinName, decoder);
          gifState.animations.set(skinName, animator);
          
          const cache = gifState.frameCache.get(skinName);
          cache.set(0, { bitmap: firstFrame, duration });

          animator.currentDuration = duration;

          animator.preloadFrames(10).catch(e => {
            console.warn("Frame preloading failed:", e);
          });

          setTimeout(() => {
            requestAnimationFrame(() => animator.renderFrame(1));
          }, duration);
        }

        return skinId;
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