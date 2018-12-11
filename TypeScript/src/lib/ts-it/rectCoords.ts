import { range } from './range';

export function* rectangle(fromX, toX, fromY, toY) {
  for (const x of range(fromX, toX)) {
    for (const y of range(fromY, toY)) {
      yield [x, y];
    }
  }
}
