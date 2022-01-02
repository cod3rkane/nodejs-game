import * as t from 'io-ts';

export const Vec2Type = t.type({
  x: t.number,
  y: t.number,
});

export type Vec2 = t.TypeOf<typeof Vec2Type>;

export function length(a: Vec2): number {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

export function distance(a: Vec2, b: Vec2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function squareDistance(a: Vec2, b: Vec2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  return dx * dx + dy * dy;
}

export default Vec2;
