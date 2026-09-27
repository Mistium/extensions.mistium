// Name: Psychic
// ID: jwPsychic
// Description: 2D physics for sprites, powered by matter-js.
// By: jwklong
// Needs: Vector (jwVector), Array (jwArray), Targets (jwTargets)
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jwPsychic
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Psychic must run unsandboxed.");
  const { BlockType, ArgumentType, TargetType, Cast } = Scratch;
  const vm = Scratch.vm;

  // matter-js (MIT) is loaded from jsDelivr the first time a block runs.
  let Matter = null;
  let matterPromise = null;
  const loadMatter = () =>
    (matterPromise ??= import("https://cdn.jsdelivr.net/npm/matter-js@0.20.0/+esm").then((m) => (Matter = m.default ?? m)));

  // Needs jwVector, jwArray and jwTargets. Read lazily so this works whichever extension loads first;
  // blocks that need a missing one return "" / do nothing.
  const vectorBlock = () => vm.jwVector?.Block ?? { blockType: BlockType.REPORTER, disableMonitor: true };
  const vectorArgument = () => vm.jwVector?.Argument ?? { type: ArgumentType.STRING, defaultValue: "" };
  const arrayBlock = () => vm.jwArray?.Block ?? { blockType: BlockType.REPORTER, disableMonitor: true };

  class Extension {
    constructor() {
      this.engine = null;
      /** @type {Object<string, Matter.Body>} */
      this.bodies = {};
      /** @type {Matter.Composite?} */
      this.bounds = null;

      vm.runtime.on("PROJECT_START", this.reset.bind(this));

      vm.PsychicDebug = this;

      // Every block waits for matter-js the first time; after that they run synchronously.
      for (const block of this.getInfo().blocks) {
        if (typeof block !== "object") continue;
        const fn = this[block.opcode].bind(this);
        this[block.opcode] = (args, util) => {
          if (Matter) {
            if (!this.engine) this.reset();
            return fn(args, util);
          }
          return loadMatter().then(() => {
            if (!this.engine) this.reset();
            return fn(args, util);
          });
        };
      }
    }

    getInfo() {
        return {
            id: "jwPsychic",
            name: "Psychic",
            color1: "#b16bed",
            menuIconURI: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM6Yng9Imh0dHBzOi8vYm94eS1zdmcuY29tIiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4Ij48ZGVmcz48Yng6ZXhwb3J0PjxieDpmaWxlIGZvcm1hdD0ic3ZnIi8+PC9ieDpleHBvcnQ+PC9kZWZzPjxlbGxpcHNlIHN0eWxlPSJzdHJva2Utd2lkdGg6IDJweDsgcGFpbnQtb3JkZXI6IHN0cm9rZTsgZmlsbDogcmdiKDE3NywgMTA3LCAyMzcpOyBzdHJva2U6IHJnYigxNTksIDk2LCAyMTMpOyIgY3g9IjEwIiBjeT0iMTAiIHJ4PSI5IiByeT0iOSIvPjxyZWN0IHg9IjQuNjM0IiB5PSIxMC4yMjgiIHdpZHRoPSI0Ljc3IiBoZWlnaHQ9IjQuNzciIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7Ii8+PHJlY3QgeD0iMTAuNTk2IiB5PSIxMC4yMjgiIHdpZHRoPSI0Ljc3IiBoZWlnaHQ9IjQuNzciIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7Ii8+PHJlY3QgeD0iNy42MTUiIHdpZHRoPSI0Ljc3IiBoZWlnaHQ9IjQuNzciIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IiB5PSI0LjI2NyIvPjwvc3ZnPg==",
            blocks: [
                {
                    opcode: 'tick',
                    text: 'tick',
                    blockType: BlockType.COMMAND
                },
                "---",
                {
                    opcode: 'boundaries',
                    text: 'set boundaries [OPTION]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        OPTION: {
                            type: ArgumentType.STRING,
                            menu: 'boundariesOption'
                        }
                    }
                },
                {
                    opcode: 'setGravity',
                    text: 'set gravity to [VECTOR]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VECTOR: vectorArgument()
                    }
                },
                {
                    opcode: 'getGravity',
                    text: 'gravity',
                    ...vectorBlock()
                },
                "---",
                {
                    opcode: 'enablePhysics',
                    text: 'enable physics as [OPTION]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        OPTION: {
                            type: ArgumentType.STRING,
                            menu: 'enablePhysicsOption'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'disablePhysics',
                    text: 'disable physics',
                    blockType: BlockType.COMMAND,
                    filter: [TargetType.SPRITE]
                },
                "---",
                {
                    opcode: 'setPos',
                    text: 'set position to [VECTOR]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VECTOR: vectorArgument()
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getPos',
                    text: 'position',
                    filter: [TargetType.SPRITE],
                    ...vectorBlock()
                },
                {
                    opcode: 'setVel',
                    text: 'set velocity to [VECTOR]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VECTOR: vectorArgument()
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getVel',
                    text: 'velocity',
                    filter: [TargetType.SPRITE],
                    ...vectorBlock()
                },
                {
                    opcode: 'setRot',
                    text: 'set rotation to [ANGLE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 90
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getRot',
                    text: 'rotation',
                    blockType: BlockType.REPORTER,
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setAngVel',
                    text: 'set angular velocity to [ANGLE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getAngVel',
                    text: 'angular velocity',
                    blockType: BlockType.REPORTER,
                    filter: [TargetType.SPRITE]
                },
                "---",
                {
                    opcode: 'getMass',
                    text: 'mass',
                    blockType: BlockType.REPORTER,
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setDensity',
                    text: 'set density to [NUMBER]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.001
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getDensity',
                    text: 'density',
                    blockType: BlockType.REPORTER,
                    filter: [TargetType.SPRITE]
                },
                "---",
                {
                    opcode: 'setStatic',
                    text: 'set fixed to [BOOLEAN]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BOOLEAN: {
                            type: ArgumentType.BOOLEAN
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getStatic',
                    text: 'fixed',
                    blockType: BlockType.BOOLEAN,
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setRotatable',
                    text: 'set rotatable to [BOOLEAN]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BOOLEAN: {
                            type: ArgumentType.BOOLEAN
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getRotatable',
                    text: 'rotatable',
                    blockType: BlockType.BOOLEAN,
                    filter: [TargetType.SPRITE]
                },
                "---",
                {
                    opcode: 'setFric',
                    text: 'set friction to [NUMBER]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.1
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getFric',
                    text: 'friction',
                    blockType: BlockType.REPORTER,
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setAirFric',
                    text: 'set air resistance to [NUMBER]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.01
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getAirFric',
                    text: 'air resistance',
                    blockType: BlockType.REPORTER,
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'setRest',
                    text: 'set restitution to [NUMBER]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getRest',
                    text: 'restitution',
                    blockType: BlockType.REPORTER,
                    filter: [TargetType.SPRITE]
                },
                "---",
                {
                    opcode: 'getCollides',
                    text: 'targets colliding with [OPTION]',
                    arguments: {
                        OPTION: {
                            type: ArgumentType.STRING,
                            menu: 'touchingOption'
                        }
                    },
                    filter: [TargetType.SPRITE],
                    ...arrayBlock()
                }
            ],
            menus: {
                enablePhysicsOption: [
                    'precise',
                    'box',
                    'circle'
                ],
                boundariesOption: [
                    'all',
                    'floor',
                    'none'
                ],
                touchingOption: [
                    'body',
                    'feet',
                    'head'
                ]
            }
        };
    }

    vectorToMatter(vector) {
        return Matter.Vector.create(vector.x, -vector.y)
    }

    matterToVector(matter) {
        if (!vm.jwVector) return "" // Needs jwVector
        return new vm.jwVector.Type(matter.x, -matter.y)
    }

    angleToMatter(angle) {
        return (angle - 90) * Math.PI / 180
    }

    matterToAngle(matter) {
        return (matter * 180 / Math.PI) + 90
    }

    reset() {
        this.engine = Matter ? Matter.Engine.create() : null
        this.bodies = {}
        this.bounds = null
    }

    correctBody(id) {
        /** @type {Matter.Body} */
        let body = this.bodies[id]
        let target = vm.runtime.getTargetById(id)

        if (target == undefined) {
            Matter.Composite.remove(this.engine.world, body)
            delete this.bodies[id]
            return
        }

        Matter.Body.setPosition(body, Matter.Vector.create(target.x, -target.y))
        Matter.Body.setAngle(body, this.angleToMatter(target.direction))
    }

    correctTarget(id) {
        /** @type {Matter.Body} */
        let body = this.bodies[id]
        let target = vm.runtime.getTargetById(id)

        target.setXY(body.position.x, -body.position.y, false, true)
        target.setDirection(this.matterToAngle(body.angle))
    }

    tick() {
        let fps = vm.runtime.frameLoop.framerate
        if (fps == 0) fps = 60

        for (let id of Object.keys(this.bodies)) {
            this.correctBody(id)
        }

        Matter.Engine.update(this.engine, 1000 / fps)

        for (let id of Object.keys(this.bodies)) {
            this.correctTarget(id)
        }
    }

    boundaries({OPTION}) {
        if (this.bounds) {
            Matter.Composite.remove(this.engine.world, this.bounds)
            this.bounds = null
        }

        let stageWidth = vm.runtime.stageWidth
        let stageHeight = vm.runtime.stageHeight

        this.bounds = Matter.Composite.create()

        switch (OPTION) {
            case 'all':
                Matter.Composite.add(this.bounds, [
                    Matter.Bodies.rectangle(-stageWidth, 0, stageWidth, Number.MAX_SAFE_INTEGER / 2, { isStatic: true }),
                    Matter.Bodies.rectangle(stageWidth, 0, stageWidth, Number.MAX_SAFE_INTEGER / 2, { isStatic: true }),
                    Matter.Bodies.rectangle(0, -stageHeight, Number.MAX_SAFE_INTEGER / 2, stageHeight, { isStatic: true }),
                ])
            case 'floor':
                Matter.Composite.add(this.bounds, Matter.Bodies.rectangle(0, stageHeight, Number.MAX_SAFE_INTEGER / 2, stageHeight, { isStatic: true }))
                break
        }

        Matter.Composite.add(this.engine.world, this.bounds)
    }

    setGravity({VECTOR}) {
        if (!vm.jwVector) return // Needs jwVector
        let v = vm.jwVector.Type.toVector(VECTOR)
        this.engine.gravity.x = v.x
        this.engine.gravity.y = -v.y
    }

    getGravity() {
        return this.matterToVector(this.engine.gravity)
    }

    enablePhysics({OPTION}, util) {
        let target = util.target
        let costume = target.getCostumes()[target.currentCostume]
        let size = {
            x: costume.size[0] * (target.size / 100) * ((target.stretch?.[0] ?? 100) / 100) / costume.bitmapResolution,
            y: costume.size[1] * (target.size / 100) * ((target.stretch?.[1] ?? 100) / 100) / costume.bitmapResolution
        }

        console.debug(size)

        /** @type {Matter.Body?} */
        let body = null
        switch (OPTION) {
            case 'precise':
                throw "i need to finish precise mb"
                break
            case 'box':
                body = Matter.Bodies.rectangle(target.x, -target.y, size.x, size.y)
                break
            case 'circle':
                body = Matter.Bodies.circle(target.x, -target.y, Math.max(size.x, size.y) / 2)
                break
            default:
                throw "Invalid physics option"
        }

        body.label = target.id

        this.bodies[target.id] = body
        Matter.Composite.add(this.engine.world, body)

        this.correctBody(target.id)
    }

    disablePhysics({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        Matter.Composite.remove(this.engine.world, body)
        // crash fix: PenguinMod used an undefined `id` here
        delete this.bodies[util.target.id]
        return
    }

    setPos({VECTOR}, util) {
        if (!vm.jwVector) return // Needs jwVector
        let v = vm.jwVector.Type.toVector(VECTOR)
        util.target.setXY(v.x, v.y)
    }

    getPos({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return vm.jwVector ? new vm.jwVector.Type(util.target.x, util.target.y) : ""
        return this.matterToVector(body.position)
    }

    setRot({ANGLE}, util) {
        let a = Cast.toNumber(ANGLE)
        util.target.setDirection(a)
    }

    getRot({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return util.target.direction
        return this.matterToAngle(body.angle)
    }

    setVel({VECTOR}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        if (!vm.jwVector) return // Needs jwVector
        let v = vm.jwVector.Type.toVector(VECTOR)
        Matter.Body.setVelocity(body, this.vectorToMatter(v))
    }

    getVel({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return vm.jwVector ? new vm.jwVector.Type(0, 0) : ""
        return this.matterToVector(body.velocity)
    }

    setAngVel({ANGLE}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        Matter.Body.setAngularVelocity(body, Cast.toNumber(ANGLE))
    }

    getAngVel({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return 0
        return body.angularVelocity
    }

    getMass({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return 0
        return body.mass
    }

    getDensity({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return 0.001
        return body.density
    }

    setDensity({NUMBER}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        // crash fix: PenguinMod forgot the body argument
        Matter.Body.setDensity(body, Cast.toNumber(NUMBER))
    }

    getStatic({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return false
        return body.isStatic
    }

    setStatic({BOOLEAN}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        body.isStatic = BOOLEAN
    }

    getRotatable({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return true
        return body.inertia !== Infinity
    }

    setRotatable({BOOLEAN}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        if (BOOLEAN) {
            Matter.Body.setVertices(body, body.vertices)
        } else {
            Matter.Body.setInertia(body, Infinity)
        }
    }

    setFric({NUMBER}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        body.friction = Cast.toNumber(NUMBER)
    }

    getFric({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return 0.1
        return body.friction
    }

    setAirFric({NUMBER}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        body.frictionAir = Cast.toNumber(NUMBER)
    }

    getAirFric({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return 0.01
        return body.frictionAir
    }

    setRest({NUMBER}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return
        body.restitution = Cast.toNumber(NUMBER)
    }

    getRest({}, util) {
        let body = this.bodies[util.target.id]
        if (!body) return 0.01
        return body.restitution
    }

    getCollides({OPTION}, util) {
        let body = this.bodies[util.target.id]
        if (!vm.jwArray || !vm.jwTargets) return "" // Needs jwArray + jwTargets
        if (!body) return new vm.jwArray.Type()

        let collisions = Matter.Query.collides(body, Object.values(this.bodies).filter(v => v.label !== util.target.id))

        if (OPTION !== 'body') {
            collisions = collisions.filter(v => v.supports[0].x > body.bounds.min.x+1 && v.supports[0].x < body.bounds.max.x-1)
            console.debug(collisions)
            switch (OPTION) {
                case 'feet':
                    collisions = collisions.filter(v => {
                        for (let support of v.supports) {
                            if (support == null) continue
                            if (support.y > body.bounds.max.y-4) return true
                        }
                    })
                    break
                case 'head':
                    collisions = collisions.filter(v => {
                        for (let support of v.supports) {
                            if (support == null) continue
                            if (support.y < body.bounds.min.y+4) return true
                        }
                    })
                    break
            }
            console.debug(collisions)
        }

        let bodies = collisions.map(v => body == v.bodyA ? v.bodyB : v.bodyA)
        bodies.filter(v => v.label !== util.target.id)
        return new vm.jwArray.Type(bodies.map(v => new vm.jwTargets.Type(v.label)))
    }
}


  Scratch.extensions.register(new Extension());
})(Scratch);
