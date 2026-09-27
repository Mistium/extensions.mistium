// Name: Assets
// ID: jwStorage
// Description: Read extra files stored in the project's extraAssets folder.
// By: jwklong
// Needs: Array (jwArray)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jwStorage
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Assets must run unsandboxed.");
  const { BlockType, ArgumentType, Cast } = Scratch;
  const vm = Scratch.vm;

  // PenguinMod's VM keeps the loaded .sb3 as vm._projectZip and copies its extraAssets/ folder into saved projects.
  // Elsewhere, wrap loadProject/_saveProjectZip once to do the same.
  // ponytail: a project that loads this extension while it is loading was already unzipped, so its extraAssets
  // are only visible after the project is loaded again with the extension present (e.g. reload / packaged player).
  if (!("_projectZip" in vm) && !vm.jwStorageShim && vm.exports?.JSZip) {
    vm.jwStorageShim = true;
    const JSZip = vm.exports.JSZip;
    const loadProject = vm.loadProject;
    vm.loadProject = async function (input, ...rest) {
      try {
        this._projectZip = input instanceof ArrayBuffer || ArrayBuffer.isView(input) ? await JSZip.loadAsync(input) : undefined;
      } catch (e) {
        this._projectZip = undefined; // not a zip (project.json / sb1)
      }
      return loadProject.call(this, input, ...rest);
    };
    const saveProjectZip = vm._saveProjectZip;
    if (typeof saveProjectZip === "function") {
      vm._saveProjectZip = function (...args) {
        const zip = saveProjectZip.apply(this, args);
        if (this._projectZip) {
          for (const [name, file] of Object.entries(this._projectZip.files)) {
            if (name.startsWith("extraAssets/")) zip.files[name] = file;
          }
        }
        return zip;
      };
    }
  }

  // Needs: jwArray. Read lazily so this works whichever extension loads first.
  const arrayBlock = () => vm.jwArray?.Block ?? { blockType: BlockType.REPORTER, disableMonitor: true };
  const newArray = (items) => (vm.jwArray ? new vm.jwArray.Type(items) : "");
  const hasAssets = () => !!(vm._projectZip && vm._projectZip.files["extraAssets/"]);

  class Extension {
    getInfo() {
      return {
        id: "jwStorage",
        name: "Assets",
        color1: "#6f6df0",
        menuIconURI:
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+CiAgPGNpcmNsZSBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAyOyBwYWludC1vcmRlcjogc3Ryb2tlOyBzdHJva2U6IHJnYig4OCwgODcsIDE5Mik7IGZpbGw6IHJnYigxMTEsIDEwOSwgMjQwKTsiIGN4PSIxMCIgY3k9IjEwIiByPSI5Ij48L2NpcmNsZT4KICA8cGF0aCBkPSJNIDYuOTA2IDMuODEzIEMgNi4wNTMgMy44MTMgNS4zNiA0LjUwNiA1LjM2IDUuMzYgTCA1LjM2IDE0LjY0IEMgNS4zNiAxNS40OTQgNi4wNTMgMTYuMTg3IDYuOTA2IDE2LjE4NyBMIDEzLjA5NCAxNi4xODcgQyAxMy45NDcgMTYuMTg3IDE0LjY0IDE1LjQ5NCAxNC42NCAxNC42NCBMIDE0LjY0IDkuMjI3IEMgMTQuNjQgOC43MTIgMTQuMzgyIDguMTk1IDEzLjg2NyA3LjY4IEwgMTAuNzczIDQuNTg2IEMgMTAuMjU4IDQuMDcxIDkuNzQyIDMuODEzIDkuMjI3IDMuODEzIEwgNi45MDYgMy44MTMgWiBNIDguNDUzIDYuMTMzIEMgOC40NTMgNS4xMDEgOC45NjggNS4xMDEgMTAgNi4xMzMgTCAxMi4zMiA4LjQ1MyBDIDEzLjM1MiA5LjQ4NSAxMy4zNTIgMTAgMTIuMzIgMTAgTCAxMCAxMCBDIDkuMTQ2IDEwIDguNDUzIDkuMzA3IDguNDUzIDguNDUzIEwgOC40NTMgNi4xMzMgWiIgZmlsbD0iI2ZmZiIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsiPjwvcGF0aD4KPC9zdmc+",
        blocks: [
          {
            opcode: "getFile",
            text: "get file [NAME] as [TYPE]",
            blockType: BlockType.REPORTER,
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: "file.txt" },
              TYPE: { menu: "fileExportType", defaultValue: "text" },
            },
          },
          {
            opcode: "fileExists",
            text: "file/directory [NAME] exists?",
            blockType: BlockType.BOOLEAN,
            arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "file.txt" } },
          },
          "---",
          { opcode: "getAllFiles", text: "get all files", ...arrayBlock() },
          { opcode: "getAllDirectories", text: "get all directories", ...arrayBlock() },
          {
            opcode: "getFilesInFolder",
            text: "get files in directory [NAME]",
            arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "folder" } },
            ...arrayBlock(),
          },
          {
            opcode: "getSubdirs",
            text: "get folders in directory [NAME]",
            arguments: { NAME: { type: ArgumentType.STRING, defaultValue: "folder" } },
            ...arrayBlock(),
          },
        ],
        menus: {
          fileExportType: ["text", "base64"],
        },
      };
    }

    async getFile({ NAME, TYPE }) {
      if (!hasAssets()) return "";

      NAME = Cast.toString(NAME);
      TYPE = Cast.toString(TYPE);

      let file = vm._projectZip.folder("extraAssets").file(NAME);
      if (!file) return "";

      switch (TYPE) {
        case "text":
          return await file.async("text");
        case "base64":
          return await file.async("base64");
        default:
          return "";
      }
    }

    fileExists({ NAME }) {
      if (!hasAssets()) return "";

      NAME = Cast.toString(NAME);
      if (NAME.endsWith("/")) NAME = NAME.substring(0, NAME.length - 1);

      return !!(vm._projectZip.files[`extraAssets/${NAME}/`] || vm._projectZip.folder("extraAssets").file(NAME));
    }

    getAllFiles() {
      if (!hasAssets()) return newArray([]);

      return newArray(
        Object.values(vm._projectZip.files)
          .filter((v) => v.name.startsWith("extraAssets/") && !v.dir)
          .map((v) => v.name.substring(12))
      );
    }

    getAllDirectories() {
      if (!hasAssets()) return newArray([]);

      return newArray(
        Object.values(vm._projectZip.files)
          .filter((v) => v.name.startsWith("extraAssets/") && v.dir && v.name !== "extraAssets/")
          .map((v) => v.name.substring(12))
      );
    }

    getFilesInFolder({ NAME }) {
      if (!hasAssets()) return newArray([]);

      NAME = Cast.toString(NAME);
      if (!NAME.endsWith("/")) NAME += "/";

      let rootFolder = NAME == "/" ? `extraAssets/` : `extraAssets/${NAME}`;
      let depth = rootFolder.split("/").length;
      return newArray(
        Object.values(vm._projectZip.files)
          .filter((v) => v.name.startsWith(rootFolder) && v.name.split("/").length == depth && !v.dir)
          .map((v) => v.name.substring(12))
      );
    }

    getSubdirs({ NAME }) {
      if (!hasAssets()) return newArray([]);

      NAME = Cast.toString(NAME);
      if (!NAME.endsWith("/")) NAME += "/";

      let rootFolder = NAME == "/" ? `extraAssets/` : `extraAssets/${NAME}`;
      let depth = rootFolder.split("/").length;
      return newArray(
        Object.values(vm._projectZip.files)
          .filter((v) => v.name.startsWith(rootFolder) && v.name.split("/").length == depth + 1 && v.dir)
          .map((v) => v.name.substring(12))
      );
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
