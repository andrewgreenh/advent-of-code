export function every<T>(iteratee: (value: T) => boolean | undefined) {
  return function hasEvery(iterable: Iterable<T>) {
    for (let value of iterable) if (!iteratee(value)) return false;
    return true;
  };
}
