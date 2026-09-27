// Name: Scratch Auth
// ID: jgScratchAuthenticate
// Description: Sign users in with their Scratch account via ScratchAuth.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_scratchAuth
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Scratch Auth must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const Icon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNTkuODg4MzciIGhlaWdodD0iMzU5Ljg4ODM3IiB2aWV3Qm94PSIwLDAsMzU5Ljg4ODM3LDM1OS44ODgzNyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMDU1ODEsLTAuMDU1ODEpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLjA1NTgxLDE4MGMwLC05OS4zODA0MyA4MC41NjM3NiwtMTc5Ljk0NDE5IDE3OS45NDQxOSwtMTc5Ljk0NDE5Yzk5LjM4MDQzLDAgMTc5Ljk0NDE5LDgwLjU2Mzc2IDE3OS45NDQxOSwxNzkuOTQ0MTljMCw5OS4zODA0MyAtODAuNTYzNzYsMTc5Ljk0NDE5IC0xNzkuOTQ0MTksMTc5Ljk0NDE5Yy05OS4zODA0MywwIC0xNzkuOTQ0MTksLTgwLjU2Mzc2IC0xNzkuOTQ0MTksLTE3OS45NDQxOXoiIGZpbGw9IiNmZmEwMWMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI4Ny43NTE3OCwxOTMuOTAzOTJjMCw0OC43MzkxMyAtMzkuMjQxMzIsODguMjUgLTEwNy43NSw4OC4yNWMtNjguMDA4NjgsMCAtMTA3Ljc1LC0zOS41MTA4NyAtMTA3Ljc1LC04OC4yNWMwLC05LjE5MDg0IC0wLjIzMTIyLC0xOS4xOTU3NiAzLjAzODI3LC0yNy43NTgwN2M1LjIwNzY0LC0xMy42Mzc5OSA4LjkxMjAzLC03NC42MDAwOCAyMC40NjE3OCwtODYuNTA3OWM4Ljg2Mzg3LC05LjEzODY2IDI5Ljc5MTQsMzAuNjM4MTggNDMuOTQ5NzcsMjUuNTc0NzRjMTIuNjU3NTUsLTQuNTI2NyAyNS40NDQ2NiwtNC41NTg3NiAzOS44MDAxNywtNC41NTg3NmMxMy4wODE0OSwwIDI2LjU0NjAzLDIuMTAyNTggMzguMDMyNzIsNS45MDEwN2MxMC41MDM3OSwzLjQ3MzQ2IDM4LjkwMjM3LC0zMy43MjE1IDQ0LjI4MjQyLC0yOC4xMzYyN2MxNC42MDcxNSwxNS4xNjQyMSAxNi42NDA2LDY5LjQxMTk3IDIyLjUyNTM5LDg4Ljc4MzY1YzIuMjI3NDQsNy4zMzIzMyAzLjQwOTQ3LDE4Ljk1MDg0IDMuNDA5NDcsMjYuNzAxNTZ6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMjUiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoxNzkuOTQ0MTg2MDQ2NTExNjI6MTc5Ljk0NDE4NjA0NjUxMTYyLS0+";
const formatMessage = (m) => typeof m === "string" ? m : m.default;

// Use TurboWarp's permission-checked APIs when present.
const scratchFetch = (url, options) => (Scratch.fetch ? Scratch.fetch(url, options) : fetch(url, options));
// Not Scratch.openWindow: it opens with noreferrer, which returns null and cuts window.opener,
// and this flow needs both. Ask for the same permission, then open the popup directly.
const openWindow = async (url, name, features) => {
    if (typeof Scratch.canOpenWindow === "function" && !(await Scratch.canOpenWindow(url))) return null;
    return window.open(url, name, features);
};

