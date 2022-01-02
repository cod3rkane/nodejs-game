import { pipe } from 'fp-ts/lib/function';
import { last } from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/Array';

import { GameState } from '../core';
import {
  CLEANING_FROM_BOARD_ITEM_STATE,
  INITIAL_ITEM_STATE,
  Item,
  ItemType,
} from '../components/item';
import { CLEAN_SELECTED_ITEMS_STATE, INITIAL_STATE } from '../components/state';
import { useGridHelper } from '../utils';
import { distance, length } from '../components';

export function selectionItem(gameState: GameState, deltatime: number): void {
  const { tileWidth } = useGridHelper(
    gameState.windowWidth,
    gameState.windowHeight
  );
  const itemBoundRadius = tileWidth * 0.44;
  const mouseBoundRadius = 30 as const;

  if (!gameState.hasTouchEnd) {
    const hasLastItem = pipe(gameState.selectedItems, A.last);

    if (O.isSome(hasLastItem)) {
      // we can select adjacents from the last selected item and the same type
      const lastSelectedItem: Item = hasLastItem.value;
      const adjacents: Item[] = [];

      // creates adjacents list
      for (let dx = -1; dx <= 1; dx += 1) {
        for (let dy = -1; dy <= 1; dy += 1) {
          if (dx !== 0 || dy !== 0) {
            const x = lastSelectedItem.gridPos.x + dx;
            const y = lastSelectedItem.gridPos.y + dy;

            try {
              const item = gameState.items[x][y] || null;

              if (item && item.id === lastSelectedItem.id) {
                adjacents.push(item);
              }
              // eslint-disable-next-line no-empty
            } catch (err) {}
          }
        }
      }

      const cleanAdjacents = pipe(
        adjacents,
        A.filter(e => !e.isSelected),
      );
      const hasItem = pipe(
        cleanAdjacents,
        A.findFirst((item: Item) => {
          const dist = distance(gameState.mousePos, item.pos);
          const rSum = mouseBoundRadius + itemBoundRadius;

          return dist < rSum;
        })
      );

      if (O.isSome(hasItem)) {
        const item = hasItem.value;
        item.isSelected = true;
        gameState.selectedItems.push(item);
      }
    } else {
      // first move
      const selectedItem = pipe(
        gameState.items.flat(),
        A.findFirst((item: Item) => {
          const dist = distance(gameState.mousePos, item.pos);
          const rSum = mouseBoundRadius + itemBoundRadius;

          return dist < rSum;
        })
      );

      if (O.isSome(selectedItem)) {
        const item = selectedItem.value;

        item.isSelected = true;
        gameState.selectedItems.push(item);

        pipe(
          gameState.items,
          A.chain(pipe(A.filter((e) => e.id !== item.id))),
          A.map((e) => (e.useAlpha = true))
        );
      }
    }
  } else {
    if (gameState.selectedItems.length > 2) {
      const points = pipe(
        gameState.selectedItems,
        A.reduce(0, (acc: number, cv: Item) => {
          return acc + cv.score;
        })
      );

      gameState.score += points;
      gameState.animationState = O.some({ type: CLEAN_SELECTED_ITEMS_STATE });

      for (let row of gameState.items) {
        for (let item of row) {
          if (item.isSelected) {
            item.state = CLEANING_FROM_BOARD_ITEM_STATE
          }
        }
      }
    }

    for (let row of gameState.items) {
      for (let item of row) {
        item.isSelected = false;
        item.useAlpha = false;
      }
    }

    gameState.selectedItems = [];
    gameState.mousePos = { x: 0, y: 0 };
    gameState.hasTouchEnd = false;
  }
}

export default selectionItem;
