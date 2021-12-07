import * as t from 'io-ts';

export const Vec2Type = t.type({
  x: t.number,
  y: t.number,
});

export type Vec2 = t.TypeOf<typeof Vec2Type>;

export default Vec2;
