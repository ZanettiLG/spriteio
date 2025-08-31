import characters from './characters.json';
import clothes from './clothes.json';
import head from './head.json';
import face from './face.json';

export const spriteList = [
  ...characters,
  ...clothes,
  ...head,
  ...face,
];

export const spriteTypes = spriteList.reduce((acc, sprite) => {
  if (!acc[sprite.type]) {
    acc[sprite.type] = [];
  }
  acc[sprite.type].push(sprite);
  return acc;
}, {});

const spriteMap = spriteList.reduce((acc, sprite) => {
  acc[sprite.name] = sprite;
  return acc;
}, {});

export default spriteMap;