export function magnitude (...[x, y]) {
  return Math.sqrt(x ** 2 + y ** 2)
}

export function distance ([xA, yA], [xB, yB]) {
  return magnitude(xA - xB, yA - yB);
}

export function normalize (...[x, y]) {
  const _magnitude = magnitude(x, y);
  return [
    x / _magnitude,
    y / _magnitude,
  ];
}

export default {
  magnitude,
}