// Name: Pathfinding
// ID: jgPathfinding
// Description: Find paths around rectangular blockades on the stage.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_pathfinding
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("Pathfinding must run unsandboxed.");

    const { BlockType, ArgumentType, Cast } = Scratch;
    const formatMessage = (m) => typeof m === "string" ? m : m.default;
    // from src/util/clone.js
    const Clone = { simple: original => JSON.parse(JSON.stringify(original)) };

    // pathfinding (MIT, https://github.com/qiao/PathFinding.js), loaded on first use
    let pathfindingPromise = null;
    const loadPathfinding = () => {
        if (!pathfindingPromise) {
            pathfindingPromise = import("https://cdn.jsdelivr.net/npm/pathfinding@0.4.18/+esm")
                .then(mod => mod.default || mod)
                .catch(err => {
                    pathfindingPromise = null;
                    throw err;
                });
        }
        return pathfindingPromise;
    };

    // nodes.js
    class Nodes {
        constructor(...args) {
            if (Array.isArray(args)) {
                if (Array.isArray(args[0])) {
                    this._nodes = args;
                    return;
                }
            }
            this._nodes = [];
            for (let node of args) {
                if (!Array.isArray(node)) node = [];
                if (typeof node[0] !== 'number') node[0] = 0;
                if (typeof node[1] !== 'number') node[1] = 0;
                this._nodes.push([
                    Cast.toNumber(node[0]),
                    Cast.toNumber(node[1])
                ]);
            }
        }

        push(node) {
            this._nodes.push(node);
        }

        getRaw() {
            return Clone.simple(this._nodes);
        }
        getAsObject() {
            const nodes = this.getRaw();
            const object = {};
            let idx = 0;
            for (const node of nodes) {
                const key = Cast.toString(idx + 1);
                object[key] = { x: node[0], y: node[1] };
                idx++;
            }
            return object;
        }
        getObjects() {
            const nodes = this.getRaw();
            const newArray = [];
            for (const node of nodes) {
                newArray.push({ x: node[0], y: node[1] });
            }
            return newArray;
        }
        getCommaSeperated() {
            const nodes = this.getRaw();
            const flattened = nodes.flat(Infinity);
            return flattened.join(',');
        }
    }

    // seperator.js
    class Seperator {
        static _createArrayOfLength(length, item) {
            length = Cast.toNumber(length);
            if (length <= 0) return [];
            if (!isFinite(length)) return [];
            const newArray = Array.from(Array(length).keys()).map(() => {
                return item;
            });
            return Clone.simple(newArray);
        }
        static _validateUnsignedInteger(int) {
            int = Cast.toNumber(int);
            if (int < 0) int = 0;
            if (!isFinite(int)) int = 0;
            return Math.round(int);
        }
        static _splitNumber(num) {
            const number = Math.round(Cast.toNumber(num));
            if (number === 0) return [0, 0];
            if (!isFinite(number)) return [0, 0];
            return [
                Math.ceil(number / 2),
                Math.floor(number / 2)
            ];
        }
        /**
         * Adds extra space in a grid so large pathers can still get around objects.
         * @param {Grid} grid The grid that needs extra spacing
         * @param {number} amount Amount of extra tiles you want to add on each side
         * @returns The new grid with it's margins
         */
        static marginGrid(grid, amount) {
            // amount must be round & not inf or less than 0
            amount = Seperator._validateUnsignedInteger(amount);

            const newGrid = Clone.simple(grid);
            // console.log(Clone.simple(newGrid), newGrid[0].length);
            const gridLength = Seperator._validateUnsignedInteger(newGrid[0] ? newGrid[0].length : 0);
            const fillerRow = Seperator._createArrayOfLength(gridLength, 0);
            // add 0s to the top and bottom
            for (let i = 0; i < amount; i++) {
                // we need to push new copies
                // otherwise we store the same array
                // but in multiple indexes
                const first = Clone.simple(fillerRow);
                const last = Clone.simple(fillerRow);
                newGrid.unshift(first);
                newGrid.push(last);
            }
            // console.log(Clone.simple(newGrid), amount);
            // add 0s to the individual rows to expand the sides
            for (const row of newGrid) {
                for (let i = 0; i < amount; i++) {
                    row.unshift(0);
                    row.push(0);
                }
            }
            return newGrid;
        }
        /**
         * Thickens the walls in the grid. Unlike marginGrid, this actually cuts the numbers in half properly.
         * Odd numbers are split, see below which sides get the larger split.
         * @param {Grid} grid The grid that needs thicker walls
         * @param {number} width The width that will be thickened. Odd numbers will thicken the right, then the left.
         * @param {number} height The height that will be thickened. Odd numbers will thicken the top, then the bottom.
         * @returns The new grid with the padded walls.
         */
        static padGrid(grid, width, height) {
            // split the width & height numbers so we can thicken the walls with them
            // we need to subtract 1 without going negative so that wall thickness is reasonable
            const reasonableW = Math.max(0, Cast.toNumber(width) - 1);
            const reasonableH = Math.max(0, Cast.toNumber(height) - 1);
            const splitW = Seperator._splitNumber(reasonableW);
            const splitH = Seperator._splitNumber(reasonableH);
            // we need the original grid so we dont thicken walls after we already thickened them
            const originalGrid = Clone.simple(grid);
            const newGrid = Clone.simple(grid);
            // go through each row & tile of the grid
            const idx = {
                row: 0,
                tile: 0
            }
            for (const row of newGrid) {
                for (const _ of row) {
                    // if not a wall, increment index & continue to next iteration
                    if (originalGrid[idx.row][idx.tile] <= 0) {
                        idx.tile++;
                        continue;
                    }
                    // console.log('can');
                    // we are a wall, thicken
                    // thicken horizontally first as its the easiest
                    for (let i = 0; i < splitW[0]; i++) {
                        // right
                        const nextTile = idx.tile + (i + 1);
                        // dont continue if there is no next tile
                        // this can happen if we reach the boundary
                        // of the grid
                        if (typeof row[nextTile] !== 'number') continue;
                        // set next tile to a wall
                        row[nextTile] = 1;
                    }
                    for (let i = 0; i < splitW[1]; i++) {
                        // left
                        const nextTile = idx.tile - (i + 1);
                        // dont continue if there is no next tile
                        // this can happen if we reach the boundary
                        // of the grid
                        if (typeof row[nextTile] !== 'number') continue;
                        // set next tile to a wall
                        row[nextTile] = 1;
                    }
                    // thicken vertically
                    for (let i = 0; i < splitH[0]; i++) {
                        // top
                        const nextRow = idx.row - (i + 1);
                        // dont continue if there is no next row
                        // this can happen if we reach the boundary
                        // of the grid
                        if (!originalGrid[nextRow]) continue;
                        // get next row
                        const foundRow = newGrid[nextRow];
                        // set tile to a wall
                        foundRow[idx.tile] = 1;
                    }
                    for (let i = 0; i < splitH[1]; i++) {
                        // bottom
                        const nextRow = idx.row + (i + 1);
                        // dont continue if there is no next row
                        // this can happen if we reach the boundary
                        // of the grid
                        if (!originalGrid[nextRow]) continue;
                        // get next row
                        const foundRow = newGrid[nextRow];
                        // set tile to a wall
                        foundRow[idx.tile] = 1;
                    }
                    // if width & height are greater than 0, thicken diagonally
                    // this is the hardest one to do because we need to modify
                    // horizontal values in the vertical arrays
                    // we stack a for loop in a for loop in a for loop in a for loop
                    for (let i = 0; i < 2; i++) {
                        const isBottom = i === 1;
                        for (let j = 0; j < splitH[isBottom ? 1 : 0]; j++) {
                            // vertical
                            let nextRow = idx.row - (j + 1);
                            if (isBottom) nextRow = idx.row + (j + 1);
                            // dont continue if there is no next row
                            // this can happen if we reach the boundary
                            // of the grid
                            if (!originalGrid[nextRow]) continue;
                            // get next row
                            const foundRow = newGrid[nextRow];
                            for (let k = 0; k < 2; k++) {
                                const isLeft = k === 1;
                                for (let l = 0; l < splitW[isLeft ? 1 : 0]; l++) {
                                    // horizontal
                                    let nextTile = idx.tile + (l + 1);
                                    if (isLeft) nextTile = idx.tile - (l + 1);
                                    // dont continue if there is no next tile
                                    // this can happen if we reach the boundary
                                    // of the grid
                                    if (typeof foundRow[nextTile] !== 'number') continue;
                                    // set next tile to a wall
                                    foundRow[nextTile] = 1;
                                }
                            }
                        }
                    }
                    // increment index
                    idx.tile++;
                }
                // increment index and reset tile idx
                idx.row++;
                idx.tile = 0;
            }
            return newGrid;
        }
    }

    // map.js
    const blankGridReturn = {
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        offset: {
            left: 0,
            top: 0
        }
    };

    class Map {
        constructor() {
            this.boxes = [];
        }
        static new(...args) {
            return new Map(...args);
        }

        add(x1, y1, x2, y2) {
            // cast & round
            x1 = Math.round(Cast.toNumber(x1));
            y1 = Math.round(Cast.toNumber(y1));
            x2 = Math.round(Cast.toNumber(x2));
            y2 = Math.round(Cast.toNumber(y2));

            const position = {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
            };
            if (x2 < x1) {
                // x1 should be less
                position.x1 = x2;
                position.x2 = x1;
            }
            if (y2 > y1) {
                // y1 should be greater
                position.y1 = y2;
                position.y2 = y1;
            }
            const box = {
                x: position.x1,
                y: position.x2,
                width: position.x2 - position.x1,
                height: position.y1 - position.y2
            };
            this.boxes.push(box);
            return box;
        }
        clear() {
            this.boxes = [];
        }

        toGrid() {
            // no tiles if theres no boxes
            if (!this.boxes) return blankGridReturn;
            if (this.boxes.length <= 0) return blankGridReturn;

            const grid = [];
            // find highest y
            let highestY = -Infinity;
            for (const box of this.boxes) {
                if (box.y > highestY) highestY = box.y;
            }
            // find lowest y & its block height
            let lowestY = Infinity;
            let lowestHeight = 0;
            for (const box of this.boxes) {
                if (box.y < lowestY) {
                    lowestY = box.y;
                    lowestHeight = box.height;
                }
            }
            // for simplicity, we just fill this array & then clone it to make our rows
            const baseRow = [];
            // get grid width
            // find lowest x
            let lowestX = Infinity;
            for (const box of this.boxes) {
                if (box.x < lowestX) lowestX = box.x;
            }
            // find highest x & its block width
            let highestX = -Infinity;
            let highestWidth = 0;
            for (const box of this.boxes) {
                if (box.x > highestX) {
                    highestX = box.x;
                    highestWidth = box.width;
                }
            }
            // based on x numbers, add 0s to base row
            const xtoxwidth = (highestX - lowestX) + highestWidth;
            for (let i = 0; i < xtoxwidth; i++) {
                baseRow.push(0);
            }
            // based on y numbers, add rows to grid
            const ytoyheight = (highestY - lowestY) + lowestHeight;
            for (let i = 0; i < ytoyheight; i++) {
                // add a clone so modifiying a row doesnt modify all rows
                const clone = Clone.simple(baseRow);
                grid.push(clone);
            }

            // console.log(Clone.simple(grid));

            // fill the walls
            // we need the offset since we are converting scratch coords to grid indexes
            const offset = Clone.simple({
                top: highestY,
                left: lowestX
            });
            for (const box of this.boxes) {
                // offsetX is straight forward
                // offsetY makes everything except the highest box be a negative Y
                // so we correct for that
                const offsetX = box.x - offset.left;
                const offsetY = Math.abs(box.y - offset.top);
                let tileIdx = offsetX;
                let rowIdx = offsetY;
                // repeat (height) { repeat (width) { tileIdx++ } rowIdx++; tileIdx = offsetX; }
                // the for loops could probably be better optimized but i dont wanna focus on that until the code actually works
                for (let i = 0; i < box.height; i++) {
                    for (let j = 0; j < box.width; j++) {
                        // find row & then find tile to set to 1
                        const row = grid[rowIdx];
                        row[tileIdx] = 1;
                        tileIdx++;
                    }
                    rowIdx++;
                    tileIdx = offsetX;
                }
            }

            return {
                grid: grid,
                offset: offset
            }
        }
    }

    /**
     * Class for Pathfinding blocks
     * @constructor
     */
    class JgPathfindingBlocks {
        constructor() {
            /**
             * The runtime instantiating this block package.
             * @type {Runtime}
             */
            this.runtime = Scratch.vm.runtime;
            /**
             * The current map and it's boxes.
             */
            this.map = new Map();
            /**
             * The current settings for the pathfinding character.
             */
            this.pather = {
                x: 0,
                y: 0,
                width: 1,
                height: 1
            }
            /**
             * The current result of the pathfinding operation.
             */
            this.pathNodes = new Nodes();
        }

        /**
         * @returns {object} metadata for this extension and its blocks.
         */
        getInfo() {
            return {
                id: 'jgPathfinding',
                name: 'Pathfinding',
                color1: '#5386E2',
                color2: '#4169B1',
                blocks: [
                    {
                        opcode: 'createBlockadeAt',
                        text: formatMessage({
                            id: 'jgPathfinding.blocks.createBlockadeAt',
                            default: 'create blockade at x1: [X1] y1: [Y1] x2: [X2] y2: [Y2]',
                            description: "Block that creates a blockade in the pathfinding area."
                        }),
                        arguments: {
                            X1: { type: ArgumentType.NUMBER, defaultValue: -70 },
                            Y1: { type: ArgumentType.NUMBER, defaultValue: 20 },
                            X2: { type: ArgumentType.NUMBER, defaultValue: 70 },
                            Y2: { type: ArgumentType.NUMBER, defaultValue: -20 },
                        },
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'clearBlockades',
                        text: formatMessage({
                            id: 'jgPathfinding.blocks.clearBlockades',
                            default: 'clear blockades',
                            description: "Block that removes all blockades in the pathfinding area."
                        }),
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'setPatherXY',
                        text: formatMessage({
                            id: 'jgPathfinding.blocks.setPatherXY',
                            default: 'set pather starting x: [X] y: [Y]',
                            description: "Block that sets the starting position for the pather."
                        }),
                        arguments: {
                            X: { type: ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: ArgumentType.NUMBER, defaultValue: 120 },
                        },
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'setWidthHeight',
                        text: formatMessage({
                            id: 'jgPathfinding.blocks.setWidthHeight',
                            default: 'set pather width: [WIDTH] height: [HEIGHT]',
                            description: "Block that sets the width and height of the path follower. This allows sprites to avoid clipping inside walls on the way to the destination."
                        }),
                        arguments: {
                            WIDTH: { type: ArgumentType.NUMBER, defaultValue: 55 },
                            HEIGHT: { type: ArgumentType.NUMBER, defaultValue: 95 },
                        },
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'pathToSpot',
                        text: formatMessage({
                            id: 'jgPathfinding.blocks.pathToSpot',
                            default: 'find path to x: [X] y: [Y] around blockades',
                            description: "Block that finds a path around blockades in the pathfinding area to get to a location."
                        }),
                        arguments: {
                            X: { type: ArgumentType.NUMBER, defaultValue: 60 },
                            Y: { type: ArgumentType.NUMBER, defaultValue: -60 },
                        },
                        blockType: BlockType.COMMAND
                    },
                    '---',
                    {
                        opcode: 'setListToPath',
                        text: formatMessage({
                            id: 'jgPathfinding.blocks.setListToPath',
                            default: 'set [LIST] to current path',
                            description: "Block that sets a list to the current path."
                        }),
                        arguments: {
                            // PenguinMod-only: ArgumentType.LIST
                            LIST: { type: ArgumentType.STRING },
                        },
                        hideFromPalette: true,
                        blockType: BlockType.COMMAND
                    },
                    {
                        opcode: 'getPathAs',
                        text: formatMessage({
                            id: 'jgPathfinding.blocks.getPathAs',
                            default: 'current path as [TYPE]',
                            description: "Block that returns the current path in a certain way."
                        }),
                        arguments: {
                            TYPE: { type: ArgumentType.STRING, menu: "pathReturnType" },
                        },
                        disableMonitor: true,
                        blockType: BlockType.REPORTER
                    },
                ],
                menus: {
                    // lists: "menuLists",
                    pathReturnType: {
                        acceptReporters: true,
                        items: [
                            "json arrays",
                            "json array with objects",
                            "json object",
                            "comma seperated list",
                        ].map(item => ({ text: item, value: item }))
                    }
                }
            };
        }
        // menus

        // blocks
        createBlockadeAt(args) {
            const x1 = Cast.toNumber(args.X1);
            const y1 = Cast.toNumber(args.Y1);
            const x2 = Cast.toNumber(args.X2);
            const y2 = Cast.toNumber(args.Y2);
            // add to map
            this.map.add(x1, y1, x2, y2);
        }
        clearBlockades() {
            this.map.clear();
        }

        setPatherXY(args) {
            const x = Cast.toNumber(args.X);
            const y = Cast.toNumber(args.Y);
            this.pather.x = x;
            this.pather.y = y;
        }
        setWidthHeight(args) {
            const width = Cast.toNumber(args.WIDTH);
            const height = Cast.toNumber(args.HEIGHT);
            this.pather.width = width;
            this.pather.height = height;
        }

        async pathToSpot(args) {
            const Pathfinding = await loadPathfinding();
            const goalX = Cast.toNumber(args.X);
            const goalY = Cast.toNumber(args.Y);
            const exported = this.map.toGrid();
            // add margins
            const stageSize = {
                width: this.runtime.stageWidth,
                height: this.runtime.stageHeight
            };
            const marginSize = (stageSize.height > stageSize.width ? stageSize.height : stageSize.width)
                + (this.pather.height > this.pather.width ? this.pather.height : this.pather.width)
                + 24;
            // use the margins & add padding to the walls for the final matrix
            const marginMatrix = Seperator.marginGrid(exported.grid, marginSize);
            const matrix = Seperator.padGrid(marginMatrix, this.pather.width, this.pather.height);
            // get proper offsets
            const offset = exported.offset;
            offset.left -= marginSize;
            offset.top += marginSize;
            // setup pathfinding
            const grid = new Pathfinding.Grid(matrix);
            const finder = new Pathfinding.AStarFinder({
                allowDiagonal: true,
                dontCrossCorners: true
            });
            // set real starts and goals
            // this is based on the offset
            const realPositions = Clone.simple({
                start: {
                    x: this.pather.x - offset.left,
                    y: Math.abs(this.pather.y - offset.top),
                },
                end: {
                    x: goalX - offset.left,
                    y: Math.abs(goalY - offset.top),
                }
            });
            const path = Pathfinding.Util.compressPath(finder.findPath(
                realPositions.start.x,
                realPositions.start.y,
                realPositions.end.x,
                realPositions.end.y,
                grid
            ));
            // we need to do more offsetting for the resulting path
            // also need to convert it to nodes
            const newPath = new Nodes();
            for (const node of path) {
                const x = node[0] + offset.left;
                const y = 0 - (node[1] - offset.top);
                newPath.push([x, y]);
            }
            this.pathNodes = newPath;
        }

        setListToPath() {
            // PenguinMod-only list argument; the original body always threw (undefined `push`), so this does nothing.
        }
        getPathAs(args) {
            const switchh = Cast.toString(args.TYPE).toLowerCase();
            switch (switchh) {
                case 'json array with objects':
                    return JSON.stringify(this.pathNodes.getObjects());
                case 'json object':
                    return JSON.stringify(this.pathNodes.getAsObject());
                case 'comma seperated list':
                    return this.pathNodes.getCommaSeperated();
                default:
                    return JSON.stringify(this.pathNodes.getRaw());
            }
        }
    }

    Scratch.extensions.register(new JgPathfindingBlocks());
})(Scratch);
