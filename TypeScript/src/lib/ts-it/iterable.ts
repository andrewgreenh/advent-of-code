export function iterable<T>(generator: () => IterableIterator<T>): Iterable<T> {
  return {
    [Symbol.iterator]() {
      return generator();
    },
  };
}
