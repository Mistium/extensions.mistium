// Name: Censorship
// ID: profanityAPI
// Description: Remove profanity from text using the PurgoMalum API.
// By: TheShovel
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/theshovel_profanity
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Censorship must run unsandboxed.");

  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const Cast = Scratch.Cast;
  const scratchFetch = (...args) => (Scratch.fetch ? Scratch.fetch(...args) : fetch(...args));

  class profanityAPI {
    getInfo() {
      return {
        id: "profanityAPI",
        name: "Censorship",
        blocks: [
          {
            opcode: "checkProfanity",
            blockType: BlockType.REPORTER,
            disableMonitor: false,
            text: "remove profanity from [TEXT]",
            arguments: {
              TEXT: {
                type: ArgumentType.STRING,
                defaultValue: "Hello, I love pizza!",
              },
            },
          },
        ],
      };
    }

    checkProfanity({ TEXT }) {
      const text = encodeURIComponent(Cast.toString(TEXT));
      return scratchFetch(`https://www.purgomalum.com/service/plain?text=${text}`)
        .then((r) => r.text())
        .catch(() => "");
    }
  }

  Scratch.extensions.register(new profanityAPI());
})(Scratch);
