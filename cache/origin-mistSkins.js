// Name: Skins
// ID: lmsSkins
// Description: Have your sprites render as other images or costumes.
// By: LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// License: MIT AND LGPL-3.0

/*
  this extension was modified by @mistium in order to make it load images asyncronously, fix the delete all skins block in the vm and improve it generally.
  i added a block to load a image with a specified amount of blur as well.
*/

/* generated l10n code */Scratch.translate.setup({ "fi": { "_Skins": "Ulkoasu", "_[ATTRIBUTE] of skin [NAME]": "ulkoasun [NAME] [ATTRIBUTE]", "_create SVG skin [SVG] as [NAME]": "luo SVG-ulkoasu [SVG] nimellÃ¤ [NAME]", "_current skin of [TARGET]": "hahmon [TARGET] nykyinen ulkoasu", "_delete all skins": "poista kaikki ulkoasut", "_delete skin [NAME]": "poista ulkoasu [NAME]", "_height": "korkeus", "_load skin from URL [URL] as [NAME]": "lataa ulkoasu URL-osoitteesta [URL] nimellÃ¤ [NAME]", "_load skin from [COSTUME] as [NAME]": "lataa ulkoasu asusteesta [COSTUME] nimellÃ¤ [NAME]", "_restore skin of [TARGET]": "palauta hahmon [TARGET] ulkoasu", "_restore targets with skin [NAME]": "palauta ulkoasua [NAME] kÃ¤yttÃ¤vÃ¤t hahmot", "_set skin of [TARGET] to [NAME]": "aseta hahmon [TARGET] ulkoasuksi [NAME]", "_skin [NAME] is loaded?": "onko ulkoasu [NAME] ladattu? ", "_width": "leveys" }, "it": { "_Skins": "Altro Costumi Plus ", "_height": "altezza", "_width": "larghezza" }, "ja": { "_Skins": "ã‚¹ã‚­ãƒ³", "_height": "é«˜ã•", "_width": "æ¨ªå¹…" }, "ko": { "_Skins": "ìŠ¤í‚¨", "_[ATTRIBUTE] of skin [NAME]": "ìŠ¤í‚¨ [NAME]ì˜ [ATTRIBUTE]", "_create SVG skin [SVG] as [NAME]": "SVG ìŠ¤í‚¨ [NAME] ë§Œë“¤ê¸° [SVG] ", "_current skin of [TARGET]": "í˜„ìž¬ ìŠ¤í‚¨ì˜ [TARGET]", "_delete all skins": "ëª¨ë“  ìŠ¤í‚¨ ì‚­ì œí•˜ê¸°", "_delete skin [NAME]": "ìŠ¤í‚¨ [NAME] ì‚­ì œí•˜ê¸°", "_height": "ë†’ì´", "_load skin from URL [URL] as [NAME]": "ìŠ¤í‚¨ [NAME]ì„(ë¥¼) URLì—ì„œ ë¶ˆëŸ¬ì˜¤ê¸° [URL]", "_load skin from [COSTUME] as [NAME]": "ìŠ¤í‚¨ [NAME]ì„(ë¥¼) [COSTUME](ìœ¼)ë¡œ ë¶ˆëŸ¬ì˜¤ê¸°", "_restore skin of [TARGET]": "[TARGET]ì˜ ìŠ¤í‚¨ ë³µêµ¬í•˜ê¸°", "_set skin of [TARGET] to [NAME]": "[TARGET]ì˜ ìŠ¤í‚¨ì„ [NAME](ìœ¼)ë¡œ ì •í•˜ê¸°", "_width": "ë„“ì´" }, "nb": { "_Skins": "Skinner", "_height": "hÃ¸yde", "_width": "bredde" }, "nl": { "_[ATTRIBUTE] of skin [NAME]": "[ATTRIBUTE] van skin [NAME]", "_create SVG skin [SVG] as [NAME]": "creÃ«er SVG-skin [SVG] als [NAME]", "_current skin of [TARGET]": "huidige skin van [TARGET]", "_delete all skins": "verwijder alle skins", "_delete skin [NAME]": "verwijder skin [NAME]", "_height": "hoogte", "_load skin from URL [URL] as [NAME]": "laad skin van URL [URL] als [NAME]", "_load skin from [COSTUME] as [NAME]": "laad skin van [COSTUME] als [NAME]", "_restore skin of [TARGET]": "herstel skin van [TARGET]", "_restore targets with skin [NAME]": "herstel alle met skin [NAME]", "_set skin of [TARGET] to [NAME]": "maak skin van [TARGET] [NAME]", "_skin [NAME] is loaded?": "skin [NAME] is geladen?", "_width": "breedte" }, "pl": { "_height": "wysokoÅ›Ä‡", "_width": "szerokoÅ›Ä‡" }, "ru": { "_Skins": "Ð¡ÐºÐ¸Ð½Ñ‹", "_[ATTRIBUTE] of skin [NAME]": "[ATTRIBUTE] ÑÐºÐ¸Ð½Ð° [NAME]", "_create SVG skin [SVG] as [NAME]": "ÑÐ¾Ð·Ð´Ð°Ñ‚ÑŒ SVG ÑÐºÐ¸Ð½ [SVG] ÐºÐ°Ðº [NAME]", "_current skin of [TARGET]": "Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ ÑÐºÐ¸Ð½ [TARGET]", "_delete all skins": "ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ Ð²ÑÐµ ÑÐºÐ¸Ð½Ñ‹", "_delete skin [NAME]": "ÑƒÐ´Ð°Ð»Ð¸Ñ‚ÑŒ ÑÐºÐ¸Ð½ [NAME]", "_height": "Ð²Ñ‹ÑÐ¾Ñ‚Ð°", "_load skin from URL [URL] as [NAME]": "Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ ÑÐºÐ¸Ð½ Ð¸Ð· URL [URL] ÐºÐ°Ðº [NAME]", "_load skin from [COSTUME] as [NAME]": "Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ ÑÐºÐ¸Ð½ Ð¸Ð· [COSTUME] ÐºÐ°Ðº [NAME]", "_restore skin of [TARGET]": "Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ ÑÐºÐ¸Ð½ [TARGET]", "_restore targets with skin [NAME]": "Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ Ñ†ÐµÐ»Ð¸ ÑÐ¾ ÑÐºÐ¸Ð½Ð¾Ð¼ [NAME]", "_set skin of [TARGET] to [NAME]": "Ð·Ð°Ð´Ð°Ñ‚ÑŒ ÑÐºÐ¸Ð½ [TARGET] Ð½Ð° [NAME]", "_skin [NAME] is loaded?": "ÑÐºÐ¸Ð½ [NAME] Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½?", "_width": "ÑˆÐ¸Ñ€Ð¸Ð½Ð°" }, "tr": { "_Skins": "Ciltler" }, "uk": { "_Skins": "Ð¡ÐºÑ–Ð½Ð¸", "_height": "Ð²Ð¸ÑÐ¾Ñ‚Ð°", "_width": "ÑˆÐ¸Ñ€Ð¸Ð½Ð°" }, "zh-cn": { "_Skins": "çº¹ç†", "_[ATTRIBUTE] of skin [NAME]": "çº¹ç†[NAME]çš„[ATTRIBUTE]", "_create SVG skin [SVG] as [NAME]": "åˆ›å»ºSVGçº¹ç†[SVG]å¹¶å‘½åä¸º[NAME]", "_current skin of [TARGET]": "[TARGET]çš„å½“å‰çº¹ç†", "_delete all skins": "åˆ é™¤æ‰€æœ‰çº¹ç†", "_delete skin [NAME]": "åˆ é™¤çº¹ç†[NAME]", "_height": "é«˜åº¦", "_load skin from URL [URL] as [NAME]": "ä»ŽURL[URL]åŠ è½½çº¹ç†å¹¶å‘½åä¸º[NAME]", "_load skin from [COSTUME] as [NAME]": "ä»Ž[COSTUME]åŠ è½½çº¹ç†å¹¶å‘½åä¸º[NAME]", "_restore skin of [TARGET]": "æ¢å¤[TARGET]çš„çº¹ç†ä¸ºåŽŸé€ åž‹", "_restore targets with skin [NAME]": "æ¢å¤æ‰€æœ‰çº¹ç†ä¸º[NAME]çš„è§’è‰²é€ åž‹", "_set skin of [TARGET] to [NAME]": "å°†[TARGET]çš„çº¹ç†è®¾ä¸º[NAME]", "_skin [NAME] is loaded?": "çº¹ç†[NAME]å·²åŠ è½½ï¼Ÿ", "_width": "å®½åº¦" } });/* end generated l10n code */
  
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
    new Promise((resolve) => {
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

  var createdSkins = [];
  var loadingSkins = [];

  class Skins {
    constructor() {
      runtime.on("PROJECT_START", () => {
        this._refreshTargets();
      });

      runtime.on("PROJECT_STOP_ALL", () => {
        this._refreshTargets();
      });
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
            ],
          },
        },
      };
    }

    async registerSVGSkin(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      const svgData = Cast.toString(args.SVG);

      let oldSkinId = null;
      if (createdSkins[skinName]) {
        oldSkinId = createdSkins[skinName];
      }

      // This generally takes a few frames, so yield the block
      const skinId = renderer.createSVGSkin(svgData);
      createdSkins[skinName] = skinId;

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
        var image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = function() {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.filter = "blur(" + blur + "px)";
          ctx.drawImage(image, 0, 0, image.width, image.height);
          resolve(canvas.toDataURL());
        };
        image.onerror = function() {
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
      if (createdSkins[skinName]) {
        oldSkinId = createdSkins[skinName];
      }

      loadingSkins.push(skinName);
      this.blurImage({ URL: url, BLUR: blur }).then((dataUri) => {
        this._createURLSkin(dataUri).then((skinId) => {
          loadingSkins = loadingSkins.filter((skin) => skin !== skinName);
          if (!skinId) return;
          createdSkins[skinName] = skinId;

          if (oldSkinId) {
            this._refreshTargetsFromID(oldSkinId, false, skinId);
            renderer.destroySkin(oldSkinId);
          }
        });
      });
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
      if (createdSkins[skinName]) {
        oldSkinId = createdSkins[skinName];
      }

      const skinId = await this._createURLSkin(url, rotationCenter);
      createdSkins[skinName] = skinId;

      if (oldSkinId) {
        this._refreshTargetsFromID(oldSkinId, false, skinId);
        renderer.destroySkin(oldSkinId);
      }
    }

    registerURLSkin(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      const url = Cast.toString(args.URL);

      let oldSkinId = null;
      if (createdSkins[skinName]) {
        oldSkinId = createdSkins[skinName];
      }

      loadingSkins.push(skinName);
      this._createURLSkin(url).then((skinId) => {
        loadingSkins = loadingSkins.filter((skin) => skin !== skinName);
        if (!skinId) return;
        createdSkins[skinName] = skinId;

        if (oldSkinId) {
          this._refreshTargetsFromID(oldSkinId, false, skinId);
          renderer.destroySkin(oldSkinId);
        }
      });
    }

    getSkinLoaded(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      return !!createdSkins[skinName];
    }

    getSkinLoading(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      return loadingSkins.includes(skinName);
    }

    getSkins() {
      return JSON.stringify(Object.keys(createdSkins).map((skin) => skin.replace(/^lms\-/, "")));
    }

    setSkin(args, util) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      if (!createdSkins[skinName]) return;

      const targetName = Cast.toString(args.TARGET);
      const target = this._getTargetFromMenu(targetName, util);
      if (!target) return;
      const drawableID = target.drawableID;

      const skinId = createdSkins[skinName];
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
      if (!target) return;
      const drawableID = target.drawableID;

      const skinId = renderer._allDrawables[drawableID].skin._id;
      const skinName = this._getSkinNameFromID(skinId);
      return skinName ? skinName.replace("lms-", "") : "";
    }

    getSkinAttribute(args) {
      const skins = renderer._allSkins;
      const skinName = `lms-${Cast.toString(args.NAME)}`;

      if (!createdSkins[skinName]) return 0;
      const skinId = createdSkins[skinName];
      if (!skins[skinId]) return 0;

      const size = skins[skinId].size;
      const attribute = Cast.toString(args.ATTRIBUTE).toLowerCase();

      switch (attribute) {
        case "width":
          return Math.ceil(size[0]);
        case "height":
          return Math.ceil(size[1]);
        default:
          return 0;
      }
    }

    deleteSkin(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      if (!createdSkins[skinName]) return;
      const skinId = createdSkins[skinName];

      this._refreshTargetsFromID(skinId, true);
      renderer.destroySkin(skinId);
      Reflect.deleteProperty(createdSkins, skinName);
    }

    deleteAllSkins() {
      this._refreshTargets();
      for (const skinName in createdSkins) {
        const skinId = createdSkins[skinName];
        renderer.destroySkin(skinId);
        Reflect.deleteProperty(createdSkins, skinName);
      }
      loadingSkins = [];
      createdSkins = [];
    }

    restoreTargets(args) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      if (!createdSkins[skinName]) return;
      const skinId = createdSkins[skinName];

      this._refreshTargetsFromID(skinId, true);
    }

    // Utility Functions

    _refreshTargetsFromID(skinId, reset, newId) {
      const drawables = renderer._allDrawables;
      const skins = renderer._allSkins;

      for (const target of runtime.targets) {
        const drawableID = target.drawableID;
        const targetSkin = drawables[drawableID].skin.id;

        if (targetSkin === skinId) {
          target.updateAllDrawableProperties();
          if (!reset)
            drawables[drawableID].skin = newId ? skins[newId] : skins[skinId];
        }
      }
    }

    _refreshTargets() {
      for (const target of runtime.targets) {
        target.updateAllDrawableProperties();
      }
    }

    _getSkinNameFromID(skinId) {
      for (const skinName in createdSkins) {
        if (createdSkins[skinName] === skinId) return skinName;
      }
    }

    _getTargetFromMenu(targetName, util) {
      let target = Scratch.vm.runtime.getSpriteTargetByName(targetName);
      if (targetName === "_myself_") target = util.target;
      if (targetName === "_stage_") target = runtime.getTargetForStage();
      return target;
    }

    async _createURLSkin(URL, rotationCenter) {
      let imageData;
      if (await Scratch.canFetch(URL)) {
        imageData = await Scratch.fetch(URL);
      } else {
        return;
      }

      const contentType = imageData.headers.get("Content-Type");
      if (contentType === "image/svg+xml") {
        return renderer.createSVGSkin(await imageData.text(), rotationCenter);
      } else if (
        contentType === "image/png" ||
        contentType === "image/jpeg" ||
        contentType === "image/bmp"
      ) {
        // eslint-disable-next-line no-restricted-syntax
        const output = new Image();
        output.src = URL;
        output.crossOrigin = "anonymous";
        await output.decode();
        return renderer.createBitmapSkin(output);
      }
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

  Scratch.extensions.register(new Skins());
})(Scratch);
