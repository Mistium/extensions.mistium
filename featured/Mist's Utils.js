/**!
 * Mist's Utils
 * @author Mistium (mistium.com), Miyo (miyo.lol)
 * @version 5.9
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */


(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("mistsutils needs to be run unsandboxed.");
  }

  const {
    vm,
    BlockType,
    ArgumentType
  } = Scratch;
  const {
    runtime
  } = vm;
  const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
  const {
    JSGenerator,
    IRGenerator,
    ScriptTreeGenerator
  } = iwnafhwtb;
  const {
    TYPE_NUMBER,
    TYPE_STRING,
    TYPE_BOOLEAN,
    TYPE_UNKNOWN,
    TYPE_NUMBER_NAN,
    TypedInput,
    ConstantInput,
    VariableInput,
    Frame,
    sanitize
  } = JSGenerator.unstable_exports;
  const JSGP = JSGenerator.prototype,
    IRGP = IRGenerator.prototype,
    STGP = ScriptTreeGenerator.prototype;
  ConstantInput.prototype.asRaw = function() {
    return this.constantValue;
  };
  TypedInput.prototype.asRaw = function() {
    return this.asUnknown();
  };
  TypedInput.prototype.asSafe = function() {
    return this.asUnknown();
  };
  VariableInput.prototype.asRaw = function() {
    return this.asSafe();
  };
  const AT = Scratch.ArgumentType;
  const BT = Scratch.BlockType;
  const PATCHES_ID = 'mistsutils_patches';
  const cst_patch = (obj, functions) => {
    if (obj[PATCHES_ID]) return;
    obj[PATCHES_ID] = {};
    for (const name in functions) {
      const original = obj[name];
      obj[PATCHES_ID][name] = obj[name];
      if (original) {
        obj[name] = function(...args) {
          const callOriginal = (...args) => original.call(this, ...args);
          return functions[name].call(this, callOriginal, ...args);
        };
      } else {
        obj[name] = function(...args) {
          return functions[name].call(this, () => {}, ...args);
        };
      }
    }
  };
  cst_patch(JSGP, {
    descendStackedBlock(fn, node, ...args) {
      let b = node.block;
      switch (node.kind) {
        case 'mistsutils.notequals':
          const notequals_1 = this.descendInput(node.A).asString();
          const notequals_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${notequals_1} !== ${notequals_2}))\n`;
          return;
        case 'mistsutils.equals':
          const equals_1 = this.descendInput(node.A).asString();
          const equals_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${equals_1} === ${equals_2}))\n`;
          return;
        case 'mistsutils.greaterorequal':
          const greaterorequal_1 = this.descendInput(node.A).asNumber();
          const greaterorequal_2 = this.descendInput(node.B).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", (${greaterorequal_1} >= ${greaterorequal_2}))\n`;
          return;
        case 'mistsutils.lessthanorequal':
          const lessthanorequal_1 = this.descendInput(node.A).asNumber();
          const lessthanorequal_2 = this.descendInput(node.B).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", (${lessthanorequal_1} <= ${lessthanorequal_2}))\n`;
          return;
        case 'mistsutils.compare':
          const compare_1 = this.descendInput(node.A).asNumber();
          const compare_2 = this.descendInput(node.B).asNumber();
          const compare_3 = this.descendInput(node.C).asRaw();
          this.source += `vm.runtime.visualReport("${b.id}", (${compare_1} ${compare_3} ${compare_2}))\n`;
          return;
        case 'mistsutils.power':
          const power_1 = this.descendInput(node.A).asNumber();
          const power_2 = this.descendInput(node.B).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", Math.pow(${power_1}, ${power_2}))\n`;
          return;
        case 'mistsutils.round':
          const round_1 = this.descendInput(node.A).asNumber();
          const round_2 = this.descendInput(node.B).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", Math.round(${round_1} / ${round_2}) * ${round_2})\n`;
          return;
        case 'mistsutils.clamp':
          const clamp_1 = this.descendInput(node.A).asNumber();
          const clamp_2 = this.descendInput(node.B).asNumber();
          const clamp_3 = this.descendInput(node.C).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", Math.min(Math.max(${clamp_1}, ${clamp_2}), ${clamp_3}))\n`;
          return;
        case 'mistsutils.min':
          const min_1 = this.descendInput(node.A).asNumber();
          const min_2 = this.descendInput(node.B).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", Math.min(${min_1}, ${min_2}))\n`;
          return;
        case 'mistsutils.max':
          const max_1 = this.descendInput(node.A).asNumber();
          const max_2 = this.descendInput(node.B).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", Math.max(${max_1}, ${max_2}))\n`;
          return;
        case 'mistsutils.interpolate':
          const interpolate_1 = this.descendInput(node.A).asNumber();
          const interpolate_2 = this.descendInput(node.B).asNumber();
          const interpolate_3 = this.descendInput(node.C).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", ${interpolate_2} + ((${interpolate_3} - ${interpolate_2}) / ${interpolate_1}))\n`;
          return;
        case 'mistsutils.ifthen':
          const ifthen_1 = this.descendInput(node.A).asBoolean();
          const ifthen_2 = this.descendInput(node.B).asString();
          const ifthen_3 = this.descendInput(node.C).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${ifthen_1} ? ${ifthen_2} : ${ifthen_3}))\n`;
          return;
        case 'mistsutils.letters':
          const letters_1 = this.descendInput(node.A).asNumber();
          const letters_2 = this.descendInput(node.B).asNumber();
          const letters_3 = this.descendInput(node.C).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${letters_3}).substring(Math.max(0,${letters_1}-1), Math.min(${letters_2}, ${letters_3}.length)))\n`;
          return;
        case 'mistsutils.starts':
          const starts_1 = this.descendInput(node.A).asString();
          const starts_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${starts_1}.startsWith(${starts_2}))\n`;
          return;
        case 'mistsutils.ends':
          const ends_1 = this.descendInput(node.A).asString();
          const ends_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${ends_1}.endsWith(${ends_2}))\n`;
          return;
        case 'mistsutils.toUnicode':
          const toUnicode_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${toUnicode_1}).charCodeAt(0))\n`;
          return;
        case 'mistsutils.replace':
          const replace_1 = this.descendInput(node.A).asString();
          const replace_2 = this.descendInput(node.B).asString();
          const replace_3 = this.descendInput(node.C).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${replace_1}.replace(${replace_3},${replace_2}))\n`;
          return;
        case 'mistsutils.replaceall':
          const replaceall_1 = this.descendInput(node.A).asString();
          const replaceall_2 = this.descendInput(node.B).asString();
          const replaceall_3 = this.descendInput(node.C).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${replaceall_1}.replaceAll(${replaceall_3},${replaceall_2}))\n`;
          return;
        case 'mistsutils.alltextAfterString':
          const alltextAfterString_1 = this.descendInput(node.A).asString();
          const alltextAfterString_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${alltextAfterString_1}.substring(${alltextAfterString_1}.indexOf(""+${alltextAfterString_2}) + 1, (${alltextAfterString_1}.length)))\n`;
          return;
        case 'mistsutils.alltextBeforeString':
          const alltextBeforeString_1 = this.descendInput(node.A).asString();
          const alltextBeforeString_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${alltextBeforeString_1}).split(${alltextBeforeString_2},1)[0])\n`;
          return;
        case 'mistsutils.split':
          const split_1 = this.descendInput(node.A).asString();
          const split_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", JSON.stringify((${split_1}).split(${split_2})))\n`;
          return;
        case 'mistsutils.splitarray':
          const splitarray_1 = this.descendInput(node.A).asString();
          const splitarray_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${splitarray_1}).split(${splitarray_2}))\n`;
          return;
        case 'mistsutils.length':
          const length_1 = this.descendInput(node.A).asRaw();
          this.source += `vm.runtime.visualReport("${b.id}", ((${length_1}).length))\n`;
          return;
        case 'mistsutils.item':
          const item_1 = this.descendInput(node.A).asRaw();
          const item_2 = this.descendInput(node.B).asString();
          const item_3 = this.descendInput(node.C).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", (${item_1}).split(${item_2})[${item_3}])\n`;
          return;
        case 'mistsutils.squarebrackets':
          const squarebrackets_1 = this.descendInput(node.A).asRaw();
          const squarebrackets_2 = this.descendInput(node.B).asString();
          this.source += `vm.runtime.visualReport("${b.id}", (${squarebrackets_1})[${squarebrackets_2}])\n`;
          return;
        case 'mistsutils.jsonparse':
          const jsonparse_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", JSON.parse(${jsonparse_1}))\n`;
          return;
        case 'mistsutils.jsonstringify':
          const jsonstringify_1 = this.descendInput(node.A).asRaw();
          this.source += `vm.runtime.visualReport("${b.id}", JSON.stringify(${jsonstringify_1}))\n`;
          return;
        case 'mistsutils.isnumber':
          const isnumber_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", Number(${isnumber_1}) == ${isnumber_1})\n`;
          return;
        case 'mistsutils.isstring':
          const isstring_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", String(${isstring_1}) == ${isstring_1})\n`;
          return;
        case 'mistsutils.isboolean':
          const isboolean_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${isboolean_1} == "true" || ${isboolean_1} == "false")\n`;
          return;
        case 'mistsutils.tostring':
          const tostring_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${tostring_1})\n`;
          return;
        case 'mistsutils.tonumber':
          const tonumber_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", isNaN(Number(${tonumber_1})) ? 0 : Number(${tonumber_1}))\n`;
          return;
        case 'mistsutils.toboolean':
          const toboolean_1 = this.descendInput(node.A).asString();
          this.source += `vm.runtime.visualReport("${b.id}", ${toboolean_1} == "true" || ${toboolean_1} == "1" || ${toboolean_1} == "yes" ? "true" : "false")\n`;
          return;
        case 'mistsutils.patchreporter':
          const patchreporter_1 = this.descendInput(node.A).asRaw();
          this.source += `vm.runtime.visualReport("${b.id}", ${patchreporter_1})\n`;
          return;
        case 'mistsutils.patchreporter2':
          const patchreporter2_1 = this.descendInput(node.A).asRaw();
          const patchreporter2_2 = this.descendInput(node.B).asRaw();
          this.source += `vm.runtime.visualReport("${b.id}", ${patchreporter2_1}${patchreporter2_2})\n`;
          return;
        case 'mistsutils.patchreporter3':
          const patchreporter3_1 = this.descendInput(node.A).asRaw();
          const patchreporter3_2 = this.descendInput(node.B).asRaw();
          const patchreporter3_3 = this.descendInput(node.C).asRaw();
          this.source += `vm.runtime.visualReport("${b.id}", ${patchreporter3_1}${patchreporter3_2}${patchreporter3_3})\n`;
          return;
        case 'mistsutils.patchboolean':
          const patchboolean_1 = this.descendInput(node.A).asRaw();
          this.source += `vm.runtime.visualReport("${b.id}", ${patchboolean_1})\n`;
          return;
        case 'mistsutils.patchcommand':
          const patchcommand_1 = this.descendInput(node.A).asRaw();
          this.source += `${patchcommand_1}\n`;
          return;
        case 'mistsutils.patchcommand2':
          const patchcommand2_1 = this.descendInput(node.A).asRaw();
          const patchcommand2_2 = this.descendInput(node.B).asRaw();
          this.source += `${patchcommand2_1}${patchcommand2_2}\n`;
          return;
        case 'mistsutils.patchcommand3':
          const patchcommand3_1 = this.descendInput(node.A).asRaw();
          const patchcommand3_2 = this.descendInput(node.B).asRaw();
          const patchcommand3_3 = this.descendInput(node.C).asRaw();
          this.source += `${patchcommand3_1}${patchcommand3_2}${patchcommand3_3}\n`;
          return;
        case 'mistsutils.true':
          this.source += `vm.runtime.visualReport("${b.id}", true)\n`;
          return;
        case 'mistsutils.false':
          this.source += `vm.runtime.visualReport("${b.id}", false)\n`;
          return;
        case 'mistsutils.isPackaged':
          this.source += `vm.runtime.visualReport("${b.id}", (typeof window.scaffolding === 'object'))\n`;
          return;
        case 'mistsutils.performancenow':
          this.source += `vm.runtime.visualReport("${b.id}", performance.now())\n`;
          return;
        case 'mistsutils.stagewidth':
          this.source += `vm.runtime.visualReport("${b.id}", Scratch.vm.runtime.stageWidth)\n`;
          return;
        case 'mistsutils.stageheight':
          this.source += `vm.runtime.visualReport("${b.id}", Scratch.vm.runtime.stageHeight)\n`;
          return;
        case 'mistsutils.newline':
          this.source += `vm.runtime.visualReport("${b.id}", "\\n")\n`;
          return;
        case 'mistsutils.pi':
          this.source += `vm.runtime.visualReport("${b.id}", Math.PI)\n`;
          return;
        case 'mistsutils.e':
          this.source += `vm.runtime.visualReport("${b.id}", Math.E)\n`;
          return;
        case 'mistsutils.infinity':
          this.source += `vm.runtime.visualReport("${b.id}", Infinity)\n`;
          return;
        case 'mistsutils.MaxInt':
          this.source += `vm.runtime.visualReport("${b.id}", Number.MAX_SAFE_INTEGER)\n`;
          return;
        default:
          return fn(node, ...args);
      }
    },
    descendInput(fn, node, ...args) {
      switch (node.kind) {
        case 'mistsutils.notequals':
          const notequals_1 = this.descendInput(node.A).asString();
          const notequals_2 = this.descendInput(node.B).asString();
          return new TypedInput(`(${notequals_1} !== ${notequals_2})`, TYPE_BOOLEAN);
        case 'mistsutils.equals':
          const equals_1 = this.descendInput(node.A).asString();
          const equals_2 = this.descendInput(node.B).asString();
          return new TypedInput(`(${equals_1} === ${equals_2})`, TYPE_BOOLEAN);
        case 'mistsutils.greaterorequal':
          const greaterorequal_1 = this.descendInput(node.A).asNumber();
          const greaterorequal_2 = this.descendInput(node.B).asNumber();
          return new TypedInput(`(${greaterorequal_1} >= ${greaterorequal_2})`, TYPE_BOOLEAN);
        case 'mistsutils.lessthanorequal':
          const lessthanorequal_1 = this.descendInput(node.A).asNumber();
          const lessthanorequal_2 = this.descendInput(node.B).asNumber();
          return new TypedInput(`(${lessthanorequal_1} <= ${lessthanorequal_2})`, TYPE_BOOLEAN);
        case 'mistsutils.compare':
          const compare_1 = this.descendInput(node.A).asNumber();
          const compare_2 = this.descendInput(node.B).asNumber();
          const compare_3 = this.descendInput(node.C).asRaw();
          return new TypedInput(`(${compare_1} ${compare_3} ${compare_2})`, TYPE_BOOLEAN);
        case 'mistsutils.power':
          const power_1 = this.descendInput(node.A).asNumber();
          const power_2 = this.descendInput(node.B).asNumber();
          return new TypedInput(`Math.pow(${power_1}, ${power_2})`, TYPE_NUMBER);
        case 'mistsutils.round':
          const round_1 = this.descendInput(node.A).asNumber();
          const round_2 = this.descendInput(node.B).asNumber();
          return new TypedInput(`(Math.round(${round_1} / ${round_2}) * ${round_2})`, TYPE_NUMBER);
        case 'mistsutils.clamp':
          const clamp_1 = this.descendInput(node.A).asNumber();
          const clamp_2 = this.descendInput(node.B).asNumber();
          const clamp_3 = this.descendInput(node.C).asNumber();
          return new TypedInput(`Math.min(Math.max(${clamp_1}, ${clamp_2}), ${clamp_3})`, TYPE_NUMBER);
        case 'mistsutils.min':
          const min_1 = this.descendInput(node.A).asNumber();
          const min_2 = this.descendInput(node.B).asNumber();
          return new TypedInput(`Math.min(${min_1}, ${min_2})`, TYPE_NUMBER);
        case 'mistsutils.max':
          const max_1 = this.descendInput(node.A).asNumber();
          const max_2 = this.descendInput(node.B).asNumber();
          return new TypedInput(`Math.max(${max_1}, ${max_2})`, TYPE_NUMBER);
        case 'mistsutils.interpolate':
          const interpolate_1 = this.descendInput(node.A).asNumber();
          const interpolate_2 = this.descendInput(node.B).asNumber();
          const interpolate_3 = this.descendInput(node.C).asNumber();
          return new TypedInput(`${interpolate_2} + ((${interpolate_3} - ${interpolate_2}) / ${interpolate_1})`, TYPE_NUMBER);
        case 'mistsutils.ifthen':
          const ifthen_1 = this.descendInput(node.A).asBoolean();
          const ifthen_2 = this.descendInput(node.B).asString();
          const ifthen_3 = this.descendInput(node.C).asString();
          return new TypedInput(`(${ifthen_1} ? ${ifthen_2} : ${ifthen_3})`, TYPE_STRING);
        case 'mistsutils.letters':
          const letters_1 = this.descendInput(node.A).asNumber();
          const letters_2 = this.descendInput(node.B).asNumber();
          const letters_3 = this.descendInput(node.C).asString();
          return new TypedInput(`(${letters_3}).substring(Math.max(0,${letters_1}-1), Math.min(${letters_2}, ${letters_3}.length))`, TYPE_STRING);
        case 'mistsutils.starts':
          const starts_1 = this.descendInput(node.A).asString();
          const starts_2 = this.descendInput(node.B).asString();
          return new TypedInput(`${starts_1}.startsWith(${starts_2})`, TYPE_BOOLEAN);
        case 'mistsutils.ends':
          const ends_1 = this.descendInput(node.A).asString();
          const ends_2 = this.descendInput(node.B).asString();
          return new TypedInput(`${ends_1}.endsWith(${ends_2})`, TYPE_BOOLEAN);
        case 'mistsutils.toUnicode':
          const toUnicode_1 = this.descendInput(node.A).asString();
          return new TypedInput(`(${toUnicode_1}).charCodeAt(0)`, TYPE_NUMBER);
        case 'mistsutils.replace':
          const replace_1 = this.descendInput(node.A).asString();
          const replace_2 = this.descendInput(node.B).asString();
          const replace_3 = this.descendInput(node.C).asString();
          return new TypedInput(`${replace_1}.replace(${replace_3},${replace_2})`, TYPE_STRING);
        case 'mistsutils.replaceall':
          const replaceall_1 = this.descendInput(node.A).asString();
          const replaceall_2 = this.descendInput(node.B).asString();
          const replaceall_3 = this.descendInput(node.C).asString();
          return new TypedInput(`${replaceall_1}.replaceAll(${replaceall_3},${replaceall_2})`, TYPE_STRING);
        case 'mistsutils.alltextAfterString':
          const alltextAfterString_1 = this.descendInput(node.A).asString();
          const alltextAfterString_2 = this.descendInput(node.B).asString();
          return new TypedInput(`${alltextAfterString_1}.substring(${alltextAfterString_1}.indexOf(""+${alltextAfterString_2}) + 1, (${alltextAfterString_1}.length))`, TYPE_STRING);
        case 'mistsutils.alltextBeforeString':
          const alltextBeforeString_1 = this.descendInput(node.A).asString();
          const alltextBeforeString_2 = this.descendInput(node.B).asString();
          return new TypedInput(`(${alltextBeforeString_1}).split(${alltextBeforeString_2},1)[0]`, TYPE_STRING);
        case 'mistsutils.split':
          const split_1 = this.descendInput(node.A).asString();
          const split_2 = this.descendInput(node.B).asString();
          return new TypedInput(`JSON.stringify((${split_1}).split(${split_2}))`, TYPE_STRING);
        case 'mistsutils.splitarray':
          const splitarray_1 = this.descendInput(node.A).asString();
          const splitarray_2 = this.descendInput(node.B).asString();
          return new TypedInput(`(${splitarray_1}).split(${splitarray_2})`, TYPE_UNKNOWN);
        case 'mistsutils.length':
          const length_1 = this.descendInput(node.A).asRaw();
          return new TypedInput(`((${length_1}).length)`, TYPE_NUMBER);
        case 'mistsutils.item':
          const item_1 = this.descendInput(node.A).asRaw();
          const item_2 = this.descendInput(node.B).asString();
          const item_3 = this.descendInput(node.C).asNumber();
          return new TypedInput(`(${item_1}).split(${item_2})[${item_3}]`, TYPE_STRING);
        case 'mistsutils.squarebrackets':
          const squarebrackets_1 = this.descendInput(node.A).asRaw();
          const squarebrackets_2 = this.descendInput(node.B).asString();
          return new TypedInput(`(${squarebrackets_1})[${squarebrackets_2}]`, TYPE_STRING);
        case 'mistsutils.jsonparse':
          const jsonparse_1 = this.descendInput(node.A).asString();
          return new TypedInput(`JSON.parse(${jsonparse_1})`, TYPE_STRING);
        case 'mistsutils.jsonstringify':
          const jsonstringify_1 = this.descendInput(node.A).asRaw();
          return new TypedInput(`JSON.stringify(${jsonstringify_1})`, TYPE_STRING);
        case 'mistsutils.isnumber':
          const isnumber_1 = this.descendInput(node.A).asString();
          return new TypedInput(`Number(${isnumber_1}) == ${isnumber_1}`, TYPE_BOOLEAN);
        case 'mistsutils.isstring':
          const isstring_1 = this.descendInput(node.A).asString();
          return new TypedInput(`String(${isstring_1}) == ${isstring_1}`, TYPE_BOOLEAN);
        case 'mistsutils.isboolean':
          const isboolean_1 = this.descendInput(node.A).asString();
          return new TypedInput(`${isboolean_1} == "true" || ${isboolean_1} == "false"`, TYPE_BOOLEAN);
        case 'mistsutils.tostring':
          const tostring_1 = this.descendInput(node.A).asString();
          return new TypedInput(`${tostring_1}`, TYPE_STRING);
        case 'mistsutils.tonumber':
          const tonumber_1 = this.descendInput(node.A).asString();
          return new TypedInput(`isNaN(Number(${tonumber_1})) ? 0 : Number(${tonumber_1})`, TYPE_NUMBER);
        case 'mistsutils.toboolean':
          const toboolean_1 = this.descendInput(node.A).asString();
          return new TypedInput(`${toboolean_1} == "true" || ${toboolean_1} == "1" || ${toboolean_1} == "yes" ? "true" : "false"`, TYPE_BOOLEAN);
        case 'mistsutils.patchreporter':
          const patchreporter_1 = this.descendInput(node.A).asRaw();
          return new TypedInput(`${patchreporter_1}`, TYPE_STRING);
        case 'mistsutils.patchreporter2':
          const patchreporter2_1 = this.descendInput(node.A).asRaw();
          const patchreporter2_2 = this.descendInput(node.B).asRaw();
          return new TypedInput(`${patchreporter2_1}${patchreporter2_2}`, TYPE_STRING);
        case 'mistsutils.patchreporter3':
          const patchreporter3_1 = this.descendInput(node.A).asRaw();
          const patchreporter3_2 = this.descendInput(node.B).asRaw();
          const patchreporter3_3 = this.descendInput(node.C).asRaw();
          return new TypedInput(`${patchreporter3_1}${patchreporter3_2}${patchreporter3_3}`, TYPE_STRING);
        case 'mistsutils.patchboolean':
          const patchboolean_1 = this.descendInput(node.A).asRaw();
          return new TypedInput(`${patchboolean_1}`, TYPE_BOOLEAN);
        case 'mistsutils.patchcommand':
          const patchcommand_1 = this.descendInput(node.A).asRaw();
          return new TypedInput(`${patchcommand_1}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand2':
          const patchcommand2_1 = this.descendInput(node.A).asRaw();
          const patchcommand2_2 = this.descendInput(node.B).asRaw();
          return new TypedInput(`${patchcommand2_1}${patchcommand2_2}`, TYPE_UNKNOWN);
        case 'mistsutils.patchcommand3':
          const patchcommand3_1 = this.descendInput(node.A).asRaw();
          const patchcommand3_2 = this.descendInput(node.B).asRaw();
          const patchcommand3_3 = this.descendInput(node.C).asRaw();
          return new TypedInput(`${patchcommand3_1}${patchcommand3_2}${patchcommand3_3}`, TYPE_UNKNOWN);
        case 'mistsutils.true':
          return new TypedInput(`true`, TYPE_BOOLEAN);
        case 'mistsutils.false':
          return new TypedInput(`false`, TYPE_BOOLEAN);
        case 'mistsutils.isPackaged':
          return new TypedInput(`(typeof window.scaffolding === 'object')`, TYPE_BOOLEAN);
        case 'mistsutils.performancenow':
          return new TypedInput(`performance.now()`, TYPE_NUMBER);
        case 'mistsutils.stagewidth':
          return new TypedInput(`Scratch.vm.runtime.stageWidth`, TYPE_NUMBER);
        case 'mistsutils.stageheight':
          return new TypedInput(`Scratch.vm.runtime.stageHeight`, TYPE_NUMBER);
        case 'mistsutils.newline':
          return new TypedInput(`"\\n"`, TYPE_STRING);
        case 'mistsutils.pi':
          return new TypedInput(`Math.PI`, TYPE_NUMBER);
        case 'mistsutils.e':
          return new TypedInput(`Math.E`, TYPE_NUMBER);
        case 'mistsutils.infinity':
          return new TypedInput(`Infinity`, TYPE_NUMBER);
        case 'mistsutils.MaxInt':
          return new TypedInput(`Number.MAX_SAFE_INTEGER`, TYPE_NUMBER);
        default:
          return fn(node, ...args);
      }
    },
  });
  cst_patch(STGP, {
    descendStackedBlock(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistsutils_notequals':
          return {
            block, kind: 'mistsutils.notequals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_equals':
          return {
            block, kind: 'mistsutils.equals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_greaterorequal':
          return {
            block, kind: 'mistsutils.greaterorequal',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_lessthanorequal':
          return {
            block, kind: 'mistsutils.lessthanorequal',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_compare':
          return {
            block, kind: 'mistsutils.compare',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_power':
          return {
            block, kind: 'mistsutils.power',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_round':
          return {
            block, kind: 'mistsutils.round',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_clamp':
          return {
            block, kind: 'mistsutils.clamp',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_min':
          return {
            block, kind: 'mistsutils.min',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_max':
          return {
            block, kind: 'mistsutils.max',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_interpolate':
          return {
            block, kind: 'mistsutils.interpolate',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_ifthen':
          return {
            block, kind: 'mistsutils.ifthen',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_letters':
          return {
            block, kind: 'mistsutils.letters',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_starts':
          return {
            block, kind: 'mistsutils.starts',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_ends':
          return {
            block, kind: 'mistsutils.ends',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_toUnicode':
          return {
            block, kind: 'mistsutils.toUnicode',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_replace':
          return {
            block, kind: 'mistsutils.replace',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_replaceall':
          return {
            block, kind: 'mistsutils.replaceall',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_alltextAfterString':
          return {
            block, kind: 'mistsutils.alltextAfterString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_alltextBeforeString':
          return {
            block, kind: 'mistsutils.alltextBeforeString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_split':
          return {
            block, kind: 'mistsutils.split',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_splitarray':
          return {
            block, kind: 'mistsutils.splitarray',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_length':
          return {
            block, kind: 'mistsutils.length',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_item':
          return {
            block, kind: 'mistsutils.item',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_squarebrackets':
          return {
            block, kind: 'mistsutils.squarebrackets',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_jsonparse':
          return {
            block, kind: 'mistsutils.jsonparse',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_jsonstringify':
          return {
            block, kind: 'mistsutils.jsonstringify',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isnumber':
          return {
            block, kind: 'mistsutils.isnumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isstring':
          return {
            block, kind: 'mistsutils.isstring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isboolean':
          return {
            block, kind: 'mistsutils.isboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tostring':
          return {
            block, kind: 'mistsutils.tostring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tonumber':
          return {
            block, kind: 'mistsutils.tonumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_toboolean':
          return {
            block, kind: 'mistsutils.toboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchreporter':
          return {
            block, kind: 'mistsutils.patchreporter',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchreporter2':
          return {
            block, kind: 'mistsutils.patchreporter2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchreporter3':
          return {
            block, kind: 'mistsutils.patchreporter3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_patchboolean':
          return {
            block, kind: 'mistsutils.patchboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand':
          return {
            block, kind: 'mistsutils.patchcommand',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand2':
          return {
            block, kind: 'mistsutils.patchcommand2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchcommand3':
          return {
            block, kind: 'mistsutils.patchcommand3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_true':
          return {
            block, kind: 'mistsutils.true',
          };
        case 'mistsutils_false':
          return {
            block, kind: 'mistsutils.false',
          };
        case 'mistsutils_isPackaged':
          return {
            block, kind: 'mistsutils.isPackaged',
          };
        case 'mistsutils_performancenow':
          return {
            block, kind: 'mistsutils.performancenow',
          };
        case 'mistsutils_stagewidth':
          return {
            block, kind: 'mistsutils.stagewidth',
          };
        case 'mistsutils_stageheight':
          return {
            block, kind: 'mistsutils.stageheight',
          };
        case 'mistsutils_newline':
          return {
            block, kind: 'mistsutils.newline',
          };
        case 'mistsutils_pi':
          return {
            block, kind: 'mistsutils.pi',
          };
        case 'mistsutils_e':
          return {
            block, kind: 'mistsutils.e',
          };
        case 'mistsutils_infinity':
          return {
            block, kind: 'mistsutils.infinity',
          };
        case 'mistsutils_MaxInt':
          return {
            block, kind: 'mistsutils.MaxInt',
          };
        default:
          return fn(block, ...args);
      }
    },
    descendInput(fn, block, ...args) {
      switch (block.opcode) {
        case 'mistsutils_notequals':
          return {
            block, kind: 'mistsutils.notequals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_equals':
          return {
            block, kind: 'mistsutils.equals',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_greaterorequal':
          return {
            block, kind: 'mistsutils.greaterorequal',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_lessthanorequal':
          return {
            block, kind: 'mistsutils.lessthanorequal',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_compare':
          return {
            block, kind: 'mistsutils.compare',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_power':
          return {
            block, kind: 'mistsutils.power',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_round':
          return {
            block, kind: 'mistsutils.round',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_clamp':
          return {
            block, kind: 'mistsutils.clamp',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_min':
          return {
            block, kind: 'mistsutils.min',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_max':
          return {
            block, kind: 'mistsutils.max',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_interpolate':
          return {
            block, kind: 'mistsutils.interpolate',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_ifthen':
          return {
            block, kind: 'mistsutils.ifthen',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_letters':
          return {
            block, kind: 'mistsutils.letters',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_starts':
          return {
            block, kind: 'mistsutils.starts',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_ends':
          return {
            block, kind: 'mistsutils.ends',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_toUnicode':
          return {
            block, kind: 'mistsutils.toUnicode',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_replace':
          return {
            block, kind: 'mistsutils.replace',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_replaceall':
          return {
            block, kind: 'mistsutils.replaceall',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_alltextAfterString':
          return {
            block, kind: 'mistsutils.alltextAfterString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_alltextBeforeString':
          return {
            block, kind: 'mistsutils.alltextBeforeString',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_split':
          return {
            block, kind: 'mistsutils.split',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_splitarray':
          return {
            block, kind: 'mistsutils.splitarray',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_length':
          return {
            block, kind: 'mistsutils.length',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_item':
          return {
            block, kind: 'mistsutils.item',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_squarebrackets':
          return {
            block, kind: 'mistsutils.squarebrackets',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_jsonparse':
          return {
            block, kind: 'mistsutils.jsonparse',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_jsonstringify':
          return {
            block, kind: 'mistsutils.jsonstringify',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isnumber':
          return {
            block, kind: 'mistsutils.isnumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isstring':
          return {
            block, kind: 'mistsutils.isstring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_isboolean':
          return {
            block, kind: 'mistsutils.isboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tostring':
          return {
            block, kind: 'mistsutils.tostring',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_tonumber':
          return {
            block, kind: 'mistsutils.tonumber',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_toboolean':
          return {
            block, kind: 'mistsutils.toboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchreporter':
          return {
            block, kind: 'mistsutils.patchreporter',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchreporter2':
          return {
            block, kind: 'mistsutils.patchreporter2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchreporter3':
          return {
            block, kind: 'mistsutils.patchreporter3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_patchboolean':
          return {
            block, kind: 'mistsutils.patchboolean',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand':
          return {
            block, kind: 'mistsutils.patchcommand',
              A: this.descendInputOfBlock(block, 'A'),
          };
        case 'mistsutils_patchcommand2':
          return {
            block, kind: 'mistsutils.patchcommand2',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
          };
        case 'mistsutils_patchcommand3':
          return {
            block, kind: 'mistsutils.patchcommand3',
              A: this.descendInputOfBlock(block, 'A'),
              B: this.descendInputOfBlock(block, 'B'),
              C: this.descendInputOfBlock(block, 'C'),
          };
        case 'mistsutils_true':
          return {
            block, kind: 'mistsutils.true',
          };
        case 'mistsutils_false':
          return {
            block, kind: 'mistsutils.false',
          };
        case 'mistsutils_isPackaged':
          return {
            block, kind: 'mistsutils.isPackaged',
          };
        case 'mistsutils_performancenow':
          return {
            block, kind: 'mistsutils.performancenow',
          };
        case 'mistsutils_stagewidth':
          return {
            block, kind: 'mistsutils.stagewidth',
          };
        case 'mistsutils_stageheight':
          return {
            block, kind: 'mistsutils.stageheight',
          };
        case 'mistsutils_newline':
          return {
            block, kind: 'mistsutils.newline',
          };
        case 'mistsutils_pi':
          return {
            block, kind: 'mistsutils.pi',
          };
        case 'mistsutils_e':
          return {
            block, kind: 'mistsutils.e',
          };
        case 'mistsutils_infinity':
          return {
            block, kind: 'mistsutils.infinity',
          };
        case 'mistsutils_MaxInt':
          return {
            block, kind: 'mistsutils.MaxInt',
          };
        default:
          return fn(block, ...args);
      }
    },
  });
  class mistsutils {
    getInfo() {
      const BT = Scratch.BlockType;
      const AT = Scratch.ArgumentType;
      return {
        id: 'mistsutils',
        name: 'Mists Utils',
        color1: '#2DA4A0',
        version: 5.9,
        blocks: [{
            "blockType": BT.BUTTON,
            "text": "New Version Available!",
            "func": "openSite",
            "hideFromPalette": !this.newUpdate
          },
          {
            "blockType": BT.LABEL,
            "text": "Comparisons"
          },
          {
            "opcode": "notequals",
            "text": "[A] !== [B]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "apple"
              }
            },
            "func": "err"
          },
          {
            "opcode": "equals",
            "text": "[A] === [B]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "apple"
              }
            },
            "func": "err"
          },
          {
            "opcode": "greaterorequal",
            "text": "[A] >= [B]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 3
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 4
              }
            },
            "func": "err"
          },
          {
            "opcode": "lessthanorequal",
            "text": "[A] <= [B]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 3
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 4
              }
            },
            "func": "err"
          },
          {
            "opcode": "compare",
            "text": "[A] [C] [B]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 3
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 4
              },
              "C": {
                "type": AT.STRING,
                "defaultValue": "<"
              }
            },
            "func": "err"
          },
          {
            "blockType": BT.LABEL,
            "text": "Maths"
          },
          {
            "opcode": "power",
            "text": "[A] ^ [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 3
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 4
              }
            },
            "func": "err"
          },
          {
            "opcode": "round",
            "text": "round [A] to the nearest [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 100
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 10
              }
            },
            "func": "err"
          },
          {
            "opcode": "clamp",
            "text": "clamp [A] between [B] and [C]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 100
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 1
              },
              "C": {
                "type": AT.NUMBER,
                "defaultValue": 50
              }
            },
            "func": "err"
          },
          {
            "opcode": "min",
            "text": "min of [A] and [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 100
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 50
              }
            },
            "func": "err"
          },
          {
            "opcode": "max",
            "text": "max of [A] and [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 100
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 50
              }
            },
            "func": "err"
          },
          {
            "opcode": "interpolate",
            "text": "smooth [B] to [C] by [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 3
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 0
              },
              "C": {
                "type": AT.NUMBER,
                "defaultValue": 100
              }
            },
            "func": "err"
          },
          {
            "blockType": BT.LABEL,
            "text": "Strings"
          },
          {
            "opcode": "ifthen",
            "text": "if [A] then [B] else [C]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.BOOLEAN,
                "defaultValue": false
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "yes"
              },
              "C": {
                "type": AT.STRING,
                "defaultValue": "no"
              }
            },
            "func": "err"
          },
          {
            "opcode": "letters",
            "text": "letters [A] to [B] of [C]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.NUMBER,
                "defaultValue": 2
              },
              "B": {
                "type": AT.NUMBER,
                "defaultValue": 4
              },
              "C": {
                "type": AT.STRING,
                "defaultValue": "apple"
              }
            },
            "func": "err"
          },
          {
            "opcode": "starts",
            "text": "[A] starts with [B]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "app"
              }
            },
            "func": "err"
          },
          {
            "opcode": "ends",
            "text": "[A] ends with [B]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "app"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toUnicode",
            "text": "unicode Of [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "A"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replace",
            "text": "replace [C] in [A] with [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "l"
              },
              "C": {
                "type": AT.STRING,
                "defaultValue": "p"
              }
            },
            "func": "err"
          },
          {
            "opcode": "replaceall",
            "text": "replace all [C] in [A] with [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "l"
              },
              "C": {
                "type": AT.STRING,
                "defaultValue": "p"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextAfterString",
            "text": "text after [B] in [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "l"
              }
            },
            "func": "err"
          },
          {
            "opcode": "alltextBeforeString",
            "text": "text before [B] in [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "l"
              }
            },
            "func": "err"
          },
          {
            "blockType": BT.LABEL,
            "text": "JSON"
          },
          {
            "opcode": "split",
            "text": "split [A] by [B] (stringify)",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "l"
              }
            },
            "func": "err"
          },
          {
            "opcode": "splitarray",
            "text": "split [A] by [B] (array)",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "l"
              }
            },
            "func": "err"
          },
          {
            "opcode": "length",
            "text": "[A].length",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              }
            },
            "func": "err"
          },
          {
            "opcode": "item",
            "text": "item [C] of [A] split by [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "l"
              },
              "C": {
                "type": AT.NUMBER,
                "defaultValue": 1
              }
            },
            "func": "err"
          },
          {
            "opcode": "squarebrackets",
            "text": "[A] item [B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonparse",
            "text": "JSON.parse [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "{\"a\": 1}"
              }
            },
            "func": "err"
          },
          {
            "opcode": "jsonstringify",
            "text": "JSON.stringify [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": ""
              }
            },
            "func": "err"
          },
          {
            "blockType": BT.LABEL,
            "text": "Types"
          },
          {
            "opcode": "isnumber",
            "text": "[A] is a number",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isstring",
            "text": "[A] is a string",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "apple"
              }
            },
            "func": "err"
          },
          {
            "opcode": "isboolean",
            "text": "[A] is a boolean",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "true"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tostring",
            "text": "to string [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "tonumber",
            "text": "to number [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1"
              }
            },
            "func": "err"
          },
          {
            "opcode": "toboolean",
            "text": "to boolean [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "true"
              }
            },
            "func": "err"
          },
          {
            "blockType": BT.LABEL,
            "text": "Injections"
          },
          {
            "opcode": "patchreporter",
            "text": "patch [A]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1 * 3"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter2",
            "text": "patch [A][B]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1 * "
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "3"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchreporter3",
            "text": "patch [A][B][C]",
            "blockType": BT.REPORTER,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "*"
              },
              "C": {
                "type": AT.STRING,
                "defaultValue": "3"
              }
            },
            "allowDropAnywhere": true,
            "func": "err"
          },
          {
            "opcode": "patchboolean",
            "text": "patch [A]",
            "blockType": BT.BOOLEAN,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1 == 6"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand",
            "text": "patch [A]",
            "blockType": BT.COMMAND,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "1 + 5"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand2",
            "text": "patch [A][B]",
            "blockType": BT.COMMAND,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "5 +"
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "5"
              }
            },
            "func": "err"
          },
          {
            "opcode": "patchcommand3",
            "text": "patch [A][B][C]",
            "blockType": BT.COMMAND,
            "arguments": {
              "A": {
                "type": AT.STRING,
                "defaultValue": "console.log("
              },
              "B": {
                "type": AT.STRING,
                "defaultValue": "\"hello world\""
              },
              "C": {
                "type": AT.STRING,
                "defaultValue": ")"
              }
            },
            "func": "err"
          },
          {
            "blockType": BT.LABEL,
            "text": "Reporters"
          },
          {
            "opcode": "true",
            "text": "true",
            "blockType": BT.BOOLEAN,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "false",
            "text": "false",
            "blockType": BT.BOOLEAN,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "isPackaged",
            "text": "Is Packaged?",
            "blockType": BT.BOOLEAN,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "performancenow",
            "text": "performance.now()",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "stagewidth",
            "text": "Stage Width",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "stageheight",
            "text": "Stage Height",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "newline",
            "text": "New Line",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "pi",
            "text": "π",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "e",
            "text": "e",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "infinity",
            "text": "∞",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          },
          {
            "opcode": "MaxInt",
            "text": "Max Int",
            "blockType": BT.REPORTER,
            "disableMonitor": true,
            "func": "err"
          }
        ],
      };
    }

    err(util) {
      const err = 'huh, weird error :shrug:';
      return err;
    }
    constructor() {
      console.log("Loaded Mist's utils! (v5.9)");
      this.newUpdate = false;
      this.openSite = function() {
        Scratch.openWindow("https://extensions.mistium.com");
      }
      if (typeof window.scaffolding !== "object") {
        // fetch the extension from github
        // compare it to the current file
        fetch("https://raw.githubusercontent.com/Mistium/extensions.mistium/main/featured/Mist's%20Utils.js")
          .then((res) => res.text())
          .then((text) => {
            if (!(text.includes("version: 5.9,"))) {
              this.newUpdate = true;
            }
          })
      };
    }
  }
  Scratch.extensions.register(new mistsutils());
})(Scratch);
