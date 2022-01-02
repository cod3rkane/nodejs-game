import * as t from 'io-ts';

import { Vec2Type } from './vec';

export const INITIAL_ITEM_STATE = 'INITIAL_ITEM_STATE' as const;
export const CLEANING_FROM_BOARD_ITEM_STATE =
  'CLEANING_FROM_BOARD_ITEM_STATE' as const;
export const DELETED_ITEM_STATE = 'DELETED_ITEM_STATE' as const;

export const ItemType = t.type({
  id: t.number,
  isSelected: t.boolean,
  gridPos: Vec2Type,
  useAlpha: t.boolean,
  score: t.number,
  pos: Vec2Type,
  state: t.union([
    t.literal(INITIAL_ITEM_STATE),
    t.literal(CLEANING_FROM_BOARD_ITEM_STATE),
    t.literal(DELETED_ITEM_STATE),
  ]),
});
export type Item = t.TypeOf<typeof ItemType>;

export const itemWithIndex = t.intersection([
  ItemType,
  t.type({
    index: t.number,
  }),
]);
export type ItemWithIndex = t.TypeOf<typeof itemWithIndex>;
