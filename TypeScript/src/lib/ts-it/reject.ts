export function reject<T>(iteratee: (value: T) => boolean | undefined) {
  return function* rejected(iter: Iterable<T>) {
    for (const item of iter) if (!iteratee(item)) yield item
  }
}
