import * as t from 'io-ts';

import { Vec2Type } from './vec';

export const ItemType = t.type({
  id: t.number,
  isSelected: t.boolean,
  gridPos: Vec2Type,
  useAlpha: t.boolean,
});

export type Item = t.TypeOf<typeof ItemType>;
