// Name: USB
// Author: Mistium
// Description: Just some blocks for the web usb api

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("USB must run unsandboxed.");
  }

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
            opcode: 'closeDevice',
            blockType: BlockType.COMMAND,
            text: 'Close [DEVICE]',
            arguments: {
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
      return `${device.manufacturerName ?? ''} ${device.productName ?? ''} (${device.productId})`.trim();
    }

    _deviceKey(device, index = 0) {
      return device.serialNumber || [
        device.vendorId,
        device.productId,
        device.manufacturerName,
        device.productName,
        index
      ].map(value => value ?? '').join(':');
    }

    /**
     * Generates a list of devices for Scratch menus.
     */
    _deviceList() {
      if (!this.supported()) return ["no devices"];
      const devices = Object.entries(this.deviceObjects).map(([key, device]) => ({
        text: this._deviceGetName(device),
        value: key
      }));
      return devices.length ? devices : ["no devices"];
    }

    /**
     * Updates the list of connected USB devices.
     */
    async _updateDevices() {
      if (!this.supported()) return;
      try {
        this.openedDevices = await navigator.usb.getDevices();
      } catch (error) {
        // e.g. blocked by a permissions policy inside an iframe
        console.error('USB device list failed:', error);
        return;
      }
      this.deviceObjects = this.openedDevices.reduce((acc, device, index) => {
        acc[this._deviceKey(device, index)] = device;
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
        this.deviceObjects[this._deviceKey(device)] = device;
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
      const devices = Object.entries(this.deviceObjects).map(([key, device]) => ({
        serialNumber: device.serialNumber,
        id: key,
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
      if (!device) return '';
      if (infoKey === 'configuration') {
        // USBConfiguration is an object; report something Scratch can show
        return device.configuration ? (device.configuration.configurationName ?? device.configuration.configurationValue) : '';
      }
      const value = device[infoKey];
      return (value === undefined || value === null || typeof value === 'object') ? '' : value;
    }

    async _prepareEndpoint(device, direction) {
      if (!device.opened) await device.open();

      if (device.configuration === null) {
        const configuration = device.configurations[0];
        if (!configuration) throw new Error('No USB configuration available');
        await device.selectConfiguration(configuration.configurationValue);
      }

      for (const iface of device.configuration.interfaces) {
        for (const alternate of iface.alternates) {
          // transferIn/transferOut don't work on isochronous endpoints
          const endpoint = alternate.endpoints.find(item => item.direction === direction && item.type !== 'isochronous');
          if (!endpoint) continue;

          if (!iface.claimed) await device.claimInterface(iface.interfaceNumber);
          await device.selectAlternateInterface(iface.interfaceNumber, alternate.alternateSetting);
          return endpoint;
        }
      }

      throw new Error(`No ${direction} endpoint available`);
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

      try {
        const endpoint = await this._prepareEndpoint(device, 'in');
        const result = await device.transferIn(endpoint.endpointNumber, endpoint.packetSize || 64);
        return result.data ? new TextDecoder().decode(result.data) : '';
      } catch (error) {
        console.error('USB read failed:', error);
        return '';
      }
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

      try {
        const endpoint = await this._prepareEndpoint(device, 'out');
        await device.transferOut(endpoint.endpointNumber, new TextEncoder().encode(dataStr));
      } catch (error) {
        console.error('USB write failed:', error);
      }
    }

    /**
     * Closes a USB device so other programs can use it.
     */
    async closeDevice({ DEVICE }) {
      const device = this.deviceObjects[Cast.toString(DEVICE)];
      if (!device || !device.opened) return;
      try {
        await device.close();
      } catch (error) {
        console.error('USB close failed:', error);
      }
    }

    // Event handler stubs.
    onconnect() { }
    ondisconnect() { }
  }

  Scratch.extensions.register(new USB());
})(Scratch);
