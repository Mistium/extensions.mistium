// Name: 3D Physics
// ID: fr3d
// Description: Add cannon.js physics to objects made with the 3D extension.
// By: FreshPenguin112
// Needs: 3D (jg3d)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/fr_3d
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("3D Physics must run unsandboxed.");

    const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
    const Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAN8SURBVHhe7Zq/axRBFMfn/FGJGEuxiCAR0T9C0cJawdNCS6NiIVqYSghYaRErMWqphSYQawWD/hH+AKMkhdpYKBaCIOt7M+9t5vZm9mZn3u2d3HzgZWbuyL4333m7O/v2VCaTyWQyGSmKin0HG2s61EpRLM6bziVqPUj7jUZcgOID9Zj3YJALd54rNffYfORgZIJIOsaUV30CMH/A1kyXcYjSuhCiAngnX+UdtRadU9QxtCbEaARgxkAIKQf16V/HL7IfelTSlhBiAkRNHvlKbZWfYCBrRYh9YBumK8MWalO4QK0su8CmQINVY8Q6mM42KSQyID79favvoXOMOoKnhEQGxE0+nllqRUgV4Bm1bfKIWhFSBejy1rcx8ekvSvIpcPEsddpBNP2RFAFEr8Z1fN7MFtH0R1KupsX6K6Wm99KoCWNw9WeSToGoyccjnv5IrAA6/TsHdX+oDDP9kdSUKq8DwXuBMUp/JPUuUAaF2YC28YU+kAWfAXDPgYKzLYAlEyvANBgHoj7eg84K9iDS434hir/qN3WDuLtMHfMM0MUO+wGugZUxxNI0rXAVdCCIFUwP9hMcbpTKvUJg+uPEr9+nAXD7vFI3TtLA4uhNpd68pYGh8WkS+g89KvsmXsUW4vQJpZbmaOChutsL9bP2TamZKzQwBD82DxKgnLhvFUKoPNP3sHC5d7WR0Im7qPhaAjtjum58AuAz/kPspATjwlcdPnJYqde3aCCAQ3TnXGsF0Lc2R91OhClwDik/VB+AJYRzroPvAofIJMAQYOLabCR9MC4/DsJvgxzkHj1qxk4wDAbLXHWwj+161JwdYIETZ5rvA3aDcaCD4GC26lE4M2B4/AN6NBj2EyFc2k7QJwQHlMo2sDqxBfykCcBwkFITd2ELIehHRoA2ERb4/xNAmCwAtRNLFoDaiSULQO3EkgWgdmLxCfAS/2Bxs3tVj0XBOgCXv4ZYSe4rsbnwCYD1NHx6n11+YYJESwELnfbEATy+LlJwJVlK7IofLIs5iyGI9wsHZX3Q+xLEUfV1rILPZ1mGQ5r4QPAN0v5zNDAEFUabXAPKFeOMePAUR248q1AnOL766vMxCM4sa/J8DNEfU7noeVMDK1Z8erI5JsMXKCmUx1qcNz6KVWP2d2Qjw35LNKxgqq/F2EbxE52RwmKnZlYmk8lkMpnMpKPUP5Vz2qYC+MyLAAAAAElFTkSuQmCC";

    // PenguinMod bundles cannon.js 0.6.2; cannon-es is its maintained fork with the same API for what's used here.
    // It loads from the CDN the first time a block runs.
    let cannonPromise = null;
    function loadCannon() {
      if (!cannonPromise) {
        cannonPromise = import("https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm").catch((e) => {
          cannonPromise = null;
          throw e;
        });
      }
      return cannonPromise;
    }



    /**
     * Class for 3d Physics blocks
     */
    class Fr3DBlocks {
        constructor() {
        /**
         * The runtime instantiating this block package.
         */
        this.runtime = Scratch.vm.runtime;
        // set once cannon-es has loaded
        this.CANNON = null;
        this.world = null;
      }
      // PenguinMod loads its built-in 3D extension here. Outside PenguinMod the 3D port has to be loaded
      // separately, so look it up lazily every time (works in either load order, blocks do nothing without it).
      get _3d() {
        return this.runtime.ext_jg3d || {};
      }
      get Three() {
        return this._3d.three || {};
      }
      _loadCannon() {
        return loadCannon().then((CANNON) => {
          if (this.world) return;
          this.CANNON = CANNON;
          this.world = new this.CANNON.World();
        });
      }
        /**
         * metadata for this extension and its blocks.
         * @returns {object} -
         */
        getInfo() {
            return {
                id: 'fr3d',
                name: '3D Physics',
                color1: '#D066FE',
                color2: '#8000BC',
                blockIconURI: Icon,
                blocks: [
                    {
                        opcode: 'step',
                        text: 'step simulation',
                        blockType: BlockType.COMMAND,
                    },
                    {
                        opcode: 'addp',
                        text: 'enable physics for [NAME1]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            NAME1: { type: ArgumentType.STRING, defaultValue: "Object1" }
                        }
                    },
                    {
                        opcode: 'rmp',
                        text: 'disable physics for [NAME1]',
                        blockType: BlockType.COMMAND,
                        arguments: {
                            NAME1: { type: ArgumentType.STRING, defaultValue: "Object1" }
                        }
                    }
                ]
            };
        }
        createShapeFromGeometry(geometry) {
            if (geometry instanceof this.Three.BufferGeometry) {
                const vertices = geometry.attributes.position.array;
                const indices = [];

                for (let i = 0; i < vertices.length / 3; i++) {
                indices.push(i);
                }

                return new this.CANNON.Trimesh(vertices, indices);
            } else if (this.Three.Geometry && geometry instanceof this.Three.Geometry) {
                return new this.CANNON.ConvexPolyhedron(
                geometry.vertices.map((v) => new this.CANNON.Vec3(v.x, v.y, v.z)),
                geometry.faces.map((f) => [f.a, f.b, f.c]),
                );
            } else {
                console.warn('Unsupported geometry type for collision shape creation:', geometry.type);
                return null;
            }
        }

        enablePhysicsForObject(objectName) {
        if (!this._3d.scene) return;
        const object = this._3d.scene.getObjectByName(objectName);
        if (!object || !this._3d.scene) return;

        const shape = this.createShapeFromGeometry(object.geometry);

        if (!shape) {
          console.warn('Failed to create a valid shape for the object:', object.name);
          return;
        }

        const body = new this.CANNON.Body({
          mass: 1, // You might want to adjust mass based on object size/type
        });

        body.addShape(shape);
        this.world.addBody(body); // Add the body to the Cannon.js world

        object.userData.physicsBody = body;
      }

      disablePhysicsForObject(objectName) {
        if (!this._3d.scene) return; // crash fix: threw without a 3D scene
        const object = this._3d.scene.getObjectByName(objectName);
        if (!object || !object.userData || !object.userData.physicsBody) return;

        this.world.removeBody(object.userData.physicsBody); // Remove from world
        delete object.userData.physicsBody;
      }
        step() {
        if (!this.world) return this._loadCannon().then(() => this.step());
        // Step the Cannon.js world to simulate physics
        this.world.step(1/60); // Update at 60 fps (adjust timestep as needed)
        if (!this._3d.scene) return; // crash fix: threw without a 3D scene

        // Update Three.js object positions and rotations from physics bodies
        this._3d.scene.traverse((object) => {
          if (object.userData && object.userData.physicsBody) {
            object.position.copy(object.userData.physicsBody.position);
            object.quaternion.copy(object.userData.physicsBody.quaternion);
          }
        });
      }
        addp(args) {
            if (!this.world) return this._loadCannon().then(() => this.addp(args));
            this.enablePhysicsForObject(Cast.toString(args.NAME1))
        }

        rmp(args) {
            if (!this.world) return this._loadCannon().then(() => this.rmp(args));
            this.disablePhysicsForObject(Cast.toString(args.NAME1))
        }
    }

    Scratch.extensions.register(new Fr3DBlocks());
})(Scratch);
