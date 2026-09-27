// Name: Fast List Set
// Author: Mistium
// Description: Set Scratch list contents from JSON arrays.

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Set List must run unsandboxed.");
    }
  
    const vm = Scratch.vm;

    class SetListMist {
        constructor() {
            this.listVariable = '';
        }

        getInfo() {
            return {
                id: 'SetListMist',
                name: 'Set List',
                color1: '#1c2827',
                blocks: [
                    {
                        opcode: 'setlist',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set Selected List to [Array]',
                        arguments: {
                            Array: { type: Scratch.ArgumentType.STRING, defaultValue: '[]' }
                        },
                    },
                    {
                        opcode: 'selectlist',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Select List [Name]',
                        arguments: {
                            Name: { type: Scratch.ArgumentType.STRING, defaultValue: 'List Name' },
                        },
                    },
                    {
                        opcode: 'getlist',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Selected List As Array',
                    },
                ]
            }
        }
      setlist({ Array: json }) {
        const list = this.listVariable;
        if (!list) return;
        try {
          const parsed = JSON.parse(json);
          if (!Array.isArray(parsed)) return;
          list.value = parsed.map(item => typeof item === 'object' && item !== null ? JSON.stringify(item) : item);
          list._monitorUpToDate = false;
        } catch(e) {
          // skip
        }
      }

      selectlist({ Name }, util) {
          this.listVariable = util.target.lookupVariableByNameAndType(Scratch.Cast.toString(Name), "list");
      }

      getlist() {
          return this.listVariable ? JSON.stringify(this.listVariable.value) : '[]';
      }
    }
    Scratch.extensions.register(new SetListMist());
})(Scratch);
