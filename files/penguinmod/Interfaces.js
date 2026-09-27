// Name: Interfaces
// ID: jgInterfaces
// Description: Unfinished HTML interface elements (buttons) over the stage.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_interfaces
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Interfaces must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const formatMessage = (m) => typeof m === "string" ? m : m.default;

// helper.js
class Button {
    constructor(addToClient, { id, label, shown }) {
        this.id = id;
        this.label = label;
        this._element = document.createElement("button");
        this._element.style = `position:absolute;left:0%;top:0%`
        if (shown === false) {
            this._element.style.display = "none";
        }
        if (label) {
            this._element.innerText = label;
        } else {
            this._element.innerText = "Button";
        }

        addToClient.AddToCanvas(this._element);
        if (addToClient.buttons[id]) {
            addToClient.buttons[id].dispose();
            delete addToClient.buttons[id];
        }
        addToClient.buttons[id] = this;
    }
    show() {
        this._element.style.display = "";
    }
    hide() {
        this._element.style.display = "none";
    }

    dispose() {
        this._element.remove();
    }
}

class UI {
    constructor(runtime) {
        this.runtime = runtime;
        this._div = document.createElement("div");
        this.Realign();

        this.buttons = {};
    }

    static Button = Button;

    /**
     * If we switch from editor to project page, our element div gets hidden away somewhere.
     * This function puts it back in place.
     */
    Realign() {
        this._div.style = `position: absolute;left: 0px;width: 100%;height: 100%;top: 0px;z-index: 1000;`
        if (!this.runtime.renderer) return;
        this.runtime.renderer.canvas.parentElement.prepend(this._div);
    }
    /**
     * Append an element to the div containing all UI elements.
     * @param {Element} element The element to add to the div.
     */
    AddToCanvas(element) {
        this._div.append(element);
        this.Realign();
    }

    /**
     * Dispose of all UI elements.
     */
    DisposeAll() {
        const buttons = Object.values(this.buttons);
        const elements = [].concat(buttons);

        elements.forEach(element => {
            element.dispose();
        })

        this.Realign();
    }
}

