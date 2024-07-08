// This is a json extension that i made for origin so that i can set json data easier
// made by Mistium :sunglasses:

class JSONExtension {
    getInfo() {
        return {
            id: 'mistiumjson',
            name: 'JSON Manipulation',
            blocks: [
                {
                    opcode: 'setPathToValue',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'set path [PATH] of JSON [JSON] to value [VALUE]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'path.to.value'
                        },
                        JSON: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{"key": "value"}'
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'newValue'
                        }
                    }
                },
                {
                    opcode: 'getPathFromJson',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get path [PATH] of JSON [JSON]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'path.to.value'
                        },
                        JSON: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{"key": "value"}'
                        }
                    }
                }
            ]
        };
    }

    setPathToValue(args) {
        const path = this.parsePath(args.PATH);
        let jsonObject;
        try {
            jsonObject = JSON.parse(args.JSON);
        } catch (e) {
            console.error('Invalid JSON');
            return '';
        }

        let value;
        try {
            value = JSON.parse(args.VALUE);
        } catch (e) {
            value = args.VALUE; // If value is not valid JSON, treat it as a string
        }

        try {
            let obj = jsonObject;
            for (let i = 0; i < path.length - 1; i++) {
                const part = path[i];
                if (typeof obj[part] === 'undefined') {
                    obj[part] = typeof path[i + 1] === 'number' ? [] : {};
                }
                obj = obj[part];
            }
            obj[path[path.length - 1]] = value;
        } catch (e) {
            // ignore
        }
        return JSON.stringify(jsonObject);
    }

    getPathFromJson(args) {
        const path = this.parsePath(args.PATH);
        let jsonObject;
        try {
            jsonObject = JSON.parse(args.JSON);
        } catch (e) {
            console.error('Invalid JSON');
            return '';
        }

        let obj = jsonObject;
        try {
            for (let i = 0; i < path.length; i++) {
                obj = obj[path[i]];
            }
        } catch (e) {
            console.error('Invalid path');
            return '';
        }

        if (typeof obj === 'object') {
            return JSON.stringify(obj);
        } else {
            return obj.toString();
        }
    }

    parsePath(path) {
        return path.split('.').map(part => {
            if (part.includes('[')) {
                const [prop, index] = part.split(/[[\]]/).filter(Boolean);
                return [prop, Number(index)];
            }
            return part;
        }).flat();
    }
}

Scratch.extensions.register(new JSONExtension());
