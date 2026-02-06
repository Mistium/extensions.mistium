(function (Scratch) {
    "use strict";
    class SimpleXML {
        constructor() {
            this.domParser = new DOMParser();
            this.xmlSerializer = new XMLSerializer();
        }
        getInfo() {
            return {
                id: "simplexml",
                name: "Simple XML",
                blocks: [
                    {
                        opcode: "isValidXML",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is [INPUT] valid XML?",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<hello />"
                            }
                        }
                    },
                    {
                        opcode: "getAttribute",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "attribute [ATTR] of [TAG] in [INPUT]",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<link rel="stylesheet" href="styles.css">'
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "link"
                            },
                            ATTR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "href"
                            }
                        }
                    },
                    {
                        opcode: "getTextContent",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "text content of [TAG] in [INPUT]",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<message>Hello World</message>"
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "message"
                            }
                        }
                    },
                    {
                        opcode: "getAllAttributes",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "all attributes of [TAG] in [INPUT] as JSON",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<img src="cat.png" alt="A cat" width="100">'
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "img"
                            }
                        }
                    },
                    {
                        opcode: "countElements",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "count of [TAG] elements in [INPUT]",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<items><item/><item/><item/></items>"
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "item"
                            }
                        }
                    },
                    {
                        opcode: "getElementByIndex",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "element [TAG] at index [INDEX] in [INPUT]",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<ul><li>First</li><li>Second</li></ul>"
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "li"
                            },
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: "hasElement",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[INPUT] contains element [TAG]?",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<root><child/></root>"
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "child"
                            }
                        }
                    },
                    {
                        opcode: "hasAttribute",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[TAG] in [INPUT] has attribute [ATTR]?",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<link href="style.css">'
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "link"
                            },
                            ATTR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "rel"
                            }
                        }
                    },
                    {
                        opcode: "createSimpleElement",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "create <[TAG]> with content [CONTENT]",
                        arguments: {
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "message"
                            },
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello"
                            }
                        }
                    },
                    {
                        opcode: "createElementWithAttrs",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "create [TAG] with attributes [ATTRS]",
                        arguments: {
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "img"
                            },
                            ATTRS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"src":"cat.png","alt":"Cat"}'
                            }
                        }
                    },
                    {
                        opcode: "getAllTextContent",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "all text from [INPUT]",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<p>Hello <b>World</b>!</p>"
                            }
                        }
                    },
                    {
                        opcode: "getChildrenNames",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "child element names of [TAG] in [INPUT] as JSON",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<person><name/><age/><city/></person>"
                            },
                            TAG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "person"
                            }
                        }
                    },
                    {
                        opcode: "prettifyXML",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "prettify [INPUT]",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<root><child>text</child></root>"
                            }
                        }
                    },
                    {
                        opcode: "minifyXML",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "minify [INPUT]",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<root>\n  <child>text</child>\n</root>"
                            }
                        }
                    },
                    {
                        opcode: "xmlToJSON",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "convert [INPUT] to JSON",
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<person><name>Alice</name><age>25</age></person>"
                            }
                        }
                    }
                ]
            };
        }

        isValidXML(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const doc = this.domParser.parseFromString(str, "application/xml");
            return !doc.querySelector("parsererror") && doc.getElementsByTagName("parsererror").length === 0;
        }

        getAttribute(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            const attr = Scratch.Cast.toString(args.ATTR);
            try {
                const doc = this.domParser.parseFromString(str, "text/html");
                const element = doc.querySelector(tag);
                return element ? element.getAttribute(attr) || "" : "";
            } catch {
                return "";
            }
        }

        getTextContent(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                const element = doc.querySelector(tag);
                return element ? element.textContent || "" : "";
            } catch {
                return "";
            }
        }

        getAllAttributes(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            try {
                const doc = this.domParser.parseFromString(str, "text/html");
                const element = doc.querySelector(tag);
                if (!element) return "{}";
                
                const attrs = {};
                for (const attr of element.attributes) {
                    attrs[attr.name] = attr.value;
                }
                return JSON.stringify(attrs);
            } catch {
                return "{}";
            }
        }

        countElements(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                return doc.querySelectorAll(tag).length;
            } catch {
                return 0;
            }
        }

        getElementByIndex(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            const index = Scratch.Cast.toNumber(args.INDEX);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                const elements = doc.querySelectorAll(tag);
                if (index >= 0 && index < elements.length) {
                    return this.xmlSerializer.serializeToString(elements[index]);
                }
                return "";
            } catch {
                return "";
            }
        }

        hasElement(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                return doc.querySelector(tag) !== null;
            } catch {
                return false;
            }
        }

        hasAttribute(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            const attr = Scratch.Cast.toString(args.ATTR);
            try {
                const doc = this.domParser.parseFromString(str, "text/html");
                const element = doc.querySelector(tag);
                return element ? element.hasAttribute(attr) : false;
            } catch {
                return false;
            }
        }

        createSimpleElement(args) {
            const tag = Scratch.Cast.toString(args.TAG);
            const content = Scratch.Cast.toString(args.CONTENT);
            const safeTag = tag.replace(/[^a-zA-Z0-9_-]/g, "");
            const safeContent = content
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            return `<${safeTag}>${safeContent}</${safeTag}>`;
        }

        createElementWithAttrs(args) {
            const tag = Scratch.Cast.toString(args.TAG);
            const attrsStr = Scratch.Cast.toString(args.ATTRS);
            const safeTag = tag.replace(/[^a-zA-Z0-9_-]/g, "");
            
            try {
                const attrs = JSON.parse(attrsStr);
                let attrString = "";
                for (const [key, value] of Object.entries(attrs)) {
                    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "");
                    const safeValue = String(value)
                        .replace(/&/g, "&amp;")
                        .replace(/"/g, "&quot;");
                    attrString += ` ${safeKey}="${safeValue}"`;
                }
                return `<${safeTag}${attrString} />`;
            } catch {
                return `<${safeTag} />`;
            }
        }

        getAllTextContent(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                return doc.documentElement ? doc.documentElement.textContent || "" : "";
            } catch {
                return "";
            }
        }

        getChildrenNames(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            const tag = Scratch.Cast.toString(args.TAG);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                const element = doc.querySelector(tag);
                if (!element) return "[]";
                
                const children = Array.from(element.children).map(child => child.tagName);
                return JSON.stringify(children);
            } catch {
                return "[]";
            }
        }

        prettifyXML(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                return this.formatXML(doc.documentElement, 0);
            } catch {
                return str;
            }
        }

        formatXML(node, level) {
            const indent = "  ".repeat(level);
            let result = indent + "<" + node.tagName;
            
            for (const attr of node.attributes || []) {
                result += ` ${attr.name}="${attr.value}"`;
            }
            
            if (node.childNodes.length === 0) {
                return result + " />\n";
            }
            
            result += ">";
            
            const hasElementChildren = Array.from(node.childNodes).some(
                child => child.nodeType === 1
            );
            
            if (hasElementChildren) {
                result += "\n";
                for (const child of node.childNodes) {
                    if (child.nodeType === 1) {
                        result += this.formatXML(child, level + 1);
                    }
                }
                result += indent;
            } else {
                result += node.textContent;
            }
            
            result += "</" + node.tagName + ">\n";
            return result;
        }

        minifyXML(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            return str.replace(/>\s+</g, "><").trim();
        }

        xmlToJSON(args) {
            const str = Scratch.Cast.toString(args.INPUT);
            try {
                const doc = this.domParser.parseFromString(str, "application/xml");
                const result = this.xmlNodeToJSON(doc.documentElement);
                return JSON.stringify(result);
            } catch {
                return "{}";
            }
        }

        xmlNodeToJSON(node) {
            const obj = {};
            
            if (node.attributes && node.attributes.length > 0) {
                obj["@attributes"] = {};
                for (const attr of node.attributes) {
                    obj["@attributes"][attr.name] = attr.value;
                }
            }
            
            if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
                if (obj["@attributes"]) {
                    obj["@text"] = node.textContent;
                } else {
                    return node.textContent;
                }
            } else {
                for (const child of node.childNodes) {
                    if (child.nodeType === 1) {
                        const childName = child.tagName;
                        const childValue = this.xmlNodeToJSON(child);
                        
                        if (obj[childName]) {
                            if (!Array.isArray(obj[childName])) {
                                obj[childName] = [obj[childName]];
                            }
                            obj[childName].push(childValue);
                        } else {
                            obj[childName] = childValue;
                        }
                    }
                }
            }
            
            return obj;
        }
    }
    Scratch.extensions.register(new SimpleXML());
})(Scratch);