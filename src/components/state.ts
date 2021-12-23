import * as t from 'io-ts';

export const CLEAN_SELECTED_ITEMS_STATE = 'CLEAN_SELECTED_ITEMS' as const;
export const INITIAL_STATE = 'INITIAL_STATE' as const;

export const StateType = t.type({
  type: t.union([
    t.literal(CLEAN_SELECTED_ITEMS_STATE),
    t.literal(INITIAL_STATE),
  ]),
});

export type State = t.TypeOf<typeof StateType>;
