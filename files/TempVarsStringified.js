// Name: Temporary Variables
// ID: lmsTempVars2

// Edited by mistium to make the "list variables" reporters stringified

// Description: Create disposable runtime or thread variables.
// By: LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// License: MIT AND LGPL-3.0

/* generated l10n code */Scratch.translate.setup({"de":{"_Temporary Variables":"Temporäre Variablen"},"fi":{"_Runtime Variables":"Ajonaikaiset muuttujat","_Temporary Variables":"Väliaikaiset muuttujat","_Thread Variables":"Säiemuuttujat","_active runtime variables":"käytössä olevat ajonaikaiset muuttujat","_active thread variables":"käytössä olevat säiemuuttujat","_change runtime var [VAR] by [NUM]":"lisää ajonaikaiseen muuttujaan [VAR] arvo [NUM]","_change thread var [VAR] by [NUM]":"lisää säiemuuttujaan [VAR] arvo [NUM]","_delete all runtime variables":"poista kaikki ajonaikaiset muuttujat","_delete runtime var [VAR]":"poista ajonaikainen muuttuja [VAR]","_for [VAR] in [NUM]":"toista [NUM] kertaa ja laske säiemuuttujalla [VAR]","_runtime var [VAR]":"ajonaikainen muuttuja [VAR]","_runtime var [VAR] exists?":"onko ajonaikainen muuttuja [VAR] olemassa?","_set runtime var [VAR] to [STRING]":"aseta ajonaikainen muuttuja [VAR] arvoon [STRING] ","_set thread var [VAR] to [STRING]":"aseta säiemuuttuja [VAR] arvoon [STRING]","_thread var [VAR]":"säiemuuttuja [VAR]","_thread var [VAR] exists?":"onko säiemuuttuja [VAR] olemassa?"},"it":{"_Temporary Variables":"Variabili Temporanee"},"ja":{"_Temporary Variables":"一時変数"},"ko":{"_Runtime Variables":"런타임 변수","_Temporary Variables":"일시적 변수","_Thread Variables":"스레드 변수","_active runtime variables":"활성화된 런타임 변수 목록","_active thread variables":"활성화된 스레드 변수 목록","_change runtime var [VAR] by [NUM]":"런타임 변수 [VAR]을 [NUM]만큼 바꾸기","_change thread var [VAR] by [NUM]":"스레드 변수 [VAR]을 [NUM]만큼 바꾸기","_delete all runtime variables":"모든 런타임 변수 삭제하기","_delete runtime var [VAR]":"런타임 변수 [VAR]을 삭제하기","_runtime var [VAR]":"런타임 변수 [VAR]","_runtime var [VAR] exists?":"런타임 변수 [VAR]이 존재하는가?","_set runtime var [VAR] to [STRING]":"런타임 변수 [VAR]을 [STRING]로 정하기","_set thread var [VAR] to [STRING]":"스레드 변수 [VAR]을 [STRING]로 정하기","_thread var [VAR]":"스레드 변수 [VAR]","_thread var [VAR] exists?":"스레드 변수 [VAR]이 존재하는가?"},"nb":{"_Temporary Variables":"Midlertidige variabler"},"nl":{"_Runtime Variables":"Looptijdvariabelen","_Temporary Variables":"Tijdelijke variabelen","_Thread Variables":"Threadvariabelen","_active runtime variables":"actieve looptijdvariabelen","_active thread variables":"actieve threadvariabelen","_change runtime var [VAR] by [NUM]":"verander looptijdvar. [VAR] met [NUM]","_change thread var [VAR] by [NUM]":"verander threadvar. [VAR] met [NUM]","_delete all runtime variables":"verwijder alle looptijdvariabelen","_delete runtime var [VAR]":"verwijder looptijdvar. [VAR]","_for [VAR] in [NUM]":"voor elke [VAR] in [NUM]","_runtime var [VAR]":"looptijdvar. [VAR]","_runtime var [VAR] exists?":"looptijdvar. [VAR] bestaat?","_set runtime var [VAR] to [STRING]":"maak looptijdvar. [VAR] [STRING]","_set thread var [VAR] to [STRING]":"maak threadvar. [VAR] [STRING]","_thread var [VAR]":"threadvar. [VAR]","_thread var [VAR] exists?":"threadvar. [VAR] bestaat?"},"ru":{"_Runtime Variables":"Время Выполнения Переменных","_Temporary Variables":"Временные Переменные","_Thread Variables":"Переменные Ветки","_active runtime variables":"активные переменные с временем выполнения","_active thread variables":"активные веточные переменные","_change runtime var [VAR] by [NUM]":"изменить время выполнения переменной [VAR] в [NUM]","_change thread var [VAR] by [NUM]":"изменить веточную переменную [VAR] на [NUM]","_delete all runtime variables":"удалить все переменные с временем выполнения","_delete runtime var [VAR]":"удалить переменную [VAR] с временем выполнения","_for [VAR] in [NUM]":"повторить [VAR] раз [NUM]","_runtime var [VAR]":"время выполнения переменной [VAR]","_runtime var [VAR] exists?":"время выполнения для переменной [VAR] существует?","_set runtime var [VAR] to [STRING]":"установить время выполнения переменной [VAR] в [STRING]","_set thread var [VAR] to [STRING]":"установить веточную переменную [VAR] в [STRING]","_thread var [VAR]":"веточная переменная [VAR]","_thread var [VAR] exists?":"веточная переменная [VAR] существует?"},"tr":{"_Temporary Variables":"Geçici Değişkenler"},"uk":{"_Temporary Variables":"Тимчасові Змінні"},"zh-cn":{"_Runtime Variables":"临时变量","_Temporary Variables":"临时变量","_Thread Variables":"局部变量","_active runtime variables":"所有临时变量","_active thread variables":"所有局部变量","_change runtime var [VAR] by [NUM]":"将临时变量[VAR]增加[NUM]","_change thread var [VAR] by [NUM]":"将局部变量[VAR]增加[NUM]","_delete all runtime variables":"删除所有临时变量","_delete runtime var [VAR]":"删除临时变量[VAR]","_for [VAR] in [NUM]":"对于[NUM]中的每个局部变量[VAR]","_runtime var [VAR]":"临时变量[VAR]","_runtime var [VAR] exists?":"临时变量[VAR]是否存在？","_set runtime var [VAR] to [STRING]":"设置临时变量[VAR]为[STRING]","_set thread var [VAR] to [STRING]":"设置局部变量[VAR]为[STRING]","_thread var [VAR]":"局部变量[VAR]","_thread var [VAR] exists?":"局部变量[VAR]是否存在？"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  // Object.create(null) prevents "variable [toString]" from returning a function
  let runtimeVariables = Object.create(null);

  // Credit to skyhigh173 for the idea of this
  const label = (name, hidden) => ({
    blockType: Scratch.BlockType.LABEL,
    text: name,
    hideFromPalette: hidden,
  });

  function resetRuntimeVariables() {
    runtimeVariables = Object.create(null);
  }

  class TempVars {
    constructor() {
      Scratch.vm.runtime.on("PROJECT_START", () => {
        resetRuntimeVariables();
      });

      Scratch.vm.runtime.on("PROJECT_STOP_ALL", () => {
        resetRuntimeVariables();
      });
    }

    getInfo() {
      return {
        id: "lmsTempVars2",
        name: Scratch.translate("Temporary Variables"),
        color1: "#FF791A",
        color2: "#E15D00",
        blocks: [
          label(Scratch.translate("Thread Variables"), false),

          {
            opcode: "setThreadVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set thread var [VAR] to [STRING]"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
              STRING: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "changeThreadVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("change thread var [VAR] by [NUM]"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1",
              },
            },
          },

          "---",

          {
            opcode: "getThreadVariable",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("thread var [VAR]"),
            disableMonitor: true,
            allowDropAnywhere: true,
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
            },
          },
          {
            opcode: "threadVariableExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("thread var [VAR] exists?"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
            },
          },

          "---",

          {
            opcode: "forEachThreadVariable",
            blockType: Scratch.BlockType.LOOP,
            text: Scratch.translate("for [VAR] in [NUM]"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "thread variable",
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "10",
              },
            },
          },
          {
            opcode: "listThreadVariables",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("active thread variables"),
            disableMonitor: true,
          },

          "---",

          label(Scratch.translate("Runtime Variables"), false),

          {
            opcode: "setRuntimeVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set runtime var [VAR] to [STRING]"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
              STRING: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0",
              },
            },
          },
          {
            opcode: "changeRuntimeVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("change runtime var [VAR] by [NUM]"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
              NUM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1",
              },
            },
          },

          "---",

          {
            opcode: "getRuntimeVariable",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("runtime var [VAR]"),
            disableMonitor: true,
            allowDropAnywhere: true,
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
            },
          },
          {
            opcode: "runtimeVariableExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("runtime var [VAR] exists?"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
            },
          },

          "---",

          {
            opcode: "deleteRuntimeVariable",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete runtime var [VAR]"),
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "variable",
              },
            },
          },
          {
            opcode: "deleteAllRuntimeVariables",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete all runtime variables"),
          },
          {
            opcode: "listRuntimeVariables",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("active runtime variables"),
          },
        ],
      };
    }

    /* THREAD VARIABLES */

    setThreadVariable(args, util) {
      const thread = util.thread;
      if (!thread.variables) thread.variables = Object.create(null);
      const vars = thread.variables;
      vars[args.VAR] = args.STRING;
    }

    changeThreadVariable(args, util) {
      const thread = util.thread;
      if (!thread.variables) thread.variables = Object.create(null);
      const vars = thread.variables;
      const prev = Scratch.Cast.toNumber(vars[args.VAR]);
      const next = Scratch.Cast.toNumber(args.NUM);
      vars[args.VAR] = prev + next;
    }

    getThreadVariable(args, util) {
      const thread = util.thread;
      if (!thread.variables) thread.variables = Object.create(null);
      const vars = thread.variables;
      const varValue = vars[args.VAR];
      if (typeof varValue === "undefined") return "";
      return varValue;
    }

    threadVariableExists(args, util) {
      const thread = util.thread;
      if (!thread.variables) thread.variables = Object.create(null);
      const vars = thread.variables;
      const varValue = vars[args.VAR];
      return !(typeof varValue === "undefined");
    }

    forEachThreadVariable(args, util) {
      const thread = util.thread;
      if (!thread.variables) thread.variables = Object.create(null);
      const vars = thread.variables;
      if (typeof util.stackFrame.index === "undefined") {
        util.stackFrame.index = 0;
      }
      if (util.stackFrame.index < Number(args.NUM)) {
        util.stackFrame.index++;
        vars[args.VAR] = util.stackFrame.index;
        return true;
      }
    }

    listThreadVariables(args, util) {
      const thread = util.thread;
      if (!thread.variables) thread.variables = Object.create(null);
      const vars = thread.variables;
      return JSON.stringify(Object.keys(vars));
    }

    /* RUNTIME VARIABLES */

    setRuntimeVariable(args) {
      runtimeVariables[args.VAR] = args.STRING;
    }

    changeRuntimeVariable(args) {
      const prev = Scratch.Cast.toNumber(runtimeVariables[args.VAR]);
      const next = Scratch.Cast.toNumber(args.NUM);
      runtimeVariables[args.VAR] = prev + next;
    }

    getRuntimeVariable(args) {
      if (!(args.VAR in runtimeVariables)) return "";
      return runtimeVariables[args.VAR];
    }

    runtimeVariableExists(args) {
      return args.VAR in runtimeVariables;
    }

    listRuntimeVariables(args, util) {
      return JSON.stringify(Object.keys(runtimeVariables));
    }

    deleteRuntimeVariable(args) {
      Reflect.deleteProperty(runtimeVariables, args.VAR);
    }

    deleteAllRuntimeVariables() {
      runtimeVariables = Object.create(null);
    }
  }
  Scratch.extensions.register(new TempVars());
})(Scratch);
