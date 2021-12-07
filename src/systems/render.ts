import { GameState } from '../core';
import { tiles } from '../components';
import { MAX_COLUMNS, SCALE_NUMBER } from '../utils';

// Removes the 2 extras columns and rows.
const GRID_SIZE = MAX_COLUMNS - 2;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  let internalRadius = radius;

  if (width < 2 * radius) internalRadius = width / 2;
  if (height < 2 * radius) internalRadius = height / 2;

  ctx.beginPath();
  ctx.moveTo(x + internalRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, internalRadius);
  ctx.arcTo(x + width, y + height, x, y + height, internalRadius);
  ctx.arcTo(x, y + height, x, y, internalRadius);
  ctx.arcTo(x, y, x + width, y, internalRadius);
  ctx.closePath();
  ctx.fill();
}

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
) {
  const windowHeight: number = gameState.windowHeight / 2;
  const tileWidth = (gameState.windowWidth / MAX_COLUMNS) * 1.1;
  const tileHeight = (gameState.windowHeight / 2 / MAX_COLUMNS) * 1.1;
  const marginTop = (SCALE_NUMBER * tileHeight) / 2;
  const marginLeft = (SCALE_NUMBER * tileWidth) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    tiles[4].image,
    0,
    gameState.windowHeight - windowHeight,
    gameState.windowWidth,
    windowHeight,
  );

  for (let y = 0; y < MAX_COLUMNS; y += 1) {
    for (let x = 0; x < MAX_COLUMNS; x += 1) {
      const index = x + y * MAX_COLUMNS;
      ctx.fillStyle = index % 2 ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.4)';
      roundRect(
        ctx,
        SCALE_NUMBER * x * tileWidth - marginLeft,
        SCALE_NUMBER * y * tileHeight + windowHeight - marginTop,
        tileWidth,
        tileHeight,
        12,
      );
    }
  }
}

export function render(ctx: CanvasRenderingContext2D, gameState: GameState) {
  const windowHeight: number = gameState.windowHeight / 2;
  const tileWidth = (gameState.windowWidth / MAX_COLUMNS) * 1.1;
  const tileHeight = (gameState.windowHeight / 2 / MAX_COLUMNS) * 1.1;
  const marginTop = (SCALE_NUMBER * tileHeight) / 2;
  const marginLeft = (SCALE_NUMBER * tileWidth) / 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, gameState.windowWidth, gameState.windowHeight / 2);

  for (let i = 0; i < GRID_SIZE; i += 1) {
    for (let j = 0; j < GRID_SIZE; j += 1) {
      const item = gameState.items[i][j];

      if (item.useAlpha) {
        ctx.globalAlpha = 0.4;
      }

      ctx.drawImage(
        tiles[item.id].image,
        SCALE_NUMBER * j * tileWidth - marginLeft + SCALE_NUMBER * tileWidth,
        SCALE_NUMBER * i * tileHeight
          + windowHeight
          - marginTop
          + SCALE_NUMBER * tileHeight,
        tileWidth,
        tileHeight,
      );

      if (item.useAlpha) {
        ctx.globalAlpha = 1.0;
      }
    }
  }
}

export default render;