// legacy.js
const authenticate = (thisObject, args) => {
    if (!thisObject.keepAllowingAuthBlock) { // user closed popup before it was finished
        if (!thisObject.disableConfirmationShown) { // we didnt ask them to confirm yet or they only declined it once, so we let them know every time
            const areYouSure = true;
            if (!areYouSure) { // they clicked no, dont show confirmation again
                thisObject.disableConfirmationShown = true;
                return "The user has declined the ability to authenticate.";
            }
        } else { // they already clicked no before
            return "The user has declined the ability to authenticate.";
        }
    }
    return new Promise(async resolve => {
        const sanitizedName = encodeURIComponent(String(args.NAME).substring(0, 256).replace(/[^a-zA-Z0-9 _-]+/gmi, "_"));
        const waitingLink = `${window.location.origin}/wait.html`;
        const login = await openWindow(
            `https://auth.itinerary.eu.org/auth/?redirect=${btoa(waitingLink)}&name=${sanitizedName.length > 0 ? sanitizedName : "PenguinMod"}`,
            "Scratch Authentication",
            `scrollbars=yes,resizable=yes,status=no,location=yes,toolbar=no,menubar=no,width=768,height=512,left=200,top=200`
        );
        if (!login) {
            resolve("Authentication failed to appear."); // popup was blocked most likely
            // reminder for future me to make an iframe appear if the window failed to appear
        }
        let cantAccessAnymore = false;
        let finished = false; // finished will be set to true if we got the username or something went wrong
        let interval = null; // goofy activity
        interval = setInterval(() => {
            if (login?.closed && (!finished)) {
                thisObject.keepAllowingAuthBlock = false;
                clearInterval(interval);
                try {
                    login.close();
                } catch {
                    // what a shame we couldnt close the window that doesnt exist anymore
                }
                resolve("");
            }
            try {
                const query = login.location.search;
                if (!cantAccessAnymore) return;
                const parameters = new URLSearchParams(query);
                const privateCode = parameters.get("privateCode");
                if (!privateCode) {
                    finished = true;
                    clearInterval(interval);
                    login.close();
                    resolve("");
                }
                clearInterval(interval);
                scratchFetch(`https://pm-bapi.vercel.app/api/verifyToken?privateCode=${privateCode}`).then(res => res.json().then(json => {
                    finished = true;
                    login.close();
                    if (json.valid != true) {
                        resolve("");
                    }
                    resolve(String(json.username));
                })
                    .catch(() => {
                        finished = true;
                        login.close();
                        resolve("");
                    }))
                    .catch(() => {
                        finished = true;
                        login.close();
                        resolve("");
                    });
            } catch {
                // due to strange chrome bug, window still has the previous url on it so we need to wait until we switch to the auth site
                cantAccessAnymore = true;
                // now we cant access the location yet since the user hasnt left the authentication site
            }
        }, 10);
    });
};
const Legacy = { authenticate };

/**
 * Class for Scratch Authentication blocks
 * @constructor
 */
let currentPrivateCode = '';
class JgScratchAuthenticateBlocks {
    constructor() {
        const runtime = Scratch.vm.runtime;
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.promptStatus = {
            inProgress: false,
            blocked: false,
            completed: false,
            userClosed: false,
        };
        this.loginInfo = {};

        // legacy
        this.keepAllowingAuthBlock = true;
        this.disableConfirmationShown = false;
    }


