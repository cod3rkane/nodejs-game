import * as O from 'fp-ts/Option';
import * as t from 'io-ts';
import { optionFromNullable } from 'io-ts-types';

import { Vec2Type, ItemType } from '../components';
import { INITIAL_STATE, StateType } from '../components/state';
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
  animationState: optionFromNullable(StateType),
});

export type GameState = t.TypeOf<typeof GameStateType>;

export function initialGameState(
  windowWidth: number,
  windowHeight: number
): GameState {
  return {
    score: 0,
    windowWidth,
    windowHeight,
    mousePos: { x: 0, y: 0 },
    hasTouchEnd: false,
    items: createBoard(0, 2, windowWidth, windowHeight),
    selectedItems: [],
    gridItems: createGridItems(windowWidth, windowHeight),
    animationState: O.some({ type: INITIAL_STATE }),
  };
}
