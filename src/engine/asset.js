export const ASSET_STATUS = Object.freeze({
  ERROR: -1,
  LOADED: 2,
  LOADING: 1,
  UNLOADED: 0,
});

export class Asset {
  #error;
  #source;
  #status;
  #resource;
  
  constructor(source) {
    this.#error = null;
    this.#resource = null;
    this.#source = source;
    this.#status = ASSET_STATUS.UNLOADED;
  }

  async load() {
    this.#status = ASSET_STATUS.LOADING;
    try {
      this.#resource = await fetch(this.#source).then((response) => {
        return response.json();
      });
      this.#status = ASSET_STATUS.LOADED;
    } catch (error) {
      this.#status = ASSET_STATUS.ERROR;
      this.#error = error;
      console.error(error);
    }
    return this.#status;
  }

  /**
   * @returns {Error}
   */
  get error() {
    return this.#error;
  }

  /**
   * @returns {any}
   */
  get resource() {
    return this.#resource;
  }

  /**
   * @returns {string}
   */
  get source() {
    return this.#source;
  }

  get status() {
    return this.#status;
  }
  
  /**
   * @param {any} resource 
   */
  set resource(resource) {
    this.#resource = resource;
  }

  /**
   * @param {ASSET_STATUS} status 
   */
  set status(status) {
    this.#status = status;
  }

}

/**
 * @typedef {Object} AssetManagerOptions
 * @property {string} resource
 * @property {Class} assetClass
 */

export class AssetManager {
  static assets = new Map();

  static load(resource, assetClass) {
    if (this.assets.has(resource)) {
      return this.assets.get(resource);
    }
    const asset = new assetClass(resource);
    //asset.load();
    this.assets.set(resource, asset);
    return asset;
  }
}