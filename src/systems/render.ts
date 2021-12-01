import { GameState } from '../core';

const MAX_COLUMNS = 9 as const;
const SPLIT_NUMBER = 1.04 as const;

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
  const tileHeight = ((gameState.windowHeight / 2) / MAX_COLUMNS) * 1.1;
  const marginTop = (SPLIT_NUMBER * tileHeight) / 2;
  const marginLeft = (SPLIT_NUMBER * tileWidth) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  for (let y = 0; y < MAX_COLUMNS; y += 1) {
    for (let x = 0; x < MAX_COLUMNS; x += 1) {
      // const index = x + y * MAX_COLUMNS;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
      roundRect(
        ctx,
        (SPLIT_NUMBER * x * tileWidth) - marginLeft,
        (SPLIT_NUMBER * y * tileHeight + windowHeight) - marginTop,
        tileWidth,
        tileHeight,
        6,
      );
    }
  }
}

export function render(ctx: CanvasRenderingContext2D, gameState: GameState) {
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, gameState.windowWidth, gameState.windowHeight / 2);
}

export default render;
