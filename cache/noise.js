(function (Scratch) {
    "use strict";

class PerlinNoise {

    /// perlin noise (raw)
    ///
    /// - Parameters:
    ///     - x: The *x* component of the vector.
    ///     - y: The *y* component of the vector.
    ///     - z: The *z* component of the vector.
    /// - Returns: noise value (-1.0 ≦ noise ≦ +1.0)
    noise(x, y, z) {
        const xi = Math.floor(x) & 255
        const yi = Math.floor(y) & 255
        const zi = Math.floor(z) & 255
        const xf = x - Math.floor(x)
        const yf = y - Math.floor(y)
        const zf = z - Math.floor(z)
        const u = this.fade(xf)
        const v = this.fade(yf)
        const w = this.fade(zf)
        const aaa = this.p[this.p[this.p[xi    ] + yi    ] + zi    ]
        const aba = this.p[this.p[this.p[xi    ] + yi + 1] + zi    ]
        const aab = this.p[this.p[this.p[xi    ] + yi    ] + zi + 1]
        const abb = this.p[this.p[this.p[xi    ] + yi + 1] + zi + 1]
        const baa = this.p[this.p[this.p[xi + 1] + yi    ] + zi    ]
        const bba = this.p[this.p[this.p[xi + 1] + yi + 1] + zi    ]
        const bab = this.p[this.p[this.p[xi + 1] + yi    ] + zi + 1]
        const bbb = this.p[this.p[this.p[xi + 1] + yi + 1] + zi + 1]
        return this.lerp(w,
                    this.lerp(v,
                         this.lerp(u,
                              this.grad(aaa, xf,     yf,     zf),
                              this.grad(baa, xf - 1, yf,     zf)),
                         this.lerp(u,
                              this.grad(aba, xf,     yf - 1, zf),
                              this.grad(bba, xf - 1, yf - 1, zf))),
                    this.lerp(v,
                         this.lerp(u,
                              this.grad(aab, xf,     yf,     zf - 1),
                              this.grad(bab, xf - 1, yf,     zf - 1)),
                         this.lerp(u,
                              this.grad(abb, xf,     yf - 1, zf - 1),
                              this.grad(bbb, xf - 1, yf - 1, zf - 1))))
    }
    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t, a, b) { return a + t * (b - a); }
    grad(hash, x, y, z) {
        switch (hash & 15) {
        case 0: return  x + y;
        case 1: return -x + y;
        case 2: return  x - y;
        case 3: return -x - y;
        case 4: return  x + z;
        case 5: return -x + z;
        case 6: return  x - z;
        case 7: return -x - z;
        case 8: return  y + z;
        case 9: return -y + z;
        case 10: return  y - z;
        case 11: return -y - z;
        case 12: return  y + x;
        case 13: return -y + z;
        case 14: return  y - x;
        case 15: return -y - z;
        default: return 0; // never happens
        }
    }

    constructor() {
        const permutation = [
            151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
            140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
            247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
            57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68,
            175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111,
            229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
            102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
            89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109,
            198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147,
            118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
            189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70,
            221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108,
            110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251,
            34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235,
            249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204,
            176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114,
            67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
        ];
        this.p = permutation.concat(permutation);
    }
}

class Scratch3Noise {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            "id": 'noise',
            "name": 'Noise',
            "color1": '#8a8a8a',
            "color2": '#737373',
            "color3": '#a8a8a8',
            blocks: [
                {
                    opcode: 'noise',
                    text: 'noise [X] [Y] [Z]',
                    blockType: "reporter",
                    arguments: {
                        X: {
                            type: "number",
                            defaultValue: '0.0'
                        },
                        Y: {
                            type: "number",
                            defaultValue: '0.0'
                        },
                        Z: {
                            type: "number",
                            defaultValue: '0.0'
                        }
                    }
                },
                {
                    opcode: 'octaveNoise',
                    text: 'octave noise [X] [Y] [Z] [OCTAVES] [PERSISTENCE]',
                    blockType: "reporter",
                    arguments: {
                        X: {
                            type: "number",
                            defaultValue: '0.0'
                        },
                        Y: {
                            type: "number",
                            defaultValue: '0.0'
                        },
                        Z: {
                            type: "number",
                            defaultValue: '0.0'
                        },
                        OCTAVES: {
                            type: "number",
                            defaultValue: '4'
                        },
                        PERSISTENCE: {
                            type: "number",
                            defaultValue: '0.5'
                        }
                    }
                }
            ],
        };
    }

    noise (args) {
        const x = Number(args.X);
        const y = Number(args.Y);
        const z = Number(args.Z);
        return this.normalized(x, y, z);
    }

    octaveNoise (args) {
        const x = Number(args.X);
        const y = Number(args.Y);
        const z = Number(args.Z);
        const octaves = Number(args.OCTAVES);
        const persistence = Number(args.PERSISTENCE);
        let total = 0.0;
        let frequency = 1.0;
        let amplitude = 1.0;
        let maxValue = 0.0;  // Used for normalizing result to 0.0 - 1.0
        for (let i = 0; i < octaves; ++i) {
            total += this.normalized(x * frequency, y * frequency, z * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        return total / maxValue;
    }

    normalized(x, y, z) {
        let perlin = this.perlin;
        if (perlin === undefined) {
            perlin = new PerlinNoise();
            this.perlin = perlin;
        }
        const value = perlin.noise(x, y, z); // [-1, 1]
        return (value + 1.0) / 2.0; // [0, 1]
    }
}

    Scratch.extensions.register(new Scratch3Noise());
})(Scratch);
