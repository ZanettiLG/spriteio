import Rect from "./rect";
import Sprite from "./sprite";

class SpriteSheet extends Sprite {
    constructor(texture, rect = new Rect()) {
      super(texture, rect);
    }
}

export default SpriteSheet;