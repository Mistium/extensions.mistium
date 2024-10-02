class BlurImageExtension {
  getInfo() {
    return {
      id: 'blurImage',
      name: 'Blur Image',
      blocks: [
        {
          opcode: 'blurImage',
          blockType: Scratch.BlockType.REPORTER,
          text: 'blur image [URL] by [BLUR] pixels',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com/image.png'
            },
            BLUR: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 5
            }
          }
        }
      ]
    };
  }

  blurImage(args) {
    const dataUri = args.URL;
    const blur = args.BLUR;
    return new Promise((resolve, reject) => {
      var image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = function() {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.filter = "blur(" + blur + "px)";
        ctx.drawImage(image, 0, 0, image.width, image.height);
        resolve(canvas.toDataURL());
      };
      image.onerror = function() {
        reject(new Error("Failed to load image from URL: " + dataUri));
      };
      image.src = dataUri;
    });
  }
}

Scratch.extensions.register(new BlurImageExtension());
