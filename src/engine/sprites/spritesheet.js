import { Rect } from "../geometry";
import { Sprite, Texture, TEXTURE_STATUS } from "../renderer";

class SpriteSheet extends Sprite {
  /**
   * 
   * @param {Texture} texture 
   * @param {Rect} rect 
   */
  constructor(texture, rect, frame = new Rect(0, 0, 32, 32)) {
    super(texture, rect);
    this.frame = frame;
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
    const [framePos, frameSize] = this.frame;
    
    const spriteRect = [
      ...framePos,
      ...frameSize,
    ];

    const rect = [
      centerX + x - (width / 2),
      centerY + y - (height / 2),
      width,
      height,
    ];
    
    ctx.drawImage(this.texture.image, ...spriteRect, ...rect);
  }
}

export default SpriteSheet;