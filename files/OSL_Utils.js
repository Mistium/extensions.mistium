
function tokenise(CODE) {
  try {
    let letter = 0;
    let depth = "";
    let brackets = 0;
    let out = [];
    let split = [];
    const len = CODE.length;

    while (letter < len) {
      depth = CODE[letter];
      if (depth === "\"") {
        brackets = 1 - brackets;
        out.push("\"");
      } else {
        out.push(depth);
      }
      letter++;

      if (brackets === 0 && CODE[letter] === " ") {
        split.push(out.join(''));
        out = [];
        letter++;
      }
    }
    split.push(out.join(''));
    return split;
  } catch (e) {
    return [];
  }
}


function randomString(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

(function (Scratch) {
  "use strict";

  const vm = Scratch.vm;

  function destring(str) {
    if (str[0] === '"' && str[str.length - 1] === '"') {
      return str.substring(1, str.length - 1);
    } else {
      return str;
    }
  }


  function compileModifiers(OSL) {
    let i = -1
    let out = []
    let spl = []
    while (i < OSL.length) {
      i++
      let line = tokenise(OSL[i])
      let pos = line.indexOf(":")
      if (pos !== -1) {
        pos++
        while (pos <= line.length - 1) {
          let cur = line[pos]
          pos++
          spl = cur.split("#")
          switch (spl[0]) {
            case "c":
              out.push(`c ${spl[1]}`)
              break;
            case "cursor":
              out.push(`cursor ${spl[1]}`)
              break;
            case "hover_c":
              out.push(`hc ${spl[1]}`)
              break;
            case "hover_size":
              out.push(`hs ${spl[1]}`)
              break;
            case "chx":
              out.push(`change_x ${spl[1]}`)
              break;
            case "chy":
              out.push(`change_y ${spl[1]}`)
              break;
            case "click_c":
              out.push(`if mouse_down "hc ${spl[1]}"`)
              break;
            case "click_size":
              out.push(`if mouse_down "hs ${spl[1]}"`)
              break;
            case "tooltip":
              out.push(`tooltip ${spl[1]}`)
              break;
          }
        }
        OSL[i] = OSL[i].split(":")[0].trim()
      }
      out.push(OSL[i])
    }
    return out
  }

  function compileStringConcat(OSL) {
    let out = []
    for (let line of OSL) {
      if (line && line.indexOf("`") !== -1) {
        line = line.replace(/\$\{([^\}]*)\}/gm, '" ++ $1 ++ "').replace(' ++ \"\" ++ ', '" ++ "').replace(/\`([^\`]+)\`/gm, '( "$1" )').replace(' ++ "" ', " ").replace(' "" ++ ', " ")
      }
      out.push(line)
    }
    return out
  }

  function extractQuotes(OSL) {
    let quotes = {}
    let regExp = /"(?:[^\\"]*|\\"?)*"/g
    OSL = OSL.replace(regExp, (match) => {
      let name = randomString(32);
      quotes[name] = match;
      return name
    })
    return [OSL,quotes]
  }
  
  function insertQuotes(OSL, quotes) {
    for (let key in quotes) {
        OSL = OSL.replace(key, quotes[key])
    }
    return OSL
  }
  
  function compileCloseBrackets(OSL) {
    let out = [];
    let methods = {}
    let regExp = /.\(([^()]*)\)/;  // Regular expression to match innermost parentheses containing spaces or non-alphanumeric characters
    for (let line of OSL) {
      while (regExp.test(line)) {
        line = line.replace(regExp, (match, p1) => {
          let name = randomString(12); // Generate a random identifier
  
          if (match.startsWith(" ") || match.startsWith("(")) {
            out.push(`${name} = ${p1.trim()}`);
  
            if (match.startsWith("((")) {
              return `(${name}`;
            } else {
              return ` ${name}`;
            }
          } else {
            let temp = randomString(32)
            if (p1.trim() === "") {
              methods[temp] = ""
              return `${match[0] + temp}`;
            }
            if ((!Number.isNaN(Number.parseInt(p1.trim())) || p1.trim().indexOf(".") === -1) && p1.trim().indexOf(" ") == -1) {
              methods[temp] = p1.trim()
              return `${match[0] + temp}`;
            }
            methods[temp] = name
            if (p1.trim().indexOf(",") !== -1) {
              let inputs = p1.trim().split(",")
              name = randomString(12)
              methods[temp] = `${name}`
              out.push(`${name} = ${inputs[0].trim()}`);
              for (let i = 1; i < inputs.length; i++) {
                name = randomString(12)
                methods[temp] += `,${name}`
                out.push(`${name} = ${inputs[i].trim()}`);
              }
            } else {
              out.push(`${name} = ${p1.trim()}`);
              methods[temp] = name
            }
            return `${match[0] + temp}`;
          }
        });
      }
      out.push(line);
    }
    out = out.join("\n")
    for (let key in methods) {
      out = out.replace(key, `(${methods[key]})`)
    }
    return out.split("\n");
  }

  function findMyBrackets(OSL, i, find_else) {
    let depth = 0;
    while ((depth !== -1) && i < OSL.length) {
      i++
      let line = OSL[i]
      if (line) {
        if (line.endsWith("(") && ((line[0] === ")" && depth > 0) || (line.startsWith("if") || line.startsWith("loop") || line.startsWith("while") || line.startsWith("until")))) {
          depth += 1
        }
        if (find_else === 1 && line === ") else (") {
          depth -= 1
        } else if (line.startsWith(")")) {
          depth -= 1
        }
      }
    }
    if (depth === -1) {
      return i
    } else {
      return OSL.length
    }
  };

  function compileJumps(OSL) {
    let i = -1
    let repl;
    let joined;
    while (i < OSL.length) {
      i++
      let line = OSL[i]
      if (line) {
        if (line === ") else (") {
          repl = findMyBrackets(OSL, i, 0)
          OSL[repl] = "";
          OSL[i] = `jt ${repl + 1}`
        } else {
          line = line.split(" ")
          if (line[1] === "elif") {
            repl = findMyBrackets(OSL, i, 1)
            if (OSL[repl] === ")") {
              OSL[repl] = "";
            }
            OSL[i] = OSL[i].split(" ")
            OSL[i].pop()
            OSL[i].splice(0, 1)
            OSL[i] = `jn ${OSL[i].join(" ")} ${repl + 1}`
          } else {
            switch (line[0]) {
              case "if":
                repl = findMyBrackets(OSL, i, 0)
                if (OSL[repl] === ")") {
                  OSL[repl] = "";
                }
                OSL[i] = OSL[i].split(" ")
                OSL[i].pop()
                OSL[i].splice(0, 1)
                joined = OSL[i].join(" ")
                if (joined == "true") {
                  OSL[i] = ``
                } else if (joined == "false") {
                  OSL[i] = `jt ${repl + 1}`
                } else {
                  OSL[i] = `jn ${joined} ${repl + 1}`
                }
                break;
              case "while":
                repl = findMyBrackets(OSL, i, 0)
                if (OSL[repl] === ")") {
                  OSL[repl] = "";
                }
                OSL[i] = OSL[i].split(" ")
                OSL[i].pop()
                OSL[i].splice(0, 1)
                joined = OSL[i].join(" ")
                if (joined == "true") {
                  OSL[i] = ``
                } else {
                  OSL[i] = `jn ${joined} ${repl + 1}`
                }
                OSL[repl] = `jt ${i}`
                break;
              case "until":
                repl = findMyBrackets(OSL, i, 0)
                if (OSL[repl] === ")") {
                  OSL[repl] = "";
                }
                OSL[i] = OSL[i].split(" ")
                OSL[i].pop()
                OSL[i].splice(0, 1)
                joined = OSL[i].join(" ")
                if (joined == "true") {
                  OSL[i] = ``
                } else {
                  OSL[i] = `ji ${joined} ${repl + 1}`
                }
                OSL[repl] = `jt ${i}`
                break;
            }
          }
        }
      }
    }
    return OSL
  }

  function compileOther(OSL, ICONS) {
    let out = []
    let line = "";
    for (line of OSL) {
      if (line) {
        line = line.split(" ")
        if (line[0] === "file") {
          if (line[1] === '"open"' && line[2] === '"id"') {
            line.splice(2, 1)
          } else if (line[1] === '"newline"') {
            line[1] = '"append"'
            line[2] = `"\n${destring(line[2])}"`
          } else if (line[1] === '"pick"') {
            line = ["window", '"add"', '"Origin/(A) System/System Apps/File_Picker.osl"']
          }
        } else if (line[0] === "colour" || line[0] === "color") {
          line[0] = "c"
        } else if (line[0] === "hitbox" && (line[1] === '"show"' || line[2] === "hide")) {
          line = ["hitboxes_shown", "="]
          line.push(line[1] == "show" ? "true" : "false")
        } else if (line[0] === "icon") {
          if (line[1][0] === "\"") {
            if (line[1].indexOf(" ") === -1) {
              line[1] = '"' + (ICONS[destring(line[1]) + ".icn"] ?? "") + '"'
            }
          }
        }
        out.push(line.join(" "))
      } else (
        out.push("")
      )
    }
    return out
  }

  function compileOSL(OSL, ICONS) {
    OSL = OSL.join("\n").replace(/\n+/gi, "\n").replace(/\n +/gm, "\n").replace(/\n\/[^\n]+/gm, "").trim().split("\n");
    OSL = compileModifiers(OSL)
    OSL = compileStringConcat(OSL)
    OSL = compileBrackets(OSL)
    OSL = compileJumps(OSL)
    OSL = compileOther(OSL, ICONS)
    return JSON.stringify(OSL)
  }

  class OSLUtils {

    constructor() {
      this.regex = /"[^"]+"|{[^}]+}|\[[^\]]+\]|[^."(]*\((?:(?:"[^"]+")*[^.]+)*|\d[\d.]+\d|[^." ]+/g;
      this.listVariable = '';
      this.ICONS = {
        "log-in.icn": "w 3 line -10 5 -10 10 cont 10 10 cont 10 -10 cont -10 -10 cont -10 -5 line -2 5 3 0 line -2 -5 3 0 line -10 0 3",
        "log-out.icn": "w 3 line 10 5 10 10 cont -10 10 cont -10 -10 cont 10 -10 cont 10 -5 line 3 5 8 0 line 3 -5 8 0 line 8 0 -3",
        "open.icn": "w 3 line -5 10 -10 10 cont -10 -10 cont 10 -10 cont 10 -5 line -2 -2 10 10 cont 10 2 line 10 10 2 10",
        "message.icn": "w 4 line -10 -10 -10 10 cont 10 10 cont 10 -5 cont -5 -5 cont -10 -10",
        "search.icn": "w 2 cutcircle -2 2 8 0 180 w 2.5 line 4 -4 12 -12",
        "desktops.icn": "w 2.5 line -10 5 0 10 cont 10 5 line -10 5 0 0 cont 10 5 line -10 -1 0 -6 cont 10 -1 line -10 -7 0 -12 cont 10 -7",
        "bookmark.icn": "w 3 line -7 10 7 10 cont 7 -10 cont 0 -5 cont -7 -10 cont -7 10",
        "bookmark-full.icn": "w 3 line -7 10 7 10 cont 7 -10 line -7 10 -7 -10 cont 0 -5 cont 7 -10 w 15.8 line 0 3.5 0 1 w 4 line 5.5 -6 0 0 cont -5.5 -6",
        "close.icn": "w 4 line 10 10 -10 -10 line -10 10 10 -10",
        "file.icn": "w 4 line -8 10 3 10 cont 8 5 cont 8 -10 cont -8 -10 cont -8 10",
        "save.icn": "w 4 line -10 10 5 10 cont 10 5 cont 10 -10 cont -10 -10 cont -10 10 line -4 5 2 5 w 8 line 0 -2 0 -2",
        "minimise.icn": "w 4 line 10 5 0 -5 cont -10 5",
        "maximise.icn": "w 4 line 0 10 -10 10 cont -10 0 line 0 -10 10 -10 cont 10 0",
        "add.icn": "w 4 line 10 0 -10 0 line 0 10 0 -10",
        "minus.icn": "w 4 line 10 0 -10 0",
        "download.icn": "w 4 line 0 10 0 -5 cont 7 2 line 0 -5 -7 2 line -10 -10 10 -10",
        "upload.icn": "w 4 line 0 10 0 -5 line 7 2 0 10 cont -7 2 line -10 -10 10 -10",
        "info.icn": "w 3 cutcircle 0 0 10 0 180 line 0 0 0 -5 dot 0 5",
        "home.icn": "w 3 line 10 0 5 0 cont 5 -8 cont -5 -8 cont -5 0 cont -10 0 cont 0 10 cont 10 0",
        "home-full.icn": "w 3 line 10 0 5 0 cont 5 -8 cont -5 -8 cont -5 0 cont -10 0 cont 0 10 cont 10 0 w 12 line 0 -2 0 3",
        "favorites-full.icn": "w 3 cutcircle -5 5 5 0 90 cutcircle 5 5 5 0 90 line -10 5 0 -7 line 10 5 0 -7 w 8 line 6 7 0 -2 line -6 8 0 -0",
        "copy.icn": "w 3 square -3 -3 7 7 line 10 -7 10 10 cont -7 10",
        "paste.icn": "w 4 square 0 0 7 8 line -2 6 2 6 line 0 10 0 10",
        "apps.icn": "w 3 square 7 7 2.5 2.5 square 7 -7 2.5 2.5 square -7 7 2.5 2.5 square -7 -7 2.5 2.5",
        "apps-full.icn": "w 3 square 7 7 2.5 2.5 1 square 7 -7 2.5 2.5 1 square -7 7 2.5 2.5 1 square -7 -7 2.5 2.5 1",
        "store.icn": "w 3 line -5 2 -5 5 line 5 2 5 5 cutcircle 0 5 5 0 90 square 0 -4 10 5",
        "store-full.icn": "w 3 line -5 2 -5 5 line 5 2 5 5 cutcircle 0 5 5 0 90 square 0 -4 10 5 w 10 line -5 -4 5 -4",
        "settings.icn": "w 3 line -8 8 -8 -8 line 0 8 0 -8 line 8 8 8 -8 line 6 6 10 6 line 2 -3 -2 -3 line -6 2 -10 2",
        "settings-full.icn": "w 4 line -8 8 -8 -8 line 0 8 0 -8 line 8 8 8 -8 line 6 6 10 6 line 2 -3 -2 -3 line -6 2 -10 2",
        "reload.icn": "w 4 cutcircle 0 -2 11 13.5 150 line -6 9 0 15 line -6 10 0 3",
        "share.icn": "w 2 cutcircle -7 0 4.5 0 180 cutcircle 7 7 4.5 0 180 cutcircle 7 -7 4.5 0 180 w 3 line -3 3 2 6 line -3 -3 2 -6",
        "dot-grid.icn": "w 5 dot -10 10 dot 0 10 dot 10 10 dot -10 0 dot 0 0n dot 10 0 dot -10 -10 dot 0 -10 dot 10 -10",
        "multitasking.icn": "w 2.5 line -10 5 0 10 cont 10 5 line -10 5 0 0 cont 10 5 line -10 -1 0 -6 cont 10 -1 line -10 -7 0 -12 cont 10 -7",
        "power.icn": "w 3 cutcircle 0 0 10 18 130 line 0 4 0 10",
        "script.icn": "w 4 line 5 10 15 0 line 5 -10 15 0 line -5 10 -15 0 line -5 -10 -15 0",
        "notifications.icn": "w 2 cutcircle 0 -6 4 18 80 cutcircle 0 2 8 0 80 w 2.5 line -10 -5 10 -5 line -10 -5 -8 4 line 10 -5 8 5",
        "sun.icn": "w 2 cutcircle 0 0 5 0 180 w 3 line 10 0 13 0 line -10 0 -13 0 line 0 10 0 13 line 0 -10 0 -13 line 7 -7 10 -10 line 7 7 10 10 line -7 7 -10 10 line -7 -7 -10 -10",
        "moon.icn": "w 2 cutcircle 2 2 10 -13 100 cutcircle 12 10 15 -13 40",
        "eye.icn": "w 3 cutcircle 0 -4 10 0 60 cutcircle 0 4 10 18 60 w 5 dot",
        "mail.icn": "w 3 line -10 9 -10 -9 cont 10 -9 cont 10 9 cont -10 9 cont 0 0 cont 10 9",
        "edit.icn": "w 4 line -5 10 -10 10 cont -10 -10 cont 10 -10 cont 10 -5 line -2 -2 -2 2 cont 6 10 line -2 -2 2 -2 cont 10 6 cont 6 10",
        "origin-logo.icn": "w 2 cutcircle 0 0 12 4.5 150 cutcircle 0 0 7 5 150 line -2 -4 -8 -10",
        "thermometer.icn": "w 6 line 0 9 0 -8 w 10 dot 0 -8 w 3 line 9 8 6 8 line 9 3 6 3 line 9 -2 6 -2",
        "tick.icn": "w 4.5 line -10 -3 0 -10 cont 10 10",
        "accounts.icn": "w 2 cutcircle 0 4 5 0 180 line -6 -5 6 -5 line 6 -5 8 -10 line -6 -5 -8 -10 line -8 -10 8 -10",
        "rename.icn": "w 3 square 0 0 10 5.5 line 3 10 3 -10 line -1 10 7 10 line -1 -10 7 -10 line -5 0 -2 0",
        "sort.icn": "w 3 line 10 5 5 10 cont 5 -10 line -5 10 -5 -10 cont -10 -5",
        "grid.icn": "w 2 square 7.5 7.5 5 5 square -7.5 7.5 5 5 square -7.5 -7.5 5 5 square 7.5 -7.5 5 5",
        "grid-full.icn": "w 3 square 7.5 7.5 5 5 square -7.5 7.5 5 5 square -7.5 -7.5 5 5 square 7.5 -7.5 5 5 w 10 dot 7.5 7.5 dot -7.5 7.5 dot 7.5 -7.5 dot -7.5 -7.5",
        "grid-apps.icn": "w 2 square -7.5 7.5 5 5 square 7.5 7.5 5 5 square -7.5 -7.5 5 5 cutcircle 7.5 -7.5 5 0 180",
        "bin.icn": "w 3 line 5 -10 7 7 cont -7 7 cont -5 -10 cont 5 -10 line -6 7 -5 10 cont 5 10 cont 6 7",
        "tags.icn": "w 3 line 10 10 2 10 cont -10 -2 cont -2 -10 cont 10 2 cont 10 10 dot 5 5",
        "zip.icn": "w 3 line 3 10 3 8 cont -3 8 cont -3 10 line 0 8 0 -8 line -3 3 0 3 line 3 0 0 0 line -3 -3 0 -3",
        "battery_0.icn": "w 2 square -1.5 0 9 5 w 3 line 8.5 0 8.5 0",
        "battery_1.icn": "w 2 square -1.5 0 9 5 w 5 square -9 0 0 3 w 3 line 8.5 0 8.5 0",
        "battery_2.icn": "w 2 square -1.5 0 9 5 w 5 square -9 0 0 3 square -4.5 0 0 3 w 3 line 8.5 0 8.5 0",
        "battery_3.icn": "w 2 square -1.5 0 9 5 w 5 square -9 0 0 3 square -4.5 0 0 3 square 0 0 0 3 w 3 line 8.5 0 8.5 0",
        "battery_4.icn": "w 2 square -1.5 0 9 5 w 5 square -9 0 0 3 square -4.5 0 0 3 square 0 0 0 3 square 4.5 0 0 3 w 3 line 8.5 0 8.5 0",
        "battery_charging.icn": "w 2 square -1.5 0 9 5 line -6 0 -3 1.5 cont -2 -1.5 cont 2 0 w 3 line 8.5 0 8.5 0",
        "dice_1.icn": "w 3 square 0 0 8.5 8.5 dot 0 0",
        "dice_2.icn": "w 3 square 0 0 8.5 8.5 dot 4 4 dot -4 -4",
        "dice_3.icn": "w 3 square 0 0 8.5 8.5 dot 4 4 dot -4 -4 dot 0 0",
        "dice_4.icn": "w 3 square 0 0 8.5 8.5 dot 4 4 dot -4 -4 dot 4 -4 dot -4 4",
        "dice_5.icn": "w 3 square 0 0 8.5 8.5 dot 4 4 dot -4 -4 dot 4 -4 dot -4 4 dot 0 0",
        "dice_6.icn": "w 3 square 0 0 8.5 8.5 dot 4 4 dot -4 -4 dot 4 -4 dot -4 4 dot -4 0 dot 4 0",
        "sync.icn": "w 4 cutcircle 0 0 10 -4 65 line 0 15 4.5 9 cont -1 5 cutcircle 0 0 10 14 65 line 0 -15 -4.5 -9 cont 1 -5",
        "controller.icn": "w 5 line 6 6 8 6 line -6 6 -8 6 w 7 line 7 5 10 -7 line -7 5 -10 -7 line -6 3 6 3 line -7 -1 7 -1",
        "microphone.icn": "w 3 line 0 -8 0 -5 line -4 -10 4 -10 cutcircle 0 2 7 18 70 w 7 line 0 2 0 8",
        "network.icn": "w 3 cutcircle 0 -6 14 0 50 cutcircle 0 -6 7 0 50 w 4 dot 0 -6",
        "book.icn": "w 3 line 0 5 10 10 cont 10 -5 cont 0 -10 cont 0 5 cont -10 10 cont -10 -5 cont 0 -10 line -6 3 -4 2 line -6 -2 -4 -3 line 6 3 4 2 line 6 -2 4 -3",
        "slightly smiling face.icn": "c #fbba08 w 20 dot 0 0 c #000 w 3 dot -3 3 dot 3 3 cutcircle 0 0 5 18 30",
        "upside-down face.icn": "c #fbba08 w 20 dot 0 0 c #000 w 3 dot -3 -3 dot 3 -3 cutcircle 0 0 5 0 30",
        "neutral face.icn": "c #fbba08 w 20 dot 0 0 c #000 w 3 dot -3 3 dot 3 3 line -4 -4 4 -4",
        "expressionless face.icn": "c #fbba08 w 20 dot 0 0 c #000 w 3 line -5 2 -2 2 line 5 2 2 2 line -4 -4 4 -4",
        "face without mouth.icn": "c #fbba08 w 20 dot 0 0 c #000 w 3 dot 3 3 dot -3 3",
        "screaming face.icn": "c #fbba08 w 20 dot 0 0 w 7 c #5684bf cutcircle 0 0 7 0 60 line 5 3 -5 3 w 6 c #fff dot -4 3 dot 4 3 c #000 dot 0 -5",
        "crying face.icn": "c #fbba08 w 20 dot 0 0 w 4 c #3d8ef4 line -3 -1 -3 -3 w 3 c #000 dot -3 3 dot 3 3 w 3 cutcircle 0 -7 5 0 30",
        "loudly crying face.icn": "c #fbba08 w 20 dot 0 0 w 3 c #3d8ef4 line 3 3 3 -8 line -3 3 -3 -8 c #000 dot -3 3 dot 3 3 w 4 dot 0 -3",
        "hundred-points.icn": "c #900812 w 2 line -10 -3 -10 9 square -3 3 3 6 square 7 3 3 6 line -10 -8 10 -8",
        "speech-bubble.icn": "w 9 square 0 0 10 4 line -10 -10 0 0 line -10 -10 -10",
        "left-speech-bubble.icn": "w 9\nsquare 0 0 10 4\nline 10 -10 0 0\nline 10 -10 10",
        "no-entry.icn": "w 20\nc #900812 dot 0 0 w 3 c #fff square 0 0 5 1",
        "prohibited.icn": "c #900812 w 3 cutcircle 0 0 10 0 180 line -7 7 7 -7",
        "zzz.icn": "w 3\nline 3 10 10 10\ncont 3 0\ncont 10 0\nw 2\nline -4 3 0 3\ncont -4 -5\ncont 0 -5\nw 1.5\nline -10 -5 -7 -5\ncont -10 -10\ncont -7 -10",
        "splash.icn": "c #459edb w 10 dot 5 5 w 7 dot -6 -6 w 5 dot 7 -7 w 3 line 4.5 8.5 -3 7 cont 2.5 2.5 line -4.2 -5.1 -8 0 cont -8 -6 w 2 line 7.68 -5.7 4 -4 cont 5.7 -7.8",
        "star-of-david.icn": "w 2 line 0 10 10 -5 cont -10 -5 cont 0 10 line 0 -10 10 5 cont -10 5 cont 0 -10",
        "latin-cross.icn": "w 3 line 0 10 0 -10 line -7 3 7 3",
        "peace-symbol.icn": "w 3 line 0 10 0 -10 cutcircle 0 0 10 0 180 line 7 -7 0 0 cont -7 -7",
        "multiply.icn": "w 3 line 10 10 -10 -10 line -10 10 10 -10",
        "plus.icn": "w 3 line 10 0 -10 0 line 0 10 0 -10",
        "divide.icn": "w 3 line 10 0 -10 0 line 0 7 0 7 line 0 -7 0 -7",
        "minus (1).icn": "w 3 line 10 0 -10 0",
        "equals.icn": "w 3 line 10 7 -10 7 line 10 -7 -10 -7",
        "female-sign.icn": "w 3 cutcircle 0 5 5 0 180 line 0 0 0 -10 line -4 -6 4 -6",
        "male-sign.icn": "w 3 cutcircle -3 -3 7 0 180 line 3 3 10 10 cont 10 0 line 10 10 0 10",
        "transgender-symbol.icn": "w 2 cutcircle 0 1 4 0 180 line 0 -4 0 -10 line 3 4 9 10 cont 9 5 line 9 10 5 10 line -3 4 -9 10 cont -9 5 line -9 10 -5 10 line -3 -7 3 -7 line -6.2 4.3 -3.5 7.5",
        "square-full.icn": "w 5 line 5 5 5 -5 line 5 -5 -5 -5 line -5 -5 -5 5 line -5 5 5 5 w 10 dot",
        "circle-full.icn": "w 20 dot",
        "circle.icn": "w 2 cutcircle 0 0 10 0 180",
        "cube.icn": "w 2 line -12.1 -5.4 2.2 -7.6 line -12.1 10.3 2.2 12.5 line -2.7 7.3 6.8 8.1 line -2.7 -2.4 6.8 -3.2 line -12.1 -5.4 -12.1 10.3 line 2.2 -7.6 2.2 12.5 line -2.7 -2.4 -2.7 7.3 line 6.8 -3.2 6.8 8.1 line -12.1 -5.4 -2.7 -2.4 line 2.2 -7.6 6.8 -3.2 line 2.2 12.5 6.8 8.1 line -12.1 10.3 -2.7 7.3",
        "list.icn": "w 5 line -8 8 -8 8 line -8 0 -8 0 line -8 -8 -8 -8 line 0 8 8 8 line 0 0 8 0 line 0 -8 8 -8",
        "more.icn": "w 5 dot -8 0 dot 0 0 dot 8 0",
        "menu-thin.icn": "w 3 line -8 8 8 8 line -8 0 8 0 line -8 -8 8 -8",
        "menu.icn": "w 5 line -8 8 8 8 line -8 0 8 0 line -8 -8 8 -8",
        "more-vertical.icn": "w 5\ndot 0 8\ndot\ndot 0 -8",
        "clock.icn": "w 2 cutcircle 0 0 12 0 180 w 3 line 0 5 0 0 cont 3 -3",
        "alarm-clock.icn": "w 2 cutcircle 0 0 9 0 180 w 3 line 0 4 0 0 cont 3 -2 line -7 -7 -8 -9 line 7 -7 8 -9 w 2 cutcircle -7 7 4 -4.5 60 cutcircle 7 7 4 4.5 60",
        "stopwatch.icn": "w 3 cutcircle 0 -1 9 0 180 w 3 line 0 0 0 11 line -2 12 2 12 line 6 7 7 8",
        "timer.icn": "w 3 cutcircle 0 -1 9 0 180 w 3 line 0 0 0 11 line -2 12 2 12 line 6 7 7 8",
        "play.icn": "w 4 line -6 10 6 0 cont -6 -10 cont -6 10",
        "pause.icn": "w 4 line 6 10 6 -10 line -6 -10 -6 10",
        "volume-max.icn": "w 2 cutcircle -3 -1.5 6.5 -9 90 line -3 5 0 7 line -3 -8 0 -10 line 0 -10 0 7 cutcircle 4 -2 3 9 90 cutcircle 4 -2 8 9 80",
        "volume-1.icn": "w 2 cutcircle -3 -1.5 6.5 -9 90 line -3 5 0 7 line -3 -8 0 -10 line 0 -10 0 7 cutcircle 4 -2 3 9 90",
        "volume-mute.icn": "w 2 cutcircle -3 -1.5 6.5 -9 90 line -3 5 0 7 line -3 -8 0 -10 line 0 -10 0 7 line 5 3 8 -5 line 8 3 5 -5",
        "atom.icn": "w 2 cutcircle 0 0 12 4.5 45 cutcircle 0 0 12 17 25 cutcircle 0 0 12 -8.5 25 w 8 dot 0 0 w 4 dot 11 -6 dot -9 -9 dot -6 10",
        "servers.icn": "w 5 square 0 4 4 0 square 0 -4 4 0 c #383838 dot 4 4 dot 2 4 dot 4 -4 dot 2 -4",
        "server.icn": "w 5 square 0 0 4 0 c #383838 dot 4 0 dot 2 0",
        "eraser.icn": "w 3 line 7 10 -7 -0 line 7 0 -7 -10 line -7 -10 -7 -0 line 7 0 7 10 line -3 2 -3 -5 line -4 1 -4 -7",
        "key.icn": "w 12 dot 2.5 2.5 w 5 line 2.5 2.5 -7 -7 w 3 line -6.5 -6.5 -3.5 -9.5 line -4 -4 -1 -7",
        "camera.icn": "w 3 line 8 -6 8 6 cont -4 6 cont -4 -6 cont 8 -6 cont -4 -6 cont -4 0 cont -10 -5 cont -10 5 cont -4 0",
        "option.icn": "w 3 line -10 10 -5 10 line -5 10 5 -10 cont 10 -10",
        "pen.icn": "w 3 cutcircle 5 6 3 45 80 line 7.5 4 -4.5 -9 line 3.5 8.5 -9 -5 cont -11 -11 cont -4.5 -9",
        "controller-up.icn": "w 4 c #fff dot 0 5 c #000 dot 0 -5 dot -5 0 dot 5 0",
        "controller-down.icn": "w 4 c #fff dot 0 -5 c #000 dot -5 0 dot 5 0 dot 0 5",
        "controller-right.icn": "w 4 c #fff dot 5 0 c #000 dot 0 -5 dot -5 0 dot 0 5",
        "controller-left.icn": "w 4 c #fff dot -5 0 c #000 dot 0 -5 dot 5 0 dot 0 5",
        "up.icn": "w 4 line 10 -5 0 5 line 0 5 -10 -5",
        "down.icn": "w 4 line 10 5 0 -5 line 0 -5 -10 5",
        "left.icn": "w 4 line -5 10 5 0 line -5 -10 5 0",
        "right.icn": "w 4 line 5 10 -5 0 line 5 -10 -5 0",
        "up-arrow.icn": "w 4 line 8 0 0 8 line 0 8 -8 0 line 0 8 0 -8",
        "down-arrow.icn": "w 4 line 8 0 0 -8 line 0 -8 -8 line 0 -8 0 8",
        "right-arrow.icn": "w 4 line 0 8 8 0 line 0 -8 8 0 line -8 0 8",
        "left-arrow.icn": "w 4 line 0 8 -8 0 line 0 -8 -8 0 line -8 0 8",
        "bisexual-flag.icn": "w 2.5 c #D60270 square 0 8 10 .9 square 0 4 10 .9 c #9B4F96 square 0 0 10 .9 c #0038A8 square 0 -4 10 .9 square 0 -8 10 .9",
        "trans-flag.icn": "w 2.5 c #55CDFC square 0 8 10 .9 c #F7A8B8 square 0 4 10 .9 c #ffffff square 0 0 10 .9 c #F7A8B8 square 0 -4 10 .9 c #55CDFC square 0 -8 10 .9",
        "nonbinary-flag.icn": "w 2.6 c #FCF434 square 0 7 10 1.2 c #fff square 0 2.5 10 1.2 c #9C59D1 square 0 -2.5 10 1.2 c #2C2C2C square 0 -7 10 1.2",
        "polygender-flag.icn": "w 2.5 c #000000 square 0 8 10 .9 c #939393 square 0 4 10 .9 c #ED94C5 square 0 0 10 .9 c #F5ED81 square 0 -4 10 .9 c #64BBE6 square 0 -8 10 .9",
        "cisgender-flag.icn": "w 3.5 c #BFBFBF square 0 6 10 1.4 c #E0DCDD square 0 0 10 1.4 c #BFBFBF square 0 -6 10 1.4",
        "pride-flag.icn": "w 1.5 c #E40300 square 0 6.5 10 .6 c #FF8C00 square 0 4 10 .6 c #FFED00 square 0 1.25 10 .6 c #008026 square 0 -1.25 10 .6 c #24408E square 0 -4 10 .6 c #732982 square 0 -6.5 10 .6",
        "progress-flag.icn": "w 1.5 c #E40300 square 0 6.5 10 .6 c #FF8C00 square 0 4 10 .6 c #FFED00 square 0 1.25 10 .6 c #008026 square 0 -1.25 10 .6 c #24408E square 0 -4 10 .6 c #732982 square 0 -6.5 10 .6 c #ffffff line -10 4 -10 -4 cont -5 0 cont -10 4 w 2.5 line -9 -2 -9 2 dot -7.5 0 c #ff92c3 w 1.75 line -10 5 -5.5 0 cont -10 -5 c #63c2ee line -10 7 -3 0 cont -10 -7 c #66370d line -8 7 -0.5 0 cont -7 -7 c #000000 line -6 7 1.5 0 cont -6 -7",
        "asexual-flag.icn": "w 2.6 c #000000 square 0 7 10 1.2 c #A3A3A3 square 0 2.5 10 1.2 c #ffffff square 0 -2.5 10 1.2 c #800080 square 0 -7 10 1.2",
        "pansexual-flag.icn": "w 3.5 c #ff218c square 0 6 10 1.4 c #ffd800 square 0 0 10 1.4 c #21b1ff square 0 -6 10 1.4"
      }
    }

    getInfo() {
      return {
        id: 'OSLUtils',
        name: 'OSL Utils',
        blocks: [{
          opcode: 'tokenise',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Tokenise OSL [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "log \"hello\""
            },
          },
        },
        {
          opcode: 'tokeniseraw',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Tokenise OSL Raw [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "log \"hello\""
            },
          },
        },
        {
          opcode: 'ScratchcompileOSL',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Compile OSL [CODE] [PASS]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["log \\\"hello\\\".left(10)","log 10 + ( 10 + 3 )","text \\\"hello\\\" 10 : c#fff"]'
            },
            PASS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "{}"
            },
          },
        },
        {
          opcode: 'splitmethods',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Tokenise Methods [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "\"hello\".index(\"l\").bool"
            },
          },
        },
        {
          opcode: 'getMethodInputs',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get Method Inputs [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hi("wow","test")'
            },
          },
        },
          "---",
        {
          opcode: 'compileModifiers',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Compile Modifiers [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["left(10)","right(10)","up(10)","down(10)"]'
            },
          },
        },
        {
          opcode: 'compileStringConcat',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Compile String Concat [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["hello","world"]'
            },
          },
        },
        {
          opcode: 'compileJumps',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Compile Jumps [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["if 10 > 5","if 10 < 5","if 10 == 5"]'
            },
          },
        },
        {
          opcode: 'compileOther',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Compile Other [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["log 10","text 10 : c#fff","text 10 : c#fff"]'
            },
          },
        },
        {
          opcode: 'compileCloseBrackets',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Compile Close Brackets [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["log \\"wow\\".left(1 + 1)"]'
            },
          },
        },
        {
          opcode: 'cleanOSL',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Clean OSL [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["log 10","text 10 : c#fff","text 10 : c#fff"]'
            },
          },
        },
        "---",
        {
          opcode: 'extractQuotes',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Extract Quotes From [CODE]',
          arguments: {
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'log "hello test"'
            },
          },
        },
        {
          opcode: 'insertQuotes',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Insert Quotes From [QUOTES] Into [CODE]',
          arguments: {
            QUOTES: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '{}'
            },
            CODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: ''
            },
          },
        }
        ],
      };
    }

    splitmethods({
      CODE
    }) {
      return JSON.stringify(CODE.match(this.regex) || []);
    }

    getMethodInputs({ CODE }) {
      let depth = 1;
      let out = "";
      for (letter of CODE) {
        if (letter === "(") {
          depth += 1
        } else if (letter === ")") {
          depth -= 1
        }
        out += letter
        if (depth === 0) {
          break;
        }
      }
      const argsString = out
      const args = [];
      let currentArg = '';
      let inQuotes = false;

      for (let i = 0; i < argsString.length; i++) {
        const char = argsString.charAt(i);
        if (char === ',' && !inQuotes) {
          args.push(currentArg.trim());
          currentArg = '';
        } else {
          currentArg += char;
          if (char === '"') inQuotes = !inQuotes;
        }
      }
      if (currentArg.trim() !== '') {
        args.push(currentArg.trim());
      }

      let mapargs = args.map(arg => {
        arg = arg.trim();
        if (arg.startsWith('"') && arg.endsWith('"')) {
          return arg;
        } else if (!isNaN(arg)) {
          return Number(arg);
        } else if (arg.startsWith('[') && arg.endsWith(']')) {
          return JSON.parse(arg);
        } else {
          return arg;
        }
      });
      if (typeof mapargs == "object") {
        return JSON.stringify(mapargs)
      } else {
        return mapargs
      }
    }

    tokenise({ CODE }) {
      return JSON.stringify(tokenise(CODE));
    }

    tokeniseraw({ CODE }) {
      return tokenise(CODE);
    }

    compileModifiers({ CODE }) {
      return JSON.stringify(compileModifiers(JSON.parse(CODE)));
    }

    compileStringConcat({ CODE }) {
      return JSON.stringify(compileStringConcat(JSON.parse(CODE)));
    }

    compileJumps({ CODE }) {
      return JSON.stringify(compileJumps(JSON.parse(CODE)));
    }

    compileOther({ CODE }) {
      return JSON.stringify(compileOther(JSON.parse(CODE)));
    }

    compileCloseBrackets({ CODE }) {
      return JSON.stringify(compileCloseBrackets(JSON.parse(CODE)));
    }

    cleanOSL({ CODE }) {
      return JSON.stringify(JSON.parse(CODE).join("\n").replace(/\n+/gi, "\n").replace(/\n +/gm, "\n").replace(/\n\/[^\n]+/gm, "").trim().split("\n"));
    }

    extractQuotes({ CODE }) {
      return JSON.stringify(extractQuotes(CODE));
    }

    insertQuotes({ QUOTES, CODE }) {
      return insertQuotes(CODE, JSON.parse(QUOTES));
    }

    ScratchcompileOSL({ CODE, PASS }) {
      if (!PASS) {
        PASS = this.ICONS
      } else {
        PASS = JSON.parse(PASS)
      }
      return compileOSL(JSON.parse(CODE), PASS)
    }

    setlist({ CODE }, util) {
      try {
        this.letter = 0;
        this.temp = "";
        this.brackets = 0;
        this.out = "";
        this.split = [];
        this.len = CODE.length;
        while (this.letter < this.len) {
          this.temp = CODE[this.letter];
          if (this.temp === "\"") {
            this.brackets = 1 - this.brackets;
            this.out += "\"";
          } else {
            this.out += this.temp;
          }
          this.letter++;
          if (1 > this.brackets && CODE[this.letter] === " ") {
            this.split.push(this.out);
            this.out = "";
            this.letter++;
          }
        }
        this.split.push(this.out);
        this.listVariable.value = this.split;
      } catch (e) {
        // skip
      }
    }

    selectlist({ Name }, util) {
      this.listVariable = util.target.lookupVariableByNameAndType(Name, "list");
    }
  }

  Scratch.extensions.register(new OSLUtils());
})(Scratch);
