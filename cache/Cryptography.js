/**!
 * Cryptography
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */

// modified by mistium for originOS reduced file size

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Cryptography" must run unsandboxed.`);
  }
  /**!
  * AES implementation in JavaScript (c) Chris Veness 2005-2014
  * Released under the MIT License.
  * https://rawgit.com/victornpb/f639f37373be0f6e82e1/raw/5d8f7ee8b32ae04de087d2377d8086e3389ee411/AES.js
  * AES (Rijndael cipher) encryption routines,
  * Reference implementation of FIPS-197 http://csrc.nist.gov/publications/fips/fips197/fips-197.pdf.
  */
  // @ts-ignore
  var Aes = {}; if (Aes.cipher = function ($, x) { for (var e = x.length / 4 - 1, r = [[], [], [], []], o = 0; o < 16; o++)r[o % 4][Math.floor(o / 4)] = $[o]; r = Aes.addRoundKey(r, x, 0, 4); for (var f = 1; f < e; f++)r = Aes.subBytes(r, 4), r = Aes.shiftRows(r, 4), r = Aes.mixColumns(r, 4), r = Aes.addRoundKey(r, x, f, 4); r = Aes.subBytes(r, 4), r = Aes.shiftRows(r, 4), r = Aes.addRoundKey(r, x, e, 4); for (var t = Array(16), o = 0; o < 16; o++)t[o] = r[o % 4][Math.floor(o / 4)]; return t }, Aes.keyExpansion = function ($) { for (var x = $.length / 4, e = x + 6, r = Array(4 * (e + 1)), o = [, , , ,], f = 0; f < x; f++) { var t = [$[4 * f], $[4 * f + 1], $[4 * f + 2], $[4 * f + 3]]; r[f] = t } for (var f = x; f < 4 * (e + 1); f++) { r[f] = [, , , ,]; for (var n = 0; n < 4; n++)o[n] = r[f - 1][n]; if (f % x == 0) { o = Aes.subWord(Aes.rotWord(o)); for (var n = 0; n < 4; n++)o[n] ^= Aes.rCon[f / x][n] } else x > 6 && f % x == 4 && (o = Aes.subWord(o)); for (var n = 0; n < 4; n++)r[f][n] = r[f - x][n] ^ o[n] } return r }, Aes.subBytes = function ($, x) { for (var e = 0; e < 4; e++)for (var r = 0; r < x; r++)$[e][r] = Aes.sBox[$[e][r]]; return $ }, Aes.shiftRows = function ($, x) { for (var e = [, , , ,], r = 1; r < 4; r++) { for (var o = 0; o < 4; o++)e[o] = $[r][(o + r) % x]; for (var o = 0; o < 4; o++)$[r][o] = e[o] } return $ }, Aes.mixColumns = function ($, x) { for (var e = 0; e < 4; e++) { for (var r = [, , , ,], o = [, , , ,], f = 0; f < 4; f++)r[f] = $[f][e], o[f] = 128 & $[f][e] ? $[f][e] << 1 ^ 283 : $[f][e] << 1; $[0][e] = o[0] ^ r[1] ^ o[1] ^ r[2] ^ r[3], $[1][e] = r[0] ^ o[1] ^ r[2] ^ o[2] ^ r[3], $[2][e] = r[0] ^ r[1] ^ o[2] ^ r[3] ^ o[3], $[3][e] = r[0] ^ o[0] ^ r[1] ^ r[2] ^ o[3] } return $ }, Aes.addRoundKey = function ($, x, e, r) { for (var o = 0; o < 4; o++)for (var f = 0; f < r; f++)$[o][f] ^= x[4 * e + f][o]; return $ }, Aes.subWord = function ($) { for (var x = 0; x < 4; x++)$[x] = Aes.sBox[$[x]]; return $ }, Aes.rotWord = function ($) { for (var x = $[0], e = 0; e < 3; e++)$[e] = $[e + 1]; return $[3] = x, $ }, Aes.sBox = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22], Aes.rCon = [[0, 0, 0, 0], [1, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [8, 0, 0, 0], [16, 0, 0, 0], [32, 0, 0, 0], [64, 0, 0, 0], [128, 0, 0, 0], [27, 0, 0, 0], [54, 0, 0, 0]], "undefined" != typeof module && module.exports && (module.exports = Aes), "function" == typeof define && define.amd && define([], function () { return Aes }), "undefined" != typeof module && module.exports) var Aes = require("./aes"); Aes.Ctr = {}, Aes.Ctr.encrypt = function ($, x, e) { if (!(128 == e || 192 == e || 256 == e)) return ""; $ = String($).utf8Encode(), x = String(x).utf8Encode(); for (var r = e / 8, o = Array(r), f = 0; f < r; f++)o[f] = isNaN(x.charCodeAt(f)) ? 0 : x.charCodeAt(f); var t = Aes.cipher(o, Aes.keyExpansion(o)); t = t.concat(t.slice(0, r - 16)); for (var n = Array(16), a = new Date().getTime(), d = a % 1e3, s = Math.floor(a / 1e3), c = Math.floor(65535 * Math.random()), f = 0; f < 2; f++)n[f] = d >>> 8 * f & 255; for (var f = 0; f < 2; f++)n[f + 2] = c >>> 8 * f & 255; for (var f = 0; f < 4; f++)n[f + 4] = s >>> 8 * f & 255; for (var _ = "", f = 0; f < 8; f++)_ += String.fromCharCode(n[f]); for (var i = Aes.keyExpansion(t), u = Math.ceil($.length / 16), A = Array(u), b = 0; b < u; b++) { for (var v = 0; v < 4; v++)n[15 - v] = b >>> 8 * v & 255; for (var v = 0; v < 4; v++)n[15 - v - 4] = b / 4294967296 >>> 8 * v; for (var p = Aes.cipher(n, i), h = b < u - 1 ? 16 : ($.length - 1) % 16 + 1, y = Array(h), f = 0; f < h; f++)y[f] = p[f] ^ $.charCodeAt(16 * b + f), y[f] = String.fromCharCode(y[f]); A[b] = y.join("") } var C = _ + A.join(""); return C.base64Encode() }, Aes.Ctr.decrypt = function ($, x, e) { if (!(128 == e || 192 == e || 256 == e)) return ""; $ = String($).base64Decode(), x = String(x).utf8Encode(); for (var r = e / 8, o = Array(r), f = 0; f < r; f++)o[f] = isNaN(x.charCodeAt(f)) ? 0 : x.charCodeAt(f); var t = Aes.cipher(o, Aes.keyExpansion(o)); t = t.concat(t.slice(0, r - 16)); for (var n = Array(8), a = $.slice(0, 8), f = 0; f < 8; f++)n[f] = a.charCodeAt(f); for (var d = Aes.keyExpansion(t), s = Math.ceil(($.length - 8) / 16), c = Array(s), _ = 0; _ < s; _++)c[_] = $.slice(8 + 16 * _, 8 + 16 * _ + 16); $ = c; for (var i = Array($.length), _ = 0; _ < s; _++) { for (var u = 0; u < 4; u++)n[15 - u] = _ >>> 8 * u & 255; for (var u = 0; u < 4; u++)n[15 - u - 4] = (_ + 1) / 4294967296 - 1 >>> 8 * u & 255; for (var A = Aes.cipher(n, d), b = Array($[_].length), f = 0; f < $[_].length; f++)b[f] = A[f] ^ $[_].charCodeAt(f), b[f] = String.fromCharCode(b[f]); i[_] = b.join("") } var v = i.join(""); return v.utf8Decode() }, void 0 === String.prototype.utf8Encode && (String.prototype.utf8Encode = function () { return unescape(encodeURIComponent(this)) }), void 0 === String.prototype.utf8Decode && (String.prototype.utf8Decode = function () { try { return decodeURIComponent(escape(this)) } catch ($) { return this } }), void 0 === String.prototype.base64Encode && (String.prototype.base64Encode = function () { if ("undefined" != typeof btoa) return btoa(this); if ("undefined" != typeof Buffer) return new Buffer(this, "utf8").toString("base64"); throw Error("No Base64 Encode") }), void 0 === String.prototype.base64Decode && (String.prototype.base64Decode = function () { if ("undefined" != typeof atob) return atob(this); if ("undefined" != typeof Buffer) return new Buffer(this, "base64").toString("utf8"); throw Error("No Base64 Decode") }), "undefined" != typeof module && module.exports && (module.exports = Aes.Ctr), "function" == typeof define && define.amd && define(["Aes"], function () { return Aes.Ctr });

  // const label = (text) => ({blockType: Scratch.BlockType.LABEL, text});

  const menus = {
    bytes: {
      acceptReporters: true,
      items: ['256', '128'],
    },
  };

  class extension {
    getInfo() {
      return {
        id: '0znzwCrypto',
        name: 'Cryptography',
        color1: '#0a6522',
        blocks: [
          {
            opcode: 'aesEncrypt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'AES; encrypt [DATA] with secret [SECRET] and [BYTES]bytes',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, World!',
              },
              SECRET: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'password123',
              },
              BYTES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 256,
                menu: 'bytes',
              },
            },
          },
          {
            opcode: 'aesDecrypt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'AES; decrypt [DATA] with secret [SECRET] and [BYTES]bytes',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '...',
              },
              SECRET: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'password123',
              },
              BYTES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 256,
                menu: 'bytes',
              },
            },
          },
        ],
        menus,
      };
    }
    /* AES */
    aesEncrypt({ DATA, SECRET, BYTES }) {
      DATA = Scratch.Cast.toString(DATA);
      SECRET = Scratch.Cast.toString(SECRET);
      BYTES = Scratch.Cast.toNumber(BYTES);
      try { return Aes.Ctr.encrypt(DATA, SECRET, BYTES); } catch { return '' };
    }
    aesDecrypt({ DATA, SECRET, BYTES }) {
      DATA = Scratch.Cast.toString(DATA);
      SECRET = Scratch.Cast.toString(SECRET);
      BYTES = Scratch.Cast.toNumber(BYTES);
      try { return Aes.Ctr.decrypt(DATA, SECRET, BYTES); } catch { return '' };
    }
  }

  // @ts-ignore
  Scratch.extensions.register(new extension());
})(Scratch);
