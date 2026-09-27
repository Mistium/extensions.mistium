// Name: Motion Expansion
// ID: pmMotionExpansion
// Description: Extra motion blocks: move towards points, touching points/rectangles, fencing and sprite homes.
// By: PenguinMod team (pm); most blocks from More Motion by NexusKitten (https://github.com/NexusKitten)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/pm_motionExpansion
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Motion Expansion must run unsandboxed.");

  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const Cast = Scratch.Cast;
  // from scratch-vm util/clone.js
  const Clone = { simple: (original) => JSON.parse(JSON.stringify(original)) };
  // PenguinMod-only: orderBlocks showed "Stage selected: no motion blocks" for the stage; a sprite-only filter does the same.
  const SPRITE_ONLY = [Scratch.TargetType.SPRITE];

  class pmMotionExpansion {
    constructor() {
      this.runtime = Scratch.vm.runtime;

      this.spriteHomes = {};
      this.cloneHomes = {};

      // PenguinMod saves sprite homes through serialize()/deserialize(); elsewhere use runtime.extensionStorage,
      // which TurboWarp/MistWarp save in the project.
      this.runtime.on("PROJECT_LOADED", () => {
        const saved = this.runtime.extensionStorage && this.runtime.extensionStorage.pmMotionExpansion;
        if (saved && typeof saved === "object") this.spriteHomes = saved;
      });
    }

    _saveHomes() {
      if (this.runtime.extensionStorage) this.runtime.extensionStorage.pmMotionExpansion = this.serialize();
    }

    // cloneHomes contains targetId's which do not save, so dont serialize them
    // clones in general dont save anyways so theres no point if we did
    deserialize(data) {
      this.spriteHomes = data;
    }
    serialize() {
      return this.filterHomes("sprite", this.spriteHomes);
    }

    /**
     * filter out the homes to only contain existing targets
     * @param {string} type clone or sprite
     * @param {object} homes sprite or clone homes
     * @returns the homes with only the existing targets
     */
    filterHomes(type, homes) {
      const newHomes = {};
      for (const targetNameOrId in homes) {
        let canCopy = true;
        if (type === "clone") {
          if (!this.runtime.getTargetById(targetNameOrId)) {
            canCopy = false;
          }
        } else {
          if (!this.runtime.getSpriteTargetByName(targetNameOrId)) {
            canCopy = false;
          }
        }
        if (canCopy) {
          newHomes[targetNameOrId] = homes[targetNameOrId];
        }
      }
      return newHomes;
    }

    /**
     * @returns {object} metadata for extension
     */
    getInfo() {
      return {
        id: 'pmMotionExpansion',
        name: 'Motion Expansion',
        color1: '#4C97FF',
        color2: '#4280D7',
        color3: '#3373CC',
        isDynamic: true,
        blocks: [
          {
            opcode: "rotationStyle",
            filter: SPRITE_ONLY,
            blockType: BlockType.REPORTER,
            text: "rotation style",
            disableMonitor: true,
          },
          {
            opcode: "fence",
            filter: SPRITE_ONLY,
            blockType: BlockType.COMMAND,
            text: "manually fence",
          },
          {
            opcode: "steptowards",
            filter: SPRITE_ONLY,
            blockType: BlockType.COMMAND,
            text: "move [STEPS] steps towards x: [X] y: [Y]",
            arguments: {
              STEPS: {
                type: ArgumentType.NUMBER,
                defaultValue: "10",
              },
              X: {
                type: ArgumentType.NUMBER,
                defaultValue: "0",
              },
              Y: {
                type: ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
            switches: [
              { isNoop: true },
              "tweentowards"
            ],
            switchText: "move steps towards xy"
          },
          {
            opcode: "tweentowards",
            filter: SPRITE_ONLY,
            blockType: BlockType.COMMAND,
            text: "move [PERCENT]% of the way to x: [X] y: [Y]",
            arguments: {
              PERCENT: {
                type: ArgumentType.NUMBER,
                defaultValue: "10",
              },
              X: {
                type: ArgumentType.NUMBER,
                defaultValue: "0",
              },
              Y: {
                type: ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
            switches: [
              "steptowards",
              { isNoop: true },
            ],
            switchText: "move _% of the way to xy"
          },
          {
            opcode: "touchingxy",
            filter: SPRITE_ONLY,
            blockType: BlockType.BOOLEAN,
            text: "touching x: [X] y: [Y]?",
            arguments: {
              X: {
                type: ArgumentType.NUMBER,
                defaultValue: "0",
              },
              Y: {
                type: ArgumentType.NUMBER,
                defaultValue: "0",
              },
            },
            switches: [
              { isNoop: true },
              "touchingrect"
            ],
            switchText: "touching xy"
          },
          {
            opcode: "touchingrect",
            filter: SPRITE_ONLY,
            blockType: BlockType.BOOLEAN,
            text: "touching rectangle x1: [X1] y1: [Y1] x2: [X2] y2: [Y2]?",
            arguments: {
              X1: {
                type: ArgumentType.NUMBER,
                defaultValue: "-100",
              },
              Y1: {
                type: ArgumentType.NUMBER,
                defaultValue: "-100",
              },
              X2: {
                type: ArgumentType.NUMBER,
                defaultValue: "100",
              },
              Y2: {
                type: ArgumentType.NUMBER,
                defaultValue: "100",
              },
            },
            switches: [
              "touchingxy",
              { isNoop: true },
            ],
            switchText: "touching rectangle"
          },
          {
            opcode: "setHome",
            filter: SPRITE_ONLY,
            blockType: BlockType.COMMAND,
            text: "set my home",
            switches: [
              { isNoop: true },
              "gotoHome"
            ]
          },
          {
            opcode: "gotoHome",
            filter: SPRITE_ONLY,
            blockType: BlockType.COMMAND,
            text: "go to home",
            switches: [
              "setHome",
              { isNoop: true }
            ]
          },
        ]
      };
    }

    rotationStyle(_, util) {
      return util.target.rotationStyle;
    }

    fence(_, util) {
      const newpos = this.runtime.renderer.getFencedPositionOfDrawable(
        util.target.drawableID,
        [util.target.x, util.target.y]
      );
      util.target.setXY(newpos[0], newpos[1]);
    }

    steptowards(args, util) {
      const x = Cast.toNumber(args.X);
      const y = Cast.toNumber(args.Y);
      const steps = Cast.toNumber(args.STEPS);
      const val =
        steps / Math.sqrt((x - util.target.x) ** 2 + (y - util.target.y) ** 2);
      if (val >= 1) {
        util.target.setXY(x, y);
      } else {
        util.target.setXY(
          (x - util.target.x) * val + util.target.x,
          (y - util.target.y) * val + util.target.y
        );
      }
    }

    tweentowards(args, util) {
      const x = Cast.toNumber(args.X);
      const y = Cast.toNumber(args.Y);
      const val = Cast.toNumber(args.PERCENT);
      // Essentially a smooth glide script.
      util.target.setXY(
        (x - util.target.x) * (val / 100) + util.target.x,
        (y - util.target.y) * (val / 100) + util.target.y
      );
    }

    touchingrect(args, util) {
      let left = Cast.toNumber(args.X1);
      let right = Cast.toNumber(args.X2);
      let bottom = Cast.toNumber(args.Y1);
      let top = Cast.toNumber(args.Y2);

      // Fix argument order if they got it backwards
      if (left > right) {
        let temp = left;
        left = right;
        right = temp;
      }
      if (bottom > top) {
        let temp = bottom;
        bottom = top;
        bottom = temp;
      }

      const drawable = this.runtime.renderer._allDrawables[util.target.drawableID];
      if (!drawable) {
        return false;
      }

      // See renderer.isTouchingDrawables

      const drawableBounds = drawable.getFastBounds();
      drawableBounds.snapToInt();

      const Rectangle = this.runtime.renderer.exports.Rectangle;
      const containsBounds = new Rectangle();
      containsBounds.initFromBounds(left, right, bottom, top);
      containsBounds.snapToInt();

      if (!containsBounds.intersects(drawableBounds)) {
        return false;
      }

      drawable.updateCPURenderAttributes();

      const intersectingBounds = Rectangle.intersect(
        drawableBounds,
        containsBounds
      );
      for (let x = intersectingBounds.left; x < intersectingBounds.right; x++) {
        for (
          let y = intersectingBounds.bottom;
          y < intersectingBounds.top;
          y++
        ) {
          // technically should be a twgl vec3, but does not actually need to be
          if (drawable.isTouching([x, y])) {
            return true;
          }
        }
      }
      return false;
    }

    touchingxy(args, util) {
      const x = Cast.toNumber(args.X);
      const y = Cast.toNumber(args.Y);
      const drawable = this.runtime.renderer._allDrawables[util.target.drawableID];
      if (!drawable) {
        return false;
      }
      // Position should technically be a twgl vec3, but it doesn't actually need to be
      drawable.updateCPURenderAttributes();
      return drawable.isTouching([x, y]);
    }

    setHome(_, util) {
      const target = util.target;
      if (target.isStage) return;
      // this is all of the sprite specific data we will save
      // variables are a bit too far, and most other data is stage only or shouldnt be overwritten
      const savedState = {
        x: target.x,
        y: target.y,
        size: target.size,
        // PenguinMod-only: stretch and transform only exist on PenguinMod sprites
        stretch: target.stretch ? Clone.simple(target.stretch) : undefined, // array
        transform: target.transform ? Clone.simple(target.transform) : undefined, // array
        direction: target.direction,
        rotationStyle: target.rotationStyle,
        visible: target.visible,
        effects: Clone.simple(target.effects), // object
        draggable: target.draggable,
        currentCostume: target.currentCostume,
        tintColor: target.tintColor,
        volume: target.volume
      };
      if (target.isOriginal) {
        const name = target.getName();
        this.spriteHomes[name] = savedState;
        this.spriteHomes = this.filterHomes("sprite", this.spriteHomes);
        this._saveHomes();
        return;
      }
      this.cloneHomes[target.id] = savedState;
      this.cloneHomes = this.filterHomes("clone", this.cloneHomes);
    }
    gotoHome(_, util) {
      const target = util.target;
      if (target.isStage) return;
      const identifier = target.isOriginal ? target.getName() : target.id;
      const homeTable = target.isOriginal ? this.spriteHomes : this.cloneHomes;
      // dont do anything if theres no name in here
      if (!(identifier in homeTable)) {
        return;
      }
      const homeState = homeTable[identifier];
      if (!homeState) {
        return;
      }
      // set state
      target.setXY(homeState.x, homeState.y);
      target.setSize(homeState.size);
      // PenguinMod-only: stretch and transform
      if (homeState.stretch && typeof target.setStretch === "function") target.setStretch(...homeState.stretch);
      if (homeState.transform && target.transform) {
        target.transform[0] = homeState.transform[0];
        target.transform[1] = homeState.transform[1];
      }
      target.setDirection(homeState.direction);
      target.setRotationStyle(homeState.rotationStyle);
      target.setVisible(homeState.visible);
      if (homeState.effects) {
        for (const effectName in homeState.effects) {
          const value = homeState.effects[effectName];
          target.setEffect(effectName, value);
        }
      }
      target.setDraggable(homeState.draggable);
      target.setCostume(homeState.currentCostume);
      target.tintColor = homeState.tintColor; // tintColor no longer exists but we'll do this anyways incase it somehow breaks things
      target.volume = homeState.volume;
      this.runtime.requestRedraw();
    }
  }

  Scratch.extensions.register(new pmMotionExpansion());
})(Scratch);
