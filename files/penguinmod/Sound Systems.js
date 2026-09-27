// Name: Sound Systems
// ID: jgExtendedAudio
// Description: Audio groups and audio sources with volume, speed, detune, pan, looping and more.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_audio
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Sound Systems must run unsandboxed.");

const BlockType = Scratch.BlockType;
const ArgumentType = Scratch.ArgumentType;
const Cast = Scratch.Cast;
const scratchFetch = (...args) => (Scratch.fetch ? Scratch.fetch(...args) : fetch(...args));

// ---- timer.js ----
class Timer {
    /**
     * @param {Runtime} runtime 
     * @param {AudioContext} audioContext 
     */
    constructor(runtime, audioContext) {
        this.runtime = runtime;
        this.audioContext = audioContext;
        this._disposed = false;

        this.paused = false;
        this.stopped = true;

        this._value = 0;
        this.speed = 1;

        this._lastUpdateReal = Date.now();
        this._lastUpdateProcessed = Date.now();

        this._boundFunc = this.update.bind(this);
        this.runtime.on("RUNTIME_STEP_START", this._boundFunc);
    }

    start() {
        this.paused = false;
        this.stopped = false;
    }

    pause() {
        this.paused = true;
    }

    stop() {
        this.paused = false;
        this.stopped = true;
    }

    reset() {
        this._value = 0;
        this.paused = false;
        this.stopped = true;
    }

    update() {
        if (this.stopped || this.paused || this._disposed || this.audioContext.state !== "running") {
            this._lastUpdateReal = Date.now();
            return;
        }

        this._value += (Date.now() - this._lastUpdateReal) * this.speed;

        this._lastUpdateReal = Date.now();
        this._lastUpdateProcessed = Date.now();
    }
    dispose() {
        if (this._disposed) return;
        this._disposed = true;
        this.runtime.off("RUNTIME_STEP_START", this._boundFunc);
    }

    getTime(inSeconds) {
        const divisor = inSeconds ? 1000 : 1;
        return this._value / divisor;
    }
    setTime(ms) {
        this._lastUpdateReal = Date.now();
        this._lastUpdateProcessed = Date.now();
        this._value = ms;
    }
}

// ---- helper.js ----
function MathOver(number, max) {
    let num = number;
    while (num > max) {
        num -= max;
    }
    return num;
}
function Clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

class AudioSource {
    /**
     * @param {AudioContext} audioContext 
     * @param {object} audioGroup 
     * @param {AudioBuffer} source 
     * @param {object} data 
     * @param {object} parent 
     */
    constructor(audioContext, audioGroup, source, data, parent, runtime) {
        if (source == null) source = "";
        if (data == null) data = {};
        this.runtime = runtime;

        this.src = source;
        this.duration = source.duration;
        this.originAudioName = "";

        this.volume = data.volume ?? 1;
        this.speed = data.speed ?? 1;
        this.pitch = data.pitch ?? 0;
        this.pan = data.pan ?? 0;
        this.looping = data.looping ?? false;

        this.startPosition = data.startPosition ?? 0;
        this.endPosition = data.endPosition ?? Infinity;
        this.loopStartPosition = data.loopStartPosition ?? 0;
        this.loopEndPosition = data.loopEndPosition ?? Infinity;

        this.resumeSpot = 0;
        this.paused = false;
        this.notPlaying = true;
        this.parent = parent;

        this._audioNode = null;
        this._audioContext = audioContext;
        this._audioGroup = audioGroup;

        this._audioPanner = this._audioContext.createPanner();
        this._audioGainNode = this._audioContext.createGain();
        this._audioAnalyzerNode = this._audioContext.createAnalyser();
        
        this._audioPanner.panningModel = 'equalpower';
        this._audioGainNode.gain.value = 1;

        this._audioGainNode.connect(this._audioPanner);
        this._audioPanner.connect(this._audioAnalyzerNode);
        this._audioAnalyzerNode.connect(parent.audioGlobalVolumeNode);

        this._originalConfig = data;
        this._playingSrc = null;

        this._timer = new Timer(runtime, audioContext);
        this._disposed = false;
    }