const Icons = {
    Mouse: "data:image/png;base64,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",
    Button: "data:image/png;base64,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",
    Text: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGrSURBVGhD7ZjPK0RRFMfP8JQaFiRhakKKrKRmodhbWviRrK2ZsPAXWKDxX4iUrTI7MotXQ5EoUbOejGLKRHG+17t1Z95talLvUudT33n3vql53++886ZzhgRBEARBEAQrHmuV5bM+WF8RC9fEteEBXhqih3XJsn2wC8ELPIWIBUcTpEXysWRyiNbSWzQ1OU3xeJt6MyrK5Tc6Oz+h3cwmFQoPOHXFSrE+sdHYAuCWZWD+YD9HnR1dP2cd8Vwq0sLihA6RZu1hoWkKjiZLeME3r80Pj8aUatdRAA/wEqC8mdic4OHx8v5rqGxg/P4WJRktKKfxVDuWKJ8WLDS2O6Ce+Khrvh6Gl9CvkS3Av0ICuEYCuEYCuEYCuEYCuMYWQPXblcq72vwFDC9VswCwBcDgQBe5rNoA3UKjE426nQaGF+XNxOZknbU9ODBCR4e+864UrfTsfIoen+6w3WDtYKFpDo4medZM6aXYfZo9pkSin/p6k+R5Dc/VvwJlg5FyJT2nzd+wllmhMrKBAfqaVTtcuxK8WIf6erSyUE6u/1aBB3gRBEEQBEEQqiD6BqCP4cgUwOFKAAAAAElFTkSuQmCC",
    Textarea: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAHcSURBVGhD7ZnRK0NRHMcPrlLjgSSslgdaPEntQfHOi6QkefbMwoO/QJHmv9BeKC8Ub2QPq1EkStSelylWFjW/79k962w7W6bcc9XvU997fvdu7X6/956dh/MTDMPUxCGtkpKkT1LBY+GeuDc8wEtD9JKuSKYftiF4gacqmtxRB2mRfDQUGhRr0S0xOTElAoF2+aFX5HLv4vziROzGNkU6/YhL16QI6QsnClMAvLIYzMf3E6Krs7t41RIv2YxYWBxXIaKkPRSKZnfUWcIBT962eQAP8OIivemY3gD+PE4q+VaaNuGR4tce7gpltVdgOo1FOlBi+rSiUJgCSGcmgzDvpXEd9eCIMs+mKfSv4AC24QC2+VEArABqBVK1X2hoGbUJL6N+hQPYhgPYhgPYhgPYhgPYhgPYhgPYhgP8FcdHB25VH18GgPnpmblSXQ/fBag0r+pamALI/fd8/kOeeEkt85qXst4AMAVAI0FcJs7kiZfUevKaF+lNxxQgjsP2zobc1vaaSvPwAC8u0ptOizvqpEiz2ddMz+nZoQgGB0R/X0g4TsN9tl8xFB6WI6YNWkwr0Xnx9HyPS7ekZVLVNDKBhtoNCbtbfhC8GJt89WgjrZNst1nhAV4YhqlCiG+BiAgQyyBzTgAAAABJRU5ErkJggg==",
    Box: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGbSURBVGhD7Zk/SwNBEMVHPUGIFoqIGjgs/AAipBC0t7QREWtrPdTCTyAoEr+FpLIVTKeYIhAFLSxEIXUwggYMCjpv3YOV2whBuDlhfvBu/wRy72XnUtyQoigdCVibrCrrnfWZsnBP3Bse4KUrxllXLN8XSwhe4ClBjx1dkBbJZ8JwmraiPVqYX6RcbtB8mBat1iudX5zSYXGX6vV7bF2zCqwPLGJ8AXBkRZgvHVdoZHj0e1eIp2aDVlbn4hAR6wiTmF47uqzhgl9e2jyAB3ixGG8uvhPAwxPUqi+pl00nUE6zhSFMUT79mMT4TsA88VkxDxwviX8jX4B/hQaQRgNIowGk0QDSaABpNIA0GkAaDSCNBpBGA0ijAaTRANJoAGl8Acz793b7zSyygOPlR28A+AKgkUCXlbJZZAHHi/Hm4gtQwmX/YMe81pYGHuDFYry59NnRpcZaaj43xs7KJ5TPT9HkREhB0HWf7U+gbNBi2oiW6eHxDlu3rHVWoox8oKF2w/I13CQEL94m328MsLZZ0m1WeIAXRVESEH0Bs4jYzXektn4AAAAASUVORK5CYII=",
    ScrollingBox: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIFSURBVGhD7ZnfK4NRHMa/Y0qNC5KwDEV+XEntQnHv0o0k165ZuPAXKNL8F9oN5YayO+JCjaL5kQi3yxQrizbf5+x915kdW0vtnHQ+9bznvO+79j7Pe77vOnsPWSyWX/GyFlinrE9WtsrCNXFteICXimhjnbFUX6xD8AJPRXicVgZpkXw4EOilxdAqjY9NkM/XIE5Wi1TqnQ6P9mkjvEJPT3c4dM4Ksr6w46IKgCELw3xk64Sam1pyRzXxkkzQ9MyoGyLE2kTHpcZpZWaxwZ3XbR7AA7w4CG8yqhHAw+ONnb5VvWwEcISqB04f5TQSbMQRlE8dOi6qERBPvA7zHjaczWRob3c73weSl6JfI1UAbWT5bt/dXIv+7VWcQ5S3Z1QA8Pz4UNCWw7gAlWID6MYG0I0NoBsbQDfGBejs6iloy2FcgL7BoVw7wK1qrvwD1UfEZPYm7s5pqwdmoBmegWISJ/dB/1DeaoFno0YAs1HXsNwvhXElVCk2gG5sAN3YALqxAXRjA+jmXwYQ79/T6Q+xYwKSl4K1AaAKgIUEOj6Jih0TkLwIbzKqABFs1taXxWtt3cADvDgIbzK1TisTY00mXxOtB9Ed8vu7qaM9QF5vxetsfwJlgyWm+dAU3T+IN9aXrDlWURmpwILaBQt/y0wQvCgX+UpRz1pi6V5mhQd4sVgsRRB9A2hS/udykTpwAAAAAElFTkSuQmCC",
    Checkbox: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAPfSURBVGhD7ZlrSBRRFMf/m4+sLCsjw6joAUWZVCQifqgMsdcmUaBlSQSlZIVGUdSHgqAvUUYPCoWIVMosKl/YU3th7yRNKkwTs/fbKNNqu+d6dh1z1Jl12dkP+4Ozc86MuP//vXdm750LN27cdIiniGQRd0U0i7A4Oeg76btJA2nRxRARD0Wo/WMjgrSQpnaY+KiE3JLzScOGRSFpWRFmhAF9+8prTqOhASguBQ5mzEJd3Xk6VSYiRMRvKqyoGaAuSyXxxw4UIcCv5aRRvP0KxK+xmUgRsZcSKz34qCSOPqjljRZPkAbSwkhtStR6gG4ez9t5FqcPm46g4RRqllJp+HhRYkWtB+Qd7yriCYWWdk8jNQOGcO5iBl69qeVKOy5h4Gn1I2SdOYCUHTHYlpqAHz+/85WucQkDOQVp4tMCi+Uv3n96g969fFsuaMBwAx+/vEP5k3tcAXNmxHKmDcMNHM3ZI1ue8O3jh3kRi2WuFUMN0Fh/WHGTKyAifD5n2jHUwIn8w2hq/iVzb6+eiJm7SuZ6MMxAsxB+7VYhV0DY1Eh4CRN6McxAYclJ2+PSw8MTseZEmevFOAPFxzkDJo4LgX//wVzpwxADxaV5+PzlA1cmLF+4nnP9GGIg71ImZ8CYkRMQOGQEV/pxuoHHz+7j5esariDGfgJn9uF0A1nnDnIG2fLB40K5sg+nGqDZ5vMXlVwB0ZHxnNmPUw1knN1nmzb49Rso1tpmmXcH3QYyz+7Hll0r5CRMD/T3ZY/FKp2ZPT2Gs+6hy0BtfRUKLh9HVU0FkrcvQv6V1md5V+QUpOPPn5YXCjRdNs9cIvPuosvAheunbSJ+NTXi2KlUTb1B04Ybd2wLc4SHRNk1bVBDl4GVsZsQvygFPb19+Aw09Ua2WLAoJ21x0UkydwS67wGar+/dfkr8AAXxma57o6Q0nzNgclC4rhVXV+g2QNC8ZefGI5p6g/JvDZ9lbjL1wNIF62TuKOwyYEVLbxQWn+ArNGmbioBBgVw5BrUXW/QyFZUl8qAZauns3EPSgBUvT280/27iyoQdG9IxdlQw1/oYP90mtY3mbvWAErXeaBUPDB862m7xneEwA0RH9waxJHo1Z47FYUPof2j8707fjD7iieM/IACJcVv5in10NITUDMiXuw+KLPBp24iG0ShuqymzpFRNL3dpIwFXb8vcJVBokdqUqBnIpo/9afPla22jIQ2khZHalKgNIRo4tMUUNGqoGWtX5WKaWHM4ezjRsKGWJ/HV9Xl0qkIEbTG1Pqc7gTbUykXQnewKQVpUN/k6g9p8gwijt1lJg4s8Tty4cTWAf5pjuUXgo5yBAAAAAElFTkSuQmCC",
    Dropdown: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAIhSURBVGhD7ZjBSwJBFMZfZRBYaiJRCYtBIHSKwENQ945dIqJz55Lq0F8QFGH/RXjqauStyINgQREJkWEdRYMSkoKab1pjFsfIlJ3R9gffzu66uN/beTPMG3LQGBfTGlOa6Y3pw2bhnXg3PMBLQwwznTPJ/liF4AWeaugyWxFEi8gnDWOc1qPbNDszR253P//RLsrlFzo5TdBebIvy+VvcumCKML3jooosAHRZDObjBynyDwa+7iqiWCrQ4tJ0NYgo0z5OqnSbrcgyDvjyqs0DeIAXE+5NRNYDGDyuTPrZ9rSpB9JpKjKAU6RPL06qyHqAj3hdzAPBS81sJAugrWj7AGRjAPMuZa95YwvhCZkNqwfhGcvDTgq1Allv/zYDtOkB0XAj6atVCsF4I+aBMwZU05EB8OVqpfLKL3RA8GJZSgNZAFh301kqyS90QPDCvYnIAojjsLO7yVeBqoEHeDHh3kR6zFYkwzRfeioMHScPKRgM0eiIQS5Xw2VpUyBtUJGtRhfoLneDW1dMK0w1aSQD9eclEyZlHQQv0pr4J/DJnV2JFqn5XYnQmL0V2n2uRbsS4bDawj6bbWJXQrV5AA9/3pWwO23qgXSqtyshCwCDhooF3miDP/Bt1eK5IxdzbYUTgGqcAFTjBKCajgyAr/YeH/Qp6gUv/6yoxyJKNfDQVFHv84XI6zHI47W3qEfaJI7+eVHfx7TBpLqohwd4cdAQok9fDasSl6ln/gAAAABJRU5ErkJggg==",
    Multiselect: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAIzSURBVGhD7ZnNK0RRGMZfjFLja8T4qslCKSvJLBRrlhYkf4A1Exb+AkUa/gqJsiV2xGKEIlGi7HxkFIoo3ufMvbpjDueizrlT51fP3K+a93nu+ZjTHLJYLN8SYo2yUqxX1rtmoSZqwwO8/Io61j5L9sUmBC/wlEOBc/SCtEjeFos101hiirq7eikcLhUPdfH09EibW6s0m5yky8sz3DpgxVlvuHCRBUCTJWF+cWGHqiLVmbuGuEvf0uBQpxsiwZrDiYssAN5+x3xyiXp7+umdG/Dmmug+zW2JxtRAAbuqjBDVRDPnq2vLNJIYwKNdFlrhE1kADJ7QXupBdJvrK6L0XeaBbiJVRNHaTHdqj5fhFrpPMU5cCp2jFzHi3T6PN28Kt7Zn/OXMRrIAWejqNjL81FYGCDo2gGmUATCNmcJPbWWA8grnxAB+aisDYB6uqNTbEqiFmqitQmZLTF6nxwbnTwktrZ9Wszzn/SBWtkAQ1kLgzy0A81gL6fxFRi3URG0VygBBWAv9hDKAzjf/FT+1834Q2wCmUQbQ+Qv8FT+1lQHsWugPoJZdC+ULNoBpbADT2ACmkQUQ/7+/vDyLiyDg8ZK1NwBkAbCRQNs7G+IiCHi8CG9eZAEW8TE9MyH+1jYNPMCLg/Dmpcg5etlj9aXvb6PrGyvU2NhEDfUxCoV+vc/2L9BtsMWEjY3zixPcOmINs3K6kQxsqB2ysCAKguBFusn3EyWscZbpbVZ4gBeLxZID0QdAWhlm3o3juwAAAABJRU5ErkJggg==",
    Slider: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAANbSURBVGhD7ZddSBRRGIa/mVUQ7CJFQijEzCxCyghBqAVBRbsTlAgS+gEjogKJAi+KqAslDaE/6EoixQwKoSBCQctMQQojQ1MzEcO9sDJISHZ1+97jnJh1ZtZxx6LgPPDu2TMz58z7nd85pFAoFAqFQqFQRCOHdYX1jjXNChsp8riezfoniWPVsYIsmHYS7uO5BNaq0Yx0rcnWNL05HF7cqetxVJB/hNLTd9G2rXmUmppJgcAYfRjto4/jr6m75z4Fgz+5iPae46ngPwOiBpf8iQB4SGh9bCZxc3oOnT7ZSBmcOjH1eZiu3z5KIxwQE2L5WSLjhmgBYAicYh1iwQHyLkCVYSouOkHHj90gn2/lYgsLIWpuvUCP2mqNKwIEg95oZt008hacAkhlPWU5N10U0PL1Nf2uzEsQRPVFv+yJ5SCQ/ayAyJmwCwBv7WflpKVl0tmqGvLvK6HExHXiphNDQwNUdiCXwjwt62v7ow4bJzCcqs7vpsXFELU09dB0YJKuNVTT5OQYbiOIXFZET+hGagbDRphvbemlkuLyFc2DZ+0PRStiwsZiHmzauJ38ew+KejqfPxbvhgd4YVApvEVgFwDGvGj55KQUccENHR1tIsVq44UtGXtEKuuDB3gxEN7M2AUgmg/DZjV8m50RKZZKL8jysj5g8mLpWrsAxMxzM2zMzMwszS+s816Q5WV9wOTFsirYBSAmyfw8Nhf3pKRg4eJlgjcpL8jysj5g8mJZSu0CEDvhq94OkXFL0vql+YId1guyvKwPmLxYdmm7AFrxc7XuHM3N/RAX3FBYWCrSiYm3Io0VfF4AWR88wIuB8GbGLgDseoPjn4apnNf1zq4nroZTcVEZ6bqPurqbxHoeCyiHbyPUU1hQKt4ND/DCDLLgLYJoO3E7K6ZP3SxeSWoud69qJwbYiYeGXxq5CGC+iGXZiX1GuhyMnUbWd1YyawPLrrds0OjL1ykKLQQpe0c+t6a7Yi0PLlHXi3v873ebYsK+YTWwKlmzLAtOPeAFrNX4FIlDT5zhr1HssE5g2Ny6UylbHqbX7GvUC3mapt/l80BWfHwC5fsrVjwP8PMj/PxhLuttGVtDcMLik5aGVl1+CjNJ3I/5RPY3wJD6L8/ECoVCoVAoFApFNIh+AUnILCG8z0g2AAAAAElFTkSuQmCC",
}

