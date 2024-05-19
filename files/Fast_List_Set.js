// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
(function (Scratch) {
    "use strict";
  
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
                ]
            }
        }
      setlist({ Array }, util) {
        try {
          Array = JSON.parse(Array);
          this.listVariable = Array;
        } catch(e) {
          // skip
        }
      }

      selectlist({ Name }, util) {
          this.listVariable = util.target.lookupVariableByNameAndType(Name, "list");
      }
    }
    Scratch.extensions.register(new SetListMist());
})(Scratch);
