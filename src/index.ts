import './style.css';

let ctx: CanvasRenderingContext2D;

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'canvas');
  canvas.setAttribute('width', '100%');
  canvas.setAttribute('height', '100%');

  return canvas;
}

// Main Game Loop
function main() {
  window.requestAnimationFrame(main);

  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, 100, 100);
}

function init() {
  const canvas = createCanvas();
  ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);
  window.requestAnimationFrame(main);
}

window.onload = init;
