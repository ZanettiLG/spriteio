import { Rect } from "../geometry";
import { Sprite, Texture } from "../renderer";
import { AssetManager } from "../asset";

export default class TileMap extends Sprite {
  
  constructor (texture, tilemap, cellSize = 32) {
    super(texture, {zIndex: -100});
    this.tilemap = tilemap;
    this.cellSize = cellSize;
    // Criar um mapeamento de índices para retângulos de textura
    this.tileRects = new Map();

    const resource = texture.resource;
    
    // Calcular quantos tiles cabem na textura horizontalmente
    const tilesPerRow = Math.floor(resource.width / tilemap.cellSize);
    
    // Criar retângulos para cada tile na textura
    for (let i = 0; i < tilesPerRow; i++) {
      for (let j = 0; j < Math.floor(resource.height / tilemap.cellSize); j++) {
        const tileIndex = j * tilesPerRow + i;
        this.tileRects.set(tileIndex, new Rect(
          (i * tilemap.cellSize) + 1,
          (j * tilemap.cellSize) + 1,
          tilemap.cellSize - 1,
          tilemap.cellSize - 1
        ));
      }
    }
  }

  draw (ctx, center) {
    const [centerX, centerY] = center;
    const size = this.tilemap.cellSize;
    
    const mapWidth = this.tilemap.width * size;
    const mapHeight = this.tilemap.height * size;
    const offsetX = centerX - mapWidth;
    const offsetY = centerY - mapHeight;
    
    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        const tileIndex = y * this.tilemap.width + x;
        const tileId = this.tilemap.tiles[tileIndex];

        const sourceRect = this.tileRects.get(tileId);

        if (!sourceRect) {
          throw new Error(`Tile ID ${tileId} não encontrado na textura`);
        }

        const targetRect = [
          offsetX + (x * this.cellSize),
          offsetY + (y * this.cellSize),
          this.cellSize,
          this.cellSize,
        ]
        
        ctx.drawImage(
          this.texture.resource,
          ...sourceRect.flat(),
          ...targetRect,
        );
      }
    }
  }
}

export async function loadMap(path) {
  const response = await fetch(path);
  const data = await response.json();
  console.log(data.texture);
  const texture = AssetManager.load(data.texture, Texture);
  await texture.load();
  return new TileMap(texture, data);
}