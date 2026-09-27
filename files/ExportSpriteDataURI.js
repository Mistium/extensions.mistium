// Name: Export Sprite Data URI
// Author: Mistium
// Description: Export sprites as data URI strings.

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
      throw new Error("Export Sprite must run unsandboxed.");
    }

    const vm = Scratch.vm;

    class ExportSprite {
      getInfo() {
        return {
          id: "exportSprite",
          name: "Export Sprite",
          blocks: [
            {
              opcode: "exportSprite",
              blockType: Scratch.BlockType.REPORTER,
              text: "Export Sprite As DataURI [TARGET]",
              arguments: {
                TARGET: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "sprite",
                }
              }
            },
            {
              opcode: "importSprite",
              blockType: Scratch.BlockType.COMMAND,
              text: "Import Sprite From DataURI [URI]",
              arguments: {
                URI: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "",
                }
              }
            }
          ],
          menus: {
            sprite: {
              acceptReporters: true,
              items: "_getTargets",
            },
          },
        };
      }

      exportSprite(args, util) {
        const target = this._getTargetFromMenu(Scratch.Cast.toString(args.TARGET), util);
        if (!target) return "";
        return Scratch.vm.exportSprite(target.id)
          .then(blob => this._blobToDataURL(blob))
          .catch(() => "");
      }

      importSprite(args) {
        return Scratch.fetch(Scratch.Cast.toString(args.URI))
          .then(res => res.arrayBuffer())
          .then(buffer => vm.addSprite(buffer))
          .catch(e => console.error("Failed to import sprite:", e));
      }

      _getTargetFromMenu(targetName, util) {
        let target = Scratch.vm.runtime.getSpriteTargetByName(targetName);
        if (targetName === "_myself_") target = util.target;
        if (targetName === "_stage_") target = vm.runtime.getTargetForStage();
        return target;
      }

      _getTargets() {
        const spriteNames = [
          { text: "myself", value: "_myself_" },
          { text: "Stage", value: "_stage_" },
        ];
        const targets = Scratch.vm.runtime.targets;
        for (let index = 1; index < targets.length; index++) {
          const target = targets[index];
          if (target.isOriginal) {
            const targetName = target.getName();
            spriteNames.push({
              text: targetName,
              value: targetName,
            });
          }
        }
        return spriteNames;
      }

      _blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    }

    Scratch.extensions.register(new ExportSprite());
  })(Scratch);
