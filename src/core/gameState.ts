import * as t from 'io-ts';

export const GameStateType = t.type({
  score: t.number,
  windowWidth: t.number,
  windowHeight: t.number,
});

export type GameState = t.TypeOf<typeof GameStateType>;

export function initialGameState(windowWidth: number, windowHeight: number): GameState {
  return {
    score: 0,
    windowWidth,
    windowHeight,
  };
}
