import { MAX_COLUMNS, SCALE_NUMBER, useGridHelper } from '../utils';
import { Item, ItemType } from '../components';
import { GridItem, GridItemType } from './gridItem';

// Removes the 2 extras columns and rows.
const GRID_SIZE = MAX_COLUMNS - 2;

export function generateRandomInteger(start: number, end: number) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function createBoard(start: number, end: number): Item[][] {
  const matrix = [];

  for (let i = 0; i < GRID_SIZE; i += 1) {
    matrix[i] = [];
  }

  // @TODO: This logic is wrong, we need to fix it.
  // we should render our items as Rows(X) and Columns(Y)
  for (let i = 0; i < GRID_SIZE; i += 1) {
    matrix[i][i] = ItemType.encode({
      id: generateRandomInteger(start, end),
      isSelected: false,
      useAlpha: false,
      gridPos: {
        x: i,
        y: i,
      },
    });

    for (let j = i + 1; j < GRID_SIZE; j += 1) {
      matrix[i][j] = ItemType.encode({
        id: generateRandomInteger(start, end),
        isSelected: false,
        useAlpha: false,
        gridPos: {
          x: i,
          y: j,
        },
      });
      matrix[j][i] = matrix[i][j];
    }
  }

  return matrix;
}

export function createGridItems(
  windowWidth: number,
  windowHeight: number,
): GridItem[] {
  const items: GridItem[] = [];
  const {
    halfWindowHeight, tileWidth, tileHeight, marginTop, marginLeft,
  } = useGridHelper(windowWidth, windowHeight);

  for (let i = 0; i < GRID_SIZE; i += 1) {
    for (let j = 0; j < GRID_SIZE; j += 1) {
      const x = SCALE_NUMBER * i * tileWidth - marginLeft + SCALE_NUMBER * tileWidth;
      const y = SCALE_NUMBER * j * tileHeight
        + halfWindowHeight
        - marginTop
        + SCALE_NUMBER * tileHeight;

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
        }),
      );
    }
  }

  return items;
}

export default createBoard;
