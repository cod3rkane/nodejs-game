import { pipe } from 'fp-ts/function';
import { mapWithIndex } from 'fp-ts/Array';

import { MAX_COLUMNS, SCALE_NUMBER, useGridHelper } from '../utils';
import { Item, ItemType, tiles } from '../components';
import { GridItem, GridItemType } from './gridItem';

// Removes the 2 extras columns and rows.
const GRID_SIZE = MAX_COLUMNS - 2;

export function generateRandomInteger(start: number, end: number) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function createBoard(start: number, end: number): Item[][] {
  const matrix: Array<Array<Item>> = [];

  for (let i = 0; i < GRID_SIZE; i += 1) {
    matrix[i] = [];
  }

  // @TODO: This logic is wrong, we need to fix it.
  // we should render our items as Rows(X) and Columns(Y)
  for (let i = 0; i < GRID_SIZE; i += 1) {
    const firstId = generateRandomInteger(start, end);
    matrix[i][i] = ItemType.encode({
      id: firstId,
      score: tiles[firstId].score,
      isSelected: false,
      useAlpha: false,
      gridPos: {
        x: i,
        y: i,
      },
      pos: {
        x: 0,
        y: 0,
      },
    });

    for (let j = i + 1; j < GRID_SIZE; j += 1) {
      const secondId = generateRandomInteger(start, end);
      matrix[i][j] = ItemType.encode({
        id: secondId,
        score: tiles[secondId].score,
        isSelected: false,
        useAlpha: false,
        gridPos: {
          x: i,
          y: j,
        },
        pos: {
          x: 0,
          y: 0,
        },
      });
      matrix[j][i] = matrix[i][j];
    }
  }

  const fixGridPos =
    (row: number) =>
    (i: number, e: Item): Item => ({ ...e, gridPos: { x: row, y: i } });
  const goThroughItems = (i: number, e: Item[]) =>
    pipe(e, mapWithIndex(fixGridPos(i)));
  const formatMatrix = pipe(mapWithIndex(goThroughItems));

  return formatMatrix(matrix);
}

export function createGridItems(
  windowWidth: number,
  windowHeight: number
): GridItem[] {
  const items: GridItem[] = [];
  const { halfWindowHeight, tileWidth, tileHeight, marginTop, marginLeft } =
    useGridHelper(windowWidth, windowHeight);

  for (let i = 0; i < GRID_SIZE; i += 1) {
    for (let j = 0; j < GRID_SIZE; j += 1) {
      const x =
        SCALE_NUMBER * i * tileWidth - marginLeft + SCALE_NUMBER * tileWidth;
      const y =
        SCALE_NUMBER * j * tileHeight +
        halfWindowHeight -
        marginTop +
        SCALE_NUMBER * tileHeight;

      items.push(
        GridItemType.encode({
          gridPos: {
            x: i,
            y: j,
          },
          pos: {
            x,
            y,
          },
          maxPos: {
            x: x + tileWidth,
            y: y + tileHeight,
          },
        })
      );
    }
  }

  return items;
}

export default createBoard;
