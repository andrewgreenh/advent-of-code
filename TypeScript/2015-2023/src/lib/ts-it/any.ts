export function any<T>(iteratee: (value: T) => boolean | undefined) {
  return function hasAny(iterable: Iterable<T>) {
    for (let value of iterable) if (iteratee(value)) return true;
    return false;
  };
}
