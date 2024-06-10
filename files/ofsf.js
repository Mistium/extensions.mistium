class OFSFExtension {
  constructor() {
      this.ofsf = {};
  }

  getInfo() {
      return {
          id: 'ofsfExtension',
          name: 'OFSF Extension',
          blocks: [
              {
                  opcode: 'generateUUID',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Generate UUID',
              },
              {
                  opcode: 'loadOFSF',
                  blockType: Scratch.BlockType.COMMAND,
                  text: 'Load OFSF data [DATA]',
                  arguments: {
                      DATA: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: '[]',
                      },
                  },
              },
              {
                  opcode: 'searchFiles',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Search files by [SEARCH_TYPE] for [SEARCH_TERM]',
                  arguments: {
                      SEARCH_TERM: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'example',
                      },
                      SEARCH_TYPE: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'name',
                      },
                  },
              },
              {
                  opcode: 'getFileMetadata',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get metadata for file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'listAllFiles',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'List all files',
              },
              {
                  opcode: 'newFile',
                  blockType: Scratch.BlockType.COMMAND,
                  text: 'Create new file [NAME] of type [TYPE] in folder [FOLDER_UUID] with data [DATA]',
                  arguments: {
                      NAME: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'newFile',
                      },
                      TYPE: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: '.txt',
                      },
                      FOLDER_UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'folderUuid',
                      },
                      DATA: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: '',
                      },
                  },
              },
              {
                  opcode: 'deleteFile',
                  blockType: Scratch.BlockType.COMMAND,
                  text: 'Delete file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'setfileData',
                  blockType: Scratch.BlockType.COMMAND,
                  text: 'Set data for file [UUID] to [DATA]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                      DATA: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: '',
                      },
                  },
              },
              {
                  opcode: 'setfileentry',
                  blockType: Scratch.BlockType.COMMAND,
                  text: 'Set [ITEM] for file [UUID] to [DATA]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                      ITEM: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'item',
                      },
                      DATA: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: '',
                      },
                  },
              },
              {
                  opcode: 'getFileSize',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get size of file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'uuidToPath',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get path for file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'pathToUuid',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get UUID for path [PATH]',
                  arguments: {
                      PATH: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'path',
                      },
                  },
              },
              {
                  opcode: 'getFolderContents',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get contents of folder [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'uuidToFileName',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get name of file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'getFile',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'getFileItem',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get [ITEM] of file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                      ITEM: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'item',
                      },
                  },
              },
              {
                  opcode: 'getFilePath',
                  blockType: Scratch.BlockType.REPORTER,
                  text: 'Get path of file [UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                  },
              },
              {
                  opcode: 'moveFile',
                  blockType: Scratch.BlockType.COMMAND,
                  text: 'Move file [UUID] to folder [FOLDER_UUID]',
                  arguments: {
                      UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'uuid',
                      },
                      FOLDER_UUID: {
                          type: Scratch.ArgumentType.STRING,
                          defaultValue: 'folderUuid',
                      },
                  },
              },
          ],
      };
  }

  generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  }

  loadOFSF(args) {
      const data = JSON.parse(args.DATA);
      this.ofsf = {};
      for (let i = 13; i < data.length; i += 14) {
          if (data[0] === ".folder") {
              data[3] = JSON.parse(data[3]);
          }
          this.ofsf[data[13]] = data.splice(0, 14);
      }
  }

  searchFiles(args) {
      const results = [];
      const searchTerm = args.SEARCH_TERM.toLowerCase();
      const searchType = args.SEARCH_TYPE.toLowerCase();

      for (let key in this.ofsf) {
          if (searchType === 'name' && this.ofsf[key][1].toLowerCase().includes(searchTerm)) {
              results.push(this.ofsf[key][13]);
          } else if (searchType === 'type' && this.ofsf[key][0].toLowerCase() === searchTerm) {
              results.push(this.ofsf[key][13]);
          }
      }
      return JSON.stringify(results);
  }

  getFileMetadata(args) {
      const uuid = args.UUID;
      if (!this.ofsf[uuid]) {
          return '{}';
      }
      const fileData = this.ofsf[uuid];
      const metadata = {
          path: fileData[2] + "/" + fileData[1] + fileData[0],
          x: fileData[5],
          y: fileData[6],
          created: new Date(fileData[8]).toString(),
          edited: new Date(fileData[9]).toString(),
          icon: fileData[10],
          size: this.getFileSize(uuid),
          permissions: fileData[12],
      };
      return JSON.stringify(metadata);
  }


  listAllFiles() {
      return JSON.stringify(Object.keys(this.ofsf));
  }

  newFile(args) {
      const uuid = this.generateUUID();
      const folderUuid = args.FOLDER_UUID;
      const fileData = [
          args.TYPE,
          args.NAME,
          this.uuidToPath(folderUuid).split(".")[0],
          args.DATA,
          null,
          0,
          0,
          0,
          Date.now(),
          Date.now(),
          null,
          0,
          '["File Viewer","File Editor"]',
          uuid,
      ];
      this.ofsf[uuid] = fileData;
      this.ofsf[folderUuid][3].push(uuid);
      return uuid;
  }

  deleteFile(args) {
      const uuid = args.UUID;
      if (!this.ofsf[uuid]) {
          return;
      }
      const folderUuid = this.pathToUuid(this.ofsf[uuid][2] + ".folder");
      const index = this.ofsf[folderUuid][3].indexOf(uuid);
      if (index > -1) {
          this.ofsf[folderUuid][3].splice(index, 1);
      }

      if (this.ofsf[uuid][0] === ".folder") {
          for (const fileUuid of this.ofsf[uuid][3]) {
              this.deleteFile({ UUID: fileUuid });
          }
      }
      delete this.ofsf[uuid];
  }

  setfileData(args) {
      const uuid = args.UUID;
      if (!this.ofsf[uuid]) {
          return;
      }
      this.ofsf[uuid][3] = args.DATA;
  }

  setfileentry(args) {
      const uuid = args.UUID;
      if (!this.ofsf[uuid]) {
          return;
      }
      this.ofsf[uuid][args.ITEM] = args.DATA;
  }
  getFileSize(uuid) {
      const data = this.ofsf[uuid];
      let out = 0;
      for (let i = 0; i < (this.ofsf[uuid] || []).length; i++) {
          out += ((""+data[i]).length || 0);
      }
      return out;
  }

  uuidToPath({uuid}) {
      return this.ofsf[uuid][2] + "/" + this.ofsf[uuid][1] + this.ofsf[uuid][0];
  }

  pathToUuid({path}) {
      path = path.toLowerCase();
      for (let key in this.ofsf) {
          let current = this.ofsf[key];
          let currentPath = current[2] + "/" + current[1] + current[0];
          if (currentPath.toLowerCase() === path) {
              return key;
          }
      }
      return null;
  }

  getFolderContents({uuid}) {
      if (!this.ofsf[uuid]) {
          return [];
      }
      const out = [];
      for (const item of this.ofsf[uuid][3]) {
          try {
              out.push(this.uuidToFileName(item));
          } catch (err) {
              console.log(err);
          }
      }
      return out;
  }

  uuidToFileName({uuid}) {
      const data = this.ofsf[uuid];
      return data[1] + data[0];
  }

  getFile({uuid}) {
      return this.ofsf[uuid];
  }

  getFileItem({uuid, item}) {
      return this.ofsf[uuid][item];
  }

  getFilePath({uuid}) {
      return this.ofsf[uuid][2];
  }

  getFileSize({uuid}) {
      const data = this.ofsf[uuid];
      let out = 0;
      for (let i = 0; i < (this.ofsf[uuid] || []).length; i++) {
          out += ((""+data[i]).length || 0);
      }
      return out;
  }
}

Scratch.extensions.register(new OFSFExtension());
