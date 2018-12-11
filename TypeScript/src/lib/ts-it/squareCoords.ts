import { range } from './range';

export function* squareOfSize(size: number, [x, y] = [0, 0]) {
  for (const xx of range(x, size)) {
    for (const yy of range(y, size)) {
      yield [xx, yy];
    }
  }
}

export function* squareAround([x, y], size) {
  if (size % 2 !== 1) throw new Error('size must be odd');
  const offset = (size - 1) / 2;
  for (const xx of range(x - offset, x + offset + 1)) {
    for (const yy of range(y - offset, y + offset + 1)) {
      yield [xx, yy];
    }
  }
}
