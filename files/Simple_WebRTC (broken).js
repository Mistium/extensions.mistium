class FastP2PExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.localConnection = null;
        this.remoteConnection = null;
        this.dataChannel = null;
        this.peerConnections = {};
    }

    getInfo() {
        return {
            id: 'fastp2p',
            name: 'Fast P2P',
            blocks: [
                {
                    opcode: 'createConnection',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create connection with id [ID]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'peer-id'
                        }
                    }
                },
                {
                    opcode: 'sendData',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send data [DATA] to peer with id [ID]',
                    arguments: {
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello, Peer!'
                        },
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'peer-id'
                        }
                    }
                },
                {
                    opcode: 'onDataReceived',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when data received from peer with id [ID]',
                    arguments: {
                        ID: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'peer-id'
                        }
                    }
                },
                {
                    opcode: 'getData',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'received data'
                }
            ],
            events: {
                onDataReceived: {
                    peers: [],
                    data: ''
                }
            }
        };
    }

    createConnection(args) {
        const peerId = args.ID;
        this.peerConnections[peerId] = new RTCPeerConnection();

        this.peerConnections[peerId].ondatachannel = (event) => {
            const receiveChannel = event.channel;
            receiveChannel.onmessage = (event) => {
                this.runtime.emit('DATA_RECEIVED', peerId, event.data);
                this.runtime.events.onDataReceived.peers.push(peerId);
                this.runtime.events.onDataReceived.data = event.data;
            };
        };

        this.dataChannel = this.peerConnections[peerId].createDataChannel('sendDataChannel');
        this.dataChannel.onopen = () => console.log('Data channel is open');
        this.dataChannel.onclose = () => console.log('Data channel is closed');
    }

    sendData(args) {
        const peerId = args.ID;
        const data = args.DATA;
        if (this.peerConnections[peerId] && this.dataChannel) {
            this.dataChannel.send(data);
        }
    }

    onDataReceived(args) {
        const peerId = args.ID;
        return this.runtime.events.onDataReceived.peers.includes(peerId);
    }

    getData() {
        return this.runtime.events.onDataReceived.data;
    }
}

Scratch.extensions.register(new FastP2PExtension());