    /**
     * dummy function for reseting user provided permisions when a save is loaded
     */
    deserialize() {
        this.disableConfirmationShown = false;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgScratchAuthenticate',
            name: 'Scratch Auth',
            color1: '#FFA01C',
            color2: '#ff8C00',
            blockIconURI: Icon,
            // TODO: docs doesnt exist, make some docs
            // docsURI: 'https://docs.penguinmod.com/extensions/scratch-auth',
            blocks: [
                // LEGACY BLOCK
                {
                    opcode: 'authenticate',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.authenticate',
                        default: 'get scratch username and set sign in location name to [NAME]',
                        description: "Block that returns the user's name on Scratch."
                    }),
                    disableMonitor: true,
                    hideFromPalette: true,
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: "PenguinMod" }
                    },
                    blockType: BlockType.REPORTER
                },
                // NEW BLOCKS
                {
                    opcode: 'showPrompt',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.showPrompt',
                        default: 'show login message as [NAME]',
                        description: "Block that shows the Log in menu from Scratch Authentication."
                    }),
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'loginLocation'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'getPromptStatus',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.promptStatus',
                        default: 'login prompt [STATUS]?',
                        description: "The status of the login prompt for Scratch Authentication."
                    }),
                    arguments: {
                        STATUS: {
                            type: ArgumentType.STRING,
                            menu: "promptStatus"
                        }
                    },
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'privateCode',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.privateCode',
                        default: 'authentication code',
                        description: "The login code when Scratch Authentication closes the login prompt."
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'serverRedirectLocation',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.serverRedirectLocation',
                        default: 'redirect location',
                        description: "The redirect location when Scratch Authentication closes the login prompt."
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.labels.loginInfo1',
                        default: 'The blocks below invalidate',
                        description: "Label to denote that blocks invalidate the Scratch Auth private code below this label"
                    }),
                    blockType: BlockType.LABEL
                },
                {
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.labels.loginInfo2',
                        default: 'the authentication code from above.',
                        description: "Label to denote that blocks invalidate the Scratch Auth private code below this label"
                    }),
                    blockType: BlockType.LABEL
                },
                {
                    opcode: 'validLogin',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.validLogin',
                        default: 'login is valid?',
                        description: "Whether or not the authentication was valid."
                    }),
                    disableMonitor: true,
                    // this doesnt seem to be important,
                    // login should always be valid when checking on client-side
                    hideFromPalette: true,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'scratchUsername',
                    text: formatMessage({
                        id: 'jgScratchAuthenticate.blocks.scratchUsername',
                        default: 'scratch username',
                        description: "The username that was logged in."
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {
                loginLocation: {
                    items: '_getLoginLocations',
                    isTypeable: true,
                },
                promptStatus: [
                    { text: 'in progress', value: 'inProgress' },
                    { text: 'blocked', value: 'blocked' },
                    { text: 'complete', value: 'completed' },
                    { text: 'closed by the user', value: 'userClosed' },
                ]
            }
        };
    }

    // menus
    _getLoginLocations() {
        const nameSplit = document.title.split(" - ");
        nameSplit.pop();
        const projectName = Cast.toString(nameSplit.join(" - "));
        return [
            projectName === 'PenguinMod' ? 'Project' : projectName,
            'PenguinMod',
            'Game',
        ];
    }

    // util
    async parseLoginCode_() {
        if (!currentPrivateCode) throw new Error('Private code not present');
        const req = await scratchFetch(`https://pm-bapi.vercel.app/api/verifyToken?privateCode=${currentPrivateCode}`);
        const json = await req.json();
        this.loginInfo = {
            valid: json.valid,
            username: json.username
        };
        return this.loginInfo;
    }

    // blocks
    async showPrompt(args) {
        // reset
        this.promptStatus = {
            inProgress: true,
            blocked: false,
            completed: false,
            userClosed: false,
        };
        this.loginInfo = {};

        const loginLocation = Cast.toString(args.NAME);
        const sanitizedName = encodeURIComponent(loginLocation.substring(0, 256).replace(/[^a-zA-Z0-9 _\-\.\[\]\(\)]+/gmi, ""));
        const waitingLink = `https://studio.penguinmod.com/scratchAuthExt.html?openLocation=${encodeURIComponent(window.origin)}`;

        // listen for events before opening
        let login;
        let finished = false;
        const listener = (event) => {
            if (event.origin !== (new URL(waitingLink)).origin) {
                return;
            }
            if (!(event.data && event.data.scratchauthd1)) {
                return;
            }

            const data = event.data.scratchauthd1;

            const privateCode = data.pv;
            currentPrivateCode = privateCode;

            // update status
            this.promptStatus.inProgress = false;
            this.promptStatus.completed = true;

            finished = true;
            window.removeEventListener("message", listener);
            login.close();
        };
        window.addEventListener("message", listener);

        // open prompt
        login = await openWindow(
            `https://auth.itinerary.eu.org/auth/?redirect=${btoa(waitingLink)}${sanitizedName.length > 0 ? `&name=${sanitizedName}` : ""}`,
            "Scratch Authentication",
            `scrollbars=yes,resizable=yes,status=no,location=yes,toolbar=no,menubar=no,width=768,height=512,left=200,top=200`
        );
        if (!login) {
            // popup was blocked most likely
            this.promptStatus.inProgress = false;
            this.promptStatus.blocked = true;
            return;
        }

        // .onclose doesnt work on most platforms it seems
        // so just set interval
        const closedInterval = setInterval(() => {
            if (!login.closed) return;

            this.promptStatus.inProgress = false;
            if (!finished) {
                this.promptStatus.userClosed = true;
            }
            window.removeEventListener("message", listener);
            clearInterval(closedInterval);
        }, 500);
    }
    privateCode() {
        const code = currentPrivateCode;
        currentPrivateCode = '';
        return code;
    }
    serverRedirectLocation() {
        const waitingLink = `https://studio.penguinmod.com/scratchAuthExt.html?openLocation=${window.origin}`;
        return waitingLink;
    }
    getPromptStatus(args) {
        const option = Cast.toString(args.STATUS);
        if (!(option in this.promptStatus)) return false;
        return this.promptStatus[option];
    }

    // parsing privat4e code blocks
    async validLogin() {
        if (Object.keys(this.loginInfo).length <= 0) {
            try {
                await this.parseLoginCode_();
            } catch {
                // just say invalid if we cant parse
                return false;
            }
        }
        return !!this.loginInfo.valid;
    }
    async scratchUsername() {
        if (Object.keys(this.loginInfo).length <= 0) {
            try {
                await this.parseLoginCode_();
            } catch {
                // just say no username if we cant parse
                return '';
            }
        }
        return Cast.toString(this.loginInfo.username);
    }

    // legacy block
    authenticate(...args) {
        return Legacy.authenticate(this, ...args);
    }
}

Scratch.extensions.register(new JgScratchAuthenticateBlocks());
})(Scratch);
