// Name: IndexedDB and LocalStorage
// By: @mistium on discord
// Description: Access and write to IndexedDB.
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

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
      this.initializeDatabase(); // Re-initialize the database with the new name
    }

    initializeDatabase() {
      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log("IndexedDB initialized successfully!");
        this.initialised = true;
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        const objectStore = this.db.createObjectStore("data", {
          keyPath: "key"
        });
        console.log("IndexedDB upgrade complete!");
      };
    }

    isinitialised() {
      return this.initialised;
    }

    writeToDatabase({ VALUE, KEY }) {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      const transaction = this.db.transaction(["data"], "readwrite");
      const objectStore = transaction.objectStore("data");
      objectStore.put({
        key: cast.toString(KEY),
        value: cast.toString(VALUE)
      });
    }

    async readFromDatabase({ KEY }) {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.get(cast.toString(KEY));
        request.onsuccess = function (event) {
          resolve(event.target.result ? event.target.result.value : "");
        };
        request.onerror = function (event) {
          reject("Error reading from database");
        };
      });
    }

    async getAllKeys() {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.getAllKeys();
        request.onsuccess = function (event) {
          const keysArray = event.target.result;
          const keysJSON = JSON.stringify(keysArray); // Convert array to JSON string
          resolve(keysJSON);
        };
        request.onerror = function (event) {
          reject("Error getting keys from database");
        };
      });
    }

    async keyExists({ KEY }) {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      const keys = await this.getAllKeys();
      return keys.includes(cast.toString(KEY));
    }

    deleteFromDatabase({ KEY }) {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      const transaction = this.db.transaction(["data"], "readwrite");
      const objectStore = transaction.objectStore("data");
      try {
        objectStore.delete(cast.toString(KEY));
      } catch (error) {
        console.error("Error deleting key from database");
      }
    }

    async exportDatabaseAsJSON() {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      if (!this.db) {
        return Promise.reject("No database connection available");
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
          const data = event.target.result;
          try {
            const formattedData = {};
            data.forEach(entry => {
              formattedData[entry.key] = entry.value;
            });
            const jsonData = JSON.stringify(formattedData);
            resolve(jsonData);
          } catch (error) {
            reject("Error converting data to JSON");
          }
        };

        request.onerror = function (event) {
          reject("Error exporting database as JSON");
        };
      });
    }

    async importJSONToDatabase({ jsonData }) {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      if (!this.db) {
        return Promise.reject("No database connection available");
      }

      return new Promise((resolve, reject) => {
        try {
          const data = JSON.parse(cast.toString(jsonData));
          const transaction = this.db.transaction(["data"], "readwrite");
          const objectStore = transaction.objectStore("data");

          Object.keys(data).forEach(key => {
            objectStore.put({ key: key, value: data[key] });
          });

          transaction.oncomplete = function () {
            resolve("Data imported successfully");
          };

          transaction.onerror = function (event) {
            reject("Error importing data into database");
          };
        } catch (error) {
          reject("Error parsing JSON data");
        }
      });
    }

    async getDatabaseSize() {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      if (!this.db) {
        return Promise.reject("No database connection available");
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
          const data = event.target.result;
          try {
            const totalSize = data.reduce((acc, entry) => acc + entry.key.length + entry.value.length, 0);
            resolve(totalSize.toString());
          } catch (error) {
            reject("Error calculating database size");
          }
        };

        request.onerror = function (event) {
          reject("Error getting database size");
        };
      });
    }

    async getKeySize({ KEY }) {
      if (!this.initialised) {
        console.error("Database not initialised");
      }
      if (!this.db) {
        return Promise.reject("No database connection available");
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.get(cast.toString(KEY));

        request.onsuccess = function (event) {
          const entry = event.target.result;
          if (entry) {
            resolve((entry.key.length + entry.value.length).toString());
          } else {
            resolve("0");
          }
        };

        request.onerror = function (event) {
          reject("Error getting key size");
        };
      });
    }
  }

  Scratch.extensions.register(new IndexedDB());
})(Scratch);
