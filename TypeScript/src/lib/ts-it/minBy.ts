export function minBy<T>(iteratee: (value: T) => number) {
  return function min(iter: Iterable<T>) {
    let min = Infinity;
    let minValue: T | undefined = undefined;
    for (let value of iter) {
      let num = iteratee(value);
      if (num < min) (min = num), (minValue = value);
    }
    return minValue;
  };
}
