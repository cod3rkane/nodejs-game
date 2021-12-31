import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';

import { GameState } from '../core';
import { CLEAN_SELECTED_ITEMS_STATE, INITIAL_STATE } from '../components/state';
import { getItemPosFromGridPos, useGridHelper } from '../utils';
import { Item, itemWithIndex, ItemWithIndex, tiles, Vec2 } from '../components';

export function animation(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  deltatime: number
): GameState {
  const isCleanSelectedItemState = pipe(
    gameState.animationState,
    O.exists((state) => state.type === CLEAN_SELECTED_ITEMS_STATE)
  );
  const newGameState = { ...gameState };
  const newItems = [...gameState.items];

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

      if (
        item.pos.x >= cleanAnimationTargetPos.x - tileHeight &&
        item.pos.x <= cleanAnimationTargetPos.x + tileWidth * 2 &&
        item.pos.y >= cleanAnimationTargetPos.y - tileHeight &&
        item.pos.y <= cleanAnimationTargetPos.y + tileHeight * 2
      ) {
        if (item.isSelected) {
          newItems[item.gridPos.x].splice(item.gridPos.y, 1);
        }
      }
    }

    if (items.length === 0) {
      newGameState.animationState = O.some({
        type: INITIAL_STATE,
      });
    }
  }

  return {
    ...newGameState,
    items: newItems,
  };
}

export default animation;
