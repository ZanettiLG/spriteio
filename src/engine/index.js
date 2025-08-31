export * from "./maths";
export * from "./loader";
export * from "./sprites";
export * from "./geometry";
export * from "./renderer";
export * from "./coroutine";
export * as controllers from "./controllers";
export { default as Character, LOCAL, LOCAL_LIST, DIRECTIONS } from "./character";

import { nextFrame as nextFrameCoroutine } from "./coroutine";
import { Renderer } from "./renderer";
import { loadMap } from "./sprites";

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {number} width 
 * @param {number} height 
 * @param {string} backgroundColor 
 * @returns 
 */
function Engine({canvas, width, height}) {
  const renderer = new Renderer({canvas, width, height});

  const engine = {
    width,
    height,
    renderer,
    map: null,
    characters: [],
    controllers: [],
    onStop: null,
    onStart: null,
    onUpdate: null,
    isRunning: false,
  };

  engine.addController = function (controller) {
    console.log(controller);
    controller.canvas = canvas;
    controller.update = controller.update.bind(controller);
    engine.controllers.push(controller);
  }

  engine.addMap = async function (mapPath) {
    const map = await loadMap(mapPath);
    engine.renderer.addSprite(map);
    engine.map = map;
  }

  engine.addCharacter = function (character) {
    engine.characters.push(character);
    engine.renderer.addSprite(character);
  }

  function update() {
    engine.renderer.update();
    engine.controllers.forEach((controller) => controller.update());
    engine.onUpdate?.(engine);
  }

  engine.start = async function () {
    engine.isRunning = true;
    engine.onStart?.(engine);
    while (engine.isRunning) {
      update();
      await nextFrameCoroutine();
    }
    engine.onStop?.(engine);
    engine.isRunning = false;
  }

  engine.stop = function () {
    engine.isRunning = false;
  }

  return engine;
}

export default Engine;