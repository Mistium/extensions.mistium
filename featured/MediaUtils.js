// Name: MediaUtils
// Author: Mistium
// Description: Just some uilities for media devices

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('MediaUtils must run unsandboxed.');
    }

    // Streams obtained through this extension, so they can be released on project stop.
    const activeStreams = new Set();

    const trackStream = (stream) => {
        activeStreams.add(stream);
        return stream;
    };

    // Permission names accepted by navigator.permissions.query
    const PERMISSION_NAMES = {
        camera: 'camera',
        microphone: 'microphone',
        audioinput: 'microphone',
        speaker: 'speaker-selection',
        audiooutput: 'speaker-selection',
    };

    class MediaUtils {
        constructor() {
            Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => this.stopAllMediaStreams());
        }

        getInfo() {
            return {
                id: 'MistiumMediaUtils',
                name: 'MediaUtils',
                color1: '#FF66C4',
                blocks: [
                    {
                        opcode: 'enumerateMediaDevices',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'enumerate media devices',
                    },
                    {
                        opcode: 'checkCameraPermission',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'camera permission granted?',
                    },
                    {
                        opcode: 'checkMicrophonePermission',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'microphone permission granted?',
                    },
                    {
                        opcode: 'checkSpeakerPermission',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'speaker permission granted?',
                    },
                    {
                        opcode: 'checkAudioInputPermission',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'audio input permission granted?',
                    },
                    {
                        opcode: 'checkAudioOutputPermission',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'audio output permission granted?',
                    },
                    {
                        opcode: 'getDisplayMedia',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get display media',
                    },
                    {
                        opcode: 'getSupportedConstraints',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get supported constraints',
                    },
                    {
                        opcode: 'getMediaStream',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get media stream [DEVICE]',
                        arguments: {
                            DEVICE: { type: Scratch.ArgumentType.STRING, menu: 'deviceKinds', defaultValue: 'videoinput' },
                        }
                    },
                    {
                        opcode: 'getUserMedia',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get user media with constraints [CONSTRAINTS]',
                        arguments: {
                            CONSTRAINTS: { type: Scratch.ArgumentType.STRING, defaultValue: '{"audio":true,"video":true}' },
                        }
                    },
                    {
                        opcode: 'stopMediaStream',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop media stream [STREAM]',
                        arguments: {
                            STREAM: { type: Scratch.ArgumentType.ANY, defaultValue: null },
                        }
                    },
                    {
                        opcode: 'pauseMediaStream',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'pause media stream [STREAM]',
                        arguments: {
                            STREAM: { type: Scratch.ArgumentType.ANY, defaultValue: null },
                        }
                    },
                    {
                        opcode: 'resumeMediaStream',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'resume media stream [STREAM]',
                        arguments: {
                            STREAM: { type: Scratch.ArgumentType.ANY, defaultValue: null },
                        }
                    },
                    {
                        opcode: 'muteMediaStream',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'mute media stream [STREAM]',
                        arguments: {
                            STREAM: { type: Scratch.ArgumentType.ANY, defaultValue: null },
                        }
                    },
                    {
                        opcode: 'unmuteMediaStream',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'unmute media stream [STREAM]',
                        arguments: {
                            STREAM: { type: Scratch.ArgumentType.ANY, defaultValue: null },
                        }
                    },
                    {
                        opcode: 'stopAllMediaStreams',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop all media streams',
                    }
                ],
                menus: {
                    deviceKinds: {
                        acceptReporters: true,
                        items: ['videoinput', 'audioinput'],
                    },
                },
            };
        }

        async enumerateMediaDevices() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                if (devices.length === 0) return "No media devices found.";
                const uniqueDevices = {};
                devices.forEach(device => {
                    const deviceId = device.deviceId;
                    // Labels are empty until permission is granted, so fall back to something unique
                    const key = device.label || `${device.kind} ${deviceId || device.groupId || Object.keys(uniqueDevices).length}`;
                    if (uniqueDevices[key]) {
                        return;
                    }
                    const info = {
                        id: deviceId || 'N/A',
                    };
                    if (device.kind === 'audioinput' && devices.some(d => d.deviceId === deviceId && d.kind === 'audiooutput')) {
                        info.type = 'audioboth';
                    } else if (device.kind === 'audioinput') {
                        info.type = 'audioinput';
                    } else if (device.kind === 'audiooutput') {
                        info.type = 'audiooutput';
                    } else if (device.kind === 'videoinput') {
                        info.type = 'videoinput';
                    }
                    uniqueDevices[key] = info;
                });
                return JSON.stringify(uniqueDevices);
            } catch (err) {
                return 'Error enumerating devices: ' + err;
            }
        }

        checkCameraPermission() {
            return this.checkPermission('camera');
        }

        checkMicrophonePermission() {
            return this.checkPermission('microphone');
        }

        checkSpeakerPermission() {
            return this.checkPermission('speaker');
        }

        checkAudioInputPermission() {
            return this.checkPermission('audioinput');
        }

        checkAudioOutputPermission() {
            return this.checkPermission('audiooutput');
        }

        getDisplayMedia() {
            return navigator.mediaDevices?.getDisplayMedia
                ? 'Display media supported'
                : 'Display media not supported';
        }

        getSupportedConstraints() {
            return JSON.stringify(navigator.mediaDevices?.getSupportedConstraints() ?? {});
        }

        async getMediaStream(args) {
            const audio = Scratch.Cast.toString(args.DEVICE) === 'audioinput';
            try {
                return trackStream(await navigator.mediaDevices.getUserMedia({ video: !audio, audio }));
            } catch (e) {
                console.error(e);
                return '';
            }
        }

        async getUserMedia(args) {
            try {
                return trackStream(await navigator.mediaDevices.getUserMedia(JSON.parse(Scratch.Cast.toString(args.CONSTRAINTS))));
            } catch (e) {
                console.error(e);
                return '';
            }
        }

        stopMediaStream(args) {
            if (args.STREAM && typeof args.STREAM.getTracks === 'function') {
                args.STREAM.getTracks().forEach(track => track.stop());
                activeStreams.delete(args.STREAM);
            }
        }

        stopAllMediaStreams() {
            activeStreams.forEach(stream => stream.getTracks().forEach(track => track.stop()));
            activeStreams.clear();
        }

        pauseMediaStream(args) {
            if (args.STREAM && typeof args.STREAM.getTracks === 'function') {
                args.STREAM.getTracks().forEach(track => track.enabled = false);
            }
        }

        resumeMediaStream(args) {
            if (args.STREAM && typeof args.STREAM.getTracks === 'function') {
                args.STREAM.getTracks().forEach(track => track.enabled = true);
            }
        }

        muteMediaStream(args) {
            if (args.STREAM && typeof args.STREAM.getAudioTracks === 'function') {
                args.STREAM.getAudioTracks().forEach(track => track.enabled = false);
            }
        }

        unmuteMediaStream(args) {
            if (args.STREAM && typeof args.STREAM.getAudioTracks === 'function') {
                args.STREAM.getAudioTracks().forEach(track => track.enabled = true);
            }
        }

        async checkPermission(deviceType) {
            try {
                const permissionStatus = await navigator.permissions.query({ name: PERMISSION_NAMES[deviceType] });
                return permissionStatus.state === 'granted';
            } catch {
                return false;
            }
        }
    }

    Scratch.extensions.register(new MediaUtils());
})(Scratch);
