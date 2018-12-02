import { reduce } from './reduce';

export function sumBy<T>(iteratee: (item: T) => number) {
  return function sum(iter: Iterable<T>): number {
    return reduce((a: number, b: T) => {
      const number = Number(iteratee(b));
      if (Number.isNaN(number)) return a;
      return a + number;
    }, 0)(iter);
  };
}
