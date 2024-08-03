// Made by @mistium
// epic files shit stuff :sunglasses:

class VirtualFileSystem {
    constructor() {
        this.vfs = {};
    }

    // Helper function to navigate and create directories as needed
    _navigatePath(path, createDirs = false) {
        const parts = path.split('/');
        let current = this.vfs;

        for (const part of parts) {
            if (!current[part]) {
                if (createDirs) {
                    current[part] = {};
                } else {
                    return null;
                }
            }
            current = current[part];
        }

        return current;
    }

    createFile(args) {
        const filePath = args.FILE_PATH.split('/');
        const fileName = filePath.pop();
        const dir = this._navigatePath(filePath.join('/'), true);

        if (dir && typeof dir === 'object' && !dir[fileName]) {
            dir[fileName] = '';
            return `File ${fileName} created`;
        } else {
            return dir ? 'File already exists' : 'Directory not found';
        }
    }

    readFile(args) {
        const filePath = args.FILE_PATH.split('/');
        const fileName = filePath.pop();
        const dir = this._navigatePath(filePath.join('/'));

        if (dir && dir[fileName] !== undefined) {
            return dir[fileName];
        } else {
            return 'File not found';
        }
    }

    writeFile(args) {
        const filePath = args.FILE_PATH.split('/');
        const fileName = filePath.pop();
        const dir = this._navigatePath(filePath.join('/'));

        if (dir && dir[fileName] !== undefined) {
            dir[fileName] = args.CONTENT;
            return `Content written to ${fileName}`;
        } else {
            return 'File not found';
        }
    }

    deleteFile(args) {
        const filePath = args.FILE_PATH.split('/');
        const fileName = filePath.pop();
        const dir = this._navigatePath(filePath.join('/'));

        if (dir && dir[fileName] !== undefined) {
            delete dir[fileName];
            return `File ${fileName} deleted`;
        } else {
            return 'File not found';
        }
    }

    createDirectory(args) {
        const dirPath = args.DIR_PATH.split('/');
        const dirName = dirPath.pop();
        const parentDir = this._navigatePath(dirPath.join('/'), true);

        if (parentDir && !parentDir[dirName]) {
            parentDir[dirName] = {};
            return `Directory ${dirName} created`;
        } else {
            return parentDir ? 'Directory already exists' : 'Parent directory not found';
        }
    }

    deleteDirectory(args) {
        const dirPath = args.DIR_PATH.split('/');
        const dirName = dirPath.pop();
        const parentDir = this._navigatePath(dirPath.join('/'));

        if (parentDir && parentDir[dirName] !== undefined) {
            delete parentDir[dirName];
            return `Directory ${dirName} deleted`;
        } else {
            return 'Directory not found';
        }
    }

    listDirectory(args) {
        const dirPath = args.DIR_PATH.split('/');
        const dirName = dirPath.pop();
        const parentDir = this._navigatePath(dirPath.join('/'));

        if (parentDir && parentDir[dirName] !== undefined) {
            return Object.keys(parentDir[dirName]);
        } else {
            return 'Directory not found';
        }
    }

    getallfiles() {
        return JSON.stringify(this.vfs)
    }

    importfiles(args) {
        this.vfs = JSON.parse(args.FILES)
    }

    getInfo() {
        return {
            id: 'vfs',
            name: 'Virtual File System',
            blocks: [
                {
                    opcode: 'createFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create file [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        }
                    }
                },
                {
                    opcode: 'readFile',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'read file [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        }
                    }
                },
                {
                    opcode: 'writeFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'write [CONTENT] to file [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello, World!'
                        }
                    }
                },
                {
                    opcode: 'deleteFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete file [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        }
                    }
                },
                {
                    opcode: 'createDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create directory [DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2'
                        }
                    }
                },
                {
                    opcode: 'deleteDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete directory [DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2'
                        }
                    }
                },
                {
                    opcode: 'listDirectory',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'list directory [DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2'
                        }
                    }
                },
                {
                    opcode: 'getallfiles',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get all files',
                },
                {
                    opcode: 'importfiles',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'import files [FILES]',
                    arguments: {
                        FILES: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    }
                }
            ]
        };
    }
}

Scratch.extensions.register(new VirtualFileSystem());
