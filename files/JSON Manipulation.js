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
                }
            ]
        };
    }

    setPathToValue(args) {
        const path = args.PATH.split('.');
        let jsonObject;
        try {
            jsonObject = JSON.parse(args.JSON);
        } catch (e) {
            console.error('Invalid JSON');
            return;
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
                if (!obj[path[i]]) {
                    obj[path[i]] = {};
                }
                obj = obj[path[i]];
            }
            obj[path[path.length - 1]] = value;
        } catch (e) {
            //ignore
        }
        return JSON.stringify(jsonObject);
    }
}

Scratch.extensions.register(new JSONExtension());
