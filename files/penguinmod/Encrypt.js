// Name: Encrypt
// ID: jwEncrypt
// Description: Unfinished placeholder from PenguinMod; its block does nothing yet.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jw_encrypt
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Encrypt must run unsandboxed.");

  const formatMessage = (m) => (typeof m === "string" ? m : m.default);

  class jwEncrypt {
    constructor() {
      this.runtime = Scratch.vm.runtime;
    }

    getInfo() {
      return {
        id: "jwEncrypt",
        name: "Encrypt",
        color1: "#ffdc7a",
        color2: "#ffd45e",
        blocks: [
          {
            opcode: "encrypt",
            text: formatMessage({
              id: "jwEncrypt.blocks.encrypt",
              default: "encrypt [MENU] [VALUE]",
              description: "Encrypt a string",
            }),
            disableMonitor: true,
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "string",
              },
              MENU: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "base64",
                menu: "encrypt",
              },
            },
          },
        ],
        menus: {
          encrypt: ["base64"],
        },
      };
    }

    encrypt() {
      return "test";
    }
  }

  Scratch.extensions.register(new jwEncrypt());
})(Scratch);
