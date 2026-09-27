// Name: Databases
// Author: Mistium
// Description: Databases of tables with SQL queries, saved with your project
// Version: v1

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Databases must run unsandboxed.");
  }

  const { BlockType, ArgumentType, Cast } = Scratch;
  const runtime = Scratch.vm.runtime;
  const ID = "mistiumdatabases";
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  // Databases live in runtime.extensionStorage so they're saved inside the project, like lists.
  // Loading a project replaces extensionStorage, so always read it fresh.
  // Shape: { current: name, databases: { [name]: { tables: { [name]: { columns: string[], rows: any[][] } } } } }
  const storage = () => {
    const all = runtime.extensionStorage;
    if (!all[ID] || typeof all[ID].databases !== "object") all[ID] = { current: "main", databases: {} };
    if (!has(all[ID].databases, all[ID].current)) all[ID].databases[all[ID].current] = { tables: {} };
    return all[ID];
  };
  const getDatabase = (name) => {
    const { databases } = storage();
    name = Cast.toString(name);
    return has(databases, name) ? databases[name] : null;
  };
  // tables of the current database, or of a named one
  const tables = (database) => {
    const store = storage();
    const db = database === undefined ? store.databases[store.current] : getDatabase(database);
    return db ? db.tables : null;
  };
  const getTable = (name, database) => {
    const all = tables(database);
    name = Cast.toString(name);
    return all && has(all, name) ? all[name] : null;
  };

  // "bob, 10" or a JSON array; values are trimmed.
  const parseValues = (text) => {
    text = Cast.toString(text);
    if (text.trim().startsWith("[")) {
      try {
        const values = JSON.parse(text);
        if (Array.isArray(values)) return values;
      } catch {}
    }
    return text === "" ? [] : text.split(",").map((value) => value.trim());
  };

  // A column can be given by name, or by number if no column has that name.
  const columnIndex = (table, column) => {
    const name = Cast.toString(column);
    const index = table.columns.indexOf(name);
    if (index !== -1) return index;
    const number = Cast.toListIndex(column, table.columns.length, false);
    return number === Cast.LIST_INVALID ? -1 : number - 1;
  };
  const rowIndex = (table, row) => {
    const number = Cast.toListIndex(row, table.rows.length, false);
    return number === Cast.LIST_INVALID ? -1 : number - 1;
  };
  // nested objects and arrays become JSON text so reporters never show [object Object]
  const cell = (value) => (value !== null && typeof value === "object" ? JSON.stringify(value) : value ?? "");
  const fitRow = (table, values) => table.columns.map((_, i) => cell(values[i]));
  const rowObject = (table, row) => Object.fromEntries(table.columns.map((column, i) => [column, row[i]]));

  // [{ name: "bob" }, { score: 1 }] -> columns from every key, missing cells empty
  const tableFromObjects = (data) => {
    const objects = data.filter((row) => row && typeof row === "object" && !Array.isArray(row));
    const columns = [...new Set(objects.flatMap((row) => Object.keys(row)))];
    const table = { columns, rows: [] };
    table.rows = objects.map((row) => fitRow(table, columns.map((column) => row[column])));
    return table;
  };

  const toCSV = (table) =>
    [table.columns, ...table.rows]
      .map((row) =>
        row
          .map((value) => {
            value = Cast.toString(value);
            return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
          })
          .join(",")
      )
      .join("\n");

  const fromCSV = (text) => {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (quoted) {
        if (char === '"' && text[i + 1] === '"') {
          value += '"';
          i++;
        } else if (char === '"') {
          quoted = false;
        } else {
          value += char;
        }
      } else if (char === '"') {
        quoted = true;
      } else if (char === ",") {
        row.push(value);
        value = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && text[i + 1] === "\n") i++;
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      } else {
        value += char;
      }
    }
    if (value !== "" || row.length) {
      row.push(value);
      rows.push(row);
    }
    return rows;
  };

  // SQL: a read-only SELECT subset, parsed into a tree and evaluated against the stored tables.
  // Nothing from a query is ever run as JavaScript.
  //   SELECT [DISTINCT] * | expr [AS name], ... FROM [database.]table
  //   [WHERE expr] [ORDER BY expr [ASC|DESC], ...] [LIMIT n [OFFSET n]]
  // expr: columns, 'text', numbers, TRUE/FALSE, + - * / %, = != <> < > <= >=, LIKE, IN (...),
  // BETWEEN, IS [NOT] EMPTY, AND OR NOT, and COUNT/SUM/AVG/MIN/MAX (which make one summary row).
  const KEYWORDS = new Set([
    "SELECT", "DISTINCT", "FROM", "WHERE", "ORDER", "BY", "ASC", "DESC", "LIMIT", "OFFSET", "AS",
    "AND", "OR", "NOT", "LIKE", "IN", "BETWEEN", "IS", "EMPTY", "TRUE", "FALSE",
  ]);
  const AGGREGATES = new Set(["COUNT", "SUM", "AVG", "MIN", "MAX"]);

  const tokenize = (sql) => {
    const tokens = [];
    let i = 0;
    while (i < sql.length) {
      const char = sql[i];
      if (/\s/.test(char)) {
        i++;
      } else if (char === "'") {
        let value = "";
        for (i++; ; i++) {
          if (i >= sql.length) throw new Error("text is missing its closing '");
          if (sql[i] === "'" && sql[i + 1] === "'") value += sql[i++];
          else if (sql[i] === "'") break;
          else value += sql[i];
        }
        i++;
        tokens.push({ type: "string", value });
      } else if (char === '"' || char === "`") {
        const end = sql.indexOf(char, i + 1);
        if (end === -1) throw new Error(`name is missing its closing ${char}`);
        tokens.push({ type: "name", value: sql.slice(i + 1, end) });
        i = end + 1;
      } else if (/[0-9]/.test(char) || (char === "." && /[0-9]/.test(sql[i + 1] ?? ""))) {
        const match = /^\d*\.?\d+(e[+-]?\d+)?/i.exec(sql.slice(i));
        tokens.push({ type: "number", value: Number(match[0]) });
        i += match[0].length;
      } else if (/[A-Za-z_]/.test(char)) {
        const word = /^[A-Za-z_][A-Za-z0-9_]*/.exec(sql.slice(i))[0];
        const upper = word.toUpperCase();
        tokens.push(KEYWORDS.has(upper) ? { type: "keyword", value: upper } : { type: "name", value: word });
        i += word.length;
      } else {
        const op = /^(<=|>=|!=|<>|[=<>+\-*/%(),.])/.exec(sql.slice(i));
        if (!op) throw new Error(`unexpected "${char}"`);
        tokens.push({ type: "op", value: op[0] === "<>" ? "!=" : op[0] });
        i += op[0].length;
      }
    }
    return tokens;
  };

  const parseQuery = (sql) => {
    const tokens = tokenize(sql);
    let pos = 0;
    const peek = () => tokens[pos];
    const is = (type, value) => peek() && peek().type === type && (value === undefined || peek().value === value);
    const accept = (type, value) => (is(type, value) ? tokens[pos++] : null);
    const expect = (type, value) => {
      const token = accept(type, value);
      if (!token) throw new Error(`expected ${value ?? type} ${peek() ? `near "${peek().value}"` : "at the end"}`);
      return token;
    };
    const binary = (next, ops) => () => {
      let left = next();
      for (let op; (op = ops.find((o) => is("op", o) || is("keyword", o))); ) {
        pos++;
        left = { kind: "binary", op, left, right: next() };
      }
      return left;
    };

    const primary = () => {
      if (accept("op", "(")) {
        const inner = expression();
        expect("op", ")");
        return inner;
      }
      if (accept("op", "-")) return { kind: "binary", op: "-", left: { kind: "value", value: 0 }, right: primary() };
      if (is("number") || is("string")) return { kind: "value", value: tokens[pos++].value };
      if (accept("keyword", "TRUE")) return { kind: "value", value: true };
      if (accept("keyword", "FALSE")) return { kind: "value", value: false };
      const name = expect("name").value;
      if (AGGREGATES.has(name.toUpperCase()) && accept("op", "(")) {
        const arg = accept("op", "*") ? null : expression();
        expect("op", ")");
        return { kind: "aggregate", fn: name.toUpperCase(), arg };
      }
      return { kind: "column", name };
    };
    const product = binary(primary, ["*", "/", "%"]);
    const sum = binary(product, ["+", "-"]);
    const comparison = () => {
      const left = sum();
      const not = !!accept("keyword", "NOT");
      let node;
      if (accept("keyword", "LIKE")) node = { kind: "like", left, pattern: sum() };
      else if (accept("keyword", "IN")) {
        expect("op", "(");
        const list = [sum()];
        while (accept("op", ",")) list.push(sum());
        expect("op", ")");
        node = { kind: "in", left, list };
      } else if (accept("keyword", "BETWEEN")) {
        const low = sum();
        expect("keyword", "AND");
        node = { kind: "between", left, low, high: sum() };
      } else if (not) {
        throw new Error("expected LIKE, IN or BETWEEN after NOT");
      } else if (accept("keyword", "IS")) {
        const isNot = !!accept("keyword", "NOT");
        expect("keyword", "EMPTY");
        return { kind: "not", negate: isNot, value: { kind: "empty", value: left } };
      } else {
        const op = ["=", "!=", "<", ">", "<=", ">="].find((o) => is("op", o));
        if (!op) return left;
        pos++;
        return { kind: "binary", op, left, right: sum() };
      }
      return not ? { kind: "not", negate: true, value: node } : node;
    };
    const negation = () => (accept("keyword", "NOT") ? { kind: "not", negate: true, value: negation() } : comparison());
    const conjunction = binary(negation, ["AND"]);
    const expression = binary(conjunction, ["OR"]);

    expect("keyword", "SELECT");
    const query = { distinct: !!accept("keyword", "DISTINCT"), columns: [], orderBy: [] };
    if (accept("op", "*")) {
      query.columns = null;
    } else {
      do {
        const start = pos;
        const expr = expression();
        const name = accept("keyword", "AS")
          ? expect(is("string") ? "string" : "name").value
          : expr.kind === "column"
            ? expr.name
            : tokens.slice(start, pos).map((t) => t.value).join(" ");
        query.columns.push({ expr, name });
      } while (accept("op", ","));
    }
    expect("keyword", "FROM");
    query.table = (accept("string") || expect("name")).value;
    if (accept("op", ".")) {
      query.database = query.table;
      query.table = (accept("string") || expect("name")).value;
    }
    if (accept("keyword", "WHERE")) query.where = expression();
    if (accept("keyword", "ORDER")) {
      expect("keyword", "BY");
      do {
        const expr = expression();
        const desc = !!accept("keyword", "DESC");
        if (!desc) accept("keyword", "ASC");
        query.orderBy.push({ expr, desc });
      } while (accept("op", ","));
    }
    if (accept("keyword", "LIMIT")) {
      query.limit = expect("number").value;
      if (accept("keyword", "OFFSET")) query.offset = expect("number").value;
    }
    if (peek()) throw new Error(`unexpected "${peek().value}"`);
    return query;
  };

  const likeToRegExp = (pattern) =>
    new RegExp(
      "^" + [...Cast.toString(pattern)].map((c) => (c === "%" ? ".*" : c === "_" ? "." : c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("") + "$",
      "is"
    );
  const hasAggregate = (node) =>
    !!node &&
    (node.kind === "aggregate" ||
      [node.left, node.right, node.value, node.pattern, node.low, node.high, ...(node.list || [])].some(hasAggregate));

  // rows: the row being read, or every matching row for aggregates
  const evaluate = (node, table, row, rows) => {
    const ev = (n) => evaluate(n, table, row, rows);
    switch (node.kind) {
      case "value":
        return node.value;
      case "column": {
        const index = table.columns.indexOf(node.name);
        if (index === -1) throw new Error(`no column called "${node.name}"`);
        return row ? row[index] : "";
      }
      case "aggregate": {
        const values = node.arg ? rows.map((r) => evaluate(node.arg, table, r, rows)) : rows;
        if (node.fn === "COUNT") return node.arg ? values.filter((v) => v !== "").length : values.length;
        const numbers = values.filter((v) => v !== "");
        if (node.fn === "SUM") return numbers.reduce((a, v) => a + Cast.toNumber(v), 0);
        if (node.fn === "AVG") return numbers.length ? numbers.reduce((a, v) => a + Cast.toNumber(v), 0) / numbers.length : "";
        if (!numbers.length) return "";
        return numbers.reduce((best, v) => (Cast.compare(v, best) * (node.fn === "MIN" ? -1 : 1) > 0 ? v : best));
      }
      case "not":
        return node.negate !== Cast.toBoolean(ev(node.value));
      case "empty":
        return Cast.toString(ev(node.value)) === "";
      case "like":
        return likeToRegExp(ev(node.pattern)).test(Cast.toString(ev(node.left)));
      case "in": {
        const left = ev(node.left);
        return node.list.some((item) => Cast.compare(left, ev(item)) === 0);
      }
      case "between": {
        const left = ev(node.left);
        return Cast.compare(left, ev(node.low)) >= 0 && Cast.compare(left, ev(node.high)) <= 0;
      }
      case "binary": {
        if (node.op === "AND") return Cast.toBoolean(ev(node.left)) && Cast.toBoolean(ev(node.right));
        if (node.op === "OR") return Cast.toBoolean(ev(node.left)) || Cast.toBoolean(ev(node.right));
        const a = ev(node.left);
        const b = ev(node.right);
        switch (node.op) {
          case "=": return Cast.compare(a, b) === 0;
          case "!=": return Cast.compare(a, b) !== 0;
          case "<": return Cast.compare(a, b) < 0;
          case ">": return Cast.compare(a, b) > 0;
          case "<=": return Cast.compare(a, b) <= 0;
          case ">=": return Cast.compare(a, b) >= 0;
          case "+": return Cast.toNumber(a) + Cast.toNumber(b);
          case "-": return Cast.toNumber(a) - Cast.toNumber(b);
          case "*": return Cast.toNumber(a) * Cast.toNumber(b);
          case "/": return Cast.toNumber(a) / Cast.toNumber(b);
          case "%": return Cast.toNumber(a) % Cast.toNumber(b);
        }
      }
    }
    throw new Error("unsupported query");
  };

  // returns { columns, rows } shaped like a table
  const runQuery = (sql) => {
    const query = parseQuery(Cast.toString(sql));
    if (query.database !== undefined && !getDatabase(query.database)) throw new Error(`no database called "${query.database}"`);
    const table = getTable(query.table, query.database);
    if (!table) throw new Error(`no table called "${query.table}"`);
    let rows = query.where ? table.rows.filter((row) => Cast.toBoolean(evaluate(query.where, table, row))) : table.rows.slice();
    for (const { expr } of query.orderBy) evaluate(expr, table, rows[0] || null, rows); // report unknown columns
    rows.sort((a, b) => {
      for (const { expr, desc } of query.orderBy) {
        const order = Cast.compare(evaluate(expr, table, a), evaluate(expr, table, b));
        if (order) return desc ? -order : order;
      }
      return 0;
    });
    const selected = query.columns || table.columns.map((name) => ({ expr: { kind: "column", name }, name }));
    let result;
    if (selected.some((c) => hasAggregate(c.expr))) {
      result = [selected.map((c) => evaluate(c.expr, table, rows[0] || null, rows))];
    } else {
      result = rows.map((row) => selected.map((c) => evaluate(c.expr, table, row, rows)));
      for (const c of selected) evaluate(c.expr, table, null, rows); // report unknown columns on empty tables
    }
    if (query.distinct) {
      const seen = new Set();
      result = result.filter((row) => !seen.has(JSON.stringify(row)) && seen.add(JSON.stringify(row)));
    }
    const offset = query.offset ?? 0;
    if (query.limit !== undefined || offset) result = result.slice(offset, query.limit === undefined ? undefined : offset + query.limit);
    return { columns: selected.map((c) => c.name), rows: result };
  };

  const DATABASE = { type: ArgumentType.STRING, defaultValue: "main" };
  const TABLE = { type: ArgumentType.STRING, defaultValue: "scores" };
  const ROW = { type: ArgumentType.NUMBER, defaultValue: 1 };
  const COLUMN = { type: ArgumentType.STRING, defaultValue: "score" };

  class Databases {
    getInfo() {
      return {
        id: ID,
        name: "Databases",
        color1: "#ab1922",
        blocks: [
          { blockType: BlockType.LABEL, text: "Databases" },
          {
            opcode: "useDatabase",
            blockType: BlockType.COMMAND,
            text: "use database [DATABASE]",
            arguments: { DATABASE },
          },
          {
            opcode: "currentDatabase",
            blockType: BlockType.REPORTER,
            text: "current database",
          },
          {
            opcode: "deleteDatabase",
            blockType: BlockType.COMMAND,
            text: "delete database [DATABASE]",
            arguments: { DATABASE },
          },
          {
            opcode: "databaseExists",
            blockType: BlockType.BOOLEAN,
            text: "database [DATABASE] exists?",
            arguments: { DATABASE },
          },
          {
            opcode: "allDatabases",
            blockType: BlockType.REPORTER,
            text: "all databases",
          },
          {
            opcode: "databaseAsJSON",
            blockType: BlockType.REPORTER,
            text: "database [DATABASE] as JSON",
            arguments: { DATABASE },
          },
          {
            opcode: "loadDatabase",
            blockType: BlockType.COMMAND,
            text: "set database [DATABASE] from JSON [TEXT]",
            arguments: { DATABASE, TEXT: { type: ArgumentType.STRING, defaultValue: '{"scores":[{"name":"bob","score":10}]}' } },
          },
          { blockType: BlockType.LABEL, text: "Tables" },
          {
            opcode: "createTable",
            blockType: BlockType.COMMAND,
            text: "create table [TABLE] with columns [COLUMNS]",
            arguments: { TABLE, COLUMNS: { type: ArgumentType.STRING, defaultValue: "name, score" } },
          },
          {
            opcode: "deleteTable",
            blockType: BlockType.COMMAND,
            text: "delete table [TABLE]",
            arguments: { TABLE },
          },
          {
            opcode: "tableExists",
            blockType: BlockType.BOOLEAN,
            text: "table [TABLE] exists?",
            arguments: { TABLE },
          },
          {
            opcode: "allTables",
            blockType: BlockType.REPORTER,
            text: "all tables",
          },
          { blockType: BlockType.LABEL, text: "Rows" },
          {
            opcode: "addRow",
            blockType: BlockType.COMMAND,
            text: "add row [VALUES] to [TABLE]",
            arguments: { VALUES: { type: ArgumentType.STRING, defaultValue: "bob, 10" }, TABLE },
          },
          {
            opcode: "insertRow",
            blockType: BlockType.COMMAND,
            text: "insert row [VALUES] at [ROW] of [TABLE]",
            arguments: { VALUES: { type: ArgumentType.STRING, defaultValue: "bob, 10" }, ROW, TABLE },
          },
          {
            opcode: "deleteRow",
            blockType: BlockType.COMMAND,
            text: "delete row [ROW] of [TABLE]",
            arguments: { ROW, TABLE },
          },
          {
            opcode: "deleteAllRows",
            blockType: BlockType.COMMAND,
            text: "delete all rows of [TABLE]",
            arguments: { TABLE },
          },
          {
            opcode: "rowCount",
            blockType: BlockType.REPORTER,
            text: "number of rows in [TABLE]",
            arguments: { TABLE },
          },
          {
            opcode: "getRow",
            blockType: BlockType.REPORTER,
            text: "row [ROW] of [TABLE]",
            arguments: { ROW, TABLE },
          },
          {
            opcode: "findRow",
            blockType: BlockType.REPORTER,
            text: "row number in [TABLE] where [COLUMN] is [VALUE]",
            arguments: {
              TABLE,
              COLUMN: { type: ArgumentType.STRING, defaultValue: "name" },
              VALUE: { type: ArgumentType.STRING, defaultValue: "bob" },
            },
          },
          { blockType: BlockType.LABEL, text: "Cells" },
          {
            opcode: "getCell",
            blockType: BlockType.REPORTER,
            text: "[COLUMN] of row [ROW] of [TABLE]",
            arguments: { COLUMN, ROW, TABLE },
          },
          {
            opcode: "setCell",
            blockType: BlockType.COMMAND,
            text: "set [COLUMN] of row [ROW] of [TABLE] to [VALUE]",
            arguments: { COLUMN, ROW, TABLE, VALUE: { type: ArgumentType.STRING, defaultValue: "0" } },
          },
          {
            opcode: "changeCell",
            blockType: BlockType.COMMAND,
            text: "change [COLUMN] of row [ROW] of [TABLE] by [AMOUNT]",
            arguments: { COLUMN, ROW, TABLE, AMOUNT: { type: ArgumentType.NUMBER, defaultValue: 1 } },
          },
          { blockType: BlockType.LABEL, text: "Columns" },
          {
            opcode: "addColumn",
            blockType: BlockType.COMMAND,
            text: "add column [COLUMN] to [TABLE]",
            arguments: { COLUMN: { type: ArgumentType.STRING, defaultValue: "level" }, TABLE },
          },
          {
            opcode: "deleteColumn",
            blockType: BlockType.COMMAND,
            text: "delete column [COLUMN] of [TABLE]",
            arguments: { COLUMN: { type: ArgumentType.STRING, defaultValue: "level" }, TABLE },
          },
          {
            opcode: "columnNames",
            blockType: BlockType.REPORTER,
            text: "columns of [TABLE]",
            arguments: { TABLE },
          },
          {
            opcode: "getColumn",
            blockType: BlockType.REPORTER,
            text: "column [COLUMN] of [TABLE]",
            arguments: { COLUMN, TABLE },
          },
          {
            opcode: "sortTable",
            blockType: BlockType.COMMAND,
            text: "sort [TABLE] by [COLUMN] [ORDER]",
            arguments: { TABLE, COLUMN, ORDER: { type: ArgumentType.STRING, menu: "order" } },
          },
          { blockType: BlockType.LABEL, text: "Import and export" },
          {
            opcode: "tableAs",
            blockType: BlockType.REPORTER,
            text: "[TABLE] as [FORMAT]",
            arguments: { TABLE, FORMAT: { type: ArgumentType.STRING, menu: "format" } },
          },
          {
            opcode: "loadTable",
            blockType: BlockType.COMMAND,
            text: "set [TABLE] from [FORMAT] [TEXT]",
            arguments: {
              TABLE,
              FORMAT: { type: ArgumentType.STRING, menu: "format" },
              TEXT: { type: ArgumentType.STRING, defaultValue: '[{"name":"bob","score":10}]' },
            },
          },
          { blockType: BlockType.LABEL, text: "SQL" },
          {
            opcode: "query",
            blockType: BlockType.REPORTER,
            text: "query [SQL]",
            arguments: { SQL: { type: ArgumentType.STRING, defaultValue: "SELECT name, score FROM scores ORDER BY score DESC LIMIT 5" } },
          },
          {
            opcode: "queryInto",
            blockType: BlockType.COMMAND,
            text: "query [SQL] into table [TABLE]",
            arguments: {
              SQL: { type: ArgumentType.STRING, defaultValue: "SELECT name, score FROM scores WHERE score > 10" },
              TABLE: { type: ArgumentType.STRING, defaultValue: "results" },
            },
          },
          {
            opcode: "queryError",
            blockType: BlockType.REPORTER,
            text: "last query error",
          },
        ],
        menus: {
          order: { acceptReporters: true, items: ["descending", "ascending"] },
          format: { acceptReporters: true, items: ["JSON", "CSV"] },
        },
      };
    }

    // "use" creates the database if needed, like "create table" does for tables
    useDatabase({ DATABASE }) {
      const store = storage();
      const name = Cast.toString(DATABASE);
      if (!has(store.databases, name)) store.databases[name] = { tables: {} };
      store.current = name;
    }

    currentDatabase() {
      return storage().current;
    }

    // deleting the current database leaves you on an empty one with the same name
    deleteDatabase({ DATABASE }) {
      const store = storage();
      const name = Cast.toString(DATABASE);
      if (has(store.databases, name)) delete store.databases[name];
      storage();
    }

    databaseExists({ DATABASE }) {
      return !!getDatabase(DATABASE);
    }

    allDatabases() {
      return JSON.stringify(Object.keys(storage().databases));
    }

    // { "table name": [ {row}, ... ] } -- the same row format as "[TABLE] as JSON"
    databaseAsJSON({ DATABASE }) {
      const all = tables(DATABASE);
      if (!all) return "";
      return JSON.stringify(
        Object.fromEntries(Object.entries(all).map(([name, table]) => [name, table.rows.map((row) => rowObject(table, row))]))
      );
    }

    loadDatabase({ DATABASE, TEXT }) {
      let data;
      try {
        data = JSON.parse(Cast.toString(TEXT));
      } catch {
        return;
      }
      if (!data || typeof data !== "object" || Array.isArray(data)) return;
      const loaded = {};
      for (const [name, rows] of Object.entries(data)) {
        if (Array.isArray(rows)) loaded[name] = tableFromObjects(rows);
      }
      storage().databases[Cast.toString(DATABASE)] = { tables: loaded };
    }

    createTable({ TABLE, COLUMNS }) {
      const columns = [...new Set(parseValues(COLUMNS).map((column) => Cast.toString(column)))];
      tables()[Cast.toString(TABLE)] = { columns, rows: [] };
    }

    deleteTable({ TABLE }) {
      if (getTable(TABLE)) delete tables()[Cast.toString(TABLE)];
    }

    tableExists({ TABLE }) {
      return !!getTable(TABLE);
    }

    allTables() {
      return JSON.stringify(Object.keys(tables()));
    }

    addRow({ VALUES, TABLE }) {
      const table = getTable(TABLE);
      if (table) table.rows.push(fitRow(table, parseValues(VALUES)));
    }

    insertRow({ VALUES, ROW, TABLE }) {
      const table = getTable(TABLE);
      if (!table) return;
      // like Scratch's "insert at": the row after the last one is allowed
      const index = Cast.toListIndex(ROW, table.rows.length + 1, false);
      if (index !== Cast.LIST_INVALID) table.rows.splice(index - 1, 0, fitRow(table, parseValues(VALUES)));
    }

    deleteRow({ ROW, TABLE }) {
      const table = getTable(TABLE);
      if (!table) return;
      const index = rowIndex(table, ROW);
      if (index !== -1) table.rows.splice(index, 1);
    }

    deleteAllRows({ TABLE }) {
      const table = getTable(TABLE);
      if (table) table.rows = [];
    }

    rowCount({ TABLE }) {
      const table = getTable(TABLE);
      return table ? table.rows.length : 0;
    }

    getRow({ ROW, TABLE }) {
      const table = getTable(TABLE);
      const index = table ? rowIndex(table, ROW) : -1;
      return index === -1 ? "" : JSON.stringify(rowObject(table, table.rows[index]));
    }

    findRow({ TABLE, COLUMN, VALUE }) {
      const table = getTable(TABLE);
      const column = table ? columnIndex(table, COLUMN) : -1;
      if (column === -1) return 0;
      return table.rows.findIndex((row) => Cast.compare(row[column], VALUE) === 0) + 1;
    }

    getCell({ COLUMN, ROW, TABLE }) {
      const table = getTable(TABLE);
      if (!table) return "";
      const row = rowIndex(table, ROW);
      const column = columnIndex(table, COLUMN);
      return row === -1 || column === -1 ? "" : table.rows[row][column] ?? "";
    }

    setCell({ COLUMN, ROW, TABLE, VALUE }) {
      const table = getTable(TABLE);
      if (!table) return;
      const row = rowIndex(table, ROW);
      const column = columnIndex(table, COLUMN);
      if (row !== -1 && column !== -1) table.rows[row][column] = VALUE;
    }

    changeCell({ COLUMN, ROW, TABLE, AMOUNT }) {
      const table = getTable(TABLE);
      if (!table) return;
      const row = rowIndex(table, ROW);
      const column = columnIndex(table, COLUMN);
      if (row === -1 || column === -1) return;
      table.rows[row][column] = Cast.toNumber(table.rows[row][column]) + Cast.toNumber(AMOUNT);
    }

    addColumn({ COLUMN, TABLE }) {
      const table = getTable(TABLE);
      const name = Cast.toString(COLUMN);
      if (!table || table.columns.includes(name)) return;
      table.columns.push(name);
      for (const row of table.rows) row.push("");
    }

    deleteColumn({ COLUMN, TABLE }) {
      const table = getTable(TABLE);
      const column = table ? columnIndex(table, COLUMN) : -1;
      if (column === -1) return;
      table.columns.splice(column, 1);
      for (const row of table.rows) row.splice(column, 1);
    }

    columnNames({ TABLE }) {
      const table = getTable(TABLE);
      return table ? JSON.stringify(table.columns) : "[]";
    }

    getColumn({ COLUMN, TABLE }) {
      const table = getTable(TABLE);
      const column = table ? columnIndex(table, COLUMN) : -1;
      return column === -1 ? "[]" : JSON.stringify(table.rows.map((row) => row[column]));
    }

    sortTable({ TABLE, COLUMN, ORDER }) {
      const table = getTable(TABLE);
      const column = table ? columnIndex(table, COLUMN) : -1;
      if (column === -1) return;
      const direction = Cast.toString(ORDER) === "ascending" ? 1 : -1;
      // Cast.compare sorts numbers as numbers and text case-insensitively, like Scratch's own comparisons
      table.rows.sort((a, b) => Cast.compare(a[column], b[column]) * direction);
    }

    tableAs({ TABLE, FORMAT }) {
      const table = getTable(TABLE);
      if (!table) return "";
      if (Cast.toString(FORMAT) === "CSV") return toCSV(table);
      return JSON.stringify(table.rows.map((row) => rowObject(table, row)));
    }

    loadTable({ TABLE, FORMAT, TEXT }) {
      const text = Cast.toString(TEXT);
      let table;
      if (Cast.toString(FORMAT) === "CSV") {
        const [columns = [], ...rows] = fromCSV(text);
        table = { columns, rows };
      } else {
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          return;
        }
        if (!Array.isArray(data)) return;
        table = tableFromObjects(data);
      }
      table.rows = table.rows.map((row) => fitRow(table, row));
      tables()[Cast.toString(TABLE)] = table;
    }

    query({ SQL }) {
      try {
        const result = runQuery(SQL);
        this.lastError = "";
        return JSON.stringify(result.rows.map((row) => rowObject(result, row)));
      } catch (error) {
        this.lastError = error.message;
        return "";
      }
    }

    queryInto({ SQL, TABLE }) {
      try {
        const result = runQuery(SQL);
        this.lastError = "";
        tables()[Cast.toString(TABLE)] = { columns: result.columns, rows: result.rows.map((row) => row.map(cell)) };
      } catch (error) {
        this.lastError = error.message;
      }
    }

    queryError() {
      return this.lastError || "";
    }
  }

  Scratch.extensions.register(new Databases());
})(Scratch);
