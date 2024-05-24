/**!
 * Temporary Variables V3
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.1
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 * (LilyMakesThings for the original idea of Thread / Runtime variables)
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Temporary Variables V3" needs to be ran unsandboxed.`);
  }

  const extId = 'AshimeV3TempVars';
  const { vm, BlockType, Cast, ArgumentType } = Scratch, runtime = vm.runtime;
  const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
  const { JSGenerator, ScriptTreeGenerator, Thread } = iwnafhwtb;
  const { TypedInput, ConstantInput, Frame, TYPE_UNKNOWN, TYPE_BOOLEAN, VariablePool } = JSGenerator.unstable_exports;
  const JSG_proto = JSGenerator.prototype, STG_proto = ScriptTreeGenerator.prototype;

  function ScopeFrame(SafteyFrame) {
    this._frame = [SafteyFrame];
    this.pop = function() {
      this._frame.pop(this._frame.length - 1);
    };
    this.push = function(obj) {
      obj = obj ?? {};
      this._frame.push(obj);
    };
    this.get = function(backwards) {
      backwards = backwards ?? 1;
      return this._frame.at(0 - backwards) ?? this._frame[0];
    };
    this.clear = function() {
      this.pop();
      this.push();
    };
    this.dupe = function(backwards) {
      this.push(structuredClone(this.get(backwards ?? 1)));
    };
  }

  class extension {
    constructor() {
      this.RuntimeVariables = {};
      this.$ThreadVariables = Symbol(`${extId}.ThreadVariables`);
      this.$ScopeVariables = Symbol(`${extId}.ScopeVariables`);
      this.$SpriteVariables = Symbol(`${extId}.SpriteVariables`);
    }
    getInfo() {
      let blocks = [{
          blockType: BlockType.COMMAND,
          opcode: 'clr_var',
          text: 'clear all [TYPE] variables',
          arguments: {
            TYPE: { type: ArgumentType.STRING, menu: 'types' },
          },
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'del_var',
          text: 'delete [TYPE] variable [NAME]',
          arguments: {
            TYPE: { type: ArgumentType.STRING, menu: 'types' },
            NAME: { type: ArgumentType.STRING, defaultValue: 'abc' },
          },
        }, {
          blockType: BlockType.BOOLEAN,
          opcode: 'has_var',
          text: '[TYPE] variable [NAME] exists?',
          arguments: {
            TYPE: { type: ArgumentType.STRING, menu: 'types' },
            NAME: { type: ArgumentType.STRING, defaultValue: 'abc' },
          },
        }, {
          blockType: BlockType.REPORTER,
          opcode: 'get_var',
          text: '[TYPE] variable [NAME]',
          arguments: {
            TYPE: { type: ArgumentType.STRING, menu: 'types' },
            NAME: { type: ArgumentType.STRING, defaultValue: 'abc' },
          },
          allowDropAnywhere: true,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'set_var',
          text: 'set [TYPE] variable [NAME] to [VALUE]',
          arguments: {
            TYPE: { type: ArgumentType.STRING, menu: 'types' },
            NAME: { type: ArgumentType.STRING, defaultValue: 'abc' },
            VALUE: { type: ArgumentType.STRING, defaultValue: '123' },
          },
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'new_scope',
          text: 'scope', // Maybe add a name to it idk
          arguments: {
            NAME: { type: ArgumentType.STRING, defaultValue: 'abc' },
          },
          branchCount: 1,
        }, {
          blockType: BlockType.COMMAND,
          opcode: 'dbgr',
          text: 'debugger;',
          // hideFromPalette: true,
        }];
      blocks = blocks.map(block => (block?.extensions || typeof block !== 'object' ? block : {
        ...block,
        extensions: ['colours_data'],
      }));
      let colors = {
        color1: '#FF8C1A',
        color2: '#FF8000',
        color3: '#DB6E00',
        color4: '#DB6E00',
      };
      if (window?.ScratchBlocks) {
        const dataColors = ScratchBlocks.Colours.data;
        colors = {
          color1: dataColors.primary,
          color2: dataColors.secondary,
          color3: dataColors.tertiary,
          color4: dataColors.quaternary,
        };
      }
      return {
        id: extId,
        name: 'Temporary Variables V3',
        blocks,
        menus: {
          types: { acceptReporters: false, items: ['runtime', 'thread', 'scope'] },
        },
        ...colors,
      };
    }
    _fixSym(util) {
      const { thread, target } = util;
      thread[this.$ThreadVariables] = thread[this.$ThreadVariables] ?? {};
      target[this.$SpriteVariables] = thread[this.$SpriteVariables] ?? {};
    }
    _toScope(util) {
      const stackFrames = util.thread.stackFrames;
      for (let i = stackFrames.length - 1; i > -1; i--) {
        const stackFrame = stackFrames.at(i);
        if (this.$ScopeVariables in stackFrame) return stackFrame;
      }
      stackFrames[0][this.$ScopeVariables] = {};
      return stackFrames[0];
    }
    has_var({ TYPE, NAME }, util) {
      this._fixSym(util);
      TYPE = Cast.toString(TYPE);
      NAME = Cast.toString(NAME);
      if (TYPE === 'runtime') return (NAME in this.RuntimeVariables);
      if (TYPE === 'thread') return (NAME in util.thread[this.$ThreadVariables]);
      if (TYPE === 'scope') return (NAME in this._toScope(util)[this.$ScopeVariables]);
      if (TYPE === 'sprite') return (NAME in util.target[this.$SpriteVariables]);
      return false;
    }
    get_var({ TYPE, NAME }, util) {
      this._fixSym(util);
      TYPE = Cast.toString(TYPE);
      NAME = Cast.toString(NAME);
      if (TYPE === 'runtime') return (this.RuntimeVariables[NAME] ?? '');
      if (TYPE === 'thread') return (util.thread[this.$ThreadVariables][NAME] ?? '');
      if (TYPE === 'scope') return (this._toScope(util)[this.$ScopeVariables][NAME] ?? '');
      if (TYPE === 'sprite') return (util.target[this.$SpriteVariables][NAME] ?? '');
    }
    set_var({ TYPE, NAME, VALUE }, util) {
      this._fixSym(util);
      TYPE = Cast.toString(TYPE);
      NAME = Cast.toString(NAME);
      if (TYPE === 'runtime') this.RuntimeVariables[NAME] = VALUE;
      if (TYPE === 'thread') util.thread[this.$ThreadVariables][NAME] = VALUE;
      if (TYPE === 'scope') this._toScope(util)[this.$ScopeVariables][NAME] = VALUE;
      if (TYPE === 'sprite') util.target[this.$SpriteVariables][NAME] = VALUE;
    }
    del_var({ TYPE, NAME }, util) {
      this._fixSym(util);
      TYPE = Cast.toString(TYPE);
      NAME = Cast.toString(NAME);
      if (TYPE === 'runtime') delete this.RuntimeVariables[NAME];
      if (TYPE === 'thread') delete util.thread[this.$ThreadVariables][NAME];
      if (TYPE === 'scope') delete this._toScope(util)[this.$ScopeVariables][NAME];
      if (TYPE === 'sprite') delete util.target[this.$SpriteVariables][NAME];
    }
    clr_var({ TYPE }, util) {
      this._fixSym(util);
      TYPE = Cast.toString(TYPE);
      if (TYPE === 'runtime') this.RuntimeVariables = {};
      if (TYPE === 'thread') util.thread[this.$ThreadVariables] = {};
      if (TYPE === 'scope') this._toScope(util)[this.$ScopeVariables] = {};
      if (TYPE === 'sprite') util.target[this.$SpriteVariables] = {};
    }
    new_scope(_, util) {
      const stackFrames = util.thread.stackFrames;
      util.startBranch(1, false);
      const scopeFrame = stackFrames.at(-1);
      scopeFrame[this.$ScopeVariables] = {};
    }
    dbgr(_, util) {
      debugger;
    }
  }

  const BlockGet = {
    HasVarNode: `${extId}.hasVar`,
    GetVarNode: `${extId}.getVar`,
    SetVarNode: `${extId}.setVar`,
    DelVarNode: `${extId}.delVar`,
    ClrVarNode: `${extId}.clrVar`,
    NewScopeNode: `${extId}.newScope`,
    HasVarOpcode: `${extId}_has_var`,
    GetVarOpcode: `${extId}_get_var`,
    SetVarOpcode: `${extId}_set_var`,
    DelVarOpcode: `${extId}_del_var`,
    ClrVarOpcode: `${extId}_clr_var`,
    NewScopeOpcode: `${extId}_new_scope`,
    // Meh
    DbgrNode: `${extId}.debugger`,
    DbgrOpcode: `${extId}_dbgr`,
  };

  const JSGP_createScriptFactory = JSG_proto.createScriptFactory;
  JSG_proto.createScriptFactory = function(...args) {
    this.source = `
const ${extId} = runtime['ext_${extId}'];
thread[${extId}.$ThreadVariables] = {};
thread[${extId}.$ScopeVariables] = new ${extId}.exports.ScopeFrame({});
${this.source}`;
    return JSGP_createScriptFactory.call(this, ...args);
  };

  const JSGP_descendInput = JSG_proto.descendInput;
  JSG_proto.descendInput = function(node) {
    if (node.type === BlockGet.HasVarNode) {
      const NAME = this.descendInput(node.NAME).asString();
      if (node.varType === 'runtime') return new TypedInput(`(${NAME} in ${extId}.RuntimeVariables)`, TYPE_BOOLEAN);
      if (node.varType === 'thread') return new TypedInput(`(${NAME} in thread[${extId}.$ThreadVariables])`, TYPE_BOOLEAN);
      if (node.varType === 'scope') return new TypedInput(`(${NAME} in thread[${extId}.$ScopeVariables].get())`, TYPE_BOOLEAN);
      if (node.varType === 'sprite') return new TypedInput(`(${NAME} in target[${extId}.$SpriteVariables])`, TYPE_BOOLEAN);
      return new TypedInput(`(false)`, TYPE_BOOLEAN);
    }
    if (node.type === BlockGet.GetVarNode) {
      const NAME = this.descendInput(node.NAME).asString();
      if (node.varType === 'runtime') return new TypedInput(`(${extId}.RuntimeVariables[${NAME}] ?? '')`, TYPE_UNKNOWN);
      if (node.varType === 'thread') return new TypedInput(`(thread[${extId}.$ThreadVariables][${NAME}] ?? '')`, TYPE_UNKNOWN);
      if (node.varType === 'scope') return new TypedInput(`(thread[${extId}.$ScopeVariables].get()[${NAME}] ?? '')`, TYPE_UNKNOWN);
      if (node.varType === 'sprite') return new TypedInput(`(target[${extId}.$SpriteVariables][${NAME}] ?? '')`, TYPE_UNKNOWN);
      return new TypedInput(`('')`, TYPE_UNKNOWN);
    }
    return JSGP_descendInput.call(this, node);
  };
  const JSGP_descendStackedBlock = JSG_proto.descendStackedBlock;
  JSG_proto.descendStackedBlock = function(node) {
    if (node.type === BlockGet.SetVarNode) {
      const NAME = this.descendInput(node.NAME).asString();
      const VALUE = this.descendInput(node.VALUE).asSafe();
      if (node.varType === 'runtime') this.source += `\n${extId}.RuntimeVariables[${NAME}] = ${VALUE};\n`;
      if (node.varType === 'thread') this.source += `\nthread[${extId}.$ThreadVariables][${NAME}] = ${VALUE};\n`;
      if (node.varType === 'scope') this.source += `\nthread[${extId}.$ScopeVariables].get()[${NAME}] = ${VALUE};\n`;
      if (node.varType === 'sprite') this.source += `\ntarget[${extId}.$SpriteVariables][${NAME}] = ${VALUE};\n`;
      return;
    }
    if (node.type === BlockGet.DelVarNode) {
      const NAME = this.descendInput(node.NAME).asString();
      if (node.varType === 'runtime') this.source += `\ndelete ${extId}.RuntimeVariables[${NAME}];\n`;
      if (node.varType === 'thread') this.source += `\ndelete thread[${extId}.$ThreadVariables][${NAME}];\n`;
      if (node.varType === 'scope') this.source += `\ndelete thread[${extId}.$ScopeVariables].get()[${NAME}];\n`;
      if (node.varType === 'sprite') this.source += `\ndelete target[${extId}.$SpriteVariables][${NAME}];\n`;
      return;
    }
    if (node.type === BlockGet.ClrVarNode) {
      if (node.varType === 'runtime') this.source += `\n${extId}.RuntimeVariables = {};\n`;
      if (node.varType === 'thread') this.source += `\nthread[${extId}.$ThreadVariables] = {};\n`;
      if (node.varType === 'scope') this.source += `\nthread[${extId}.$ScopeVariables].clear();\n`;
      if (node.varType === 'sprite') this.source += `\ntarget[${extId}.$SpriteVariables] = {};\n`;
      return;
    }
    if (node.type === BlockGet.NewScopeNode) {
      this.source += `\nthread[${extId}.$ScopeVariables].push();\n(yield* (function*() {\n`;
      this.descendStack(node.SUBSTACK, new Frame(false));
      this.source += `\n})());\nthread[${extId}.$ScopeVariables].pop();\n`;
      return;
    }
    if (node.type === BlockGet.DbgrNode) {
      this.source += `\ndebugger;\n`; return;
    }
    return JSGP_descendStackedBlock.call(this, node);
  };

  const STGP_descendInput = STG_proto.descendInput;
  STG_proto.descendInput = function(block) {
    if (block.opcode === BlockGet.HasVarOpcode) {
      return {
        type: BlockGet.HasVarNode,
        varType: block.fields.TYPE.value,
        NAME: this.descendInputOfBlock(block, 'NAME'),
      };
    }
    if (block.opcode === BlockGet.GetVarOpcode) {
      return {
        type: BlockGet.GetVarNode,
        varType: block.fields.TYPE.value,
        NAME: this.descendInputOfBlock(block, 'NAME'),
      };
    }
    return STGP_descendInput.call(this, block);
  };
  const STGP_descendStackedBlock = STG_proto.descendStackedBlock;
  STG_proto.descendStackedBlock = function(block) {
    if (block.opcode === BlockGet.SetVarOpcode) {
      return {
        type: BlockGet.SetVarNode,
        varType: block.fields.TYPE.value,
        NAME: this.descendInputOfBlock(block, 'NAME'),
        VALUE: this.descendInputOfBlock(block, 'VALUE'),
      };
    }
    if (block.opcode === BlockGet.DelVarOpcode) {
      return {
        type: BlockGet.DelVarNode,
        varType: block.fields.TYPE.value,
        NAME: this.descendInputOfBlock(block, 'NAME'),
      };
    }
    if (block.opcode === BlockGet.ClrVarOpcode) {
      return {
        type: BlockGet.ClrVarNode,
        varType: block.fields.TYPE.value,
      };
    }
    if (block.opcode === BlockGet.NewScopeOpcode) {
      return {
        type: BlockGet.NewScopeNode,
        SUBSTACK: this.descendSubstack(block, 'SUBSTACK'),
      };
    }
    if (block.opcode === BlockGet.DbgrOpcode) {
      return {
        type: BlockGet.DbgrNode,
      };
    }
    return STGP_descendStackedBlock.call(this, block);
  };

  function fixSpriteVariables() {
    runtime.targets.forEach(target => {target[ext.$SpriteVariables] = {}});
  }

  const ext = new extension();
  runtime[`ext_${extId}`] = ext;
  vm.on('PROJECT_RUN_START', () => {
    runtime[ext.$RuntimeVariables] = {};
    fixSpriteVariables();
  });
  fixSpriteVariables();
  ext.exports = { ScopeFrame };

  Scratch.extensions.register(ext);
})(Scratch);
