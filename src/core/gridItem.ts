import * as t from 'io-ts';

import { Vec2Type } from '../components';

export const GridItemType = t.type({
  gridPos: Vec2Type,
  pos: Vec2Type,
  maxPos: Vec2Type,
});

export type GridItem = t.TypeOf<typeof GridItemType>;

export default GridItem;
