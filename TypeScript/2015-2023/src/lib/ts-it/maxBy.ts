import { zip } from './zip';

export function maxBy<T>(iteratee: (value: T) => number | number[]) {
  return function max(iter: Iterable<T>) {
    let max: number | number[] | null = null;
    let maxValue: T | undefined = undefined;
    for (let value of iter) {
      let num = iteratee(value);
      if (max === null) {
        max = num;
        maxValue = value;
        continue;
      }
      if (Array.isArray(num)) {
        for (const [x, y] of zip(num, max as number[])) {
          if (x < y) break;
          if (x > y) {
            max = num;
            maxValue = value;
            break;
          }
        }
        continue;
      }
      if (num > max) (max = num), (maxValue = value);
    }
    return maxValue;
  };
}
