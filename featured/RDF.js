(function(Scratch) {
  'use strict';
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }


  if (!window.RDF) {
    !function(t){t.RDF=new class{constructor(){this.version="v02",this.rtrExp=new class{constructor(){this.RE_NUMBER=/^-?\d+(\.\d+)?$/,this.operators={"==":(t,e)=>t===e,"!=":(t,e)=>t!==e,">=":(t,e)=>t>=e,"<=":(t,e)=>t<=e,">":(t,e)=>t>e,"<":(t,e)=>t<e,"+":(t,e)=>t+e,"-":(t,e)=>t-e,"*":(t,e)=>t*e,"/":(t,e)=>t/e,"%":(t,e)=>(t%e+e)%e,"^":(t,e)=>t**e,"?":(t,e,r)=>t?e:r},this.functions={log:(...t)=>console.log(...t),min:(...t)=>Math.min(...t),max:(...t)=>Math.max(...t),abs:t=>Math.abs(t),round:t=>Math.round(t),floor:t=>Math.floor(t),ceil:t=>Math.ceil(t),sqrt:t=>Math.sqrt(t),sin:t=>Math.sin(t),cos:t=>Math.cos(t),tan:t=>Math.tan(t),asin:t=>Math.asin(t),acos:t=>Math.acos(t),atan:t=>Math.atan(t),join:(...t)=>t.join(""),split:(t,e)=>t.split(e),keys:t=>Object.keys(t),values:t=>Object.values(t),length:t=>t.length,item:(t,e)=>t[e],typeof:t=>typeof t,range:(t,e)=>Array.from({length:e-t+1},((e,r)=>t+r)),input:t=>prompt(t),chr:t=>String.fromCharCode(t),ord:t=>t.charCodeAt(0),not:t=>!t,"!":t=>!t,set:(t,e,r)=>(t[e]=r,t),obj:()=>({}),del:(t,e)=>(delete t[e],t),has:(t,e)=>t.hasOwnProperty(e),all:(...t)=>t.every(Boolean),any:(...t)=>t.some(Boolean),return:t=>{this.setVar(" return_val",t,"="),this.setVar(" returned",!0,"=")},toNum:t=>0|t,toStr:t=>""+t}}splitByDelimiters(t,e){let r=!1,s=0,n="",i=[];for(let a=0;a<t.length;a++){let o=t[a];'"'===o&&(r=!r),r||!e.includes(o)?n+=o:!r&&e.includes(o)&&(s?n+=o:(i.push(n),n="")),"([{".includes(o)&&s++,")]}".includes(o)&&s--}return n&&i.push(n),i}parseExpression(t){for(t=t.trim();t.startsWith("(")&&t.endsWith(")");){const e=t.slice(1,-1);if(!this.balancedParentheses(e))break;t=e}if(t.indexOf("(")>0&&t.endsWith(")")){const e=t.indexOf("("),r=t.substring(0,e),s=t.substring(e+1,t.length-1);if(this.functions[r]){const t=this.splitByDelimiters(s,",").map((t=>this.evaluate(t.trim())));return this.functions[r](...t)}}let e=Object.keys(this.operators);e.sort(((t,e)=>e.length-t.length));for(const r of e){const e=this.splitOperator(t,r);if(e){const[t,s]=e;return this.operators[r](this.evaluate(t),this.evaluate(s))}}return this.RE_NUMBER.test(t)?parseFloat(t):"true"===t||"false"!==t&&t}splitOperator(t,e){let r=0,s=!1;for(let n=0;n<=t.length-e.length;n++)if('"'===t[n]&&(s=!s),"("===t[n]&&r++,")"===t[n]&&r--,!s&&0===r&&t.substring(n,n+e.length)===e)return[t.substring(0,n).trim(),t.substring(n+e.length).trim()];return null}balancedParentheses(t){let e=0;for(let r=0;r<t.length;r++)if("("===t[r]&&e++,")"===t[r]&&e--,e<0)return!1;return 0===e}evaluate(t){return this.parseExpression(t)}},this.tokenCache=new Map,this.typeValidators={string:t=>"string"==typeof t,number:t=>"number"==typeof t,object:t=>"object"==typeof t&&null!==t&&!Array.isArray(t),array:t=>Array.isArray(t),boolean:t=>"boolean"==typeof t,any:()=>!0},this.validateType=(t,e)=>this.typeValidators[e]?.(t)??!0,this.evaluateConstraint=(t,e)=>t.includes("value")?this.rtrExp.evaluate(t.replace(/value/g,e)):this.rtrExp.evaluate(t.replace(/>/g,`${e} >`).replace(/</g,`${e} <`).replace(/=/g,`${e} =`))}tokenise(t,e){const r=`t:${t}:${e}`;if(this.tokenCache.has(r))return this.tokenCache.get(r);try{let s=0,n="",i=0,a=0,o=[],h=[];const l=t.length;for(;s<l;)n=t[s],'"'===n?(i=1-i,o.push('"')):o.push(n),0===i&&("["!==n&&"{"!==n&&"("!==n||a++,"]"!==n&&"}"!==n&&")"!==n||a--,a=a<0?0:a),s++,0===i&&t[s]===e&&0===a&&(h.push(o.join("")),o=[],s++);return h.push(o.join("")),this.tokenCache.set(r,h),h}catch{return[]}}tokeniseEscaped(t,e){const r=`te:${t}:${e}`;if(this.tokenCache.has(r))return this.tokenCache.get(r);try{let s=0,n="",i=0,a=0,o=[],h=[],l=!1;const c=t.length;for(;s<c;)n=t[s],0!==i||l||("["!==n&&"{"!==n&&"("!==n||a++,"]"!==n&&"}"!==n&&")"!==n||a--,a=a<0?0:a),'"'!==n||l?"\\"!==n||l?(o.push(n),l=!1):(l=!l,o.push("\\")):(i=1-i,o.push('"')),s++,0===i&&t[s]===e&&0===a&&(h.push(o.join("")),o=[],s++);return h.push(o.join("")),this.tokenCache.set(r,h),h}catch{return[]}}autoTokenise(t,e=" "){const r=`at:${t}:${e}`;if(this.tokenCache.has(r))return this.tokenCache.get(r);let s;return s=-1!==t.indexOf("\\")?this.tokeniseEscaped(t,e):/["[\]{(]/.test(t)?this.tokenise(t,e):t.split(e),this.tokenCache.set(r,s),s}_parseIntoToken(t){const e=`pit:${t}`;if(this.tokenCache.has(e))return this.tokenCache.get(e);const r=t.startsWith("{")&&t.endsWith("}")?this.autoTokenise(t.slice(1,-1),";").map((t=>t.trim())):t.split(";");return this.tokenCache.set(e,r),r}error(t){throw new Error(`RDF ${this.version} error: ${t}`)}parse(t){(t=t.trim()).startsWith("{")&&t.endsWith("}")||this.error("Data must be enclosed in curly braces"),t=t.replace(/\s+/g," ").replace(/; *}/g,"}");const e={},r=this._parseIntoToken(t);for(let t of r){if(!t.trim())continue;const r=this.autoTokenise(t,"=");2!==r.length&&this.error(`Invalid token: ${t}`);const s=r[1].trim();let n,i=[],a=[];const o=s.match(/^(.+?)\s+where\s+(?:each\s+)?(.+)$/);if(o){const[,t,e]=o;n=this._parseValue(t.trim());const r=s.includes("where each"),h=e.trim();r?a.push(h):i.push(h)}else n=this._parseValue(s);const h=this._parseTypeInfo(r[0].trim()),{fieldName:l,fieldType:c,elementType:p}=h,u=this,y=t=>!p||u.validateType(t,p),f=(t,e)=>!e?.length||e.every((e=>{try{return u.evaluateConstraint(e,t)}catch{return!1}}));if(this.validateType(n,c)||this.error(`Type mismatch: '${l}' must be a ${c}`),"array"===c){if(Array.isArray(n)&&n.length>0){if(!n.every((t=>y(t)&&f(t,a)))){const t=p&&a.length?`Type or constraint mismatch in array '${l}'`:p?`Type mismatch in array '${l}'`:`Constraint violation in array '${l}'`;this.error(t)}}n=this._createArrayProxy(n,l,p,a)}else f(n,i)||this.error(`Constraint violation for '${l}'`);const d=function(t){if(!u.validateType(t,c))throw new Error(`Type mismatch: '${l}' must be a ${c}`);if("array"===c){if(Array.isArray(t)&&t.length>0){if(!t.every((t=>y(t)&&f(t,a))))throw new Error(`Type or constraint violation in array '${l}'`)}n=u._createArrayProxy(t,l,p,a)}else{if(!f(t,i))throw new Error(`Constraint violation for '${l}'`);n=t}};Object.assign(d,{constraints:i,elementConstraints:a,fieldType:c,elementType:p}),Object.defineProperty(e,l,{get:()=>n,set:d,enumerable:!0,configurable:!0})}return e}_parseValue(t){return t.startsWith('"')&&t.endsWith('"')?t.slice(1,-1):t.startsWith("{")&&t.endsWith("}")?this.parse(t):t.startsWith("[")&&t.endsWith("]")?"[]"===t?[]:this._parseArray(t.slice(1,-1)):"true"===t||"false"!==t&&(isNaN(+t)?t:+t)}_parseArray(t){return this.autoTokenise(t,",").map((t=>this._parseValue(t.trim())))}_parseTypeInfo(t){const e=this.autoTokenise(t," "),r={fieldName:e[0],fieldType:"any",elementType:null};if(e.length<=1)return r;if(r.fieldType=e[0].toLowerCase(),r.fieldName=e[1],r.fieldType.startsWith("array<")&&r.fieldType.endsWith(">")){const t=r.fieldType.substring(6,r.fieldType.length-1);r.elementType=t.toLowerCase(),r.fieldType="array"}return r}_createArrayProxy(t,e,r,s){const n=this,i=Array.isArray(t)?t:[];return new Proxy(i,{get:(t,i)=>["push","unshift","splice"].includes(i)?function(...a){const o="splice"===i?a.slice(2):a;for(const t of o){if(r&&!n.validateType(t,r))throw new Error(`Type mismatch: Elements of '${e}' must be of type ${r}`);if(!s?.length)continue;let i=!0;for(const e of s)try{if(!n.evaluateConstraint(e,t)){i=!1;break}}catch{i=!1;break}if(!i)throw new Error(`Constraint violation for element of '${e}'`)}return Array.prototype[i].apply(t,a)}:t[i]})}stringify(t,e=0,r=0){const s=" ".repeat(r*(e|=0)),n=" ".repeat((r+1)*e);let i="{\n";for(const s in t){if(!Object.prototype.hasOwnProperty.call(t,s))continue;const a=t[s],o=Object.getOwnPropertyDescriptor(t,s).set;let h;h=Array.isArray(a)?0===a.length?"[]":`[${a.map((t=>this._formatValue(t))).join(", ")}]`:"object"==typeof a&&null!==a?this.stringify(a,e,r+1):"string"==typeof a?`"${a}"`:"boolean"==typeof a?a?"true":"false":a;let l=s;o?.fieldType&&("array"===o.fieldType?l=`array<${o.elementType||"any"}> ${l}`:"any"!==o.fieldType&&(l=`${o.fieldType} ${l}`));let c=h;o?.constraints?.length?c=`${h} where ${o.constraints[0]}`:o?.elementConstraints?.length&&(c=`${h} where each ${o.elementConstraints[0]}`),i+=`${n}${l.trim()} = ${c};\n`}return i+=`${s}}`,e<1?i.replace(/[\n;]\s*/g,";"):i}_formatValue(t){return"string"==typeof t?`"${t}"`:"boolean"==typeof t?t?"true":"false":"object"==typeof t&&null!==t?this.stringify(t):t}setProperty(t,e){const r=this.parse(`{ ${e} }`),s=Object.keys(r)[0];s||this.error(`Invalid property definition: ${e}`);const n=Object.getOwnPropertyDescriptor(r,s);return Object.defineProperty(t,s,n),t[s]=r[s],t}}}(window);
  }

  class RDFS3Extension {
    constructor() {
      this._objectCache = {};
      this._lastResult = {
        success: false,
        message: ''
      };
    }

    getInfo() {
      return {
        id: 'rdf',
        name: 'RDF',
        color1: '#4C97FF',
        color2: '#3373CC',
        blocks: [
          {
            opcode: 'createEmptyRDFObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create empty RDF object as [id]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              }
            }
          },
          {
            opcode: 'parseRDF',
            blockType: Scratch.BlockType.COMMAND,
            text: 'parse RDF [text] into [id]',
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{ name = "value"; }'
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              }
            }
          },
          "---",
          {
            opcode: 'setPropertyValue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [property] to [value] in RDF object [id]',
            arguments: {
              property: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'name'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'newValue'
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              }
            }
          },
          {
            opcode: 'setProperty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'define property [definition] in RDF object [id]',
            arguments: {
              definition: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'name = "value"'
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              }
            }
          },
          {
            opcode: 'getPropertyValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [property] from RDF object [id]',
            arguments: {
              property: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'name'
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              }
            }
          },
          "---",
          {
            opcode: 'stringifyRDF',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get RDF object [id] as text with indent [indent]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              },
              indent: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              }
            }
          },
          "---",
          {
            opcode: 'objectExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'RDF object [id] exists?',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              }
            }
          },
          {
            opcode: 'deleteObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete RDF object [id]',
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myObject'
              }
            }
          },
          "---",
          {
            opcode: 'wasSuccessful',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'last operation succeeded?'
          },
          {
            opcode: 'getLastError',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last error message'
          },
          "---",
          {
            opcode: 'evaluateExpression',
            blockType: Scratch.BlockType.REPORTER,
            text: 'evaluate expression [expr]',
            arguments: {
              expr: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1 + 2'
              }
            }
          }
        ]
      };
    }

    parseRDF(args) {
      try {
        this._lastResult.success = false;
        this._lastParseResult = window.RDF.parse(args.text);
        this._objectCache[args.id] = this._lastParseResult;
        this._lastResult.success = true;
        this._lastResult.message = '';
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
      }
    }

    wasSuccessful() {
      return this._lastResult.success;
    }

    getLastError() {
      return this._lastResult.message;
    }

    stringifyRDF(args) {
      try {
        const obj = this._objectCache[args.id];
        if (!obj) {
          this._lastResult.success = false;
          this._lastResult.message = `Object '${args.id}' not found`;
          return '';
        }
        this._lastResult.success = true;
        return window.RDF.stringify(obj, parseInt(args.indent, 10) || 0);
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
        return '';
      }
    }

    getPropertyValue(args) {
      try {
        const obj = this._objectCache[args.id];
        if (!obj) {
          this._lastResult.success = false;
          this._lastResult.message = `Object '${args.id}' not found`;
          return '';
        }
        
        const value = obj[args.property];
        this._lastResult.success = true;
        
        if (value === undefined) return '';
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value.toString();
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
        return '';
      }
    }

    setPropertyValue(args) {
      try {
        const obj = this._objectCache[args.id];
        if (!obj) {
          this._lastResult.success = false;
          this._lastResult.message = `Object '${args.id}' not found`;
          return;
        }
        
        // Try to parse the value if it's a number or boolean
        let value = args.value;
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (!isNaN(Number(value))) value = Number(value);
        
        obj[args.property] = value;
        this._lastResult.success = true;
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
      }
    }

    createEmptyRDFObject(args) {
      try {
        this._objectCache[args.id] = window.RDF.parse('{}');
        this._lastResult.success = true;
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
      }
    }

    setProperty(args) {
      try {
        const obj = this._objectCache[args.id];
        if (!obj) {
          this._lastResult.success = false;
          this._lastResult.message = `Object '${args.id}' not found`;
          return;
        }
        
        window.RDF.setProperty(obj, args.definition);
        this._lastResult.success = true;
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
      }
    }

    deleteObject(args) {
      try {
        if (this._objectCache[args.id] === undefined) {
          this._lastResult.success = false;
          this._lastResult.message = `Object '${args.id}' not found`;
          return;
        }
        
        delete this._objectCache[args.id];
        this._lastResult.success = true;
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
      }
    }

    objectExists(args) {
      return !!this._objectCache[args.id];
    }

    evaluateExpression(args) {
      try {
        const result = window.RDF.rtrExp.evaluate(args.expr);
        this._lastResult.success = true;
        return result !== undefined ? result.toString() : '';
      } catch (e) {
        this._lastResult.success = false;
        this._lastResult.message = e.message;
        return '';
      }
    }
  }

  Scratch.extensions.register(new RDFS3Extension());
})(Scratch);
