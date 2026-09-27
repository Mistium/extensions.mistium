// Name: IndexedDB and LocalStorage
// By: @mistium on discord
// Description: Access and write to IndexedDB.

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("IndexedDB must run unsandboxed.");
  }

  const cast = Scratch.Cast;

  function label(text) {
    return { blockType: Scratch.BlockType.LABEL, text: text };
  }

  class IndexedDB {
    constructor() {
      // Initialize IndexedDB
      this.dbName = "scratchDB"; // Default database name
      this.dbVersion = 1;
      this.db;
      this.initialised = false;
      this.initializeDatabase();
    }

    getInfo() {
      return {
        id: 'mistiumindexeddb',
        name: 'Indexed DB',
        color1: '#C65B5B',
        blocks: [
          {
            opcode: 'setDBName',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set database name to [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "scratchDB"
              }
            }
          },
          {
            opcode: 'writeToDatabase',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set key [KEY] to [VALUE]',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "value"
              },
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'deleteFromDatabase',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete value with key [KEY] from database',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'readFromDatabase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'read value [KEY]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'keyExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'key [KEY] exists in database?',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'clearDatabase',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete all keys from database'
          },
          label('database info'),
          {
            opcode: 'isinitialised',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is database initialised?',
          },
          {
            opcode: 'getDatabaseSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get size of database',
            disableMonitor: true
          },
          {
            opcode: 'getKeySize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get size of key [KEY]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'getAllKeys',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get all keys from database',
            disableMonitor: true
          },
          label('export and import'),
          {
            opcode: 'exportDatabaseAsJSON',
            blockType: Scratch.BlockType.REPORTER,
            text: 'export database as json',
            disableMonitor: true
          },
          {
            opcode: 'importJSONToDatabase',
            blockType: Scratch.BlockType.COMMAND,
            text: 'import [jsonData] into database',
            arguments: {
              jsonData: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "{}"
              }
            }
          }
        ]
      };
    }

    setDBName({ NAME }) {
      this.dbName = cast.toString(NAME);
      return this.initializeDatabase(); // Re-initialize the database with the new name
    }

    initializeDatabase() {
      const name = this.dbName;
      if (this.db) this.db.close();
      this.db = undefined;
      this.initialised = false;
      this.ready = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(name, this.dbVersion);

        request.onerror = function (event) {
          console.error("IndexedDB error:", event.target.error);
          reject("Error opening database");
        };

        request.onsuccess = (event) => {
          // A newer setDBName call won the race, drop this connection
          if (name !== this.dbName) {
            event.target.result.close();
            resolve();
            return;
          }
          this.db = event.target.result;
          console.log("IndexedDB initialized successfully!");
          this.initialised = true;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("data")) {
            db.createObjectStore("data", {
              keyPath: "key"
            });
          }
          console.log("IndexedDB upgrade complete!");
        };
      });
      this.ready.catch(() => {});
      return this.ready;
    }

    // Runs fn(objectStore) in a transaction, resolving with the request result
    // (or undefined for a readwrite transaction once it has committed).
    async _run(mode, fn, errorMessage) {
      let ready;
      do {
        ready = this.ready;
        await ready;
      } while (ready !== this.ready);
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], mode);
        const request = fn(transaction.objectStore("data"));
        if (mode === "readwrite") {
          transaction.oncomplete = () => resolve();
        } else {
          request.onsuccess = () => resolve(request.result);
        }
        transaction.onerror = transaction.onabort = () => reject(errorMessage);
      });
    }

    // Fire-and-forget write once open, so loops don't yield a frame per write.
    // Later transactions on the same store still see it (IndexedDB orders them).
    _write(fn, errorMessage) {
      if (!this.initialised) return this._run("readwrite", fn, errorMessage);
      const transaction = this.db.transaction(["data"], "readwrite");
      fn(transaction.objectStore("data"));
      transaction.onerror = () => console.error(errorMessage);
    }

    _toValue(value) {
      return typeof value === "object" && value !== null ? JSON.stringify(value) : cast.toString(value);
    }

    isinitialised() {
      return this.initialised;
    }

    writeToDatabase({ VALUE, KEY }) {
      return this._write(store => store.put({
        key: cast.toString(KEY),
        value: cast.toString(VALUE)
      }), "Error writing to database");
    }

    async readFromDatabase({ KEY }) {
      const entry = await this._run("readonly", store => store.get(cast.toString(KEY)), "Error reading from database");
      return entry ? entry.value : "";
    }

    async getAllKeys() {
      const keys = await this._run("readonly", store => store.getAllKeys(), "Error getting keys from database");
      return JSON.stringify(keys);
    }

    async keyExists({ KEY }) {
      const count = await this._run("readonly", store => store.count(cast.toString(KEY)), "Error checking key");
      return count > 0;
    }

    deleteFromDatabase({ KEY }) {
      return this._write(store => store.delete(cast.toString(KEY)), "Error deleting key from database");
    }

    clearDatabase() {
      return this._run("readwrite", store => store.clear(), "Error clearing database");
    }

    async exportDatabaseAsJSON() {
      const data = await this._run("readonly", store => store.getAll(), "Error exporting database as JSON");
      const formattedData = {};
      data.forEach(entry => {
        formattedData[entry.key] = entry.value;
      });
      return JSON.stringify(formattedData);
    }

    async importJSONToDatabase({ jsonData }) {
      let data;
      try {
        data = JSON.parse(cast.toString(jsonData));
      } catch (error) {
        return;
      }
      if (typeof data !== "object" || data === null) return;

      return this._run("readwrite", store => {
        Object.keys(data).forEach(key => {
          store.put({ key: key, value: this._toValue(data[key]) });
        });
      }, "Error importing data into database");
    }

    async getDatabaseSize() {
      const data = await this._run("readonly", store => store.getAll(), "Error getting database size");
      const totalSize = data.reduce((acc, entry) => acc + entry.key.length + String(entry.value).length, 0);
      return totalSize.toString();
    }

    async getKeySize({ KEY }) {
      const entry = await this._run("readonly", store => store.get(cast.toString(KEY)), "Error getting key size");
      return entry ? (entry.key.length + String(entry.value).length).toString() : "0";
    }
  }

  Scratch.extensions.register(Scratch.vm.runtime.ext_MistiumIDB = new IndexedDB());
})(Scratch);