    play(atTime) {
        if (!this.src) throw "Cannot play an empty audio source";
        try {
            if (this._audioNode) {
                this._audioNode.onended = null;
                this._audioNode.stop();
            }
        } catch {
            // ... idk
        } finally {
            this._audioNode = null;
        }

        const source = this._audioContext.createBufferSource();
        this._audioNode = source;
        this.update();

        source.buffer = this.src;
        source.connect(this._audioGainNode);
        this._playingSrc = source.buffer;
        
        if (!this.paused) {
            this._timer.reset();
            this._timer.setTime(Clamp(atTime ?? this.startPosition, 0, this.duration) * 1000);
            this._timer.start();
        } else {
            this.resumeSpot = this.getTimePosition();
            this._timer.start();
        }

        // we need to know when the sound starts, so we know how long to play for
        // we also need to change endTimePos if we are looping
        let startTimePos = this.resumeSpot;
        let endTimePos = this.endPosition;
        if (this.paused) {
            this.paused = false;
        } else {
            startTimePos = atTime ?? this.startPosition;
        }
        if (this.looping) {
            endTimePos = this.loopEndPosition;
        }

        // dont play the sound if the playback duration is less than 1 sample frame, otherwise the ended event will not fire
        this.notPlaying = false;
        const playbackDuration = Clamp(endTimePos - startTimePos, 0, this.duration);
        if (playbackDuration < 1 / this.src.sampleRate) {
            this._onNodeStop(true);
        } else {
            source.start(0, Clamp(startTimePos, 0, this.duration), playbackDuration);
    
            source.onended = () => {
                this._onNodeStop();
            }
        }
    }
    stop() {
        this.notPlaying = true;
        this.paused = false;
        this._timer.stop();
        try {
            if (this._audioNode) {
                this._audioNode.stop();
            }
        } catch {
            // ... idk
        } finally {
            this._audioNode = null;
        }
    }
    pause() {
        if (!this._audioNode) return;
        this.paused = true;
        this.notPlaying = true;
        this._timer.pause();
        
        // onended is already ignored when paused, and stopped nodes cannot restart
        this._audioNode.onended = null;
        this._audioNode.stop();
        this._audioNode = null;
    }

    update() {
        if (!this._audioNode) return;
        const audioNode = this._audioNode;
        const audioGroup = this._audioGroup;
        const audioGainNode = this._audioGainNode;
        const audioPanner = this._audioPanner;

        // we need to manually calculate detune to prevent problems when using playbackRate for other things
        audioNode.playbackRate.value = this.speed * Math.pow(2, this.pitch / 1200);
        audioGainNode.gain.value = this.volume;

        audioNode.playbackRate.value *= audioGroup.globalSpeed * Math.pow(2, audioGroup.globalPitch / 1200);
        audioGainNode.gain.value *= audioGroup.globalVolume;
        this._timer.speed = audioNode.playbackRate.value;

        const pan = Clamp(this.pan + audioGroup.globalPan, -1, 1);
        audioPanner.positionX.value = pan;
        audioPanner.positionY.value = 0;
        audioPanner.positionZ.value = 1 - Math.abs(pan);
    }
    dispose() {
        this._disposed = true;
        this._timer.dispose();
        this.stop();
    }
    clone() {
        const newSource = new AudioSource(this._audioContext, this._audioGroup, this.src, this._originalConfig, this.parent, this.runtime);
        return newSource;
    }
    reverse() {
        if (!this.src) throw "Cannot reverse an empty audio source";

        const buffer = this.src;
        const reversedBuffer = this._audioContext.createBuffer(
            buffer.numberOfChannels,
            buffer.length,
            buffer.sampleRate
        );
    
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const sourceData = buffer.getChannelData(channel);
            const destinationData = reversedBuffer.getChannelData(channel);
    
            for (let i = 0; i < buffer.length; i++) {
                destinationData[i] = sourceData[buffer.length - 1 - i];
            }
        }
        this.src = reversedBuffer;
    }

    setTimePosition(newSeconds) {
        if (!this._audioNode && !this.paused) return;
        const src = this._getActiveSource();
        newSeconds = Clamp(newSeconds, 0, src.duration);
        if (this.paused) {
            // only update the time
            this._timer.setTime(newSeconds * 1000);
            return;
        }

        this._timer.setTime(newSeconds * 1000);
        this.play(newSeconds);
    }

    getVolume() {
        const analyserNode = this._audioAnalyzerNode;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        let sumSquares = 0.0;
        for (let i = 0; i < bufferLength; i++) {
          const sample = (dataArray[i] / 128.0) - 1.0;
          sumSquares += sample * sample;
        }
        const volume = Math.sqrt(sumSquares / bufferLength);
        return volume;
    }
    getFrequency() {
        const analyserNode = this._audioAnalyzerNode;
        const src = this._getActiveSource();
    
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(dataArray);
    
        // find the max frequency
        let maxIndex = 0;
        for (let i = 1; i < bufferLength; i++) {
            if (dataArray[i] > dataArray[maxIndex]) {
                maxIndex = i;
            }
        }
    
        // return the dominant freq
        const nyquist = src.sampleRate / 2;
        return maxIndex * nyquist / bufferLength;
    }
    getTimePosition() {
        const src = this._getActiveSource();
        return Clamp(this._timer.getTime(true), 0, src.duration);
    }

    _getActiveSource() {
        if (this._audioNode) return this._playingSrc;
        return this.src;
    }
    _onNodeStop(didNotPlay) {
        if (this.paused || !this._audioNode) return;
        if (!didNotPlay) {
            if (this.looping && !this.notPlaying) {
                this.play(this.loopStartPosition || 0);
                return;
            }
        }

        this._audioNode.onended = null;
        this.notPlaying = true;
        this._audioNode = null;
        this._timer.stop();
    }
}
class AudioExtensionHelper {
    constructor(runtime) {
        /**
            * The runtime that the helper will use for all functions.
            * @param {runtime}
        */
        this.runtime = runtime;
        this.audioGroups = {};
        this.audioContext = new AudioContext();
        this.audioGlobalVolumeNode = this.audioContext.createGain();

        this.audioGlobalVolumeNode.gain.value = 1;
        this.audioGlobalVolumeNode.connect(this.audioContext.destination);
    }
    
