// Name: XML
// ID: jwXml
// Description: Generate and read XML.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jw_xml
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("XML must run unsandboxed.");
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;

  class Extension {
      getInfo() {
          return {
              id: "jwXml",
              name: "XML",
              color1: "#ffbb3d",
              color2: "#cc9837",
              blocks: [
                  {
                      opcode: 'createNewXML',
                      text: "generate xml [ROOT] with:",
                      arguments: {
                          ROOT: {
                              type: ArgumentType.STRING,
                              defaultValue: "root"
                          }
                      },
                      blockType: BlockType.CONDITIONAL
                  },
                  {
                      opcode: 'addText',
                      text: "add text [TEXT]",
                      arguments: {
                          TEXT: {
                              type: ArgumentType.STRING,
                              defaultValue: "foo"
                          }
                      },
                      blockType: BlockType.COMMAND
                  },
                  {
                      opcode: 'addChild',
                      text: "add child [CHILD]",
                      arguments: {
                          CHILD: {}
                      },
                      blockType: BlockType.COMMAND
                  },
                  {
                      opcode: 'addAttribute',
                      text: "add attribute [ATT] as [TEXT]",
                      arguments: {
                          ATT: {
                              type: ArgumentType.STRING,
                              defaultValue: "foo"
                          },
                          TEXT: {
                              type: ArgumentType.STRING,
                              defaultValue: "bar"
                          }
                      },
                      blockType: BlockType.COMMAND
                  },
                  {
                      opcode: 'generated',
                      text: "xml generated",
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'clear',
                      text: "clear (ADVANCED)",
                      blockType: BlockType.COMMAND
                  },
                  "---",
                  {
                      opcode: 'getChild',
                      text: "get child [NUM] from [XML]",
                      arguments: {
                          NUM: {
                              type: ArgumentType.NUMBER,
                              defaultValue: 1
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'getNamed',
                      text: "get element [STR] from [XML]",
                      arguments: {
                          STR: {
                              type: ArgumentType.STRING,
                              defaultValue: "element"
                          }
                      },
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'getAttr',
                      text: "get attribute [ATT] from [XML]",
                      arguments: {
                          ATT: {
                              type: ArgumentType.STRING,
                              defaultValue: "attribute"
                          }
                      },
                      blockType: BlockType.REPORTER
                  }
              ]
          };
      }

      xmlsInGeneration = []

      _XMLToString(xml) {
          return xml.outerHTML
      }

      _StringToXML(str) {
          var div = document.createElement('div');
          div.innerHTML = str.trim();
          return div.firstChild;
      }

      createNewXML({ROOT}, util) {
          this.xmlsInGeneration.unshift(document.createElement(ROOT))
          util.startBranch(1, false)
      }

      addText({TEXT}) {
          this.xmlsInGeneration[0].append(TEXT)
      }

      addChild({CHILD}) {
          CHILD = this._StringToXML(CHILD)
          this.xmlsInGeneration[0].appendChild(CHILD)
      }

      addAttribute({ATT, TEXT}) {
          this.xmlsInGeneration[0].setAttribute(ATT, TEXT)
      }

      generated() {
          try {
              return this._XMLToString(this.xmlsInGeneration[0])
          } catch {
              return ""
          }
      }

      clear() {
          this.xmlsInGeneration.shift()
      }

      getChild({NUM, XML}) {
          try {
              NUM -= 1
              XML = this._StringToXML(XML)
              return ((typeof XML.childNodes[NUM]) !== 'string' ? this._XMLToString(XML.childNodes[NUM]) : XML.childNodes[NUM]) || ""
          } catch {
              return ""
          }
      }

      getNamed({STR, XML}) {
          try {
              XML = this._StringToXML(XML)
              return this._XMLToString(Array.from(XML.children).find((el) => el.localName == "".toLowerCase())) || ""
          } catch {
              return ""
          }
      }

      getAttr({ATT, XML}) {
          try {
              XML = this._StringToXML(XML)
              return XML.getAttribute(ATT) || ""
          } catch {
              return ""
          }
      }
  }


  Scratch.extensions.register(new Extension());
})(Scratch);
