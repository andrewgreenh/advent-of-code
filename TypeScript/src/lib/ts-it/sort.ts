export function sort<T>(iteratee?: ((value: T) => number) | undefined) {
  return function* sorted(iter: Iterable<T>) {
    yield* [...iter].sort(iteratee);
  };
}
