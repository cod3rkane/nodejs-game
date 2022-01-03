import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';

import { GameState } from '../core';
import { CLEAN_SELECTED_ITEMS_STATE, INITIAL_STATE } from '../components/state';
import { getItemPosFromGridPos, useGridHelper } from '../utils';
import {
  DELETED_ITEM_STATE,
  distance,
  tiles,
  Vec2,
} from '../components';

export function animation(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  deltatime: number
) {
  const isCleanSelectedItemState = pipe(
    gameState.animationState,
    O.exists((state) => state.type === CLEAN_SELECTED_ITEMS_STATE)
  );

  if (isCleanSelectedItemState) {
    // start animation
    const items = pipe(
      gameState.items,
      A.chain(
        pipe(A.filter((e) => e.state === 'CLEANING_FROM_BOARD_ITEM_STATE'))
      )
    );
    const {
      tileWidth,
      tileHeight,
      halfWindowHeight,
      halfWindowWidth,
      marginLeft,
    } = useGridHelper(gameState.windowWidth, gameState.windowHeight);
    const dx = halfWindowWidth - (tileWidth - marginLeft);
    const dy = halfWindowHeight - tileHeight;
    const cleanAnimationTargetPos: Vec2 = {
      x: dx,
      y: dy,
    };

    const lerp = (v: Vec2, target: Vec2, t: number): Vec2 => {
      const vector: Vec2 = { ...v };
      vector.x = v.x + (target.x - v.x) * t;
      vector.y = v.y + (target.y - v.y) * t;

      return vector;
    };

    for (let item of items) {
      const { x, y } = getItemPosFromGridPos(
        item.gridPos,
        gameState.windowWidth,
        gameState.windowHeight
      );

      if (item.pos.x === 0 && item.pos.y === 0) {
        // first time
        item.pos = {
          x,
          y,
        };
      } else {
        item.pos = lerp(item.pos, cleanAnimationTargetPos, 2 * deltatime);
        ctx.drawImage(
          tiles[item.id].image,
          item.pos.x,
          item.pos.y,
          tileWidth,
          tileHeight
        );
      }

      const itemBoundRadius = tileWidth * 0.44;
      const targetBoundRadius = 30 as const;
      const dist = distance(cleanAnimationTargetPos, item.pos);
      const rSum = targetBoundRadius + itemBoundRadius;

      if (dist < rSum) {
        // is overlapping
        // gameState.items[item.gridPos.x].splice(item.gridPos.y, 1);
        item.state = DELETED_ITEM_STATE;
      }
    }

    gameState.items = pipe(
      gameState.items,
      A.map(pipe(A.filter((e) => e.state !== DELETED_ITEM_STATE)))
    );

    if (items.length === 0) {
      gameState.animationState = O.some({
        type: INITIAL_STATE,
      });
    }
  }
}

export default animation;
