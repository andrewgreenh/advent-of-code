export function reduce<T>(
  reducer: (last: T, current: T) => T,
): (iter: Iterable<T>) => T;
export function reduce<T, A>(
  reducer: (last: A, current: T) => A,
  initialValue: A,
): (iter: Iterable<T>) => A;

export function reduce(reducer, initialValue?) {
  return function (iter: Iterable<any>) {
    let last = initialValue;
    for (const value of iter) {
      if (last === undefined) {
        last = value;
        continue;
      }
      last = reducer(last, value);
    }
    return last;
  };
}
