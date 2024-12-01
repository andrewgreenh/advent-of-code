import { zip } from './zip';

export function sortBy<TItem>(iteratee: (a: TItem) => any | any[] = (a) => a) {
  return function* sorted(iter: Iterable<TItem>) {
    yield* [...iter].sort((a, b) => {
      const [valA, valB] = [iteratee(a), iteratee(b)];
      if (Array.isArray(valA) && Array.isArray(valB)) {
        for (const [x, y] of zip(valA, valB)) {
          if (x < y) return -1;
          if (x > y) return 1;
        }
        return 0;
      } else {
        return valA < valB ? -1 : 1;
      }
    });
  };
}
