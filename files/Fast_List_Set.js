// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
(function (Scratch) {
    "use strict";
  
    const vm = Scratch.vm;

    class SetListMist {
        constructor() {
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
                        text: 'Set List [Name] to [Array]',
                        arguments: {
                            Name: { type: Scratch.ArgumentType.STRING, defaultValue: 'List Name' },
                            Array: { type: Scratch.ArgumentType.STRING, defaultValue: 'List Name' }
                        },
                    },
                ]
            }
        }
      setlist({ Name, Array }, util) {
        try {
          let listVariable = util.target.lookupVariableByNameAndType(Name, "list");
          Array = JSON.parse(Array);
          listVariable.value = Array;
        } catch(e) {
          // skip
        }
      }
    }
    Scratch.extensions.register(new SetListMist());
})(Scratch);
