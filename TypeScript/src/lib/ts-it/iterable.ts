import { iter } from './iter';

export function iterable<T>(generator: () => Iterable<T>): Iterable<T> {
  return {
    [Symbol.iterator]() {
      return iter(generator());
    },
  };
}
