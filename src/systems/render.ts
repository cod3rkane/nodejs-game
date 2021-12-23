import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';

import { GameState } from '../core';
import { Item, ItemType, tiles, Vec2 } from '../components';
import { MAX_COLUMNS, SCALE_NUMBER, useGridHelper } from '../utils';
import { CLEAN_SELECTED_ITEMS_STATE, INITIAL_STATE } from '../components/state';
import { number } from 'fp-ts';

// Removes the 2 extras columns and rows.
const GRID_SIZE = MAX_COLUMNS - 2;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
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
  gameState: GameState
) {
  const { halfWindowHeight, tileWidth, tileHeight, marginTop, marginLeft } =
    useGridHelper(gameState.windowWidth, gameState.windowHeight);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    tiles[4].image,
    0,
    gameState.windowHeight - halfWindowHeight,
    gameState.windowWidth,
    halfWindowHeight
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
        12
      );
    }
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  delta: number
) {
  const {
    halfWindowHeight,
    halfWindowWidth,
    tileWidth,
    tileHeight,
    marginTop,
    marginLeft,
  } = useGridHelper(gameState.windowWidth, gameState.windowHeight);
  const isCleanSelectedItemsState = pipe(
    gameState.animationState,
    O.exists((state) => state.type === CLEAN_SELECTED_ITEMS_STATE)
  );

  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, gameState.windowWidth, gameState.windowHeight / 2);

  // @TODO: do we really need to loop this way? Why not just render all gameState.
  // items, so we make sure we won't gave ghost gameState.items[i][i] indexes,.
  // render grid items.
  for (let i = 0; i < GRID_SIZE; i += 1) {
    for (let j = 0; j < GRID_SIZE; j += 1) {
      const item = gameState.items[i][j];
      let x =
        SCALE_NUMBER * i * tileWidth - marginLeft + SCALE_NUMBER * tileWidth;
      let y =
        SCALE_NUMBER * j * tileHeight +
        halfWindowHeight -
        marginTop +
        SCALE_NUMBER * tileHeight;

      if (item.useAlpha) {
        if (!isCleanSelectedItemsState) {
          ctx.globalAlpha = 0.6;
        } else if (!item.isSelected) {
          // check if is CLEAN_SELECTED_ITEMS_STATE
          //  changes the opacity to b the same as overlay
          ctx.globalAlpha = 0.1;
        }
      }

      if (item.isSelected) {
        ctx.shadowColor = '#FFF';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 60;
      }

      if (item.isSelected && isCleanSelectedItemsState) {
        const dx = halfWindowWidth - (tileWidth - marginLeft);
        const dy = halfWindowHeight - tileHeight;
        const cleanAnimationTargetPos: Vec2 = {
          x: dx,
          y: dy,
        };
        if (
          item.pos.x >= cleanAnimationTargetPos.x &&
          item.pos.x <= (cleanAnimationTargetPos.x + tileWidth) &&
          item.pos.y >= cleanAnimationTargetPos.y &&
          item.pos.y <= (cleanAnimationTargetPos.y + tileHeight)
        ) {
          // ends animation and removes item from selectedItems
          // and clean pos
          // and remove from gameState.items
          const selectedItemsWithoutCurrent = pipe(
            gameState.selectedItems,
            A.filter((e: Item) => e.gridPos.x !== item.gridPos.x && e.gridPos.y !== item.gridPos.y)
          );
          console.log({ selectedItemsWithoutCurrent });
          gameState.selectedItems = selectedItemsWithoutCurrent;
          item.pos = { x: 0, y: 0 };
          item.isSelected = false;
          item.useAlpha = false;
          gameState.items[i][j] = item;
          ctx.globalAlpha = 1.0;
        } else {
          // starts animation
          const getDistance = (v: Vec2, target: Vec2): number => {
            const dx = target.x - v.x;
            const dy = target.y - v.y;

            return Math.sqrt(dx * dx + dy * dy);
          };
          const simpleDistance = (v: Vec2, target: Vec2): number => {
            const dx = Math.abs(target.x - v.x);
            const dy = Math.abs(target.y - v.y);

            return Math.min(dx, dy);
          };
          const lerp = (v: Vec2, target: Vec2, t: number): Vec2 => {
            const vector: Vec2 = { ...v };
            vector.x = v.x + (target.x - v.x) * t;
            vector.y = v.y + (target.y - v.y) * t;

            return vector;
          };
          const setDirection = (v: Vec2, angle: number, dist: number): Vec2 => {
            const vector = { ...v };
            vector.x = dist * Math.cos((angle / 360) * Math.PI * 2);
            vector.y = dist * Math.sin((angle / 360) * Math.PI * 2);

            return vector;
          };
          const angleInRadians = Math.atan2(
            cleanAnimationTargetPos.y - item.pos.y,
            cleanAnimationTargetPos.x - item.pos.x
          );
          const angleInDeg =
            (Math.atan2(
              cleanAnimationTargetPos.y - item.pos.y,
              cleanAnimationTargetPos.x - item.pos.x
            ) *
              180) /
            Math.PI;
          const distance = getDistance(item.pos, cleanAnimationTargetPos);

          if (item.pos.x === 0 && item.pos.y === 0) {
            // first time
            item.pos = {
              x,
              y,
            };
          } else {
            item.pos = lerp(item.pos, cleanAnimationTargetPos, 0.008);
            x = item.pos.x;
            y = item.pos.y;
            gameState.items[i][j] = item;
          }
        }
      }

      ctx.drawImage(tiles[item.id].image, x, y, tileWidth, tileHeight);

      if (false) {
        ctx.font = '48px comic-sans';
        ctx.fillStyle = '#fff';
        ctx.fillText(
          `(${item.gridPos.x}, ${item.gridPos.y})`,
          x,
          y + tileHeight / 1.8
        );
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

  // @TODO: Maybe this could be another system that takes care of the animation state.
  if (isCleanSelectedItemsState && gameState.selectedItems.length === 0) {
    gameState.animationState = O.some({ type: INITIAL_STATE });
    gameState.selectedItems = [];
  }
}

export default render;
