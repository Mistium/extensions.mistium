(function (Scratch) {
    'use strict';
    // This extension uses mistium's compiled block builder
    // Please don't remove this, be kind :P

    if (!Scratch.extensions.unsandboxed) {
      throw new Error("tables needs to be run unsandboxed.");
    }

    const vm = Scratch.vm,
          runtime = vm.runtime;

    class tables {
      getInfo() {
        return {
          id: 'tables',
          name: 'tables',
          blocks: [{"opcode":"newTable","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"new table","code":"([[]])","func":"err"},"---",{"opcode":"addRow","blockType": Scratch.BlockType.COMMAND,"text":"add row to [A]","code":"(${uQtIZYhAamKw}.push(new Array(${uQtIZYhAamKw}[0].length).fill(\"\")))","arguments":{"A":{"type":"string","gen_id":"uQtIZYhAamKw","defaultValue":"table"}},"func":"err"},{"opcode":"addColumn","blockType": Scratch.BlockType.COMMAND,"text":"add column to [A]","code":"${ZFphNiXyXosZ}.map(column => (column.push(\"\"), column))","arguments":{"A":{"type":"string","gen_id":"ZFphNiXyXosZ","defaultValue":"table"}},"func":"err"},{"opcode":"deleteRow","blockType": Scratch.BlockType.COMMAND,"text":"delete row [X] in [A]","code":"(${ErDtuqAQPmeR}.splice(${nyZpixNSHKIm}, 1))","arguments":{"A":{"type":"string","gen_id":"ErDtuqAQPmeR","defaultValue":"table"},"X":{"type":"number","gen_id":"nyZpixNSHKIm","defaultValue":"0"}},"func":"err"},{"opcode":"deleteColumn","blockType": Scratch.BlockType.COMMAND,"text":"delete column [X] in [A]","code":"(${fUSxLBenVAuP}.map(column => (column.splice(${IXdfdEuNsSGf}, 1), column)))","arguments":{"A":{"type":"string","gen_id":"fUSxLBenVAuP","defaultValue":"table"},"X":{"type":"number","gen_id":"IXdfdEuNsSGf","defaultValue":"0"}},"func":"err"},"---",{"opcode":"addRows","blockType": Scratch.BlockType.COMMAND,"text":"add [A] rows to [B]","code":"for (let i = 0; i < ${HHsuDRUgqntw}; i++) { ${vdEFVSIgXYki}.push(new Array(${vdEFVSIgXYki}[0].length).fill(\"\")) }","arguments":{"A":{"type":"number","gen_id":"HHsuDRUgqntw","defaultValue":"1"},"B":{"type":"string","gen_id":"vdEFVSIgXYki","defaultValue":"table"}},"func":"err"},{"opcode":"addColumns","blockType": Scratch.BlockType.COMMAND,"text":"add [A] columns to [B]","code":"for (let i = 0; i < ${UdtkLkXKDzpF}; i++) { ${ArlDSKvPDTjH}.map(column => (column.push(\"\"), column)) }","arguments":{"A":{"type":"number","gen_id":"UdtkLkXKDzpF","defaultValue":"1"},"B":{"type":"string","gen_id":"ArlDSKvPDTjH","defaultValue":"table"}},"func":"err"},{"opcode":"deleteRows","blockType": Scratch.BlockType.COMMAND,"text":"delete rows [A] to [B] in [C]","code":"${BQSgBjfcIdhr}.splice(${dpkDvLcDjKlx}, ${ZGUqrgNbJfoH} - ${dpkDvLcDjKlx} + 1)","arguments":{"A":{"type":"number","gen_id":"dpkDvLcDjKlx","defaultValue":"0"},"B":{"type":"number","gen_id":"ZGUqrgNbJfoH","defaultValue":"0"},"C":{"type":"string","gen_id":"BQSgBjfcIdhr","defaultValue":"table"}},"func":"err"},{"opcode":"deleteColumns","blockType": Scratch.BlockType.COMMAND,"text":"delete columns [A] to [B] in [C]","code":"${DOyilNuHlBav}.map(column => (column.splice(${xNYqfPaNKwmn}, ${vsJWKbMgkiwV} - ${xNYqfPaNKwmn} + 1), column))","arguments":{"A":{"type":"number","gen_id":"xNYqfPaNKwmn","defaultValue":"0"},"B":{"type":"number","gen_id":"vsJWKbMgkiwV","defaultValue":"0"},"C":{"type":"string","gen_id":"DOyilNuHlBav","defaultValue":"table"}},"func":"err"},"---",{"opcode":"setCell","blockType": Scratch.BlockType.COMMAND,"text":"set cell [X],[Y] in [A] to [B]","code":"(${kFTNDCHcsUUc}[${VtjjzKbQoCKd}][${LTsBPaCleiaa}] = ${OXeJXtPnGUAG})","arguments":{"A":{"type":"string","gen_id":"kFTNDCHcsUUc","defaultValue":"table"},"X":{"type":"number","gen_id":"VtjjzKbQoCKd","defaultValue":"0"},"Y":{"type":"number","gen_id":"LTsBPaCleiaa","defaultValue":"0"},"B":{"type":"string","gen_id":"OXeJXtPnGUAG","defaultValue":"value"}},"func":"err"},{"opcode":"getCell","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"cell [X],[Y] in [A]","code":"(${JWpTmbrKYCDU}[${CdjbZCjkikvO}][${XBfFvhPHpsnN}])","arguments":{"A":{"type":"string","gen_id":"JWpTmbrKYCDU","defaultValue":"table"},"X":{"type":"number","gen_id":"CdjbZCjkikvO","defaultValue":"0"},"Y":{"type":"number","gen_id":"XBfFvhPHpsnN","defaultValue":"0"}},"func":"err"},{"opcode":"getRow","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"row [X] in [A]","code":"(${hDyQFvjlQycl}[${ZYDHkaOFCFKs}].join(\",\"))","arguments":{"A":{"type":"string","gen_id":"hDyQFvjlQycl","defaultValue":"table"},"X":{"type":"number","gen_id":"ZYDHkaOFCFKs","defaultValue":"0"}},"func":"err"},{"opcode":"getColumn","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"column [X] in [A]","code":"(JSON.stringify(${usoRHIFwCKtD}.map(row => row[${aojSVDrWhWVx}])))","arguments":{"A":{"type":"string","gen_id":"usoRHIFwCKtD","defaultValue":"table"},"X":{"type":"number","gen_id":"aojSVDrWhWVx","defaultValue":"0"}},"func":"err"},"---",{"opcode":"setRow","blockType": Scratch.BlockType.COMMAND,"text":"set row [X] in [A] to [B]","code":"(${gBJYSWyinSje}[${iuAhWorQQiJZ}] = ${mIGWPugvXQXb}.split(\",\"))","arguments":{"A":{"type":"string","gen_id":"gBJYSWyinSje","defaultValue":"table"},"X":{"type":"number","gen_id":"iuAhWorQQiJZ","defaultValue":"0"},"B":{"type":"string","gen_id":"mIGWPugvXQXb","defaultValue":"value"}},"func":"err"},{"opcode":"setColumn","blockType": Scratch.BlockType.COMMAND,"text":"set column [X] in [A] to [B]","code":"(${qSiXojKWxkBC}.map((row, i) => (row[${zBvQqrlusvXO}] = ${lKhBwsmvVnwY}[i], row)))","arguments":{"A":{"type":"string","gen_id":"qSiXojKWxkBC","defaultValue":"table"},"X":{"type":"number","gen_id":"zBvQqrlusvXO","defaultValue":"0"},"B":{"type":"string","gen_id":"lKhBwsmvVnwY","defaultValue":"value"}},"func":"err"},{"opcode":"setTable","blockType": Scratch.BlockType.COMMAND,"text":"set [A] to [B]","code":"(${QfjASfybdeFV} = ${LLORyGULwPMI})","arguments":{"A":{"type":"string","gen_id":"QfjASfybdeFV","defaultValue":"table"},"B":{"type":"string","gen_id":"LLORyGULwPMI","defaultValue":"table"}},"func":"err"},{"opcode":"fillTable","blockType": Scratch.BlockType.COMMAND,"text":"fill [A] with [B]","code":"(${sZpwTDjjyKfy} = ${sZpwTDjjyKfy}.map(row => row.map(cell => ${armUxvffiWCY})))","arguments":{"A":{"type":"string","gen_id":"sZpwTDjjyKfy","defaultValue":"table"},"B":{"type":"string","gen_id":"armUxvffiWCY","defaultValue":"value"}},"func":"err"},{"opcode":"clearTable","blockType": Scratch.BlockType.COMMAND,"text":"clear [A]","code":"(${qvicPMwTYhyU} = [[]])","arguments":{"A":{"type":"string","gen_id":"qvicPMwTYhyU","defaultValue":"table"}},"func":"err"},"---",{"opcode":"getTable","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"get table [A]","code":"(JSON.stringify(${HxLjJBZTWZSP}))","arguments":{"A":{"type":"string","gen_id":"HxLjJBZTWZSP","defaultValue":"table"}},"func":"err"},{"opcode":"getTotalRows","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"get rows in [A]","code":"(${zsxSgmJKUJzJ}.length)","arguments":{"A":{"type":"string","gen_id":"zsxSgmJKUJzJ","defaultValue":"table"}},"func":"err"},{"opcode":"getTotalColumns","blockType": Scratch.BlockType.REPORTER,"returns":"STRING","text":"get columns in [A]","code":"(${gOHOsywrxnhT}[0].length)","arguments":{"A":{"type":"string","gen_id":"gOHOsywrxnhT","defaultValue":"table"}},"func":"err"}],
        };
      }
      err(args, util, blockJSON) {
        const err = 'huh, weird error :shrug:';
        runtime.visualReport(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op.id, err);
        return err;
      }
    }

    const sanitize = (string) => {
      if (typeof string !== 'string') {
        console.warn(`sanitize got unexpected type: ${typeof string}`);
        string = '' + string;
      }
      return JSON.stringify(string).slice(1, -1);
    };

    const mistutil_iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
    const mist_JSG = mistutil_iwnafhwtb.JSGenerator;
    const mist_STG = mistutil_iwnafhwtb.ScriptTreeGenerator;
    const mist_JSGP = mist_JSG.prototype;
    const mist_STGP = mist_STG.prototype;

    const TYPE_NUMBER = 1;
    const TYPE_STRING = 2;
    const TYPE_BOOLEAN = 3;
    const TYPE_UNKNOWN = 4;
    const TYPE_NUMBER_NAN = 5;

    // prettier-ignore
    class TypedInput {
      constructor(t, s) {
        if ("number" != typeof s) throw Error("type is invalid");
        this.source = t, this.type = s
      }
      asNumber() {
        return this.type === TYPE_NUMBER ? this.source : this.type === TYPE_NUMBER_NAN ? `(${this.source} || 0)` : `(+${this.source} || 0)`
      }
      asNumberOrNaN() {
        return this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN ? this.source : `(+${this.source})`
      }
      asString() {
        return this.type === TYPE_STRING ? this.source : `("" + ${this.source})`
      }
      asBoolean() {
        return this.type === TYPE_BOOLEAN ? this.source : `toBoolean(${this.source})`
      }
      asColor() {
        return this.asUnknown()
      }
      asUnknown() {
        return this.source
      }
      asSafe() {
        return this.asUnknown()
      }
      isAlwaysNumber() {
        return this.type === TYPE_NUMBER
      }
      isAlwaysNumberOrNaN() {
        return this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN
      }
      isNeverNumber() {
        return !1
      }
    }

    // prettier-ignore
    class ConstantInput {
      constructor(t, s) {
        this.constantValue = t, this.safe = s
      }
      asNumber() {
        let t = +this.constantValue;
        return t ? t.toString() : Object.is(t, -0) ? "-0" : "0"
      }
      asNumberOrNaN() {
        return this.asNumber()
      }
      asString() {
        return `"${sanitize("" + this.constantValue)}"`
      }
      asBoolean() {
        return Cast.toBoolean(this.constantValue).toString()
      }
      asColor() {
        if (/^#[0-9a-f]{6, 8}$/i.test(this.constantValue)) {
          let t = this.constantValue.substr(1);
          return Number.parseInt(t, 16).toString()
        }
        return this.asUnknown()
      }
      asUnknown() {
        if ("number" == typeof this.constantValue) return this.constantValue;
        let t = +this.constantValue;
        return t.toString() === this.constantValue ? this.constantValue : this.asString()
      }
      asSafe() {
        return this.safe ? this.asUnknown() : this.asString()
      }
      isAlwaysNumber() {
        let t = +this.constantValue;
        return !Number.isNaN(t) && (0 !== t || "" !== this.constantValue.toString().trim())
      }
      isAlwaysNumberOrNaN() {
        return this.isAlwaysNumber()
      }
      isNeverNumber() {
        return Number.isNaN(+this.constantValue)
      }
    }

    // prettier-ignore
    class VariableInput {
      constructor(t) {
        this.source = t, this.type = TYPE_UNKNOWN, this._value = null
      }
      setInput(t) {
        if (t instanceof VariableInput) {
          if (t._value) t = t._value;
          else {
            this.type = TYPE_UNKNOWN, this._value = null;
            return;
          }
        }
        this._value = t, t instanceof TypedInput ? this.type = t.type : this.type = TYPE_UNKNOWN
      }
      asNumber() {
        return this.type === TYPE_NUMBER ? this.source : this.type === TYPE_NUMBER_NAN ? `(${this.source} || 0)` : `(+${this.source} || 0)`
      }
      asNumberOrNaN() {
        return this.type === TYPE_NUMBER || this.type === TYPE_NUMBER_NAN ? this.source : `(+${this.source})`
      }
      asString() {
        return this.type === TYPE_STRING ? this.source : `("" + ${this.source})`
      }
      asBoolean() {
        return this.type === TYPE_BOOLEAN ? this.source : `toBoolean(${this.source})`
      }
      asColor() {
        return this.asUnknown()
      }
      asUnknown() {
        return this.source
      }
      asSafe() {
        return this.asUnknown()
      }
      isAlwaysNumber() {
        return !!this._value && this._value.isAlwaysNumber()
      }
      isAlwaysNumberOrNaN() {
        return !!this._value && this._value.isAlwaysNumberOrNaN()
      }
      isNeverNumber() {
        return !!this._value && this._value.isNeverNumber()
      }
    }

    const PATCHES_ID = 'tables_patches';
    const cst_patch = (obj, functions) => {
      if (obj[PATCHES_ID]) return;
      obj[PATCHES_ID] = {};
      for (const name in functions) {
        const original = obj[name];
        obj[PATCHES_ID][name] = obj[name];
        if (original) {
          obj[name] = function (...args) {
            const callOriginal = (...args) => original.call(this, ...args);
            return functions[name].call(this, callOriginal, ...args);
          };
        } else {
          obj[name] = function (...args) {
            return functions[name].call(this, () => { }, ...args);
          };
        }
      }
    };

    function caseSanitize(case_) {
      if (typeof case_ === 'undefined') return '""'; // Sanitize undefined
      if (typeof case_ === 'string') return `"${sanitize(case_)}"`;
      if (typeof case_ === 'number') return String(case_);
      console.warn(`sanitization failed on case of type: ${typeof case_}, casting to string`);
      return String(case_);
    }

    function descendTillSource(input, san) {
      let des = this.descendInput(input),
          src = false;
      if (input.kind === 'constant' && input?.value) return san(input.value);
      if (des.constantValue?.value) return san(des.constantValue.value);
      if (des?.source) return des.source;
      des = this.descendInput(des.constantValue);
      if (des.constantValue?.value) return san(des.constantValue.value);
      src = true;
      if (des?.source ?? des?.constantValue?.source) return des?.source ?? des?.constantValue?.source;
      throw new Error('Unable to descend input');
    }

    cst_patch(mist_JSGP, {
      descendStackedBlock(originalFn, node) {
        const block = node.block;
        switch (node.kind) {
          case 'tables.newTable': 
this.source += `\nvm.runtime.visualReport("${block.id}", ([[]]));\n`;
return;

case 'tables.addRow': 
const uQtIZYhAamKw = descendTillSource.call(this, node.A, caseSanitize) || "";
this.source += `\n(${uQtIZYhAamKw}.push(new Array(${uQtIZYhAamKw}[0].length).fill("")));\n`;
return;
case 'tables.addColumn': 
const ZFphNiXyXosZ = descendTillSource.call(this, node.A, caseSanitize) || "";
this.source += `\n${ZFphNiXyXosZ}.map(column => (column.push(""), column));\n`;
return;
case 'tables.deleteRow': 
const ErDtuqAQPmeR = descendTillSource.call(this, node.A, caseSanitize) || "";
const nyZpixNSHKIm = descendTillSource.call(this, node.X, caseSanitize) || "";
this.source += `\n(${ErDtuqAQPmeR}.splice(${nyZpixNSHKIm}, 1));\n`;
return;
case 'tables.deleteColumn': 
const fUSxLBenVAuP = descendTillSource.call(this, node.A, caseSanitize) || "";
const IXdfdEuNsSGf = descendTillSource.call(this, node.X, caseSanitize) || "";
this.source += `\n(${fUSxLBenVAuP}.map(column => (column.splice(${IXdfdEuNsSGf}, 1), column)));\n`;
return;

case 'tables.addRows': 
const HHsuDRUgqntw = descendTillSource.call(this, node.A, caseSanitize) || "";
const vdEFVSIgXYki = descendTillSource.call(this, node.B, caseSanitize) || "";
this.source += `\nfor (let i = 0; i < ${HHsuDRUgqntw}; i++) { ${vdEFVSIgXYki}.push(new Array(${vdEFVSIgXYki}[0].length).fill("")) };\n`;
return;
case 'tables.addColumns': 
const UdtkLkXKDzpF = descendTillSource.call(this, node.A, caseSanitize) || "";
const ArlDSKvPDTjH = descendTillSource.call(this, node.B, caseSanitize) || "";
this.source += `\nfor (let i = 0; i < ${UdtkLkXKDzpF}; i++) { ${ArlDSKvPDTjH}.map(column => (column.push(""), column)) };\n`;
return;
case 'tables.deleteRows': 
const dpkDvLcDjKlx = descendTillSource.call(this, node.A, caseSanitize) || "";
const ZGUqrgNbJfoH = descendTillSource.call(this, node.B, caseSanitize) || "";
const BQSgBjfcIdhr = descendTillSource.call(this, node.C, caseSanitize) || "";
this.source += `\n${BQSgBjfcIdhr}.splice(${dpkDvLcDjKlx}, ${ZGUqrgNbJfoH} - ${dpkDvLcDjKlx} + 1);\n`;
return;
case 'tables.deleteColumns': 
const xNYqfPaNKwmn = descendTillSource.call(this, node.A, caseSanitize) || "";
const vsJWKbMgkiwV = descendTillSource.call(this, node.B, caseSanitize) || "";
const DOyilNuHlBav = descendTillSource.call(this, node.C, caseSanitize) || "";
this.source += `\n${DOyilNuHlBav}.map(column => (column.splice(${xNYqfPaNKwmn}, ${vsJWKbMgkiwV} - ${xNYqfPaNKwmn} + 1), column));\n`;
return;

case 'tables.setCell': 
const kFTNDCHcsUUc = descendTillSource.call(this, node.A, caseSanitize) || "";
const VtjjzKbQoCKd = descendTillSource.call(this, node.X, caseSanitize) || "";
const LTsBPaCleiaa = descendTillSource.call(this, node.Y, caseSanitize) || "";
const OXeJXtPnGUAG = descendTillSource.call(this, node.B, caseSanitize) || "";
this.source += `\n(${kFTNDCHcsUUc}[${VtjjzKbQoCKd}][${LTsBPaCleiaa}] = ${OXeJXtPnGUAG});\n`;
return;
case 'tables.getCell': 
const JWpTmbrKYCDU = descendTillSource.call(this, node.A, caseSanitize) || "";
const CdjbZCjkikvO = descendTillSource.call(this, node.X, caseSanitize) || "";
const XBfFvhPHpsnN = descendTillSource.call(this, node.Y, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", (${JWpTmbrKYCDU}[${CdjbZCjkikvO}][${XBfFvhPHpsnN}]));\n`;
return;
case 'tables.getRow': 
const hDyQFvjlQycl = descendTillSource.call(this, node.A, caseSanitize) || "";
const ZYDHkaOFCFKs = descendTillSource.call(this, node.X, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", (${hDyQFvjlQycl}[${ZYDHkaOFCFKs}].join(",")));\n`;
return;
case 'tables.getColumn': 
const usoRHIFwCKtD = descendTillSource.call(this, node.A, caseSanitize) || "";
const aojSVDrWhWVx = descendTillSource.call(this, node.X, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", (JSON.stringify(${usoRHIFwCKtD}.map(row => row[${aojSVDrWhWVx}]))));\n`;
return;

case 'tables.setRow': 
const gBJYSWyinSje = descendTillSource.call(this, node.A, caseSanitize) || "";
const iuAhWorQQiJZ = descendTillSource.call(this, node.X, caseSanitize) || "";
const mIGWPugvXQXb = descendTillSource.call(this, node.B, caseSanitize) || "";
this.source += `\n(${gBJYSWyinSje}[${iuAhWorQQiJZ}] = ${mIGWPugvXQXb}.split(","));\n`;
return;
case 'tables.setColumn': 
const qSiXojKWxkBC = descendTillSource.call(this, node.A, caseSanitize) || "";
const zBvQqrlusvXO = descendTillSource.call(this, node.X, caseSanitize) || "";
const lKhBwsmvVnwY = descendTillSource.call(this, node.B, caseSanitize) || "";
this.source += `\n(${qSiXojKWxkBC}.map((row, i) => (row[${zBvQqrlusvXO}] = ${lKhBwsmvVnwY}[i], row)));\n`;
return;
case 'tables.setTable': 
const QfjASfybdeFV = descendTillSource.call(this, node.A, caseSanitize) || "";
const LLORyGULwPMI = descendTillSource.call(this, node.B, caseSanitize) || "";
this.source += `\n(${QfjASfybdeFV} = ${LLORyGULwPMI});\n`;
return;
case 'tables.fillTable': 
const sZpwTDjjyKfy = descendTillSource.call(this, node.A, caseSanitize) || "";
const armUxvffiWCY = descendTillSource.call(this, node.B, caseSanitize) || "";
this.source += `\n(${sZpwTDjjyKfy} = ${sZpwTDjjyKfy}.map(row => row.map(cell => ${armUxvffiWCY})));\n`;
return;
case 'tables.clearTable': 
const qvicPMwTYhyU = descendTillSource.call(this, node.A, caseSanitize) || "";
this.source += `\n(${qvicPMwTYhyU} = [[]]);\n`;
return;

case 'tables.getTable': 
const HxLjJBZTWZSP = descendTillSource.call(this, node.A, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", (JSON.stringify(${HxLjJBZTWZSP})));\n`;
return;
case 'tables.getTotalRows': 
const zsxSgmJKUJzJ = descendTillSource.call(this, node.A, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", (${zsxSgmJKUJzJ}.length));\n`;
return;
case 'tables.getTotalColumns': 
const gOHOsywrxnhT = descendTillSource.call(this, node.A, caseSanitize) || "";
this.source += `\nvm.runtime.visualReport("${block.id}", (${gOHOsywrxnhT}[0].length));\n`;
return;
          default:
            return originalFn.call(this, node);
        }
      },

      descendInput(originalFn, node) {
        switch (node.kind) {
          case 'tables.newTable': 
return new TypedInput(`([[]])`, TYPE_STRING);

case 'tables.addRow': 
const uQtIZYhAamKw = descendTillSource.call(this, node.A, caseSanitize) || "";
return new TypedInput(`(${uQtIZYhAamKw}.push(new Array(${uQtIZYhAamKw}[0].length).fill("")))`, TYPE_UNKNOWN);
case 'tables.addColumn': 
const ZFphNiXyXosZ = descendTillSource.call(this, node.A, caseSanitize) || "";
return new TypedInput(`${ZFphNiXyXosZ}.map(column => (column.push(""), column))`, TYPE_UNKNOWN);
case 'tables.deleteRow': 
const ErDtuqAQPmeR = descendTillSource.call(this, node.A, caseSanitize) || "";
const nyZpixNSHKIm = descendTillSource.call(this, node.X, caseSanitize) || "";
return new TypedInput(`(${ErDtuqAQPmeR}.splice(${nyZpixNSHKIm}, 1))`, TYPE_UNKNOWN);
case 'tables.deleteColumn': 
const fUSxLBenVAuP = descendTillSource.call(this, node.A, caseSanitize) || "";
const IXdfdEuNsSGf = descendTillSource.call(this, node.X, caseSanitize) || "";
return new TypedInput(`(${fUSxLBenVAuP}.map(column => (column.splice(${IXdfdEuNsSGf}, 1), column)))`, TYPE_UNKNOWN);

case 'tables.addRows': 
const HHsuDRUgqntw = descendTillSource.call(this, node.A, caseSanitize) || "";
const vdEFVSIgXYki = descendTillSource.call(this, node.B, caseSanitize) || "";
return new TypedInput(`for (let i = 0; i < ${HHsuDRUgqntw}; i++) { ${vdEFVSIgXYki}.push(new Array(${vdEFVSIgXYki}[0].length).fill("")) }`, TYPE_UNKNOWN);
case 'tables.addColumns': 
const UdtkLkXKDzpF = descendTillSource.call(this, node.A, caseSanitize) || "";
const ArlDSKvPDTjH = descendTillSource.call(this, node.B, caseSanitize) || "";
return new TypedInput(`for (let i = 0; i < ${UdtkLkXKDzpF}; i++) { ${ArlDSKvPDTjH}.map(column => (column.push(""), column)) }`, TYPE_UNKNOWN);
case 'tables.deleteRows': 
const dpkDvLcDjKlx = descendTillSource.call(this, node.A, caseSanitize) || "";
const ZGUqrgNbJfoH = descendTillSource.call(this, node.B, caseSanitize) || "";
const BQSgBjfcIdhr = descendTillSource.call(this, node.C, caseSanitize) || "";
return new TypedInput(`${BQSgBjfcIdhr}.splice(${dpkDvLcDjKlx}, ${ZGUqrgNbJfoH} - ${dpkDvLcDjKlx} + 1)`, TYPE_UNKNOWN);
case 'tables.deleteColumns': 
const xNYqfPaNKwmn = descendTillSource.call(this, node.A, caseSanitize) || "";
const vsJWKbMgkiwV = descendTillSource.call(this, node.B, caseSanitize) || "";
const DOyilNuHlBav = descendTillSource.call(this, node.C, caseSanitize) || "";
return new TypedInput(`${DOyilNuHlBav}.map(column => (column.splice(${xNYqfPaNKwmn}, ${vsJWKbMgkiwV} - ${xNYqfPaNKwmn} + 1), column))`, TYPE_UNKNOWN);

case 'tables.setCell': 
const kFTNDCHcsUUc = descendTillSource.call(this, node.A, caseSanitize) || "";
const VtjjzKbQoCKd = descendTillSource.call(this, node.X, caseSanitize) || "";
const LTsBPaCleiaa = descendTillSource.call(this, node.Y, caseSanitize) || "";
const OXeJXtPnGUAG = descendTillSource.call(this, node.B, caseSanitize) || "";
return new TypedInput(`(${kFTNDCHcsUUc}[${VtjjzKbQoCKd}][${LTsBPaCleiaa}] = ${OXeJXtPnGUAG})`, TYPE_UNKNOWN);
case 'tables.getCell': 
const JWpTmbrKYCDU = descendTillSource.call(this, node.A, caseSanitize) || "";
const CdjbZCjkikvO = descendTillSource.call(this, node.X, caseSanitize) || "";
const XBfFvhPHpsnN = descendTillSource.call(this, node.Y, caseSanitize) || "";
return new TypedInput(`(${JWpTmbrKYCDU}[${CdjbZCjkikvO}][${XBfFvhPHpsnN}])`, TYPE_STRING);
case 'tables.getRow': 
const hDyQFvjlQycl = descendTillSource.call(this, node.A, caseSanitize) || "";
const ZYDHkaOFCFKs = descendTillSource.call(this, node.X, caseSanitize) || "";
return new TypedInput(`(${hDyQFvjlQycl}[${ZYDHkaOFCFKs}].join(","))`, TYPE_STRING);
case 'tables.getColumn': 
const usoRHIFwCKtD = descendTillSource.call(this, node.A, caseSanitize) || "";
const aojSVDrWhWVx = descendTillSource.call(this, node.X, caseSanitize) || "";
return new TypedInput(`(JSON.stringify(${usoRHIFwCKtD}.map(row => row[${aojSVDrWhWVx}])))`, TYPE_STRING);

case 'tables.setRow': 
const gBJYSWyinSje = descendTillSource.call(this, node.A, caseSanitize) || "";
const iuAhWorQQiJZ = descendTillSource.call(this, node.X, caseSanitize) || "";
const mIGWPugvXQXb = descendTillSource.call(this, node.B, caseSanitize) || "";
return new TypedInput(`(${gBJYSWyinSje}[${iuAhWorQQiJZ}] = ${mIGWPugvXQXb}.split(","))`, TYPE_UNKNOWN);
case 'tables.setColumn': 
const qSiXojKWxkBC = descendTillSource.call(this, node.A, caseSanitize) || "";
const zBvQqrlusvXO = descendTillSource.call(this, node.X, caseSanitize) || "";
const lKhBwsmvVnwY = descendTillSource.call(this, node.B, caseSanitize) || "";
return new TypedInput(`(${qSiXojKWxkBC}.map((row, i) => (row[${zBvQqrlusvXO}] = ${lKhBwsmvVnwY}[i], row)))`, TYPE_UNKNOWN);
case 'tables.setTable': 
const QfjASfybdeFV = descendTillSource.call(this, node.A, caseSanitize) || "";
const LLORyGULwPMI = descendTillSource.call(this, node.B, caseSanitize) || "";
return new TypedInput(`(${QfjASfybdeFV} = ${LLORyGULwPMI})`, TYPE_UNKNOWN);
case 'tables.fillTable': 
const sZpwTDjjyKfy = descendTillSource.call(this, node.A, caseSanitize) || "";
const armUxvffiWCY = descendTillSource.call(this, node.B, caseSanitize) || "";
return new TypedInput(`(${sZpwTDjjyKfy} = ${sZpwTDjjyKfy}.map(row => row.map(cell => ${armUxvffiWCY})))`, TYPE_UNKNOWN);
case 'tables.clearTable': 
const qvicPMwTYhyU = descendTillSource.call(this, node.A, caseSanitize) || "";
return new TypedInput(`(${qvicPMwTYhyU} = [[]])`, TYPE_UNKNOWN);

case 'tables.getTable': 
const HxLjJBZTWZSP = descendTillSource.call(this, node.A, caseSanitize) || "";
return new TypedInput(`(JSON.stringify(${HxLjJBZTWZSP}))`, TYPE_STRING);
case 'tables.getTotalRows': 
const zsxSgmJKUJzJ = descendTillSource.call(this, node.A, caseSanitize) || "";
return new TypedInput(`(${zsxSgmJKUJzJ}.length)`, TYPE_STRING);
case 'tables.getTotalColumns': 
const gOHOsywrxnhT = descendTillSource.call(this, node.A, caseSanitize) || "";
return new TypedInput(`(${gOHOsywrxnhT}[0].length)`, TYPE_STRING);
          default:
            return originalFn(node);
        }
      },
    });

    cst_patch(mist_STGP, {
      descendStackedBlock(originalFn, block) {
        switch (block.opcode) {
          case 'tables_newTable':
return {
block,
kind: 'tables.newTable',

};

case 'tables_addRow':
return {
block,
kind: 'tables.addRow',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_addColumn':
return {
block,
kind: 'tables.addColumn',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_deleteRow':
return {
block,
kind: 'tables.deleteRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
case 'tables_deleteColumn':
return {
block,
kind: 'tables.deleteColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};

case 'tables_addRows':
return {
block,
kind: 'tables.addRows',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_addColumns':
return {
block,
kind: 'tables.addColumns',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_deleteRows':
return {
block,
kind: 'tables.deleteRows',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),
C: this.descendInputOfBlock(block, 'C'),

};
case 'tables_deleteColumns':
return {
block,
kind: 'tables.deleteColumns',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),
C: this.descendInputOfBlock(block, 'C'),

};

case 'tables_setCell':
return {
block,
kind: 'tables.setCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_getCell':
return {
block,
kind: 'tables.getCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),

};
case 'tables_getRow':
return {
block,
kind: 'tables.getRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
case 'tables_getColumn':
return {
block,
kind: 'tables.getColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};

case 'tables_setRow':
return {
block,
kind: 'tables.setRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_setColumn':
return {
block,
kind: 'tables.setColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_setTable':
return {
block,
kind: 'tables.setTable',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_fillTable':
return {
block,
kind: 'tables.fillTable',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_clearTable':
return {
block,
kind: 'tables.clearTable',
A: this.descendInputOfBlock(block, 'A'),

};

case 'tables_getTable':
return {
block,
kind: 'tables.getTable',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_getTotalRows':
return {
block,
kind: 'tables.getTotalRows',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_getTotalColumns':
return {
block,
kind: 'tables.getTotalColumns',
A: this.descendInputOfBlock(block, 'A'),

};
          default:
            return originalFn(block);
        }
      },

      descendInput(originalFn, block) {
        switch (block.opcode) {
          case 'tables_newTable':
return {
block,
kind: 'tables.newTable',

};

case 'tables_addRow':
return {
block,
kind: 'tables.addRow',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_addColumn':
return {
block,
kind: 'tables.addColumn',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_deleteRow':
return {
block,
kind: 'tables.deleteRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
case 'tables_deleteColumn':
return {
block,
kind: 'tables.deleteColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};

case 'tables_addRows':
return {
block,
kind: 'tables.addRows',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_addColumns':
return {
block,
kind: 'tables.addColumns',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_deleteRows':
return {
block,
kind: 'tables.deleteRows',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),
C: this.descendInputOfBlock(block, 'C'),

};
case 'tables_deleteColumns':
return {
block,
kind: 'tables.deleteColumns',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),
C: this.descendInputOfBlock(block, 'C'),

};

case 'tables_setCell':
return {
block,
kind: 'tables.setCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_getCell':
return {
block,
kind: 'tables.getCell',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
Y: this.descendInputOfBlock(block, 'Y'),

};
case 'tables_getRow':
return {
block,
kind: 'tables.getRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};
case 'tables_getColumn':
return {
block,
kind: 'tables.getColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),

};

case 'tables_setRow':
return {
block,
kind: 'tables.setRow',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_setColumn':
return {
block,
kind: 'tables.setColumn',
A: this.descendInputOfBlock(block, 'A'),
X: this.descendInputOfBlock(block, 'X'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_setTable':
return {
block,
kind: 'tables.setTable',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_fillTable':
return {
block,
kind: 'tables.fillTable',
A: this.descendInputOfBlock(block, 'A'),
B: this.descendInputOfBlock(block, 'B'),

};
case 'tables_clearTable':
return {
block,
kind: 'tables.clearTable',
A: this.descendInputOfBlock(block, 'A'),

};

case 'tables_getTable':
return {
block,
kind: 'tables.getTable',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_getTotalRows':
return {
block,
kind: 'tables.getTotalRows',
A: this.descendInputOfBlock(block, 'A'),

};
case 'tables_getTotalColumns':
return {
block,
kind: 'tables.getTotalColumns',
A: this.descendInputOfBlock(block, 'A'),

};
          default:
            return originalFn(block);
        }
      },
    });

    Scratch.extensions.register(new tables());
  })(Scratch);
