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

  let pyodide;
  let pyodidePromise = null;

  // shared by every block, so nothing runs before pyodide exists; retries after a failed load
  function setupPyodide() {
    if (!pyodidePromise && globalThis.pyodide) {
      pyodide = globalThis.pyodide;
      pyodidePromise = Promise.resolve(pyodide);
    }
    if (!pyodidePromise) {
      const pyodideUrl = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/';
      pyodidePromise = import(pyodideUrl + 'pyodide.js')
        .then(() => loadPyodide({ indexURL: pyodideUrl }))
        .then((py) => (pyodide = globalThis.pyodide = py))
        .catch((error) => {
          pyodidePromise = null;
          throw error;
        });
    }
    return pyodidePromise;
  }

  const Cast = Scratch.Cast;

  // PyProxy -> JSON, None/undefined -> "", primitives unchanged
  function toScratch(value) {
    if (value === undefined || value === null) return '';
    if (typeof value === 'object' && typeof value.toJs === 'function') {
      try {
        return JSON.stringify(value.toJs({ dict_converter: Object.fromEntries }));
      } catch {
        return String(value);
      } finally {
        if (typeof value.destroy === 'function') value.destroy();
      }
    }
    return value;
  }

  class Python {
    constructor() {
      this.output = '';
      if (navigator.onLine) {
        setupPyodide().catch((error) => console.error("Error:", error));
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
            opcode: 'setvar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Variable [NAME] to [VALUE]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            },
          },
          {
            opcode: 'resetvars',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Reset Variables',
          },
          "---",
          {
            opcode: 'isLoaded',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Python Loaded?',
          },
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
        await setupPyodide();
      } catch (error) {
        console.error("Error:", error);
        return '';
      }
      await this.redirectOutput(async () => await pyodide.runPythonAsync(CODE));
      return this.output;
    }
    
    async evalPyAsync({ CODE }) {
      CODE = Cast.toString(CODE);
      try {
        await setupPyodide();
        return toScratch(await pyodide.runPythonAsync(CODE));
      } catch (error) {
        console.error("Error:", error);
        return '';
      }
    }
    
    async resetvars() {
      try {
        await setupPyodide();
        // pyodide.globals is a proxy of __main__'s dict; clear user names in place, keep dunders
        pyodide.runPython("[globals().pop(k) for k in list(globals()) if not k.startswith('__')]");
      } catch (error) {
        console.error("Error:", error);
      }
    }

    async loadPackage({ PACKAGE }) {
      PACKAGE = Cast.toString(PACKAGE);
      try {
        await setupPyodide();
        await pyodide.loadPackage(PACKAGE);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    async getvar({ NAME }) {
      NAME = Cast.toString(NAME);
      try {
        await setupPyodide();
        return toScratch(pyodide.globals.get(NAME));
      } catch (error) {
        console.error("Error:", error);
        return '';
      }
    }

    async setvar({ NAME, VALUE }) {
      NAME = Cast.toString(NAME);
      try {
        await setupPyodide();
        pyodide.globals.set(NAME, VALUE);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    isLoaded() {
      return pyodide !== undefined;
    }

    async redirectOutput(func) {
      // Redirect stdout and stderr
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);
      let errorText = '';
      try {
        // Run the provided function
        await func();
      } catch (error) {
        // Python exceptions carry the traceback in their message
        errorText = String(error && error.message ? error.message : error);
        console.error("Error:", error);
      } finally {
        // Get the captured output and always restore the real streams
        this.output = pyodide.runPython("import sys\nsys.stdout.getvalue() + sys.stderr.getvalue()") + errorText;
        pyodide.runPython("import sys\nsys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__");
      }
    }
  }

  Scratch.extensions.register(new Python());
})(Scratch);
