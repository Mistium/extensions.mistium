// Name: Dates
// ID: jwDate
// Description: Date values: now, unix epoch and parsing dates.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jwDate
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Dates must run unsandboxed.");

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

  function span(text) {
      let el = document.createElement('span')
      el.innerHTML = text
      el.style.display = 'hidden'
      el.style.whiteSpace = 'nowrap'
      el.style.width = '100%'
      el.style.textAlign = 'center'
      return el
  }

  class DateType {
      customId = "jwDate"

      date = new Date(0)

      constructor(date = new Date(0)) {
          this.date = date
      }

      static from(x) {
          if (x instanceof DateType) return new DateType(x.date)
          if (x instanceof Date) return new DateType(x)
          if (typeof x == 'number' || Number(x) == x) return new DateType(new Date(Number(x)))
          if (typeof x == 'string') return new DateType(new Date(x))
          return new DateType()
      }

      jwArrayHandler() {
          return this.date.toLocaleDateString()
      }

      toString() {
          return this.date.toLocaleString()
      }
      toMonitorContent = () => span(this.toString())

      toReporterContent() {
          let root = document.createElement('div')
          root.style.display = 'flex'
          root.style.flexDirection = 'column'
          root.style.justifyContent = 'center'

          root.appendChild(span(this.date.toLocaleDateString()))
          root.appendChild(span(this.date.toLocaleTimeString()))

          return root
      }
  }

  const jwDate = {
      Type: DateType,
      Block: {
          blockType: BlockType.REPORTER,
          blockShape: shape("TICKET"), // PenguinMod-only shape, SQUARE here
          forceOutputType: "jwDate",
          disableMonitor: true
      },
      // PenguinMod-only: typed ticket-shaped input; a text input here
      Argument: {
          type: ArgumentType.STRING
      }
  }

  class Extension {
      constructor() {
          vm.jwDate = jwDate
          vm.runtime.registerSerializer(
              "jwDate",
              v => v.date.valueOf(),
              v => jwDate.Type.from(v)
          )
          pmTypes.saveable(DateType)
      }

      getInfo() {
          return {
              id: "jwDate",
              name: "Dates",
              color1: "#ff788a",
              blocks: [
                  {
                      opcode: 'now',
                      text: 'now',
                      ...jwDate.Block
                  },
                  {
                      opcode: 'epoch',
                      text: 'unix epoch',
                      ...jwDate.Block
                  },
                  {
                      opcode: 'parse',
                      text: 'parse [INPUT]',
                      arguments: {
                          INPUT: {
                              type: ArgumentType.STRING, // was ArgumentType.String (undefined) in PenguinMod
                              defaultValue: "1/1/1970 01:23",
                              exemptFromNormalization: true
                          }
                      },
                      ...jwDate.Block
                  }
              ],
              menus: {}
          }
      }

      now() {
          return jwDate.Type.from(Date.now())
      }

      epoch() {
          return jwDate.Type.from(0)
      }

      parse({INPUT}) {
          return jwDate.Type.from(INPUT)
      }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
