(function(Scratch) {
    class DownloadAndConvert {
        getInfo() {
            return {
                id: 'downloadAndConvert',
                name: 'Download and Convert',
                color1: '#1E90FF',
                blocks: [
                    {
                        opcode: 'downloadAndConvert',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'download [URL] and convert to data URL',
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://example.com/image.png' }
                        }
                    }
                ]
            };
        }

        async downloadAndConvert({ URL }) {
            try {
                const response = await fetch(URL);
                if (!response.ok) {
                    throw new Error('Failed to download the file.');
                }
                const blob = await response.blob();
                const dataURL = await this.blobToDataURL(blob);
                return dataURL;
            } catch (error) {
                console.error('Error:', error);
                return null;
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
    }

    Scratch.extensions.register(new DownloadAndConvert());
})(Scratch);
