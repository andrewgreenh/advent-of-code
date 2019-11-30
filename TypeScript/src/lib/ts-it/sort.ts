const defaultSort = (a, b) => (a < b ? -1 : 1);

export function sort<T>(iteratee?: ((a: T, b: T) => number) | undefined) {
  return function* sorted(iter: Iterable<T>) {
    yield* [...iter].sort(iteratee || defaultSort);
  };
}
