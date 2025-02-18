// Name: USB
// Author: Mistium
// Description: Just some blocks for the web usb api

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  const { Cast, ArgumentType, BlockType } = Scratch;
  const vm = Scratch.vm;

  class USB {
    constructor() {
      // Store connected USB devices.
      this.openedDevices = [];
      this.deviceObjects = {};

      if (this.supported()) {
        // Listen for USB connection events.
        navigator.usb.addEventListener('connect', async () => {
          await this._updateDevices();
          vm.runtime.startHats("MistUSB_onconnect");
        });

        // Listen for USB disconnection events.
        navigator.usb.addEventListener('disconnect', async () => {
          await this._updateDevices();
          vm.runtime.startHats("MistUSB_ondisconnect");
        });

        // Initial update of connected devices.
        this._updateDevices();
      }
    }

    /**
     * Returns extension metadata for Scratch.
     */
    getInfo() {
      return {
        id: 'MistUSB',
        name: 'USB',
        blocks: [
          {
            opcode: 'supported',
            blockType: BlockType.BOOLEAN,
            text: 'USB Devices Supported?'
          },
          {
            opcode: 'request',
            blockType: BlockType.COMMAND,
            text: 'Request Access to USB Device'
          },
          {
            opcode: 'connectedList',
            blockType: BlockType.REPORTER,
            text: 'All USB Devices'
          },
          {
            opcode: 'deviceInfo',
            blockType: BlockType.REPORTER,
            text: '[INFO] of [DEVICE]',
            arguments: {
              INFO: { menu: 'deviceOptions' },
              DEVICE: { menu: 'devices' }
            }
          },
          {
            opcode: 'canRead',
            blockType: BlockType.BOOLEAN,
            text: 'Can Read from [DEVICE]',
            arguments: {
              DEVICE: { menu: 'devices' }
            }
          },
          {
            opcode: 'canWrite',
            blockType: BlockType.BOOLEAN,
            text: 'Can Write to [DEVICE]',
            arguments: {
              DEVICE: { menu: 'devices' }
            }
          },
          {
            opcode: 'readFrom',
            blockType: BlockType.REPORTER,
            text: 'Read from [DEVICE]',
            arguments: {
              DEVICE: { menu: 'devices' }
            }
          },
          {
            opcode: 'writeTo',
            blockType: BlockType.COMMAND,
            text: 'Write [DATA] to [DEVICE]',
            arguments: {
              DATA: { type: ArgumentType.STRING, defaultValue: 'Hello, World!' },
              DEVICE: { menu: 'devices' }
            }
          },
          {
            opcode: 'onconnect',
            blockType: BlockType.EVENT,
            text: 'When USB Device Connected',
            isEdgeActivated: false
          },
          {
            opcode: 'ondisconnect',
            blockType: BlockType.EVENT,
            text: 'When USB Device Disconnected',
            isEdgeActivated: false
          }
        ],
        menus: {
          deviceOptions: {
            acceptReporters: true,
            items: [
              { text: "vendor Id", value: "vendorId" },
              { text: "product Id", value: "productId" },
              { text: "manufacturer", value: "manufacturerName" },
              { text: "product Name", value: "productName" },
              { text: "serial Number", value: "serialNumber" },
              { text: "configuration", value: "configuration" }
            ]
          },
          devices: {
            acceptReporters: true,
            items: "_deviceList"
          }
        }
      };
    }

    /**
     * Returns a human-readable name for a USB device.
     */
    _deviceGetName(device) {
      return `${device.manufacturerName} ${device.productName} (${device.productId})`;
    }

    /**
     * Generates a list of devices for Scratch menus.
     */
    _deviceList() {
      if (!this.supported()) return ["no devices"];
      const devices = Object.values(this.deviceObjects).map(device => ({
        text: this._deviceGetName(device),
        value: device.serialNumber
      }));
      return devices.length ? devices : ["no devices"];
    }

    /**
     * Updates the list of connected USB devices.
     */
    async _updateDevices() {
      if (!this.supported()) return;
      this.openedDevices = await navigator.usb.getDevices();
      this.deviceObjects = this.openedDevices.reduce((acc, device) => {
        acc[device.serialNumber] = device;
        return acc;
      }, {});
    }

    /**
     * Requests access to a new USB device.
     */
    async request() {
      if (!this.supported()) return;
      try {
        const device = await navigator.usb.requestDevice({ filters: [] });
        this.deviceObjects[device.serialNumber] = device;
        await this._updateDevices();
      } catch (error) {
        console.error('USB device request failed:', error);
      }
    }

    /**
     * Returns a JSON string of connected USB devices.
     */
    async connectedList() {
      if (!this.supported()) return "[]";
      const devices = Object.values(this.deviceObjects).map(device => ({
        serialNumber: device.serialNumber,
        manufacturerName: device.manufacturerName,
        productName: device.productName,
        productId: device.productId,
        vendorId: device.vendorId,
        name: this._deviceGetName(device)
      }));
      return JSON.stringify(devices);
    }

    /**
     * Checks if the USB API is supported.
     */
    supported() {
      return typeof navigator.usb !== 'undefined';
    }

    /**
     * Returns specific information about a USB device.
     */
    deviceInfo({ INFO, DEVICE }) {
      const deviceId = Cast.toString(DEVICE);
      const infoKey = Cast.toString(INFO);
      const device = this.deviceObjects[deviceId];
      return device ? device[infoKey] : '';
    }

    /**
     * Checks if a device supports reading.
     */
    canRead({ DEVICE }) {
      const deviceId = Cast.toString(DEVICE);
      const device = this.deviceObjects[deviceId];
      if (!device || !device.configurations) return false;
      return device.configurations.some(config =>
        config.interfaces.some(iface =>
          iface.alternates.some(alternate =>
            alternate.endpoints.some(endpoint => endpoint.direction === 'in')
          )
        )
      );
    }

    /**
     * Checks if a device supports writing.
     */
    canWrite({ DEVICE }) {
      const deviceId = Cast.toString(DEVICE);
      const device = this.deviceObjects[deviceId];
      if (!device || !device.configurations) return false;
      return device.configurations.some(config =>
        config.interfaces.some(iface =>
          iface.alternates.some(alternate =>
            alternate.endpoints.some(endpoint => endpoint.direction === 'out')
          )
        )
      );
    }

    /**
     * Reads data from a USB device.
     */
    async readFrom({ DEVICE }) {
      const deviceId = Cast.toString(DEVICE);
      if (!this.canRead({ DEVICE: deviceId }) || !this.supported()) return '';

      const device = this.deviceObjects[deviceId];
      if (!device) return '';

      if (!device.opened) await device.open();

      if (device.configuration === null) await device.selectConfiguration(1);

      // Find an unclaimed interface.
      const availableInterface = device.configurations[0].interfaces.find(iface => !iface.claimed);
      if (!availableInterface) throw new Error('No available interface to claim');

      const interfaceNumber = availableInterface.interfaceNumber;
      await device.claimInterface(interfaceNumber);
      await device.selectAlternateInterface(interfaceNumber, 0);

      const result = await device.transferIn(1, 64);
      return new TextDecoder().decode(result.data);
    }

    /**
     * Writes data to a USB device.
     */
    async writeTo({ DATA, DEVICE }) {
      const dataStr = Cast.toString(DATA);
      const deviceId = Cast.toString(DEVICE);
      if (!this.canWrite({ DEVICE: deviceId }) || !this.supported()) return;

      const device = this.deviceObjects[deviceId];
      if (!device) return;

      if (!device.opened) await device.open();

      await device.transferOut(1, new TextEncoder().encode(dataStr));
    }

    // Event handler stubs.
    onconnect() { }
    ondisconnect() { }
  }

  Scratch.extensions.register(new USB());
})(Scratch);
