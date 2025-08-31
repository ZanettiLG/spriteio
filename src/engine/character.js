import { magnitude } from "./maths";
import { Rect } from "./geometry";
import { SpriteSheet } from "./sprites";

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
  constructor({attachments: {body, ...attachments}, rect = new Rect(), speed = 1}) {
    super(body, rect);
    this.speed = speed;
    this.velocity = [0, 0];
    this.animationFrame = 0;
    this.direction = DIRECTIONS.DOWN;
    this.attachments = LOCAL_LIST.map((attachment) => attachments[attachment] || attachments[attachment.toLowerCase()] || []);
    console.log(this.attachments);
  }

  /**
   * 
   * @param {Attachment[]} attachment 
   */
  attach(attachment) {
    attachment.forEach((attachment) => {
      console.log(attachment);
      if(!this.attachments[attachment.local.toLowerCase()]) {
        this.attachments[attachment.local.toLowerCase()] = [];
      }
      this.attachments[attachment.local.toLowerCase()] = attachment;
    });
    this.attachments = this.attachments.concat(attachment);
  }

  update() {
    const velocity = magnitude(...this.velocity);
    this.frame = velocity > 0 ? Math.floor(((this.animationFrame + velocity) / 10)) % 8 : 0;
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

    this.rect[0] += this.velocity[0];
    this.rect[1] += this.velocity[1];
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