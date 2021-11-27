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

// Main Game Loop
function main() {
  // @TODO: game logic here
  ctx.fillStyle = 'green';
  ctx.fillRect(100, 100, 100, 100);

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
