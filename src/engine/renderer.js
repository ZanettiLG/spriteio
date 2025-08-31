import { Rect } from "./geometry";
import { nextFrame as nextFrameCoroutine } from "./coroutine";

export const SPRITE_TYPE = Object.freeze({
  MAP: 1,
  SPRITE: 0,
  CHARACTER: 2,
});
import { ASSET_STATUS, Asset } from "./asset";
export class Texture extends Asset {
  /**
   * @param {string} source 
   */
  constructor(source) {
    super(source);
    this.resource = new Image();
  }

  async load() {
    this.status = ASSET_STATUS.LOADING;
    return await new Promise((resolve, reject) => {
      this.resource.onload = () => {
        this.status = ASSET_STATUS.LOADED;
        resolve();
      };
      this.resource.onerror = (error) => {
        this.status = ASSET_STATUS.ERROR;
        console.error(error);
        reject(error);
      };
      this.resource.src = this.source;
      this.resource.decode();
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
    this.rect = rect;
    this.texture = texture;
  }

  draw(ctx, center = []) {
    if(!this.texture) return;
    if(this.texture.status === ASSET_STATUS.ERROR) {
      return;
    }
    if(this.texture.status === ASSET_STATUS.UNLOADED) {
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
    
    ctx.drawImage(this.texture.resource, ...rect);
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
