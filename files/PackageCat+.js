// Made originally by 2Digit_co
// https://biggiecheesetherat.github.io/packagecat/
// Modified by Mistium
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(async function(Scratch) {
    const variables = {};
    const menus = {};

    function generateUUID() { // Public Domain/MIT
        var d = new Date().getTime(); //Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) { //Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else { //Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!");
        return;
    }

    class Extension {
        getInfo() {
            const blocks = [{
                opcode: "install",
                blockType: Scratch.BlockType.COMMAND,
                text: "install [type] from cdn url [url]",
                arguments: {
                    "url": {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'https://cdn.jsdelivr.net/npm/nerdamer@latest/nerdamer.core.js',
                    },
                    "type": {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'installtype'
                    }
                },
                disableMonitor: true,
                isEdgeActivated: false
            },
            {
                opcode: "delpackage",
                blockType: Scratch.BlockType.COMMAND,
                text: "delete package/style [url]",
                arguments: {
                    "url": {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'aff367a5-a881-4177-8d99-0c124cff42da',
                    },
                },
                disableMonitor: true,
                isEdgeActivated: false
            },
            {
                opcode: "installevent",
                blockType: Scratch.BlockType.EVENT,
                text: "when package installs",
                arguments: {},
                disableMonitor: true,
                isEdgeActivated: false
            },
            {
                opcode: "installfailevent",
                blockType: Scratch.BlockType.EVENT,
                text: "when package fails to install",
                arguments: {},
                disableMonitor: true,
                isEdgeActivated: false
            },
            {
                opcode: "alreadyinstallevent",
                blockType: Scratch.BlockType.EVENT,
                text: "when package is already installed",
                arguments: {},
                disableMonitor: true,
                isEdgeActivated: false
            },
            {
                opcode: "packages",
                blockType: Scratch.BlockType.REPORTER,
                text: "installed packages",
                arguments: {},
                disableMonitor: true,
                isEdgeActivated: false
            },
            {
                opcode: "inject",
                blockType: Scratch.BlockType.COMMAND,
                text: "run [code] as <script> tag",
                arguments: {
                    "code": {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'alert("Hello World!");',
                    }
                },
                disableMonitor: true,
                isEdgeActivated: false
            }
        ];

            menus["installtype"] = {
                acceptReporters: false,
                items: ["package", "stylesheet"]
            };

            return {
                "blockIconURI": "",
                "id": "packageCatPlus",
                "name": "PackageCat+",
                "color1": "#a89a36",
                "color2": "#756702",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            };
        }
    }

    variables['packages'] = [];

    Extension.prototype["install"] = async (args, util) => {
        if ((Boolean((args["url"][variables['packages']] === null)))) {
            alert('Package is already installed');
            Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_alreadyinstallevent`);
        } else {
            if (navigator.onLine) {
                try {
                    const response = await Scratch.fetch("https://corsproxy.io/?" + args.url);
                    const scriptText = await response.text();
                    const scriptElement = document.createElement((args.type === "package" ? 'script' : 'style'));
                    scriptElement.textContent = scriptText;
                    document.body.appendChild(scriptElement);
                    const uuid = generateUUID();
                    variables['packages'] = [...variables['packages'], '"' + uuid + '"'];
                    scriptElement.id = uuid;
                    Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_installevent`);
                } catch (e) {
                    alert(e);
                    Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_installfailevent`);
                }
            } else {
                Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_installfailevent`);
                alert("You must be online to import this library.");
            }
        }
    };

    Extension.prototype["delpackage"] = async (args, util) => {
        target = args["url"];
        if (document.getElementById(target) != null) {
            packages = variables['packages'];
            document.getElementById(target).remove();
            delete packages[packages.findIndex(target)];
        }
    };

    Extension.prototype["installevent"] = async (args, util) => {};

    Extension.prototype["installfailevent"] = async (args, util) => {};

    Extension.prototype["alreadyinstallevent"] = async (args, util) => {};

    Extension.prototype["packages"] = async (args, util) => {
        return "[" + variables['packages'] + "]";
    };

    Extension.prototype["inject"] = async (args, util) => {
        if (document.getElementById("tempelement") != null) {
            await document.getElementById("tempelement").remove();
        }
        const inject = document.createElement('script');
        inject.src = "data:application/javascript," + encodeURIComponent(args.code);
        inject.id = "tempelement";
        inject.async = true;
        document.body.appendChild(inject);
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
