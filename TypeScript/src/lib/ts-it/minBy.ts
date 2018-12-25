import { zip } from './zip';

export function minBy<T>(iteratee: (value: T) => number | number[]) {
  return function min(iter: Iterable<T>) {
    debugger;
    let min: number | number[] | null = null;
    let minValue: T | undefined = undefined;
    for (let value of iter) {
      let num = iteratee(value);
      if (min === null) {
        min = num;
        minValue = value;
        continue;
      }
      if (Array.isArray(num)) {
        for (const [x, y] of zip(num, min as number[])) {
          if (x > y) break;
          if (x < y) {
            min = num;
            minValue = value;
            break;
          }
        }
        continue;
      } else if (num < min) (min = num), (minValue = value);
    }
    return minValue;
  };
}
