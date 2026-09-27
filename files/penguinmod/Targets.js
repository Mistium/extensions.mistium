// Name: Targets
// ID: jwTargets
// Description: A target value type for sprites, clones and the stage, with blocks to read, change, clone and list them.
// By: jwklong
// Needs: Array (jwArray) for "all targets", "targets touching", "clones of" and "has clone of"
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jwTargets
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Targets must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const vm = Scratch.vm;
    const shape = (name) => Scratch.BlockShape?.[name] ?? Scratch.BlockShape?.SQUARE;

    // PenguinMod saves custom values in variables as { customType: true, typeId, serialized }.
    // MistWarp/TurboWarp have no serializer registry, so: provide registerSerializer if missing, write that format via
    // toJSON when the project is saved, and turn saved values back into objects after a project loads.
    const pmTypes = (() => {
      const runtime = Scratch.vm.runtime;
      if (runtime.pmTypesShim) return runtime.pmTypesShim;
      const native = typeof runtime.registerSerializer === "function";
      if (!runtime.serializers) runtime.serializers = {};
      const isSaved = (v) => v && typeof v === "object" && v.customType === true && typeof v.typeId === "string";
      const reviveValue = (v) => {
        if (isSaved(v) && runtime.serializers[v.typeId]) return runtime.serializers[v.typeId].deserialize(v.serialized);
        if (Array.isArray(v) && v.some(isSaved)) return v.map(reviveValue);
        return v;
      };
      const revive = () => {
        for (const target of runtime.targets) {
          for (const variable of Object.values(target.variables)) variable.value = reviveValue(variable.value);
        }
      };
      if (!native) {
        runtime.registerSerializer = (id, serialize, deserialize) => {
          runtime.serializers[id] = { serialize, deserialize };
          revive();
        };
        runtime.on("PROJECT_LOADED", revive);
      }
      const shim = {
        native,
        // call on each custom value class: class.prototype gets toJSON writing PenguinMod's format
        saveable(Class) {
          if (native || Class.prototype.toJSON) return;
          Class.prototype.toJSON = function () {
            const serializer = runtime.serializers[this.customId];
            return serializer ? { customType: true, typeId: this.customId, serialized: serializer.serialize(this) } : String(this);
          };
        },
      };
      return (runtime.pmTypesShim = shim);
    })();

    // MistWarp/TurboWarp validate projects on load and turn object variable values into "[object Object]"
    // (sb3fix), so the object format above never survives a reload there. So while saving, custom values are
    // written as that same JSON inside a string, and such strings become objects again after a project loads.
    // Guarded separately from the shim so it installs whichever port loads first.
    (() => {
      const runtime = Scratch.vm.runtime;
      if (pmTypes.native || runtime.pmTypesStringSave) return;
      runtime.pmTypesStringSave = true;
      const prefix = '{"customType":true,"typeId":"';
      const encode = (v) => {
        if (Array.isArray(v)) {
          const out = v.map(encode);
          return out.some((x, i) => x !== v[i]) ? out : v;
        }
        const serializer = v && typeof v === "object" && runtime.serializers[v.customId];
        return serializer ? JSON.stringify({ customType: true, typeId: v.customId, serialized: serializer.serialize(v) }) : v;
      };
      const decode = (v) => {
        if (Array.isArray(v)) {
          const out = v.map(decode);
          return out.some((x, i) => x !== v[i]) ? out : v;
        }
        if (typeof v === "string" && v.startsWith(prefix)) {
          try {
            const saved = JSON.parse(v);
            if (runtime.serializers[saved.typeId]) return runtime.serializers[saved.typeId].deserialize(saved.serialized);
          } catch {}
        }
        return v;
      };
      const eachVariable = (fn) => {
        for (const target of runtime.targets) for (const variable of Object.values(target.variables)) fn(variable);
      };
      const toJSON = Scratch.vm.toJSON;
      Scratch.vm.toJSON = function (...args) {
        const changed = [];
        eachVariable((variable) => {
          const encoded = encode(variable.value);
          if (encoded !== variable.value) changed.push([variable, variable.value]);
          variable.value = encoded;
        });
        try {
          return toJSON.apply(this, args);
        } finally {
          for (const [variable, value] of changed) variable.value = value;
        }
      };
      const revive = () => eachVariable((variable) => { variable.value = decode(variable.value); });
      runtime.on("PROJECT_LOADED", revive);
      const register = runtime.registerSerializer;
      runtime.registerSerializer = function (...args) {
        const result = register.apply(this, args);
        revive();
        return result;
      };
    })();

    function span(text) {
        let el = document.createElement('span')
        el.innerText = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    const escapeHTML = unsafe => {
        return unsafe
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;")
    };


    class jwTargetType {
        customId = "jwTargets"

        targetId = ""

        constructor(targetId) {
            this.targetId = targetId
        }

        static toTarget(x) {
            if (x instanceof jwTargetType) return x
            if (typeof x == "string") return new jwTargetType(x)
            return new jwTargetType("")
        }

        jwArrayHandler() {
            try {
                return escapeHTML(`Target<${this.target.sprite.name}>`)
            } catch {
                return `Target`
            }
        }

        toString() {
            return this.targetId
        }
        toMonitorContent() {
            try {
                return span(this.target.sprite.name)
            } catch {
                return span(this.targetId)
            }
        }

        toReporterContent() {
            try {
                let target = this.target
                let name = target.sprite.name
                let isClone = !target.isOriginal
                let costumeURI = target.getCostumes()[target.currentCostume].asset.encodeDataURI()

                let root = document.createElement('div')
                root.style.display = 'flex'
                root.style.flexDirection = 'column'
                root.style.justifyContent = 'center'

                let img = document.createElement('img')
                img.src = costumeURI
                img.style.maxWidth = '150px'
                img.style.maxHeight = '150px'
                root.appendChild(img)

                root.appendChild(span(`${name}${isClone ? ' (clone)' : ''}`))

                return root
            } catch {
                return span("Unknown")
            }
        }

        get target() {
            return vm.runtime.getTargetById(this.targetId)
        }
    }

    const Target = {
        Type: jwTargetType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: shape("OCTAGONAL"),
            forceOutputType: "Target",
            disableMonitor: true
        },
        Argument: {
            check: ["Target"],
            shape: shape("OCTAGONAL")
        }
    }

    // read lazily: Arrays may load before or after this extension
    const arrayFallback = {
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: shape("SQUARE"),
            forceOutputType: "Array",
            disableMonitor: true
        },
        Argument: {}
    }
    const getArray = () => vm.jwArray

    // PenguinMod-only RenderedTarget.isTouchingTarget, copied from PenguinMod's rendered-target.js
    function isTouchingTarget(self, targetId) {
        targetId = Cast.toString(targetId);
        const target = vm.runtime.getTargetById(targetId);
        if (!target || !self.renderer || target.dragging) {
            return false;
        }
        return self.renderer.isTouchingDrawables(
            self.drawableID, [target.drawableID]);
    }

    class Extension {
        constructor() {
            vm.runtime.on("SPRITE_RENAMED", (change) => {
              if (!vm.editingTarget) return;

              let hasRefreshReason = false;
              for (const block of Object.values(vm.editingTarget.blocks._blocks)) {
                if (block.opcode === 'jwTargets_menu_sprite') {
                  const field = block.fields.sprite;
                  if (field.value === change.old) {
                    field.value = change.new;
                    if (block.parent) hasRefreshReason = true;
                  }
                }
              }

              if (hasRefreshReason) vm.runtime.requestBlocksUpdate();
            });

            vm.jwTargets = Target
            vm.runtime.registerSerializer(
                "jwTargets", 
                v => v.targetId, 
                v => new Target.Type(v)
            );
            pmTypes.saveable(jwTargetType)

            // PenguinMod-only: loadExtensionIdSync('jwArray'); the array blocks read vm.jwArray when they run

            /*let oldInitDrawable = vm.exports.RenderedTarget.prototype.initDrawable
            vm.exports.RenderedTarget.prototype.initDrawable = function(...args) {
                oldInitDrawable.call(this, ...args)

                if (!this.isOriginal) {
                    this.runtime.startHats(
                        'jwTargets_whenStart', {TARGET: new Target.Type(this.id)}, this
                    );
                }
            }*/
        }

        getInfo() {
            return {
                id: "jwTargets",
                name: "Targets",
                color1: "#4254f5",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM6Yng9Imh0dHBzOi8vYm94eS1zdmcuY29tIj4KICA8Y2lyY2xlIHN0eWxlPSJzdHJva2Utd2lkdGg6IDJweDsgcGFpbnQtb3JkZXI6IHN0cm9rZTsgZmlsbDogcmdiKDY2LCA4NCwgMjQ1KTsgc3Ryb2tlOiByZ2IoNDAsIDU1LCAxOTkpOyIgY3g9IjEwIiBjeT0iMTAiIHI9IjkiPjwvY2lyY2xlPgogIDxwYXRoIGQ9Ik0gMTAgMy4yMjIgQyA0Ljc4MyAzLjIyMiAxLjUyMyA4Ljg3IDQuMTMgMTMuMzg5IEMgNS4zNCAxNS40ODUgNy41OCAxNi43NzggMTAgMTYuNzc4IEMgMTUuMjE4IDE2Ljc3OCAxOC40OCAxMS4xMyAxNS44NjkgNi42MTEgQyAxNC42NjEgNC41MTUgMTIuNDIyIDMuMjIyIDEwIDMuMjIyIE0gMTAgNS40ODEgQyAxMy40NzkgNS40ODEgMTUuNjUzIDkuMjQ4IDEzLjkxMyAxMi4yNTkgQyAxMy4xMDYgMTMuNjU4IDExLjYxNiAxNC41MTkgMTAgMTQuNTE5IEMgNi41MjIgMTQuNTE5IDQuMzUgMTAuNzUyIDYuMDg3IDcuNzQxIEMgNi44OTUgNi4zNDIgOC4zODUgNS40ODEgMTAgNS40ODEgTSAxMCA3Ljc0MSBDIDguMjYyIDcuNzQxIDcuMTczIDkuNjIyIDguMDQ0IDExLjEzIEMgOC40NDggMTEuODI4IDkuMTkzIDEyLjI1OSAxMCAxMi4yNTkgQyAxMS43NCAxMi4yNTkgMTIuODI3IDEwLjM3OCAxMS45NTYgOC44NyBDIDExLjU1MyA4LjE3MiAxMC44MDggNy43NDEgMTAgNy43NDEiIGZpbGw9IiNmZmYiIHN0eWxlPSIiPjwvcGF0aD4KPC9zdmc+",
                blocks: [
                    {
                        opcode: 'this',
                        text: 'this target',
                        hideFromPalette: true,
                        ...Target.Block
                    },
                    {
                        opcode: 'stage',
                        text: 'stage target',
                        hideFromPalette: true,
                        ...Target.Block
                    },
                    {
                        opcode: 'fromName',
                        text: '[SPRITE] target',
                        arguments: {
                            SPRITE: {
                                menu: "sprite"
                            }
                        },
                        ...Target.Block
                    },
                    {
                        opcode: 'cloneOrigin',
                        text: 'origin of [TARGET]',
                        arguments: {
                            TARGET: Target.Argument
                        },
                        ...Target.Block
                    },
                    '---',
                    {
                        opcode: 'get',
                        text: '[TARGET] [MENU]',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            TARGET: Target.Argument,
                            MENU: {
                                menu: "targetProperty",
                                defaultValue: "name"
                            }
                        }
                    },
                    {
                        opcode: 'set',
                        text: 'set [TARGET] [MENU] to [VALUE]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            TARGET: Target.Argument,
                            MENU: {
                                menu: "targetPropertySet",
                                defaultValue: "x"
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                exemptFromNormalization: true
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'isClone',
                        text: 'is [TARGET] a clone',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            TARGET: Target.Argument
                        }
                    },
                    {
                        opcode: 'isTouching',
                        text: 'is [A] touching [B]',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            A: Target.Argument,
                            B: Target.Argument
                        }
                    },
                    {
                        opcode: 'isTouchingObject',
                        text: 'is [A] touching [B]',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            A: Target.Argument,
                            B: {
                                menu: "touchingObject"
                            },
                        }
                    },
                    '---',
                    {
                        opcode: 'getVar',
                        text: 'var [NAME] of [TARGET]',
                        blockType: BlockType.REPORTER,
                        allowDropAnywhere: true,
                        arguments: {
                            TARGET: Target.Argument,
                            NAME: {
                                type: ArgumentType.STRING
                            }
                        }
                    },
                    {
                        opcode: 'setVar',
                        text: 'set var [NAME] of [TARGET] to [VALUE]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            TARGET: Target.Argument,
                            NAME: {
                                type: ArgumentType.STRING
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                exemptFromNormalization: true
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'clone',
                        text: 'create clone of [TARGET]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            TARGET: Target.Argument
                        }
                    },
                    {
                        opcode: 'cloneR',
                        text: 'create clone of [TARGET]',
                        arguments: {
                            TARGET: Target.Argument
                        },
                        ...Target.Block
                    },
                    {
                        opcode: 'deleteClone',
                        text: 'delete clone [TARGET]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            TARGET: Target.Argument
                        }
                    },
                    '---',
                    {
                        opcode: 'all',
                        text: 'all targets',
                        ...(getArray() || arrayFallback).Block
                    },
                    {
                        opcode: 'touching',
                        text: 'targets touching [TARGET]',
                        arguments: {
                            TARGET: Target.Argument
                        },
                        ...(getArray() || arrayFallback).Block
                    },
                    {
                        opcode: 'clones',
                        text: 'clones of [TARGET]',
                        arguments: {
                            TARGET: Target.Argument
                        },
                        ...(getArray() || arrayFallback).Block
                    },
                    {
                        opcode: 'arrayHasTarget',
                        text: '[ARRAY] has clone of [TARGET]',
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            ARRAY: (getArray() || arrayFallback).Argument,
                            TARGET: Target.Argument
                        }
                    },
                    /*'---',
                    {
                        opcode: 'whenStart',
                        text: 'when I start as a clone of [TARGET]',
                        blockType: BlockType.EVENT,
                        isEdgeActivated: false,
                        arguments: {
                            TARGET: Target.Argument
                        }
                    },*/
                    // PenguinMod-only: the control_run_as_sprite block doesn't exist in MistWarp/TurboWarp
                ],
                menus: {
                    sprite: {
                        acceptReporters: true,
                        items: 'getSpriteMenu'
                    },
                    targetProperty: {
                        acceptReporters: true,
                        items: [
                            "name",
                            "id",
                            "x",
                            "y",
                            "direction",
                            "size",
                            "stretch x",
                            "stretch y",
                            "costume #",
                            "costume name",
                            "visible",
                            "layer",
                            "volume"
                        ]
                    },
                    targetPropertySet: {
                        acceptReporters: true,
                        items: [
                            "x",
                            "y",
                            "direction",
                            "size",
                            "stretch x",
                            "stretch y",
                            "costume #",
                            "costume name",
                            "visible",
                            "layer",
                            "volume"
                        ]
                    },
                    touchingObject: [
                        { text: "mouse-pointer", value: "_mouse_" },
                        { text: "edge", value: "_edge_" }
                    ]
                }
            };
        }

        getSpriteMenu({}) {
            let sprites = ["this", "stage"]
            for (let target of vm.runtime.targets.filter(v => v !== vm.runtime._stageTarget)) {
                if (!sprites.includes(target.sprite.name)) sprites.push(target.sprite.name)
            }
            return sprites
        }

        this({}, util) {
            return new Target.Type(util.target.id)
        }

        stage() {
            return new Target.Type(vm.runtime._stageTarget.id)
        }

        fromName({SPRITE}, util) {
            SPRITE = Cast.toString(SPRITE)
            if (SPRITE == "this") return this.this({}, util)
            if (SPRITE == "stage") return this.stage()
            let target = vm.runtime.getSpriteTargetByName(SPRITE)
            return new Target.Type(target ? target.id : "")
        }

        cloneOrigin({TARGET}, util) {
            TARGET = Target.Type.toTarget(TARGET)
            if (!TARGET.target) return ""

            return this.fromName({SPRITE: TARGET.target.sprite.name}, util)
        }

        get({TARGET, MENU}) {
            TARGET = Target.Type.toTarget(TARGET)
            MENU = Cast.toString(MENU)

            if (!TARGET.target) return ""

            switch(MENU) {
                case "name": return TARGET.target.sprite.name
                case "id": return TARGET.target.id
                case "x": return TARGET.target.x
                case "y": return TARGET.target.y
                case "direction": return TARGET.target.direction
                case "size": return TARGET.target.size
                // PenguinMod-only: sprite stretch; 100 (unstretched) elsewhere
                case "stretch x": return TARGET.target.stretch ? TARGET.target.stretch[0] : 100
                case "stretch y": return TARGET.target.stretch ? TARGET.target.stretch[1] : 100
                case "costume #": return TARGET.target.currentCostume + 1
                case "costume name": return TARGET.target.getCurrentCostume().name
                case "visible": return TARGET.target.visible
                case "layer": return TARGET.target.getLayerOrder()
                case "volume": return TARGET.target.volume
            }

            return ""
        }

        set({TARGET, MENU, VALUE}) {
            TARGET = Target.Type.toTarget(TARGET)
            MENU = Cast.toString(MENU)

            if (!TARGET.target) return

            switch(MENU) {
                case "x":
                    TARGET.target.setXY(Cast.toNumber(VALUE), TARGET.target.y)
                    break
                case "y":
                    TARGET.target.setXY(TARGET.target.x, Cast.toNumber(VALUE))
                    break
                case "direction":
                    TARGET.target.setDirection(Cast.toNumber(VALUE))
                    break
                case "size":
                    TARGET.target.setSize(Cast.toNumber(VALUE))
                    break
                // PenguinMod-only: sprite stretch; does nothing elsewhere
                case "stretch x":
                    if (TARGET.target.setStretch) TARGET.target.setStretch(Cast.toNumber(VALUE), TARGET.target.stretch[1])
                    break
                case "stretch y":
                    if (TARGET.target.setStretch) TARGET.target.setStretch(TARGET.target.stretch[0], Cast.toNumber(VALUE))
                    break
                case "costume #":
                    TARGET.target.setCostume(Cast.toNumber(VALUE) - 1)
                    break
                case "costume name":
                    let index = TARGET.target.getCostumes().indexOf(TARGET.target.getCostumes().find(v => v.name === Cast.toString(VALUE)))
                    TARGET.target.setCostume(index)
                    break
                case "visible":
                    TARGET.target.setVisible(Cast.toBoolean(VALUE))
                    break
                case "layer":
                    // PenguinMod-only looks setSpriteLayer, inlined
                    TARGET.target.goForwardLayers(Cast.toNumber(VALUE) - TARGET.target.getLayerOrder())
                    break
                case "volume":
                    // MistWarp/TurboWarp's _updateVolume takes util, not the target
                    vm.runtime.ext_scratch3_sound._updateVolume(Cast.toNumber(VALUE), {target: TARGET.target})
                    break
            }
        }

        isClone({TARGET}) {
            TARGET = Target.Type.toTarget(TARGET)
            if (!TARGET.target) return false

            return !TARGET.target.isOriginal
        }

        isTouching({A, B}) {
            A = Target.Type.toTarget(A)
            B = Target.Type.toTarget(B)

            if (!A.target || !B.target) return false

            return isTouchingTarget(A.target, B.target.id)
        }

        isTouchingObject({A, B}) {
            A = Target.Type.toTarget(A)

            if (!A.target) return false

            return A.target.isTouchingObject(B)
        }

        getVar({TARGET, NAME}) {
            TARGET = Target.Type.toTarget(TARGET)
            NAME = Cast.toString(NAME)
            if (!TARGET.target) return ""

            let variable = Object.values(TARGET.target.variables).find(v => v.name == NAME)
            if (!variable) return ""

            return variable.value
        }

        setVar({TARGET, NAME, VALUE}) {
            TARGET = Target.Type.toTarget(TARGET)
            NAME = Cast.toString(NAME)
            if (!TARGET.target) return

            let variable = Object.values(TARGET.target.variables).find(v => v.name == NAME)
            if (!variable) return

            variable.value = VALUE
        }

        clone(args) {
            this.cloneR(args)
        }

        cloneR({TARGET}) {
            TARGET = Target.Type.toTarget(TARGET)
            if (!TARGET.target) return

            let origin = TARGET.target
            let clone = origin.makeClone()

            if (clone) {
                vm.runtime.addTarget(clone)
                clone.goBehindOther(origin) //mimick clone making from control category
            }

            return new Target.Type(clone ? clone.id : "")
        }

        deleteClone({TARGET}) {
            TARGET = Target.Type.toTarget(TARGET)
            if (!TARGET.target) return
            if (TARGET.target.isOriginal) return

            vm.runtime.stopForTarget(TARGET.target)
            vm.runtime.disposeTarget(TARGET.target)
        }

        all() {
            const jwArray = getArray()
            if (!jwArray) return ""
            return new jwArray.Type(vm.runtime.targets.map(v => new Target.Type(v.id)))
        }

        touching({TARGET}) {
            const jwArray = getArray()
            if (!jwArray) return ""
            TARGET = Target.Type.toTarget(TARGET)
            if (!TARGET.target) return new jwArray.Type

            let targets = vm.runtime.targets
            targets = targets.filter(v => v !== TARGET && !v.isStage)
            targets = targets.filter(v => isTouchingTarget(v, TARGET.targetId))
            return new jwArray.Type(targets.map(v => new Target.Type(v.id)))
        }

        clones({TARGET}) {
            const jwArray = getArray()
            if (!jwArray) return ""
            TARGET = Target.Type.toTarget(TARGET)
            if (TARGET.target) {
                return new jwArray.Type(TARGET.target.sprite.clones.filter(v => !v.isOriginal).map(v => new Target.Type(v.id)))
            }
            return new jwArray.Type()
        }

        arrayHasTarget({ARRAY, TARGET}) {
            const jwArray = getArray()
            if (!jwArray) return false
            ARRAY = jwArray.Type.toArray(ARRAY)
            TARGET = Target.Type.toTarget(TARGET)
            if (!TARGET.target) return false

            return ARRAY.array.find(v => {
                let target = Target.Type.toTarget(v)
                if (!target.target) return false
                return target.target.sprite == TARGET.target.sprite
            }) !== undefined
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
