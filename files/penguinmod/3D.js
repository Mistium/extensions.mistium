// Name: 3D
// ID: jg3d
// Description: Create and render 3D scenes with three.js on top of the stage.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_3d
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) throw new Error("3D must run unsandboxed.");

    const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;
    const Cast = Scratch.Cast;
    const Clone = { simple: (original) => JSON.parse(JSON.stringify(original)) };
    const Color = { rgbToDecimal: (rgb) => (rgb.r << 16) + (rgb.g << 8) + rgb.b };

    // three.js is loaded from a CDN the first time a block needs it
    const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.153.0";
    let Three = null;
    let MeshLoaders = null;
    let threeAddons = null;
    let threePromise = null;
    function loadThree() {
        if (!threePromise) {
            threePromise = Promise.all([
                import(`${THREE_URL}/+esm`),
                import(`${THREE_URL}/examples/jsm/utils/BufferGeometryUtils.js/+esm`),
                import(`${THREE_URL}/examples/jsm/geometries/ConvexGeometry.js/+esm`),
                import(`${THREE_URL}/examples/jsm/loaders/OBJLoader.js/+esm`),
                import(`${THREE_URL}/examples/jsm/loaders/GLTFLoader.js/+esm`),
                import(`${THREE_URL}/examples/jsm/loaders/FBXLoader.js/+esm`),
            ]).then(([three, bufferGeometryUtils, convex, obj, gltf, fbx]) => {
                Three = three;
                threeAddons = {
                    BufferGeometryUtils: bufferGeometryUtils,
                    ConvexGeometry: convex.ConvexGeometry,
                    OBJLoader: obj.OBJLoader,
                    GLTFLoader: gltf.GLTFLoader,
                    FBXLoader: fbx.FBXLoader,
                };
                MeshLoaders = {
                    OBJ: new obj.OBJLoader(),
                    GLTF: new gltf.GLTFLoader(),
                    FBX: new fbx.FBXLoader(),
                };
            }).catch((e) => {
                threePromise = null;
                throw e;
            });
        }
        return threePromise;
    }

    const Icons = {
        Cube: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAATpSURBVHhe7ZvLSzxHEMfLJ2h8rD/xlQiyCr7RKEpIkKggxKABIUTQqxARyfF38k8QPOWq+w/kalBUVIIIuSlCBNFT1KiJ0SASn5v+dvdM5rfOrDszPbMrOx8opqp3Z7eruqpntqeXApJLljymHd8wiRrkUyZpQQ4T3fHOzk5jECAZTHzFzy+Eg5yMjAza2NjgelZWFvX09HDdgG/98uOL/mLyTqhE6+vrlJmZKa3/eX5+pv7+fmlxlpkMCtU7XvZEHe+ZYNS581NTU7S5uWnqPEA7Xsf7JF8xwfnfccsjvMiAUiZ/CpUoHA7TwsKCpeNmIBtGR0fp4uJCtnA+YnIrVHWoDoBe5/n5+bS4uGjL8VgQiMHBQbq7u5MtHKV9VvVhfzCpECrRysoK5ebmSss9Nzc3NDQ0JC3OKZOPheoOt3PA90ww6tz5+fl5XscqnQcFBQX8cycnJ2ULVTHB9w5wywVuMkBP99raWopEItLyFpTFxMQEHR0dyRaOYz/snoj3PwtVXMNXV1dd1bkbcNlEQAzYDoSdE35n8olQiba2tujx8VFayaW3t1dqnN+YNAv1dRIZOsw+SHfuPNIP9ZgqzgP0Z3h4WFrUxAT9fXF7aUa8DChhcilUoq6uLpqdnU1auicCymF8fJxOT3GR0AkxuRbqS6wCoNc6ZvTl5eWUdjwWBGJgYICenp5ki/VAW73wwCR7Z2eHrq6uRMsbZG9vj6anp6H+yuQzKLHEHdaqqipqamqKnWlTHvS3pKSE+vr6ZIs1CeV1S0vLmwiE5nhpKX6OJIatwkYg6uvrpZVaFBYW2nJcw/bMhpsfZAN+7KQC2dnZfNRxdILjqb2mpiapZaGlO0beDY4DoIGyaG5u9i0QTuo8Hq4DAKLRKA9EQ0ODbPGGUCikzHENJQHQwM0SysJtWsaCeQejjsVU1SgNgEZ1dTUPhNsOa+leVFQkW9TjSQA0GhsbHU2Uqus8Hp4GQAPzQ11dnbTi4/R67hRfAgDwowrZgJE1w+313Cm+BUCjsrLyg7LQ0l31xJkovgdAA2VRUVHha7qbkbQApApBAOQxbQkCII9pSxAAeUxbggDIY9oSBEAe05YgAPKYtsQNANbi3jJ5eXlSs8Zq0Q6LcPojZWxXw8qvai4vL+n+/l5a6sDibGtrq7Q4louTVhnwDxN9p1NZWRl1dHTYXttLBthWl6jzIF4J4BE5Tubb0Y6Pj/lqzvW15V6DpHJ2dkZtbW10cnIiW6iAyavL0q++wcDPTL4Wqti7d3vrbuOmihIwSfcfmfwg1NexEwAN9Bjb3iknJ4dnhlPcBgAjHoNtf5xcBjE38A3QDw8PVF5eTmNjYzB9AZPxyMhIrPOY7p0MpuP7gL+Z4As/h7G2tsYDsbS0BNMzsLTe3t5u3CSJh5Hox7/ccoCjqJlwxqRcqOz6ySbKmA3OpiRaAnAcT5kMbDP5QqjuUBUADf1mobi4mA4ODqRlTiIB6O7u9nS3uNMSsAKdq4GCLEBZzM3NwbTNzMwMr3OD89ggrXrA1H+ggW+Z/CRUosPDwxdPf8wyYHt727grHHzJ5BehqsfLAGh8cA8Np7VttsYAmNQ5Jlr9v0ZvHZQaAsElHA5Hz8/Po/v7+9Hd3d1oKBTSX5OiujRTBmwt0x2NRCJGpyFpA2ZGo+P6X8UCAgJ8hOg/oTt1pR3DmKsAAAAASUVORK5CYII=",
        Sphere: "data:image/png;base64,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",
        Plane: "data:image/png;base64,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",
        Light: "data:image/png;base64,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",
        OBJ: "data:image/png;base64,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",
        Camera: "data:image/png;base64,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",
        Touching: "data:image/png;base64,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",
        Wireframe: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADr8AAA6/ATgFUyQAAAJBSURBVHhe5ZvLbsIwEEVD4QNYov4W/UQ+jlVhRyWSpnNdj+WENOXhx8zkSkcG16D6+JJVsmqaBiw2b35cbOYasPUjcvajuUwJ+Paj5YTmj38Cg81vt3EJTCXsc9wA94e+790bi1mtwnbd4ccNMHvcc4kbAAGfqP3pdPqdidJ1nepmbDYbN841wOV8nr7gr9fr+MOmwi0AOGI66GGu16vjcrn0+/0eazqi1QD/7xyaY9yebxoQB7WPgxodDoeGJPgZG/mzATDXtq07eTYJfBO4BV/EBxF/jwTuagAx+NCNAIDaK5SQTgDNddisMglJBbgvUyYhvQCgSEIWAdicFglZBGBTWiRkEYA1WiRkEwA0SMgqAEiXkF0AkCyhiAAgVUIxAUCihKICgDQJxQUASRKqCABSJFQTACRIqCoA1JZQXQCoKUGEAFBLghgBoIYEUQJAaQniBICSEkQKAKUkiBUASkgQLQDkliBeAMgpQYUAkEuCGgEghwRVAkBqCeoEgJQSVAoAqSSoFQBSSFAtALwqQb0A8IoEEwLAsxLMCADPSDAlADwqwZwA8IgEkwLAQxJ4nkNz6gWAeyV0PMehORMCwD0SwnsOrTcjAPwrAXe64jWH1r4kQDRTEhBI4NA6uwII3NHqTj4WEIfWDATwxjmDR2bInBu1Bc814PmGqUTPPLwTx9nb5bUGBzi+1Z+z2+38q9/MNsBixg1YsoDQfpYA+AJhCqr91LzbM288Tnio0HBuTt9y4qve0Y8hSxAwk6b5ATOEx/7P9VAiAAAAAElFTkSuQmCC",
        Raycast: "data:image/png;base64,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",
    }

    const blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAT6SURBVHhe7ZtdqBVVFMfXnHuvXG9i9/ZhWYGVYWoggqGVFSV9ywUpohch+lARFXwRAu1BEB97kNAKheiphyAKEqKXICIyKuhFS0Qh+yKvZqLXj+sZ//+99syZU/ecMx975pzDzA/WzFpzzszstWatvfeZmSMV3WXArkvHOMSPyFJIKRiChI6PL2kKAsWDFEqRJ6SDhgGcdeoAFG4ZRCNeNpujFNauIk40AblBVZH6fpx0mrPW6wjMOmson0OeUTU/anadB9sgvMbG+fdfhYGrPp3zpIaW8PMDr9kNIk9DuP+LxsqJPDLgRsgpVUXunyfy3ZtQkpwJbt/9hsjx8CiG6yAXVHWH6wCEdT42InJ6D5QsZ8DRZm8SOXfJ2orTNrs62J+QW1QVmXxHZJj9vSPOToqMbraG8gfkNlWzkbUPWA/hVTfO/7gTBurYpfPk+pl63P2v2A0icyE87xPGykDGBFWW3ynyLeu8CHDWFbtEDp2wtpLaj6Q78vsYsJQhTGQvvwvFVSElZAjD5lTYGkPiliTZ4STkdlVxIT7A4orqXQUeeBhiIxyGLFa1M3H6gNUQprtxft9aGJzF9YLzBC1je7Zx1qAsgrC9DxurA+0yYAxyWlWRNfi58jF74i6leyzg9sLtIj//ZW1lFHJW1f/Tyh1uN9U1MkPk/F67pV9AIGZsQJJetXab1rf6gAk+OPUZ5ucc4fuUr4+hDnYb9RBkhdH+Q9s+YGA+FisRUFZUH1FnezFTWLlK7XbEmgh57E4ozUNO70HHMT+sJZgjxp8J8uCPQB4wVu/Bn2B0PGG2Jp8K8y4ey4J9aw9QH8aCE2N01mlIHgCLdx8WCIQ0etpCMf0SHK9xsM5A6gCEPGolYeqlJXDcc/Jb0EUACLMAnaT/kJp54c9x53iAmwBYzO0u9g/skBxSH8SCVz2HpwhOAxDgLcSCgch4dJ+ZxTq/We08yCUAAd6DWLCjTDp/YJ0j1b071MyTXAMQgvmDv8zqHTDlk2I8T0sxAQAex2uWRYtOrM5xnHWecjxPS2EBCPDuwoKBsPMHn+XBOnfcccal8AAEeJw74MeWF95j6g5dC0CvUAXArktLFQC7Li1VAOy6tFQBsOvSUgXArktLFQC7Li3tA8B7cf3MrM5PdFt9YzYkfKTs/4JFHo/F+ODV+YtvYACONd4XIC0j0SoD/oWE92a8BSL3PAmloNtUWVjwenznSbsS4CNy7mxuYh37FcYikYkLndOqG5ycQPueEzn6u92AAoB0bGwSbw5CnlUVycD0/Uf11LgoAVxCr/mN4rchW1TtTJrLeRli3gQcRpFM/kQtJRkDUFuNC9Fclon9STMMsm8wL0BfRCj4EOSlrbQKAg4v3YzzIt0jzs+EpKrNVDtF4NsC36gq8ulekfEYb2WEJM2A4Zp4q5qGo3shHKNSkzUAAXwva46quDK/YXFO9bbEDcAIGvqY1RUG3cmjWFcBCAiT8qYxkb/D3GhBjADMel7k/EVrKE7bnKYPaAcbN4/KqTMw0D+89yGt5GzZh/1R5xHn50JcXzD3B4zwAuQjVTGt/B7TS/7lIco0GfDFDyJP7bCGwkcoX6nqnjwDENA0UPnHsQj+ABENAPpx73GrK8ihxn+N+h2WGgNhZPF8jGBHIF9CDop/62jjMyuuS7NnQH/ecPSTPUNRpyml4S1I1PGNkIqKiqIRuQYHeAEU9sBGCQAAAABJRU5ErkJggg==";

    const seperator = "---";

    function infoMenu(array) {
        return {
            acceptReporters: true,
            items: array.map(item => ({ text: item, value: item }))
        }
    }
    function infoLabel(text) {
        return {
            blockType: BlockType.LABEL,
            text: text
        }
    }
    function infoArgument(value, extra, extra2) {
        switch (typeof value) {
            case "number":
                return { type: ArgumentType.NUMBER, defaultValue: value };
            case "boolean":
                return { type: ArgumentType.BOOLEAN, defaultValue: value };
            case "string":
                switch (value) {
                    case "COLOR":
                        return { type: ArgumentType.COLOR };
                    case "ANGLE":
                        return { type: ArgumentType.ANGLE };
                    case "MATRIX":
                        return { type: ArgumentType.MATRIX };
                    case "NOTE":
                        return { type: ArgumentType.NOTE, defaultValue: 60 };
                    case "POLYGON":
                        return { type: ArgumentType.POLYGON, nodes: extra };
                    case "IMAGE":
                        return { type: ArgumentType.IMAGE, dataURI: extra, alt: extra2 };
                    default:
                        return { type: ArgumentType.STRING, defaultValue: value };
                }
        }
    }
    function infoArgumentMenu(type, menu) {
        return {
            type: type,
            menu: menu
        }
    }

    function createCommandBlock(opcode, text, args, icon, hidden) {
        const obj = {
            opcode: opcode,
            text: text ? text : opcode,
            blockType: BlockType.COMMAND
        }
        if (args) {
            obj.arguments = args;
        }
        if (icon) {
            obj.blockIconURI = icon;
        }
        if (hidden === true) {
            obj.hideFromPalette = true;
        }
        return obj;
    }
    function createReporterBlock(opcode, text, args, icon, disablemonitor) {
        const obj = {
            opcode: opcode,
            text: text ? text : opcode,
            blockType: BlockType.REPORTER
        }
        if (typeof disablemonitor === 'boolean') {
            obj.disableMonitor = disablemonitor;
        }
        if (args) {
            obj.arguments = args;
        }
        if (icon) {
            obj.blockIconURI = icon;
        }
        return obj;
    }
    function createBooleanBlock(opcode, text, args, icon) {
        const obj = {
            opcode: opcode,
            text: text ? text : opcode,
            blockType: BlockType.BOOLEAN,
            disableMonitor: true
        }
        if (args) {
            obj.arguments = args;
        }
        if (icon) {
            obj.blockIconURI = icon;
        }
        return obj;
    }

    const ExtensionInfo = {
        id: 'jg3d',
        name: '3D',
        color1: '#B100FE',
        color2: '#8600C3',
        color3: '#5B0088',
        blockIconURI: blockIconURI,
        blocks: [
            infoLabel("Initializing your scene"),

            createCommandBlock('initialize', 'create 3D scene'),
            createCommandBlock('dispose', 'remove 3D scene'),
            seperator,
            createCommandBlock(
                'setCameraPerspective0',
                'set scene camera to perspective camera with fov: [FOV]',
                {
                    FOV: infoArgument(70)
                },
                Icons.Camera
            ),
            createCommandBlock(
                'setCameraPerspective1',
                'set scene camera to perspective camera with fov: [FOV] aspect ratio: [AR]',
                {
                    FOV: infoArgument(70),
                    AR: infoArgument(480 / 360)
                },
                Icons.Camera
            ),
            createCommandBlock(
                'setCameraPerspective2',
                'set scene camera to perspective camera with fov: [FOV] aspect ratio: [AR] and only render objects within [NEAR] and [FAR] units of the camera',
                {
                    FOV: infoArgument(70),
                    AR: infoArgument(480 / 360),
                    NEAR: infoArgument(0.1),
                    FAR: infoArgument(1000)
                },
                Icons.Camera
            ),
            seperator,
            createCommandBlock('setCameraOrthographic0', 'set scene camera to orthographic camera', null, Icons.Camera),
            createCommandBlock(
                'setCameraOrthographic1',
                'set scene camera to orthographic camera with left plane: [LEFT] right plane: [RIGHT] top plane: [TOP] bottom plane: [BOTTOM]',
                {
                    LEFT: infoArgument(-480 / 2),
                    RIGHT: infoArgument(480 / 2),
                    TOP: infoArgument(360 / 2),
                    BOTTOM: infoArgument(-360 / 2)
                },
                Icons.Camera
            ),
            createCommandBlock(
                'setCameraOrthographic2',
                'set scene camera to orthographic camera with left plane: [LEFT] right plane: [RIGHT] top plane: [TOP] bottom plane: [BOTTOM] and only render objects within [NEAR] and [FAR] units of the camera',
                {
                    LEFT: infoArgument(-480 / 2),
                    RIGHT: infoArgument(480 / 2),
                    TOP: infoArgument(360 / 2),
                    BOTTOM: infoArgument(-360 / 2),
                    NEAR: infoArgument(1),
                    FAR: infoArgument(1000)
                },
                Icons.Camera
            ),
            seperator,
            createCommandBlock('render'),

            infoLabel("Scene customization"),

            createCommandBlock('setSceneLayer', "move 3D scene layer to [SIDE]", {
                SIDE: infoArgumentMenu(ArgumentType.STRING, "frontBack")
            }),
            createCommandBlock('setSceneBackgroundColor', "set background color to [COLOR]", {
                COLOR: infoArgument("COLOR")
            }),
            createCommandBlock('setSceneBackgroundOpacity', "set background transparency to [OPACITY]%", {
                OPACITY: infoArgument(100)
            }),
            createCommandBlock("show3d", "show 3D scene", {}),
            createCommandBlock("hide3d", "hide 3D scene", {}),
            createBooleanBlock("is3dVisible", "is 3D scene visible?", {}),

            infoLabel("Camera controls"),

            createCommandBlock(
                'MoveCameraBy',
                'move camera by [AMOUNT]',
                {
                    AMOUNT: infoArgument(10)
                },
                Icons.Camera
            ),
            createCommandBlock(
                'setCameraPosition',
                'set camera position to x: [X] y: [Y] z: [Z]',
                {
                    X: infoArgument(0),
                    Y: infoArgument(0),
                    Z: infoArgument(0)
                },
                Icons.Camera
            ),
            createCommandBlock(
                'changeCameraPosition',
                'change camera position by x: [X] y: [Y] z: [Z]',
                {
                    X: infoArgument(0),
                    Y: infoArgument(0),
                    Z: infoArgument(0)
                },
                Icons.Camera
            ),
            createCommandBlock(
                'setCameraRotation',
                'set camera rotation to x: [X] y: [Y] z: [Z]',
                {
                    X: infoArgument('ANGLE'),
                    Y: infoArgument('ANGLE'),
                    Z: infoArgument('ANGLE')
                },
                Icons.Camera
            ),
            createCommandBlock(
                'changeCameraRotation',
                'change camera rotation by x: [X] y: [Y] z: [Z]',
                {
                    X: infoArgument('ANGLE'),
                    Y: infoArgument('ANGLE'),
                    Z: infoArgument('ANGLE')
                },
                Icons.Camera
            ),
            createCommandBlock('setCameraZoom', 'set camera zoom to [ZOOM]%', {
                ZOOM: infoArgument(100)
            }, Icons.Camera),
            createReporterBlock("getCameraClipPlane", "camera [CLIPPLANE]", {
                CLIPPLANE: infoArgumentMenu(ArgumentType.STRING, "clippingPlanes")
            }, Icons.Camera),
            createReporterBlock("getCameraPosition", "camera [VECTOR3] position", {
                VECTOR3: infoArgumentMenu(ArgumentType.STRING, "vector3")
            }, Icons.Camera),
            createReporterBlock("getCameraRotation", "camera [VECTOR3] rotation", {
                VECTOR3: infoArgumentMenu(ArgumentType.STRING, "vector3")
            }, Icons.Camera),
            createReporterBlock("getCameraAspectRatio", "camera aspect ratio", null, Icons.Camera),
            createReporterBlock("getCameraZoom", "camera zoom", null, Icons.Camera),
            createReporterBlock("getCameraFov", "camera fov", null, Icons.Camera),
            seperator,
            createBooleanBlock("isCameraPerspective", "is scene camera a perspective camera?", null, Icons.Camera),
            createBooleanBlock("isCameraOrthographic", "is scene camera an orthographic camera?", null, Icons.Camera),

            infoLabel("Objects"),

            createBooleanBlock("doesObjectExist", "object named [NAME] exists?", {
                NAME: infoArgument("Object1")
            }),
            createReporterBlock("existingObjectsArray", "existing [OBJECTLIST]", {
                OBJECTLIST: infoArgumentMenu(ArgumentType.STRING, "objectTypeList")
            }),
            seperator,
            createCommandBlock('createCubeObject', 'create cube named [NAME] at x: [X] y: [Y] z: [Z]', {
                NAME: infoArgument("Object1"),
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0)
            }, Icons.Cube),
            createCommandBlock('createSphereObject', 'create sphere named [NAME] at x: [X] y: [Y] z: [Z]', {
                NAME: infoArgument("Object1"),
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0)
            }, Icons.Sphere),
            createCommandBlock('createPlaneObject', 'create plane named [NAME] at x: [X] y: [Y] z: [Z]', {
                NAME: infoArgument("Object1"),
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0)
            }, Icons.Plane),
            createCommandBlock('createMeshObject', 'create mesh named [NAME] with .obj data: [URL] at x: [X] y: [Y] z: [Z]', {
                NAME: infoArgument("Object1"),
                URL: infoArgument("data:text/plain;base64,"),
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0)
            }, Icons.OBJ, true),
            createCommandBlock('createMeshObjectFileTyped', 'create mesh named [NAME] with [FILETYPE] data: [URL] at x: [X] y: [Y] z: [Z]', {
                NAME: infoArgument("Object1"),
                FILETYPE: infoArgumentMenu(ArgumentType.STRING, "meshFileTypes"),
                URL: infoArgument("data:text/plain;base64,"),
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0)
            }, Icons.OBJ),
            createCommandBlock('createLightObject', 'create [LIGHTTYPE] light named [NAME] at x: [X] y: [Y] z: [Z]', {
                LIGHTTYPE: infoArgumentMenu(ArgumentType.STRING, "lightType"),
                NAME: infoArgument("Light1"),
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0)
            }, Icons.Light),
            seperator,
            createCommandBlock('moveObjectUnits', 'move object named [NAME] by [AMOUNT]', {
                NAME: infoArgument("Object1"),
                AMOUNT: infoArgument(10)
            }),
            createCommandBlock("setObjectPosition", "move object named [NAME] to x: [X] y: [Y] z: [Z]", {
                NAME: infoArgument("Object1"),
                X: infoArgument(1),
                Y: infoArgument(1),
                Z: infoArgument(1)
            }),
            createCommandBlock("setObjectRotation", "set rotation of object named [NAME] to x: [X] y: [Y] z: [Z]", {
                NAME: infoArgument("Object1"),
                X: infoArgument('ANGLE'),
                Y: infoArgument('ANGLE'),
                Z: infoArgument('ANGLE')
            }),
            createCommandBlock("setObjectSize", "set size of object named [NAME] to x: [X]% y: [Y]% z: [Z]%", {
                NAME: infoArgument("Object1"),
                X: infoArgument(100),
                Y: infoArgument(100),
                Z: infoArgument(100)
            }),
            createCommandBlock('pointTowardsObject', 'point object named [NAME1] towards object named [NAME2]', {
                NAME1: infoArgument("Object1"),
                NAME2: infoArgument("Object2"),
            }),
            createCommandBlock('pointTowardsXYZ', 'point object named [NAME] towards x: [X] y: [Y] z: [Z]', {
                NAME: infoArgument("Object1"),
                X: infoArgument(31),
                Y: infoArgument(26),
                Z: infoArgument(47),
            }),
            createReporterBlock("getObjectPosition", "[VECTOR3] position of object named [NAME]", {
                VECTOR3: infoArgumentMenu(ArgumentType.STRING, "vector3"),
                NAME: infoArgument("Object1"),
            }),
            createReporterBlock("getObjectRotation", "[VECTOR3] rotation of object named [NAME]", {
                VECTOR3: infoArgumentMenu(ArgumentType.STRING, "vector3"),
                NAME: infoArgument("Object1"),
            }),
            createReporterBlock("getObjectSize", "[VECTOR3] size of object named [NAME]", {
                VECTOR3: infoArgumentMenu(ArgumentType.STRING, "vector3"),
                NAME: infoArgument("Object1"),
            }),
            createReporterBlock("getObjectColor", "hex color of object named [NAME]", {
                NAME: infoArgument("Object1"),
            }),
            createReporterBlock("getObjectParent", "parent of object named [NAME]", {
                NAME: infoArgument("Object1"),
            }),
            seperator,
            createBooleanBlock("objectTouchingObject", "object [NAME1] touching object [NAME2]?", {
                NAME1: infoArgument("Object1"),
                NAME2: infoArgument("Object2"),
            }, Icons.Touching),
            seperator,
            createCommandBlock("deleteObject", "remove object named [NAME]", {
                NAME: infoArgument("Object1")
            }),
            createCommandBlock("setObjectColor", "recolor object named [NAME] to [COLOR]", {
                NAME: infoArgument("Object1"),
                COLOR: infoArgument("COLOR"),
            }),
            createCommandBlock("setObjectShading", "turn [ONOFF] shading on object named [NAME]", {
                ONOFF: infoArgumentMenu(ArgumentType.STRING, "onoff"),
                NAME: infoArgument("Object1"),
            }),
            createCommandBlock("setObjectWireframe", "turn [ONOFF] wireframe view on object named [NAME]", {
                ONOFF: infoArgumentMenu(ArgumentType.STRING, "onoff"),
                NAME: infoArgument("Object1"),
            }, Icons.Wireframe),
            seperator,
            createReporterBlock("rayCollision", "first object in raycast from x: [X] y: [Y] z: [Z] with direction x: [DX] y: [DY] z: [DZ]", {
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0),
                DX: infoArgument(0),
                DY: infoArgument(0),
                DZ: infoArgument(0),
            }, Icons.Raycast, true),
            createReporterBlock("rayCollisionArray", "raycast result from x: [X] y: [Y] z: [Z] with direction x: [DX] y: [DY] z: [DZ]", {
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0),
                DX: infoArgument(0),
                DY: infoArgument(0),
                DZ: infoArgument(0),
            }, Icons.Raycast, true),
            createReporterBlock("rayCollisionDistance", "first object in raycast from x: [X] y: [Y] z: [Z] with direction x: [DX] y: [DY] z: [DZ] with a max distance of [DIS]", {
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0),
                DX: infoArgument(0),
                DY: infoArgument(0),
                DZ: infoArgument(0),
                DIS: infoArgument(10)
            }, Icons.Raycast, true),
            createReporterBlock("rayCollisionArrayDistance", "raycast result from x: [X] y: [Y] z: [Z] with direction x: [DX] y: [DY] z: [DZ] with a max distance of [DIS]", {
                X: infoArgument(0),
                Y: infoArgument(0),
                Z: infoArgument(0),
                DX: infoArgument(0),
                DY: infoArgument(0),
                DZ: infoArgument(0),
                DIS: infoArgument(10)
            }, Icons.Raycast, true),
            createReporterBlock("rayCollisionCamera", "first object from raycast in camera center", {
            }, Icons.Raycast, true),
            createReporterBlock("rayCollisionCameraArray", "raycast result starting from the camera center", {
            }, Icons.Raycast, true)
        ],
        menus: {
            cameraType: infoMenu(["perspective", "orthographic"]),
            lightType: infoMenu(["point"]),
            clippingPlanes: infoMenu(["near", "far"]),
            frontBack: infoMenu(["front", "back"]),
            vector3: infoMenu(["x", "y", "z"]),
            vector2: infoMenu(["x", "y"]),
            onoff: infoMenu(["on", "off"]),
            objectTypeList: infoMenu(["objects", "physical objects", "lights"]),
            meshFileTypes: infoMenu([".obj", ".glb / .gltf", ".fbx"])
        }
    }

    function toRad(deg) {
        return deg * (Math.PI / 180);
    }
    function toDeg(rad) {
        return rad * (180 / Math.PI);
    }
    function normalize(vec) {
        const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        return new Three.Vector3(vec.x / length, vec.y / length, vec.z / length);
    }
    function toDegRounding(rad) {
        const result = toDeg(rad);
        if (!String(result).includes('.')) return result;
        const split = String(result).split('.');
        const endingDecimals = split[1].substring(0, 3);
        if ((endingDecimals === '999') && (split[1].charAt(3) === '9')) return Number(split[0]) + 1;
        return Number(split[0] + '.' + endingDecimals);
    }

    /**
     * Class for 3D blocks
     * @constructor
     */
    class Jg3DBlocks {
        constructor() {
            /**
             * The runtime instantiating this block package.
             * @type {Runtime}
             */
            this.runtime = Scratch.vm.runtime;
            // other extensions (3D VR, 3D Physics) find this instance here, like PenguinMod's built-in
            this.runtime.ext_jg3d = this;

            // three.js and its addons are set by loadThreeLibrary() once they finish loading from the CDN
            this.three = null;
            this.BufferGeometryUtils = null;
            this.ConvexGeometry = null;
            this.OBJLoader = null;
            this.GLTFLoader = null;
            this.FBXLoader = null;

            // prism has screenshots, lets tell it to use OUR canvas for them
            this.runtime.prism_screenshot_checkForExternalCanvas = true;
            this.runtime.prism_screenshot_externalCanvas = null;

            // Three.js requirements
            /**
             * @type {Three.Scene}
             */
            this.scene = null;
            /**
             * @type {Three.Camera}
             */
            this.camera = null;
            /**
             * @type {Three.WebGLRenderer}
             */
            this.renderer = null;

            this.existingSceneObjects = [];
            this.existingSceneLights = [];

            // extras
            this.lastStageSizeWhenRendering = {
                width: 0,
                height: 0
            }

            this.savedMeshes = {};
            this.sceneLayer = "front";
            this.lastStageColor = [255, 255, 255, 0];

            // event recievers
            // stop button clicked or project restarted, dispose of all objects
            this.runtime.on('PROJECT_STOP_ALL', () => {
                this.dispose();
                this.sceneLayer = "front";
                this.updateScratchCanvasRelayering();
            });
        }

        /**
         * Load three.js (and addons) from the CDN and expose them like PenguinMod does
         */
        async loadThreeLibrary() {
            await loadThree();
            this.three = Three;
            // expose addons and that for the funnis
            Object.assign(this, threeAddons);
        }

        /**
         * Dispose of the scene, camera & renderer (and any objects)
         */
        dispose() {
            this.existingSceneObjects = [];
            this.existingSceneLights = [];
            if (this.scene) {
                this.scene.remove();
                this.scene = null;
            }
            if (this.camera) {
                this.camera.remove();
                this.camera = null;
            }
            if (this.renderer) {
                if (this.renderer.domElement) {
                    this.renderer.domElement.remove();
                }
                this.renderer.dispose();
                this.renderer = null;
                this.runtime.prism_screenshot_externalCanvas = null;
            }
        }
        /**
         * Displays a message for stack blocks.
         * @param {BlockUtility} util The util from the calling block
         * @param {string} message The warning message to display
         */
        stackWarning(util, message) {
            if (!util) return;
            if (!util.thread) return;
            if (!util.thread.stackClick) return;
            const block = util.thread.blockGlowInFrame;
            this.runtime.visualReport(block, message);
        }

        /**
         * @returns {object} metadata for this extension and its blocks.
         */
        getInfo() {
            return ExtensionInfo;
        }

        // utilities
        getScratchCanvas() {
            return this.runtime.renderer.canvas;
        }
        restyleExternalCanvas(canvas) {
            canvas.style.position = "absolute"; // position above canvas without pushing it down
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            // we have no reason to register clicks on the three.js canvas,
            // so make it click on the scratch canvas instead
            canvas.style.pointerEvents = "none";
        }
        appendElementAboveScratchCanvas(element) {
            element.style.zIndex = 450;
            if (this.sceneLayer === 'back') {
                element.style.zIndex = 0;
            }
            this.getScratchCanvas().parentElement.prepend(element);
        }
        updateScratchCanvasRelayering() {
            const canvas = this.getScratchCanvas();
            canvas.style.backgroundColor = "transparent";
            canvas.style.position = "relative"; // allows zIndex changes
            if (Cast.toNumber(canvas.style.zIndex) < 1) {
                canvas.style.zIndex = 1;
            }

            // _backgroundColor4f[3] controls opacity
            let lastOpacity = this.runtime.renderer._backgroundColor4f[3];
            if (this.sceneLayer === 'front') {
                this.runtime.renderer.setBackgroundColor(
                    this.lastStageColor[0],
                    this.lastStageColor[1],
                    this.lastStageColor[2],
                    1
                );
            }
            if (this.sceneLayer === 'back') {
                if (
                    this.runtime.renderer._backgroundColor4f[0] !== this.lastStageColor[0]
                    || this.runtime.renderer._backgroundColor4f[1] !== this.lastStageColor[1]
                    || this.runtime.renderer._backgroundColor4f[2] !== this.lastStageColor[2]
                ) {
                    // color likely changed to sum else
                    console.log("updated stage color");
                    this.lastStageColor = this.runtime.renderer._backgroundColor4f;
                }
                this.runtime.renderer.setBackgroundColor(0, 0, 0, 0);
            }
            // update if changed
            if (lastOpacity !== this.runtime.renderer._backgroundColor4f[3]) {
                this.runtime.renderer.dirty = true;
            }
        }
        needsToResizeCanvas() {
            const stage = {
                width: this.runtime.stageWidth,
                height: this.runtime.stageHeight
            }
            return stage !== this.lastStageSizeWhenRendering;
        }
        mergeVertices(geometry) {
            const vertices = geometry.attributes.position.array;
            const vertexMap = {};
            const mergedVertices = [];
            const newIndices = [];
            let newIndex = 0;

            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const y = vertices[i + 1];
                const z = vertices[i + 2];
                const key = `${x},${y},${z}`;

                if (vertexMap[key] === undefined) {
                    vertexMap[key] = newIndex;
                    mergedVertices.push(x, y, z);
                    newIndices.push(newIndex);
                    newIndex++;
                } else {
                    newIndices.push(vertexMap[key]);
                }
            }

            geometry.setAttribute('position', new Three.Float32BufferAttribute(mergedVertices, 3));
            geometry.setIndex(new Three.Uint32BufferAttribute(newIndices, 1));

            return geometry;
        }

        performRaycast(raycaster, object) {
            const geometry = object.geometry;

            const mergedGeometry = this.mergeVertices(geometry);

            const boundingGeometry = new Three.BufferGeometry().copy(mergedGeometry);
            boundingGeometry.computeBoundingBox();
            boundingGeometry.boundingBox.applyMatrix4(object.matrixWorld);

            const intersection = raycaster.intersectObject(object, true);

            return intersection.length > 0;
        }

        initialize() {
            // three.js loads from the CDN the first time, the block waits for it
            if (!Three) return this.loadThreeLibrary().then(() => this.initialize());
            // dispose of the previous scene
            this.dispose();
            this.scene = new Three.Scene();
            this.renderer = new Three.WebGLRenderer({ preserveDrawingBuffer: true, alpha: true });
            this.renderer.penguinMod = {
                backgroundColor: 0x000000,
                backgroundOpacity: 1
            }
            this.renderer.setClearColor(0x000000, 1);
            // add renderer canvas ontop of scratch canvas
            const canvas = this.renderer.domElement;
            this.runtime.prism_screenshot_externalCanvas = canvas;

            this.restyleExternalCanvas(canvas);
            this.appendElementAboveScratchCanvas(canvas);
            this.updateScratchCanvasRelayering();
            /* dev: test rendering by drawing a cube and see if it appears
            // const geometry = new Three.BoxGeometry(1, 1, 1);
            // const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
            // const cube = new Three.Mesh(geometry, material);
            // this.scene.add(cube)

            dev update: it worked W
            */
        }
        render() {
            if (!this.renderer) return;
            if (!this.scene) return;
            if (!this.camera) return;
            if (this.needsToResizeCanvas()) {
                this.lastStageSizeWhenRendering = {
                    width: this.runtime.stageWidth,
                    height: this.runtime.stageHeight
                }
                /*
                    multiply sizes because the stage looks like doo doo xd
                    we dont need to worry about multiplying 1920 * 2 since projects
                    shouldnt be using that large of a stage but instead a smaller size
                    with the same aspect ratio, penguinmod even says that
                */
                this.renderer.setSize(this.lastStageSizeWhenRendering.width * 2, this.lastStageSizeWhenRendering.height * 2);
                this.restyleExternalCanvas(this.renderer.domElement);
            }
            // when switching between project page & editor, we need to move the canvas again since it gets lost
            /* todo: create layers so that iframe appears above 3d every time this is done */
            this.appendElementAboveScratchCanvas(this.renderer.domElement);
            this.updateScratchCanvasRelayering();
            return new Promise((resolve) => {
                // we do this to avoid HUGE lag when not waiting 1 tick
                // and because it waits if the tab isnt focused
                requestAnimationFrame(() => {
                    // renderer might not exist anymore
                    if (!this.renderer) return;
                    resolve(this.renderer.render(this.scene, this.camera));
                })
            })
        }

        setCameraPerspective2(args) {
            if (!Three) return this.loadThreeLibrary().then(() => this.setCameraPerspective2(args));
            if (this.camera) {
                // remove existing camera
                this.camera.remove();
                this.camera = null;
            }

            const fov = Cast.toNumber(args.FOV);
            const aspect = Cast.toNumber(args.AR);
            const near = Cast.toNumber(args.NEAR);
            const far = Cast.toNumber(args.FAR);

            this.camera = new Three.PerspectiveCamera(fov, aspect, near, far);
        }
        setCameraPerspective1(args) {
            /* todo: make near and far be the same as the existing camera if there is one */
            const near = 0.1;
            const far = 1000;
            return this.setCameraPerspective2({
                FOV: args.FOV,
                AR: args.AR,
                NEAR: near,
                FAR: far
            })
        }
        setCameraPerspective0(args) {
            /* todo: make ar, near and far be the same as the existing camera if there is one */
            const ar = this.runtime.stageWidth / this.runtime.stageHeight;
            const near = 0.1;
            const far = 1000;
            return this.setCameraPerspective2({
                FOV: args.FOV,
                AR: ar,
                NEAR: near,
                FAR: far
            })
        }

        setCameraPosition(args) {
            if (!this.camera) return;
            const position = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z),
            }
            this.camera.position.set(position.x, position.y, position.z);
        }
        setCameraRotation(args) {
            if (!this.camera) return;
            const rotation = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z),
            }
            // const euler = new Three.Euler(toRad(rotation.x), toRad(rotation.y), toRad(rotation.z));
            // this.camera.setRotationFromEuler(euler);
            const euler = new Three.Euler(0, 0, 0);
            this.camera.setRotationFromEuler(euler);
            this.camera.rotateY(toRad(rotation.y));
            this.camera.rotateX(toRad(rotation.x));
            this.camera.rotateZ(toRad(rotation.z));
        }
        getCameraPosition(args) {
            if (!this.camera) return "";
            const v = args.VECTOR3;
            if (!v) return "";
            if (!["x", "y", "z"].includes(v)) return "";
            return Cast.toNumber(this.camera.position[v]);
        }
        getCameraRotation(args) {
            if (!this.camera) return "";
            const v = args.VECTOR3;
            if (!v) return "";
            if (!["x", "y", "z"].includes(v)) return "";
            const rotation = Cast.toNumber(this.camera.rotation[v]);
            // rotation is in radians, convert to degrees but round it
            // a bit so that we get 46 instead of 45.999999999999996
            return toDegRounding(rotation);
        }

        setSceneLayer(args) {
            if (!this.renderer) return;
            let lastSceneLayer = this.sceneLayer;
            this.sceneLayer = "front";
            if (Cast.toString(args.SIDE) === 'back') {
                this.sceneLayer = "back";
            }
            if (this.sceneLayer !== lastSceneLayer) {
                this.lastStageColor = this.runtime.renderer._backgroundColor4f;
            }
            this.appendElementAboveScratchCanvas(this.renderer.domElement);
            this.updateScratchCanvasRelayering();
        }
        setSceneBackgroundColor(args) {
            if (!this.renderer) return;
            const rgb = Cast.toRgbColorObject(args.COLOR);
            const color = Color.rgbToDecimal(rgb);
            this.renderer.penguinMod.backgroundColor = color;
            this.renderer.setClearColor(color, this.renderer.penguinMod.backgroundOpacity);
        }
        setSceneBackgroundOpacity(args) {
            if (!this.renderer) return;
            let opacity = Cast.toNumber(args.OPACITY);
            if (opacity > 100) opacity = 100;
            if (opacity < 0) opacity = 0;
            const backgroundOpac = 1 - (opacity / 100);
            this.renderer.penguinMod.backgroundOpacity = backgroundOpac;
            this.renderer.setClearColor(this.renderer.penguinMod.backgroundColor, backgroundOpac);
        }
        // crash fix: these threw a TypeError before a scene was created
        show3d() {
            if (!this.renderer) return;
            this.renderer.domElement.style.display = ""
        }
        hide3d() {
            if (!this.renderer) return;
            this.renderer.domElement.style.display = "none"
        }
        is3dVisible() {
            if (!this.renderer) return false;
            return this.renderer.domElement.style.display === "" || this.renderer.domElement.style.display === "absolute"
        }

        // these blocks are in PenguinMod's block list but were never implemented there, so they do nothing
        setCameraOrthographic0() {}
        setCameraOrthographic1() {}
        setCameraOrthographic2() {}

        getCameraZoom() {
            if (!this.camera) return "";
            return Cast.toNumber(this.camera.zoom) * 100;
        }
        setCameraZoom(args) {
            if (!this.camera) return;
            this.camera.zoom = Cast.toNumber(args.ZOOM) / 100;
            this.camera.updateProjectionMatrix();
        }

        getCameraClipPlane(args) {
            if (!this.camera) return "";
            const plane = args.CLIPPLANE;
            if (!["near", "far"].includes(plane)) return "";
            return this.camera[plane];
        }

        getCameraAspectRatio() {
            if (!this.camera) return "";
            return Cast.toNumber(this.camera.aspect);
        }
        getCameraFov() {
            if (!this.camera) return "";
            return Cast.toNumber(this.camera.fov);
        }

        isCameraPerspective() {
            if (!this.camera) return false;
            return Cast.toBoolean(this.camera.isPerspectiveCamera);
        }
        isCameraOrthographic() {
            if (!this.camera) return false;
            return Cast.toBoolean(!this.camera.isPerspectiveCamera);
        }

        doesObjectExist(args) {
            if (!this.scene) return false;
            const name = Cast.toString(args.NAME);
            // !! is easier to type than if (...) { return true; } return false;
            return !!this.scene.getObjectByName(name);
        }

        createGameObject(args, util, type) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            if (this.scene.getObjectByName(name)) return this.stackWarning(util, 'An object with this name already exists!');
            const position = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z),
            };
            let object;
            switch (type) {
                case 'sphere': {
                    const geometry = new Three.SphereGeometry(1);
                    const material = new Three.MeshStandardMaterial({ color: 0xffffff });
                    const sphere = new Three.Mesh(geometry, material);
                    object = sphere;
                    break;
                }
                case 'plane': {
                    const geometry = new Three.PlaneGeometry(1, 1);
                    const material = new Three.MeshStandardMaterial({ color: 0xffffff });
                    const plane = new Three.Mesh(geometry, material);
                    object = plane;
                    break;
                }
                case 'mesh': {
                    const url = Cast.toString(args.URL);
                    // switch loaders based on file type
                    let fileType = 'obj';
                    switch (Cast.toString(args.FILETYPE)) {
                        case '.glb / .gltf':
                            fileType = 'glb';
                            break;
                        case '.fbx':
                            fileType = 'fbx';
                            break;
                    }
                    // we need to do a promise here so that stack continues on load
                    return new Promise((resolve) => {
                        let loader = MeshLoaders.OBJ;
                        switch (fileType) {
                            case 'glb':
                                loader = MeshLoaders.GLTF;
                                break;
                            case 'fbx':
                                loader = MeshLoaders.FBX;
                                break;
                        }
                        if (url in this.savedMeshes) {
                            const mesh = this.savedMeshes[url];
                            object = mesh.clone();
                            object.name = name;
                            this.existingSceneObjects.push(name);
                            object.isPenguinMod = true;
                            object.isMeshObj = true;
                            object.position.set(position.x, position.y, position.z);
                            this.scene.add(object);
                            resolve();
                            return;
                        }
                        else {
                            loader.load(url, (object) => {
                                // success
                                if (loader === MeshLoaders.GLTF) {
                                    object = object.scene;
                                }
                                if (loader === MeshLoaders.OBJ) {
                                    const material = new Three.MeshStandardMaterial({ color: 0xffffff });
                                    material.wireframe = false;
                                    this.updateMaterialOfObjObject(object, material);
                                    this.savedMeshes[url] = object;
                                }
                                object.name = name;
                                console.log(object);
                                this.existingSceneObjects.push(name);
                                object.isPenguinMod = true;
                                object.isMeshObj = true;
                                object.position.set(position.x, position.y, position.z);
                                this.scene.add(object);
                                resolve();
                            }, () => { }, (error) => {
                                console.warn('Failed to load 3D mesh obj;', error);
                                this.stackWarning(util, 'Failed to get the 3D mesh!');
                                resolve();
                            })
                        }
                    });
                }
                case 'light': {
                    const type = Cast.toString(args.LIGHTTYPE);
                    // switch type because there are different types of lights
                    let light;
                    switch (type) {
                        default: {
                            light = new Three.PointLight(0xffffff, 1, 100);
                            break;
                        }
                    }
                    object = light;
                    this.existingSceneLights.push(name);
                    break;
                }
                default: {
                    const geometry = new Three.BoxGeometry(1, 1, 1);
                    const material = new Three.MeshStandardMaterial({ color: 0xffffff });
                    const cube = new Three.Mesh(geometry, material);
                    object = cube;
                    break;
                }
            }
            object.name = name;
            this.existingSceneObjects.push(name);
            object.isPenguinMod = true;
            object.position.set(position.x, position.y, position.z);
            this.scene.add(object);
        }
        createCubeObject(args, util) {
            this.createGameObject(args, util, 'cube');
        }
        createSphereObject(args, util) {
            this.createGameObject(args, util, 'sphere');
        }
        createPlaneObject(args, util) {
            this.createGameObject(args, util, 'plane');
        }
        createMeshObject(args, util) {
            this.createGameObject(args, util, 'mesh');
        }
        createMeshObjectFileTyped(args, util) {
            this.createGameObject(args, util, 'mesh');
        }
        createLightObject(args, util) {
            this.createGameObject(args, util, 'light');
        }

        getMaterialOfObjObject(object) {
            let material;
            object.traverse((child) => {
                if (child instanceof Three.Mesh) {
                    material = child.material;
                }
            });
            return material;
        }
        updateMaterialOfObjObject(object, material) {
            object.traverse((child) => {
                if (child instanceof Three.Mesh) {
                    child.material = material;
                }
            });
        }

        setObjectPosition(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const position = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z),
            };
            const object = this.scene.getObjectByName(name);
            if (!object) return;
            object.position.set(position.x, position.y, position.z);
        }
        setObjectRotation(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const rotation = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z),
            };
            const object = this.scene.getObjectByName(name);
            if (!object) return;
            // const euler = new Three.Euler(toRad(rotation.x), toRad(rotation.y), toRad(rotation.z));
            // object.setRotationFromEuler(euler);
            const euler = new Three.Euler(0, 0, 0);
            object.setRotationFromEuler(euler);
            object.rotateY(toRad(rotation.y));
            object.rotateX(toRad(rotation.x));
            object.rotateZ(toRad(rotation.z));
        }
        setObjectSize(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const size = {
                x: Cast.toNumber(args.X) / 100,
                y: Cast.toNumber(args.Y) / 100,
                z: Cast.toNumber(args.Z) / 100,
            };
            const object = this.scene.getObjectByName(name);
            if (!object) return;
            object.scale.set(size.x, size.y, size.z);
        }
        moveObjectUnits(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return;

            const amount = Cast.toNumber(args.AMOUNT);
            const direction = new Three.Vector3();
            object.getWorldDirection(direction);
            object.position.add(direction.multiplyScalar(amount));
        }

        getObjectPosition(args) {
            if (!this.scene) return "";
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return '';
            const v = args.VECTOR3;
            if (!v) return "";
            if (!["x", "y", "z"].includes(v)) return "";
            return Cast.toNumber(object.position[v]);
        }
        getObjectRotation(args) {
            if (!this.scene) return "";
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return '';
            const v = args.VECTOR3;
            if (!v) return "";
            if (!["x", "y", "z"].includes(v)) return "";
            const rotation = Cast.toNumber(object.rotation[v]);
            // rotation is in radians, convert to degrees but round it
            // a bit so that we get 46 instead of 45.999999999999996
            return toDegRounding(rotation);
        }
        getObjectSize(args) {
            if (!this.scene) return "";
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return '';
            const v = args.VECTOR3;
            if (!v) return "";
            if (!["x", "y", "z"].includes(v)) return "";
            return Cast.toNumber(object.scale[v]) * 100;
        }
        getObjectColor(args) {
            if (!this.scene) return "";
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return '';
            return "#" + object.material.color.getHexString()
        }
        deleteObject(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return;
            const isLight = object.isLight;
            object.clear();
            this.scene.remove(object);
            const idx = this.existingSceneObjects.indexOf(name);
            this.existingSceneObjects.splice(idx, 1);
            if (isLight) {
                const lidx = this.existingSceneLights.indexOf(name);
                this.existingSceneLights.splice(lidx, 1);
            }
        }
        setObjectColor(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const rgb = Cast.toRgbColorObject(args.COLOR);
            const color = Color.rgbToDecimal(rgb);
            const object = this.scene.getObjectByName(name);
            if (!object) return;
            if (object.isLight) {
                object.color.set(color);
                return
            }
            if (object.isMeshObj) {
                const material = this.getMaterialOfObjObject(object);
                if (!material) return;
                material.color.set(color);
                this.updateMaterialOfObjObject(object, material);
                return;
            }
            object.material.color.set(color);
        }
        setObjectShading(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const on = Cast.toString(args.ONOFF) === 'on';
            const object = this.scene.getObjectByName(name);
            if (!object) return;
            if (object.isLight) return;
            if (object.isMeshObj) {
                const material = this.getMaterialOfObjObject(object);
                if (!material) return;
                const color = '#' + material.color.getHexString();
                let newMat;
                if (on) {
                    newMat = new Three.MeshStandardMaterial({ color: color });
                } else {
                    newMat = new Three.MeshBasicMaterial({ color: color });
                }
                newMat.color.set(color);
                this.updateMaterialOfObjObject(object, newMat);
                return;
            }
            const color = '#' + object.material.color.getHexString();
            if (on) {
                object.material = new Three.MeshStandardMaterial({ color: color });
            } else {
                object.material = new Three.MeshBasicMaterial({ color: color });
            }
        }
        setObjectWireframe(args) {
            if (!this.scene) return;
            const name = Cast.toString(args.NAME);
            const on = Cast.toString(args.ONOFF) === 'on';
            const object = this.scene.getObjectByName(name);
            if (!object) return;
            if (object.isLight) return;
            if (object.isMeshObj) {
                const material = this.getMaterialOfObjObject(object);
                if (!material) return;
                material.wireframe = on;
                this.updateMaterialOfObjObject(object, material);
                return;
            }
            object.material.wireframe = on;
        }

        existingObjectsArray(args) {
            const listType = Cast.toString(args.OBJECTLIST);
            const validOptions = ["objects", "physical objects", "lights"];
            if (!validOptions.includes(listType)) return '[]';
            switch (listType) {
                case 'objects':
                    return JSON.stringify(this.existingSceneObjects);
                case 'lights':
                    return JSON.stringify(this.existingSceneLights);
                case 'physical objects': {
                    const physical = this.existingSceneObjects.filter(objectName => {
                        return !this.existingSceneLights.includes(objectName);
                    });
                    return JSON.stringify(physical);
                }
                default:
                    return '[]';
            }
        }

        objectTouchingObject(args) {
            if (!this.scene) return false;
            const name1 = Cast.toString(args.NAME1);
            const name2 = Cast.toString(args.NAME2);
            const object1 = this.scene.getObjectByName(name1);
            const object2 = this.scene.getObjectByName(name2);
            if (!object1) return false;
            if (!object2) return false;
            if (object1.isLight) return false; // currently lights are not supported for collisions
            if (object2.isLight) return false; // currently lights are not supported for collisions
            const box1 = new Three.Box3().setFromObject(object1);
            const box2 = new Three.Box3().setFromObject(object2);
            const collision = box1.intersectsBox(box2);
            return collision;
        }

        pointTowardsObject(args) {
            if (!this.scene) return false;
            const name1 = Cast.toString(args.NAME1);
            const name2 = Cast.toString(args.NAME2);
            const object1 = this.scene.getObjectByName(name1);
            const object2 = this.scene.getObjectByName(name2);
            if (!object1) return false;
            if (!object2) return false;
            object1.lookAt(object2.position);
        }
        pointTowardsXYZ(args) {
            if (!this.scene) return false;
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return false;
            const position = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z)
            };
            object.lookAt(position.x, position.y, position.z);
        }

        MoveCameraBy(args) {
            if (!this.camera) return;
            const amount = Cast.toNumber(args.AMOUNT);
            // comment so it updates bc github was having problems
            const direction = new Three.Vector3();
            this.camera.getWorldDirection(direction);
            this.camera.position.add(direction.multiplyScalar(amount));
        }

        changeCameraPosition(args) {
            if (!this.camera) return;
            this.camera.position.x += Cast.toNumber(args.X);
            this.camera.position.y += Cast.toNumber(args.Y);
            this.camera.position.z += Cast.toNumber(args.Z);
        }

        changeCameraRotation(args) {
            if (!this.camera) return;
            this.camera.rotation.x += Cast.toNumber(args.X);
            this.camera.rotation.y += Cast.toNumber(args.Y);
            this.camera.rotation.z += Cast.toNumber(args.Z);
        }

        raycastResultToReadable(result) {
            const newResult = Clone.simple(result).map((intersection) => {
                console.log(intersection.object.object.name);
                return intersection.object.object.name;
            })
            return newResult;
        }

        rayCollision(args) {
            if (!this.scene) return '';
            const ray = new Three.Raycaster();
            const origin = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z),
            };
            const direction = normalize({
                x: toRad(Cast.toNumber(args.DX)),
                y: toRad(Cast.toNumber(args.DY)),
                z: toRad(Cast.toNumber(args.DZ)),
            });
            ray.set(new Three.Vector3(origin.x, origin.y, origin.z), new Three.Vector3(direction.x, direction.y, direction.z));
            const intersects = ray.intersectObjects(this.scene.children, true);
            if (intersects.length === 0) return '';
            const first = intersects[0];
            return first.object.name;
        }
        rayCollisionCamera() {
            if (!this.scene) return '';
            if (!this.camera) return '';
            const ray = new Three.Raycaster();
            ray.setFromCamera(new Three.Vector2(), this.camera);
            const intersects = ray.intersectObjects(this.scene.children, true);
            if (intersects.length === 0) return '';
            const first = intersects[0];
            return first.object.name;
        }
        rayCollisionArray(args) {
            if (!this.scene) return '[]';
            const ray = new Three.Raycaster();
            const origin = {
                x: Cast.toNumber(args.X),
                y: Cast.toNumber(args.Y),
                z: Cast.toNumber(args.Z),
            };
            const direction = normalize({
                x: toRad(Cast.toNumber(args.DX)),
                y: toRad(Cast.toNumber(args.DY)),
                z: toRad(Cast.toNumber(args.DZ)),
            });
            ray.set(new Three.Vector3(origin.x, origin.y, origin.z), new Three.Vector3(direction.x, direction.y, direction.z));
            const intersects = ray.intersectObjects(this.scene.children, true);
            if (intersects.length === 0) return '[]';
            //const result = this.raycastResultToReadable(intersects);
            return JSON.stringify(intersects);
        }
        rayCollisionCameraArray() {
            if (!this.scene) return '[]';
            if (!this.camera) return '[]';
            const ray = new Three.Raycaster();
            ray.setFromCamera(new Three.Vector2(), this.camera);
            const intersects = ray.intersectObjects(this.scene.children, true);
            if (intersects.length === 0) return '[]';
            //const result = this.raycastResultToReadable(intersects);
            return JSON.stringify(intersects);
        }

        rayCollisionDistance(args) {
            if (!this.scene) return '';
            const origin = new Three.Vector3(
                Cast.toNumber(args.X),
                Cast.toNumber(args.Y),
                Cast.toNumber(args.Z),
            );
            const direction = normalize(new Three.Vector3(
                toRad(Cast.toNumber(args.DX)),
                toRad(Cast.toNumber(args.DY)),
                toRad(Cast.toNumber(args.DZ)),
            ));
            const ray = new Three.Raycaster(origin, direction, 0, args.DIS);
            const intersects = ray.intersectObjects(this.scene.children, true);
            if (intersects.length === 0) return '';
            const first = intersects[0];
            return first.object.name;
        }
        rayCollisionArrayDistance(args) {
            if (!this.scene) return '[]';
            const origin = new Three.Vector3(
                Cast.toNumber(args.X),
                Cast.toNumber(args.Y),
                Cast.toNumber(args.Z),
            );
            const direction = normalize(new Three.Vector3(
                toRad(Cast.toNumber(args.DX)),
                toRad(Cast.toNumber(args.DY)),
                toRad(Cast.toNumber(args.DZ)),
            ));
            const ray = new Three.Raycaster(origin, direction, 0, args.DIS);
            const intersects = ray.intersectObjects(this.scene.children, true);
            if (intersects.length === 0) return '[]';
            const result = this.raycastResultToReadable(intersects);
            return JSON.stringify(result);
        }
        getObjectParent(args) {
            if (!this.scene) return '';
            const name = Cast.toString(args.NAME);
            const object = this.scene.getObjectByName(name);
            if (!object) return '';
            if (!object.parent) return '';
            return object.parent.name;
        }
    }

    Scratch.extensions.register(new Jg3DBlocks());
})(Scratch);
