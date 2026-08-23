export type Point = {
  x: number;
  y: number;
};

export function cubicBezierPoint(
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point
): Point {
  const oneMinusT = 1 - t;

  const x =
    oneMinusT ** 3 * p0.x +
    3 * oneMinusT ** 2 * t * p1.x +
    3 * oneMinusT * t ** 2 * p2.x +
    t ** 3 * p3.x;

  const y =
    oneMinusT ** 3 * p0.y +
    3 * oneMinusT ** 2 * t * p1.y +
    3 * oneMinusT * t ** 2 * p2.y +
    t ** 3 * p3.y;

  return {
    x,
    y,
  };
}

export function createCubicBezierPath(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point
) {
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
}