// Name: Timing
// Author: Mistium
// Description: Waits with timeouts, named timers and cooldowns
// Version: v1

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Timing must run unsandboxed.");
  }

  const { BlockType, ArgumentType, Cast } = Scratch;
  const now = () => performance.now();

  // The compiler evaluates a command's inputs once, but re-evaluates a loop block's inputs on
  // every pass. So the waits are loop blocks with branchCount -1 (no mouth, no loop arrow):
  // they look like commands and loop on a missing branch until done.
  const WAIT_BLOCK = { blockType: BlockType.LOOP, branchCount: -1, branchIconURI: "" };

  class Timing {
    constructor() {
      this.timers = Object.create(null);
      this.cooldowns = Object.create(null);
      Scratch.vm.runtime.on("PROJECT_START", () => {
        this.timers = Object.create(null);
        for (const name in this.cooldowns) this.cooldowns[name].startedAt = -Infinity;
      });
    }

    getInfo() {
      return {
        id: "mistiumtiming",
        name: "Timing",
        color1: "#3d7fe8",
        blocks: [
          { blockType: BlockType.LABEL, text: "Waiting" },
          {
            opcode: "waitOrUntil",
            ...WAIT_BLOCK,
            text: "wait [SECS] seconds or until [COND]",
            arguments: {
              SECS: { type: ArgumentType.NUMBER, defaultValue: 1 },
              COND: { type: ArgumentType.BOOLEAN },
            },
          },
          {
            opcode: "timedOut",
            blockType: BlockType.BOOLEAN,
            text: "timed out?",
          },
          {
            opcode: "waitUntilHeld",
            ...WAIT_BLOCK,
            text: "wait until [COND] has been true for [SECS] seconds",
            arguments: {
              COND: { type: ArgumentType.BOOLEAN },
              SECS: { type: ArgumentType.NUMBER, defaultValue: 1 },
            },
          },
          {
            opcode: "runFor",
            blockType: BlockType.LOOP,
            text: "run for [SECS] seconds or until [COND]",
            arguments: {
              SECS: { type: ArgumentType.NUMBER, defaultValue: 1 },
              COND: { type: ArgumentType.BOOLEAN },
            },
          },
          {
            opcode: "waitFrames",
            blockType: BlockType.COMMAND,
            text: "wait [FRAMES] frames",
            arguments: {
              FRAMES: { type: ArgumentType.NUMBER, defaultValue: 1 },
            },
          },
          { blockType: BlockType.LABEL, text: "Timers" },
          {
            opcode: "startTimer",
            blockType: BlockType.COMMAND,
            text: "start timer [NAME]",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "timer" },
            },
          },
          {
            opcode: "pauseTimer",
            blockType: BlockType.COMMAND,
            text: "pause timer [NAME]",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "timer" },
            },
          },
          {
            opcode: "resumeTimer",
            blockType: BlockType.COMMAND,
            text: "resume timer [NAME]",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "timer" },
            },
          },
          {
            opcode: "getTimer",
            blockType: BlockType.REPORTER,
            text: "timer [NAME]",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "timer" },
            },
          },
          {
            opcode: "timerRunning",
            blockType: BlockType.BOOLEAN,
            text: "timer [NAME] running?",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "timer" },
            },
          },
          { blockType: BlockType.LABEL, text: "Cooldowns" },
          {
            opcode: "setCooldown",
            blockType: BlockType.COMMAND,
            text: "set [NAME] cooldown to [SECS] seconds",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "dash" },
              SECS: { type: ArgumentType.NUMBER, defaultValue: 2 },
            },
          },
          {
            opcode: "startCooldown",
            blockType: BlockType.COMMAND,
            text: "start [NAME] cooldown",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "dash" },
            },
          },
          {
            opcode: "cooldownReady",
            blockType: BlockType.BOOLEAN,
            text: "[NAME] cooldown ready?",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "dash" },
            },
          },
          {
            opcode: "cooldownLeft",
            blockType: BlockType.REPORTER,
            text: "[NAME] cooldown left",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "dash" },
            },
          },
          {
            opcode: "cooldownLength",
            blockType: BlockType.REPORTER,
            text: "[NAME] cooldown length",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "dash" },
            },
          },
          {
            opcode: "resetCooldown",
            blockType: BlockType.COMMAND,
            text: "reset [NAME] cooldown",
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "dash" },
            },
          },
        ],
      };
    }

    waitOrUntil({ SECS, COND }, util) {
      this.runFor({ SECS, COND }, util);
    }

    runFor({ SECS, COND }, util) {
      const frame = util.stackFrame;
      if (frame.end === undefined) frame.end = now() + Cast.toNumber(SECS) * 1000;
      if (Cast.toBoolean(COND)) {
        util.thread.mistiumTimingTimedOut = false;
        return;
      }
      if (now() >= frame.end) {
        util.thread.mistiumTimingTimedOut = true;
        return;
      }
      util.startBranch(1, true);
    }

    timedOut(args, util) {
      return !!util.thread.mistiumTimingTimedOut;
    }

    waitUntilHeld({ COND, SECS }, util) {
      const frame = util.stackFrame;
      if (!Cast.toBoolean(COND)) {
        frame.since = undefined;
      } else {
        if (frame.since === undefined) frame.since = now();
        if (now() - frame.since >= Cast.toNumber(SECS) * 1000) return;
      }
      util.startBranch(1, true);
    }

    waitFrames({ FRAMES }, util) {
      const frame = util.stackFrame;
      if (frame.left === undefined) frame.left = Math.round(Cast.toNumber(FRAMES));
      if (frame.left <= 0) return;
      frame.left--;
      util.yieldTick();
    }

    startTimer({ NAME }) {
      this.timers[Cast.toString(NAME)] = { start: now(), pausedAt: null };
    }

    pauseTimer({ NAME }) {
      const timer = this.timers[Cast.toString(NAME)];
      if (timer && timer.pausedAt === null) timer.pausedAt = now();
    }

    resumeTimer({ NAME }) {
      const timer = this.timers[Cast.toString(NAME)];
      if (!timer || timer.pausedAt === null) return;
      timer.start += now() - timer.pausedAt;
      timer.pausedAt = null;
    }

    getTimer({ NAME }) {
      const timer = this.timers[Cast.toString(NAME)];
      if (!timer) return 0;
      return ((timer.pausedAt ?? now()) - timer.start) / 1000;
    }

    timerRunning({ NAME }) {
      const timer = this.timers[Cast.toString(NAME)];
      return !!timer && timer.pausedAt === null;
    }

    // Each cooldown has a length (set once, changed by upgrades) and the time it was last started.
    // Changing the length also changes a cooldown that's already running.
    cooldown(NAME) {
      const name = Cast.toString(NAME);
      return this.cooldowns[name] || (this.cooldowns[name] = { length: 0, startedAt: -Infinity });
    }

    setCooldown({ NAME, SECS }) {
      this.cooldown(NAME).length = Math.max(0, Cast.toNumber(SECS));
    }

    startCooldown({ NAME }) {
      this.cooldown(NAME).startedAt = now();
    }

    cooldownReady({ NAME }) {
      return this.cooldownLeft({ NAME }) === 0;
    }

    cooldownLeft({ NAME }) {
      const cooldown = this.cooldown(NAME);
      return Math.max(0, cooldown.length - (now() - cooldown.startedAt) / 1000);
    }

    cooldownLength({ NAME }) {
      return this.cooldown(NAME).length;
    }

    resetCooldown({ NAME }) {
      this.cooldown(NAME).startedAt = -Infinity;
    }
  }

  Scratch.extensions.register(new Timing());
})(Scratch);
