// Name: Tailgating
// ID: jgTailgating
// Description: Record a sprite's past positions so other sprites can follow behind it.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_tailgating
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Tailgating must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const formatMessage = (m) => typeof m === "string" ? m : m.default;

class TailgatingExtension {
  constructor() {
        const runtime = Scratch.vm.runtime;
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    this.trackers = Object.create(null);
    this.maxSaving = Object.create(null);
    this.positions = Object.create(null);

    const shouldSaveNewPosition = (positionsList, tracker) => {
      const firstPos = positionsList[0];
      if (typeof firstPos !== "object") return true;
      if (firstPos.x !== tracker.x || firstPos.y !== tracker.y) {
        return true;
      }
      return false;
    };

    // PenguinMod-only: RUNTIME_STEP_START doesn't exist elsewhere; BEFORE_EXECUTE fires right after it each frame.
    this.runtime.on('BEFORE_EXECUTE', () => {
      for (const trackerName in this.trackers) {
        const tracker = this.trackers[trackerName];
        // happens when sprite is deleted or clone is deleted
        if (tracker.isDisposed) {
          this.stopTrackingSprite({ NAME: trackerName });
          continue;
        }
        // 0 positions should be saved, so just dont make them at all
        const positions = this.positions[trackerName];
        const maxPositions = this.maxSaving[trackerName];
        if (maxPositions <= 0) continue;
        // only track new positions when they have changed
        // we have no reason to track the same position multiple times (that would make this ext useless)
        if (shouldSaveNewPosition(positions, tracker)) {
          // console.log('saved new pos for', trackerName);
          positions.unshift({ x: tracker.x, y: tracker.y });
        }
        this.positions[trackerName] = positions.slice(0, maxPositions);
      }
    });
  }

  getInfo() {
    return {
      id: "jgTailgating",
      name: "Tailgating",
      blocks: [
        {
          opcode: "startTrackingSprite",
          blockType: BlockType.COMMAND,
          text: "start tracking [SPRITE] as [NAME]",
          arguments: {
            SPRITE: {
              type: ArgumentType.STRING,
              menu: "spriteMenu",
            },
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: "leader",
            }
          },
        },
        {
          opcode: "stopTrackingSprite",
          blockType: BlockType.COMMAND,
          text: "stop tracking [NAME]",
          arguments: {
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: "leader",
            }
          },
        },
        '---',
        {
          opcode: "followSprite",
          blockType: BlockType.COMMAND,
          text: "follow [INDEX] positions behind [NAME]",
          arguments: {
            INDEX: {
              type: ArgumentType.NUMBER,
              defaultValue: 20,
            },
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: "leader",
            }
          },
        },
        {
          opcode: "savePositionsBehindSprite",
          blockType: BlockType.COMMAND,
          text: "set max saved positions behind [NAME] to [MAX]",
          arguments: {
            MAX: {
              type: ArgumentType.NUMBER,
              defaultValue: 20,
            },
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: "leader",
            }
          },
        },
        {
          opcode: "getSpriteFollowPos",
          blockType: BlockType.REPORTER,
          disableMonitor: true,
          text: "get position [INDEX] behind [NAME]",
          arguments: {
            INDEX: {
              type: ArgumentType.NUMBER,
              defaultValue: 20,
            },
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: "leader",
            }
          },
        },
      ],
      menus: {
        spriteMenu: '_getSpriteMenu'
      },
    };
  }

  // menus
  _getSpriteMenu() {
    const emptyMenu = [{ text: '', value: '' }];
    const sprites = [];
    if (Scratch.vm.editingTarget && !Scratch.vm.editingTarget.isStage) {
      sprites.push({ text: 'this sprite', value: '_myself_' });
    }
    for (const target of this.runtime.targets) {
      if (!target.isOriginal) continue;
      if (target.isStage) continue;
      if (Scratch.vm.editingTarget && Scratch.vm.editingTarget.id === target.id) continue;
      const name = target.getName();
      sprites.push({
        text: name,
        value: name
      });
    }
    return sprites.length > 0 ? sprites : emptyMenu;
  }

  // blocks
  startTrackingSprite(args, util) {
    const spriteName = Cast.toString(args.SPRITE);
    const trackerName = Cast.toString(args.NAME);
    const pickedSprite = spriteName === '_myself_' ? util.target : this.runtime.getSpriteTargetByName(spriteName);
    if (!pickedSprite) return;
    this.trackers[trackerName] = pickedSprite;
    this.positions[trackerName] = [];
    if (!(trackerName in this.maxSaving)) {
      this.maxSaving[trackerName] = 20;
    }
  }
  stopTrackingSprite(args) {
    const trackerName = Cast.toString(args.NAME);
    delete this.trackers[trackerName];
    this.positions[trackerName] = [];
  }

  followSprite(args, util) {
    const trackerName = Cast.toString(args.NAME);
    const index = Cast.toNumber(args.INDEX);
    const spritePositions = this.positions[trackerName];
    if (!spritePositions) return;
    let position = spritePositions[index];
    if (typeof position !== "object") {
      // this index position was not found
      // use the last one in the list instead

      // if there is nothing in the list, dont do anything
      if (spritePositions.length <= 0) return;
      position = spritePositions[spritePositions.length - 1];
    }
    util.target.setXY(position.x, position.y);
  }
  getSpriteFollowPos(args) {
    const trackerName = Cast.toString(args.NAME);
    const index = Cast.toNumber(args.INDEX);
    const spritePositions = this.positions[trackerName];
    if (!spritePositions) return '{}';
    let position = spritePositions[index];
    if (typeof position !== "object") {
      // this index position was not found
      // use the last one in the list instead

      // if there is nothing in the list, dont do anything
      if (spritePositions.length <= 0) return '{}';
      position = spritePositions[spritePositions.length - 1];
    }
    return JSON.stringify({
      x: position.x,
      y: position.y
    });
  }
  savePositionsBehindSprite(args, util) {
    const trackerName = Cast.toString(args.NAME);
    const maxPositions = Cast.toNumber(args.MAX);
    let max = Math.round(maxPositions);
    if (max <= 0) {
      max = 0;
    }
    if (max > 0) {
      max++;
    }
    this.maxSaving[trackerName] = max;
  }
}

Scratch.extensions.register(new TailgatingExtension());
})(Scratch);
