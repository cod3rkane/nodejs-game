import * as t from 'io-ts';

import { Vec2Type, ItemType } from '../components';
import { createBoard } from './board';

export const GameStateType = t.type({
  score: t.number,
  windowWidth: t.number,
  windowHeight: t.number,
  mousePos: Vec2Type,
  items: t.array(t.array(ItemType)),
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
    items: createBoard(0, 2),
  };
}
