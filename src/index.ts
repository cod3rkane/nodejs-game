import * as systems from './systems/render';
import './style.css';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

function createCanvas() {
  const el = document.createElement('canvas');

  el.setAttribute('id', 'canvas');
  el.width = window.innerWidth;
  el.height = window.innerHeight;

  return el;
}

let x = 100;

// Main Game Loop
function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // @TODO: game logic here
  ctx.fillStyle = 'green';

  x += Math.random() * 5;

  ctx.fillRect(x, 100, 100, 100);

  systems.render();

  window.requestAnimationFrame(main);
}

function init() {
  canvas = createCanvas();

  document.body.appendChild(canvas);

  ctx = canvas.getContext('2d');

  window.requestAnimationFrame(main);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('load', init, false);
window.addEventListener('resize', resizeCanvas, false);
