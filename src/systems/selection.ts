import { GameState } from '../core';

export function selectionItem(gameState: GameState): GameState {
  const newGameState = gameState;

  if (!gameState.hasTouchEnd) {
    // console.log({ gameState });
  }

  if (gameState.hasTouchEnd) {
    newGameState.hasTouchEnd = false;
  }

  return newGameState;
}

export default selectionItem;
