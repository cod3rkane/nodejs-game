import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/Array';

import { GameState } from '../core';
import {
  CLEANING_FROM_BOARD_ITEM_STATE,
  INITIAL_ITEM_STATE,
  Item,
  ItemType,
} from '../components/item';
import { CLEAN_SELECTED_ITEMS_STATE } from '../components/state';
import { useGridHelper } from '../utils';
import { distance, Vec2 } from '../components';

export function selectionItem(gameState: GameState, deltatime: number): void {
  const { tileWidth } = useGridHelper(
    gameState.windowWidth,
    gameState.windowHeight
  );
  const itemBoundRadius = tileWidth * 0.44;
  const mouseBoundRadius = 30 as const;
  const isBoundOverlappingWithMouse = (target: Vec2): boolean => {
    const dist = distance(gameState.mousePos, target);
    const rSum = mouseBoundRadius + itemBoundRadius;

    return dist < rSum;
  };

  if (!gameState.hasTouchEnd) {
    const hasLastItem = pipe(gameState.selectedItems, A.last);

    if (O.isSome(hasLastItem)) {
      // we can select adjacents from the last selected item and the same type
      const lastSelectedItem: Item = hasLastItem.value;
      const adjacents: Item[] = [];

      // creates the adjacent list
      for (let dx = -1; dx <= 1; dx += 1) {
        for (let dy = -1; dy <= 1; dy += 1) {
          if (dx !== 0 || dy !== 0) {
            const row = lastSelectedItem.gridPos.x + dx;
            const column = lastSelectedItem.gridPos.y + dy;

            const item = pipe(
              gameState.items,
              A.flatten,
              A.findFirst((e) => e.gridPos.x === row && e.gridPos.y === column),
              O.fold(
                () => O.none,
                (e: Item) => {
                  if (e.id === lastSelectedItem.id) {
                    return O.some(e);
                  }

                  return O.none;
                }
              )
            );

            if (O.isSome(item)) {
              adjacents.push(item.value);
            }
          }
        }
      }

      const cleanAdjacents = pipe(
        adjacents,
        A.filter((e) => !e.isSelected)
      );
      const hasItem = pipe(
        cleanAdjacents,
        A.findFirst((item: Item) => isBoundOverlappingWithMouse(item.pos))
      );

      if (O.isSome(hasItem)) {
        const item = hasItem.value;
        item.isSelected = true;
        gameState.selectedItems.push(item);
      } else if (gameState.selectedItems.length > 1) {
        // @TODO: there's a bug in the code below until line 130
        // start undo last selected items
        const hasLastButOneSelectedItem = pipe(
          gameState.selectedItems,
          A.lookup(gameState.selectedItems.length - 2)
        );

        if (
          O.isSome(hasLastButOneSelectedItem) &&
          isBoundOverlappingWithMouse(hasLastButOneSelectedItem.value.pos)
        ) {
          // undo last selected item
          const removedItem = pipe(
            gameState.selectedItems,
            A.last,
            O.getOrElse(() =>
              ItemType.encode({
                id: 0,
                score: 0,
                isSelected: false,
                useAlpha: false,
                gridPos: {
                  x: 0,
                  y: 0,
                },
                pos: {
                  x: 0,
                  y: 0,
                },
                state: INITIAL_ITEM_STATE,
              })
            )
          );
          gameState.selectedItems.pop();

          const hasItem: O.Option<Item> = pipe(
            gameState.items,
            A.lookup(removedItem.gridPos.x),
            O.getOrElse(() => []),
            A.lookup(removedItem.gridPos.y)
          );

          if (O.isSome(hasItem)) {
            gameState.items[removedItem.gridPos.x][
              removedItem.gridPos.y
            ].isSelected = false;
          }
        }
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
            item.state = CLEANING_FROM_BOARD_ITEM_STATE;
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
