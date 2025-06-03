// Name: Blur Image
// Author: Mistium
// Description: High-performance WebGL-based stack blur with adaptive downscaling for optimal performance
// License: MPL-2.0

class BlurImageExtension {
  constructor() {
    this._cache = new Map();
    this._cacheLimit = 20;
    this._imageCache = new Map();
    this._queue = [];
    this._isProcessing = false;
    this._downscalingMode = 'auto'; // 'auto', 'aggressive', 'conservative', 'disabled'
    
    // Initialize WebGL blur
    try {
      this._webglBlur = new WebGLBlur();
    } catch (e) {
      console.warn('WebGL not available, extension will not work:', e);
      this._webglBlur = null;
    }
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
        },
        {
          opcode: 'setDownscalingMode',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set downscaling mode to [MODE]',
          arguments: {
            MODE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'downscalingModes'
            }
          }
        }
      ],
      menus: {
        downscalingModes: {
          acceptReporters: true,
          items: [
            'auto',
            'aggressive',
            'conservative',
            'disabled'
          ]
        }
      }
    };
  }

  setDownscalingMode(args) {
    this._downscalingMode = args.MODE;
    // Clear cache when mode changes to ensure consistent results
    this._cache.clear();
  }

  blurImage(args) {
    if (!this._webglBlur) {
      // Fallback to original implementation if WebGL not available
      return this._fallbackBlur(args);
    }

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
        // Create canvas from image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        
        // Apply WebGL blur with custom scaling
        this._webglBlur.setDownscalingMode(this._downscalingMode);
        const blurredCanvas = this._webglBlur.blur(canvas, blur);
        
        // Convert to data URI with optimal quality
        const scaleFactor = this._webglBlur.getAdaptiveScaleFactor(blur);
        const quality = this._getOptimalQuality(blurredCanvas.width, blurredCanvas.height);
        const format = blur > 15 ? "image/jpeg" : "image/png";
        const result = blurredCanvas.toDataURL(format, quality);
        
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

  _getOptimalQuality(width, height) {
    const pixelCount = width * height;
    if (pixelCount > 1000000) return 0.7;
    if (pixelCount > 500000) return 0.8;
    return 0.9;
  }

  _addToCache(key, value) {
    if (this._cache.size >= this._cacheLimit) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
    
    this._cache.set(key, value);
  }

  _fallbackBlur(args) {
    // Original CPU-based implementation as fallback
    const dataUri = args.URL;
    const blur = Math.max(0, parseInt(args.BLUR) || 0);
    
    if (blur === 0) {
      return Promise.resolve(dataUri);
    }
    
    const cacheKey = `${dataUri}_${blur}_${this._downscalingMode}`;
    
    if (this._cache.has(cacheKey)) {
      return Promise.resolve(this._cache.get(cacheKey));
    }
    
    return new Promise((resolve, reject) => {
      this._loadImage(dataUri)
        .then(image => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
          
          const scaleFactor = this._getScaleFactorForMode(blur);
          
          canvas.width = image.width * scaleFactor;
          canvas.height = image.height * scaleFactor;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (blur <= 3) {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            this._applyBoxBlur(ctx, canvas, blur);
          } else {
            ctx.filter = `blur(${blur}px)`;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            ctx.filter = "none";
          }
          
          const quality = this._getOptimalQuality(canvas.width, canvas.height);
          const format = blur > 5 ? "image/jpeg" : "image/png";
          const result = canvas.toDataURL(format, quality);
          
          this._addToCache(cacheKey, result);
          resolve(result);
        })
        .catch(error => {
          reject(new Error(`Failed to process image: ${error.message}`));
        });
    });
  }

  _getScaleFactorForMode(blur) {
    switch (this._downscalingMode) {
      case 'disabled':
        return 1.0;
      case 'conservative':
        if (blur > 30) return 0.5;
        if (blur > 15) return 0.75;
        return 1.0;
      case 'aggressive':
        if (blur > 15) return 0.25;
        if (blur > 8) return 0.4;
        if (blur > 5) return 0.6;
        return 0.8;
      case 'auto':
      default:
        if (blur > 20) return 0.25;
        if (blur > 10) return 0.5;
        if (blur > 5) return 0.75;
        return 1.0;
    }
  }

  _applyBoxBlur(ctx, canvas, radius) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
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
    
    ctx.putImageData(imageData, 0, 0);
  }

  _dispose() {
    this._cache.clear();
    this._imageCache.clear();
    this._queue = [];
    if (this._webglBlur) {
      // Cleanup WebGL resources
      this._webglBlur = null;
    }
  }
}