/**
 * Class
 * @constructor
 */
class jgAdvancedText {
    constructor() {
        const runtime = Scratch.vm.runtime;
        /**
         * The runtime instantiating this block package.
         * @type {runtime}
         */
        this.runtime = runtime;
        this.UIClient = new UI(runtime);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgInterfaces',
            name: 'Interfaces',
            color1: '#ac96b5',
            color2: '#8e7a96',
            blocks: [
                {
                    opcode: 'createButton',
                    text: 'create button named: [NAME] with text: [TEXT]',
                    blockIconURI: Icons.Button,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Button'
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Click me'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createTextInput',
                    text: 'create text input named: [NAME] with placeholder: [PLACEHOLDER] and default: [DEFAULT]',
                    blockIconURI: Icons.Text,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'TextInput'
                        },
                        PLACEHOLDER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Type here...'
                        },
                        DEFAULT: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createTextBox',
                    text: 'create textbox named: [NAME] with placeholder: [PLACEHOLDER] and default: [DEFAULT] being resizable? [RESIZE]',
                    blockIconURI: Icons.Textarea,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Textbox'
                        },
                        PLACEHOLDER: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Type here...'
                        },
                        DEFAULT: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        },
                        RESIZE: {
                            type: ArgumentType.BOOLEAN
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createDropdown',
                    text: 'create dropdown menu named: [NAME] with label: [LABEL]',
                    blockIconURI: Icons.Dropdown,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Dropdown'
                        },
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Click me'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createCheckbox',
                    text: 'create checkbox named: [NAME] with label: [LABEL]',
                    blockIconURI: Icons.Checkbox,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Checkbox'
                        },
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createSlider',
                    text: 'create slider named: [NAME] minimum number: [MIN] maximum number: [MAX]',
                    blockIconURI: Icons.Slider,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Slider'
                        },
                        MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createScrollingArea',
                    text: 'create scrolling box named: [NAME]',
                    blockIconURI: Icons.ScrollingBox,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Scroll area'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createMultiselect',
                    text: 'create multiselect box named: [NAME]',
                    blockIconURI: Icons.Multiselect,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Multi-select'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createGroup',
                    text: 'create group box named: [NAME]',
                    blockIconURI: Icons.Box,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Box'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
            ]
        };
    }

    // util
    createElement(type, properties) {
        const element = new UI.Button(this.UIClient, properties);
    }

    // blocks
    createButton(args) {
        this.createElement('Button', {
            id: Cast.toString(args.NAME),
            label: Cast.toString(args.TEXT),
            shown: true
        })
    }
    // missing in PenguinMod too; added so the block has a function (it does nothing, like the other unfinished blocks)
    createSlider(args) {

    }
    createTextInput(args) {

    }
    createTextBox(args) {

    }
    createDropdown(args) {

    }
    createCheckbox(args) {

    }
    createScrollingArea(args) {

    }
    createMultiselect(args) {

    }
    createGroup(args) {

    }
}

Scratch.extensions.register(new jgAdvancedText());
})(Scratch);
