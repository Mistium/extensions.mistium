// Name: Blur Image
// Author: Mistium
// Description: A simple extension that just blurs images from urls and data uris as fast as i could make it blur them!!!!

// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

class BlurImageExtension {
  constructor() {
    this._cache = new Map();
    this._cacheLimit = 20;
    this._canvas = document.createElement("canvas");
    this._ctx = this._canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    this._queue = [];
    this._isProcessing = false;
    this._imageCache = new Map();
  }

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
    const blur = Math.max(0, parseInt(args.BLUR) || 0);
    
    if (blur === 0) {
      return Promise.resolve(dataUri);
    }
    
    const cacheKey = `${dataUri}_${blur}`;
    
    if (this._cache.has(cacheKey)) {
      return Promise.resolve(this._cache.get(cacheKey));
    }
    
    return new Promise((resolve, reject) => {
      this._queue.push({
        dataUri,
        blur,
        cacheKey,
        resolve,
        reject,
        timestamp: Date.now()
      });
      
      this._processNextInQueue();
    });
  }
  
  _processNextInQueue() {
    if (this._isProcessing || this._queue.length === 0) {
      return;
    }
    
    this._isProcessing = true;
    
    this._queue.sort((a, b) => a.timestamp - b.timestamp);
    
    const task = this._queue.shift();
    const { dataUri, blur, cacheKey, resolve, reject } = task;
    
    let imagePromise;
    if (this._imageCache.has(dataUri)) {
      imagePromise = Promise.resolve(this._imageCache.get(dataUri));
    } else {
      imagePromise = this._loadImage(dataUri).then(img => {
        if (this._imageCache.size >= this._cacheLimit) {
          const oldestKey = [...this._imageCache.keys()][0];
          this._imageCache.delete(oldestKey);
        }
        this._imageCache.set(dataUri, img);
        return img;
      });
    }
    
    imagePromise
      .then(image => {
        const scaleFactor = this._getOptimalScaleFactor(blur);
        
        this._canvas.width = image.width * scaleFactor;
        this._canvas.height = image.height * scaleFactor;
        
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        
        if (blur <= 3) {
          this._ctx.drawImage(image, 0, 0, this._canvas.width, this._canvas.height);
          this._applyBoxBlur(blur);
        } else {
          this._ctx.filter = `blur(${blur}px)`;
          this._ctx.drawImage(image, 0, 0, this._canvas.width, this._canvas.height);
          this._ctx.filter = "none";
        }
        
        const quality = this._getOptimalQuality(this._canvas.width, this._canvas.height);
        const format = blur > 5 ? "image/jpeg" : "image/png";
        const result = this._canvas.toDataURL(format, quality);
        
        this._addToCache(cacheKey, result);
        
        resolve(result);
      })
      .catch(error => {
        reject(new Error(`Failed to process image: ${error.message}`));
      })
      .finally(() => {
        this._isProcessing = false;
        this._processNextInQueue();
      });
  }
  
  _loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      
      const timeout = setTimeout(() => {
        image.src = "";
        reject(new Error(`Timed out loading image from URL: ${src}`));
      }, 10000);
      
      image.onload = () => {
        clearTimeout(timeout);
        resolve(image);
      };
      
      image.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image from URL: ${src}`));
      };
      
      image.src = src;
    });
  }
  
  _getOptimalScaleFactor(blur) {
    if (blur > 20) return 0.25;
    if (blur > 10) return 0.5;
    if (blur > 5) return 0.75;
    return 1;
  }
  
  _getOptimalQuality(width, height) {
    const pixelCount = width * height;
    if (pixelCount > 1000000) return 0.7;
    if (pixelCount > 500000) return 0.8;
    return 0.9;
  }
  
  _applyBoxBlur(radius) {
    const imageData = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
    const data = imageData.data;
    const width = this._canvas.width;
    const height = this._canvas.height;
    
    const tempData = new Uint8ClampedArray(data);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        for (let i = -radius; i <= radius; i++) {
          const ix = x + i;
          if (ix >= 0 && ix < width) {
            const idx = (y * width + ix) * 4;
            r += tempData[idx];
            g += tempData[idx + 1];
            b += tempData[idx + 2];
            count++;
          }
        }
        
        const idx = (y * width + x) * 4;
        data[idx] = r / count;
        data[idx + 1] = g / count;
        data[idx + 2] = b / count;
      }
    }
    
    tempData.set(data);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        for (let j = -radius; j <= radius; j++) {
          const jy = y + j;
          if (jy >= 0 && jy < height) {
            const idx = (jy * width + x) * 4;
            r += tempData[idx];
            g += tempData[idx + 1];
            b += tempData[idx + 2];
            count++;
          }
        }
        
        const idx = (y * width + x) * 4;
        data[idx] = r / count;
        data[idx + 1] = g / count;
        data[idx + 2] = b / count;
      }
    }
    
    this._ctx.putImageData(imageData, 0, 0);
  }
  
  _addToCache(key, value) {
    if (this._cache.size >= this._cacheLimit) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
    
    this._cache.set(key, value);
  }
  
  _dispose() {
    this._cache.clear();
    this._imageCache.clear();
    this._queue = [];
    this._canvas = null;
    this._ctx = null;
  }
}

Scratch.extensions.register(new BlurImageExtension());
