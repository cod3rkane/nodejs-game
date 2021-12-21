import { pipe } from 'fp-ts/lib/function';
import { last } from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';

import { GameState } from '../core';
import { Item, ItemType } from '../components/item';

export function selectionItem(gameState: GameState): GameState {
  const newGameState = { ...gameState };

  if (!newGameState.hasTouchEnd) {
    const gridItem = gameState.gridItems.find(
      (e) =>
        gameState.mousePos.x >= e.pos.x &&
        gameState.mousePos.x <= e.maxPos.x &&
        gameState.mousePos.y >= e.pos.y &&
        gameState.mousePos.y <= e.maxPos.y
    );

    if (gridItem) {
      if (gameState.selectedItems.length === 0) {
        // first move with no selected items whatsoever.
        const item = gameState.items[gridItem.gridPos.x][gridItem.gridPos.y];
        item.isSelected = true;
        newGameState.items = gameState.items.map((row) =>
          row.map((e: Item) => ({
            ...e,
            useAlpha: e.id !== item.id,
            isSelected:
              e.gridPos.x === gridItem.gridPos.x &&
              e.gridPos.y === gridItem.gridPos.y,
          }))
        );
        newGameState.selectedItems.push(item);
      } else {
        // we can only select the adjacents from the last selected item and the same type.
        const lastSelectedItem: Item = pipe(
          gameState.selectedItems,
          last,
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
            })
          )
        );
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

        const item = adjacents.find(
          (e: Item) =>
            gridItem.gridPos.x === e.gridPos.x &&
            gridItem.gridPos.y === e.gridPos.y
        );

        if (
          item &&
          !newGameState.selectedItems.find(
            (e) =>
              e.gridPos.x === item.gridPos.x && e.gridPos.y === item.gridPos.y
          )
        ) {
          item.isSelected = true;
          newGameState.selectedItems.push(item);
          newGameState.items[item.gridPos.x][item.gridPos.y] = item;
        } else if (newGameState.selectedItems.length >= 2) {
          // we're at a grid we already have selected.
          // let's verify if the user wants to go back and re-do the track.

          // console.log(newGameState.selectedItems);

          // Gets the last but one.
          const lastSelectedGrid =
            newGameState.selectedItems[newGameState.selectedItems.length - 2];

          if (
            lastSelectedGrid.gridPos.x === gridItem.gridPos.x &&
            lastSelectedGrid.gridPos.y === gridItem.gridPos.y
          ) {
            const removedItem: Item = pipe(
              newGameState.selectedItems,
              last,
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
                })
              )
            );
            newGameState.items[removedItem.gridPos.x][
              removedItem.gridPos.y
            ].isSelected = false;
          }
        }
      }
    }
  }

  if (gameState.hasTouchEnd) {
    newGameState.items = gameState.items.map((row) =>
      row.map((e: Item) => ({
        ...e,
        useAlpha: false,
        isSelected: false,
      }))
    );

    newGameState.mousePos = { x: 0, y: 0 };
    newGameState.selectedItems = [];
    newGameState.hasTouchEnd = false;
  }

  return newGameState;
}

export default selectionItem;
