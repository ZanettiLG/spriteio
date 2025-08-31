import { Rect } from "../geometry";
import { Sprite } from "../renderer";
import { loadTexture } from "../loader";

export default class TileMap extends Sprite {
  constructor (texture, tilemap, cellSize = 32) {
    super(texture);
    this.tilemap = tilemap;
    this.cellSize = cellSize;
    // Criar um mapeamento de índices para retângulos de textura
    this.tileRects = new Map();
    
    // Calcular quantos tiles cabem na textura horizontalmente
    const tilesPerRow = Math.floor(texture.width / tilemap.cellSize);
    
    // Criar retângulos para cada tile na textura
    for (let i = 0; i < tilesPerRow; i++) {
      for (let j = 0; j < Math.floor(texture.height / tilemap.cellSize); j++) {
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
        // Obter o retângulo da textura para este tile
        const sourceRect = this.tileRects.get(tileId);
        if (!sourceRect) {
          throw new Error(`Tile ID ${tileId} não encontrado na textura`);
        }
        const destX = offsetX + (x * this.cellSize);
        const destY = offsetY + (y * this.cellSize);
        
        // Desenhar o tile
        ctx.drawImage(
          this.texture,
          ...sourceRect,
          destX, destY, this.cellSize, this.cellSize
        );
      }
    }
  }
}

export async function loadMap(path) {
  const response = await fetch(path);
  const data = await response.json();
  const texture = await loadTexture(data.texture);
  return new TileMap(texture, data);
}