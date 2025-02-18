// Name: MediaUtils
// Author: Mistium
// Description: Just some uilities for media devices

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

class MediaUtils {
    constructor(runtime) {
        this.runtime = runtime;
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
                    text: 'get media stream',
                    arguments: {
                        DEVICE: { type: Scratch.ArgumentType.STRING, defaultValue: 'videoinput' },
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
                }
            ]
        };
    }

    enumerateMediaDevices() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    if (devices.length === 0) {
                        resolve("No media devices found.");
                        return;
                    }
                    const uniqueDevices = {};
                    devices.forEach(device => {
                        const deviceId = device.deviceId;
                        if (uniqueDevices[device.label]) {
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
                        uniqueDevices[device.label] = info;
                    });
                    resolve(JSON.stringify(uniqueDevices));
                })
                .catch(err => {
                    reject('Error enumerating devices: ' + err);
                });
        });
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
        return navigator.mediaDevices.getDisplayMedia
            ? 'Display media supported'
            : 'Display media not supported';
    }

    getSupportedConstraints() {
        return JSON.stringify(navigator.mediaDevices.getSupportedConstraints());
    }

    getMediaStream(args) {
        return navigator.mediaDevices.getUserMedia({ video: args.DEVICE === 'videoinput' });
    }

    getUserMedia(args) {
        return navigator.mediaDevices.getUserMedia(JSON.parse(args.CONSTRAINTS));
    }

    stopMediaStream(args) {
        if (args.STREAM && typeof args.STREAM.getTracks === 'function') {
            args.STREAM.getTracks().forEach(track => track.stop());
        }
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

    checkPermission(deviceType) {
        return new Promise((resolve) => {
            navigator.permissions.query({ name: deviceType })
                .then(permissionStatus => {
                    resolve(permissionStatus.state === 'granted');
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }
}

Scratch.extensions.register(new MediaUtils());
