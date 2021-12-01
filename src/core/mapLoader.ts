import { tiles } from '../components';

export const MAP_01 = '0123321032112321230124462323997012397212320123123';
/**
  0123321
  0321123
  2123012
  4462323
  9970123
  9721232
  0123123
 */

export function getTileFromSeedByGridNumber(
  seed: number,
  grid: number,
  cb: (tile: HTMLImageElement) => void,
) {
  switch (seed) {
    case 0:
    default: {
      const tileNumber = Number(MAP_01[grid]);
      const tile = tiles.find((e) => e.id === tileNumber);
      cb(tile.image);
    }
  }
}

export default getTileFromSeedByGridNumber;
