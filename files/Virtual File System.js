// Name: VFS
// Author: Mistium
// Description: in memory file system as an ext goes pretty crazy :sunglasses:

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

class VirtualFileSystem {
    constructor() {
        this.vfs = {};
        this.FILE_MARKER = Symbol('file');
    }

    _normalizePath(path) {
        if (!path || typeof path !== 'string') return [];
        
        const parts = path.replace(/^\/+|\/+$/g, '')
            .split('/')
            .filter(part => part.length > 0 && part !== '.');
        
        if (parts.some(part => part === '..')) {
            return null;
        }
        
        return parts;
    }

    // Helper function to navigate and create directories as needed
    _navigatePath(path, createDirs = false) {
        const parts = this._normalizePath(path);
        if (parts === null) return null;
        
        if (parts.length === 0) return this.vfs;
        
        let current = this.vfs;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (!current[part]) {
                if (createDirs) {
                    current[part] = {};
                } else {
                    return null;
                }
            }
            
            if (current[part][this.FILE_MARKER] && i < parts.length - 1) {
                return null;
            }
            
            current = current[part];
        }

        return current;
    }

    _isFile(obj) {
        return obj && typeof obj === 'object' && obj[this.FILE_MARKER] === true;
    }

    _isDirectory(obj) {
        return obj && typeof obj === 'object' && !obj[this.FILE_MARKER];
    }

    createFile(args) {
        const parts = this._normalizePath(args.FILE_PATH);
        if (parts === null || parts.length === 0) {
            return 'Error: Invalid file path';
        }

        const fileName = parts.pop();
        const dir = this._navigatePath(parts.join('/'), true);

        if (!dir) {
            return 'Error: Invalid directory path';
        }

        if (dir[fileName] !== undefined) {
            if (this._isFile(dir[fileName])) {
                return 'Error: File already exists';
            } else {
                return 'Error: A directory with this name already exists';
            }
        }

        dir[fileName] = { [this.FILE_MARKER]: true, content: '' };
        return `File created: ${fileName}`;
    }

    readFile(args) {
        const parts = this._normalizePath(args.FILE_PATH);
        if (parts === null || parts.length === 0) {
            return 'Error: Invalid file path';
        }

        const fileName = parts.pop();
        const dir = this._navigatePath(parts.join('/'));

        if (!dir || dir[fileName] === undefined) {
            return 'Error: File not found';
        }

        if (!this._isFile(dir[fileName])) {
            return 'Error: Path is a directory, not a file';
        }

        return dir[fileName].content;
    }

    writeFile(args) {
        const parts = this._normalizePath(args.FILE_PATH);
        if (parts === null || parts.length === 0) {
            return 'Error: Invalid file path';
        }

        const fileName = parts.pop();
        const dir = this._navigatePath(parts.join('/'));

        if (!dir || dir[fileName] === undefined) {
            return 'Error: File not found';
        }

        if (!this._isFile(dir[fileName])) {
            return 'Error: Path is a directory, not a file';
        }

        dir[fileName].content = String(args.CONTENT);
        return `Content written to: ${fileName}`;
    }

    deleteFile(args) {
        const parts = this._normalizePath(args.FILE_PATH);
        if (parts === null || parts.length === 0) {
            return 'Error: Invalid file path';
        }

        const fileName = parts.pop();
        const dir = this._navigatePath(parts.join('/'));

        if (!dir || dir[fileName] === undefined) {
            return 'Error: File not found';
        }

        if (!this._isFile(dir[fileName])) {
            return 'Error: Path is a directory, not a file';
        }

        delete dir[fileName];
        return `File deleted: ${fileName}`;
    }

    createDirectory(args) {
        const parts = this._normalizePath(args.DIR_PATH);
        if (parts === null || parts.length === 0) {
            return 'Error: Invalid directory path';
        }

        const dirName = parts.pop();
        const parentDir = this._navigatePath(parts.join('/'), true);

        if (!parentDir) {
            return 'Error: Invalid parent directory path';
        }

        if (parentDir[dirName] !== undefined) {
            if (this._isDirectory(parentDir[dirName])) {
                return 'Error: Directory already exists';
            } else {
                return 'Error: A file with this name already exists';
            }
        }

        parentDir[dirName] = {};
        return `Directory created: ${dirName}`;
    }

    deleteDirectory(args) {
        const parts = this._normalizePath(args.DIR_PATH);
        if (parts === null || parts.length === 0) {
            return 'Error: Cannot delete root directory';
        }

        const dirName = parts.pop();
        const parentDir = this._navigatePath(parts.join('/'));

        if (!parentDir || parentDir[dirName] === undefined) {
            return 'Error: Directory not found';
        }

        if (!this._isDirectory(parentDir[dirName])) {
            return 'Error: Path is a file, not a directory';
        }

        delete parentDir[dirName];
        return `Directory deleted: ${dirName}`;
    }

    listDirectory(args) {
        const parts = this._normalizePath(args.DIR_PATH);
        if (parts === null) {
            return 'Error: Invalid directory path';
        }

        const dir = this._navigatePath(parts.join('/'));

        if (!dir) {
            return 'Error: Directory not found';
        }

        if (this._isFile(dir)) {
            return 'Error: Path is a file, not a directory';
        }

        const entries = Object.keys(dir).map(key => {
            if (this._isFile(dir[key])) {
                return key + ' (file)';
            } else {
                return key + '/';
            }
        });

        return JSON.stringify(entries);
    }

    fileExists(args) {
        const parts = this._normalizePath(args.FILE_PATH);
        if (parts === null || parts.length === 0) return false;

        const fileName = parts.pop();
        const dir = this._navigatePath(parts.join('/'));

        return dir && dir[fileName] !== undefined && this._isFile(dir[fileName]);
    }

    directoryExists(args) {
        const parts = this._normalizePath(args.DIR_PATH);
        if (parts === null) return false;

        const dir = this._navigatePath(parts.join('/'));
        return dir !== null && this._isDirectory(dir);
    }

    getallfiles() {
        const exportObj = this._serializeVFS(this.vfs);
        return JSON.stringify(exportObj);
    }

    _serializeVFS(obj) {
        if (this._isFile(obj)) {
            return { __isFile: true, content: obj.content };
        }
        
        const result = {};
        for (const key in obj) {
            if (key !== this.FILE_MARKER) {
                result[key] = this._serializeVFS(obj[key]);
            }
        }
        return result;
    }

    _deserializeVFS(obj) {
        if (obj && obj.__isFile === true) {
            return { [this.FILE_MARKER]: true, content: obj.content || '' };
        }
        
        const result = {};
        for (const key in obj) {
            result[key] = this._deserializeVFS(obj[key]);
        }
        return result;
    }

    importfiles(args) {
        try {
            const parsed = JSON.parse(args.FILES);
            this.vfs = this._deserializeVFS(parsed);
            return 'Files imported successfully';
        } catch (e) {
            return 'Error: Invalid JSON format';
        }
    }

    clearall() {
        this.vfs = {};
        return 'File system cleared';
    }

    getInfo() {
        return {
            id: 'vfs',
            name: 'Virtual File System',
            color1: '#4a90e2',
            color2: '#357abd',
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
                '---',
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
                            defaultValue: 'dir1'
                        }
                    }
                },
                '---',
                {
                    opcode: 'fileExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'file [FILE_PATH] exists?',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        }
                    }
                },
                {
                    opcode: 'directoryExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'directory [DIR_PATH] exists?',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2'
                        }
                    }
                },
                '---',
                {
                    opcode: 'getallfiles',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'export all files as JSON',
                },
                {
                    opcode: 'importfiles',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'import files from JSON [FILES]',
                    arguments: {
                        FILES: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    }
                },
                {
                    opcode: 'clearall',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear entire file system'
                }
            ]
        };
    }
}

Scratch.extensions.register(new VirtualFileSystem());