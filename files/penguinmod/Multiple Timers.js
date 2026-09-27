// Name: Multiple Timers
// ID: jgTimers
// Description: Create, pause and read any number of named timers.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_timers
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Multiple Timers must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const formatMessage = (m) => typeof m === "string" ? m : m.default;

// Timer.js
class Timer {
    constructor (startingTime, pausingTime) {
        this.startTime = startingTime ? startingTime : Date.now();
        if (pausingTime) {
            this.pauseTime = pausingTime;
        }
        this.stopped = true;
    }

    start (vmUnpause = false) {
        const paused = (this.pauseTime !== null);
        // check if we are stopped or paused before continuing
        if (!(this.stopped || paused) || (paused && (vmUnpause && !this.vmPaused))) return;
        if (this.stopped) {
            this.startTime = Date.now();
        } else {
            // we are unpausing
            this.startTime += Date.now() - this.pauseTime;
        }
        this.vmPaused = false;
        this.pauseTime = null;
        this.stopped = false;
    }
    pause (vmPause = false) {
        const paused = (this.pauseTime !== null);
        if (paused) return;
        this.vmPaused = vmPause;
        this.pauseTime = Date.now();
    }
    stop () {
        if (this.stopped) return;
        this.stopped = true;
        this.pauseTime = Date.now();
    }

    reset () {
        this.stopped = true;
        this.pauseTime = Date.now();
        this.startTime = Date.now();
    }

    add (seconds) {
        this.startTime -= seconds;
    }

    getTime (inSeconds) {
        const paused = (this.pauseTime !== null);

        const pausedTime = Number(this.pauseTime) - this.startTime;
        const normalTime = Date.now() - this.startTime;

        const divisor = inSeconds ? 1000 : 1;

        return (paused ? pausedTime : normalTime) / divisor;
    }
}

/**
 * Class for Timers blocks
 * @constructor
 */
class JgTimersBlocks {
    constructor() {
        const runtime = Scratch.vm.runtime;
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.timers = {};
        // pause/unpause timers when the project pauses
        // PenguinMod-only: TurboWarp/MistWarp never emit these, so the listeners just stay idle there.
        runtime.on("RUNTIME_PAUSED", () => {
            this._getTimersArray().forEach(timer => timer.instance.pause(true));
        });
        runtime.on("RUNTIME_UNPAUSED", () => {
            this._getTimersArray().forEach(timer => timer.instance.start(true));
        });
    }

    // util

    _getTimersArray() {
        return Object.values(this.timers);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgTimers',
            name: 'Multiple Timers',
            color1: '#0093FE',
            color2: '#1177FC',
            blocks: [
                {
                    opcode: 'createTimer',
                    text: 'create timer named [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'deleteTimer',
                    text: 'delete timer named [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'deleteAllTimer',
                    text: 'delete all timers',
                    blockType: BlockType.COMMAND
                },

                { text: "Values", blockType: BlockType.LABEL, },

                {
                    opcode: 'getTimer',
                    text: 'get timer named [NAME]',
                    blockType: BlockType.REPORTER,
                    disableMonitor: false,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'getTimerData',
                    text: 'get [DATA] of timer named [NAME]',
                    blockType: BlockType.REPORTER,
                    disableMonitor: false,
                    arguments: {
                        DATA: { type: ArgumentType.STRING, menu: "timerData" },
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'existsTimer',
                    text: 'timer named [NAME] exists?',
                    blockType: BlockType.BOOLEAN,
                    disableMonitor: false,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },

                {
                    opcode: 'getAllTimer',
                    text: 'get all timers',
                    blockType: BlockType.REPORTER,
                    disableMonitor: false
                },

                { text: "Operations", blockType: BlockType.LABEL, },

                {
                    opcode: 'startTimer',
                    text: 'start timer [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'pauseTimer',
                    text: 'pause timer [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'stopTimer',
                    text: 'stop timer [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'resetTimer',
                    text: 'reset timer [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
                {
                    opcode: 'addTimer',
                    text: 'add [SECONDS] seconds to timer [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SECONDS: { type: ArgumentType.NUMBER, defaultValue: 5 },
                        NAME: { type: ArgumentType.STRING, defaultValue: "timer" }
                    }
                },
            ],
            menus: {
                timerData: {
                    acceptReporters: true,
                    items: [
                        "milliseconds",
                        "minutes",
                        "hours",
                        // haha funny options
                        "days",
                        "weeks",
                        "years"
                    ].map(item => ({ text: item, value: item }))
                }
            }
        };
    }

    // blocks

    createTimer(args) {
        const timer = this.timers[args.NAME];
        if (timer) return;
        this.timers[args.NAME] = {
            name: Cast.toString(args.NAME),
            instance: new Timer()
        };
    }
    deleteTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return;
        delete this.timers[args.NAME];
    }
    deleteAllTimer() {
        this.timers = {};
    }

    getTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return "";
        const time = timer.instance.getTime(true);
        return Cast.toNumber(time);
    }
    getTimerData(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return "";
        const seconds = Cast.toNumber(timer.instance.getTime(true));
        switch (args.DATA) {
            case "milliseconds":
                return seconds * 1000;
            case "minutes":
                return Math.floor(seconds / 60);
            case "hours":
                return Math.floor(seconds / 3600);
            case "days":
                return Math.floor(seconds / 86400);
            case "weeks":
                return Math.floor(seconds / 604800);
            case "years":
                return Math.floor(seconds / 31536000);
            default:
                return seconds;
        }
    }
    existsTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return false;
        return true;
    }
    getAllTimer() {
        return JSON.stringify(this._getTimersArray().map(timer => timer.name));
    }

    startTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return;
        timer.instance.start();
    }
    pauseTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return;
        timer.instance.pause();
    }
    stopTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return;
        timer.instance.stop();
    }
    resetTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return;
        timer.instance.reset();
    }

    addTimer(args) {
        const timer = this.timers[args.NAME];
        if (!timer) return;
        const seconds = Cast.toNumber(args.SECONDS);
        timer.instance.add(seconds * 1000);
    }
}

Scratch.extensions.register(new JgTimersBlocks());
})(Scratch);
