// Name: Controls Expansion
// ID: pmControlsExpansion
// Description: Extra control blocks: else-if chains, new threads with data and restarting scripts.
// By: PenguinMod team (pm)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/pm_controlsExpansion
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Controls Expansion must run unsandboxed.");

  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const Cast = Scratch.Cast;

  const AsyncIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPgo8ZGVmcz4KPGcgaWQ9IkxheWVyMV8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjAuNDQ3MDU4ODIzNTI5NDExOCIgc3Ryb2tlPSJub25lIiBkPSIKTSAxMi4xIDEuNTUKUSAxMS41MTU0Mjk2ODc1IDEuNDk5NjA5Mzc1IDEwLjk1IDIuMTUKTCA3LjMgNi4xClEgNi42ODcxMDkzNzUgNi41NjI1IDYuNyA3LjIgNi43MjUgOC43NzUxOTUzMTI1IDguMyA4Ljc1CkwgOS4yNSA4Ljc1ClEgOS42MTA1NDY4NzUgMTIuMjU2MDU0Njg3NSA5LjI1IDE1LjMKTCA4LjEgMTUuMjUKUSA3LjE1MzkwNjI1IDE1LjI3MTY3OTY4NzUgNi44IDE2IDYuNjc2MzY3MTg3NSAxNi4yNjY3OTY4NzUgNi42NSAxNi42NSA2LjYxMjY5NTMxMjUgMTcuMTY3MTg3NSA3LjIgMTcuODUKTCAxMC45NSAyMS45ClEgMTEuNDQxMjEwOTM3NSAyMi42NTE5NTMxMjUgMTIuMSAyMi41NSAxMi42MDkxNzk2ODc1IDIyLjY0NDcyNjU2MjUgMTMuMiAyMi4wNQpMIDEzLjIgMjIuMDUgMTcuMDUgMTcuOQpRIDE3LjU1ODc4OTA2MjUgMTcuNDY4OTQ1MzEyNSAxNy41IDE2LjkgMTcuNTI1IDE1LjMyNDgwNDY4NzUgMTUuOTUgMTUuMwpMIDE0LjggMTUuMwpRIDE0LjUyODMyMDMxMjUgMTIuMTIxNjc5Njg3NSAxNC44NSA4LjgKTCAxNi4xNSA4LjgKUSAxNy4xOTg0Mzc1IDguODI4NzEwOTM3NSAxNy40NSA3LjkgMTcuNTIzNjMyODEyNSA3Ljc1MTE3MTg3NSAxNy41IDcuNiAxNy41MjUgNy41NSAxNy41IDcuNDUgMTcuNTQ3NDYwOTM3NSA2Ljg0NDUzMTI1IDE3LjA1IDYuMjUKTCAxMy4yIDIuMgpRIDEyLjc1NTA3ODEyNSAxLjQ5ODI0MjE4NzUgMTIuMSAxLjU1IFoiLz4KPC9nPgoKPGcgaWQ9IkxheWVyMF8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjRkZGRkZGIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDE2LjM1IDYuODUKTCAxMi40NSAyLjc1ClEgMTIuMyAyLjUgMTIuMSAyLjUgMTEuOSAyLjUgMTEuNyAyLjc1CkwgNy44NSA2Ljg1ClEgNy42NSA3IDcuNjUgNy4yIDcuNjUgNy44NSA4LjMgNy44NQpMIDEwLjEgNy44NQpRIDEwLjY1IDEyLjQgMTAuMSAxNi4yNQpMIDguMSAxNi4yClEgNy43NSAxNi4yIDcuNjUgMTYuNSA3LjYgMTYuNTUgNy42IDE2LjY1IDcuNiAxNi45IDcuOSAxNy4yNQpMIDExLjc1IDIxLjQKUSAxMS45IDIxLjY1IDEyLjEgMjEuNjUgMTIuMyAyMS42NSAxMi41NSAyMS40CkwgMTYuNCAxNy4yNQpRIDE2LjYgMTcuMSAxNi42IDE2LjkgMTYuNiAxNi4yNSAxNS45NSAxNi4yNQpMIDE0IDE2LjI1ClEgMTMuNSAxMi4xNSAxNCA3LjkKTCAxNi4xNSA3LjkKUSAxNi41IDcuOSAxNi42IDcuNiAxNi42IDcuNTUgMTYuNiA3LjQ1IDE2LjYgNy4xNSAxNi4zNSA2Ljg1IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyBpZD0iTGF5ZXJfMyI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgo8L2c+Cgo8ZyBpZD0iYXN5bmNfc3ZnIj4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+CjwvZz4KPC9zdmc+Cg==";
  // PenguinMod used `static/blocks-media/repeat.svg` from the GUI; inlined so it shows everywhere.
  const RepeatIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9InJlcGVhdCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNCAyNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNDRjhCMTc7fQoJLnN0MXtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8dGl0bGU+cmVwZWF0PC90aXRsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIzLjMsMTFjLTAuMywwLjYtMC45LDEtMS41LDFoLTEuNmMtMC4xLDEuMy0wLjUsMi41LTEuMSwzLjZjLTAuOSwxLjctMi4zLDMuMi00LjEsNC4xCgljLTEuNywwLjktMy42LDEuMi01LjUsMC45Yy0xLjgtMC4zLTMuNS0xLjEtNC45LTIuM2MtMC43LTAuNy0wLjctMS45LDAtMi42YzAuNi0wLjYsMS42LTAuNywyLjMtMC4ySDdjMC45LDAuNiwxLjksMC45LDIuOSwwLjkKCXMxLjktMC4zLDIuNy0wLjljMS4xLTAuOCwxLjgtMi4xLDEuOC0zLjVoLTEuNWMtMC45LDAtMS43LTAuNy0xLjctMS43YzAtMC40LDAuMi0wLjksMC41LTEuMmw0LjQtNC40YzAuNy0wLjYsMS43LTAuNiwyLjQsMEwyMyw5LjIKCUMyMy41LDkuNywyMy42LDEwLjQsMjMuMywxMXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTIxLjgsMTFoLTIuNmMwLDEuNS0wLjMsMi45LTEsNC4yYy0wLjgsMS42LTIuMSwyLjgtMy43LDMuNmMtMS41LDAuOC0zLjMsMS4xLTQuOSwwLjhjLTEuNi0wLjItMy4yLTEtNC40LTIuMQoJYy0wLjQtMC4zLTAuNC0wLjktMC4xLTEuMmMwLjMtMC40LDAuOS0wLjQsMS4yLTAuMWwwLDBjMSwwLjcsMi4yLDEuMSwzLjQsMS4xczIuMy0wLjMsMy4zLTFjMC45LTAuNiwxLjYtMS41LDItMi42CgljMC4zLTAuOSwwLjQtMS44LDAuMi0yLjhoLTIuNGMtMC40LDAtMC43LTAuMy0wLjctMC43YzAtMC4yLDAuMS0wLjMsMC4yLTAuNGw0LjQtNC40YzAuMy0wLjMsMC43LTAuMywwLjksMEwyMiw5LjgKCWMwLjMsMC4zLDAuNCwwLjYsMC4zLDAuOVMyMiwxMSwyMS44LDExeiIvPgo8L3N2Zz4K";

  // PenguinMod-only: orderBlocks (which mixed PenguinMod's own core control blocks into this category),
  // argument alignments and the compiled versions of ifElseIf/ifElseIfElse/restartFromTheTop are dropped;
  // the JS implementations below run everywhere.
  class pmControlsExpansion {
    constructor() {
      this.runtime = Scratch.vm.runtime;
    }

    getInfo() {
      return {
        id: "pmControlsExpansion",
        name: "Controls Expansion",
        color1: "#FFAB19",
        color2: "#EC9C13",
        color3: "#CF8B17",
        isDynamic: true,
        blocks: [
          {
            opcode: "ifElseIf",
            text: ["if [CONDITION1] then", "else if [CONDITION2] then"],
            branchCount: 2,
            blockType: BlockType.CONDITIONAL,
            arguments: {
              CONDITION1: { type: ArgumentType.BOOLEAN },
              CONDITION2: { type: ArgumentType.BOOLEAN },
            },
          },
          {
            opcode: "ifElseIfElse",
            text: ["if [CONDITION1] then", "else if [CONDITION2] then", "else"],
            branchCount: 3,
            blockType: BlockType.CONDITIONAL,
            arguments: {
              CONDITION1: { type: ArgumentType.BOOLEAN },
              CONDITION2: { type: ArgumentType.BOOLEAN },
            },
          },
          {
            opcode: "asNewBroadcast",
            text: ["new thread", "[ICON]"],
            branchCount: 1,
            blockType: BlockType.CONDITIONAL,
            arguments: {
              ICON: {
                type: ArgumentType.IMAGE,
                dataURI: AsyncIcon,
              },
            },
          },
          {
            opcode: "restartFromTheTop",
            text: "restart from the top [ICON]",
            blockType: BlockType.COMMAND,
            isTerminal: true,
            arguments: {
              ICON: {
                type: ArgumentType.IMAGE,
                dataURI: RepeatIcon,
              },
            },
          },
          {
            opcode: "asNewBroadcastArgs",
            text: ["new thread with data [DATA]", "[ICON]"],
            branchCount: 1,
            blockType: BlockType.CONDITIONAL,
            arguments: {
              DATA: {
                type: ArgumentType.STRING,
                defaultValue: "abc",
                exemptFromNormalization: true,
              },
              ICON: {
                type: ArgumentType.IMAGE,
                dataURI: AsyncIcon,
              },
            },
          },
          {
            opcode: "asNewBroadcastArgBlock",
            text: "thread data",
            blockType: BlockType.REPORTER,
            allowDropAnywhere: true,
            disableMonitor: true,
          },
        ],
      };
    }

    ifElseIf(args, util) {
      const condition1 = Cast.toBoolean(args.CONDITION1);
      const condition2 = Cast.toBoolean(args.CONDITION2);
      if (condition1) {
        util.startBranch(1, false);
      } else if (condition2) {
        util.startBranch(2, false);
      }
    }

    ifElseIfElse(args, util) {
      const condition1 = Cast.toBoolean(args.CONDITION1);
      const condition2 = Cast.toBoolean(args.CONDITION2);
      if (condition1) {
        util.startBranch(1, false);
      } else if (condition2) {
        util.startBranch(2, false);
      } else {
        util.startBranch(3, false);
      }
    }

    restartFromTheTop(_, util) {
      // PenguinMod compiled this to `runtime._restartThread(thread); return;`.
      // Same here: swap in a fresh thread for this script and end the current one.
      this.runtime._restartThread(util.thread);
      util.thread.status = 4; // Thread.STATUS_DONE
    }

    // CubesterYT code probably
    asNewBroadcast(_, util) {
      if (util.thread.target.blocks.getBranch(util.thread.peekStack(), 0)) {
        util.sequencer.runtime._pushThread(
          util.thread.target.blocks.getBranch(util.thread.peekStack(), 0),
          util.target,
          {}
        );
      }
    }
    asNewBroadcastArgs(args, util) {
      const data = args.DATA;
      if (util.thread.target.blocks.getBranch(util.thread.peekStack(), 0)) {
        const thread = util.sequencer.runtime._pushThread(
          util.thread.target.blocks.getBranch(util.thread.peekStack(), 0),
          util.target,
          {}
        );

        thread.__controlx_asNewBroadcastArgs_data = data;
      }
    }
    asNewBroadcastArgBlock(_, util) {
      return util.thread.__controlx_asNewBroadcastArgs_data;
    }
  }

  Scratch.extensions.register(new pmControlsExpansion());
})(Scratch);
