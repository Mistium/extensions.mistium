// Name: IndexedDB VFS
// Author: Modified from VFS
// Description: Persistent file system using IndexedDB

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

class IndexedDBFileSystem {
    constructor() {
        this.dbName = 'ScratchVFS';
        this.dbVersion = 1;
        this.db = null;
        this.ready = false;
        this.initPromise = this._initDB();
    }

    async _initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                this.db = request.result;
                this.ready = true;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store for files
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore('files', { keyPath: 'path' });
                }
                
                // Store for directories
                if (!db.objectStoreNames.contains('directories')) {
                    db.createObjectStore('directories', { keyPath: 'path' });
                }
            };
        });
    }

    async _ensureReady() {
        if (!this.ready) {
            await this.initPromise;
        }
    }

    _normalizePath(path) {
        if (!path || typeof path !== 'string') return [];
        
        const parts = path.replace(/^\/+|\/+$/g, '')
            .split('/')
            .filter(part => part.length > 0 && part !== '.');
        
        if (parts.some(part => part === '..')) return null;
        
        return parts;
    }

    _getParentPath(path) {
        const parts = this._normalizePath(path);
        if (!parts || parts.length === 0) return '';
        parts.pop();
        return parts.join('/');
    }

    async _getFile(path) {
        await this._ensureReady();
        const normalizedPath = this._normalizePath(path)?.join('/');
        if (!normalizedPath) return null;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const request = store.get(normalizedPath);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async _putFile(path, content, metadata = {}) {
        await this._ensureReady();
        const normalizedPath = this._normalizePath(path)?.join('/');
        if (!normalizedPath) return false;

        await this._ensureParentDirs(normalizedPath);

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            
            const fileData = {
                path: normalizedPath,
                content: content,
                modified: metadata.modified || Date.now(),
                created: metadata.created || Date.now()
            };

            const request = store.put(fileData);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async _deleteFile(path) {
        await this._ensureReady();
        const normalizedPath = this._normalizePath(path)?.join('/');
        if (!normalizedPath) return false;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.delete(normalizedPath);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async _ensureParentDirs(path) {
        const parts = this._normalizePath(path);
        if (!parts || parts.length <= 1) return;

        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
            currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
            await this._createDirectory(currentPath);
        }
    }

    async _createDirectory(path) {
        await this._ensureReady();
        const normalizedPath = this._normalizePath(path)?.join('/');
        if (!normalizedPath) return false;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['directories'], 'readwrite');
            const store = transaction.objectStore('directories');
            
            const dirData = {
                path: normalizedPath,
                created: Date.now()
            };

            const request = store.put(dirData);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async _deleteDirectory(path) {
        await this._ensureReady();
        const normalizedPath = this._normalizePath(path)?.join('/');
        if (!normalizedPath) return false;

        // Delete all files and subdirectories within this directory
        const allFiles = await this._getAllFiles();
        const allDirs = await this._getAllDirectories();

        const filesToDelete = allFiles.filter(f => f.path.startsWith(normalizedPath + '/'));
        const dirsToDelete = allDirs.filter(d => d.path.startsWith(normalizedPath + '/'));

        for (const file of filesToDelete) {
            await this._deleteFile(file.path);
        }

        for (const dir of dirsToDelete) {
            const transaction = this.db.transaction(['directories'], 'readwrite');
            const store = transaction.objectStore('directories');
            await new Promise(resolve => {
                store.delete(dir.path);
                transaction.oncomplete = resolve;
            });
        }

        // Delete the directory itself
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['directories'], 'readwrite');
            const store = transaction.objectStore('directories');
            const request = store.delete(normalizedPath);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async _getAllFiles() {
        await this._ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async _getAllDirectories() {
        await this._ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['directories'], 'readonly');
            const store = transaction.objectStore('directories');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async createFile({ FILE_PATH }) {
        try {
            const normalizedPath = this._normalizePath(FILE_PATH)?.join('/');
            if (!normalizedPath) return;

            const existing = await this._getFile(normalizedPath);
            if (existing) return; // File already exists

            await this._putFile(normalizedPath, '');
        } catch (error) {
            console.error('Error creating file:', error);
        }
    }

    async readFile({ FILE_PATH }) {
        try {
            const file = await this._getFile(FILE_PATH);
            if (!file) return 'Error: File not found';
            return file.content;
        } catch (error) {
            console.error('Error reading file:', error);
            return 'Error: ' + error.message;
        }
    }

    async getMetadata({ FILE_PATH, METADATA }) {
        try {
            const file = await this._getFile(FILE_PATH);
            if (!file) return "Error: File not found";
            return file[METADATA] || "";
        } catch (error) {
            console.error('Error getting metadata:', error);
            return "";
        }
    }

    async writeFile({ FILE_PATH, CONTENT }) {
        try {
            const file = await this._getFile(FILE_PATH);
            if (!file) return;

            await this._putFile(FILE_PATH, String(CONTENT), {
                created: file.created,
                modified: Date.now()
            });
        } catch (error) {
            console.error('Error writing file:', error);
        }
    }

    async appendFile({ FILE_PATH, CONTENT }) {
        try {
            const file = await this._getFile(FILE_PATH);
            if (!file) return;

            const newContent = file.content + String(CONTENT);
            await this._putFile(FILE_PATH, newContent, {
                created: file.created,
                modified: Date.now()
            });
        } catch (error) {
            console.error('Error appending to file:', error);
        }
    }

    async moveFile({ FILE_PATH, NEW_FILE_PATH }) {
        try {
            const file = await this._getFile(FILE_PATH);
            if (!file) return;

            await this._putFile(NEW_FILE_PATH, file.content, {
                created: file.created,
                modified: file.modified
            });
            await this._deleteFile(FILE_PATH);
        } catch (error) {
            console.error('Error moving file:', error);
        }
    }

    async copyFile({ FILE_PATH, NEW_FILE_PATH }) {
        try {
            const file = await this._getFile(FILE_PATH);
            if (!file) return;

            await this._putFile(NEW_FILE_PATH, file.content, {
                created: Date.now(),
                modified: Date.now()
            });
        } catch (error) {
            console.error('Error copying file:', error);
        }
    }

    async renameFile({ FILE_PATH, NEW_FILE_NAME }) {
        try {
            const parts = this._normalizePath(FILE_PATH);
            if (!parts || parts.length === 0) return;

            const newName = this._normalizePath(NEW_FILE_NAME);
            if (!newName || newName.length !== 1) return;

            const dirPath = parts.slice(0, -1).join('/');
            const newPath = dirPath ? `${dirPath}/${newName[0]}` : newName[0];

            await this.moveFile({ FILE_PATH, NEW_FILE_PATH: newPath });
        } catch (error) {
            console.error('Error renaming file:', error);
        }
    }

    async deleteFile({ FILE_PATH }) {
        try {
            await this._deleteFile(FILE_PATH);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }

    async createDirectory({ DIR_PATH }) {
        try {
            await this._createDirectory(DIR_PATH);
        } catch (error) {
            console.error('Error creating directory:', error);
        }
    }

    async deleteDirectory({ DIR_PATH }) {
        try {
            await this._deleteDirectory(DIR_PATH);
        } catch (error) {
            console.error('Error deleting directory:', error);
        }
    }

    async moveDirectory({ DIR_PATH, NEW_DIR_PATH }) {
        try {
            const normalizedOld = this._normalizePath(DIR_PATH)?.join('/');
            const normalizedNew = this._normalizePath(NEW_DIR_PATH)?.join('/');
            if (!normalizedOld || !normalizedNew) return;

            const allFiles = await this._getAllFiles();
            const filesToMove = allFiles.filter(f => 
                f.path === normalizedOld || f.path.startsWith(normalizedOld + '/')
            );

            for (const file of filesToMove) {
                const relativePath = file.path.substring(normalizedOld.length);
                const newPath = normalizedNew + relativePath;
                await this._putFile(newPath, file.content, {
                    created: file.created,
                    modified: file.modified
                });
            }

            await this._deleteDirectory(DIR_PATH);
        } catch (error) {
            console.error('Error moving directory:', error);
        }
    }

    async copyDirectory({ DIR_PATH, NEW_DIR_PATH }) {
        try {
            const normalizedOld = this._normalizePath(DIR_PATH)?.join('/');
            const normalizedNew = this._normalizePath(NEW_DIR_PATH)?.join('/');
            if (!normalizedOld || !normalizedNew) return;

            const allFiles = await this._getAllFiles();
            const filesToCopy = allFiles.filter(f => 
                f.path === normalizedOld || f.path.startsWith(normalizedOld + '/')
            );

            for (const file of filesToCopy) {
                const relativePath = file.path.substring(normalizedOld.length);
                const newPath = normalizedNew + relativePath;
                await this._putFile(newPath, file.content, {
                    created: Date.now(),
                    modified: Date.now()
                });
            }
        } catch (error) {
            console.error('Error copying directory:', error);
        }
    }

    async listDirectory({ DIR_PATH }) {
        try {
            const normalizedPath = this._normalizePath(DIR_PATH)?.join('/');
            if (normalizedPath === null) return 'Error: Invalid directory path';

            const allFiles = await this._getAllFiles();
            const allDirs = await this._getAllDirectories();

            const prefix = normalizedPath ? normalizedPath + '/' : '';
            const entries = [];

            // Get immediate children only
            for (const file of allFiles) {
                if (normalizedPath === '') {
                    // Root level
                    if (!file.path.includes('/')) {
                        entries.push(file.path);
                    }
                } else if (file.path.startsWith(prefix)) {
                    const remainder = file.path.substring(prefix.length);
                    if (!remainder.includes('/')) {
                        entries.push(remainder);
                    }
                }
            }

            for (const dir of allDirs) {
                if (normalizedPath === '') {
                    // Root level
                    if (!dir.path.includes('/')) {
                        entries.push(dir.path + '/');
                    }
                } else if (dir.path.startsWith(prefix)) {
                    const remainder = dir.path.substring(prefix.length);
                    if (!remainder.includes('/')) {
                        entries.push(remainder + '/');
                    }
                }
            }

            return JSON.stringify(entries);
        } catch (error) {
            console.error('Error listing directory:', error);
            return 'Error: ' + error.message;
        }
    }

    async getFileSize({ FILE_PATH }) {
        try {
            const file = await this._getFile(FILE_PATH);
            if (!file) return 0;
            return file.content.length;
        } catch (error) {
            console.error('Error getting file size:', error);
            return 0;
        }
    }

    async fileExists({ FILE_PATH }) {
        try {
            const file = await this._getFile(FILE_PATH);
            return file !== null && file !== undefined;
        } catch (error) {
            console.error('Error checking file exists:', error);
            return false;
        }
    }

    async directoryExists({ DIR_PATH }) {
        try {
            await this._ensureReady();
            const normalizedPath = this._normalizePath(DIR_PATH)?.join('/');
            if (normalizedPath === null) return false;
            if (normalizedPath === '') return true; // Root always exists

            const allDirs = await this._getAllDirectories();
            return allDirs.some(d => d.path === normalizedPath);
        } catch (error) {
            console.error('Error checking directory exists:', error);
            return false;
        }
    }

    async getallfiles({ EXPORT }) {
        try {
            const allFiles = await this._getAllFiles();
            
            switch (EXPORT) {
                case 'json':
                    return JSON.stringify(allFiles);
                case 'zip':
                    return await this.exportAsZip();
                default:
                    return JSON.stringify(allFiles);
            }
        } catch (error) {
            console.error('Error getting all files:', error);
            return 'Error: ' + error.message;
        }
    }

    async importfiles({ EXPORT, FILES }) {
        try {
            switch (EXPORT) {
                case 'json':
                    const parsed = JSON.parse(FILES);
                    for (const file of parsed) {
                        await this._putFile(file.path, file.content, {
                            created: file.created,
                            modified: file.modified
                        });
                    }
                    break;
                case 'zip':
                    let zipData = FILES;
                    if (zipData.startsWith('data:application/zip;base64,')) {
                        zipData = zipData.substring('data:application/zip;base64,'.length);
                    }
                    await this.importFromZip({ ZIP_DATA: zipData });
                    break;
            }
        } catch (error) {
            console.error('Error importing files:', error);
        }
    }

    async clearall() {
        try {
            await this._ensureReady();
            
            // Clear files
            const fileTransaction = this.db.transaction(['files'], 'readwrite');
            const fileStore = fileTransaction.objectStore('files');
            await new Promise(resolve => {
                fileStore.clear();
                fileTransaction.oncomplete = resolve;
            });

            // Clear directories
            const dirTransaction = this.db.transaction(['directories'], 'readwrite');
            const dirStore = dirTransaction.objectStore('directories');
            await new Promise(resolve => {
                dirStore.clear();
                dirTransaction.oncomplete = resolve;
            });
        } catch (error) {
            console.error('Error clearing all:', error);
        }
    }

    async exportAsZip() {
        try {
            const JSZip = vm.exports.JSZip;
            if (!JSZip) {
                return 'Error: JSZip not available';
            }

            const zip = new JSZip();
            const files = await this._getAllFiles();

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

            const zip = new JSZip();
            await zip.loadAsync(ZIP_DATA, { base64: true });

            const files = [];
            zip.forEach((relativePath, file) => {
                if (!file.dir) {
                    files.push({ path: relativePath, file });
                }
            });

            for (const { path, file } of files) {
                const content = await file.async('string');
                await this._putFile(path, content, {
                    created: file.date ? file.date.getTime() : Date.now(),
                    modified: file.date ? file.date.getTime() : Date.now()
                });
            }
        } catch (error) {
            console.error('Import error:', error);
        }
    }

    getInfo() {
        return {
            id: 'indexeddbvfs',
            name: 'IndexedDB File System',
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

Scratch.extensions.register(new IndexedDBFileSystem());