    /**
        * Creates a new AudioGroup.
        * @param {string} AudioGroup name
        * @param {object} AudioGroup settings (optional)
        * @param {object[]} AudioGroup sources (optional)
    */
    AddAudioGroup(name, data, sources) {
        if (data == null) data = {};
        this.audioGroups[name] = {
            id: name,
            sources: (sources == null ? {} : sources),
            globalVolume: (data.globalVolume == null ? 1 : data.globalVolume),
            globalSpeed: (data.globalSpeed == null ? 1 : data.globalSpeed),
            globalPitch: (data.globalPitch == null ? 0 : data.globalPitch),
            globalPan: (data.globalPan == null ? 0 : data.globalPan)
        };
        return this.audioGroups[name];
    }
    /**
        * Deletes an AudioGroup by name.
        * @param {string}
    */
    DeleteAudioGroup(name) {
        const audioGroup = this.audioGroups[name];
        if (!audioGroup) return;
        this.DisposeAudioGroupSources(audioGroup);
        delete this.audioGroups[name];
    }
    /**
        * Gets an AudioGroup by name.
        * @param {string}
    */
    GetAudioGroup(name) {
        return this.audioGroups[name];
    }
    /**
        * Gets all AudioGroups and returns them in an array.
    */
    GetAllAudioGroups() {
        return Object.values(this.audioGroups);
    }
    /**
        * Gets all AudioSources in an AudioGroup and updates them.
        * @param {AudioGroup}
    */
    UpdateAudioGroupSources(audioGroup) {
        const audioSources = this.GrabAllGrabAudioSources(audioGroup);
        for (let i = 0; i < audioSources.length; i++) {
            const source = audioSources[i];
            source.update();
        }
    }
    /**
        * Gets all AudioSources in an AudioGroup and disposes them.
        * @param {AudioGroup}
    */
    DisposeAudioGroupSources(audioGroup) {
        const audioSources = this.GrabAllGrabAudioSources(audioGroup);
        for (let i = 0; i < audioSources.length; i++) {
            const source = audioSources[i];
            source.dispose();
        }
    }

    /**
        * Creates a new AudioSource inside of an AudioGroup.
        * @param {AudioGroup} AudioSource parent
        * @param {string} AudioSource name
        * @param {string} AudioSource source (optional)
        * @param {object} AudioSource settings (optional)
    */
    AppendAudioSource(parent, name, src, settings) {
        const group = typeof parent == "string" ? this.GetAudioGroup(parent) : parent;
        if (!group) return;
        group.sources[name] = new AudioSource(this.audioContext, group, src, settings, this, this.runtime);
        return group.sources[name];
    }
    /**
        * Deletes an AudioSource by name.
        * @param {AudioGroup} AudioSource parent
        * @param {string}
    */
    RemoveAudioSource(parent, name) {
        const group = typeof parent == "string" ? this.GetAudioGroup(parent) : parent;
        if (!group) return;
        const audioSource = group.sources[name];
        if (!audioSource) return;

        audioSource.dispose();
        delete group.sources[name];
    }
    /**
        * Gets an AudioSource by name.
        * @param {AudioGroup} AudioSource parent
        * @param {string}
    */
    GrabAudioSource(audioGroup, name) {
        const group = typeof audioGroup == "string" ? this.GetAudioGroup(audioGroup) : audioGroup;
        if (!group) return;
        return group.sources[name];
    }
    /**
        * Gets all AudioSources and returns them in an array.
        * @param {AudioGroup} AudioSource parent
    */
    GrabAllGrabAudioSources(audioGroup) {
        const group = typeof audioGroup == "string" ? this.GetAudioGroup(audioGroup) : audioGroup;
        if (!group) return [];
        return Object.values(group.sources);
    }

