// Name: MediaUtils
// By: @mistium on discord
// Description: Allows you to view and check permssions for media devices

class MediaDevicesExtension {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'mediaDevices',
            name: 'Media Devices Extension',
            blocks: [
                {
                    opcode: 'enumerateMediaDevices',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'enumerate media devices',
                },
                {
                    opcode: 'checkCameraPermission',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'camera permission granted?',
                },
                {
                    opcode: 'checkMicrophonePermission',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'microphone permission granted?',
                }
            ]
        };
    }

    enumerateMediaDevices() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    if (devices.length === 0) {
                        resolve("No media devices found.");
                        return;
                    }
                    const uniqueDevices = {};
                    devices.forEach(device => {
                        const deviceId = device.deviceId;
                        if (uniqueDevices[device.label]) {
                            return;
                        }
                        const info = {
                            id: deviceId || 'N/A',
                        };
                        if (device.kind === 'audioinput' && devices.some(d => d.deviceId === deviceId && d.kind === 'audiooutput')) {
                            info.type = 'audioboth';
                        } else if (device.kind === 'audioinput') {
                            info.type = 'audioinput';
                        } else if (device.kind === 'audiooutput') {
                            info.type = 'audiooutput';
                        } else if (device.kind === 'videoinput') {
                            info.type = 'videoinput';
                        }
                        uniqueDevices[device.label] = info;
                    });
                    resolve(JSON.stringify(uniqueDevices));
                })
                .catch(err => {
                    reject('Error enumerating devices: ' + err);
                });
        });
    }

    checkCameraPermission() {
        return new Promise((resolve) => {
            navigator.permissions.query({ name: 'camera' })
                .then(permissionStatus => {
                    resolve(permissionStatus.state === 'granted');
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }

    checkMicrophonePermission() {
        return new Promise((resolve) => {
            navigator.permissions.query({ name: 'microphone' })
                .then(permissionStatus => {
                    resolve(permissionStatus.state === 'granted');
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }
}

Scratch.extensions.register(new MediaDevicesExtension());
