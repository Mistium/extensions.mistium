// Name: IndexedDB VFS
// Author: Modified from VFS
// Description: Persistent file system using IndexedDB

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

if (!Scratch.extensions.unsandboxed) {
    throw new Error("Persistent File System must run unsandboxed.");
}

class IndexedDBFileSystem {
    constructor() {
        this.dbName = 'ScratchVFS';
        this.dbVersion = 1;
        this.db = null;
        this.ready = false;
        this.initPromise = this._initDB();
    }

    _initDB() {
        const name = this.dbName;
        const promise = new Promise((resolve, reject) => {
            const request = indexedDB.open(name, this.dbVersion);

            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                // A newer set database id call won the race, drop this connection
                if (name !== this.dbName) {
                    request.result.close();
                    resolve();
                    return;
                }
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
        promise.catch(() => {}); // surfaced by _ensureReady instead
        return promise;
    }

    async _setDatabaseName(name) {
        if (!name || typeof name !== 'string') return;
        if (name === this.dbName && this.db) return;

        if (this.db) {
            this.db.close();
            this.db = null;
            this.ready = false;
        }

        this.dbName = name;
        this.initPromise = this._initDB();
        await this.initPromise;
    }

    async _ensureReady() {
        // Re-check in case the database id changed while we were waiting
        let promise;
        do {
            promise = this.initPromise;
            await promise;
        } while (promise !== this.initPromise);
    }

    // Runs fn(transaction) in one readwrite transaction, resolving once it commits
    async _tx(storeNames, fn) {
        await this._ensureReady();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeNames, 'readwrite');
            fn(transaction);
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = transaction.onabort = () => reject(transaction.error);
        });
    }

    _normalizePath(path) {
        path = Scratch.Cast.toString(path);
        if (!path) return [];
        
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

        await this._createDirectory(parts.slice(0, -1).join('/'));
    }

    // Creates the directory and any missing parents (so they show up in listings)
    async _createDirectory(path) {
        const parts = this._normalizePath(path);
        if (!parts || parts.length === 0) return false;

        return this._tx(['directories'], transaction => {
            const store = transaction.objectStore('directories');
            for (let i = 1; i <= parts.length; i++) {
                store.put({
                    path: parts.slice(0, i).join('/'),
                    created: Date.now()
                });
            }
        });
    }

    async _deleteDirectory(path) {
        await this._ensureReady();
        const normalizedPath = this._normalizePath(path)?.join('/');
        if (!normalizedPath) return false;

        // Delete all files and subdirectories within this directory
        const allFiles = await this._getAllFiles();
        const allDirs = await this._getAllDirectories();

        const prefix = normalizedPath + '/';

        return this._tx(['files', 'directories'], transaction => {
            const fileStore = transaction.objectStore('files');
            const dirStore = transaction.objectStore('directories');
            for (const file of allFiles) {
                if (file.path.startsWith(prefix)) fileStore.delete(file.path);
            }
            for (const dir of allDirs) {
                if (dir.path.startsWith(prefix)) dirStore.delete(dir.path);
            }
            dirStore.delete(normalizedPath);
        });
    }

    // Copies a directory's subdirectories and files to a new path
    async _copyDirectory(from, to, keepTimes) {
        const allFiles = await this._getAllFiles();
        const allDirs = await this._getAllDirectories();
        const prefix = from + '/';

        await this._createDirectory(to);
        for (const dir of allDirs) {
            if (dir.path.startsWith(prefix)) {
                await this._createDirectory(to + dir.path.substring(from.length));
            }
        }
        for (const file of allFiles) {
            if (file.path.startsWith(prefix)) {
                await this._putFile(to + file.path.substring(from.length), file.content,
                    keepTimes ? { created: file.created, modified: file.modified } : {});
            }
        }
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

    async setDatabaseId({ DB_ID }) {
        try {
            await this._setDatabaseName(String(DB_ID));
        } catch (e) {
            console.error('Error setting DB ID:', e);
        }
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
            const from = this._normalizePath(FILE_PATH)?.join('/');
            const to = this._normalizePath(NEW_FILE_PATH)?.join('/');
            // Same path would put then delete the file; invalid destination would just delete it
            if (!from || !to || from === to) return;

            const file = await this._getFile(from);
            if (!file) return;

            await this._putFile(to, file.content, {
                created: file.created,
                modified: file.modified
            });
            await this._deleteFile(from);
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

    async renameDirectory({ DIR_PATH, NEW_DIR_NAME }) {
        try {
            const parts = this._normalizePath(DIR_PATH);
            if (!parts || parts.length === 0) return;

            const newName = this._normalizePath(NEW_DIR_NAME);
            if (!newName || newName.length !== 1) return;

            const parentPath = parts.slice(0, -1).join('/');
            const newPath = parentPath ? `${parentPath}/${newName[0]}` : newName[0];

            await this.moveDirectory({ DIR_PATH, NEW_DIR_PATH: newPath });
        } catch (error) {
            console.error('Error renaming directory:', error);
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
            if (!normalizedOld || !normalizedNew || normalizedOld === normalizedNew) return;
            // Moving into itself would copy then delete everything
            if (normalizedNew.startsWith(normalizedOld + '/')) return;
            if (!(await this.directoryExists({ DIR_PATH: normalizedOld }))) return;

            await this._copyDirectory(normalizedOld, normalizedNew, true);
            await this._deleteDirectory(normalizedOld);
        } catch (error) {
            console.error('Error moving directory:', error);
        }
    }

    async copyDirectory({ DIR_PATH, NEW_DIR_PATH }) {
        try {
            const normalizedOld = this._normalizePath(DIR_PATH)?.join('/');
            const normalizedNew = this._normalizePath(NEW_DIR_PATH)?.join('/');
            if (!normalizedOld || !normalizedNew || normalizedOld === normalizedNew) return;
            if (!(await this.directoryExists({ DIR_PATH: normalizedOld }))) return;

            await this._copyDirectory(normalizedOld, normalizedNew, false);
        } catch (error) {
            console.error('Error copying directory:', error);
        }
    }

    async listDirectory({ DIR_PATH }) {
        try {
            const normalizedPath = this._normalizePath(DIR_PATH)?.join('/');
            if (normalizedPath == null) return 'Error: Invalid directory path';

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
            if (normalizedPath == null) return false;
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
                    const parsed = JSON.parse(Scratch.Cast.toString(FILES));
                    if (!Array.isArray(parsed)) return;
                    for (const file of parsed) {
                        if (!file || typeof file !== 'object') continue;
                        await this._putFile(file.path, Scratch.Cast.toString(file.content ?? ''), {
                            created: file.created,
                            modified: file.modified
                        });
                    }
                    break;
                case 'zip':
                    let zipData = Scratch.Cast.toString(FILES);
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
            
            await this._tx(['files', 'directories'], transaction => {
                transaction.objectStore('files').clear();
                transaction.objectStore('directories').clear();
            });
        } catch (error) {
            console.error('Error clearing all:', error);
        }
    }

    async exportAsZip() {
        try {
            const JSZip = Scratch.vm.exports.JSZip;
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
            const JSZip = Scratch.vm.exports.JSZip;
            if (!JSZip) {
                return;
            }

            const zip = new JSZip();
            await zip.loadAsync(ZIP_DATA, { base64: true });

            const files = [];
            const dirs = [];
            zip.forEach((relativePath, file) => {
                if (file.dir) {
                    dirs.push(relativePath);
                } else {
                    files.push({ path: relativePath, file });
                }
            });

            for (const dir of dirs) {
                await this._createDirectory(dir);
            }

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
                    opcode: 'setDatabaseId',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set database id to [DB_ID]',
                    arguments: {
                        DB_ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'MyProjectVFS'
                        }
                    }
                },
                '---',
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
                    opcode: 'renameDirectory',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'rename directory [DIR_PATH] to [NEW_DIR_NAME]',
                    arguments: {
                        DIR_PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir1/dir2'
                        },
                        NEW_DIR_NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'dir3'
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
                            defaultValue: '[]'
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
