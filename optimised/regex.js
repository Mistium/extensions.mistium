// Name: RegExp
// ID: truefantomregexp
// Description: Full interface for working with Regular Expressions.
// By: TrueFantom <https://scratch.mit.edu/users/TrueFantom/>
// License: MIT
// Context: RegExp is short for "Regular Expression", a sort of programming language. This extension uses [IMAGE] to indicate that the following input should contain a regular expression.
// Why?: This has been modified for file size optimisation in https://origin.mistium.com

((Scratch) => {
  "use strict";

  const cast = Scratch.Cast;

  const toJsonString = (val) => {
    return JSON.stringify(
      val,
      (key, value) => {
        return value === undefined ? "" : value;
      },
      0
    );
  };

  const toRegExpData = (val) => {
    let arr = /\/(.*)\/(.*)/.exec(val);
    return new RegExp(arr[1], arr[2]);
  };
  const toRegExpString = (val) => {
    return String(val);
  };

  const RegExpCompare = (redat, restr) => {
    let arr = /\/(.*)\/(.*)/.exec(restr);
    return (
      toRegExpString(redat) ===
      "/" + arr[1] + "/" + Array.from(arr[2]).sort().join("")
    );
  };

  class ScratchRegExp {
    getInfo() {
      return {
        id: "truefantomregexp",
        name: Scratch.translate("RegExp"),

        color1: "#e6282a",

        blocks: [
          {
            opcode: "is_regexp_block",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("is re [A] ?"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
            },
          },
          "---",
          {
            opcode: "regexp_equal_block",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("re [A] = re [B]"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/ig",
              }
            },
          },
          "---",
          {
            opcode: "regexp_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("re with pattern [A] and flags [B]"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "gi",
              }
            },
          },
          {
            opcode: "regexp_contains_flags_block",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("re [A] contains flags [B] ?"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "gi",
              }
            },
          },
          {
            opcode: "regexp_components_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[B] of re [A]"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                menu: "components_menu",
              }
            },
          },
          "---",
          {
            opcode: "regexp_set_pattern_flags_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("re [A] set [B] to [C]"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                menu: "components_menu",
              },
              C: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "banana",
              }
            },
          },
          {
            opcode: "regexp_add_flags_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("add flags [B] to [A]"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "gi",
              }
            },
          },
          {
            opcode: "regexp_delete_flags_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("delete flags [B] of re [A]"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "gi",
              }
            },
          },
          "---",
          {
            opcode: "regexp_test_block",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("[A] matches with regex [B] ?"),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              }
            },
          },
          {
            opcode: "regexp_replace_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate(
              "replace matches of [A] with regex [B] to [C]"
            ),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              C: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "banana",
              }
            },
          },
          {
            opcode: "regexp_split_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate(
              "[A] split by matches with regex [B]"
            ),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              }
            },
          },
          {
            opcode: "regexp_match_block",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate(
              "match [C] of [A] with regex [B]"
            ),
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple",
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "/apple/gi",
              },
              C: {
                type: Scratch.ArgumentType.STRING,
                menu: "match_menu",
              }
            },
          },
        ],
        menus: {
          components_menu: {
            acceptReporters: false,
            items: [
              {
                text: Scratch.translate("pattern"),
                value: "pattern",
              },
              {
                text: Scratch.translate("flags"),
                value: "flags",
              },
            ],
          },
          match_menu: {
            acceptReporters: false,
            items: [
              {
                text: Scratch.translate("values"),
                value: "values",
              },
              {
                text: Scratch.translate("keys"),
                value: "keys",
              },
              {
                text: Scratch.translate("pairs"),
                value: "pairs",
              },
              {
                text: Scratch.translate({
                  default: "map",
                  description: "This is the computer science kind of map.",
                }),
                value: "map",
              },
            ],
          },
        },
      };
    }

    is_regexp_block({ A }) {
      try {
        let restr = cast.toString(A);
        let redat = toRegExpData(restr);
        return RegExpCompare(redat, restr);
      } catch (err) {
        return false;
      }
    }
    regexp_equal_block({ A, B }) {
      try {
        let restr1 = cast.toString(A);
        let redat1 = toRegExpData(restr1);
        let restr2 = cast.toString(B);
        let redat2 = toRegExpData(restr2);
        if (RegExpCompare(redat1, restr1) && RegExpCompare(redat2, restr2)) {
          return (
            redat1.source === redat2.source && redat1.flags === redat2.flags
          );
        }
        return false;
      } catch (err) {
        return false;
      }
    }
    regexp_block({ A, B }) {
      try {
        return toRegExpString(new RegExp(cast.toString(A), cast.toString(B)));
      } catch (err) {
        return "";
      }
    }
    regexp_contains_flags_block({ A, B }) {
      try {
        let restr = cast.toString(A);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          let output = true;
          let flags = Array.from(redat.flags);
          Array.from(cast.toString(B)).forEach((flag) =>
            flags.includes(flag)
              ? flags.splice(flags.indexOf(flag), 1)
              : (output = false)
          );
          return output;
        }
        return false;
      } catch (err) {
        return false;
      }
    }
    regexp_components_block({ A, B }) {
      try {
        let restr = cast.toString(A);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          const components = cast.toString(B).toLowerCase();
          switch (components) {
            case "pattern":
              return redat.source;
            case "flags":
              return redat.flags;
          }
        }
        return "";
      } catch (err) {
        return "";
      }
    }
    regexp_set_pattern_flags_block({ A, B, C }) {
      try {
        let restr = cast.toString(A);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          const components = cast.toString(B).toLowerCase();
          switch (components) {
            case "pattern":
              return toRegExpString(new RegExp(cast.toString(C), redat.flags));
            case "flags":
              return toRegExpString(new RegExp(redat.source, cast.toString(C)));
          }
        }
        return "";
      } catch (err) {
        return "";
      }
    }
    regexp_add_flags_block({ A, B }) {
      try {
        let restr = cast.toString(A);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          let _flagtest = new RegExp("test", cast.toString(B));
          let flags = Array.from(redat.flags);
          Array.from(cast.toString(B)).forEach((flag) =>
            flags.includes(flag) ? void 0 : flags.push(flag)
          );
          return toRegExpString(new RegExp(redat.source, flags.join("")));
        }
        return "";
      } catch (err) {
        return "";
      }
    }
    regexp_delete_flags_block({ A, B }) {
      try {
        let restr = cast.toString(A);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          let _flagtest = new RegExp("test", cast.toString(B));
          let flags = Array.from(redat.flags);
          Array.from(cast.toString(B)).forEach((flag) =>
            flags.includes(flag) ? flags.splice(flags.indexOf(flag), 1) : void 0
          );
          return toRegExpString(new RegExp(redat.source, flags.join("")));
        }
        return "";
      } catch (err) {
        return "";
      }
    }
    regexp_test_block({ A, B }) {
      try {
        let restr = cast.toString(B);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          return redat.test(cast.toString(A));
        }
        return false;
      } catch (err) {
        return false;
      }
    }
    regexp_replace_block({ A, B, C }) {
      try {
        let restr = cast.toString(B);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          return cast.toString(A).replace(redat, cast.toString(C));
        }
        return "";
      } catch (err) {
        return "";
      }
    }
    regexp_split_block({ A, B }) {
      try {
        let restr = cast.toString(B);
        let redat = toRegExpData(restr);
        if (RegExpCompare(redat, restr)) {
          return toJsonString(cast.toString(A).split(redat) || []);
        }
        return "";
      } catch (err) {
        return "";
      }
    }
    regexp_match_block({ A, B, C }) {
      try {
        let restr = cast.toString(B);
        let redat = toRegExpData(restr);
        let str = cast.toString(A);
        if (RegExpCompare(redat, restr)) {
          const gredat = redat.global
            ? redat
            : new RegExp(redat.source, redat.flags + "g");
          const match = cast.toString(C).toLowerCase();
          let data;
          switch (match) {
            case "values":
              data = Array.from(str.matchAll(gredat)).map((val) => val[0]);
              return toJsonString(
                redat.global ? data : data[0] ? [data[0]] : []
              );
            case "keys":
              data = Array.from(str.matchAll(gredat)).map((val) =>
                String(val.index + 1)
              );
              return toJsonString(
                redat.global ? data : data[0] ? [data[0]] : []
              );
            case "pairs":
              data = Array.from(str.matchAll(gredat)).reduce(
                (obj, val) => ((obj[val.index + 1] = val[0]), obj),
                {}
              );
              return toJsonString(
                redat.global
                  ? data
                  : Object.keys(data)[0]
                    ? { [Object.keys(data)[0]]: Object.values(data)[0] }
                    : {}
              );
            case "map":
              data = Array.from(str.matchAll(gredat)).map((val) => [
                String(val.index + 1),
                val[0],
              ]);
              return toJsonString(
                redat.global ? data : data[0] ? [data[0]] : []
              );
          }
        }
        return "";
      } catch (err) {
        return "";
      }
    }
  }

  Scratch.extensions.register(new ScratchRegExp());
})(Scratch);
