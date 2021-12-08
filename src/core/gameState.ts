import * as t from 'io-ts';

import { Vec2Type, ItemType } from '../components';
import { createBoard, createGridItems } from './board';
import { GridItemType } from './gridItem';

export const GameStateType = t.type({
  score: t.number,
  windowWidth: t.number,
  windowHeight: t.number,
  mousePos: Vec2Type,
  hasTouchEnd: t.boolean,
  items: t.array(t.array(ItemType)),
  selectedItems: t.array(ItemType),
  gridItems: t.array(GridItemType),
});

export type GameState = t.TypeOf<typeof GameStateType>;

export function initialGameState(
  windowWidth: number,
  windowHeight: number,
): GameState {
  return {
    score: 0,
    windowWidth,
    windowHeight,
    mousePos: { x: 0, y: 0 },
    hasTouchEnd: false,
    items: createBoard(0, 2),
    selectedItems: [],
    gridItems: createGridItems(windowWidth, windowHeight),
  };
}
