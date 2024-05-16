// Name: Python
// I made the best scratch extension :D
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Python must be unsandboxed");
    }
    async function setupPyodide() {
        if (navigator.onLine) {
            try {
                const response = await Scratch.fetch("https://corsproxy.io/?url=https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");
                const scriptText = await response.text();
                const scriptElement = document.createElement(('script'));
                scriptElement.textContent = scriptText;
                document.body.appendChild(scriptElement);
                scriptElement.id = "EvalPlus_pyodide";
                // Assuming pyodide.js defines pyodide object globally
                // You can check if pyodide object is available
            } catch (e) {
                alert(e);
            }
        } else {
            alert("You must be online to import Python.");
        }
    }


    class Python {
        constructor() {
            this.enabled = true; // Eval is enabled by default
            this.pythonLoaded = false;
            setupPyodide()
        }

        getInfo() {
            return {
                id: 'MistiumPython',
                name: 'Python',
                color1: '#b58707',
                blocks: [
                    {
                        opcode: 'runPyAsync',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Python Async [CODE]',
                        arguments: {
                            CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                        },
                    },
                    {
                        opcode: 'runPy',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Python Eval [CODE]',
                        arguments: {
                            CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                        },
                    },
                    {
                        opcode: 'getvar',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get Variable [NAME]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                        },
                    },
                    {
                        opcode: 'resetvars',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Reset Variables',
                    }
                ]
            };
        }

        runPyAsync({ CODE }) {
            try {
                return pyodide.runPythonAsync(CODE);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        runPy({ CODE }) {
            try {
                return pyodide.runPython(CODE);
            } catch (error) {
                console.error("Error:", error);
            }
        }

      resetvars() {
            try {
                pyodide.globals = {};
            } catch (error) {
                console.error("Error:", error);
            }
        }
      
      getvar({ NAME }) {
        try {
          if (typeof pyodide === 'undefined') {
            throw new Error("Pyodide object not found.");
          }
          return pyodide.globals[NAME];
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      }
    }

    Scratch.extensions.register(new Python());
})(Scratch);
