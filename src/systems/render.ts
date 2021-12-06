import { GameState } from '../core';
import { tiles } from '../components';

const MAX_COLUMNS = 9 as const;
const SCALE_NUMBER = 1.04 as const;

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
    tiles[15].image,
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
  const tileWidth = (gameState.windowWidth / MAX_COLUMNS) * 1.1;
  const tileHeight = (gameState.windowHeight / 2 / MAX_COLUMNS) * 1.1;

  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, gameState.windowWidth, gameState.windowHeight / 2);

  ctx.drawImage(
    tiles[12].image,
    65,
    860,
    tileWidth,
    tileHeight * 1.2,
  );
}

export default render;
