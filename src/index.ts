import * as systems from './systems/render';
import * as core from './core';
import './style.css';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameState: core.GameState;

function createCanvas() {
  const el = document.getElementById('canvas') as HTMLCanvasElement;

  el.width = window.innerWidth;
  el.height = window.innerHeight;

  return el;
}

// Main Game Loop
function main(timestamp: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  systems.renderGrid(ctx, gameState);
  systems.render(ctx, gameState);

  window.requestAnimationFrame(main);
}

function init() {
  canvas = createCanvas();

  document.body.appendChild(canvas);

  ctx = canvas.getContext('2d');
  gameState = core.initialGameState(canvas.width, canvas.height);

  window.requestAnimationFrame(main);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameState.windowWidth = window.innerWidth;
  gameState.windowHeight = window.innerHeight;
}

window.addEventListener('load', init, false);
window.addEventListener('resize', resizeCanvas, false);
