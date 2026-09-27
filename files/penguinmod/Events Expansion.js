// Name: Events Expansion
// ID: pmEventsExpansion
// Description: Extra event blocks: broadcasts with data, broadcasts that return values, sprite click hats and more.
// By: PenguinMod team (pm)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/pm_eventsExpansion
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Events Expansion must run unsandboxed.");

  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const Cast = Scratch.Cast;

  // PenguinMod-only: orderBlocks (which placed PenguinMod's broadcast dropdown shadows and core event blocks in this
  // category) is dropped, so BROADCAST inputs are plain text here, defaulting to "message1".
  class pmEventsExpansion {
    constructor() {
      this.runtime = Scratch.vm.runtime;
      // every other frame block
      this._otherFrame = false;
      // PenguinMod runs this on RUNTIME_STEP_START; BEFORE_EXECUTE is the closest event elsewhere.
      this.runtime.on("BEFORE_EXECUTE", () => {
        this._everyOtherFrame();
      });

      // PenguinMod's core marks broadcasts as sent (for "is message received?"), clears the marks after each frame,
      // and starts "when [SPRITE] clicked" from its mouse code. Do the same here without touching the VM source.
      const startHats = this.runtime.startHats;
      this.runtime.startHats = function (opcode, matchFields, target) {
        if (opcode === "event_whenbroadcastreceived" && matchFields && matchFields.BROADCAST_OPTION !== undefined) {
          const stage = this.getTargetForStage();
          const broadcastVar = stage && stage.lookupBroadcastMsg("", Cast.toString(matchFields.BROADCAST_OPTION));
          if (broadcastVar) broadcastVar.isSent = true;
        }
        return startHats.apply(this, arguments);
      };
      this.runtime.on("AFTER_EXECUTE", () => {
        setTimeout(() => {
          const stage = this.runtime.getTargetForStage();
          if (!stage) return;
          const stageVars = stage.variables;
          for (const key in stageVars) {
            if (stageVars[key].isSent !== undefined) stageVars[key].isSent = false;
          }
        }, 10);
      });
      const mouse = this.runtime.ioDevices && this.runtime.ioDevices.mouse;
      if (mouse && mouse._activateClickHats && !String(mouse._activateClickHats).includes("pmEventsExpansion_whenSpriteClicked")) {
        const activateClickHats = mouse._activateClickHats;
        mouse._activateClickHats = function (target) {
          activateClickHats.call(this, target);
          if (target.isStage) {
            this.runtime.startHats("pmEventsExpansion_whenSpriteClicked", { SPRITE: "_stage_" });
          } else if (target.sprite) {
            this.runtime.startHats("pmEventsExpansion_whenSpriteClicked", { SPRITE: target.sprite.name });
          }
        };
      }
    }

    // stepUpdates
    _everyOtherFrame() {
      if (this._otherFrame) {
        this.runtime.startHats("pmEventsExpansion_everyOtherFrame");
        this._otherFrame = false;
      } else {
        this._otherFrame = true;
      }
    }

    getInfo() {
      return {
        id: "pmEventsExpansion",
        name: "Events Expansion",
        color1: "#FFBF00",
        color2: "#E6AC00",
        color3: "#CC9900",
        isDynamic: true,
        blocks: [
          {
            opcode: "everyOtherFrame",
            text: "every other frame",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            switches: [{ isNoop: true }, "neverr"],
          },
          {
            opcode: "neverr",
            text: "never",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            switches: ["everyOtherFrame", { isNoop: true }],
          },
          {
            opcode: "whenSpriteClicked",
            text: "when [SPRITE] clicked",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            arguments: {
              SPRITE: {
                type: ArgumentType.STRING,
                menu: "spriteName",
              },
            },
          },
          {
            opcode: "sendWithData",
            text: "broadcast [BROADCAST] with data [DATA]",
            blockType: BlockType.COMMAND,
            arguments: {
              BROADCAST: {
                type: ArgumentType.STRING,
                defaultValue: "message1",
              },
              DATA: {
                type: ArgumentType.STRING,
                defaultValue: "abc",
              },
            },
          },
          {
            opcode: "receivedData",
            text: "when I receive [BROADCAST] with data",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            hideFromPallete: true,
            arguments: {
              BROADCAST: {
                type: ArgumentType.STRING,
                menu: "broadcastMenu",
              },
            },
          },
          {
            opcode: "isBroadcastReceived",
            text: "is message [BROADCAST] received?",
            blockType: BlockType.BOOLEAN,
            arguments: {
              BROADCAST: {
                type: ArgumentType.STRING,
                defaultValue: "message1",
              },
            },
          },
          {
            opcode: "recievedDataReporter",
            text: "recieved data",
            blockType: BlockType.REPORTER,
            allowDropAnywhere: true,
            disableMonitor: true,
          },
          {
            opcode: "broadcastToSprite",
            text: "broadcast [BROADCAST] to [SPRITE]",
            blockType: BlockType.COMMAND,
            arguments: {
              BROADCAST: {
                type: ArgumentType.STRING,
                defaultValue: "message1",
              },
              SPRITE: {
                type: ArgumentType.STRING,
                menu: "spriteName",
              },
            },
          },
          {
            opcode: "broadcastFunction",
            text: "broadcast [BROADCAST] and wait",
            blockType: BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            arguments: {
              BROADCAST: {
                type: ArgumentType.STRING,
                defaultValue: "message1",
              },
            },
            switches: [{ isNoop: true }, "broadcastFunctionArgs", "broadcastThreadCount"],
            switchText: "broadcast and wait",
          },
          {
            opcode: "returnFromBroadcastFunc",
            text: "return [VALUE]",
            blockType: BlockType.COMMAND,
            isTerminal: true,
            disableMonitor: true,
            arguments: {
              VALUE: {
                type: ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },
          {
            opcode: "broadcastThreadCount",
            text: "broadcast [BROADCAST] and get # of blocks started",
            blockType: BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
              BROADCAST: {
                type: ArgumentType.STRING,
                defaultValue: "message1",
              },
            },
            switches: ["broadcastFunction", "broadcastFunctionArgs", { isNoop: true }],
            switchText: "broadcast and get blocks started",
          },
          {
            opcode: "broadcastFunctionArgs",
            text: "broadcast [BROADCAST] with data [ARGS] and wait",
            blockType: BlockType.REPORTER,
            disableMonitor: true,
            allowDropAnywhere: true,
            arguments: {
              BROADCAST: {
                type: ArgumentType.STRING,
                defaultValue: "message1",
              },
              ARGS: {
                type: ArgumentType.STRING,
                defaultValue: "abc",
              },
            },
            switches: ["broadcastFunction", { isNoop: true }, "broadcastThreadCount"],
            switchText: "broadcast with data",
          },
        ],
        menus: {
          spriteName: "_spriteName",
          broadcastMenu: "_broadcastMenu",
        },
      };
    }

    // menus
    _spriteName() {
      const emptyMenu = [{ text: "", value: "" }];
      const menu = [];
      for (const target of this.runtime.targets) {
        if (!target.isOriginal) continue;
        if (target.isStage) {
          menu.push({
            text: "stage",
            value: "_stage_",
          });
          continue;
        }
        menu.push({
          text: target.sprite.name,
          value: target.sprite.name,
        });
      }
      if (menu.length <= 0) return emptyMenu;
      return menu;
    }
    _broadcastMenu() {
      const emptyMenu = [{ text: "", value: "" }];
      const menu = [];
      for (const target of this.runtime.targets) {
        if (!target.isOriginal) continue;
        if (target.isStage) {
          menu.push({
            text: "stage",
            value: target.id,
          });
          continue;
        }
        menu.push({
          text: target.sprite.name,
          value: target.id,
        });
      }
      if (menu.length <= 0) return emptyMenu;
      return menu;
    }

    // blocks
    sendWithData(args, util) {
      const broadcast = Cast.toString(args.BROADCAST);
      const data = Cast.toString(args.DATA);
      const broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg("", broadcast);
      if (broadcastVar) broadcastVar.isSent = true;

      const threads = util.startHats("event_whenbroadcastreceived", {
        BROADCAST_OPTION: broadcast,
      });
      for (const thread of threads) {
        thread.__evex_recievedDataa = data;
      }
    }
    broadcastToSprite(args, util) {
      const broadcast = Cast.toString(args.BROADCAST);
      const broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg("", broadcast);
      if (broadcastVar) broadcastVar.isSent = true;

      const sprite = Cast.toString(args.SPRITE);
      const target = sprite === "_stage_" ? this.runtime.getTargetForStage() : this.runtime.getSpriteTargetByName(sprite);
      util.startHats(
        "event_whenbroadcastreceived",
        {
          BROADCAST_OPTION: broadcast,
        },
        target
      );
    }
    broadcastThreadCount(args, util) {
      const broadcast = Cast.toString(args.BROADCAST);
      const broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg("", broadcast);
      if (broadcastVar) broadcastVar.isSent = true;

      const threads = util.startHats("event_whenbroadcastreceived", {
        BROADCAST_OPTION: broadcast,
      });
      return threads.length;
    }
    recievedDataReporter(_, util) {
      return util.thread.__evex_recievedDataa;
    }
    returnFromBroadcastFunc(args, util) {
      util.thread.__evex_returnDataa = args.VALUE;
    }
    isBroadcastReceived(args, util) {
      const broadcast = Cast.toString(args.BROADCAST);
      const broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg("", broadcast);
      return Cast.toBoolean(broadcastVar && broadcastVar.isSent);
    }

    // PenguinMod compiled these two; this does the same: start the broadcast, wait for every started thread to finish
    // (plus a frame), then report the first value given to "return".
    _broadcastAndWait(broadcast, data, util) {
      const broadcastVar = util.runtime.getTargetForStage().lookupBroadcastMsg("", broadcast);
      if (broadcastVar) broadcastVar.isSent = true;
      const threads = util.startHats("event_whenbroadcastreceived", { BROADCAST_OPTION: broadcast }) || [];
      for (const thread of threads) thread.__evex_recievedDataa = data;
      return new Promise((resolve) => {
        const check = () => {
          if (threads.some((thread) => this.runtime.isActiveThread(thread))) return;
          this.runtime.off("AFTER_EXECUTE", check);
          for (const thread of threads) {
            if (typeof thread.__evex_returnDataa !== "undefined") return resolve(thread.__evex_returnDataa);
          }
          resolve("");
        };
        this.runtime.on("AFTER_EXECUTE", check);
      });
    }
    broadcastFunction(args, util) {
      return this._broadcastAndWait(Cast.toString(args.BROADCAST), "", util);
    }
    broadcastFunctionArgs(args, util) {
      return this._broadcastAndWait(Cast.toString(args.BROADCAST), Cast.toString(args.ARGS), util);
    }
  }

  Scratch.extensions.register(new pmEventsExpansion());
})(Scratch);
