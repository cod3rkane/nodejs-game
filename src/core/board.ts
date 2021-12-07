import { MAX_COLUMNS } from '../utils';
import { Item, ItemType } from '../components';

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

export default createBoard;
