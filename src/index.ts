import './style.css';

function main() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'canvas');
  canvas.setAttribute('width', '100%');
  canvas.setAttribute('height', '100%');

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, 100, 100);

  // Lodash, currently included via a script, is required for this line to work
  canvas.innerHTML = ['Hello', 'webpack'].join(' ');

  return canvas;
}

document.body.appendChild(main());
