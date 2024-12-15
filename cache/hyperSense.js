// This extension by Sharkpool has been minified and modified by "Mistium" to remove code that goes unused within originOS
// DO NOT USE THIS
// Go here: https://sharkpool-sp.github.io/SharkPools-Extensions/

(function(Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed)
      throw new Error("Hyper Sense must run unsandboxed");
  let currentlyPressedKey = null
    , keyPressTime = 0;
  const keyHitPass = {}
    , renderer = Scratch.renderer
    , vm = Scratch.vm
    , runtime = vm.runtime;
  var timer = 0;
  let publicVars = {};
  class HyperSenseSP {
      constructor() {
          runtime.shouldExecuteStopClicked = !0,
          runtime.on("BEFORE_EXECUTE", ( () => {
              timer++,
              runtime.shouldExecuteStopClicked = !1,
              runtime.startHats("HyperSenseSP_whenKeyPressed")
          }
          )),
          runtime.on("PROJECT_START", ( () => {
              timer = 0
          }
          )),
          runtime.on("PROJECT_STOP_ALL", ( () => {
              timer = 0
          }
          )),
          runtime.on("AFTER_EXECUTE", ( () => {
              runtime.shouldExecuteStopClicked = !0
          }
          )),
          runtime.on("ANSWER", ( () => {
              this.wait = [!1, "sprite"]
          }
          ));
          const e = vm.greenFlag;
          vm.greenFlag = function() {
              runtime.shouldExecuteStopClicked = !1,
              e.call(this)
          }
          ,
          this.scrollDistance = 0,
          this.oldScroll = [0, 0],
          this.scrollDistanceX = 0,
          this.oldScrollX = [0, 0],

          this.loudnessArray = [],
          window.addEventListener("wheel", this.handleScroll),
          this.isMicrophoneEnabled = !1,
          this.pressedKey = null,
          this.wait = [!1, "sprite"],
          this.pressedKeys = {},
            
          window.addEventListener("blur", () => {
            this.pressedKeys = {}
            this.pressedKey = ""
            currentlyPressedKey = ""
          });
        
          document.addEventListener("keydown", (e => {
              keyPressTime += .1,
              this.pressedKey = e.key.toUpperCase(),
              this.pressedKeys[this.pressedKey] = !0,
              this.pressedKey = this.pressedKey,
              currentlyPressedKey = this.pressedKey
          }
          )),
          document.addEventListener("keyup", (e => {
              keyHitPass[currentlyPressedKey] = 0;
              const t = e.key.toUpperCase();
              delete this.pressedKeys[t],
              currentlyPressedKey = Object.keys(this.pressedKeys).pop() || null,
              keyPressTime = 0
          }
          )),
          document.addEventListener("mousemove", (e => {
              window.mouseX = e.clientX,
              window.mouseY = e.clientY
          }
          ))
      }
      getInfo() {
          return {
              id: "HyperSenseSP",
              name: "Hyper Sense",
              color1: "#5cb1d6",
              color2: "#2e8eb8",
              blocks: [{
                  blockType: Scratch.BlockType.LABEL,
                  text: "Scrolling"
              }, {
                  opcode: "monitorScrollWheel",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "scroll wheel distance"
              }, {
                  opcode: "scrollVel",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "scroll velocity"
              }, {
                opcode: "monitorScrollWheelX",
                blockType: Scratch.BlockType.REPORTER,
                text: "scroll wheel distance x"
              }, {
                opcode: "scrollVelX",
                blockType: Scratch.BlockType.REPORTER,
                text: "scroll velocity x"
              }, {
                  opcode: "monitorScrollWheelLimited",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "scroll wheel distance limited from [MIN] to [MAX]",
                  arguments: {
                      MIN: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 0
                      },
                      MAX: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 100
                      }
                  }
              }, {
                  opcode: "setScrollDistance",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "set scroll wheel distance to [DISTANCE]",
                  arguments: {
                      DISTANCE: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 0
                      }
                  }
              }, {
                  opcode: "changeScrollDistance",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "change scroll wheel distance by [DISTANCE]",
                  arguments: {
                      DISTANCE: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 100
                      }
                  }
              }, {
                  opcode: "scrollWheelHat",
                  blockType: Scratch.BlockType.EVENT,
                  text: "when scrolled up",
                  isEdgeActivated: !1,
                  arguments: {
                      EVENT: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "SCROLL_EVENTS"
                      }
                  }
              }, {
                  opcode: "scrollWheelHat2",
                  blockType: Scratch.BlockType.EVENT,
                  text: "when scrolled down",
                  isEdgeActivated: !1
              }, {
                  opcode: "scrollWheelBool",
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: "is scrolling [EVENT]?",
                  arguments: {
                      EVENT: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "SCROLL_EVENTS"
                      }
                  }
              }, {
                  blockType: Scratch.BlockType.LABEL,
                  text: "Mouse Detection"
              }, {
                  opcode: "mouseClick",
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: "is mouse [BUTTON] down?",
                  arguments: {
                      BUTTON: {
                          type: Scratch.ArgumentType.NUMBER,
                          menu: "mouseButtons"
                      }
                  }
              }, {
                  opcode: "realX",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "real mouse x"
              }, {
                  opcode: "realY",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "real mouse y"
              }, {
                  blockType: Scratch.BlockType.LABEL,
                  text: "Key Detection"
              }, {
                  opcode: "whenKeyHit",
                  blockType: Scratch.BlockType.HAT,
                  text: "when [KEY] key hit",
                  arguments: {
                      KEY: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "keys"
                      }
                  }
              }, {
                  opcode: "isKeyHit",
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: "is key [KEY] hit?",
                  arguments: {
                      KEY: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "keys"
                      }
                  }
              }, "---", {
                  opcode: "whenKeyPressed",
                  blockType: Scratch.BlockType.HAT,
                  text: "when [KEY] pressed",
                  isEdgeActivated: !1,
                  arguments: {
                      KEY: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "keys",
                          defaultValue: "Tab"
                      }
                  }
              }, {
                  opcode: "isKeyPressed",
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: "key [KEY] pressed?",
                  arguments: {
                      KEY: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "keys",
                          defaultValue: "Tab"
                      }
                  }
              }, "---", {
                  opcode: "currentKey",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "current key pressed"
              }, {
                  opcode: "currentKeys",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "current keys pressed"
              }, {
                  opcode: "timeKeyPressed",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "seconds [KEY] key pressed",
                  arguments: {
                      KEY: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "keys",
                          defaultValue: "A"
                      }
                  }
              }, {
                  blockType: Scratch.BlockType.LABEL,
                  text: "Touching Expanded"
              }, {
                  opcode: "spriteTouchingSprite",
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: "is [SPRITE1] touching [SPRITE2]?",
                  arguments: {
                      SPRITE1: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "TARGETS"
                      },
                      SPRITE2: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "TARGETS3"
                      }
                  }
              }, {
                  opcode: "spriteCurrentTouching",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "sprites touching [SPRITE]",
                  arguments: {
                      SPRITE: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "TARGETS2"
                      }
                  }
              }, {
                  opcode: "getNeighbors",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "get neighbors of [SPRITE] with diameter [DIAMETER]",
                  arguments: {
                      SPRITE: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "TARGETS4"
                      },
                      DIAMETER: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 200
                      }
                  }
              }, "---", {
                  opcode: "colorTouchingSprite",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "color touching [SPRITE]",
                  arguments: {
                      SPRITE: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "TARGETS2"
                      }
                  }
              }, {
                  opcode: "colorAtPosition",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "color at x [x] y [y]",
                  arguments: {
                      x: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 0
                      },
                      y: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 0
                      }
                  }
              }, {
                  blockType: Scratch.BlockType.LABEL,
                  text: "Strings"
              }, {
                  opcode: "boolean",
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: "is [STRING] real?",
                  arguments: {
                      STRING: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: ""
                      }
                  }
              }, {
                  opcode: "getAllString",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "get [TEXT] in string [STRING]",
                  arguments: {
                      STRING: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: "rotating a 6 makes a 9!"
                      },
                      TEXT: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "string_types"
                      }
                  }
              }, {
                  blockType: Scratch.BlockType.LABEL,
                  text: "Asking"
              }, {
                  opcode: "advancedAsk",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "ask [QUESTION] as [THING] and [WAIT]",
                  arguments: {
                      THING: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "Asking"
                      },
                      QUESTION: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: "what is your name?"
                      },
                      WAIT: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "shouldWait"
                      }
                  }
              }, {
                  opcode: "advancedAskReporter",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "ask [QUESTION] as [THING]",
                  arguments: {
                      THING: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "Asking"
                      },
                      QUESTION: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: "what is your name?"
                      }
                  }
              }, {
                  opcode: "stopAsking",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "stop asking question"
              }, {
                  opcode: "currentTyped",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "typed answer"
              }, {
                  opcode: "setAtt",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "set ask monitor x: [x] y: [y] width: [width]",
                  arguments: {
                      x: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 0
                      },
                      y: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 0
                      },
                      width: {
                          type: Scratch.ArgumentType.NUMBER,
                          defaultValue: 480
                      }
                  }
              }, {
                  opcode: "setAskType",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "set ask monitor input to [TYPE]",
                  arguments: {
                      TYPE: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "INPUTS"
                      }
                  }
              }, {
                  opcode: "setAskType2",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "set ask monitor input to dropdown with options from [TYPE]",
                  arguments: {
                      TYPE: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "LISTS"
                      }
                  }
              }, {
                  blockType: Scratch.BlockType.LABEL,
                  text: "Miscellaneous"
              }, {
                  opcode: "isScreen",
                  blockType: Scratch.BlockType.BOOLEAN,
                  text: "is [SCREEN] ?",
                  disableMonitor: !0,
                  arguments: {
                      SCREEN: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "SCREENS"
                      }
                  }
              }, {
                  opcode: "screenOff",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "stage size offset"
              }, "---", {
                  opcode: "averageMicrophoneLoudness",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "average loudness"
              }, {
                  opcode: "getSpriteName",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "my sprite name"
              }, {
                  opcode: "allLayers",
                  blockType: Scratch.BlockType.REPORTER,
                  text: "max sprite layers"
              }, "---", {
                  opcode: "spriteDragMode",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "set drag mode of [SPRITE] to [DRAG]",
                  arguments: {
                      SPRITE: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "TARGETS4"
                      },
                      DRAG: {
                          type: Scratch.ArgumentType.STRING,
                          menu: "DRAG_MODES"
                      }
                  }
              }, {
                  opcode: "toggleMicrophone",
                  blockType: Scratch.BlockType.COMMAND,
                  text: "toggle microphone to [STATE]",
                  hideFromPalette: !0,
                  arguments: {
                      STATE: {
                          type: Scratch.ArgumentType.STRING
                      }
                  }
              }],
              menus: {
                  SCREENS: ["fullscreen", "smallscreen"],
                  INPUTS: ["text", "password", "number", "color"],
                  TARGETS: {
                      acceptReporters: !0,
                      items: this._getTargets(!0, !1)
                  },
                  TARGETS2: {
                      acceptReporters: !0,
                      items: this._getTargets(!0, !0)
                  },
                  TARGETS3: {
                      acceptReporters: !0,
                      items: this._getTargets(!1, !0)
                  },
                  TARGETS4: {
                      acceptReporters: !0,
                      items: this._getTargets(!1, !1)
                  },
                  LISTS: {
                      acceptReporters: !0,
                      items: this.getLists()
                  },
                  Asking: ["stage", "sprite"],
                  shouldWait: ["wait", "continue"],
                  SCROLL_EVENTS: ["up", "down"],
                  keys: {
                      acceptReporters: !0,
                      items: ["Any", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Up Arrow", "Down Arrow", "Left Arrow", "Right Arrow", "Space", "Enter", "Shift", "Control", "Alt", "Escape", "Backspace", "Tab", "Caps Lock", "Insert", "Page Up", "Page Down"]
                  },
                  DRAG_MODES: {
                      acceptReporters: !0,
                      items: ["draggable", "not draggable"]
                  },
                  string_types: {
                      acceptReporters: !0,
                      items: ["numbers", "letters", "special characters"]
                  },
                  mouseButtons: {
                      acceptReporters: !0,
                      items: [{
                          text: "left",
                          value: "0"
                      }, {
                          text: "scroll wheel",
                          value: "1"
                      }, {
                          text: "right",
                          value: "2"
                      }, {
                          text: "back",
                          value: "3"
                      }, {
                          text: "foward",
                          value: "4"
                      }]
                  }
              }
          }
      }
      allLayers() {
          return renderer._drawList.length - 1
      }
      getSpriteName(e, t) {
          return t.target.getName()
      }
      monitorScrollWheel() {
          return this.scrollDistance
      }
      scrollVel() {
          return -1 * this.oldScroll[1]
      }
      monitorScrollWheelX() {
          return this.scrollDistanceX
      }
      scrollVelX() {
          return -1 * this.oldScrollX[1]
      }
      
      monitorScrollWheelLimited(e) {
          const t = Scratch.Cast.toNumber(e.MIN)
            , r = Scratch.Cast.toNumber(e.MAX);
          return Math.max(Math.min(this.scrollDistance, r), t)
      }

      setScrollDistance(e) {
          this.scrollDistance = Scratch.Cast.toNumber(e.DISTANCE)
      }

      changeScrollDistance(e) {
          this.scrollDistance = this.scrollDistance + Scratch.Cast.toNumber(e.DISTANCE)
      }

      handleScroll = e => {
          this.scrollDistance += e.deltaY,
          this.oldScroll[1] = e.deltaY,
          this.scrollDistanceX += e.deltaX,
          this.oldScrollX[1] = e.deltaX,
          this.scrollWheelBool({
              EVENT: "up"
          }),
          this.scrollWheelBool({
              EVENT: "down"
          }),
          clearTimeout(this.scrollTimer),
          this.scrollTimer = setTimeout(( () => {
              this.oldScroll[1] = 0
              this.oldScrollX[1] = 0
          }
          ), 100)
      }
      ;
      scrollWheelBool(args, fromHat) {
          const status = eval(`this.scrollDistance ${"down" === args.EVENT ? ">" : "<"} this.oldScroll[0]`);
          return status && (this.oldScroll[0] = this.scrollDistance),
          !!status
      }
      averageMicrophoneLoudness() {
          this.loudnessArray.length >= 30 && (this.loudnessArray = []),
          this.loudnessArray.push(vm.runtime.ext_scratch3_sensing.getLoudness());
          let e = this.loudnessArray.reduce(( (e, t) => e + t), 0);
          return Math.round(e / this.loudnessArray.length * 100) / 100
      }
      toggleMicrophone(e) {
          console.warn("Depreciated Block")
      }
      handleKeyPress(e, t) {
          if ("Any" === e) {
              if (null === currentlyPressedKey)
                  return !1;
              e = currentlyPressedKey
          }
          isNaN(parseFloat(e)) && (e = e.toUpperCase());
          let r = this.currentKey().toUpperCase();
          return " " !== r && (r = r.replaceAll(" ", "")),
          !!("SPACE" === e && " " === r || e === r || e.startsWith("DIGIT") && e.slice(5) === r) && (e = "SPACE" === e ? " " : e,
          isNaN(keyHitPass[e]) && (keyHitPass[e] = 0),
          keyHitPass[e] = keyHitPass[e] + 1,
          !!t || keyHitPass[e] < 2)
      }
      isKeyHit(e) {
          const t = Scratch.Cast.toString(e.KEY).replace(" ", "");
          return this.handleKeyPress(t, !1)
      }
      whenKeyHit(e) {
          const t = Scratch.Cast.toString(e.KEY).replace(" ", "");
          return this.handleKeyPress(t, !1)
      }
      whenKeyPressed(e) {
          const t = Scratch.Cast.toString(e.KEY).replace(" ", "");
          return this.handleKeyPress(t, !0)
      }
      isKeyPressed(e) {
          const t = Scratch.Cast.toString(e.KEY).replace(" ", "");
          return this.handleKeyPress(t, !0)
      }
      currentKey() {
          return null === currentlyPressedKey ? "No Keys Pressed" : currentlyPressedKey.includes("ARROW") || "CAPSLOCK" === currentlyPressedKey ? "CAPSLOCK" === currentlyPressedKey ? "Caps Lock" : `${currentlyPressedKey.charAt(5).toUpperCase() + currentlyPressedKey.slice(6).toLowerCase()} Arrow` : currentlyPressedKey.charAt(0).toUpperCase() + currentlyPressedKey.slice(1).toLowerCase()
      }
      currentKeys() {
          let e = Object.keys(this.pressedKeys);
          return e = e.map((e => e.includes("ARROW") || "CAPSLOCK" === e ? "CAPSLOCK" === e ? "Caps Lock" : `${e.charAt(5).toUpperCase() + e.slice(6).toLowerCase()} Arrow` : e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())),
          JSON.stringify(e)
      }
      timeKeyPressed(e) {
          let t = Scratch.Cast.toString(e.KEY).replace(" ", "");
          return isNaN(parseFloat(t)) && (t = t.toUpperCase()),
          "SPACE" === t && (t = " "),
          t === this.pressedKey || "Any" === e.KEY ? keyPressTime : 0
      }
      spriteTouchingSprite(e, t) {
          const r = e.SPRITE2
            , s = "_myself_" === r ? t.target : runtime.getSpriteTargetByName(r);
          return !!s && s.isTouchingObject(e.SPRITE1)
      }
      spriteCurrentTouching(e, t) {
          const r = []
            , s = this._getTargets();
          if ("_myself_" === e.SPRITE)
              return this.spriteCurrentTouchingMyself(t);
          const c = "_mouse_" === e.SPRITE ? "_mouse_" : e.SPRITE;
          if (!c)
              return "[]";
          for (let e = 0; e < s.length; e++) {
              runtime.getSpriteTargetByName(s[e].value).isTouchingObject(c) && s[e].value !== c && r.push(s[e].value)
          }
          return JSON.stringify(r)
      }
      spriteCurrentTouchingMyself(e) {
          const t = []
            , r = this._getTargets();
          for (let s = 0; s < r.length; s++) {
              const c = r[s].value;
              let o;
              o = e.target.isTouchingObject(c),
              o && t.push(r[s].value)
          }
          return JSON.stringify(t)
      }
      getNeighbors(e) {
          const t = []
            , r = this._getTargets()
            , s = runtime.getSpriteTargetByName(e.SPRITE);
          if (!s)
              return "[]";
          const c = [s.size, s.direction];
          s.setDirection(-179),
          s.setSize(Math.abs(Scratch.Cast.toNumber(e.DIAMETER)));
          for (let e = 0; e < 90; e++) {
              for (let e = 0; e < r.length; e++) {
                  const c = r[e].value;
                  s.isTouchingObject(c) && !t.includes(c) && s.sprite.name !== c && t.push(r[e].value)
              }
              s.setDirection(s.direction + 2)
          }
          const o = JSON.stringify(t);
          return s.setSize(c[0]),
          s.setDirection(c[1]),
          o
      }
      colorAtPosition(e) {
          return this.colorTouching(Scratch.Cast.toNumber(e.x), Scratch.Cast.toNumber(e.y))
      }
      colorTouchingSprite(e, t) {
          let r;
          if ("_mouse_" === e.SPRITE)
              r = this.colorTouching(t.ioQuery("mouse", "getScratchX"), t.ioQuery("mouse", "getScratchY"));
          else {
              const s = "_myself_" === e.SPRITE ? t.target : runtime.getSpriteTargetByName(e.SPRITE)
                , c = s.visible;
              s.setVisible(!1),
              r = this.colorTouching(s.x, s.y),
              s.setVisible(c)
          }
          return r
      }
      colorTouching(e, t) {
          const r = Math.round((runtime.stageWidth / 2 + e) / runtime.stageWidth * renderer._gl.canvas.clientWidth)
            , s = Math.round((runtime.stageHeight / 2 - t) / runtime.stageHeight * renderer._gl.canvas.clientHeight)
            , c = renderer.extractColor(r, s, 20);
          return `#${c.color.r.toString(16).padStart(2, "0")}${c.color.g.toString(16).padStart(2, "0")}${c.color.b.toString(16).padStart(2, "0")}`
      }
      spriteDragMode(e) {
          runtime.getSpriteTargetByName(e.SPRITE).setDraggable("draggable" === e.DRAG)
      }
      boolean(e) {
          return !!Scratch.Cast.toString(e.STRING) && void 0 !== e.STRING
      }
      setAtt(e) {
          let t = document.querySelectorAll('[class*="question"]')[0];
          if (!t)
              return void (publicVars.askStuff = e);
          const r = getComputedStyle(document.querySelector("canvas"));
          if (e.width && (t.style.width = e.width * (parseInt(r.width) / 480) + "px"),
          "" !== e.x && "" !== e.y) {
              const s = e.x + parseInt(r.width) / 2 - e.width * (parseInt(r.width) / 480) / 2
                , c = e.y + parseInt(r.height) / 2 - ("stage" === this.wait[1] ? 53 : 39);
              t.style.transform = `translate(${s}px, ${-1 * c}px)`
          }
      }
      advancedAsk(e, t) {
          const r = t.target.visible;
          if (t.target.isStage || "stage" !== e.THING || t.target.setVisible(!1),
          this.wait = [!0, e.THING],
          runtime.ext_scratch3_sensing.askAndWait(e, t),
          !t.target.isStage && r && t.target.setVisible(!0),
          publicVars.askStuff && this.setAtt(publicVars.askStuff),
          publicVars.askType && this.setAskType(publicVars.askType),
          "wait" === e.WAIT || void 0 === e.WAIT)
              return new Promise((e => {
                  const t = () => this.wait[0] ? setTimeout(t, 100) : e();
                  t()
              }
              ))
      }
      setAskType(e) {
          let t = document.querySelector(runtime.isPackaged ? '[class="sc-question-input"]' : '[class*="question"] [class^="input_input-form"]');
          if (!t)
              return void (publicVars.askType = e);
          const r = document.getElementById("SP-input_select");
          if (r && t.parentNode.removeChild(r),
          "dropdown" === e.TYPE) {
              const r = t.parentNode.getBoundingClientRect().width;
              let s = document.createElement("select");
              s.id = "SP-input_select",
              s.setAttribute("style", `background: #fff; color: #505050; width: ${r - 40}px; display: block; border-width: 2px; border-color: #D9D9D9; transform: translate(0px,3px);`),
              e.LIST.forEach((e => {
                  let t = document.createElement("option");
                  t.value = e,
                  t.text = e,
                  s.appendChild(t)
              }
              )),
              t.parentNode.appendChild(s),
              t.style.display = "none",
              t.value = s.value,
              s.addEventListener("change", (function() {
                  t.value = s.value
              }
              ));
              document.querySelector('[class*="question-submit-button"]').addEventListener("click", (function() {
                  setTimeout((function() {
                      runtime.ext_scratch3_sensing._answer = t.value
                  }
                  ), 10)
              }
              ))
          } else
              t.type = e.TYPE,
              t.pattern = "number" === e.TYPE ? "[0-9]*" : "none",
              t.style.display = "block"
      }
      setAskType2(e, t) {
          this.setAskType({
              ...e,
              TYPE: "dropdown",
              LIST: this.look4List(e.TYPE, t)
          })
      }
      advancedAskReporter(e, t) {
          return this.advancedAsk(e, t).then(( () => runtime.ext_scratch3_sensing.getAnswer()))
      }
      stopAsking() {
          let e = document.querySelector('[class*="question-submit-button"]');
          e && (runtime.ext_scratch3_sensing._answer = e.value,
          e.click())
      }
      currentTyped() {
          let e = document.querySelector(runtime.isPackaged ? '[class="sc-question-input"]' : '[class*="question"] [class^="input_input-form"]');
          return e ? e.value : ""
      }
      mouseClick(e, t) {
          return t.ioQuery("mouse", "getButtonIsDown", [Scratch.Cast.toNumber(e.BUTTON)])
      }
      realX() {
          return window.mouseX
      }
      realY() {
          return window.mouseY
      }
      getAllString(e) {
          let t;
          switch (e.TEXT) {
          case "numbers":
              t = /[^0-9]/g;
              break;
          case "special characters":
              t = /[A-Za-z0-9]/g;
              break;
          default:
              t = /[^A-Za-z]/g
          }
          return e.STRING.replace(t, "")
      }
      screenOff() {
          return Scratch.vm.renderer.canvas.width / Scratch.vm.runtime.stageWidth
      }
      isScreen(e) {
          const t = [parseFloat(Scratch.vm.renderer.canvas.style.width), Scratch.vm.runtime.stageWidth];
          return "fullscreen" === e.SCREEN ? t[0] > t[1] : t[0] < t[1]
      }
      _getTargets(e, t) {
          const r = [];
          e && r.push({
              text: "mouse-pointer",
              value: "_mouse_"
          }),
          t && r.push({
              text: "myself",
              value: "_myself_"
          });
          const s = Scratch.vm.runtime.targets;
          for (let e = 1; e < s.length; e++) {
              const t = s[e];
              if (t.isOriginal) {
                  const e = t.getName();
                  r.push({
                      text: e,
                      value: e
                  })
              }
          }
          return r.length > 0 ? r : [""]
      }
      getLists() {
          try {
              const e = Object.values(vm.runtime.getTargetForStage().variables).filter((e => "list" == e.type))
                , t = Object.values(vm.editingTarget.variables).filter((e => "list" == e.type))
                , r = [...new Set([...e, ...t])];
              return 0 === r.length ? [{
                  text: "make a list",
                  value: "make a list"
              }] : r.map((e => ({
                  text: e.name,
                  value: e.id
              })))
          } catch {
              return ["make a list"]
          }
      }
      look4List(e, t) {
          const r = t.target.lookupVariableById(e);
          if (r && "list" === r.type)
              return r.value;
          {
              const r = t.target.lookupVariableByNameAndType(e, "list");
              return r ? r.value : ["undefined list"]
          }
      }
  }
  Scratch.extensions.register(new HyperSenseSP)
}
)(Scratch),
unsandboxed;
