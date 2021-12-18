import { GameState } from "../core";

export function ui(ctx: CanvasRenderingContext2D, gameState: GameState) {
  const xOffset = gameState.windowWidth / 4;
  const yOffset = gameState.windowHeight / 4;
  ctx.font = '68px comic-sans';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score UI HERE', xOffset, yOffset);
  // ctx.beginPath();
  // ctx.moveTo(0, 0);
  // ctx.arcTo(102, 0, 102, 100 , 20);
  // ctx.arcTo(102, 102, 109, 200, 20);
  // ctx.lineTo(0, 105);
  // ctx.arcTo(x + width, y, x + width, y + height, internalRadius);
  // ctx.arcTo(x + width, y + height, x, y + height, internalRadius);
  // ctx.arcTo(x, y + height, x, y, internalRadius);
  // ctx.arcTo(x, y, x + width, y, internalRadius);
  // ctx.closePath();
  // ctx.fill();
}