    /**
        * Finds a sound with the specified ID in the sound list.
        * @param {Array} soundList
        * @param {string} Sound ID
    */
    FindSoundBySoundId(soundList, id) {
        for (let i = 0; i < soundList.length; i++) {
            const sound = soundList[i];
            if (sound.soundId == id) return sound;
        }
        return null;
    }
    /**
    * Finds a sound with the specified name in the sound list.
    * @param {Array} soundList
    * @param {string} Sound name
    */
    FindSoundByName(soundList, name) {
        for (let i = 0; i < soundList.length; i++) {
            const sound = soundList[i];
            if (sound.name == name) return sound;
        }
        return null;
    }
    /**
        * Clamps numbers to stay inbetween 2 values.
        * @param {number}
    */
    Clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }
}

const Helper = new AudioExtensionHelper();

// ---- index.js ----
class AudioExtension {
    constructor() {
        /**
         * The runtime instantiating this block package.
         * @type {runtime}
         */
        this.runtime = Scratch.vm.runtime;
        this.helper = Helper;
        this.helper.runtime = this.runtime;

        this.runtime.on('PROJECT_STOP_ALL', () => {
            for (const audioGroupName in Helper.audioGroups) {
                const audioGroup = Helper.GetAudioGroup(audioGroupName);
                for (const sourceName in audioGroup.sources) {
                    audioGroup.sources[sourceName].stop();
                }
            }
        });

        // PenguinMod-only: lets PM's GUI mute/record this audio context. Skipped where it doesn't exist.
        if (typeof this.runtime.registerExtensionAudioContext === "function") {
            this.runtime.registerExtensionAudioContext("jgExtendedAudio", this.helper.audioContext, this.helper.audioGlobalVolumeNode);
        }

        // PenguinMod saves audio groups through serialize()/deserialize().
        // Elsewhere those hooks aren't called, so keep them in runtime.extensionStorage,
        // which TurboWarp/MistWarp save in the project.
        if (!Scratch.extensions.isPenguinMod) {
            const load = () => {
                const data = this.runtime.extensionStorage.jgExtendedAudio;
                if (Array.isArray(data)) this.deserialize(data);
            };
            load();
            this.runtime.on('PROJECT_LOADED', load);
        }
    }

    deserialize(data) {
        for (const audioGroup in Helper.audioGroups) {
            Helper.DeleteAudioGroup(audioGroup);
        }
        Helper.audioGroups = {};
        for (const audioGroup of data) {
            Helper.AddAudioGroup(audioGroup.id, audioGroup);
        }
    }

    serialize() {
        const data = Helper.GetAllAudioGroups().map(audioGroup => ({
            id: audioGroup.id,
            sources: {},
            globalVolume: audioGroup.globalVolume,
            globalSpeed: audioGroup.globalSpeed,
            globalPitch: audioGroup.globalPitch,
            globalPan: audioGroup.globalPan
        }));
        if (!Scratch.extensions.isPenguinMod) this.runtime.extensionStorage.jgExtendedAudio = data;
        return data;
    }

