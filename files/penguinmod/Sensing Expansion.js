// Name: Sensing Expansion
// ID: pmSensingExpansion
// Description: Extra sensing blocks: device info, URL tools, key hold time, scrolling, delta time and more.
// By: PenguinMod team (pm)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/pm_sensingExpansion
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Sensing Expansion must run unsandboxed.");

  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const Cast = Scratch.Cast;
  const formatMessage = (m) => (typeof m === "string" ? m : m.default);

  // from scratch-vm util/color.js
  const rgbToHex = (rgb) => {
    let decimal = (rgb.r << 16) + (rgb.g << 8) + rgb.b;
    if (decimal < 0) decimal += 0xffffff + 1;
    const hex = Number(decimal).toString(16);
    return `#${"000000".substr(0, 6 - hex.length)}${hex}`;
  };

  // PenguinMod-only: orderBlocks (which mixed PenguinMod's own core sensing blocks into this category and gave
  // "seconds since holding" a key dropdown) is dropped.
  class pmSensingExpansion {
    constructor() {
      this.runtime = Scratch.vm.runtime;

      this.canVibrate = true;

      this.lastUpdate = Date.now();

      this.canGetLoudness = false;
      this.loudnessArray = [0];

      this.scrollDistance = 0;

      this.lastValues = {};

      // PenguinMod's keyboard records when each key started being held and its mouse wheel feeds
      // "scrolling distance". Track both here when the VM doesn't.
      const keyboard = this.runtime.ioDevices.keyboard;
      this.keyTimestamps = {};
      this.runtime.on("KEY_PRESSED", (scratchKey) => {
        // KEY_PRESSED fires before the key is added to _keysPressed, so a key not in the list is a new press
        if (!keyboard._keysPressed.includes(scratchKey)) this.keyTimestamps[scratchKey] = Date.now();
      });
      const mouseWheel = this.runtime.ioDevices.mouseWheel;
      if (mouseWheel && !String(mouseWheel.postData).includes("_addToScrollingDistanceBlock")) {
        const postData = mouseWheel.postData;
        const ext = this;
        mouseWheel.postData = function (data) {
          ext.scrollDistance += 0 - data.deltaY;
          return postData.call(this, data);
        };
      }
    }

    _keysPressed() {
      const keyboard = this.runtime.ioDevices.keyboard;
      if (typeof keyboard.getAllKeysPressed === "function") return keyboard.getAllKeysPressed();
      return keyboard._keysPressed;
    }
    // same as PenguinMod's keyboard.getKeyTimestamp
    _keyTimestamp(keyArg) {
      const keyboard = this.runtime.ioDevices.keyboard;
      if (typeof keyboard.getKeyTimestamp === "function") return keyboard.getKeyTimestamp(keyArg);
      for (const key in this.keyTimestamps) {
        if (!keyboard._keysPressed.includes(key)) delete this.keyTimestamps[key];
      }
      if (keyArg === "any") {
        let oldestTimestamp = Infinity;
        let found = false;
        for (const keyName in this.keyTimestamps) {
          const timestamp = this.keyTimestamps[keyName];
          if (timestamp < oldestTimestamp) {
            oldestTimestamp = timestamp;
            found = true;
          }
        }
        if (!found) return 0;
        return oldestTimestamp;
      }
      const scratchKey = keyboard._keyArgToScratchKey(keyArg);
      if (!(scratchKey in this.keyTimestamps)) return 0;
      return this.keyTimestamps[scratchKey];
    }

    getInfo() {
      return {
        id: 'pmSensingExpansion',
        name: 'Sensing Expansion',
        color1: "#5CB1D6",
        color2: "#47A8D1",
        color3: "#2E8EB8",
        isDynamic: true,
        blocks: [
          {
            opcode: 'batteryPercentage',
            text: 'battery percentage',
            blockType: BlockType.REPORTER,
            disableMonitor: true
          },
          {
            opcode: 'batteryCharging',
            text: 'is device charging?',
            blockType: BlockType.BOOLEAN,
            disableMonitor: true
          },
          {
            opcode: 'vibrateDevice',
            text: 'vibrate',
            blockType: BlockType.COMMAND
          },
          {
            opcode: 'browserLanguage',
            text: 'preferred language',
            blockType: BlockType.REPORTER,
            disableMonitor: true
          },
          {
            opcode: 'urlOptions',
            text: 'url [OPTIONS]',
            blockType: BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
              OPTIONS: {
                type: ArgumentType.STRING,
                menu: "urlSections"
              }
            }
          },
          {
            opcode: 'urlOptionsOf',
            text: '[OPTIONS] of url [URL]',
            blockType: BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
              OPTIONS: {
                type: ArgumentType.STRING,
                menu: "urlSections"
              },
              URL: {
                type: ArgumentType.STRING,
                defaultValue: "https://home.penguinmod.com:3000/some/random/page?param=10#20"
              }
            }
          },
          {
            opcode: 'setUsername',
            text: 'set username to [NAME]',
            blockType: BlockType.COMMAND,
            arguments: {
              NAME: {
                type: ArgumentType.STRING,
                defaultValue: "Penguin"
              }
            }
          },
          {
            opcode: 'setUrlEnd',
            text: 'set url path to [PATH]',
            blockType: BlockType.COMMAND,
            arguments: {
              PATH: {
                type: ArgumentType.STRING,
                defaultValue: "?parameter=10#you-can-change-these-without-refreshing"
              }
            }
          },
          {
            opcode: 'queryParamOfUrl',
            text: 'query parameter [PARAM] of url [URL]',
            blockType: BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
              PARAM: {
                type: ArgumentType.STRING,
                defaultValue: "param"
              },
              URL: {
                type: ArgumentType.STRING,
                defaultValue: "https://penguinmod.com/?param=10"
              }
            }
          },
          {
            opcode: 'packaged',
            text: 'project packaged?',
            blockType: BlockType.BOOLEAN,
            disableMonitor: true
          },
          {
            opcode: 'spriteName',
            text: 'sprite name',
            blockType: BlockType.REPORTER,
            disableMonitor: true
          },
          {
            opcode: 'framed',
            text: 'project in iframe?',
            blockType: BlockType.BOOLEAN,
            disableMonitor: true
          },
          {
            opcode: 'currentMillisecond',
            text: 'current millisecond',
            blockType: BlockType.REPORTER,
            disableMonitor: false
          },
          {
            opcode: 'deltaTime',
            text: 'delta time',
            blockType: BlockType.REPORTER,
            disableMonitor: false
          },
          {
            opcode: 'pickColor',
            text: 'grab color at x: [X] y: [Y]',
            blockType: BlockType.REPORTER,
            arguments: {
              X: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'maxSpriteLayers',
            text: 'max sprite layers',
            blockType: BlockType.REPORTER
          },
          {
            opcode: 'averageLoudness',
            text: 'average loudness',
            blockType: BlockType.REPORTER
          },
          {
            opcode: 'scrollingDistance',
            text: 'scrolling distance',
            blockType: BlockType.REPORTER
          },
          {
            opcode: 'setScrollingDistance',
            text: 'set scrolling distance to [AMOUNT]',
            blockType: BlockType.COMMAND,
            arguments: {
              AMOUNT: {
                type: ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'changeScrollingDistanceBy',
            text: 'change scrolling distance by [AMOUNT]',
            blockType: BlockType.COMMAND,
            arguments: {
              AMOUNT: {
                type: ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          {
            opcode: 'currentKeyPressed',
            text: 'current key pressed',
            blockType: BlockType.REPORTER
          },
          {
            opcode: 'amountOfTimeKeyHasBeenHeld',
            text: 'seconds since holding [KEY]',
            blockType: BlockType.REPORTER,
            arguments: {
              KEY: {
                // this is replaced later
                type: ArgumentType.STRING,
                defaultValue: 'a'
              }
            }
          },
          {
            opcode: 'getLastKeyPressed',
            text: formatMessage({
              id: 'tw.blocks.lastKeyPressed',
              default: 'last key pressed',
              description: 'Block that returns the last key that was pressed'
            }),
            blockType: BlockType.REPORTER
          },
          {
            opcode: 'getButtonIsDown',
            text: formatMessage({
              id: 'tw.blocks.buttonIsDown',
              default: '[MOUSE_BUTTON] mouse button down?',
              description: 'Block that returns whether a specific mouse button is down'
            }),
            blockType: BlockType.BOOLEAN,
            arguments: {
              MOUSE_BUTTON: {
                type: ArgumentType.NUMBER,
                menu: 'mouseButton',
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'changed',
            blockType: BlockType.BOOLEAN,
            text: '[ONE] changed?',
            arguments: {
              ONE: {
               type: null,
              },
            },
          }
        ],
        menus: {
          mouseButton: {
            items: [
              {
                text: formatMessage({
                  id: 'tw.blocks.mouseButton.primary',
                  default: '(0) primary',
                  description: 'Dropdown item to select primary (usually left) mouse button'
                }),
                value: '0'
              },
              {
                text: formatMessage({
                  id: 'tw.blocks.mouseButton.middle',
                  default: '(1) middle',
                  description: 'Dropdown item to select middle mouse button'
                }),
                value: '1'
              },
              {
                text: formatMessage({
                  id: 'tw.blocks.mouseButton.secondary',
                  default: '(2) secondary',
                  description: 'Dropdown item to select secondary (usually right) mouse button'
                }),
                value: '2'
              }
            ],
            acceptReporters: true
          },
          urlSections: {
            acceptReporters: true,
            items: [
              "protocol",
              "host",
              "hostname",
              "port",
              "pathname",
              "search",
              "hash",
              "origin",
              "subdomain",
              "path"
            ].map(item => ({ text: item, value: item }))
          }
        }
      };
    }

    getLastKeyPressed (_, util) {
      return util.ioQuery('keyboard', 'getLastKeyPressed');
    }

    getButtonIsDown (args, util) {
      const button = Cast.toNumber(args.MOUSE_BUTTON);
      return util.ioQuery('mouse', 'getButtonIsDown', [button]);
    }

    changed(args, util) {
     const id = util.thread.peekStack()
     if (!this.lastValues[id])
      this.lastValues[id] = Cast.toString(args.ONE);
     if (Cast.toString(args.ONE) !== this.lastValues[id]) {
      this.lastValues[id] = Cast.toString(args.ONE);
      return true;
     }
     return false;
    }

    pickColor(args) {
      const renderer = this.runtime.renderer;
      const scratchX = Cast.toNumber(args.X);
      const scratchY = Cast.toNumber(args.Y);
      const clientX = Math.round((((this.runtime.stageWidth / 2) + scratchX) / this.runtime.stageWidth) * renderer._gl.canvas.clientWidth);
      const clientY = Math.round((((this.runtime.stageHeight / 2) - scratchY) / this.runtime.stageHeight) * renderer._gl.canvas.clientHeight);
      const colorInfo = renderer.extractColor(clientX, clientY, 20);
      return rgbToHex(colorInfo.color);
    }

    // util
    urlOptionFromObject(option, urlObject) {
      const validOptions = [
        "protocol",
        "host",
        "hostname",
        "port",
        "pathname",
        "search",
        "hash",
        "origin",
        "subdomain",
        "path"
      ];
      if (!validOptions.includes(option)) return '';

      switch (option) {
        case 'subdomain': {
          const origin = urlObject.origin;
          if (origin.split('.').length <= 2) return '';
          const splitSubdomain = origin.split('.')[0];
          const subdomain = splitSubdomain.split('//')[1];
          if (!subdomain) return '';
          return subdomain.replace(/\./gmi, '');
        }
        case 'path': {
          const origin = urlObject.origin;
          if (origin.endsWith('/')) {
            return urlObject.href.replace(origin, '');
          }
          return urlObject.href.replace(origin + '/', '');
        }
      }

      return Cast.toString(urlObject[option]);
    }
    validateUrl(url) {
      let valid = true;
      try {
        new URL(url);
      } catch {
        valid = false;
      }
      return valid;
    }

    // blocks
    batteryPercentage() {
      if ('getBattery' in navigator) {
        return new Promise((resolve) => {
          navigator.getBattery().then(batteryManager => {
            resolve(batteryManager.level * 100);
          }).catch(() => {
            resolve(100); // was `return 100`, which left the block waiting forever
          });
        });
      } else {
        return 100;
      }
    }
    batteryCharging() {
      if ('getBattery' in navigator) {
        return new Promise((resolve) => {
          navigator.getBattery().then(batteryManager => {
            resolve(batteryManager.charging);
          }).catch(() => {
            resolve(true); // was `return true`, which left the block waiting forever
          });
        });
      } else {
        return true;
      }
    }

    maxSpriteLayers() {
      return this.runtime.renderer._drawList.length - 1;
    }
    averageLoudness() {
      if (!this.canGetLoudness) {
        // set interval here because why create an interval
        // on extension register if we never use the block
        console.log('created average loudness loop');
        setInterval(() => {
          if (!this.canGetLoudness) return;
          const loudness = this.runtime.audioEngine.getLoudness();
          if (typeof loudness !== 'number') return;
          if (this.loudnessArray.length > 20) {
            this.loudnessArray.shift();
          }
          if (loudness < 0) {
            this.loudnessArray.push(0);
            return;
          }
          this.loudnessArray.push(loudness);
        }, 50);
      }
      // get average
      this.canGetLoudness = true;
      let addedTogether = 0;
      let max = this.loudnessArray.length;
      for (const loudness of this.loudnessArray) {
        addedTogether += loudness;
      }
      return addedTogether / max;
    }

    scrollingDistance() {
      return this.scrollDistance;
    }
    setScrollingDistance(args) {
      const amount = Cast.toNumber(args.AMOUNT);
      this.scrollDistance = amount;
    }
    changeScrollingDistanceBy(args) {
      const amount = Cast.toNumber(args.AMOUNT);
      this.scrollDistance += amount;
    }

    currentKeyPressed(_, util) {
      const keys = this._keysPressed();
      const key = keys[keys.length - 1];
      if (!key) return '';
      return Cast.toString(key).toLowerCase();
    }
    amountOfTimeKeyHasBeenHeld(args, util) {
      const key = Cast.toString(args.KEY);
      const keyTimestamp = this._keyTimestamp(key);
      if (keyTimestamp === 0) return 0;
      const currentTime = Date.now();
      const timestamp = currentTime - keyTimestamp;
      return timestamp / 1000;
    }

    vibrateDevice() {
      // avoid vibration spam
      // only vibrate every 1s
      if (!this.canVibrate) return;

      if ('vibrate' in navigator) {
        this.canVibrate = false;
        navigator.vibrate(250);
        setTimeout(() => {
          this.canVibrate = true;
        }, 1000);
      }
    }

    browserLanguage() {
      if (!('language' in navigator)) return 'Unknown';
      const lang = Cast.toString(navigator.language);
      const check = lang.split("-")[0].toLowerCase();

      switch (check) {
        case 'en':
          return 'English';
        case 'es':
          return 'Spanish';
        case 'fr':
          return 'French';
        case 'it':
          return 'Italian';
        case 'pt':
          return 'Portuguese';
        case 'de':
          return 'German';
        case 'ru':
          return 'Russian';
        case 'ar':
          return 'Arabic';
        case 'zh':
          return 'Chinese (Mandarin)';
        case 'he':
          return 'Hebrew';
        case 'ja':
          return 'Japanese';
        case 'ko':
          return 'Korean';
        case 'sw':
          return 'Swahili';
        case 'sq':
          return 'Albanian';
        case 'hy':
          return 'Armenian';
        case 'eu':
          return 'Basque';
        case 'nl':
          return 'Dutch';
        case 'ka':
          return 'Georgian';
        case 'gd':
          return 'Scottish Gaelic';
        case 'ga':
          return 'Modern Irish';
        case 'fa':
          return 'Persian (Farsi)';
        case 'bo':
          return 'Tibetan';
        case 'cy':
          return 'Welsh';
        case 'el':
          return 'Modern Greek';
        case 'grc':
          return 'Ancient Greek';
        case 'la':
          return 'Latin';
        case 'ang':
          return 'Anglo-Saxon';
        case 'enm':
          return 'Middle English';
        default:
          return 'Unknown';
      }
    }

    urlOptions(args) {
      if (!('location' in window)) return ''; // idk how this would fail but funny
      const option = Cast.toString(args.OPTIONS).toLowerCase();
      return this.urlOptionFromObject(option, location);
    }
    urlOptionsOf(args) {
      if (!('location' in window)) return ''; // idk how this would fail but funny
      const option = Cast.toString(args.OPTIONS).toLowerCase();
      const url = Cast.toString(args.URL);
      if (!this.validateUrl(url)) return '';
      return this.urlOptionFromObject(option, new URL(url));
    }

    setUsername(args) {
      const username = Cast.toString(args.NAME);
      Scratch.vm.postIOData('userData', {
        username: username,
        loggedIn: false,
      });
    }

    setUrlEnd(args) {
      if (!('history' in window)) return;
      const path = Cast.toString(args.PATH);
      const target = location.origin.endsWith('/') ? location.origin + path : location.origin + '/' + path;
      history.replaceState('', '', target);
    }
    queryParamOfUrl(args) {
      if (!('URLSearchParams' in window)) return '';
      const url = Cast.toString(args.URL);
      if (!this.validateUrl(url)) return '';
      const urlObject = new URL(url);
      const queryParams = new URLSearchParams(urlObject.search);
      return queryParams.get(Cast.toString(args.PARAM));
    }

    packaged() {
      // PenguinMod: isPackagedProject, TurboWarp/MistWarp: isPackaged
      return Boolean(this.runtime.isPackagedProject || this.runtime.isPackaged);
    }

    spriteName(_, util) {
      return util.target.getName();
    }

    framed() {
      if (!window.parent) return false;
      return window.parent !== window;
    }

    currentMillisecond() {
      return Date.now() % 1000;
    }

    deltaTime() {
      let now = Date.now();
      let dt = now - this.lastUpdate;
      this.lastUpdate = now;
      return dt;
    }
  }

  Scratch.extensions.register(new pmSensingExpansion());
})(Scratch);
