import * as t from 'io-ts';

export const MAX_COLUMNS = 9 as const;
export const SCALE_NUMBER = 1.04 as const;

export const GridHelperType = t.type({
  halfWindowHeight: t.number,
  halfWindowWidth: t.number,
  tileWidth: t.number,
  tileHeight: t.number,
  marginTop: t.number,
  marginLeft: t.number,
});

export type GridHelper = t.TypeOf<typeof GridHelperType>;

export function useGridHelper(
  windowWidth: number,
  windowHeight: number
): GridHelper {
  const halfWindowWidth: number = windowWidth / 2;
  const halfWindowHeight: number = windowHeight / 2;
  const tileWidth = (windowWidth / MAX_COLUMNS) * 1.1;
  const tileHeight = (windowHeight / 2 / MAX_COLUMNS) * 1.1;
  const marginTop = (SCALE_NUMBER * tileHeight) / 2;
  const marginLeft = (SCALE_NUMBER * tileWidth) / 2;

  return GridHelperType.encode({
    halfWindowWidth,
    halfWindowHeight,
    tileWidth,
    tileHeight,
    marginTop,
    marginLeft,
  });
}
