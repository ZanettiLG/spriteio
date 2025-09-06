import { magnitude } from "./maths";
import { Rect } from "./geometry";
import { SpriteSheet } from "./sprites";
import { AssetManager } from "./asset";
import { Texture } from "./renderer";
import Sprites from "../assets/sprites";

/**
 * @typedef {typeof LOCAL} ILOCAL
 */
export const LOCAL = Object.freeze({
  BODY: "body",
  HAIR: "hair",
  EYES: "eyes",
  SHIRT: "shirt",
  BEARD: "beard",
  PANTS: "pants",
  SHOES: "shoes",
  DRESS: "dress",
  MAKEUP: "makeup",
});

export const LOCAL_LIST = Object.values(LOCAL);

const DIRECTION_MAP = Object.freeze([
  "DOWN",
  "UP",
  "RIGHT",
  "LEFT",
]);

export const DIRECTIONS = Object.freeze(Object.fromEntries(DIRECTION_MAP.map((direction, index) => [direction, index])));

export const DEFAULT_ATTACHMENTS = Object.freeze(Object.fromEntries(LOCAL_LIST.map((type) => [type, null])));

export const loadAttachments = async (attachments=DEFAULT_ATTACHMENTS) => {
  const returnedAttachments = Object.fromEntries(await Promise.all(
    Object.entries(attachments).map(
      async ([type, value]) => {
        if (!value) {
          return [type, null];
        }
        const sprite = Sprites[value.name];
        const texture = AssetManager.load(sprite.texture, Texture);
        //console.log(texture);
        return [
          type,
          {
            ...value,
            texture,
          }
        ];
      }
    )
  ));
  return returnedAttachments;
};

/**
 * @typedef {Object} Attachment
 * @property {ILOCAL} local
 * @property {string} texture
 */

export class Character extends SpriteSheet {

  /**
   * 
   * @param {Image} image 
   * @param {Rect} rect 
   */
  constructor({attachments: {body, ...attachments} = DEFAULT_ATTACHMENTS, rect = new Rect(), speed = 1}) {
    super(body.texture, rect);
    this.speed = speed;
    this.velocity = [0, 0];
    this.animationFrame = 0;
    this.attachments = Object.fromEntries(
      Object.entries(attachments).map(
        ([local, attachment]) => [local, attachment ? new SpriteSheet(attachment.texture, rect, this.frame) : null]
      )
    );
    this.direction = DIRECTIONS.DOWN;
  }

  /**
   * 
   * @param {Attachment[]} attachment 
   */
  attach(attachment) {
    attachment.forEach((attachment) => {
      if(!this.attachments[attachment.local.toLowerCase()]) {
        this.attachments[attachment.local.toLowerCase()] = [];
      }
      this.attachments[attachment.local.toLowerCase()] = attachment;
    });
    this.attachments = this.attachments.concat(attachment);
  }

  draw(ctx, [centerX, centerY] = []) {
    const drawingPosition = [centerX, centerY - (this.rect.height/2)];
    super.draw(ctx, drawingPosition);
    if (!this.attachments) return;
    for (const attachment of Object.values(this.attachments)) {
      if(!attachment) continue;
      attachment.draw(ctx, drawingPosition);
    }
  }

  update() {
    const velocity = magnitude(...this.velocity);
    this.frame[0][0] = velocity > 0 ? Math.floor(((this.animationFrame + velocity) / 10)) % 8 : 0;
    this.frame[0][1] = this.direction;
    this.animationFrame = this.animationFrame + 1;
  }

  move(dirX, dirY) {

    this.velocity[0] = dirX * this.speed;
    this.velocity[1] = dirY * this.speed;

    if(Math.abs(dirX) > Math.abs(dirY)) {
      if(dirX > 0) {
        this.direction = DIRECTIONS.RIGHT;
      } else if(dirX < 0) {
        this.direction = DIRECTIONS.LEFT;
      }
    } else {
      if(dirY > 0) {
        this.direction = DIRECTIONS.DOWN;
      } else if(dirY < 0) {
        this.direction = DIRECTIONS.UP;
      }
    }

    this.rect.x += this.velocity[0];
    this.rect.y += this.velocity[1];
  }

  get position() {
    return [this.rect.x, this.rect.y];
  }

  set position(position) {
    this.rect.x = position[0];
    this.rect.y = position[1];
  }
}

export default Character;