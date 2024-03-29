import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

import * as systems from '../systems';
import * as core from '../core';

export class Application {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameState: core.GameState;
  lastTime: number;

  init() {
    this.canvas = this.createCanvas();

    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.gameState = core.initialGameState(
      this.canvas.width,
      this.canvas.height
    );

    console.log(this.gameState.items);
    console.log(this.gameState.gridItems);

    this.canvas.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
    this.lastTime = new Date().getTime();

    window.requestAnimationFrame(this.animateFrame.bind(this));
  }

  main() {
    const deltatime = (new Date().getTime() - this.lastTime) / 1000; // time elapsed in seconds since last call
    this.lastTime = new Date().getTime(); // reset last time

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    systems.selectionItem(this.gameState, deltatime);
    systems.renderGrid(this.ctx, this.gameState);
    systems.render(this.ctx, this.gameState, deltatime);
    systems.animation(this.ctx, this.gameState, deltatime);
    systems.ui(this.ctx, this.gameState, deltatime);
  }

  animateFrame() {
    setTimeout(() => {
      this.main();
      window.requestAnimationFrame(this.animateFrame.bind(this));
    }, 1000 / 60);
  }

  createCanvas(): HTMLCanvasElement {
    const el = document.getElementById('canvas') as HTMLCanvasElement;

    el.width = window.innerWidth;
    el.height = window.innerHeight;

    return el;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gameState.windowWidth = window.innerWidth;
    this.gameState.windowHeight = window.innerHeight;
  }

  handleTouch(e: TouchEvent) {
    e.preventDefault();
    e.stopPropagation();

    pipe(
      O.fromNullable(e.touches.item(0)),
      O.fold(
        () => null,
        (touch: Touch) => {
          this.gameState.mousePos = {
            x: touch.clientX,
            y: touch.clientY,
          };
        }
      )
    );
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    e.stopPropagation();

    pipe(
      O.fromNullable(e.touches.item(0)),
      O.fold(
        () => null,
        (touch: Touch) => {
          this.gameState.mousePos = {
            x: touch.clientX,
            y: touch.clientY,
          };
        }
      )
    );
  }

  handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.gameState.hasTouchEnd = true;
  }

  setUpEvents() {
    window.addEventListener('load', this.init.bind(this), false);

    window.addEventListener('resize', this.resizeCanvas.bind(this), false);
    window.addEventListener('touchstart', this.handleTouch.bind(this), false);
    window.addEventListener(
      'touchmove',
      this.handleTouchMove.bind(this),
      false
    );
    window.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    window.addEventListener(
      'touchcancel',
      this.handleTouchEnd.bind(this),
      false
    );

    window.addEventListener('unload', this.cleanEvents.bind(this), false);
  }

  cleanEvents() {
    window.removeEventListener('resize', this.resizeCanvas.bind(this), false);
    window.removeEventListener(
      'touchstart',
      this.handleTouch.bind(this),
      false
    );
    window.removeEventListener(
      'touchmove',
      this.handleTouchMove.bind(this),
      false
    );
    window.removeEventListener(
      'touchend',
      this.handleTouchEnd.bind(this),
      false
    );
    window.removeEventListener(
      'touchcancel',
      this.handleTouchEnd.bind(this),
      false
    );
  }
}

export default Application;
