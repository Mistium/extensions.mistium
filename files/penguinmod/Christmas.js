// Name: Christmas
// ID: jgChristmas
// Description: Falling snow and blinking lights over the page.
// By: JeremyGamer13
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jg_christmas
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
"use strict";
if (!Scratch.extensions.unsandboxed) throw new Error("Christmas must run unsandboxed.");

const { BlockType, ArgumentType, Cast } = Scratch;
const formatMessage = (m) => typeof m === "string" ? m : m.default;

// from scratch-vm util/uid
const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const uid = function () {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
};

const Textures = {
    Snow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFCSURBVDhPjdO9TsJQGMbxnhaFScPgqAkObgJegYsDd2DcNd4Uq+5u6B04GBkQLoCwKYRAolHb8n9OTguVYnmSX/pBz3s+8YoSx7Fxt7lZ+9E1KKOKfQT4xBgzY0zINU2mAI1LXA5xgXMcQ8Xe8YoOXjCnUMx1GTXGGdoY4RuRE2KOZ1xDo1uGFwY1qPEUm/KLHi5Rcc1tgQpuoJ6LopE94ATGdzU0JM35wD79nx00cYogKaDV1oJpEbeJOqwh8DUM3UCrvW3S7323HdpnbVV2azbnCx+IkinokHShQkVRJ0O8IUwKzPCIATInLSdTPGHA6CP7RmEt9nCLPrRVf6MDNcE9GrCdp0eZF7rX6rZwhYZ71oeas4atnu/Qp/cfrrl/Jp2wI9ShrdqFFkxz1hTHq0NfK6C40WirRFGDMDNnG89bAF2aCcpPwRNiAAAAAElFTkSuQmCC",
    Light: "data:image/png;base64,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",
    Present: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAL5SURBVHhe7Zs/axVBFMVvRNAiH8AvIFik09LCNiCooL2NNmKhTewtQpCApSAo1looCtoIFpZaaeFHsDeFksDzntm767z75u++l8TZmR/cd5dld+ecs7OPTZhHtbMmPYeZdJsx11kVLj02QW05wmMDgaMKIkVLz0oCmBtwdmVTtvgCb97L1sBhhuA0buvpUbq8mrICcA3Uc8hBLBgPaemxNHm1nJAeImm6OQThvKRzI8xdA+OkmE8l5S4ZATmDOmYDGDMjBvNjTK9qBmTjuUu5M2Ip86ksNQP0nfYJHfH9EDSfMq465mhmgMOoAQKVyNBM8JrH9X1jBAiGnRxAZOBhkJBI151SBM0rvMZyQkoJIDZdAYTPHZcgQs8Cr3kFxknRBKLHZT0C2pRjWkfFecylmrfRARp9OXc/xhmuh1zfuPa5MGBJBc3QDg/wksV1rl9crguXWPACTwu4pisOfImNy5eItm4RXdggOn0Ke0awlTyl3eyMm9K//xB9+c6nPyV690l2Et3getVtdujvAEyV59jYvk/09gnRxfNLmD9GoBna4QFeBHibexx0AHe41nHnH9zudkwBeIEnZp0LHgd0AFfxgWk/NSxPxmOPDuAcPvDMTw3Lk/HYowM4iY8Sn/kYlifjsUcHUB0tAOnV4gwALxFTw+dJB8DvTt0b1NSwPM250wF8wMfuM7M9KSxPxmOPDmCXa+/1R6LHL7odUwBe4InZ44LHAR3AT6672Li3TXSNXxo/fyU6OMCesoBmaIcHeBHgDR6j3ORy/VlZcsFTFubEjbMLFyqmlHYnoX9fmZNmP8z2eI7p/wE9a//e/J1ene8BNdECkF4tLQDp1dICkF4tLQDp1dICkF4tLQDp1dICkF4tLQDp1dICkF4tLQDp1dICkF4tLQDp1RINoOTFEinaQwEUv1jCtyjCJhRA8YslfIsibEIBFL1YIrQowiYUQHGLJZZdFOEDCwtK/O0ANGcvivCBJeaPuPALDNdg/1NBI7Qm/EqE6C/Ybe2Z5exPbAAAAABJRU5ErkJggg==",
};

/**
 * Class for Extension blocks
 * @constructor
 */
