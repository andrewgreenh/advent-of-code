export function find<T>(iteratee: (value: T) => boolean | undefined) {
  return function findIn(iterable: Iterable<T>) {
    for (const item of iterable) {
      const found = iteratee(item);
      if (found) return item;
    }
    return undefined;
  };
}

export function findOrFail<T>(iteratee: (value: T) => boolean | undefined) {
  return function findIn(iterable: Iterable<T>) {
    for (const item of iterable) {
      const found = iteratee(item);
      if (found) return item;
    }
    throw new Error('Element not found');
  };
}
