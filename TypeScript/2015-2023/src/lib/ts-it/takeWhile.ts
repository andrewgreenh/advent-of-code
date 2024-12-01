export function takeWhile<T>(iteratee: (value: T) => boolean) {
  return function* takenElements(iter: Iterable<T>) {
    for (const item of iter) {
      const shouldBeTaken = iteratee(item);
      if (!shouldBeTaken) break;
      yield item;
    }
  };
}
