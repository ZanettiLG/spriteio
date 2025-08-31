/**
 * 
 * @returns 
 */
export async function nextFrame() {
  return await new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

/**
 * 
 * @param {number} ms 
 * @returns 
 */
export async function delay(ms) {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 
 * @param {Iterable<any>} iterable 
 * @param {Function} callback 
 * @returns 
 */
export async function parallel(iterable, callback) {
  const promises = iterable.map(async (item) => await callback(item));
  return await Promise.all(promises);
}

/**
 * 
 * @param {() => boolean} condition 
 * @param {number} timeout - Timeout total em ms
 * @param {number} startDelay - Delay inicial em ms
 * @param {number} maxDelay - Delay máximo em ms (default: 5000)
 * @param {number} backoffMultiplier - Multiplicador para backoff (default: 1.5)
 * @returns 
 */
export async function wait(condition, timeout = 60000, startDelay = 100, maxDelay = 5000, backoffMultiplier = 1.5) {
  let delayMs = startDelay;
  while (true) {
    await delay(delayMs);
    if (condition()) {
      return;
    }
    if (timeout > 0 && timeout !== -1) {
      timeout -= delayMs;
      if (timeout <= 0) {
        throw new Error("Timeout");
      }
    }
    // Aplicar backoff exponencial
    delayMs = Math.min(delayMs * backoffMultiplier, maxDelay);
  }
}