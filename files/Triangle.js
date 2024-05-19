// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function(Scratch) {

    const vm = Scratch.vm,
    runtime = vm.runtime;
  
    class TriangleRenderer {

      getInfo() {
        return {
          id: 'TriangleRenderer',
          name: 'Triangle Drawer',
          color1: '#046973',
          blocks: [{
            opcode: 'triangle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'draw triangle ([p0],[p1]) ([p2],[p3]) ([p4],[p5]) thickness: [p6]',
            arguments: {
              p0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
              p1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
              p2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
              p3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
              p4: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
              p5: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
              p6: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
            },
          }, ]
        };
      }

      triangle({p0,p1,p2,p3,p4,p5,p6}) {
        const target = vm.editingTarget
        let tri2 = Math.sqrt(Math.pow(+p2 - +p4) + Math.pow(+p3 - +p5));
        let tri3 = Math.sqrt(Math.pow(+p0 - +p4) + Math.pow(+p1 - +p5));
        let tri4 = Math.sqrt(Math.pow(+p0 - +p2) + Math.pow(+p1 - +p3));
        let tri5;
        let tri6;
        let tri7;
        let tri8;
        let tri1 = (tri2 + tri3 + tri4) / 2;
        let tri0 = 2 * Math.sqrt(((tri1 - tri2) * (tri1 - tri3) * (tri1 - tri4)) / tri1);
        tri1 = (tri1 || 0) + (tri1 || 0);
        target.setXY((((tri2 * +p0) + (tri3 * +p2) + (tri4 * +p4)) / tri1), (((tri2 * +p1) + (tri3 * +p3) + (tri4 * +p5)) / tri1));
        runtime.ext_pen._setPenSizeTo(tri0, target);
        runtime.ext_pen._penDown(target);
          if (!(tri0 <= 0)) {
            if (tri3 < tri2 || tri4, tri2) {
          if (tri4 < tri3) {
          tri1 = target.x - +p4;
          tri2 = target.y - +p5;
        } else {
          tri1 = target.x - +p2;
          tri2 = target.y - +p3;
        }
      } else {
        tri1 = target.x - +p0;
        tri2 = target.y - +p1;
      }
      tri1 = (Math.sqrt(Math.pow(+tri1) + Math.pow(+tri2))) / (+tri0 / 2);
      tri8 = ((tri1 * +p6) / (tri1 - 1)) + 0.25;
      tri1 = 0.5 - (0.5 / tri1);
      tri2 = (target.x - +p0) / +tri0;
      tri3 = (target.y - +p1) / +tri0;
      tri4 = (target.x - +p2) / +tri0;
      tri5 = (target.y - +p3) / +tri0;
      tri6 = (target.x - +p4) / +tri0;
      tri7 = (target.y - +p5) / +tri0;
      while (!(tri0 < tri8)) {
        tri0 = +tri1 * +tri0;
        runtime.ext_pen._setPenSizeTo(tri0 + 0.5, target);
        target.setXY(+p0 + (tri0 * +tri2), +p1 + (tri0 * +tri3));
        target.setXY(+p2 + (tri0 * +tri4), +p3 + (tri0 * +tri5));
        target.setXY(+p4 + (tri0 * +tri6), +p5 + (tri0 * +tri7));
        target.setXY(+p0 + (tri0 * +tri2), +p1 + (tri0 * +tri3));
      }
    }
    runtime.ext_pen._setPenSizeTo(+p6, target);
    target.setXY(+p0, +p1);
    target.setXY(+p2, +p3);
    target.setXY(+p4, +p5);
    target.setXY(+p0, +p1);
    runtime.ext_pen._penUp(target);
  }
}

Scratch.extensions.register(new TriangleRenderer());
})(Scratch);
