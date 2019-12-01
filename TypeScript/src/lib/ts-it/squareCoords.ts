import { cross } from './cross';
import { range } from './range';

export function squareOfSize(size: number, [x, y] = [0, 0]) {
  return {
    *[Symbol.iterator]() {
      yield* cross(range(x, size), range(y, size));
    },
  };
}

export function squareAround(
  [x, y]: number[],
  size = 3,
  includeCenter = false,
) {
  return {
    *[Symbol.iterator]() {
      if (size % 2 !== 1) throw new Error('size must be odd');
      const offset = (size - 1) / 2;
      for (const [xx, yy] of cross(
        range(x - offset, x + offset + 1),
        range(y - offset, y + offset + 1),
      )) {
        if (x === xx && y === yy && !includeCenter) continue;
        yield [xx, yy];
      }
    },
  };
}
