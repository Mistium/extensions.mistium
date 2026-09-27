// Name: Prism
// ID: jgPrism
// Description: Audio, data URLs, base64, deflate/inflate, numerical encoding and more.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_prism
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Prism must run unsandboxed.");

  const formatMessage = (m) => (typeof m === "string" ? m : m.default);
  const scratchFetch = (...a) => (Scratch.fetch ? Scratch.fetch(...a) : fetch(...a));

  // from PenguinMod src/util/json-block-utilities.js
  const validateArray = (array) => {
      let valid = false;
      let allay = [];
      try {
          if (!array.startsWith('[')) throw new Error('error lol');
          allay = JSON.parse(array);
          valid = true;
      } catch {}

      return {
          array: allay,
          json: array,
          isValid: valid
      };
  };

  // from PenguinMod src/util/array buffer.js
  const BufferParser = {
      bufferToArray(buffer) {
          buffer = new DataView(buffer);
          const array = [];
          for (let idx = 0; idx < buffer.byteLength; idx++) {
              array.push(buffer.getUint8(idx));
          }
          return array;
      },
      arrayToBuffer(array) {
          const buffer = new ArrayBuffer(array.length);
          const view = new DataView(buffer);
          array.forEach((byte, offset) => {
              view.setUint8(offset, byte);
          });
          return view.buffer;
      }
  };

  // from PenguinMod src/util/uid.js
  const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  /**
   * Generate a unique ID, from Blockly.  This should be globally unique.
   * 87 characters ^ 20 length > 128 bits (better than a UUID).
   * @return {string} A globally unique ID string.
   */
  const uid = function () {
      const length = 20;
      const soupLength = soup_.length;
      const id = [];
      for (let i = 0; i < length; i++) {
          id[i] = soup_.charAt(Math.random() * soupLength);
      }
      return id.join('');
  };

  // from PenguinMod src/util/sandboxed-javascript-runner.js

  // probably good
  const generateQuadUid = () => uid() + uid() + uid() + uid();

  // idk i just copied this lol
  const none = "'none'";
  const featurePolicy = {
      'accelerometer': none,
      'ambient-light-sensor': none,
      'battery': none,
      'camera': none,
      'display-capture': none,
      'document-domain': none,
      'encrypted-media': none,
      'fullscreen': none,
      'geolocation': none,
      'gyroscope': none,
      'magnetometer': none,
      'microphone': none,
      'midi': none,
      'payment': none,
      'picture-in-picture': none,
      'publickey-credentials-get': none,
      'speaker-selection': none,
      'usb': none,
      'vibrate': none,
      'vr': none,
      'screen-wake-lock': none,
      'web-share': none,
      'interest-cohort': none
  };

  // idk i just copied this lol
  const generateAllow = () => Object.entries(featurePolicy)
      .map(([name, permission]) => `${name} ${permission}`)
      .join('; ');

  const createFrame = () => {
      const element = document.createElement("iframe");
      const frameId = generateQuadUid(); // this is how we differentiate iframe messages from other messages
      // hopefully pm doesnt do sonme weird stuff that makes this not work lol
      element.dataset.id = frameId;
      element.style.display = "none";
      element.setAttribute('aria-hidden', 'true');
      // allow modals so people can use alert & stuff
      element.sandbox = 'allow-scripts allow-modals';
      element.allow = generateAllow();
      document.body.append(element);
      return element;
  };


  /**
   * vscode give me autofill
   * @param {MessageEvent} event The nessage event to handle
   * @param {HTMLIFrameElement} iframe The iframe who produced the event
   * @param {Function} removeHandler The handle to remove that i
   * @returns {Promise<object>} The data provided by the message
   */
  const messageHandler = (event, iframe, removeHandler) => new Promise(resolve => {
      if (!event.data.payload) return;

      if (event.data.payload.id !== iframe.dataset.id) return;
      const data = event.data.payload;

      window.removeEventListener('message', removeHandler);
      try {
          const url = iframe.src;
          // delete object url
          URL.revokeObjectURL(url);
      } catch {
          // honestly idk how this could fail im just doing this incase
          // something stupid happens and people cant use eval anymore
          console.warn('failed to revoke url of iframe sandboxed eval');
      }
      iframe.remove();

      // send back data
      resolve(data);
  });

  /**
   * generates a string that can be placed into the iframe src
   * @param {string} code the code
   * @returns {string} the code that can be placed into the eval in the iframe src
   */
  const prepareCodeForEval = (code) => {
      const escaped = JSON.stringify(code);
      // when the html encounters a closing script tag, itll end the script
      // so just put a backslash before it and it should be fine
      const scriptEscaped = escaped.replaceAll('<\/script>', '<\\/script>');
      return scriptEscaped;
  }

  const generateEvaluateSrc = (code, frame) => {
      // this puts some funny stuff in the iframe src
      // so that it actually works
      const runnerCode = `(async () => {
      let result = null;
      let success = true;
      try {
          // techincally eval can also postMessage
          // and also modify success & result probably
          // but theres no real reason to prevent it
          // nor does the user have any reason to do it
          result = await eval(${prepareCodeForEval(code)});
      } catch (err) {
          success = false;
          result = err;
      }

      const parent = window.parent;
      const origin = '*';
      console.log(origin);

      try {
          parent.postMessage({
              payload: {
                  success: success,
                  value: result,
                  id: ${JSON.stringify(frame.dataset.id)}
              },
          }, origin);
      } catch (topLevelError) {
          // couldnt clone likely
          try {
              parent.postMessage({
                  payload: {
                      success: success,
                      value: JSON.stringify(result),
                      id: ${JSON.stringify(frame.dataset.id)}
                  },
              }, origin);
          } catch (err) {
              // ok we cant stringify it just error
              parent.postMessage({
                  payload: {
                      success: false,
                      value: [String(topLevelError), String(err)].join("; "),
                      id: ${JSON.stringify(frame.dataset.id)}
                  },
              }, origin);
          }
      }
  })();`;

      const html = [
          '<!DOCTYPE html>',
          '<html>',
          '<body>',
          '<script>',
          runnerCode,
          '</script>',
          '</body>',
          '</html>'
      ].join("\n");

      const blob = new Blob([html], { type: 'text/html;charset=UTF-8' });
      const url = URL.createObjectURL(blob);

      return url;
  };

  class SandboxRunner {
      static execute(code) {
          return new Promise(resolve => {
              const frame = createFrame();
              /**
               * please vscode show me the autofill
               * @param {MessageEvent} e -
               */
              const trueHandler = e => {
                  // this code is weird but we need to remove
                  // event handler ladter
                  messageHandler(e, frame, trueHandler).then(payload => {
                      resolve({
                          success: payload.success,
                          value: payload.value
                      });
                  });
              };
              window.addEventListener('message', trueHandler);
              frame.src = generateEvaluateSrc(code, frame);
          });
      }
  }


  // Raw DEFLATE (RFC 1951) using the browser's CompressionStream. PenguinMod bundles BeatGammit's
  // deflate-js here, but that library is GPLv2; the built-in stream produces the same raw format.
  const pipeBytes = async (bytes, stream) => {
    const output = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(stream);
    return Array.from(new Uint8Array(await new Response(output).arrayBuffer()));
  };
  const deflate = (bytes) => pipeBytes(bytes, new CompressionStream("deflate-raw"));
  const inflate = (bytes) => pipeBytes(bytes, new DecompressionStream("deflate-raw"));

  const warningIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC8SURBVDhPpZPBDYMwDEWhJw4MQzdgG0bi0APDlHuPZRv6X2xUaqJWpE8y2Pk/JkRJFVnXtVOMiqdig5yxzm1HJDZu+gWexqcZDCjuqHtcRo/gfTdRkf2yy7kGMG4i/5wlGYSXObqL9MFsRQw06C0voq9ZhxcHasH7m4cV/AUNFkuLWGgwW17EzB5wPB9Wn+aanmoysVGRJAovI5PLydAqzh7l1mWDAUV2JQE8n5P3SORo3xTxOjMWrnNVvQChGZRpEqnWPQAAAABJRU5ErkJggg==";

  class JgPrismBlocks {
      constructor() {
          /**
           * The runtime instantiating this block package.
           * @type {Runtime}
           */
          this.runtime = Scratch.vm.runtime;
          this.audioPlayer = new Audio();
          this.isJSPermissionGranted = false;
          this.isCameraScreenshotEnabled = false;

          this.mouseScrollDelta = { x: 0, y: 0, z: 0 };
          addEventListener("wheel", e => {
              this.mouseScrollDelta.x = e.deltaX;
              this.mouseScrollDelta.y = e.deltaY;
              this.mouseScrollDelta.z = e.deltaZ;
          });
          setInterval(() => {
              this.mouseScrollDelta = { x: 0, y: 0, z: 0 };
          }, 65);

          this.encodeCharacterLength = 6;
      }


      /**
       * dummy function for reseting user provided permisions when a save is loaded
       */
      deserialize() {
          this.isJSPermissionGranted = false;
          this.isCameraScreenshotEnabled = false;
      }

      /**
       * @returns {object} metadata for this extension and its blocks.
       */
      getInfo() {
          return {
              id: 'jgPrism',
              name: 'Prism',
              color1: '#BC7FFF',
              color2: '#AD66FF',
              blocks: [
                  {
                      opcode: 'playAudioFromUrl',
                      text: formatMessage({
                          id: 'jgPrism.blocks.playAudioFromUrl',
                          default: 'play audio from [URL]',
                          description: 'Plays sound from a URL.'
                      }),
                      blockType: Scratch.BlockType.COMMAND,
                      hideFromPalette: true,
                      arguments: {
                          URL: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: 'https://extensions.turbowarp.org/meow.mp3'
                          }
                      }
                  },
                  {
                      opcode: 'setAudioToLooping',
                      text: formatMessage({
                          id: 'jgPrism.blocks.setAudioToLooping',
                          default: 'set audio to loop',
                          description: 'Sets the audio to be looping.'
                      }),
                      hideFromPalette: true,
                      blockType: Scratch.BlockType.COMMAND
                  },
                  {
                      opcode: 'setAudioToNotLooping',
                      text: formatMessage({
                          id: 'jgPrism.blocks.setAudioToNotLooping',
                          default: 'set audio to not loop',
                          description: 'Sets the audio to not be looping.'
                      }),
                      hideFromPalette: true,
                      blockType: Scratch.BlockType.COMMAND
                  },
                  {
                      opcode: 'pauseAudio',
                      text: formatMessage({
                          id: 'jgPrism.blocks.pauseAudio',
                          default: 'pause audio',
                          description: 'Pauses the audio player.'
                      }),
                      hideFromPalette: true,
                      blockType: Scratch.BlockType.COMMAND
                  },
                  {
                      opcode: 'playAudio',
                      text: formatMessage({
                          id: 'jgPrism.blocks.playAudio',
                          default: 'resume audio',
                          description: 'Resumes the audio player.'
                      }),
                      hideFromPalette: true,
                      blockType: Scratch.BlockType.COMMAND
                  },
                  {
                      opcode: 'setAudioPlaybackSpeed',
                      text: formatMessage({
                          id: 'jgPrism.blocks.setAudioPlaybackSpeed',
                          default: 'set audio speed to [SPEED]%',
                          description: 'Sets the speed of the audio player.'
                      }),
                      hideFromPalette: true,
                      blockType: Scratch.BlockType.COMMAND,
                      arguments: {
                          SPEED: {
                              type: Scratch.ArgumentType.NUMBER,
                              defaultValue: 100
                          }
                      }
                  },
                  {
                      opcode: 'getAudioPlaybackSpeed',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.getAudioPlaybackSpeed',
                          default: 'audio speed',
                          description: 'Block that returns the playback speed of the audio player.'
                      }),
                      hideFromPalette: true,
                      disableMonitor: false,
                      blockType: Scratch.BlockType.REPORTER
                  },
                  {
                      opcode: 'setAudioPosition',
                      text: formatMessage({
                          id: 'jgPrism.blocks.setAudioPosition',
                          default: 'set audio position to [POSITION] seconds',
                          description: 'Sets the position of the current audio in the audio player.'
                      }),
                      blockType: Scratch.BlockType.COMMAND,
                      hideFromPalette: true,
                      arguments: {
                          POSITION: {
                              type: Scratch.ArgumentType.NUMBER,
                              defaultValue: 5
                          }
                      }
                  },
                  {
                      opcode: 'getAudioPosition',
                      text: 'audio position',
                      disableMonitor: false,
                      hideFromPalette: true,
                      blockType: Scratch.BlockType.REPORTER
                  },
                  {
                      opcode: 'setAudioVolume',
                      text: formatMessage({
                          id: 'jgPrism.blocks.setAudioVolume',
                          default: 'set audio volume to [VOLUME]%',
                          description: 'Sets the volume of the current audio in the audio player.'
                      }),
                      blockType: Scratch.BlockType.COMMAND,
                      hideFromPalette: true,
                      arguments: {
                          VOLUME: {
                              type: Scratch.ArgumentType.NUMBER,
                              defaultValue: 100
                          }
                      }
                  },
                  {
                      opcode: 'getAudioVolume',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.getAudioVolume',
                          default: 'audio volume',
                          description: 'Block that returns the volume of the audio player.'
                      }),
                      disableMonitor: false,
                      hideFromPalette: true,
                      blockType: Scratch.BlockType.REPORTER
                  },
                  {
                      blockType: Scratch.BlockType.LABEL,
                      text: "Data URIs"
                  },
                  {
                      opcode: 'screenshotStage',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.screenshotStage',
                          default: 'screenshot the stage',
                          description: 'Block that screenshots the stage and returns a Data URI of it.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true
                  },
                  {
                      opcode: 'dataUriOfCostume',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.dataUriOfCostume',
                          default: 'data url of costume #[INDEX]',
                          description: 'Block that returns a Data URI of the costume at the index.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      // these blocks will be replaced in the future
                      // hideFromPalette: true,
                      arguments: {
                          INDEX: {
                              type: Scratch.ArgumentType.NUMBER,
                              defaultValue: "1"
                          }
                      }
                  },
                  {
                      opcode: 'dataUriFromImageUrl',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.dataUriFromImageUrl',
                          default: 'data url of image at url: [URL]',
                          description: 'Block that returns a Data URI of the content fetched from the URL.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      // these blocks will be replaced in the future
                      // hideFromPalette: true,
                      arguments: {
                          URL: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "url"
                          }
                      }
                  },
                  {
                      opcode: 'dataUriFromArrayBuffer',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.dataUriFromArrayBuffer',
                          default: 'convert array buffer [BUFFER] to data url',
                          description: 'Block that returns a Data URI from an array buffer.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      arguments: {
                          BUFFER: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "[72,101,108,108,111]"
                          }
                      }
                  },
                  {
                      opcode: 'arrayBufferFromDataUri',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.arrayBufferFromDataUri',
                          default: 'convert data url [URL] to array buffer',
                          description: 'Block that returns an array buffer from a Data URL.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      arguments: {
                          URL: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "data:text/plain;base64,SGVsbG8="
                          }
                      }
                  },
                  // {
                  //     blockType: Scratch.BlockType.LABEL,
                  //     text: "More Mouse Inputs"
                  // },
                  {
                      opcode: 'currentMouseScrollX',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.currentMouseScrollX',
                          default: 'mouse scroll x',
                          description: 'im too lazy to write these anymore tbh'
                      }),
                      disableMonitor: false,
                      hideFromPalette: true,
                      blockIconURI: warningIcon,
                      blockType: Scratch.BlockType.REPORTER
                  },
                  {
                      opcode: 'currentMouseScroll',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.currentMouseScroll',
                          default: 'mouse scroll y',
                          description: 'im too lazy to write these anymore tbh'
                      }),
                      disableMonitor: false,
                      hideFromPalette: true,
                      blockIconURI: warningIcon,
                      blockType: Scratch.BlockType.REPORTER
                  },
                  {
                      opcode: 'currentMouseScrollZ',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.currentMouseScrollZ',
                          default: 'mouse scroll z',
                          description: 'im too lazy to write these anymore tbh'
                      }),
                      disableMonitor: false,
                      hideFromPalette: true,
                      blockIconURI: warningIcon,
                      blockType: Scratch.BlockType.REPORTER
                  },
                  {
                      blockType: Scratch.BlockType.LABEL,
                      text: "Base64"
                  },
                  {
                      opcode: 'base64Encode',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.base64Encode',
                          default: 'base64 encode [TEXT]',
                          description: 'Block that encodes and returns the result of it.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      arguments: {
                          TEXT: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "abc"
                          }
                      }
                  },
                  {
                      opcode: 'base64Decode',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.base64Decode',
                          default: 'base64 decode [TEXT]',
                          description: 'Block that decodes and returns the result of it.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      arguments: {
                          TEXT: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "YWJj"
                          }
                      }
                  },
                  // {
                  //     blockType: Scratch.BlockType.LABEL,
                  //     text: "String Character Codes"
                  // },
                  {
                      opcode: 'fromCharacterCodeString',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.fromCharacterCodeString',
                          default: 'character from character code [TEXT]',
                          description: 'Block that decodes and returns the result of it.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      hideFromPalette: true,
                      blockIconURI: warningIcon,
                      arguments: {
                          TEXT: {
                              type: Scratch.ArgumentType.NUMBER,
                              defaultValue: 97
                          }
                      }
                  },
                  {
                      opcode: 'toCharacterCodeString',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.toCharacterCodeString',
                          default: 'character code of [TEXT]',
                          description: 'Block that encodes and returns the result of it.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      hideFromPalette: true,
                      blockIconURI: warningIcon,
                      arguments: {
                          TEXT: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "a"
                          }
                      }
                  },
                  "---",
                  "---",
                  {
                      blockType: Scratch.BlockType.LABEL,
                      text: "JS Deflate by BeatGammit"
                  },
                  {
                      opcode: 'lib_deflate_deflateArray',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.lib_deflate_deflateArray',
                          default: 'deflate [ARRAY]',
                          description: 'abc'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      arguments: {
                          ARRAY: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "[]"
                          }
                      }
                  },
                  {
                      opcode: 'lib_deflate_inflateArray',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.lib_deflate_inflateArray',
                          default: 'inflate [ARRAY]',
                          description: 'abc'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      arguments: {
                          ARRAY: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "[]"
                          }
                      }
                  },
                  {
                      blockType: Scratch.BlockType.LABEL,
                      text: "Numerical Encoding by cs2627883"
                  },
                  {
                      opcode: 'NumericalEncode',
                      blockType: Scratch.BlockType.REPORTER,
                      text: 'encode [DATA] to number',
                      arguments: {
                          DATA: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: 'Hello!'
                          }
                      }
                  },
                  {
                      opcode: 'NumericalDecode',
                      blockType: Scratch.BlockType.REPORTER,
                      text: 'decode [ENCODED] from number',
                      arguments: {
                          ENCODED: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: '000072000101000108000108000111000033'
                          }
                      }
                  },
                  // "---",
                  // {
                  //     blockType: Scratch.BlockType.LABEL,
                  //     text: "Deprecated blocks"
                  // },
                  // "---",
                  // {
                  //     blockType: Scratch.BlockType.LABEL,
                  //     text: "Don't use any of the blocks below."
                  // },
                  // {
                  //     blockType: Scratch.BlockType.LABEL,
                  //     text: "They will be removed soon."
                  // },
                  // "---",
                  // {
                  //     blockType: Scratch.BlockType.LABEL,
                  //     text: "(Deprecated) JavaScript"
                  // },
                  {
                      opcode: 'evaluate',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.evaluate',
                          default: 'eval [JAVASCRIPT]',
                          description: 'Block that runs JavaScript code.'
                      }),
                      blockType: Scratch.BlockType.COMMAND,
                      blockIconURI: warningIcon,
                      hideFromPalette: true,
                      arguments: {
                          JAVASCRIPT: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "console.log('Hello!')"
                          }
                      }
                  },
                  {
                      opcode: 'evaluate2',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.evaluate2',
                          default: 'eval [JAVASCRIPT]',
                          description: 'Block that runs JavaScript code and returns the result of it.'
                      }),
                      blockType: Scratch.BlockType.REPORTER,
                      disableMonitor: true,
                      blockIconURI: warningIcon,
                      hideFromPalette: true,
                      arguments: {
                          JAVASCRIPT: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "Math.random()"
                          }
                      }
                  },
                  {
                      opcode: 'evaluate3',
                      text: formatMessage({
                          id: 'jgRuntime.blocks.evaluate3',
                          default: 'eval [JAVASCRIPT]',
                          description: 'Block that runs JavaScript code.'
                      }),
                      blockType: Scratch.BlockType.HAT,
                      blockIconURI: warningIcon,
                      hideFromPalette: true,
                      arguments: {
                          JAVASCRIPT: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: "Math.round(Math.random()) == 1"
                          }
                      }
                  }
              ]
          };
      }
      playAudioFromUrl(args) {
          if (!this.audioPlayer) this.audioPlayer = new Audio();
          this.audioPlayer.pause();
          this.audioPlayer.src = `${args.URL}`;
          this.audioPlayer.currentTime = 0;
          this.audioPlayer.play();
      }
      setAudioToLooping() {
          this.audioPlayer.loop = true;
      }
      setAudioToNotLooping() {
          this.audioPlayer.loop = false;
      }
      pauseAudio() {
          this.audioPlayer.pause();
      }
      playAudio() {
          this.audioPlayer.play();
      }
      setAudioPlaybackSpeed(args) {
          this.audioPlayer.playbackRate = (isNaN(Number(args.SPEED)) ? 100 : Number(args.SPEED)) / 100;
      }
      getAudioPlaybackSpeed() {
          return this.audioPlayer.playbackRate * 100;
      }
      setAudioPosition(args) {
          this.audioPlayer.currentTime = isNaN(Number(args.POSITION)) ? 0 : Number(args.POSITION);
      }
      getAudioPosition() {
          return this.audioPlayer.currentTime;
      }
      setAudioVolume(args) {
          this.audioPlayer.volume = (isNaN(Number(args.VOLUME)) ? 100 : Number(args.VOLUME)) / 100;
      }
      getAudioVolume() {
          return this.audioPlayer.volume * 100;
      }
      // eslint-disable-next-line no-unused-vars
      evaluate(args, util, realBlockInfo) {
          return new Promise((resolve, reject) => {
              SandboxRunner.execute(String(args.JAVASCRIPT)).then(result => {
                  if (!result.success) {
                      alert(result.value);
                      console.error(result.value);
                      return;
                  }
                  resolve(result.value)
              })
          })
      }
      // eslint-disable-next-line no-unused-vars
      evaluate2(args, util, realBlockInfo) {
          return new Promise((resolve, reject) => {
              SandboxRunner.execute(String(args.JAVASCRIPT)).then(result => {
                  if (!result.success) {
                      console.error(result.value);
                  }
                  resolve(result.value)
              })
          })
      }
      // eslint-disable-next-line no-unused-vars
      evaluate3(args, util, realBlockInfo) {
          return new Promise((resolve, reject) => {
              SandboxRunner.execute(String(args.JAVASCRIPT)).then(result => {
                  if (!result.success) {
                      console.error(result.value);
                  }
                  resolve(result.value === true)
              })
          })
      }
      screenshotStage() {
          // PenguinMod-only: prism_screenshot_* is set by PenguinMod's 3D extension; harmless when absent
          // should we look for an external canvas
          if (this.runtime.prism_screenshot_checkForExternalCanvas) {
              // if so, does one exist (this will check for more than 1 in the future)
              if (this.runtime.prism_screenshot_externalCanvas) {
                  // we dont need to check camera permissions since external canvases
                  // will never have the ability to get camera data
                  return this.runtime.prism_screenshot_externalCanvas.toDataURL();
              }
          }

          // renderer will handle not capturing video data
          return new Promise(resolve => {
              this.runtime.renderer.requestSnapshot(uri => {
                  resolve(uri);
              });
          });
      }
      dataUriOfCostume(args, util) {
          const index = Number(args.INDEX);
          if (isNaN(index)) return "";
          if (index < 1) return "";

          const target = util.target;
          // eslint-disable-next-line no-undefined
          if (target.sprite.costumes[index - 1] === undefined || target.sprite.costumes[index - 1] === null) return "";
          const dataURI = target.sprite.costumes[index - 1].asset.encodeDataURI();
          return String(dataURI);
      }
      dataUriFromImageUrl(args) {
          return new Promise(resolve => {
              if (window && !window.FileReader) return resolve("");
              if (window && !window.fetch) return resolve("");
              scratchFetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(String(args.URL))}`).then(r => {
                  r.blob().then(blob => {
                      const reader = new FileReader();
                      reader.onload = e => {
                          resolve(e.target.result);
                      };
                      reader.readAsDataURL(blob);
                  })
                      .catch(() => {
                          resolve("");
                      });
              })
                  .catch(() => {
                      resolve("");
                  });
          });
      }

      dataUriFromArrayBuffer(args) {
          const array = validateArray(args.BUFFER);
          if (!array.isValid) return 'data:text/plain;base64,';
          const buffer = BufferParser.arrayToBuffer(array.array);
          let binary = '';
          let bytes = new Uint8Array(buffer);
          let len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
          }
          // use "application/octet-stream", we have no idea what the buffer actually contains
          return `data:application/octet-stream;base64,${btoa(binary)}`;
      }
      arrayBufferFromDataUri(args) {
          const dataUrl = Scratch.Cast.toString(args.URL);
          return new Promise((resolve) => {
              scratchFetch(dataUrl).then(res => {
                  res.arrayBuffer().then(buffer => {
                      const array = BufferParser.bufferToArray(buffer);
                      resolve(JSON.stringify(array));
                  }).catch(() => {
                      resolve('[]');
                  });
              }).catch(() => {
                  resolve('[]');
              });
          });
      }

      currentMouseScrollX() {
          return this.mouseScrollDelta.x;
      }
      currentMouseScroll() {
          return this.mouseScrollDelta.y;
      }
      currentMouseScrollZ() {
          return this.mouseScrollDelta.z;
      }
      base64Encode(args) {
          let result = "";
          try {
              result = btoa(String(args.TEXT));
          } catch {
              // what a shame
          }
          return result;
      }
      base64Decode(args) {
          let result = "";
          try {
              result = atob(String(args.TEXT));
          } catch {
              // what a shame
          }
          return result;
      }
      fromCharacterCodeString(args) {
          return String.fromCharCode(args.TEXT);
      }
      toCharacterCodeString(args) {
          return String(args.TEXT).charCodeAt(0);
      }
      lib_deflate_deflateArray(args) {
          const array = validateArray(args.ARRAY).array;

          return deflate(array).then((result) => JSON.stringify(result), () => "[]");
      }
      lib_deflate_inflateArray(args) {
          const array = validateArray(args.ARRAY).array;

          return inflate(array).then((result) => JSON.stringify(result), () => "[]");
      }

      NumericalEncode(args) {
          const toencode = String(args.DATA);
          let encoded = "";
          for (let i = 0; i < toencode.length; ++i) {
              // Get char code of character
              let encodedchar = String(toencode.charCodeAt(i));
              // Pad encodedchar with 0s to ensure all encodedchars are the same length
              encodedchar = "0".repeat(this.encodeCharacterLength - encodedchar.length) + encodedchar;
              encoded += encodedchar;
          }
          return encoded;
      }
      NumericalDecode(args) {
          const todecode = String(args.ENCODED);
          if (todecode == "") {
              return "";
          }
          let decoded = "";
          // Create regex to split by char length
          const regex = new RegExp('.{1,' + this.encodeCharacterLength + '}', 'g');
          // Split into array of characters
          let encodedchars = todecode.match(regex);
          for (let i = 0; i < encodedchars.length; i++) {
              // Get character from char code
              let decodedchar = String.fromCharCode(encodedchars[i]);
              decoded += decodedchar;
          }
          return decoded;
      }
  }


  Scratch.extensions.register(new JgPrismBlocks());
})(Scratch);
