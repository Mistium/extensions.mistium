// Name: Labels
// ID: jwProto
// Description: Label blocks and placeholders for organising scripts.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jw_proto
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Labels must run unsandboxed.");
  const { BlockType, ArgumentType } = Scratch;
  const formatMessage = (m) => (typeof m === "string" ? m : m.default);

  class jwProto {
    constructor() {
      this.runtime = Scratch.vm.runtime;
      // PenguinMod-only: PM also registered a compiled version of labelFunction; the JS version below does the same.
    }

    getInfo() {
      return {
        autoLoad: true,
        id: "jwProto",
        name: "Labels",
        color1: "#969696",
        color2: "#6e6e6e",
        blocks: [
          {
            opcode: "labelHat",
            text: formatMessage({ id: "jwProto.blocks.labelHat", default: "// [LABEL]", description: "Label for some unused blocks." }),
            disableMonitor: true,
            blockType: BlockType.HAT,
            arguments: { LABEL: { type: ArgumentType.STRING, defaultValue: "label" } },
          },
          {
            opcode: "labelFunction",
            text: formatMessage({ id: "jwProto.blocks.labelFunction", default: "// [LABEL]", description: "Label for some blocks." }),
            blockType: BlockType.COMMAND,
            branchCount: 1,
            arguments: { LABEL: { type: ArgumentType.STRING, defaultValue: "label" } },
          },
          {
            opcode: "labelCommand",
            text: formatMessage({ id: "jwProto.blocks.labelCommand", default: "// [LABEL]", description: "Label for labeling." }),
            disableMonitor: true,
            blockType: BlockType.COMMAND,
            arguments: { LABEL: { type: ArgumentType.STRING, defaultValue: "label" } },
          },
          {
            opcode: "labelReporter",
            text: formatMessage({ id: "jwProto.blocks.labelReporter", default: "[VALUE] // [LABEL]", description: "Label for a value." }),
            disableMonitor: true,
            blockType: BlockType.REPORTER,
            arguments: {
              LABEL: { type: ArgumentType.STRING, defaultValue: "label" },
              VALUE: { type: ArgumentType.STRING, defaultValue: "value" },
            },
          },
          {
            opcode: "labelBoolean",
            text: formatMessage({ id: "jwProto.blocks.labelBoolean", default: "[VALUE] // [LABEL]", description: "Label for a boolean." }),
            disableMonitor: true,
            blockType: BlockType.BOOLEAN,
            arguments: {
              LABEL: { type: ArgumentType.STRING, defaultValue: "label" },
              VALUE: { type: ArgumentType.BOOLEAN },
            },
          },
          { blockType: BlockType.LABEL, text: "Placeholders" },
          {
            opcode: "placeholderCommand",
            text: formatMessage({ id: "jwProto.blocks.placeholderCommand", default: "...", description: "Placeholder for stack blocks." }),
            blockType: BlockType.COMMAND,
          },
          {
            opcode: "placeholderReporter",
            text: formatMessage({ id: "jwProto.blocks.placeholderReporter", default: "...", description: "Placeholder for a value." }),
            disableMonitor: true,
            allowDropAnywhere: true,
            blockType: BlockType.REPORTER,
          },
          {
            opcode: "placeholderBoolean",
            text: formatMessage({ id: "jwProto.blocks.placeholderBoolean", default: "...", description: "Placeholder for a boolean." }),
            disableMonitor: true,
            blockType: BlockType.BOOLEAN,
          },
        ],
      };
    }

    labelHat() {
      return false;
    }
    labelFunction(_, util) {
      util.startBranch(1, false);
    }
    labelCommand() {
      return;
    }
    labelReporter(args) {
      return args.VALUE;
    }
    labelBoolean(args) {
      return args.VALUE;
    }
    placeholderCommand() {
      return;
    }
    placeholderReporter() {
      return "";
    }
    placeholderBoolean() {
      return false;
    }
  }

  Scratch.extensions.register(new jwProto());
})(Scratch);
