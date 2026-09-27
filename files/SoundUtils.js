// Name: SoundUtils
// Author: Mistium
// Description: Create channels and generate simple tones.

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("SoundUtils must run unsandboxed.");
    }

    class SoundUtils {
        constructor(runtime) {
            this.runtime = runtime;
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.channels = [];
            Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
                for (const channel of this.channels) this._stopChannel(channel);
            });
        }

        getInfo() {
            return {
                id: "SoundUtils",
                name: 'SoundUtils',
                blocks: [
                    {
                        opcode: 'createChannel',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Create channel [CHANNEL]',
                        arguments: {
                            CHANNEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Channel 1'
                            }
                        }
                    },
                    {
                        opcode: 'playTone',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Play [FREQUENCY]Hz tone on [CHANNEL]',
                        arguments: {
                            FREQUENCY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 440
                            },
                            CHANNEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Channel 1'
                            }
                        }
                    },
                    {
                        opcode: 'setWaveform',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set waveform of [CHANNEL] to [WAVEFORM]',
                        arguments: {
                            CHANNEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Channel 1'
                            },
                            WAVEFORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'waveforms'
                            }
                        }
                    },
                    {
                        opcode: 'stopAllSounds',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Stop all sounds on [CHANNEL]',
                        arguments: {
                            CHANNEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Channel 1'
                            }
                        }
                    },
                    {
                        opcode: 'isPlaying',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'Sound playing on [CHANNEL]?',
                        arguments: {
                            CHANNEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Channel 1'
                            }
                        }
                    },
                    {
                        opcode: 'generateWhiteNoise',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Generate white noise on [CHANNEL] with frequency [FREQUENCY]Hz',
                        arguments: {
                            CHANNEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Channel 1'
                            },
                            FREQUENCY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 440
                            }
                        }
                    }
                ],
                menus: {
                    waveforms: {
                        acceptReporters: true,
                        items: ['sine', 'square', 'sawtooth', 'triangle']
                    }
                }
            };
        }

        _getChannel(name) {
            const channelName = Scratch.Cast.toString(name);
            const channel = this.channels.find(ch => ch.name === channelName);
            if (!channel) {
                console.error(`Channel '${channelName}' not found.`);
            }
            return channel;
        }

        _stopChannel(channel) {
            if (channel.oscillator) {
                channel.oscillator.stop();
                channel.oscillator = null;
            }
            if (channel.source) {
                channel.source.stop();
                channel.source = null;
            }
            channel.playing = false;
        }

        createChannel(args) {
            const name = Scratch.Cast.toString(args.CHANNEL);
            if (this.channels.some(ch => ch.name === name)) return;
            const channel = {
                name,
                oscillator: null,
                source: null,
                waveform: 'sine',
                playing: false
            };
            this.channels.push(channel);
        }

        playTone(args) {
            const frequency = Scratch.Cast.toNumber(args.FREQUENCY);
            const channel = this._getChannel(args.CHANNEL);
            if (!channel) return;

            this.audioContext.resume();
            if (!channel.oscillator) {
                channel.oscillator = this.audioContext.createOscillator();
                channel.oscillator.type = channel.waveform;
                channel.oscillator.connect(this.audioContext.destination);
            }

            channel.oscillator.frequency.value = frequency;
            if (!channel.playing) {
                channel.oscillator.start();
                channel.playing = true;
            }
        }

        setWaveform(args) {
            const waveform = Scratch.Cast.toString(args.WAVEFORM);
            if (!['sine', 'square', 'sawtooth', 'triangle'].includes(waveform)) return;
            const channel = this._getChannel(args.CHANNEL);
            if (!channel) return;

            channel.waveform = waveform;
            if (channel.oscillator) channel.oscillator.type = waveform;
        }

        stopAllSounds(args) {
            const channel = this._getChannel(args.CHANNEL);
            if (!channel) return;

            this._stopChannel(channel);
        }

        isPlaying(args) {
            const channel = this._getChannel(args.CHANNEL);
            if (!channel) return false;

            return channel.playing || !!channel.source;
        }

        generateWhiteNoise(args) {
            const frequency = Scratch.Cast.toNumber(args.FREQUENCY);
            const channel = this._getChannel(args.CHANNEL);
            if (!channel) return;

            // Stop any existing source on the channel
            if (channel.source) {
                channel.source.stop();
                channel.source = null;
            }

            this.audioContext.resume();
            const bufferSize = 4096;
            const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = this.audioContext.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            whiteNoise.connect(this.audioContext.destination);
            whiteNoise.start();

            // Update frequency
            const playbackRate = frequency / this.audioContext.sampleRate;
            whiteNoise.playbackRate.setValueAtTime(playbackRate, this.audioContext.currentTime);

            channel.source = whiteNoise;
        }
    }

    Scratch.extensions.register(new SoundUtils());
})(Scratch);
