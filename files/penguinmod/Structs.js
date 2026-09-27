// Name: Structs
// ID: jwStructs
// Description: Simple classes and objects.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jw_structs
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Structs must run unsandboxed.");
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const formatMessage = (m) => (typeof m === "string" ? m : m.default);

  /**
   * Class for Structs
   * @constructor
   */

  class jwStructs {
      constructor() {
          console.log("Welcome to the OOP extension!");
          /**
           * The runtime instantiating this block package.
           * @type {Runtime}
           */
          this.runtime = Scratch.vm.runtime;
          this.classes = {};
          this.objects = {};
      }

      /**
       * @returns {object} metadata for this extension and its blocks.
       */
      getInfo() {
          console.log("Getting info for the OOP extension!");
          return {
              id: 'jwStructs',
              name: 'Structs',
              color1: '#7ddcff',
              color2: '#4a98ff',
              blocks: [
                  {
                      opcode: 'createClass',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.createClass',
                          default: 'Create class [NAME]',
                          description: 'Create a class'
                      }),
                      arguments: {
                          NAME: {
                              type: ArgumentType.STRING,
                              defaultValue: 'MyClass'
                          }
                      }
                  },
                  {
                      opcode: 'createClassProperty',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.createClassProperty',
                          default: 'Create class property [NAME] with value [VALUE] in class [CLASS]',
                          description: 'Create a class property'
                      }),
                      arguments: {
                          NAME: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myProperty'
                          },
                          VALUE: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myValue'
                          },
                          CLASS: {
                              type: ArgumentType.STRING,
                              defaultValue: 'MyClass'
                          }
                      }
                  },
                  "---",
                  {
                      opcode: 'newObject',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.newObject',
                          default: 'Create object [NAME] from class [CLASS]',
                          description: 'Create a new object'
                      }),
                      arguments: {
                          NAME: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myObject'
                          },
                          CLASS: {
                              type: ArgumentType.STRING,
                              defaultValue: 'MyClass'
                          }
                      }
                  },
                  {
                      opcode: 'setObjectProperty',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.setObjectProperty',
                          default: 'Set property [PROPERTY] of object [OBJECT] to [VALUE]',
                          description: 'Set a property of an object'
                      }),
                      arguments: {
                          PROPERTY: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myProperty'
                          },
                          OBJECT: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myObject'
                          },
                          VALUE: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myValue'
                          }
                      }
                  },
                  {
                      opcode: 'returnObjectProperty',
                      blockType: BlockType.REPORTER,
                      text: formatMessage({
                          id: 'jwStructs.returnObjectProperty',
                          default: 'Property [PROPERTY] of object [OBJECT]',
                          description: 'Return a property of an object'
                      }),
                      arguments: {
                          PROPERTY: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myProperty'
                          },
                          OBJECT: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myObject'
                          }
                      }
                  },
                  "---",
                  {
                      opcode: 'createClassMethod',
                      blockType: BlockType.HAT,
                      text: formatMessage({
                          id: 'jwStructs.createClassMethod',
                          default: 'When method [NAME] is called in class [CLASS]',
                          description: 'Create a class method'
                      }),
                      arguments: {
                          NAME: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myMethod'
                          },
                          CLASS: {
                              type: ArgumentType.STRING,
                              defaultValue: 'MyClass'
                          }
                      }
                  },
                  {
                      opcode: 'callObjectMethod',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.callObjectMethod',
                          default: 'Call method [NAME] of object [OBJECT]',
                          description: 'Call a method of an object'
                      }),
                      arguments: {
                          NAME: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myMethod'
                          },
                          OBJECT: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myObject'
                          }
                      }
                  },
                  "---",
                  {
                      opcode: 'deleteClasses',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.deleteClasses',
                          default: 'Delete all classes',
                          description: 'Delete all classes'
                      })
                  },
                  {
                      opcode: 'deleteObjects',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.deleteObjects',
                          default: 'Delete all objects',
                          description: 'Delete all objects'
                      })
                  },
                  {
                      opcode: 'deleteClass',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.deleteClass',
                          default: 'Delete class [CLASS]',
                          description: 'Delete a class'
                      }),
                      arguments: {
                          CLASS: {
                              type: ArgumentType.STRING,
                              defaultValue: 'MyClass'
                          }
                      }
                  },
                  {
                      opcode: 'deleteObject',
                      blockType: BlockType.COMMAND,
                      text: formatMessage({
                          id: 'jwStructs.deleteObject',
                          default: 'Delete object [OBJECT]',
                          description: 'Delete an object'
                      }),
                      arguments: {
                          OBJECT: {
                              type: ArgumentType.STRING,
                              defaultValue: 'myObject'
                          }
                      }
                  }
              ]
          };
      }

      createClass(args,util) {
          var name = args.NAME;
          if (name in this.classes) {
              return;
          }
          this.classes[name] = {
              properties: {},
              methods: {}
          };
      }

      createClassProperty(args,util) {
          var name = args.NAME;
          var value = args.VALUE;
          var className = args.CLASS;
          if (className in this.classes) {
              this.classes[className].properties[name] = value;
          }
      }

      newObject(args,util) {
          var name = args.NAME;
          var className = args.CLASS;
          if (className in this.classes) {
              this.objects[name] = this.classes[className];
          }
      }

      setObjectProperty(args,util) {
          var property = args.PROPERTY;
          var object = args.OBJECT;
          var value = args.VALUE;
          if (object in this.objects) {
              this.objects[object].properties[property] = value;
          }
      }

      returnObjectProperty(args,util) {
          var property = args.PROPERTY;
          var object = args.OBJECT;
          if (object in this.objects) {
              return this.objects[object].properties[property];
          }
      }

      createClassMethod(args,util) {
          var name = args.NAME;
          var className = args.CLASS;
          if (className in this.classes) {
              this.classes[className].methods[name] = util.stackFrame;
          }
      }

      callObjectMethod(args,util) {
          var name = args.NAME;
          var object = args.OBJECT;
          if (object in this.objects) {
              var method = this.objects[object].methods[name];
              if (method) {
                  util.startBranch(1,method);
              }
          }
      }

      deleteClasses(args,util) {
          this.classes = {};
      }

      deleteObjects(args,util) {
          this.objects = {};
      }

      deleteClass(args,util) {
          var className = args.CLASS;
          if (className in this.classes) {
              delete this.classes[className];
          }
      }

      deleteObject(args,util) {
          var object = args.OBJECT;
          if (object in this.objects) {
              delete this.objects[object];
          }
      }
  }


  Scratch.extensions.register(new jwStructs());
})(Scratch);