class Extension {
    constructor() {
        const runtime = Scratch.vm.runtime;
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * @type {HTMLDivElement}
         */
        this.mainContainer = null;
        /**
         * @type {HTMLCanvasElement}
         */
        this.mainCanvas = null;
        /**
         * canvas context
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = null;

        this.initialize();

        this.snowParticles = {};
        this.lights = {};
        // PenguinMod-only: RUNTIME_STEP_START doesn't exist elsewhere; BEFORE_EXECUTE fires right after it each frame.
        this.runtime.on('BEFORE_EXECUTE', () => {
            const viewBox = this.mainContainer.getBoundingClientRect();
            for (const particleId in this.snowParticles) {
                const particle = this.snowParticles[particleId];
                const element = particle.element;
                element.style.left = `calc(${particle.origin}% + ${particle.x}px)`;
                particle.x -= 3;
                const y = Cast.toNumber(element.style.top.replace('px', '')) + particle.speed;
                element.style.top = `${y}px`;
                if (element.getBoundingClientRect().right < 0 || y > viewBox.height) {
                    element.remove();
                    delete this.snowParticles[particleId];
                }
            }
            this.drawLightBackground();
        });
        this.runtime.on('PROJECT_STOP_ALL', () => {
            this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
            this.clearSnow();
            this.removeLights();
        });
    }

    initialize() {
        const mainContainer = document.body.appendChild(document.createElement("div"));
        mainContainer.style = 'position: absolute;'
            + 'left: 0; top: 0; width: 100%; height: 100%;'
            + 'pointer-events: none; overflow: hidden;'
            + 'z-index: 1000009;';
        this.mainContainer = mainContainer;
        const mainCanvas = mainContainer.appendChild(document.createElement("canvas"));
        mainCanvas.style = 'position: absolute;'
            + 'left: 0; top: 0; width: 100%; height: 100%;'
            + 'pointer-events: none; background: none;'
            + 'border: 0; margin: 0; padding: 0;'
            + 'z-index: 999999;';
        this.mainCanvas = mainCanvas;
        mainCanvas.width = 1280;
        mainCanvas.height = 720;
        const canvasContext = mainCanvas.getContext('2d');
        this.ctx = canvasContext;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgChristmas',
            name: 'Christmas',
            color1: '#ff0000',
            color2: '#00ff00',
            blockIconURI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA3sSURBVHhe7V0LcFRXGT6bJcCGNCEJSUjIEFqg0srY1ulDkL5g2lF8UGWqw4ilU3Wkgnbw2ZahdjTO6ECtTgE7tZbYQaGK1FHTqkPaWibaWpyxU6pQLJUAhTwIySaUZHeT4/edvUvWNMnuvdm7e+7e802+vY/du9l7vv/8/3/OvfccYWBgYGBgYGBgYGBgYOAnBKxlNnEJeD04S20JcRLcDx5VWwZ5iQJwFfgqKMcg3+Nn+FmDLCEbHqAK/DV4AzfKysrEsmXLRH19PTfFsWPHRHNzszh79qzaBl4Ebwfb1ZaBp0E3/xYoa2trZWNjo4xGo3IkuG/Hjh3qM/ysdUwdaOBhTAVfAeW1114rT58+bck9NviZRYsWJYzgH2AINPAovgnKefPmyc7OTkvi1Ojq6lLH8FjwXn6RgfdQBDKoy3379lnSpg8ew2Ot7+B3GXgMHwflddddZ0lqHzyW32F9l4FLcKvJdQtfVqxYoTacIOnYL4L3gD8Afw7+CTwAHgKPg11gJ3jK4r/BF8Dd4MPgWnAJOA00yBKeAeWePXus+mwfPJbfMR6ngGhjXmA5ONrnLMZAJpYPgbeCk0Hfwy0PoAq3uLhYbThB4ti5EO5HEPBnWO4TIvI69h3D8owQ58NYtmE7QbgB2YH9cAHyb/h8oxDR+/GZ24QYqsX7ONn3Y/FVkF6Eh+BrxY1gLnpE8xpPgfKJJ56w6rN98Fh+x3oh+rEiM8EjMIrtMAhU/wi9B7/fIsMG/pVwbrEehVsegDFa7N/PLn5nSBy7VIhCtZIBzBMieDe+D9W/EMnC4GMwiKuxRCEswNuPgOyA2gSWggYTwHtAWVZWJs+ePWvV6fTBY3gsaylcfSxRg93iywgVd+H/JHkFJpUbQOwycAqEbCE3bNhgyZo+eAyP/XwWxE/mUfy/z/2/IbwBLgcNHIAJVzQQCMidO3da0qbGrl27JI+5CIlba5YNIMFX8X8/BCI0YFPxaZB5pIFNrANlQUGBbGhokJFIxJL53eB7/EwwGJQs+D/mSPxk7oUBXwJD5DmA3SCckoFdfAscBOX8+fPlli1b5MGDB2U4HFbkOvfxPX4GafjQHg3ET7AXv+ceGEJSWPg9WA0a2MCnQWUEY5G1/hYI/0+NxE/mX/G75g6fA/sQECUM7OD7IAtPwq321qBAyUVCDDyAgv07allygevIPngDNCMTuQFDA7unJ4EGaYC9gwdB+aSmtTxdPgVjLRnODZrBStAgDXwQHEIAHQyDIwvWS3wTv/9yGDLOB5viv+CVoEEaUN3E3/O4FyAZEm6HN+D5gMgXhfPLnz4CewljM1CDejzuBUjEgSEas5UXMEn8Ek/SKwhay2ziDHjpO0JcUYECW+zx28AD+Lse54BwMPgMyhPu4CPWW3+xlgajgL2E8jIUGqrM0Mha5VUiG4yxB5PnBm4Fc1HBPIMWkIXm+TCQzJeEiJQNGwHvSsrY1cx8w2dBucoD7X+7RAthaN6wEfChGNNXMAp4t28YLlPmQzI4kq0wgPnDRrALNOFgFDwJyl/kQZNwNB6DAcwdNgLe0GqMYATU7eOfylMDIN8CYQRYVXwMNPcfJoGPj/Uxcz6Xx0bAnCApMXyQJ24wjN+CEm3ovEsGk/kKzs9qIpJ38MR1gA6dMH/mC6+o5DOuRkvgN1hOiYeAn4I3c7+BdQPpVXkcApK5VYgBq9uYTzTxbmQD4ATvuGn3iRHch2Yvzhmr4jBobkEH2E7O+zwgQXZ/o/mTuJTMHChnLQNdLsS8zBc+uOcHoNADjeCl8YSQl5C/pt7wMRaDEiWRdz2C45H3P06LG0EEvIYF4VdwKJjoTJ8ZAPkTGIGVFB4BffdsYjKOsCDOZPBhUK9w5XBSCHvwL5pAusW8uT8gXbbBC1TFjYDhgGMXZA26JIEEn8MTjItqy0eA+MGtEJ/JITYfBbM2LpJOBvAmX7p9eu38dpw3B7LA6sVg1q4X6GQAfNqGIzX0qy0f4mGEA2SBiApqTKT5aqfL0MkA1NCw8AC8QuhLzEYouC/uBfgQzWa102XoZAAdfBlQq/4Fqn4AMYBegB1Erl8w0skA1GjRh4Q4r7Z8imnQpCHuBYgfgq5qpJMBKOGjev2mnGAVyoBjF2GVj5vx5lnXoF1hJ0zfz+DDJklV/37QtXsJdTIAdZL4QYx/vsf1KA8kAPQCl4KcSMMV6GQAamh4pL/GACw8AFoCoXHgjlY6GcB0viwwcwRcwA3wAjfGo+LlIGdRyTh0MoAqvlhj8RhY4KiVFr5uLTMKnQxgNl8u8eG1gPFwExLC98a9ABoGaoCNjEInA1Bdn3NczHi9CLYI7hluHH3FWmYMOhnAFXy5Rq/fpAXYL1ARN4JPghmdTEuXwuZl0GsQ/9Xw8GqPwQUUQ6c747kRr5TerXbmGZjlStR+X9wV7IRvoWJYCTJnWs3YJXNdPMCH+cKER20ZvAvMjRbFO4Y4ZnHGBqnUxQBu4wsCnOkJHgec/MjCXdZywtChxrGr81A9xIebK2DWG99tMBLnUEacipUDamDBZHDC0+vq4AE4K1iAJm3EHx+8VPyZeB7AcYew6n2w+7eHyc0JJDnJSY/h6GxRV8yVEXBa3gkj1x6AHRsld8ClwbWZDqA0gEQwiHDJEMCewQnfN5jLQq8Ad6P2T90Niy7TJyHVGgyTfK78xXi45NxGnh2Qchsokdmatr9N/gtlhtqCVTXdnSdB96XGC24DR56gYWpeGQ8DWI13oTtFLtwue3x3gMHv4gSqjOt3hE/ExSdWWkvPYAsob4IHgAn77jnATBG+PxEGOJuuZ/AxcIizbRw1rn/CfN9wGLiMhesE2XS/vOGjEf8w8Dh++MXG9U8YXgoDfNzrJVCuM1l/xvjacKeQ1qPrsL36S1Ai9Y/1m7ifSQ7Vo0xZtuAc0Day4Ya/Da6ahx/5O6ygCWD6+zOHQJLvV1dUdcNqcIhDpHI+3hHWa5gBvjjsAV5ggQMcdzDtG0bcrI0fBffCxRQ+CwO41SR9jhEWor8Dog6A/8F6O5YR8A2st6Jcn44/Tk4jYE7AdY44dgBMCbcM4EbwWSgeelSIyBfiP8rAAgWFiIUQMThS0E5r/RDWz2CJ6j2JHf4275ThlPeod6nhhgGwm7cZ4pdsgUVu8MGcOaMIqtYpKGpuIapl0BK0EIIG7Qg6adKkvvLy8ujs2bNDFRUVMTBaV1cXmjFjRgyM1tbWhiorK2NVVVXRtWvXiqampjIcdifICSpSItMGcBX4HMSf/h2c40aPun23BS0rK4vW19cXUUyKC0GLKCaEjNbU1BRxSUGrq6uLJk+ezK7ztLB+/frz27Zt46N13wDZ45oSmTQAXpRgza9g2s8HG3WBLoKCRVMA69CMo6GhIbpp0yZ6XE5qfa/amQKZMgAlPkjx5YPu5RYKPZZwFPGIJShFPIx1iDdRQc9R0LFcLgQNWWK6LqhdbN++Pbxu3boSrPJiW1o3jmZCqAvi4z8OPg63jy+19b3pCMrRwyjooDuCxlhL4XJDOglqF3v37j2/cuVKhoA/gLzukhITNQDOAMoZPyq+DE1+jO+j+G4KGgwGlaBwuUpQy+WqRCjfBLWLlpaW6JIlSxgCOPr6B9TOFLBrAJzlaybI+fKrQY5fo57rnyNEH9qpoUwKytqayHITgk6dOtU3gtrF4cOHwwsWLGAIOArOVTtTwK4BcDBH9Rz/WICg70DQCF0uauQgBI0YQbOD7u7u8yh7hgBOZU9DSAm7BvAauHD16tXnFy5cKCFwxHK5gxA0YgTNPQoKCqJSSoYBjjeccsg9uwbwHHhzc3NzbOnSpWY+XA0xffr0cE9PD2t/Pdiqdo4Dux01yOeEePvtt309mKPOQIhN9LzOsJbjwq4BILnHS4daGGgIGEDCM4+bqyVg1wCY4Iuuri4zkpemKC0tTXhnttRSwlEIOHHihAkBmgJJeSIEuGIAyve3t7fbTR4NsgQYgKshQBkAskzfjumvO8rLy90PAa2trSYEaIqZM2eaEOBnVFdXJ574dsUA+GTy4MDAwLRYLJZud79BFlFZWelqCKDoZ8BAR0fHObXHQCtUVVUl7r90xQAIEwY0RmlpaSgQCESwyu7glMm6YwPo7Ow0LQFNUVJSknYYcGIA5nqA5pg1a1baYcCxB0AOYEKApqipqUm7JeBERN70++DGjRtjDQ0N5pJwltHT03Oura0tihBcdPr06SjXu7q6ik6dOhUlu7u7iw4cOBAIh8PsD+AdWzvVgWPAiQFwtOrta9as6W1sbLwovsvAKdIRFOE2Svb29hZJKe08ZcVZRh6Kr44OJwbAuWt+tXz58r6mpqbi+C6DBFDz+iBiDIKGKCgY49VTS9DYBAUl3gGZhzEUk8nrI7dPgeNOxurEAG4Cn1+8eHGspaUl70NAKkFRg0MnT56koDEIGoKgdm+JY3/KWAKOtp3R/hcnBsCx/V+vq6vrPX78uOdCAERSLhdJbIjCUlQKyhqZYUHHq6XJ+1ijcwYnBsDLjG1Tpkzp6+/vz3kIGEtQislaCpdLcWMUGLU57wW1CycGwCYGe5oCkUhEFhYWOmlKjgkI2tfe3k5BiygshTSCugcnBkCwcCrhKntra2vHDQOjCKqyXNZUisikiPvodiEokyK7gvaByYKNJPfzVjZfCGoXTg2AgxNevnnz5jPFxcUFORA0ed30SE4ATg3geZCtgXRgBNUYTg3gEZDj0CQLmSxi8roR1MDAwMDAwMDAwMDAwMDAwCDnEOJ/4jw7p10X2XAAAAAASUVORK5CYII=",
            blocks: [
                {
                    opcode: 'snow',
                    text: 'snow',
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'clearSnow',
                    text: 'clear snow',
                    blockType: BlockType.COMMAND
                },
                // {
                //     opcode: 'addPresent',
                //     text: 'add present',
                //     blockType: BlockType.COMMAND
                // },
                // {
                //     opcode: 'removePresents',
                //     text: 'remove all presents',
                //     blockType: BlockType.COMMAND
                // },
                {
                    opcode: 'addLight',
                    text: 'add light',
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'removeLights',
                    text: 'remove all lights',
                    blockType: BlockType.COMMAND
                },
            ]
        };
    }

    snow() {
        const snowImage = this.mainContainer.appendChild(document.createElement("img"));
        const size = Math.round(8 + (Math.random() * 16));
        const opacity = 0.5 + (Math.random() / 2);
        const originX = Math.random() * 150;
        snowImage.style = 'position: absolute;'
            + `left: ${originX}%; top: -${size}px; width: ${size}px; height: ${size}px;`
            + `pointer-events: none; opacity: ${opacity};`
            + 'z-index: 1000008;';
        snowImage.src = Textures.Snow;
        const id = uid();
        this.snowParticles[id] = {
            element: snowImage,
            origin: originX,
            x: 0,
            size: size,
            speed: 2 + Math.random() * 6
        };
    }
    removeLights() {
        this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        for (const particleId in this.lights) {
            const particle = this.lights[particleId];
            const element = particle.element;
            element.remove();
            delete this.lights[particleId];
        }
    }
    addLight() {
        const lightImage = this.mainContainer.appendChild(document.createElement("img"));
        const viewBox = this.mainContainer.getBoundingClientRect();
        const originX = Math.random() * viewBox.width;
        const originY = Math.random() * viewBox.height;
        const direction = Math.random() * 360;
        lightImage.style = 'position: absolute;'
            + `left: 0; top: 0; width: 70px; height: 70px;`
            + `transform: translate(${originX}px, ${originY}px) rotate(${direction}deg);`
            + `transform-origin: 34px 41px; pointer-events: none;`
            + 'z-index: 1000005;';
        lightImage.src = Textures.Light;
        const id = uid();
        this.lights[id] = {
            element: lightImage,
            x: originX,
            y: originY
        };
        this.drawLightBackground();
        let filterGreen = false;
        setInterval(() => {
            lightImage.style.filter = filterGreen ? 'hue-rotate(90deg) brightness(1.5)' : '';
            filterGreen = !filterGreen;
        }, 700);
    }
    drawLightBackground() {
        const canvas = this.mainCanvas;
        const viewBox = canvas.getBoundingClientRect();
        const ctx = this.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#3D5C3A';
        ctx.lineWidth = 1;

        ctx.moveTo(0, 70);
        ctx.beginPath();
        for (const particleId in this.lights) {
            const particle = this.lights[particleId];
            ctx.lineTo(((particle.x + 34) / viewBox.width) * 1280, ((particle.y + 41) / viewBox.height) * 720);
            ctx.moveTo(((particle.x + 34) / viewBox.width) * 1280, ((particle.y + 41) / viewBox.height) * 720);
            ctx.stroke();
        }
    }

    clearSnow() {
        for (const particleId in this.snowParticles) {
            const particle = this.snowParticles[particleId];
            const element = particle.element;
            element.remove();
            delete this.snowParticles[particleId];
        }
    }
    addPresent() {

    }
}

Scratch.extensions.register(new Extension());
})(Scratch);
