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
        
        if (parts.some(part => part === '..')) return null;
        
        return parts;
    }

    _navigatePath(path, createDirs = false) {
        const parts = this._normalizePath(path);
        if (parts === null) return null;
        if (parts.length === 0) return this.vfs;
        
        let current = this.vfs;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (!current[part]) {
                if (!createDirs) return null;
                current[part] = {};
            }
            
            if (current[part][this.FILE_MARKER] && i < parts.length - 1) return null;
            
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

    _getEntry(path, isFile = true) {
        const parts = this._normalizePath(path);
        if (parts === null || parts.length === 0) return null;

        const name = parts.pop();
        const dir = this._navigatePath(parts.join('/'));

        if (!dir || dir[name] === undefined) return null;
        
        const entry = dir[name];
        const correctType = isFile ? this._isFile(entry) : this._isDirectory(entry);
        
        return correctType ? { entry, dir, name } : null;
    }

    _performFileOperation(path, operation, ...args) {
        const result = this._getEntry(path, true);
        if (!result) return;
        
        operation(result, ...args);
    }

    _transferEntry(sourcePath, destPath, isMove = false, isFile = true) {
        const parts = this._normalizePath(sourcePath);
        if (parts === null || parts.length === 0) return;
        
        const name = parts.pop();
        const sourceDir = this._navigatePath(parts.join('/'));

        if (!sourceDir || sourceDir[name] === undefined) return;
        
        const entry = sourceDir[name];
        const correctType = isFile ? this._isFile(entry) : this._isDirectory(entry);
        if (!correctType) return;

        const destParts = this._normalizePath(destPath);
        if (destParts === null || destParts.length === 0) return;

        const destName = destParts.pop();
        const destDir = this._navigatePath(destParts.join('/'), true);

        if (!destDir || destDir[destName] !== undefined) return;

        destDir[destName] = isMove ? entry : JSON.parse(JSON.stringify(entry));
        
        if (isMove) delete sourceDir[name];
    }

    createFile({ FILE_PATH }) {
        const parts = this._normalizePath(FILE_PATH);
        if (parts === null || parts.length === 0) return;

        const fileName = parts.pop();
        const dir = this._navigatePath(parts.join('/'), true);

        if (!dir || dir[fileName] !== undefined) return;

        dir[fileName] = {
            [this.FILE_MARKER]: true,
            modified: Date.now(),
            created: Date.now(),
            content: ''
        };
    }

    readFile({ FILE_PATH }) {
        const result = this._getEntry(FILE_PATH, true);
        if (!result) return 'Error: File not found';
        return result.entry.content;
    }

    getMetadata({ FILE_PATH, METADATA }) {
        const result = this._getEntry(FILE_PATH, true);
        if (!result) return "Error: File not found";

        return result.entry[METADATA] || "";
    }

    writeFile({ FILE_PATH, CONTENT }) {
        this._performFileOperation(FILE_PATH, (result) => {
            result.entry.modified = Date.now();
            result.entry.content = String(CONTENT);
        });
    }

    appendFile({ FILE_PATH, CONTENT }) {
        this._performFileOperation(FILE_PATH, (result) => {
            result.entry.modified = Date.now();
            result.entry.content += String(CONTENT);
        });
    }

    moveFile({ FILE_PATH, NEW_FILE_PATH }) {
        this._transferEntry(FILE_PATH, NEW_FILE_PATH, true, true);
    }

    copyFile({ FILE_PATH, NEW_FILE_PATH }) {
        this._transferEntry(FILE_PATH, NEW_FILE_PATH, false, true);
    }

    renameFile({ FILE_PATH, NEW_FILE_NAME }) {
        const parts = this._normalizePath(FILE_PATH);
        if (parts === null || parts.length === 0) return;

        const newName = this._normalizePath(NEW_FILE_NAME);
        if (newName === null || newName.length !== 1) return;
        
        const dirPath = parts.slice(0, -1).join('/');
        const newPath = dirPath ? `${dirPath}/${newName[0]}` : newName[0];
        
        this._transferEntry(args.FILE_PATH, newPath, true, true);
    }

    moveDirectory({ DIR_PATH, NEW_DIR_PATH }) {
        this._transferEntry(DIR_PATH, NEW_DIR_PATH, true, false);
    }

    copyDirectory({ DIR_PATH, NEW_DIR_PATH }) {
        this._transferEntry(DIR_PATH, NEW_DIR_PATH, false, false);
    }

    deleteFile({ FILE_PATH }) {
        this._performFileOperation(FILE_PATH, (result) => {
            delete result.dir[result.name];
        });
    }

    createDirectory({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null || parts.length === 0) return;

        const dirName = parts.pop();
        const parentDir = this._navigatePath(parts.join('/'), true);

        if (!parentDir || parentDir[dirName] !== undefined) return;

        parentDir[dirName] = {};
    }

    deleteDirectory({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null || parts.length === 0) return;

        const dirName = parts.pop();
        const parentDir = this._navigatePath(parts.join('/'));

        if (!parentDir || parentDir[dirName] === undefined) return;
        if (!this._isDirectory(parentDir[dirName])) return;

        delete parentDir[dirName];
    }

    listDirectory({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null) return 'Error: Invalid directory path';

        const dir = this._navigatePath(parts.join('/'));
        if (!dir) return 'Error: Directory not found';
        if (this._isFile(dir)) return 'Error: Path is a file, not a directory';

        const entries = Object.keys(dir).map(key => 
            this._isFile(dir[key]) ? key : key + '/'
        );

        return JSON.stringify(entries);
    }

    getFileSize({ FILE_PATH }) {
        const result = this._getEntry(FILE_PATH, true);
        if (!result) return 0;
        return result.entry.content.length;
    }

    fileExists({ FILE_PATH }) {
        return this._getEntry(FILE_PATH, true) !== null;
    }

    directoryExists({ DIR_PATH }) {
        const parts = this._normalizePath(DIR_PATH);
        if (parts === null) return false;

        const dir = this._navigatePath(parts.join('/'));
        return dir !== null && this._isDirectory(dir);
    }

    getallfiles({ EXPORT }) {
        switch (EXPORT) {
            case 'json':
                return JSON.stringify(this._serializeVFS(this.vfs));
            case 'zip':
                return this.exportAsZip();
        }
    }

    _serializeVFS(obj) {
        if (this._isFile(obj)) {
            return { 
                __isFile: true, 
                content: obj.content,
                created: obj.created,
                modified: obj.modified
            };
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
            return { 
                [this.FILE_MARKER]: true, 
                content: obj.content || '',
                created: obj.created || Date.now(),
                modified: obj.modified || Date.now()
            };
        }
        
        const result = {};
        for (const key in obj) {
            result[key] = this._deserializeVFS(obj[key]);
        }
        return result;
    }

    importfiles({ EXPORT, FILES }) {
        switch (EXPORT) {
            case 'json':
                try {
                    const parsed = JSON.parse(FILES);
                    this.vfs = this._deserializeVFS(parsed);
                } catch {}
                break;
            case 'zip':
                const zipData = FILES;
                if (!zipData) return;

                if (zipData.startsWith('data:application/zip;base64,')) {
                    zipData = zipData.substring('data:application/zip;base64,'.length);
                    this.importFromZip({ ZIP_DATA: zipData });
                } else {
                    console.error('Error: Invalid ZIP data, expected: "data:application/zip;base64,..."');
                }
                break;
        }
    }

    clearall() {
        this.vfs = {};
    }

    async _collectAllFiles(dir = this.vfs, currentPath = '') {
        const files = [];
        
        for (const key in dir) {
            if (key === this.FILE_MARKER) continue;
            
            const entry = dir[key];
            const fullPath = currentPath ? `${currentPath}/${key}` : key;
            
            if (this._isFile(entry)) {
                files.push({
                    path: fullPath,
                    content: entry.content,
                    modified: entry.modified
                });
            } else if (this._isDirectory(entry)) {
                const subFiles = await this._collectAllFiles(entry, fullPath);
                files.push(...subFiles);
            }
        }
        
        return files;
    }

    async exportAsZip() {
        try {
            const JSZip = vm.exports.JSZip;
            if (!JSZip) {
                return 'Error: JSZip not available';
            }

            const zip = new JSZip();
            const files = await this._collectAllFiles();

            if (files.length === 0) {
                return 'Error: No files to export';
            }

            for (const file of files) {
                zip.file(file.path, file.content, {
                    date: file.modified ? new Date(file.modified) : new Date()
                });
            }

            const blob = await zip.generateAsync({ type: 'base64' });
            return "data:application/zip;base64," + blob;
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }

    async importFromZip({ ZIP_DATA }) {
        try {
            const JSZip = vm.exports.JSZip;
            if (!JSZip) {
                return;
            }

            const zipData = ZIP_DATA;
            const zip = new JSZip();
            
            await zip.loadAsync(zipData, { base64: true });

            const files = [];
            zip.forEach((relativePath, file) => {
                if (!file.dir) {
                    files.push({ path: relativePath, file });
                }
            });

            for (const { path, file } of files) {
                const content = await file.async('string');
                const parts = this._normalizePath(path);
                
                if (parts === null || parts.length === 0) continue;

                const fileName = parts.pop();
                const dir = this._navigatePath(parts.join('/'), true);

                if (!dir) continue;

                dir[fileName] = {
                    [this.FILE_MARKER]: true,
                    modified: file.date ? file.date.getTime() : Date.now(),
                    created: file.date ? file.date.getTime() : Date.now(),
                    content: content
                };
            }
        } catch (error) {
            console.error('Import error:', error);
        }
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
                    opcode: 'appendFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'append [CONTENT] to file [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        },
                        CONTENT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'More text!'
                        }
                    }
                },
                "---",
                {
                    opcode: 'getMetadata',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get [METADATA] for file [FILE_PATH]',
                    arguments: {
                        METADATA: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'options',
                            defaultValue: 'modified'
                        },
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        }
                    }
                },
                {
                    opcode: 'getFileSize',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'size of file [FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        }
                    }
                },
                "---",
                {
                    opcode: 'moveFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'move [FILE_PATH] to [NEW_FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        },
                        NEW_FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir3/myFile.txt'
                        }
                    }
                },
                {
                    opcode: 'copyFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'copy [FILE_PATH] to [NEW_FILE_PATH]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        },
                        NEW_FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myNewFile.txt'
                        }
                    }
                },
                {
                    opcode: 'renameFile',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'rename file [FILE_PATH] to [NEW_FILE_NAME]',
                    arguments: {
                        FILE_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2/myFile.txt'
                        },
                        NEW_FILE_NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'newFile.txt'
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
                    opcode: 'moveDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'move directory [DIR_PATH] to [NEW_DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2'
                        },
                        NEW_DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir3'
                        }
                    }
                },
                {
                    opcode: 'copyDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'copy directory [DIR_PATH] to [NEW_DIR_PATH]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2'
                        },
                        NEW_DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir3'
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
                    text: 'export all files as [EXPORT]',
                    arguments: {
                        EXPORT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'exports',
                            defaultValue: 'json'
                        }
                    }
                },
                {
                    opcode: 'importfiles',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'import files from [EXPORT] [FILES]',
                    arguments: {
                        EXPORT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'exports',
                            defaultValue: 'json'
                        },
                        FILES: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    }
                },
                '---',
                {
                    opcode: 'clearall',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear entire file system'
                }
            ],
            menus: {
                options: [
                    { text: 'Modified', value: 'modified' },
                    { text: 'Created', value: 'created' }
                ],
                exports: [
                    { text: 'JSON', value: 'json' },
                    { text: 'ZIP (data URL, base64)', value: 'zip' }
                ]
            }
        };
    }
}

Scratch.extensions.register(new VirtualFileSystem());