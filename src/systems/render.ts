import { GameState } from '../core';
import { tiles } from '../components';
import { MAX_COLUMNS, SCALE_NUMBER, useGridHelper } from '../utils';

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
  const {
    halfWindowHeight, tileWidth, tileHeight, marginTop, marginLeft,
  } = useGridHelper(gameState.windowWidth, gameState.windowHeight);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    tiles[4].image,
    0,
    gameState.windowHeight - halfWindowHeight,
    gameState.windowWidth,
    halfWindowHeight,
  );

  for (let x = 0; x < MAX_COLUMNS; x += 1) {
    for (let y = 0; y < MAX_COLUMNS; y += 1) {
      const index = y + x * MAX_COLUMNS;
      ctx.fillStyle = index % 2 ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.4)';
      roundRect(
        ctx,
        SCALE_NUMBER * x * tileWidth - marginLeft,
        SCALE_NUMBER * y * tileHeight + halfWindowHeight - marginTop,
        tileWidth,
        tileHeight,
        12,
      );
    }
  }
}

export function render(ctx: CanvasRenderingContext2D, gameState: GameState) {
  const {
    halfWindowHeight, tileWidth, tileHeight, marginTop, marginLeft,
  } = useGridHelper(gameState.windowWidth, gameState.windowHeight);

  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, gameState.windowWidth, gameState.windowHeight / 2);

  for (let i = 0; i < GRID_SIZE; i += 1) {
    for (let j = 0; j < GRID_SIZE; j += 1) {
      const item = gameState.items[i][j];
      const x = SCALE_NUMBER * i * tileWidth - marginLeft + SCALE_NUMBER * tileWidth;
      const y = SCALE_NUMBER * j * tileHeight
        + halfWindowHeight
        - marginTop
        + SCALE_NUMBER * tileHeight;

      if (item.useAlpha) {
        ctx.globalAlpha = 0.6;
      }

      if (item.isSelected) {
        ctx.shadowColor = '#FFF';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 60;
      }

      ctx.drawImage(tiles[item.id].image, x, y, tileWidth, tileHeight);

      if (false) {
        ctx.font = '48px comic-sans';
        ctx.fillStyle = '#fff';
        ctx.fillText(`(${item.gridPos.x}, ${item.gridPos.y})`, x, y + (tileHeight / 1.8));
      }

      if (item.isSelected) {
        ctx.shadowColor = '';
        ctx.shadowBlur = 0;
      }

      if (item.useAlpha) {
        ctx.globalAlpha = 1.0;
      }
    }
  }
}

export default render;
