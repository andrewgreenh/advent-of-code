import { cross } from './cross';
import { range } from './range';

export function rectangle(
  fromX: number,
  toX: number,
  fromY: number,
  toY: number,
) {
  return {
    *[Symbol.iterator]() {
      yield* cross(range(fromX, toX), range(fromY, toY));
    },
  };
}