    orderCategoryBlocks(blocks) {
        const buttons = {
            create: blocks[0],
            delete: blocks[1]
        };
        const varBlock = blocks[2];
        blocks.splice(0, 3);
        // create the variable block xml's
        const varBlocks = Helper.GetAllAudioGroups().map(audioGroup => varBlock.replace('{audioGroupId}', audioGroup.id));
        if (!varBlocks.length) {
            return [buttons.create];
        }
        // push the button to the top of the var list
        varBlocks.reverse();
        varBlocks.push(buttons.delete);
        varBlocks.push(buttons.create);
        // merge the category blocks and variable blocks into one block list
        blocks = varBlocks
            .reverse()
            .concat(blocks);
        return blocks;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgExtendedAudio',
            name: 'Sound Systems',
            color1: '#E256A1',
            color2: '#D33388',
            isDynamic: true,
            // PenguinMod-only: orderBlocks puts one [AUDIOGROUP] reporter per group in the palette; ignored elsewhere.
            orderBlocks: this.orderCategoryBlocks,
            blocks: [
                { opcode: 'createAudioGroup', func: 'createAudioGroup', text: 'New Audio Group', blockType: BlockType.BUTTON, },
                { opcode: 'deleteAudioGroup', func: 'deleteAudioGroup', text: 'Remove an Audio Group', blockType: BlockType.BUTTON, },
                {
                    opcode: 'audioGroupGet', text: '[AUDIOGROUP]', blockType: BlockType.REPORTER,
                    arguments: {
                        AUDIOGROUP: { menu: 'audioGroup', defaultValue: Scratch.extensions.isPenguinMod ? '{audioGroupId}' : '', type: ArgumentType.STRING, }
                    },
                },
                { text: "Operations", blockType: BlockType.LABEL, },
                {
                    opcode: 'audioGroupSetVolumeSpeedPitchPan', text: 'set [AUDIOGROUP] [VSPP] to [VALUE]%', blockType: BlockType.COMMAND,
                    arguments: {
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        VSPP: { type: ArgumentType.STRING, menu: 'vspp', defaultValue: "" },
                        VALUE: { type: ArgumentType.NUMBER, defaultValue: 100 },
                    },
                },
                {
                    opcode: 'audioGroupGetModifications', text: '[AUDIOGROUP] [OPTION]', blockType: BlockType.REPORTER, disableMonitor: true,
                    arguments: {
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        OPTION: { type: ArgumentType.STRING, menu: 'audioGroupOptions', defaultValue: "" },
                    },
                },
                "---",
                {
                    opcode: 'audioSourceCreate', text: '[CREATEOPTION] audio source named [NAME] in [AUDIOGROUP]', blockType: BlockType.COMMAND,
                    arguments: {
                        CREATEOPTION: { type: ArgumentType.STRING, menu: 'createOptions', defaultValue: "" },
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                    },
                },
                {
                    opcode: 'audioSourceDuplicate', text: 'duplicate audio source from [NAME] to [COPY] in [AUDIOGROUP]', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        COPY: { type: ArgumentType.STRING, defaultValue: "AudioSource2" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                    },
                },
                {
                    opcode: 'audioSourceReverse', text: 'reverse audio source used in [NAME] in [AUDIOGROUP]', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        COPY: { type: ArgumentType.STRING, defaultValue: "AudioSource2" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                    },
                },
                {
                    opcode: 'audioSourceDeleteAll', text: '[DELETEOPTION] all audio sources in [AUDIOGROUP]', blockType: BlockType.COMMAND,
                    arguments: {
                        DELETEOPTION: { type: ArgumentType.STRING, menu: 'deleteOptions', defaultValue: "" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                    },
                },
                "---",
                {
                    opcode: 'audioSourceSetScratch', text: 'set audio source [NAME] in [AUDIOGROUP] to use [SOUND]', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        SOUND: { type: ArgumentType.STRING, menu: 'sounds', defaultValue: "" },
                    },
                },
                {
                    opcode: 'audioSourceSetUrl', text: 'set audio source [NAME] in [AUDIOGROUP] to use [URL]', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        URL: { type: ArgumentType.STRING, defaultValue: "https://extensions.turbowarp.org/meow.mp3" },
                    },
                },
                {
                    opcode: 'audioSourcePlayerOption', text: '[PLAYEROPTION] audio source [NAME] in [AUDIOGROUP]', blockType: BlockType.COMMAND,
                    arguments: {
                        PLAYEROPTION: { type: ArgumentType.STRING, menu: 'playerOptions', defaultValue: "" },
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                    },
                },
                "---",
                {
                    opcode: 'audioSourceSetLoop', text: 'set audio source [NAME] in [AUDIOGROUP] to [LOOP]', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        LOOP: { type: ArgumentType.STRING, menu: 'loop', defaultValue: "loop" },
                    },
                },
                {
                    opcode: 'audioSourceSetTime2', text: 'set audio source [NAME] [TIMEPOS] position in [AUDIOGROUP] to [TIME] seconds', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        TIMEPOS: { type: ArgumentType.STRING, menu: 'timePosition' },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        TIME: { type: ArgumentType.NUMBER, defaultValue: 0.3 },
                    },
                },
                {
                    opcode: 'audioSourceSetVolumeSpeedPitchPan', text: 'set audio source [NAME] [VSPP] in [AUDIOGROUP] to [VALUE]%', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        VSPP: { type: ArgumentType.STRING, menu: 'vspp', defaultValue: "" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        VALUE: { type: ArgumentType.NUMBER, defaultValue: 100 },
                    },
                },
                "---",
                {
                    opcode: 'audioSourceGetModificationsBoolean', text: 'audio source [NAME] [OPTION] in [AUDIOGROUP]', blockType: BlockType.BOOLEAN, disableMonitor: true,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        OPTION: { type: ArgumentType.STRING, menu: 'audioSourceOptionsBooleans', defaultValue: "" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                    },
                },
                {
                    opcode: 'audioSourceGetModificationsNormal', text: 'audio source [NAME] [OPTION] in [AUDIOGROUP]', blockType: BlockType.REPORTER, disableMonitor: true,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        OPTION: { type: ArgumentType.STRING, menu: 'audioSourceOptions', defaultValue: "" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                    },
                },
                // deleted blocks
                {
                    opcode: 'audioSourceSetTime', text: 'set audio source [NAME] start position in [AUDIOGROUP] to [TIME] seconds', blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "AudioSource1" },
                        AUDIOGROUP: { type: ArgumentType.STRING, menu: 'audioGroup', defaultValue: "" },
                        TIME: { type: ArgumentType.NUMBER, defaultValue: 0.3 },
                    },
                    hideFromPalette: true,
                },
            ],
            menus: {
                audioGroup: 'fetchAudioGroupMenu',
                sounds: 'fetchScratchSoundMenu',
                // specific menus
                vspp: {
                    acceptReporters: true,
                    items: [
                        { text: "volume", value: "volume" },
                        { text: "speed", value: "speed" },
                        { text: "detune", value: "pitch" },
                        { text: "pan", value: "pan" },
                    ]
                },
                playerOptions: {
                    acceptReporters: true,
                    items: [
                        { text: "play", value: "play" },
                        { text: "pause", value: "pause" },
                        { text: "stop", value: "stop" },
                    ]
                },
                loop: {
                    acceptReporters: true,
                    items: [
                        { text: "loop", value: "loop" },
                        { text: "not loop", value: "not loop" },
                    ]
                },
                timePosition: {
                    acceptReporters: true,
                    items: [
                        { text: "time", value: "time" },
                        { text: "start", value: "start" },
                        { text: "end", value: "end" },
                        { text: "start loop", value: "start loop" },
                        { text: "end loop", value: "end loop" },
                    ]
                },
                deleteOptions: {
                    acceptReporters: true,
                    items: [
                        { text: "delete", value: "delete" },
                        { text: "play", value: "play" },
                        { text: "pause", value: "pause" },
                        { text: "stop", value: "stop" },
                    ]
                },
                createOptions: {
                    acceptReporters: true,
                    items: [
                        { text: "create", value: "create" },
                        { text: "delete", value: "delete" },
                    ]
                },
                // audio group stuff
                audioGroupOptions: {
                    acceptReporters: true,
                    items: [
                        { text: "volume", value: "volume" },
                        { text: "speed", value: "speed" },
                        { text: "detune", value: "pitch" },
                        { text: "pan", value: "pan" },
                    ]
                },
                // audio source stuff
                audioSourceOptionsBooleans: {
                    acceptReporters: true,
                    items: [
                        { text: "playing", value: "playing" },
                        { text: "paused", value: "paused" },
                        { text: "looping", value: "looping" },
                    ]
                },
                audioSourceOptions: {
                    acceptReporters: true,
                    items: [
                        { text: "volume", value: "volume" },
                        { text: "speed", value: "speed" },
                        { text: "detune", value: "pitch" },
                        { text: "pan", value: "pan" },
                        { text: "time position", value: "time position" },
                        { text: "output volume", value: "output volume" },
                        { text: "start position", value: "start position" },
                        { text: "end position", value: "end position" },
                        { text: "start loop position", value: "start loop position" },
                        { text: "end loop position", value: "end loop position" },
                        { text: "sound length", value: "sound length" },
                        { text: "origin sound", value: "origin sound" },

                        // see https://stackoverflow.com/a/54567527 as to why this is not a menu option
                        // { text: "dominant frequency", value: "dominant frequency" },
                    ]
                }
            }
        };
    }

    createAudioGroup() {
        const newGroup = prompt('Set a name for this Audio Group:', 'audio group ' + (Helper.GetAllAudioGroups().length + 1));
        if (!newGroup) return alert('Canceled')
        if (Helper.GetAudioGroup(newGroup)) return alert(`"${newGroup}" is taken!`);
        Helper.AddAudioGroup(newGroup);
        Scratch.vm.emitWorkspaceUpdate();
        this.serialize();
    }
    deleteAudioGroup() {
        const group = prompt('Which audio group would you like to delete?');
        // helper deals with audio groups that dont exist, so we just call the function with no check
        Helper.DeleteAudioGroup(group);
        Scratch.vm.emitWorkspaceUpdate();
        this.serialize();
    }

    fetchAudioGroupMenu() {
        const audioGroups = Helper.GetAllAudioGroups();
        if (audioGroups.length <= 0) {
            return [
                {
                    text: '',
                    value: ''
                }
            ];
        }
        return audioGroups.map(audioGroup => ({
            text: audioGroup.id,
            value: audioGroup.id
        }));
    }
    fetchScratchSoundMenu() {
        const sounds = Scratch.vm.editingTarget.sprite.sounds; // this function only gets used in the editor so we are safe to use editingTarget
        if (sounds.length <= 0) return [{ text: '', value: '' }];
        return sounds.map(sound => ({
            text: sound.name,
            value: sound.name
        }));
    }

    audioGroupGet(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        return JSON.stringify(Object.getOwnPropertyNames(audioGroup.sources));
    }

    audioGroupSetVolumeSpeedPitchPan(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        switch (args.VSPP) {
            case "volume":
                audioGroup.globalVolume = Helper.Clamp(Cast.toNumber(args.VALUE) / 100, 0, 1);
                break;
            case "speed":
                audioGroup.globalSpeed = Helper.Clamp(Cast.toNumber(args.VALUE) / 100, 0, Infinity);
                break;
            case "detune":
            case "pitch":
                audioGroup.globalPitch = Cast.toNumber(args.VALUE);
                break;
            case "pan":
                audioGroup.globalPan = Helper.Clamp(Cast.toNumber(args.VALUE), -100, 100) / 100;
                break;
        }
        Helper.UpdateAudioGroupSources(audioGroup);
    }

    audioSourceCreate(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        switch (args.CREATEOPTION) {
            case "create":
                Helper.RemoveAudioSource(audioGroup, args.NAME);
                Helper.AppendAudioSource(audioGroup, args.NAME);
                break;
            case "delete":
                Helper.RemoveAudioSource(audioGroup, args.NAME);
                break;
        }
    }
    audioSourceDuplicate(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        const origin = Cast.toString(args.NAME);
        const newName = Cast.toString(args.COPY);
        if (!audioGroup) return;
        const audioSource = Helper.GrabAudioSource(audioGroup, origin);
        if (!audioSource) return;
        Helper.RemoveAudioSource(audioGroup, newName);
        audioGroup.sources[newName] = audioSource.clone();
    }
    audioSourceReverse(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        const target = Cast.toString(args.NAME);
        if (!audioGroup) return;
        const audioSource = Helper.GrabAudioSource(audioGroup, target);
        if (!audioSource) return;
        audioSource.reverse();
    }
    audioSourceDeleteAll(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);

        for (const sourceName in audioGroup.sources) {
            switch (args.DELETEOPTION) {
                case "delete":
                    Helper.RemoveAudioSource(audioGroup, sourceName);
                    break;
                case "play":
                    audioGroup.sources[sourceName].play();
                    break;
                case "pause":
                    audioGroup.sources[sourceName].pause();
                    break;
                case "stop":
                    audioGroup.sources[sourceName].stop();
                    break;
            }
        }
    }

    audioSourceSetScratch(args, util) {
        return new Promise((resolve, reject) => {
            const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
            if (!audioGroup) return resolve();
            const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
            if (!audioSource) return resolve();
            const sound = Helper.FindSoundByName(util.target.sprite.sounds, args.SOUND);
            if (!sound) return resolve();
            let canUse = true;
            try {
                // eslint-disable-next-line no-unused-vars
                util.target.sprite.soundBank.getSoundPlayer(sound.soundId).buffer;
            } catch {
                canUse = false;
            }
            if (!canUse) return resolve();
            const buffer = util.target.sprite.soundBank.getSoundPlayer(sound.soundId).buffer
            audioSource.duration = buffer.duration;
            audioSource.src = buffer;
            audioSource.originAudioName = `${args.SOUND}`;
            resolve();
        })
    }
    audioSourceSetUrl(args, util) {
        return new Promise((resolve, reject) => {
            const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
            if (!audioGroup) return resolve();
            const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
            if (!audioSource) return resolve();
            scratchFetch(args.URL).then(response => response.arrayBuffer().then(arrayBuffer => {
                Helper.audioContext.decodeAudioData(arrayBuffer, buffer => {
                    audioSource.duration = buffer.duration;
                    audioSource.src = buffer;
                    audioSource.originAudioName = `${args.URL}`;
                    resolve();
                }, resolve);
            }).catch(resolve)).catch(err => {
                // this is not a url, try some other stuff instead
                const sound = Helper.FindSoundByName(util.target.sprite.sounds, args.URL);
                if (sound) {
                    // this is a scratch sound name
                    let canUse = true;
                    try {
                        // eslint-disable-next-line no-unused-vars
                        util.target.sprite.soundBank.getSoundPlayer(sound.soundId).buffer;
                    } catch {
                        canUse = false;
                    }
                    if (!canUse) return resolve();
                    const buffer = util.target.sprite.soundBank.getSoundPlayer(sound.soundId).buffer
                    audioSource.duration = buffer.duration;
                    audioSource.src = buffer;
                    audioSource.originAudioName = `${args.URL}`;
                    return resolve();
                }
                console.warn(err);
                return resolve();
            });
        })
    }

    audioSourcePlayerOption(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        if (!audioGroup) return;
        const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
        if (!audioSource) return;
        if (!["play", "pause", "stop"].includes(args.PLAYEROPTION)) return;
        audioSource[args.PLAYEROPTION]();
    }
    audioSourceSetLoop(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        if (!audioGroup) return;
        const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
        if (!audioSource) return;
        if (!["loop", "not loop"].includes(args.LOOP)) return;
        audioSource.looping = args.LOOP == "loop";
    }
    audioSourceSetTime(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        if (!audioGroup) return;
        const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
        if (!audioSource) return;
        audioSource.startPosition = Cast.toNumber(args.TIME);
    }
    audioSourceSetTime2(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        if (!audioGroup) return;
        const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
        if (!audioSource) return;
        
        switch (args.TIMEPOS) {
            case "start":
                audioSource.startPosition = Cast.toNumber(args.TIME);
                break;
            case "end":
                audioSource.endPosition = Cast.toNumber(args.TIME);
                break;
            case "start loop":
                audioSource.loopStartPosition = Cast.toNumber(args.TIME);
                break;
            case "end loop":
                audioSource.loopEndPosition = Cast.toNumber(args.TIME);
                break;
            case "time":
                audioSource.setTimePosition(Cast.toNumber(args.TIME));
                break;
        }
    }
    audioSourceSetVolumeSpeedPitchPan(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        if (!audioGroup) return;
        const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
        if (!audioSource) return;
        switch (args.VSPP) {
            case "volume":
                audioSource.volume = Helper.Clamp(Cast.toNumber(args.VALUE) / 100, 0, 1);
                break;
            case "speed":
                audioSource.speed = Helper.Clamp(Cast.toNumber(args.VALUE) / 100, 0, Infinity);
                break;
            case "detune":
            case "pitch":
                audioSource.pitch = Cast.toNumber(args.VALUE);
                break;
            case "pan":
                audioSource.pan = Helper.Clamp(Cast.toNumber(args.VALUE), -100, 100) / 100;
                break;
        }
        Helper.UpdateAudioGroupSources(audioGroup);
    }

    audioGroupGetModifications(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        switch (args.OPTION) {
            case "volume":
                return audioGroup.globalVolume * 100;
            case "speed":
                return audioGroup.globalSpeed * 100;
            case "detune":
            case "pitch":
                return audioGroup.globalPitch;
            case "pan":
                return audioGroup.globalPan * 100;
            default:
                return 0;
        }
    }
    audioSourceGetModificationsBoolean(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        if (!audioGroup) return false;
        const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
        if (!audioSource) return false;
        switch (args.OPTION) {
            case "playing":
                return ((!audioSource.paused) && (!audioSource.notPlaying));
            case "paused":
                return audioSource.paused;
            case "looping":
                return audioSource.looping;
            default:
                return false;
        }
    }
    audioSourceGetModificationsNormal(args) {
        const audioGroup = Helper.GetAudioGroup(args.AUDIOGROUP);
        if (!audioGroup) return "";
        const audioSource = Helper.GrabAudioSource(audioGroup, args.NAME);
        if (!audioSource) return "";
        switch (args.OPTION) {
            case "volume":
                return audioSource.volume * 100;
            case "speed":
                return audioSource.speed * 100;
            case "detune":
            case "pitch":
                return audioSource.pitch;
            case "pan":
                return audioSource.pan * 100;
            case "start position":
                return audioSource.startPosition;
            case "end position":
                return audioSource.endPosition;
            case "start loop position":
                return audioSource.loopStartPosition;
            case "end loop position":
                return audioSource.loopEndPosition;
            case "time position":
                return audioSource.getTimePosition();
            case "sound length":
                return audioSource.duration;
            case "origin sound":
                return audioSource.originAudioName;
            case "output volume":
                return audioSource.getVolume() * 100;
            case "dominant frequency":
                return audioSource.getFrequency();
            default:
                return "";
        }
    }
}

Scratch.extensions.register(new AudioExtension());
})(Scratch);
