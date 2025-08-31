// Name: Delta Time
// ID: dtbyxeroname
// Description: Precise delta timing blocks.
// By: XeroName <https://scratch.mit.edu/users/plant2014/>
// License: MIT

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("DeltaTime must be run unsandboxed");
  }

  const vm = Scratch.vm;

  let deltaTime = 0;
  let previousTime = 0;

  vm.runtime.on("BEFORE_EXECUTE", () => {
    const now = performance.now();

    if (previousTime === 0) {
      // First frame. We used to always return 0 here, but that can break projects that
      // expect delta time to always be non-zero. Instead we'll make our best guess.
      deltaTime = 1 / vm.runtime.frameLoop.framerate;
    } else {
      deltaTime = (now - previousTime) / 1000;
    }

    previousTime = now;
  });

  class Dt {
    getInfo() {
      return {
        id: "dtbyxeroname",
        name: "Delta Time",
        color1: "#333333",
        color2: "#444444",
        color3: "#ffffff",
        blocks: [
          {
            opcode: "dt",
            blockType: Scratch.BlockType.REPORTER,
            // eslint-disable-next-line extension/should-translate
            text: "ΔT",
          },
          {
            opcode: "fps",
            blockType: Scratch.BlockType.REPORTER,
            // eslint-disable-next-line extension/should-translate
            text: "fps",
          },
        ],
      };
    }

    dt() {
      return deltaTime;
    }

    fps() {
      return +(1 / deltaTime).toFixed(2);
    }
  }

  Scratch.extensions.register(new Dt());
})(Scratch);
