export function scan<T>(
  scanner: (last: T, current: T) => T,
): (iter: Iterable<T>) => Iterable<T>;
export function scan<T, A>(
  scanr: (last: A, current: T) => A,
  initialValue: A,
): (iter: Iterable<T>) => Iterable<A>;

export function scan(scanner, initialValue?) {
  return function* (iter: Iterable<any>) {
    let last = initialValue;
    for (const value of iter) {
      if (last === undefined) {
        last = value;
        continue;
      }
      last = scanner(last, value);
      yield last;
    }
  };
}
