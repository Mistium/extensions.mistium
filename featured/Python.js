// Name: Python
// Author: Mistium
// Description: Run python in turbowarp with piodide

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Python must be unsandboxed");
  }

  async function setupPyodide() {
    if (typeof pyodide === 'undefined') {
      const languagePluginLoader = import('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js');
      const pyodideUrl = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/';
      await languagePluginLoader;
      pyodide = await loadPyodide({ indexURL: pyodideUrl });
    }
  }

  const Cast = Scratch.Cast;

  class Python {
    constructor() {
      this.output = '';
      if (navigator.onLine) {
        setupPyodide();
      }
    }

    getInfo() {
      return {
        id: 'MistiumPython',
        name: 'Python',
        color1: '#b58707',
        blocks: [
          {
            func: 'popup',
            blockType: Scratch.BlockType.BUTTON,
            text: 'OFFLINE WARNING',
          },
          {
            opcode: 'runPyAsync',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Run Python Async [CODE]',
            arguments: {
              CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            },
          },
          {
            opcode: 'evalPyAsync',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Eval Python Async [CODE]',
            arguments: {
              CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            }
          },
          "---",
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
          },
          "---",
          {
            opcode: 'loadPackage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Load Package [PACKAGE]',
            arguments: {
              PACKAGE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            },
          }
        ]
      };
    }

    popup() {
      alert("Python Will Not Work When Offline! It will not be able to download the package from the internet.")
    }
    
    async runPyAsync({ CODE }) {
      CODE = Cast.toString(CODE);
      try {
        await this.redirectOutput(async () => await pyodide.runPythonAsync(CODE));
        return this.output;
      } catch (error) {
        console.error("Error:", error);
      }
    }
    
    async evalPyAsync({ CODE }) {
      CODE = Cast.toString(CODE);
      try {
        return await pyodide.runPythonAsync(CODE);
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

    loadPackage({ PACKAGE }) {
      PACKAGE = Cast.toString(PACKAGE);
      try {
        return pyodide.loadPackage(PACKAGE);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getvar({ NAME }) {
      NAME = Cast.toString(NAME);
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

    async redirectOutput(func) {
      try {
        // Redirect stdout and stderr
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
        `);

        // Run the provided function
        await func();

        // Get the captured output
        this.output = pyodide.runPython(`
output = sys.stdout.getvalue() + sys.stderr.getvalue()
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
output
        `);
      } catch (error) {
        console.error("Error in redirectOutput:", error);
      }
    }
  }

  Scratch.extensions.register(new Python());
})(Scratch);
