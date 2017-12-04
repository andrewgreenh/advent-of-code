export function filter<T>(iteratee: (value: T) => boolean) {
  return function* filtered(iter: Iterable<T>) {
    for (const item of iter) if (iteratee(item)) yield item;
  };
}