class WebGLBlur {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }
    this._downscalingMode = 'auto';
    this.setupShaders();
  }
  
  setDownscalingMode(mode) {
    this._downscalingMode = mode;
  }
  
  setupShaders() {
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      uniform vec2 u_direction;
      uniform float u_radius;
      varying vec2 v_texCoord;
      
      void main() {
        vec4 color = vec4(0.0);
        vec2 offset = u_direction / u_resolution;
        float totalWeight = 0.0;
        
        for (float i = -50.0; i <= 50.0; i += 1.0) {
          if (abs(i) > u_radius) continue;
          
          vec2 coord = v_texCoord + i * offset;
          coord = clamp(coord, vec2(0.0), vec2(1.0));
          
          vec4 sample = texture2D(u_texture, coord);
          color += sample;
          totalWeight += 1.0;
        }
        
        if (totalWeight > 0.0) {
          gl_FragColor = color / totalWeight;
        } else {
          gl_FragColor = texture2D(u_texture, v_texCoord);
        }
      }
    `;
    
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    this.locations = {
      position: this.gl.getAttribLocation(this.program, 'a_position'),
      texCoord: this.gl.getAttribLocation(this.program, 'a_texCoord'),
      texture: this.gl.getUniformLocation(this.program, 'u_texture'),
      resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
      direction: this.gl.getUniformLocation(this.program, 'u_direction'),
      radius: this.gl.getUniformLocation(this.program, 'u_radius')
    };
    
    this.setupBuffers();
  }
  
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  createProgram(vertexSource, fragmentSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
    
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      return null;
    }
    
    return program;
  }
  
  setupBuffers() {
    const positions = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1
    ]);
    
    const texCoords = new Float32Array([
      0, 0,  1, 0,  0, 1,
      0, 1,  1, 0,  1, 1
    ]);
    
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    
    this.texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);
  }
  
  getAdaptiveScaleFactor(radius) {
    switch (this._downscalingMode) {
      case 'disabled':
        return 1.0;
      case 'conservative':
        if (radius > 30) return 0.5;
        if (radius > 15) return 0.75;
        return 1.0;
      case 'aggressive':
        if (radius > 15) return 0.25;
        if (radius > 8) return 0.4;
        if (radius > 5) return 0.6;
        return 0.8;
      case 'auto':
      default:
        if (radius <= 5) return 1.0;
        if (radius <= 10) return 0.8;
        if (radius <= 20) return 0.6;
        if (radius <= 30) return 0.4;
        return 0.25;
    }
  }
  
  blur(canvas, radius) {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    
    const scaleFactor = this.getAdaptiveScaleFactor(radius);
    
    let workingCanvas = canvas;
    let workingRadius = radius;
    
    if (scaleFactor < 1.0) {
      const scaledWidth = Math.floor(originalWidth * scaleFactor);
      const scaledHeight = Math.floor(originalHeight * scaleFactor);
      workingRadius = Math.floor(radius * scaleFactor);
      
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = scaledWidth;
      tempCanvas.height = scaledHeight;
      
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);
      workingCanvas = tempCanvas;
    }
    
    const width = workingCanvas.width;
    const height = workingCanvas.height;
    
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    
    const texture = this.gl.createTexture();
    const framebuffer = this.gl.createFramebuffer();
    const tempTexture = this.gl.createTexture();
    
    // Setup input texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, workingCanvas);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    
    // Setup temp texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, tempTexture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    
    this.gl.useProgram(this.program);
    
    // Horizontal pass
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, tempTexture, 0);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.uniform1i(this.locations.texture, 0);
    this.gl.uniform2f(this.locations.resolution, width, height);
    this.gl.uniform2f(this.locations.direction, 1.0, 0.0);
    this.gl.uniform1f(this.locations.radius, workingRadius);
    
    this.drawQuad();
    
    // Vertical pass
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, tempTexture);
    this.gl.uniform2f(this.locations.direction, 0.0, 1.0);
    
    this.drawQuad();
    
    // Scale back up if needed
    if (scaleFactor < 1.0) {
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d');
      finalCanvas.width = originalWidth;
      finalCanvas.height = originalHeight;
      
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';
      finalCtx.scale(1, -1);
      finalCtx.translate(0, -originalHeight);
      finalCtx.drawImage(this.canvas, 0, 0, originalWidth, originalHeight);
      
      // Cleanup
      this.gl.deleteTexture(texture);
      this.gl.deleteTexture(tempTexture);
      this.gl.deleteFramebuffer(framebuffer);
      
      return finalCanvas;
    }
    
    // Create flipped canvas for output
    const flippedCanvas = document.createElement('canvas');
    const flippedCtx = flippedCanvas.getContext('2d');
    flippedCanvas.width = this.canvas.width;
    flippedCanvas.height = this.canvas.height;
    
    flippedCtx.imageSmoothingEnabled = true;
    flippedCtx.imageSmoothingQuality = 'high';
    flippedCtx.scale(1, -1);
    flippedCtx.translate(0, -this.canvas.height);
    flippedCtx.drawImage(this.canvas, 0, 0);
    
    // Cleanup
    this.gl.deleteTexture(texture);
    this.gl.deleteTexture(tempTexture);
    this.gl.deleteFramebuffer(framebuffer);
    
    return flippedCanvas;
  }
  
  drawQuad() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.locations.position);
    this.gl.vertexAttribPointer(this.locations.position, 2, this.gl.FLOAT, false, 0, 0);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.enableVertexAttribArray(this.locations.texCoord);
    this.gl.vertexAttribPointer(this.locations.texCoord, 2, this.gl.FLOAT, false, 0, 0);
    
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}

Scratch.extensions.register(new BlurImageExtension());
