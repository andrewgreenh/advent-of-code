import { iter } from './iter';
import { range } from './range';

export function drop<T>(count: number) {
  return function* remainingValues(iterable: Iterable<T>): Generator<T> {
    if (Array.isArray(iterable)) {
      for (let i = count; i < iterable.length; i++) {
        yield iterable[i];
      }
    } else {
      const iterator = iter(iterable);
      for (const i of range(0, count)) {
        const value = iterator.next();
      }
      yield* iterator;
    }
  };
}
