/**
 * @typedef {[number, number]} Vector2
 */
export class Vector2 extends Array {
  constructor(x, y) {
    super(x, y);
  }
}

/**
 * @typedef {[Vector2, Vector2]} Rect
 */
export class Rect extends Array {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
    super(new Vector2(x, y), new Vector2(width, height));
  }

  get x() {
    return this[0][0];
  }

  get y() {
    return this[0][1];
  }

  get width() {
    return this[1][0];
  }

  get height() {
    return this[1][1];
  }

  set x(value) {
    this[0][0] = value;
  }

  set y(value) {
    this[0][1] = value;
  }

  set width(value) {
    this[1][0] = value;
  }

  set height(value) {
    this[1][1] = value;
  }
}
