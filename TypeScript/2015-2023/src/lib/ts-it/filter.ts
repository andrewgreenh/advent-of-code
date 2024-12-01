export function filter<T>(iteratee: (value: T) => boolean | undefined) {
  return function* filtered(iter: Iterable<T>) {
    for (const item of iter) if (iteratee(item)) yield item;
  };
}
