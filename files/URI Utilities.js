// Name: URI Utilities
// Author: Mistium
// Description: Convert strings and downloaded files to data URIs.

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/
(function(Scratch) {
    class URI_Utils {
        getInfo() {
            return {
                id: 'URIUtilities',
                name: 'URI Utilities',
                color1: '#FF8C00',
                blocks: [
                    {
                        opcode: 'downloadAndConvert',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'download [URL] and convert to data URL',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://example.com/image.png' }
                        }
                    },
                    {
                        opcode: 'stringToDataURI',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'convert [STRING] to data URI with type [TYPE]',
                        arguments: {
                            STRING: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello, World!' },
                            TYPE: { type: Scratch.ArgumentType.STRING, defaultValue: 'text/plain' }
                        }
                    },
                    {
                        opcode: 'isDataURI',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '[STRING] is data URI',
                        arguments: {
                            STRING: { type: Scratch.ArgumentType.STRING, defaultValue: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==' }
                        }
                    },
                    {
                        opcode: 'dataURIToString',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'text of data URI [URI]',
                        arguments: {
                            URI: { type: Scratch.ArgumentType.STRING, defaultValue: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==' }
                        }
                    },
                    {
                        opcode: 'dataURIType',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'type of data URI [URI]',
                        arguments: {
                            URI: { type: Scratch.ArgumentType.STRING, defaultValue: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==' }
                        }
                    },
                ]
            };
        }

        async downloadAndConvert({ URL }) {
            try {
                const response = await Scratch.fetch(Scratch.Cast.toString(URL));
                if (!response.ok) {
                    throw new Error('Failed to download the file.');
                }
                const blob = await response.blob();
                const dataURL = await this.blobToDataURL(blob);
                return dataURL;
            } catch (error) {
                console.error('Error:', error);
                return '';
            }
        }

        blobToDataURL(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        }
        
        stringToDataURI({ STRING, TYPE }) {
            // Convert the string to base64 using the encodeURIComponent function
            const base64String = btoa(unescape(encodeURIComponent(Scratch.Cast.toString(STRING))));
            // Construct and return the data URI
            return `data:${TYPE};base64,${base64String}`;
        }


        isDataURI({ STRING }) {
            return /^data:/.test(STRING);
        }

        _parseDataURI(uri) {
            return /^data:([^,]*?)(;base64)?,(.*)$/s.exec(Scratch.Cast.toString(uri));
        }

        dataURIToString({ URI }) {
            const match = this._parseDataURI(URI);
            if (!match) return '';
            try {
                if (!match[2]) return decodeURIComponent(match[3]);
                const bytes = Uint8Array.from(atob(match[3]), c => c.charCodeAt(0));
                return new TextDecoder().decode(bytes);
            } catch (e) {
                return '';
            }
        }

        dataURIType({ URI }) {
            const match = this._parseDataURI(URI);
            if (!match) return '';
            return match[1].split(';')[0] || 'text/plain';
        }
    }

    Scratch.extensions.register(new URI_Utils());
})(Scratch);
