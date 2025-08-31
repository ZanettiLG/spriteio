import { Character } from "./character";

export async function loadTexture(texturePath) {
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = texturePath;
  });
  return image;
}

export async function loadCharacter(characterPath, rect) {
  const response = await fetch(characterPath);
  const {texture: texturePath, attachments: attachmentsPath} = await response.json();
  console.log(texturePath, attachmentsPath);
  const texture = await loadTexture(texturePath);
  const attachments = Object.fromEntries(
    await Promise.all(
      Object.entries(attachmentsPath).map(async ([key, value]) => {
        return [key, await Promise.all(value.map(async (path) => {
          return await loadTexture(path);
        }))];
      })
    )
  );
  console.log(attachments);
  return new Character(texture, attachments, rect);
}

export default {
  loadTexture,
};