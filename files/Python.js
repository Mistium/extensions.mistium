// ID: Python
// Author: Mistium

(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Python must be unsandboxed");
  }

  async function setupPyodide() {
    if (typeof pyodide === 'undefined') {
      const languagePluginLoader = import('https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js');
      const pyodideUrl = 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/';
      await languagePluginLoader;
      pyodide = await loadPyodide({ indexURL: pyodideUrl });
    }
  }

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
            blockType: Scratch.BlockType.LABEL,
            text: 'Python Will Not Work When Offline! It will not be able to download the package from the internet.',
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
            opcode: 'runPy',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Run Python [CODE]',
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
          {
            opcode: 'evalPy',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Eval Python [CODE]',
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

    async runPyAsync({ CODE }) {
      try {
        await this.redirectOutput(async () => await pyodide.runPythonAsync(CODE));
        return this.output;
      } catch (error) {
        console.error("Error:", error);
      }
    }

    runPy({ CODE }) {
      try {
        this.redirectOutput(() => pyodide.runPython(CODE));
        return this.output;
      } catch (error) {
        console.error("Error:", error);
      }
    }

    async evalPyAsync({ CODE }) {
      try {
        return await pyodide.runPythonAsync(CODE);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    evalPy({ CODE }) {
      try {
        return pyodide.runPython(CODE)
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
      try {
        return pyodide.loadPackage(PACKAGE);
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
