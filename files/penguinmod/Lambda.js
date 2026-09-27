// Name: Lambda
// ID: jwLambda
// Description: A lambda value type: store a stack of blocks or a reporter in a value and execute it later with an argument.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jwLambda
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Lambda must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const vm = Scratch.vm;
    const shape = (name) => Scratch.BlockShape?.[name] ?? Scratch.BlockShape?.SQUARE;

    // PenguinMod saves custom values in variables as { customType: true, typeId, serialized }.
    // MistWarp/TurboWarp have no serializer registry, so: provide registerSerializer if missing, write that format via
    // toJSON when the project is saved, and turn saved values back into objects after a project loads.
    const pmTypes = (() => {
      const runtime = Scratch.vm.runtime;
      if (runtime.pmTypesShim) return runtime.pmTypesShim;
      const native = typeof runtime.registerSerializer === "function";
      if (!runtime.serializers) runtime.serializers = {};
      const isSaved = (v) => v && typeof v === "object" && v.customType === true && typeof v.typeId === "string";
      const reviveValue = (v) => {
        if (isSaved(v) && runtime.serializers[v.typeId]) return runtime.serializers[v.typeId].deserialize(v.serialized);
        if (Array.isArray(v) && v.some(isSaved)) return v.map(reviveValue);
        return v;
      };
      const revive = () => {
        for (const target of runtime.targets) {
          for (const variable of Object.values(target.variables)) variable.value = reviveValue(variable.value);
        }
      };
      if (!native) {
        runtime.registerSerializer = (id, serialize, deserialize) => {
          runtime.serializers[id] = { serialize, deserialize };
          revive();
        };
        runtime.on("PROJECT_LOADED", revive);
      }
      const shim = {
        native,
        // call on each custom value class: class.prototype gets toJSON writing PenguinMod's format
        saveable(Class) {
          if (native || Class.prototype.toJSON) return;
          Class.prototype.toJSON = function () {
            const serializer = runtime.serializers[this.customId];
            return serializer ? { customType: true, typeId: this.customId, serialized: serializer.serialize(this) } : String(this);
          };
        },
      };
      return (runtime.pmTypesShim = shim);
    })();

    // MistWarp/TurboWarp validate projects on load and turn object variable values into "[object Object]"
    // (sb3fix), so the object format above never survives a reload there. So while saving, custom values are
    // written as that same JSON inside a string, and such strings become objects again after a project loads.
    // Guarded separately from the shim so it installs whichever port loads first.
    (() => {
      const runtime = Scratch.vm.runtime;
      if (pmTypes.native || runtime.pmTypesStringSave) return;
      runtime.pmTypesStringSave = true;
      const prefix = '{"customType":true,"typeId":"';
      const encode = (v) => {
        if (Array.isArray(v)) {
          const out = v.map(encode);
          return out.some((x, i) => x !== v[i]) ? out : v;
        }
        const serializer = v && typeof v === "object" && runtime.serializers[v.customId];
        return serializer ? JSON.stringify({ customType: true, typeId: v.customId, serialized: serializer.serialize(v) }) : v;
      };
      const decode = (v) => {
        if (Array.isArray(v)) {
          const out = v.map(decode);
          return out.some((x, i) => x !== v[i]) ? out : v;
        }
        if (typeof v === "string" && v.startsWith(prefix)) {
          try {
            const saved = JSON.parse(v);
            if (runtime.serializers[saved.typeId]) return runtime.serializers[saved.typeId].deserialize(saved.serialized);
          } catch {}
        }
        return v;
      };
      const eachVariable = (fn) => {
        for (const target of runtime.targets) for (const variable of Object.values(target.variables)) fn(variable);
      };
      const toJSON = Scratch.vm.toJSON;
      Scratch.vm.toJSON = function (...args) {
        const changed = [];
        eachVariable((variable) => {
          const encoded = encode(variable.value);
          if (encoded !== variable.value) changed.push([variable, variable.value]);
          variable.value = encoded;
        });
        try {
          return toJSON.apply(this, args);
        } finally {
          for (const [variable, value] of changed) variable.value = value;
        }
      };
      const revive = () => eachVariable((variable) => { variable.value = decode(variable.value); });
      runtime.on("PROJECT_LOADED", revive);
      const register = runtime.registerSerializer;
      runtime.registerSerializer = function (...args) {
        const result = register.apply(this, args);
        revive();
        return result;
      };
    })();

    // PenguinMod compiles the branches of reporter blocks inline. MistWarp/TurboWarp can't, so a branch (or an input
    // that must be re-evaluated) runs in a separate interpreted thread that shares this thread's jw* state. It is
    // stepped immediately, so it finishes within the block unless it waits; then the block waits for it.
    // procedures_return inside it stops at the bottom frame, which is where its value is read from.
    const currentBlockId = (util) => util.thread.peekStackFrame()?.op?.id ?? util.thread.peekStack();
    const findBlocks = (util, id) => [util.thread.blockContainer, util.target.blocks, vm.runtime.flyoutBlocks]
        .find(blocks => blocks && blocks.getBlock(id));
    const inputBlockId = (util, name) => {
        const id = currentBlockId(util);
        const input = findBlocks(util, id)?.getBlock(id).inputs[name];
        // no block, or just the shadow (a literal): nothing to re-evaluate
        return input && input.block && input.block !== input.shadow ? input.block : null;
    };
    const runInline = (util, blocks, blockId, isReporter, setup) => {
        const runtime = vm.runtime;
        const parent = util.thread;
        const child = new parent.constructor(blockId);
        child.target = util.target;
        child.blockContainer = blocks;
        child.triedToCompile = true;
        child.pushStack("jwInlineEnd"); // not a block: the interpreter retires the thread when it gets back here
        const base = child.peekStackFrame();
        base.waitingReporter = true;
        base.warpMode = true; // ponytail: always warp, PenguinMod inherits the caller's warp mode
        // custom block arguments (only reachable when the caller is interpreted; compiled scripts keep them in JS locals)
        base.params = parent.stackFrames.slice().reverse().find(frame => frame.params)?.params ?? null;
        child.pushStack(blockId);
        for (const key of Object.keys(parent)) if (key.startsWith("_jw")) child[key] = parent[key];
        if (setup) setup(child);
        const result = () => isReporter ? (child.justReported ?? "") : base.executionContext?.returnValue;
        const utilThread = util.thread;
        const utilSequencer = util.sequencer;
        runtime.sequencer.stepThread(child);
        util.thread = utilThread;
        util.sequencer = utilSequencer;
        if (child.status === 4 /* STATUS_DONE */) return result();
        runtime.threads.push(child);
        child.inThreadList = true;
        return new Promise(resolve => {
            const check = () => {
                if (child.status !== 4) return;
                runtime.off("AFTER_EXECUTE", check);
                resolve(result());
            };
            runtime.on("AFTER_EXECUTE", check);
        });
    };
    const after = (value, fn) => value instanceof Promise ? value.then(fn) : fn(value);

    /**
     * @param {number} x
     * @returns {string}
     */
    function formatNumber(x) {
        if (x >= 1e6) {
            return x.toExponential(4)
        } else {
            x = Math.floor(x * 1000) / 1000
            return x.toFixed(Math.min(3, (String(x).split('.')[1] || '').length))
        }
    }

    function span(text) {
        let el = document.createElement('span')
        el.innerText = text
        el.style.display = 'hidden'
        el.style.width = '100%'
        el.style.boxSizing = 'border-box'
        el.style.textAlign = 'center'
        return el
    }

    function getFunction(x) {
        try {
            let func = (new Function(`return ${x}`))()
            if (Object.getPrototypeOf(func) == Object.getPrototypeOf(function*() {})) return func
        } catch {}
    }

    class LambdaType {
        customId = "jwLambda"

        // PenguinMod compiles the lambda's blocks into `func`. Here a lambda made from blocks keeps where they are
        // (blocks + blockId) and runs them with runInline; `func` is still used for raw JavaScript lambdas.
        blocks = null
        blockId = null
        isReporter = false

        constructor(func = function*() {}, thread) {
            this.func = func
            this.timesExecuted = 0
        }

        static toLambda(x) {
            if (x instanceof LambdaType) return x
            return new LambdaType()
        }

        static fromBlocks(blocks, blockId, isReporter) {
            const lambda = new LambdaType()
            lambda.blocks = blocks
            lambda.blockId = blockId
            lambda.isReporter = isReporter
            return lambda
        }

        jwArrayHandler() {
            return 'Lambda'
        }

        toString() {
            return this.blockId ? 'Lambda' : this.func.toString()
        }

        toReporterContent() {
            let root = span(this.toString())
            root.style.display = "block"
            root.style.textAlign = "left"
            root.style.fontFamily = "monospace"
            root.style.fontSize = "14px"
            return root
        }

        // PenguinMod's execute(arg, thread, target, runtime, stage) is a generator run inline by compiled code;
        // this returns the result, or a Promise when the lambda waits.
        execute(arg, util) {
            const args = (util.thread._jwLambdaArgument ??= [])
            args.push(arg)
            this.timesExecuted++
            const finish = (output) => {
                args.pop()
                return output ?? ""
            }
            if (this.blockId) {
                return after(runInline(util, this.blocks, this.blockId, this.isReporter, child => { child._jwLambdaThis = this }), finish)
            }
            // ponytail: raw JavaScript lambdas run to completion without yielding
            const iterator = this.func(arg, util.thread, util.target, vm.runtime, vm.runtime.getTargetForStage(), this)
            let step = iterator.next()
            while (!step.done) step = iterator.next()
            return finish(step.value)
        }
    }

    const Lambda = {
        Type: LambdaType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: shape("SQUARE"),
            forceOutputType: "Lambda",
            disableMonitor: true
        },
        Argument: {
            shape: shape("SQUARE"),
            check: ["Lambda"]
        }
    }

    class Extension {
        constructor() {
            // PenguinMod-only: the sequencer.retireThread patch for compiled lambdas isn't needed here
            vm.jwLambda = Lambda
            vm.runtime.registerSerializer(
                "jwLambda",
                v => null,
                v => new Lambda.Type()
            );
            pmTypes.saveable(LambdaType)
            // PenguinMod-only: registerCompiledExtensionBlocks. Every block has a JS implementation below; newLambda
            // keeps its branch for runInline, which needs the interpreter, so MistWarp is told not to compile scripts
            // that contain it (they fall back to the interpreter).
            // TurboWarp's compiler has no such hook: there, "new lambda" with a branch needs the compiler turned off.
            vm.exports?.compiler?.register?.("jwLambda", {
                newLambda: {
                    type: "any",
                    compile() {
                        throw new Error("jwLambda_newLambda runs in the interpreter");
                    }
                }
            });
        }

        get rawLambdaAvailable() {
            return vm.runtime.ext_SPjavascriptV2?.isEditorUnsandboxed
        }

        getInfo() {
            return {
                id: "jwLambda",
                name: "Lambda",
                color1: "#c71a4b",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+CiAgPGVsbGlwc2Ugc3R5bGU9ImZpbGw6IHJnYigxOTksIDI2LCA3NSk7IHN0cm9rZTogcmdiKDE1OSwgMjAsIDYwKTsiIGN4PSIxMCIgY3k9IjEwIiByeT0iOS41IiByeD0iOS41Ij48L2VsbGlwc2U+CiAgPHBhdGggZD0iTSA3LjIzNyA1LjI2NCBDIDEwLjM5NSA1LjI2NCAxMC4zOTUgMTQuNzM2IDEzLjU1MSAxNC43MzYgTSAxMC4wNzkgOS4wNTMgTCA2LjQ0OSAxNC43MzYiIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2U6IHJnYigyNTUsIDI1NSwgMjU1KTsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyBzdHJva2Utd2lkdGg6IDJweDsiPjwvcGF0aD4KPC9zdmc+",
                blocks: [
                    {
                        opcode: 'arg',
                        text: 'argument',
                        blockType: BlockType.REPORTER,
                        hideFromPalette: false, // PenguinMod-only: fillIn, see newLambda
                        allowDropAnywhere: true,
                        canDragDuplicate: true
                    },
                    {
                        opcode: 'newLambda',
                        text: 'new lambda [ARG]',
                        hideFromPalette: true,
                        arguments: {
                            // PenguinMod-only: fillIn (a draggable "argument" in the slot); the slot is empty and
                            // "argument" is shown in the palette instead
                            ARG: {}
                        },
                        // PenguinMod's `branches: [{}]` on a reporter; branchCount adds the same SUBSTACK input
                        branchCount: 1,
                        ...Lambda.Block
                    },
                    {
                        blockType: BlockType.XML,
                        xml: `
                        <block type="jwLambda_newLambda">
                            <value name="SUBSTACK">
                                <block type="procedures_return">
                                    <value name="VALUE">
                                        <shadow type="text">
                                            <field name="TEXT">1</field>
                                        </shadow>
                                    </value>
                                </block>
                            </value>
                        </block>
                        `
                    },
                    {
                        opcode: 'newLambdaR',
                        text: 'new lambda [ARG] [VALUE]',
                        arguments: {
                            ARG: {},
                            VALUE: {
                                type: ArgumentType.STRING,
                                exemptFromNormalization: true
                            }
                        },
                        ...Lambda.Block
                    },
                    {
                        opcode: 'rawLambdaInput',
                        text: '[FIELD]',
                        hideFromPalette: true,
                        blockType: BlockType.REPORTER,
                        blockShape: shape("SQUARE"),
                        arguments: {
                            FIELD: {
                                // PenguinMod-only: the SPjavascriptV2 code editor field; a plain text field
                                type: ArgumentType.STRING,
                                defaultValue: "function* (arg, thread, target, runtime, stage) {\n  return 1;\n}"
                            }
                        }
                    },
                    {
                        opcode: 'rawLambda',
                        text: 'new lambda [RAW]',
                        hideFromPalette: true/*!this.rawLambdaAvailable || !(typeof ScratchBlocks === "object")*/,
                        arguments: {
                            RAW: {}
                        },
                        ...Lambda.Block
                    },
                    "---",
                    {
                        opcode: 'execute',
                        text: 'execute [LAMBDA] with [ARG]',
                        arguments: {
                            LAMBDA: Lambda.Argument,
                            ARG: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            }
                        }
                    },
                    {
                        opcode: 'executeR',
                        text: 'execute [LAMBDA] with [ARG]',
                        blockType: BlockType.REPORTER,
                        allowDropAnywhere: true,
                        arguments: {
                            LAMBDA: Lambda.Argument,
                            ARG: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'this',
                        text: 'this lambda',
                        ...Lambda.Block
                    },
                    {
                        opcode: 'timesExecuted',
                        text: 'times [LAMBDA] executed',
                        blockType: BlockType.REPORTER,
                        arguments: {
                            LAMBDA: Lambda.Argument
                        }
                    }
                ]
            };
        }

        arg({}, util) {
            return util.thread._jwLambdaArgument ? util.thread._jwLambdaArgument[util.thread._jwLambdaArgument.length-1] : ""
        }

        newLambda(args, util) {
            const id = currentBlockId(util)
            const blocks = findBlocks(util, id)
            const substack = blocks && blocks.getBlock(id).inputs.SUBSTACK?.block
            return substack ? Lambda.Type.fromBlocks(blocks, substack, false) : new Lambda.Type()
        }
        newLambdaR({VALUE}, util) {
            // PenguinMod evaluates VALUE each time the lambda runs; the VALUE reporter is kept and re-run the same way
            const valueBlock = inputBlockId(util, "VALUE")
            if (valueBlock) return Lambda.Type.fromBlocks(findBlocks(util, valueBlock), valueBlock, true)
            return new Lambda.Type(function*() { return VALUE })
        }

        rawLambdaInput({FIELD}) {
            return FIELD
        }
        rawLambda({RAW}) {
            if (!this.rawLambdaAvailable) return new Lambda.Type()
            let func = getFunction(Cast.toString(RAW))
            return new Lambda.Type(func)
        }

        this({}, util) {
            return util.thread._jwLambdaThis ?? new Lambda.Type()
        }

        execute({LAMBDA, ARG}, util) {
            const result = Lambda.Type.toLambda(LAMBDA).execute(ARG, util)
            if (result instanceof Promise) return result.then(() => {})
        }
        executeR({LAMBDA, ARG}, util) {
            return Lambda.Type.toLambda(LAMBDA).execute(ARG, util)
        }

        timesExecuted({LAMBDA}) {
            LAMBDA = Lambda.Type.toLambda(LAMBDA)
            return LAMBDA.timesExecuted
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
