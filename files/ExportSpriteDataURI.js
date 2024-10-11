(function (Scratch) {
    "use strict";

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
        return new Promise((resolve, reject) => {
          let target = this._getTargetFromMenu(Scratch.Cast.toString(args.TARGET), util);
          console.log(target);
          Scratch.vm.exportSprite(target.id).then(val => {
            this._blobToDataURL(val, (dataurl) => {
              resolve(dataurl);
            });
          }).catch(reject);
        });
      }

      _getTargetFromMenu(targetName, util) {
        let target = Scratch.vm.runtime.getSpriteTargetByName(targetName);
        if (targetName === "_myself_") target = util.target;
        if (targetName === "_stage_") target = runtime.getTargetForStage();
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

      _blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function(e) {callback(e.target.result);}
        a.readAsDataURL(blob);
    }
    }

    Scratch.extensions.register(new ExportSprite());
  })(Scratch);
