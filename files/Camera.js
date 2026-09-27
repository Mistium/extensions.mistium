// Name: Camera
// By: @mistium on discord
// Description: Use the camera :P
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  class CameraExtension {
    constructor() {
      this.video = null;
      this.stream = null;
      this.starting = null;

      // Release the camera when the project is stopped
      if (Scratch.vm) {
        Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => this.stopCamera());
      }
    }

    getInfo() {
      return {
        id: 'cameraextension',
        name: 'Camera Extension',
        blocks: [
          {
            opcode: 'startCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Start camera',
          },
          {
            opcode: 'stopCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Stop camera',
          },
          {
            opcode: 'captureCamera',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Capture camera as Data URI',
          },
          {
            opcode: 'cameraWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'camera width',
          },
          {
            opcode: 'cameraHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: 'camera height',
          },
          {
            opcode: 'isCameraOn',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'camera on?',
          },
        ],
      };
    }

    async startCamera() {
      if (!this.stream) {
        await this.setupCamera();
      }
    }

    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.stream = null;
      this.video = null;
    }

    async captureCamera() {
      if (!this.stream) {
        await this.setupCamera();
      }

      const video = this.video;
      if (!this.stream || !video || !video.videoWidth) return '';

      // Draw the current frame to a canvas so this works in every browser (ImageCapture is Chromium-only)
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      return canvas.toDataURL('image/png');
    }


    cameraWidth() {
      return this.video ? this.video.videoWidth : 0;
    }

    cameraHeight() {
      return this.video ? this.video.videoHeight : 0;
    }

    isCameraOn() {
      return !!this.stream;
    }

    setupCamera() {
      // Share one pending request so concurrent starts don't open the camera twice
      if (!this.starting) {
        this.starting = this._openCamera().finally(() => {
          this.starting = null;
        });
      }
      return this.starting;
    }

    async _openCamera() {
      let stream = null;
      try {
        // Request access to the user's camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Set up video element to stream from the camera
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.srcObject = stream;
        await video.play();

        this.video = video;
        this.stream = stream;
      } catch (error) {
        console.error('Failed to access camera:', error);
        if (stream) stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.video = null;
      }
    }
  }

  const cameraExtension = new CameraExtension();
  Scratch.extensions.register(cameraExtension);

})(Scratch);
