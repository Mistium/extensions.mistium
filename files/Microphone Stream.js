// Name: Microphone Stream
// Author: Mistium
// Description: Stream microphone analysis and keep a configurable rolling recording buffer.

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Microphone Stream must run unsandboxed.");
  }

  const Cast = Scratch.Cast;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const clampInt = (value, min, max) => Math.round(clamp(Number(value) || min, min, max));

  class MicrophoneStream {
    constructor(runtime) {
      this.runtime = runtime;
      this.stream = null;
      this.audioContext = null;
      this.source = null;
      this.analyser = null;
      this.timeData = null;
      this.frequencyData = null;
      this.updateTimer = null;

      this.processor = null;
      this.silentGain = null;
      this.chunks = [];
      this.rollingSeconds = 10;
      this.recordingMimeType = "audio/mpeg";
      this.recordingStartedAt = 0;
      this.recording = false;
      this.recordingPaused = false;
      this.lastObjectUrl = "";
      this.lastError = "";
      this.mp3Cache = null;
      this.chunkVersion = 0;
      this.encoderPromise = null;
      this.startPromise = null;

      this.resetFrame();
    }

    getInfo() {
      return {
        id: "MistiumMicrophoneStream",
        name: "Microphone Stream",
        color1: "#d95f43",
        blocks: [
          {
            opcode: "startStream",
            blockType: Scratch.BlockType.COMMAND,
            text: "start microphone stream rolling buffer [SECONDS] seconds fft size [FFT]",
            arguments: {
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              FFT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2048 }
            }
          },
          {
            opcode: "stopStream",
            blockType: Scratch.BlockType.COMMAND,
            text: "stop microphone stream"
          },
          {
            opcode: "isStreaming",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "microphone streaming?"
          },
          {
            opcode: "whenFrame",
            blockType: Scratch.BlockType.EVENT,
            text: "when microphone data updates",
            isEdgeActivated: false
          },
          "---",
          {
            opcode: "getInfoValue",
            blockType: Scratch.BlockType.REPORTER,
            text: "current [INFO]",
            arguments: {
              INFO: { menu: "INFO" }
            }
          },
          {
            opcode: "getAllInfo",
            blockType: Scratch.BlockType.REPORTER,
            text: "all microphone info"
          },
          {
            opcode: "getWaveform",
            blockType: Scratch.BlockType.REPORTER,
            text: "waveform [COUNT] samples as JSON",
            arguments: {
              COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 128 }
            }
          },
          {
            opcode: "getFrequencyData",
            blockType: Scratch.BlockType.REPORTER,
            text: "frequency data [COUNT] bins as JSON",
            arguments: {
              COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 128 }
            }
          },
          "---",
          {
            opcode: "startRecording",
            blockType: Scratch.BlockType.COMMAND,
            text: "start MP3 recording"
          },
          {
            opcode: "stopRecording",
            blockType: Scratch.BlockType.COMMAND,
            text: "stop recording"
          },
          {
            opcode: "pauseRecording",
            blockType: Scratch.BlockType.COMMAND,
            text: "pause recording"
          },
          {
            opcode: "resumeRecording",
            blockType: Scratch.BlockType.COMMAND,
            text: "resume recording"
          },
          {
            opcode: "clearRecording",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear recording buffer"
          },
          {
            opcode: "isRecording",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "recording?"
          },
          {
            opcode: "isRecordingPaused",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "recording paused?"
          },
          "---",
          {
            opcode: "setRollingSeconds",
            blockType: Scratch.BlockType.COMMAND,
            text: "set rolling buffer to [SECONDS] seconds",
            arguments: {
              SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: "getRollingSeconds",
            blockType: Scratch.BlockType.REPORTER,
            text: "rolling buffer seconds"
          },
          {
            opcode: "getRecordingSize",
            blockType: Scratch.BlockType.REPORTER,
            text: "current recording size in [UNIT]",
            arguments: {
              UNIT: { menu: "SIZE_UNITS" }
            }
          },
          {
            opcode: "getRecordingInfo",
            blockType: Scratch.BlockType.REPORTER,
            text: "current recording [INFO]",
            arguments: {
              INFO: { menu: "RECORDING_INFO" }
            }
          },
          {
            opcode: "getRecordingAs",
            blockType: Scratch.BlockType.REPORTER,
            text: "current recording as [TYPE]",
            arguments: {
              TYPE: { menu: "RECORDING_OUTPUTS" }
            }
          },
          {
            opcode: "getLastError",
            blockType: Scratch.BlockType.REPORTER,
            text: "last microphone error"
          }
        ],
        menus: {
          INFO: {
            acceptReporters: true,
            items: [
              "loudness",
              "peak",
              "decibels",
              "pitch",
              "frequency",
              "sampleRate",
              "fftSize",
              "bufferSeconds",
              "recordingBytes",
              "recordingSeconds",
              "mimeType"
            ]
          },
          SIZE_UNITS: {
            acceptReporters: true,
            items: ["bytes", "KB", "MB"]
          },
          RECORDING_OUTPUTS: {
            acceptReporters: true,
            items: ["data URI", "object URL"]
          },
          RECORDING_INFO: {
            acceptReporters: true,
            items: ["seconds", "chunks"]
          }
        }
      };
    }

    async startStream(args) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.lastError = "Microphone capture is not supported in this browser.";
        return;
      }

      this.setRollingSeconds({ SECONDS: args.SECONDS });

      if (this.stream) {
        this.configureAnalyser(args.FFT);
        return;
      }

      // Concurrent starts share one getUserMedia call so no stream/context leaks.
      if (!this.startPromise) {
        this.startPromise = this.openStream(args.FFT).finally(() => {
          this.startPromise = null;
        });
      }
      return this.startPromise;
    }

    async openStream(fft) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          },
          video: false
        });
        this.stream.getAudioTracks().forEach(track => {
          track.addEventListener("ended", () => {
            this.lastError = "Microphone disconnected.";
            this.stopStream();
          });
        });

        await this.audioContext.resume();
        this.source = this.audioContext.createMediaStreamSource(this.stream);
        this.configureAnalyser(fft);
        this.source.connect(this.analyser);
        this.setupPcmCapture();
        this.startUpdates();
        this.lastError = "";
      } catch (error) {
        this.lastError = error && error.message ? error.message : String(error);
        await this.stopStream();
      }
    }

    async stopStream() {
      this.stopUpdates();
      await this.stopRecording();

      if (this.source) {
        this.source.disconnect();
        this.source = null;
      }

      this.disconnectPcmCapture();

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      if (this.audioContext) {
        await this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }

      this.analyser = null;
      this.timeData = null;
      this.frequencyData = null;
      this.resetFrame();
    }

    isStreaming() {
      return !!this.stream;
    }

    whenFrame() {
      return true;
    }

    configureAnalyser(fftSize) {
      const validSize = this.validFftSize(fftSize);
      if (!this.audioContext) return;

      const oldAnalyser = this.analyser;
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = validSize;
      this.analyser.smoothingTimeConstant = 0.25;
      this.timeData = new Float32Array(this.analyser.fftSize);
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

      if (this.source && oldAnalyser) {
        this.source.disconnect(oldAnalyser);
        this.source.connect(this.analyser);
      }
    }

    setupPcmCapture() {
      if (!this.audioContext || !this.source || this.processor) return;

      const bufferSize = 4096;
      this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
      this.silentGain = this.audioContext.createGain();
      this.silentGain.gain.value = 0;

      this.processor.onaudioprocess = event => {
        if (!this.recording || this.recordingPaused) return;

        const input = event.inputBuffer.getChannelData(0);
        const samples = new Float32Array(input.length);
        samples.set(input);
        this.chunks.push({
          samples,
          time: Date.now(),
          duration: samples.length / this.audioContext.sampleRate,
          size: samples.length * 2
        });
        this.invalidateMp3Cache();
        this.pruneChunks();
      };

      this.source.connect(this.processor);
      this.processor.connect(this.silentGain);
      this.silentGain.connect(this.audioContext.destination);
    }

    disconnectPcmCapture() {
      if (this.processor) {
        this.processor.onaudioprocess = null;
        this.processor.disconnect();
        this.processor = null;
      }

      if (this.silentGain) {
        this.silentGain.disconnect();
        this.silentGain = null;
      }
    }

    validFftSize(value) {
      const requested = clampInt(value, 32, 32768);
      let size = 32;
      while (size < requested && size < 32768) size *= 2;
      return size;
    }

    startUpdates() {
      this.stopUpdates();
      this.updateFrame();
      this.updateTimer = setInterval(() => this.updateFrame(), 50);
    }

    stopUpdates() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
      }
    }

    updateFrame() {
      if (!this.analyser || !this.timeData || !this.frequencyData) return;

      this.analyser.getFloatTimeDomainData(this.timeData);
      this.analyser.getByteFrequencyData(this.frequencyData);

      let sumSquares = 0;
      let peak = 0;
      for (let i = 0; i < this.timeData.length; i++) {
        const sample = this.timeData[i];
        sumSquares += sample * sample;
        peak = Math.max(peak, Math.abs(sample));
      }

      const rms = Math.sqrt(sumSquares / this.timeData.length);
      const decibels = rms > 0 ? 20 * Math.log10(rms) : -100;
      const frequency = this.findDominantFrequency();
      const pitch = this.findPitch();

      this.frame = {
        loudness: this.round(clamp(rms * 140, 0, 100)),
        peak: this.round(clamp(peak * 100, 0, 100)),
        decibels: this.round(clamp(decibels, -100, 0)),
        pitch: this.round(pitch),
        frequency: this.round(frequency),
        sampleRate: this.audioContext ? this.audioContext.sampleRate : 0,
        fftSize: this.analyser.fftSize,
        bufferSeconds: this.rollingSeconds,
        recordingBytes: this.getRecordingBytesSync(),
        recordingSeconds: this.getRecordingDuration(),
        mimeType: this.recordingMimeType
      };

      if (this.runtime && typeof this.runtime.startHats === "function") {
        this.runtime.startHats("MistiumMicrophoneStream_whenFrame");
      }
    }

    findDominantFrequency() {
      if (!this.frequencyData || !this.audioContext || !this.analyser) return 0;

      let maxValue = 0;
      let maxIndex = 0;
      for (let i = 1; i < this.frequencyData.length; i++) {
        if (this.frequencyData[i] > maxValue) {
          maxValue = this.frequencyData[i];
          maxIndex = i;
        }
      }

      if (maxValue < 8) return 0;
      return maxIndex * this.audioContext.sampleRate / this.analyser.fftSize;
    }

    findPitch() {
      if (!this.timeData || !this.audioContext) return 0;

      let rms = 0;
      for (let i = 0; i < this.timeData.length; i++) {
        rms += this.timeData[i] * this.timeData[i];
      }
      rms = Math.sqrt(rms / this.timeData.length);
      if (rms < 0.01) return 0;

      // Cap the window: a full 32768 sample autocorrelation every 50ms freezes the page.
      const size = Math.min(this.timeData.length, 4096);
      const sampleRate = this.audioContext.sampleRate;
      const minLag = Math.floor(sampleRate / 1200);
      const maxLag = Math.min(Math.floor(sampleRate / 50), size - 1);
      const correlations = new Float32Array(maxLag + 2);
      let bestLag = -1;
      let bestCorrelation = 0;

      for (let lag = minLag; lag <= maxLag; lag++) {
        let correlation = 0;
        for (let i = 0; i < size - lag; i++) {
          correlation += this.timeData[i] * this.timeData[i + lag];
        }
        correlation /= size - lag;
        correlations[lag] = correlation;

        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestLag = lag;
        }
      }

      if (bestLag <= 0 || bestCorrelation < 0.002) return 0;

      // Every multiple of the period correlates about equally, so the global max
      // often lands an octave or two low. Take the earliest peak close to it.
      for (let lag = minLag + 1; lag < bestLag; lag++) {
        const correlation = correlations[lag];
        if (correlation >= bestCorrelation * 0.9 && correlation >= correlations[lag - 1] && correlation >= correlations[lag + 1]) {
          return sampleRate / lag;
        }
      }
      return sampleRate / bestLag;
    }

    getLoudness() {
      return this.frame.loudness;
    }

    getPeak() {
      return this.frame.peak;
    }

    getDecibels() {
      return this.frame.decibels;
    }

    getPitch() {
      return this.frame.pitch;
    }

    getFrequency() {
      return this.frame.frequency;
    }

    getInfoValue(args) {
      const key = Cast.toString(args.INFO);
      return Object.prototype.hasOwnProperty.call(this.frame, key) ? this.frame[key] : "";
    }

    getAllInfo() {
      return JSON.stringify(this.frame);
    }

    getWaveform(args) {
      if (!this.timeData) return "[]";
      const count = clampInt(args.COUNT, 1, 2048);
      return JSON.stringify(this.downsample(this.timeData, count, value => this.round(value)));
    }

    getFrequencyData(args) {
      if (!this.frequencyData) return "[]";
      const count = clampInt(args.COUNT, 1, 2048);
      return JSON.stringify(this.downsample(this.frequencyData, count, value => value));
    }

    downsample(data, count, mapper) {
      if (count >= data.length) {
        return Array.from(data, mapper);
      }

      const result = [];
      const step = data.length / count;
      for (let i = 0; i < count; i++) {
        result.push(mapper(data[Math.floor(i * step)]));
      }
      return result;
    }

    async startRecording() {
      if (!this.stream) {
        await this.startStream({ SECONDS: this.rollingSeconds, FFT: 2048 });
      }

      if (!this.stream || !this.audioContext) {
        this.lastError = "Microphone stream is not available.";
        return;
      }

      if (this.recording) return;

      this.clearRecording();
      this.setupPcmCapture();
      this.recording = true;
      this.recordingPaused = false;
      this.recordingMimeType = "audio/mpeg";
      this.recordingStartedAt = Date.now();
      this.lastError = "";
    }

    stopRecording() {
      this.recording = false;
      this.recordingPaused = false;
      this.pruneChunks();
      return Promise.resolve();
    }

    pauseRecording() {
      if (this.recording) this.recordingPaused = true;
    }

    resumeRecording() {
      if (this.recording) this.recordingPaused = false;
    }

    clearRecording() {
      this.chunks = [];
      this.recordingStartedAt = this.recording ? Date.now() : 0;
      this.invalidateMp3Cache();
      this.revokeObjectUrl();
    }

    isRecording() {
      return this.recording && !this.recordingPaused;
    }

    isRecordingPaused() {
      return this.recording && this.recordingPaused;
    }

    setRollingSeconds(args) {
      this.rollingSeconds = Math.max(0, Number(args.SECONDS) || 0);
      this.pruneChunks();
      this.frame.bufferSeconds = this.rollingSeconds;
    }

    getRollingSeconds() {
      return this.rollingSeconds;
    }

    async getRecordingSize(args) {
      const bytes = await this.getRecordingBytes();
      const unit = Cast.toString(args.UNIT);
      if (unit === "KB") return this.round(bytes / 1024);
      if (unit === "MB") return this.round(bytes / 1024 / 1024);
      return bytes;
    }

    async getRecordingBytes() {
      const blob = await this.createRecordingBlob();
      return blob.size;
    }

    getRecordingBytesSync() {
      this.pruneChunks();
      if (this.mp3Cache && this.mp3Cache.version === this.chunkVersion) {
        return this.mp3Cache.blob.size;
      }
      return Math.ceil(this.getRecordingDuration() * 128000 / 8);
    }

    getRecordingDuration() {
      this.pruneChunks();
      if (this.chunks.length < 1) return 0;

      return this.round(this.chunks.reduce((total, chunk) => total + chunk.duration, 0));
    }

    getRecordingInfo(args) {
      const info = Cast.toString(args.INFO);
      if (info === "chunks") return this.getChunkCount();
      return this.getRecordingDuration();
    }

    async getRecordingDataUri() {
      const blob = await this.createRecordingBlob();
      if (blob.size === 0) return "";

      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(Cast.toString(reader.result));
        reader.onerror = () => {
          this.lastError = reader.error ? reader.error.message : "Failed to read recording.";
          resolve("");
        };
        reader.readAsDataURL(blob);
      });
    }

    async getRecordingAs(args) {
      const type = Cast.toString(args.TYPE);
      if (type === "object URL") return await this.getRecordingObjectUrl();
      return await this.getRecordingDataUri();
    }

    async getRecordingObjectUrl() {
      const blob = await this.createRecordingBlob();
      if (blob.size === 0) return "";

      this.revokeObjectUrl();
      this.lastObjectUrl = URL.createObjectURL(blob);
      return this.lastObjectUrl;
    }

    getChunkCount() {
      this.pruneChunks();
      return this.chunks.length;
    }

    getLastError() {
      return this.lastError;
    }

    async createRecordingBlob() {
      this.pruneChunks();
      if (this.chunks.length === 0) {
        return new Blob([], { type: "audio/mpeg" });
      }

      if (this.mp3Cache && this.mp3Cache.version === this.chunkVersion) {
        return this.mp3Cache.blob;
      }

      const blob = await this.encodeMp3();
      this.mp3Cache = {
        version: this.chunkVersion,
        blob
      };
      return blob;
    }

    async encodeMp3() {
      const lame = await this.loadMp3Encoder();
      if (!lame) return new Blob([], { type: "audio/mpeg" });

      const inputSampleRate = this.audioContext ? this.audioContext.sampleRate : 44100;
      const outputSampleRate = this.getMp3SampleRate(inputSampleRate);
      const encoder = new lame.Mp3Encoder(1, outputSampleRate, 128);
      const mp3Buffers = [];

      for (const chunk of this.chunks) {
        const samples = inputSampleRate === outputSampleRate
          ? chunk.samples
          : this.resampleFloat32(chunk.samples, inputSampleRate, outputSampleRate);
        const pcm = this.floatToInt16(samples);
        const blockSize = 1152;
        for (let i = 0; i < pcm.length; i += blockSize) {
          const encoded = encoder.encodeBuffer(pcm.subarray(i, i + blockSize));
          if (encoded.length > 0) mp3Buffers.push(encoded);
        }
      }

      const tail = encoder.flush();
      if (tail.length > 0) mp3Buffers.push(tail);

      return new Blob(mp3Buffers, { type: "audio/mpeg" });
    }

    getMp3SampleRate(sampleRate) {
      const allowed = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];
      return allowed.includes(Math.round(sampleRate)) ? Math.round(sampleRate) : 44100;
    }

    resampleFloat32(samples, fromRate, toRate) {
      const ratio = fromRate / toRate;
      const length = Math.max(1, Math.round(samples.length / ratio));
      const output = new Float32Array(length);

      for (let i = 0; i < length; i++) {
        const position = i * ratio;
        const before = Math.floor(position);
        const after = Math.min(before + 1, samples.length - 1);
        const fraction = position - before;
        output[i] = samples[before] + (samples[after] - samples[before]) * fraction;
      }

      return output;
    }

    async loadMp3Encoder() {
      if (window.lamejs && window.lamejs.Mp3Encoder) return window.lamejs;
      if (this.encoderPromise) return this.encoderPromise;

      this.encoderPromise = new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js";
        script.async = true;
        script.onload = () => resolve(window.lamejs || null);
        script.onerror = () => {
          this.lastError = "Could not load MP3 encoder.";
          this.encoderPromise = null;
          script.remove();
          resolve(null);
        };
        document.head.appendChild(script);
      });

      return this.encoderPromise;
    }

    floatToInt16(samples) {
      const pcm = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const sample = clamp(samples[i], -1, 1);
        pcm[i] = sample < 0 ? sample * 32768 : sample * 32767;
      }
      return pcm;
    }

    pruneChunks() {
      if (this.rollingSeconds <= 0 || this.chunks.length === 0) return;

      let duration = this.chunks.reduce((total, chunk) => total + chunk.duration, 0);
      let changed = false;
      while (this.chunks.length > 1 && duration > this.rollingSeconds) {
        duration -= this.chunks[0].duration;
        this.chunks.shift();
        changed = true;
      }
      if (changed) this.invalidateMp3Cache();
    }

    invalidateMp3Cache() {
      this.chunkVersion++;
      this.mp3Cache = null;
    }

    revokeObjectUrl() {
      if (this.lastObjectUrl) {
        URL.revokeObjectURL(this.lastObjectUrl);
        this.lastObjectUrl = "";
      }
    }

    resetFrame() {
      this.frame = {
        loudness: 0,
        peak: 0,
        decibels: -100,
        pitch: 0,
        frequency: 0,
        sampleRate: 0,
        fftSize: 0,
        bufferSeconds: this.rollingSeconds,
        recordingBytes: 0,
        recordingSeconds: 0,
        mimeType: this.recordingMimeType
      };
    }

    round(value) {
      return Math.round(value * 1000) / 1000;
    }
  }

  Scratch.extensions.register(new MicrophoneStream(Scratch.vm && Scratch.vm.runtime));
})(Scratch);
