// Name: Camera
// ID: pmCamera
// Description: Move, rotate and zoom the camera.
// By: PenguinMod team
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/pm_camera
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
/* eslint-disable space-infix-ops */
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Camera must run unsandboxed.");
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;

  // from PenguinMod's util/math-util.js
  const MathUtil = {
    degToRad: (deg) => deg * Math.PI / 180,
    radToDeg: (rad) => rad * 180 / Math.PI,
    wrapClamp(n, min, max) {
      const range = (max - min) + 1;
      return n - (Math.floor((n - min) / range) * range);
    }
  };

  // PenguinMod's editor path (static/blocks-media/) doesn't exist in TurboWarp/MistWarp, so the icons are inlined.
  const rotateRightIcon = "data:image/svg+xml;base64,PHN2ZyBpZD0icm90YXRlLWNvdW50ZXItY2xvY2t3aXNlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMzZDc5Y2M7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5yb3RhdGUtY291bnRlci1jbG9ja3dpc2U8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIyLjY4LDEyLjJhMS42LDEuNiwwLDAsMS0xLjI3LjYzSDEzLjcyYTEuNTksMS41OSwwLDAsMS0xLjE2LTIuNThsMS4xMi0xLjQxYTQuODIsNC44MiwwLDAsMC0zLjE0LS43Nyw0LjMxLDQuMzEsMCwwLDAtMiwuOCw0LjI1LDQuMjUsMCwwLDAtMS4zNCwxLjczLDUuMDYsNS4wNiwwLDAsMCwuNTQsNC42MkE1LjU4LDUuNTgsMCwwLDAsMTIsMTcuNzRoMGEyLjI2LDIuMjYsMCwwLDEtLjE2LDQuNTJBMTAuMjUsMTAuMjUsMCwwLDEsMy43NCwxOCwxMC4xNCwxMC4xNCwwLDAsMSwyLjI1LDguNzgsOS43LDkuNywwLDAsMSw1LjA4LDQuNjQsOS45Miw5LjkyLDAsMCwxLDkuNjYsMi41YTEwLjY2LDEwLjY2LDAsMCwxLDcuNzIsMS42OGwxLjA4LTEuMzVhMS41NywxLjU3LDAsMCwxLDEuMjQtLjYsMS42LDEuNiwwLDAsMSwxLjU0LDEuMjFsMS43LDcuMzdBMS41NywxLjU3LDAsMCwxLDIyLjY4LDEyLjJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjEuMzgsMTEuODNIMTMuNzdhLjU5LjU5LDAsMCwxLS40My0xbDEuNzUtMi4xOWE1LjksNS45LDAsMCwwLTQuNy0xLjU4LDUuMDcsNS4wNywwLDAsMC00LjExLDMuMTdBNiw2LDAsMCwwLDcsMTUuNzdhNi41MSw2LjUxLDAsMCwwLDUsMi45MiwxLjMxLDEuMzEsMCwwLDEtLjA4LDIuNjIsOS4zLDkuMywwLDAsMS03LjM1LTMuODJBOS4xNiw5LjE2LDAsMCwxLDMuMTcsOS4xMiw4LjUxLDguNTEsMCwwLDEsNS43MSw1LjQsOC43Niw4Ljc2LDAsMCwxLDkuODIsMy40OGE5LjcxLDkuNzEsMCwwLDEsNy43NSwyLjA3bDEuNjctMi4xYS41OS41OSwwLDAsMSwxLC4yMUwyMiwxMS4wOEEuNTkuNTksMCwwLDEsMjEuMzgsMTEuODNaIi8+PC9zdmc+";
  const rotateLeftIcon = "data:image/svg+xml;base64,PHN2ZyBpZD0icm90YXRlLWNsb2Nrd2lzZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojM2Q3OWNjO30uY2xzLTJ7ZmlsbDojZmZmO308L3N0eWxlPjwvZGVmcz48dGl0bGU+cm90YXRlLWNsb2Nrd2lzZTwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjAuMzQsMTguMjFhMTAuMjQsMTAuMjQsMCwwLDEtOC4xLDQuMjIsMi4yNiwyLjI2LDAsMCwxLS4xNi00LjUyaDBhNS41OCw1LjU4LDAsMCwwLDQuMjUtMi41Myw1LjA2LDUuMDYsMCwwLDAsLjU0LTQuNjJBNC4yNSw0LjI1LDAsMCwwLDE1LjU1LDlhNC4zMSw0LjMxLDAsMCwwLTItLjhBNC44Miw0LjgyLDAsMCwwLDEwLjQsOWwxLjEyLDEuNDFBMS41OSwxLjU5LDAsMCwxLDEwLjM2LDEzSDIuNjdhMS41NiwxLjU2LDAsMCwxLTEuMjYtLjYzQTEuNTQsMS41NCwwLDAsMSwxLjEzLDExTDIuODUsMy41N0ExLjU5LDEuNTksMCwwLDEsNC4zOCwyLjQsMS41NywxLjU3LDAsMCwxLDUuNjIsM0w2LjcsNC4zNWExMC42NiwxMC42NiwwLDAsMSw3LjcyLTEuNjhBOS44OCw5Ljg4LDAsMCwxLDE5LDQuODEsOS42MSw5LjYxLDAsMCwxLDIxLjgzLDksMTAuMDgsMTAuMDgsMCwwLDEsMjAuMzQsMTguMjFaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTkuNTYsMTcuNjVhOS4yOSw5LjI5LDAsMCwxLTcuMzUsMy44MywxLjMxLDEuMzEsMCwwLDEtLjA4LTIuNjIsNi41Myw2LjUzLDAsMCwwLDUtMi45Miw2LjA1LDYuMDUsMCwwLDAsLjY3LTUuNTEsNS4zMiw1LjMyLDAsMCwwLTEuNjQtMi4xNiw1LjIxLDUuMjEsMCwwLDAtMi40OC0xQTUuODYsNS44NiwwLDAsMCw5LDguODRMMTAuNzQsMTFhLjU5LjU5LDAsMCwxLS40MywxSDIuN2EuNi42LDAsMCwxLS42LS43NUwzLjgxLDMuODNhLjU5LjU5LDAsMCwxLDEtLjIxbDEuNjcsMi4xYTkuNzEsOS43MSwwLDAsMSw3Ljc1LTIuMDcsOC44NCw4Ljg0LDAsMCwxLDQuMTIsMS45Miw4LjY4LDguNjgsMCwwLDEsMi41NCwzLjcyQTkuMTQsOS4xNCwwLDAsMSwxOS41NiwxNy42NVoiLz48L3N2Zz4=";
  const stateKey = 'CAMERA_INFO';
  const defaultState = 'default';

  const vm = Scratch.vm;
  const mouse = vm.runtime.ioDevices.mouse;
  // PenguinMod's runtime has a built-in camera system (camera states, sprites/pen/mouse bound to cameras).
  // Use it when present, otherwise emulate it below.
  const camera = typeof vm.runtime.getCamera === 'function' ? {
    getCamera: (screen) => vm.runtime.getCamera(screen),
    updateCamera: (screen, state) => vm.runtime.updateCamera(screen, state),
    emitCameraChanged: (screen) => vm.runtime.emitCameraChanged(screen),
    bind: (target, screen) => target.bindToCamera(screen),
    unbind: (target) => target.removeCameraBinding(),
    bindMouse: (screen) => mouse.bindToCamera(screen),
    unbindMouse: () => mouse.removeCameraBinding()
  } : (() => {
    // PenguinMod-only: per-target camera binding needs PenguinMod's renderer changes. Here the "default" camera is
    // applied to the whole stage through the renderer's projection matrix (pen and backdrop move with it too), other
    // cameras only keep their state, and bind/unbind for sprites/stage only records which camera they would use.
    // Clicking sprites / "touching mouse-pointer" use unmoved screen coordinates while the camera is moved.
    const cameraStates = {
      default: { pos: [0, 0], dir: 0, scale: 1 }
    };
    let mouseBound = null;
    const getCamera = (screen) => {
      if (typeof cameraStates[screen] !== 'object') {
        cameraStates[screen] = { pos: [0, 0], dir: 0, scale: 1 };
      }
      return cameraStates[screen];
    };
    const applyDefault = () => {
      const renderer = vm.renderer;
      if (!renderer) return;
      const { pos, dir, scale } = getCamera(defaultState);
      const rad = MathUtil.degToRad(dir);
      const c = Math.cos(rad) * scale;
      const s = Math.sin(rad) * scale;
      const w = vm.runtime.stageWidth / 2;
      const h = vm.runtime.stageHeight / 2;
      // screen = scale * rotate(dir) * (world - pos), same as PenguinMod's translateForCamera
      renderer._projection = [
        c / w, s / h, 0, 0,
        -s / w, c / h, 0, 0,
        0, 0, -1, 0,
        (-c * pos[0] + s * pos[1]) / w, (-s * pos[0] - c * pos[1]) / h, 0, 1
      ];
      renderer.dirty = true;
    };
    const emitCameraChanged = (screen) => {
      if (screen === defaultState) applyDefault();
      vm.runtime.emit('CAMERA_CHANGED', screen);
      vm.runtime.requestRedraw();
    };
    // the renderer rebuilds its projection when the stage size changes
    vm.runtime.on('STAGE_SIZE_CHANGED', () => applyDefault());
    // same as PenguinMod's translateScreenPos, for a mouse bound to a camera
    const round = (n) => (vm.runtime.runtimeOptions.miscLimits ? Math.round(n) : Math.round(n * 1000) / 1000);
    const screenToCamera = () => {
      const { pos, scale, dir } = getCamera(mouseBound);
      const invScale = 1 / scale;
      const rad = MathUtil.degToRad(-dir);
      const sin = Math.sin(rad);
      const cos = Math.cos(rad);
      const x = mouse._scratchX;
      const y = mouse._scratchY;
      return [
        pos[0] + invScale * (x * cos - y * sin),
        pos[1] + invScale * (x * sin + y * cos)
      ];
    };
    const oldGetX = mouse.getScratchX;
    const oldGetY = mouse.getScratchY;
    mouse.getScratchX = function (...args) {
      return mouseBound ? round(screenToCamera()[0]) : oldGetX.apply(this, args);
    };
    mouse.getScratchY = function (...args) {
      return mouseBound ? round(screenToCamera()[1]) : oldGetY.apply(this, args);
    };
    return {
      getCamera,
      updateCamera(screen, state, silent) {
        if (state.dir) state.dir = MathUtil.wrapClamp(state.dir, -179, 180);
        state = Object.assign(getCamera(screen), state);
        if (!(silent ?? state.silent)) emitCameraChanged(screen);
      },
      emitCameraChanged,
      bind: (target, screen) => { target.cameraBound = screen; },
      unbind: (target) => { target.cameraBound = null; },
      bindMouse: (screen) => { mouseBound = screen; },
      unbindMouse: () => { mouseBound = null; }
    };
  })();

  class PenguinModCamera {
      constructor() {
          const runtime = Scratch.vm.runtime;
          this.runtime = runtime;

          runtime.setRuntimeOptions({
              fencing: false
          });
          camera.bindMouse(0);
      }
      getCamera(target) {
          return camera.getCamera(this.getActiveCamera(target));
      }
      updateCamera(target, state) {
          camera.updateCamera(this.getActiveCamera(target), state);
      }
      getActiveCamera(target) {
          let cameraState = target._customState[stateKey];
          if (!cameraState) {
              cameraState = target.cameraBound || defaultState;
              target.setCustomState(stateKey, cameraState);
          }
          return cameraState;
      }
      setActiveCamera(target, screen) {
          target.setCustomState(stateKey, screen);
      }
      getInfo() {
          return {
              id: 'pmCamera',
              name: 'Camera',
              color1: '#0586FF',
              blocks: [
                  {
                      opcode: 'moveSteps',
                      blockType: BlockType.COMMAND,
                      text: 'move camera [STEPS] steps',
                      arguments: {
                          STEPS: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '10'
                          }
                      }
                  },
                  {
                      opcode: 'turnRight',
                      blockType: BlockType.COMMAND,
                      text: 'turn camera [DIRECTION] [DEGREES] degrees',
                      arguments: {
                          DIRECTION: {
                              type: ArgumentType.IMAGE,
                              dataURI: rotateRightIcon
                          },
                          DEGREES: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '15'
                          }
                      }
                  },
                  {
                      opcode: 'turnLeft',
                      blockType: BlockType.COMMAND,
                      text: 'turn camera [DIRECTION] [DEGREES] degrees',
                      arguments: {
                          DIRECTION: {
                              type: ArgumentType.IMAGE,
                              dataURI: rotateLeftIcon
                          },
                          DEGREES: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '15'
                          }
                      }
                  },
                  {
                      opcode: 'bindTarget',
                      blockType: BlockType.COMMAND,
                      text: 'bind [TARGET] to camera [SCREEN]',
                      arguments: {
                          TARGET: {
                              type: ArgumentType.STRING,
                              menu: 'BINDABLE_TARGETS'
                          },
                          SCREEN: {
                              type: ArgumentType.STRING,
                              defaultValue: defaultState
                          }
                      }
                  },
                  {
                      opcode: 'unbindTarget',
                      blockType: BlockType.COMMAND,
                      text: 'unbind [TARGET] from the camera',
                      arguments: {
                          TARGET: {
                              type: ArgumentType.STRING,
                              menu: 'BINDABLE_TARGETS'
                          }
                      }
                  },
                  {
                      opcode: 'setCurrentCamera',
                      blockType: BlockType.COMMAND,
                      text: 'set current camera to [SCREEN]',
                      arguments: {
                          SCREEN: {
                              type: ArgumentType.STRING,
                              defaultValue: defaultState
                          }
                      }
                  },
                  {
                      opcode: 'setRenderImediat',
                      blockType: BlockType.COMMAND,
                      text: 'set render mode to [RENDER_MODE]',
                      arguments: {
                          RENDER_MODE: {
                              type: ArgumentType.STRING,
                              menu: 'RENDER_MODES'
                          }
                      }
                  },
                  {
                      opcode: 'manualRender',
                      blockType: BlockType.COMMAND,
                      text: 'render camera'
                  },
                  '---',
                  {
                      opcode: 'gotoXY',
                      blockType: BlockType.COMMAND,
                      text: 'set camera x: [X] y: [Y]',
                      arguments: {
                          X: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '0'
                          },
                          Y: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '0'
                          }
                      }
                  },
                  {
                      opcode: 'setSize',
                      blockType: BlockType.COMMAND,
                      text: 'set camera zoom to [ZOOM]%',
                      arguments: {
                          ZOOM: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '100'
                          }
                      }
                  },
                  {
                      opcode: 'changeSize',
                      blockType: BlockType.COMMAND,
                      text: 'change camera zoom by [ZOOM]%',
                      arguments: {
                          ZOOM: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '10'
                          }
                      }
                  },
                  '---',
                  {
                      opcode: 'pointTowards',
                      blockType: BlockType.COMMAND,
                      text: 'point camera in direction [DIRECTION]',
                      arguments: {
                          DIRECTION: {
                              type: ArgumentType.ANGLE,
                              defaultValue: '90'
                          }
                      }
                  },
                  {
                      opcode: 'pointTowardsPoint',
                      blockType: BlockType.COMMAND,
                      text: 'point camera towards x: [X] y: [Y]',
                      arguments: {
                          X: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '0'
                          },
                          Y: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '0'
                          }
                      }
                  },
                  '---',
                  {
                      opcode: 'changeXpos',
                      blockType: BlockType.COMMAND,
                      text: 'change camera x by [X]',
                      arguments: {
                          X: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '10'
                          }
                      }
                  },
                  {
                      opcode: 'setXpos',
                      blockType: BlockType.COMMAND,
                      text: 'set camera x to [X]',
                      arguments: {
                          X: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '0'
                          }
                      }
                  },
                  {
                      opcode: 'changeYpos',
                      blockType: BlockType.COMMAND,
                      text: 'change camera y by [Y]',
                      arguments: {
                          Y: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '10'
                          }
                      }
                  },
                  {
                      opcode: 'setYpos',
                      blockType: BlockType.COMMAND,
                      text: 'set camera y to [Y]',
                      arguments: {
                          Y: {
                              type: ArgumentType.NUMBER,
                              defaultValue: '0'
                          }
                      }
                  },
                  '---',
                  {
                      opcode: 'xPosition',
                      blockType: BlockType.REPORTER,
                      text: 'camera x'
                  },
                  {
                      opcode: 'yPosition',
                      blockType: BlockType.REPORTER,
                      text: 'camera y'
                  },
                  {
                      opcode: 'direction',
                      blockType: BlockType.REPORTER,
                      text: 'camera direction'
                  },
                  {
                      // theres also a property named "size" so this one is special
                      opcode: 'getSize',
                      blockType: BlockType.REPORTER,
                      text: 'camera zoom'
                  },
                  {
                      opcode: 'getCurrentCamera',
                      blockType: BlockType.REPORTER,
                      text: 'current camera'
                  }
              ],
              menus: {
                  BINDABLE_TARGETS: {
                      items: 'getBindableTargets',
                      acceptReports: true
                  },
                  RENDER_MODES: {
                      items: [
                          'immediate',
                          'manual'
                      ]
                  }
              }
          };
      }
      getBindableTargets() {
          const targets = this.runtime.targets
              .filter(target => !target.isStage && target.isOriginal && target.id !== Scratch.vm.editingTarget)
              .map(target => target.getName());
          return [].concat([
              { text: 'this sprite', value: '__MYSELF__' },
              { text: 'mouse-pointer', value: '__MOUSEPOINTER__' },
              { text: 'backdrop', value: '__STAGE__' },
              { text: 'all sprites', value: '__ALL__' }
          ], targets);
      }
      moveSteps({ STEPS }, util) {
          const { pos: [x, y], dir } = this.getCamera(util.target);
          const radians = MathUtil.degToRad(dir);
          const dx = STEPS * Math.cos(radians);
          const dy = STEPS * Math.sin(radians);
          this.updateCamera(util.target, { pos: [x + dx, y + dy] });
      }
      turnRight({ DEGREES }, util) {
          const { dir } = this.getCamera(util.target);
          this.updateCamera(util.target, { dir: dir - DEGREES });
      }
      turnLeft({ DEGREES }, util) {
          const { dir } = this.getCamera(util.target);
          this.updateCamera(util.target, { dir: dir + DEGREES });
      }
      bindTarget({ TARGET, SCREEN }, util) {
          if (!SCREEN) throw new Error('target screen MUST not be blank');
          switch (TARGET) {
          case '__MYSELF__':
              const myself = util.target;
              camera.bind(myself, SCREEN);
              this.setActiveCamera(myself, SCREEN);
              break;
          case '__MOUSEPOINTER__':
              camera.bindMouse(SCREEN);
              break;
          /*
          case '__PEN__':
              const pen = this.runtime.ext_pen;
              if (!pen) break;
              pen.bindToCamera(SCREEN);
              break;
              */
          case '__STAGE__':
              const stage = this.runtime.getTargetForStage();
              camera.bind(stage, SCREEN);
              break;
          case '__ALL__':
              for (const target of this.runtime.targets) {
                  camera.bind(target, SCREEN);
              }
              break;
          default:
              const sprite = this.runtime.getSpriteTargetByName(TARGET);
              if (!sprite) throw `unkown target ${TARGET}`;
              camera.bind(sprite, SCREEN);
              break;
          }
      }
      unbindTarget({ TARGET }, util) {
          switch (TARGET) {
          case '__MYSELF__': {
              const myself = util.target;
              camera.unbind(myself);
              break;
          }
          case '__MOUSEPOINTER__':
              camera.unbindMouse();
              break;
          /*
          case '__PEN__': {
              const pen = this.runtime.ext_pen;
              if (!pen) break;
              pen.removeCameraBinding();
              break;
          }
          */
          case '__STAGE__': {
              const stage = this.runtime.getTargetForStage();
              camera.unbind(stage);
              break;
          }
          case '__ALL__':
              for (const target of this.runtime.targets) {
                  camera.unbind(target);
              }
              break;
          default: {
              const sprite = this.runtime.getSpriteTargetByName(TARGET);
              if (!sprite) throw `unkown target ${TARGET}`;
              camera.unbind(sprite);
              break;
          }
          }
      }
      setCurrentCamera({ SCREEN }, util) {
          if (!SCREEN) throw new Error('target screen MUST not be blank');
          this.setActiveCamera(util.target, SCREEN);
      }
      setRenderImediat({ RENDER_MODE }, util) {
          // possibly add more render modes?
          switch (RENDER_MODE) {
          case 'immediate':
              this.updateCamera(util.target, { silent: false });
              break;
          case 'manual':
              this.updateCamera(util.target, { silent: true });
              break;
          }
      }
      manualRender(_, util) {
          camera.emitCameraChanged(this.getActiveCamera(util.target));
      }

      gotoXY({ X, Y }, util) {
          this.updateCamera(util.target, { pos: [X, Y] });
      }
      setSize({ ZOOM }, util) {
          this.updateCamera(util.target, { scale: ZOOM / 100 });
      }
      changeSize({ ZOOM }, util) {
          const { scale } = this.getCamera(util.target);
          this.updateCamera(util.target, { scale: (ZOOM / 100) + scale });
      }

      pointTowards({ DIRECTION }, util) {
          this.updateCamera(util.target, { dir: DIRECTION -90 });
      }
      pointTowardsPoint({ X, Y }, util) {
          const { pos: [x, y] } = this.getCamera(util.target);
          this.updateCamera(util.target, { dir: MathUtil.radToDeg(Math.atan2(X-x, Y-y)) });
      }

      changeXpos({ X }, util) {
          const { pos: [x, y] } = this.getCamera(util.target);
          this.updateCamera(util.target, { pos: [X+x, y] });
      }
      setXpos({ X }, util) {
          const { pos: [_, y] } = this.getCamera(util.target);
          this.updateCamera(util.target, { pos: [X, y] });
      }
      changeYpos({ Y }, util) {
          const { pos: [x, y] } = this.getCamera(util.target);
          this.updateCamera(util.target, { pos: [x, Y+y] });
      }
      setYpos({ Y }, util) {
          const { pos: [x, _] } = this.getCamera(util.target);
          this.updateCamera(util.target, { pos: [x, Y] });
      }

      xPosition(_, util) {
          const state = this.getCamera(util.target);
          return state.pos[0];
      }
      yPosition(_, util) {
          const state = this.getCamera(util.target);
          return state.pos[1];
      }
      direction(_, util) {
          const state = this.getCamera(util.target);
          return state.dir +90;
      }
      getSize(_, util) {
          const state = this.getCamera(util.target);
          return state.scale * 100;
      }
      getCurrentCamera(_, util) {
          return this.getActiveCamera(util.target);
      }
  }

  Scratch.extensions.register(new PenguinModCamera());
})(Scratch);
