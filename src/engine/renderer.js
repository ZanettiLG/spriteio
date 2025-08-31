import { Rect } from "./geometry";
import { nextFrame as nextFrameCoroutine } from "./coroutine";

export const SPRITE_TYPE = Object.freeze({
  SPRITE: 0,
  MAP: 1,
  CHARACTER: 2,
});

export const TEXTURE_STATUS = Object.freeze({
  ERROR: -1,
  LOADED: 2,
  LOADING: 1,
  UNLOADED: 0,
});

export class Texture {
  /**
   * @param {string} path 
   */
  constructor(path) {
    this.path = path;
    this.image = null;
    this.status = TEXTURE_STATUS.UNLOADED;
  }

  async load() {
    const image = new Image();
    this.image = image;
    this.status = TEXTURE_STATUS.LOADING;
    return await new Promise((resolve, reject) => {
      image.onload = () => {
        this.status = TEXTURE_STATUS.LOADED;
        resolve(image);
      };
      image.onerror = (error) => {
        this.status = TEXTURE_STATUS.ERROR;
        console.error(error);
        reject(error);
      };
      image.src = this.path;
      image.decode();
    });
  }

}

export class Sprite {
  /**
   * 
   * @param {Texture} texture 
   * @param {Rect} rect 
   */
  constructor(texture, rect) {
    console.log("sprite", texture, rect);
    this.rect = rect;
    this.texture = texture;
  }

  draw(ctx, center = []) {
    if(!this.texture) return;
    if(this.texture.status === TEXTURE_STATUS.ERROR) {
      return;
    }
    if(this.texture.status === TEXTURE_STATUS.UNLOADED) {
      this.texture.load();
      console.log("loading texture", this.texture);
      return;
    }

    const [centerX, centerY] = center;
    const [[x, y], [width, height]] = this.rect;
    
    const rect = [
      centerX + x - (width / 2),
      centerY + y - (height / 2),
      width,
      height,
    ];
    
    ctx.drawImage(this.texture.image, ...rect);
  }
}

export class Renderer {
  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {number} width 
   * @param {number} height 
   */
  constructor({canvas, width, height}) {
    this.textures = [];
    this.sprites = [];
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    canvas.width = width;
    canvas.height = height;
    this.ctx = canvas.getContext("2d");
    this.center = [width / 2, height / 2];
  }

  /**
   * 
   * @param {Sprite} sprite 
   */
  addSprite(sprite) {
    this.sprites.push(sprite);
  }

  /**
   * 
   * @param {Sprite} sprite 
   */
  removeSprite(sprite) {
    this.sprites = this.sprites.filter((s) => s !== sprite);
  }
  
  /**
   * 
   */
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sprites.forEach((sprite) => {
      sprite.draw(this.ctx, this.center);
    });
  }

  async start() {
    this.isRunning = true;
    while (this.isRunning) {
      this.update();
      await nextFrameCoroutine();
    }
  }

  stop() {
    this.isRunning = false;
  }
}
